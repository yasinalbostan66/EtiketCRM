// --- Global Veri Yönetimi ---
const FIRMALAR_KEY = 'etiket_crm_firmalar';
const SIPARISLER_KEY = 'etiket_crm_siparisler';
const TAHSILATLAR_KEY = 'etiket_crm_tahsilatlar';

// Firmalar
function getFirmalar() {
    const items = localStorage.getItem(FIRMALAR_KEY);
    return items ? JSON.parse(items) : [];
}

function saveFirmalar(data) {
    localStorage.setItem(FIRMALAR_KEY, JSON.stringify(data));
    
    // Direct Cloud Backup on write triggers
    try {
        if (firebase.auth().currentUser) {
            data.forEach(item => {
                if (item.id) {
                    firebase.firestore().collection('firmalar').doc(item.id).set(item, { merge: true })
                       .then(() => { if (window.addDiagLog) window.addDiagLog(`[Bulut] Firma ${item.ad} Kaydedildi`); })
                       .catch(e => console.error("Firestore Save Fail:", e));
                }
            });
        }
    } catch (e) {
        console.error("Direct Sync Fail:", e);
    }
}

function addFirma(firma) {
    const firmalar = getFirmalar();
    firma.id = 'frm_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    firma.dateAdded = new Date().toISOString();
    firmalar.push(firma);
    saveFirmalar(firmalar);
    return firma;
}

function updateFirma(firma) {
    const firmalar = getFirmalar();
    const index = firmalar.findIndex(f => f.id === firma.id);
    if (index !== -1) {
        firmalar[index] = { ...firmalar[index], ...firma };
        saveFirmalar(firmalar);
        return true;
    }
    return false;
}

function getFirmaById(id) {
    return getFirmalar().find(f => f.id === id);
}

// Siparişler
function getSiparisler() {
    const items = localStorage.getItem(SIPARISLER_KEY);
    return items ? JSON.parse(items) : [];
}

function saveSiparisler(data) {
    localStorage.setItem(SIPARISLER_KEY, JSON.stringify(data));
    
    // Direct Cloud Backup
    try {
        if (firebase.auth().currentUser) {
            data.forEach(item => {
                if (item.id) {
                    firebase.firestore().collection('siparisler').doc(item.id).set(item, { merge: true })
                       .catch(e => console.error("Firestore Save Fail (Siparis):", e));
                }
            });
        }
    } catch (e) {}
}

function addSiparis(firmaId, siparisDetay) {
    const siparisler = getSiparisler();
    siparisDetay.id = 'ord_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    siparisDetay.firmaId = firmaId;
    siparisDetay.date = new Date().toISOString();
    siparisler.push(siparisDetay);
    saveSiparisler(siparisler);
    return siparisDetay;
}

function updateSiparis(siparis) {
    const siparisler = getSiparisler();
    const index = siparisler.findIndex(s => s.id === siparis.id);
    if (index !== -1) {
        siparisler[index] = { ...siparisler[index], ...siparis };
        saveSiparisler(siparisler);
        return true;
    }
    return false;
}

function getFirmaSiparisleri(firmaId) {
    return getSiparisler().filter(s => s.firmaId === firmaId);
}

// Tahsilatlar
function getTahsilatlar() {
    const items = localStorage.getItem(TAHSILATLAR_KEY);
    return items ? JSON.parse(items) : [];
}

function saveTahsilatlar(data) {
    localStorage.setItem(TAHSILATLAR_KEY, JSON.stringify(data));

    // Direct Cloud Backup
    try {
        if (firebase.auth().currentUser) {
            data.forEach(item => {
                if (item.id) {
                    firebase.firestore().collection('tahsilatlar').doc(item.id).set(item, { merge: true })
                       .catch(e => console.error("Firestore Save Fail (Tahsilat):", e));
                }
            });
        }
    } catch (e) {}
}

function addTahsilat(firmaId, tahsilat) {
    const tahsilatlar = getTahsilatlar();
    tahsilat.id = 'pay_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    tahsilat.firmaId = firmaId;
    tahsilat.date = new Date().toISOString();
    tahsilat.type = 'Tahsilat';
    tahsilatlar.push(tahsilat);
    saveTahsilatlar(tahsilatlar);
    return tahsilat;
}

function updateTahsilat(tahsilat) {
    const tahsilatlar = getTahsilatlar();
    const index = tahsilatlar.findIndex(t => t.id === tahsilat.id);
    if (index !== -1) {
        tahsilatlar[index] = { ...tahsilatlar[index], ...tahsilat };
        saveTahsilatlar(tahsilatlar);
        return true;
    }
    return false;
}

function getFirmaTahsilatlari(firmaId) {
    return getTahsilatlar().filter(t => t.firmaId === firmaId);
}

// --- Malzeme Fiyatları ---
const MALZEME_FIYATLARI_KEY = 'etiket_crm_malzeme_fiyatlari';

function getMalzemeFiyatlari() {
    const items = localStorage.getItem(MALZEME_FIYATLARI_KEY);
    return items ? JSON.parse(items) : [];
}

function saveMalzemeFiyatlari(data) {
    localStorage.setItem(MALZEME_FIYATLARI_KEY, JSON.stringify(data));
}

// --- Ortak Fonksiyonlar ---

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'circle-check' : 'circle-exclamation'}"></i> ${message}`;
    
    container.appendChild(toast);
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Sipariş Detay Modalı Göster
function showOrderDetails(orderId) {
    const siparisler = getSiparisler();
    const order = siparisler.find(o => o.id === orderId);
    if (!order) return;

    const firmalar = getFirmalar();
    const firma = firmalar.find(f => f.id === order.firmaId);

    let modal = document.getElementById('orderDetailModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'orderDetailModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    const dateStr = new Date(order.date).toLocaleDateString('tr-TR');
    
    modal.innerHTML = `
        <div class="modal-content panel" style="max-width: 600px;">
            <div class="panel-header">
                <h2 class="panel-title"><i class="fa-solid fa-file-invoice"></i> Sipariş Detayı</h2>
                <button class="btn-icon" onclick="document.getElementById('orderDetailModal').style.display='none'">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                <div>
                    <label style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Firma</label>
                    <div style="font-weight:600;">${firma ? firma.ad : 'Bilinmeyen Firma'}</div>
                </div>
                <div>
                    <label style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Tarih</label>
                    <div style="font-weight:600;">${dateStr}</div>
                </div>
                <div>
                    <label style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">İşlem Türü</label>
                    <div><span class="badge ${order.type === 'Mürekkep' ? 'badge-blue' : (order.type.includes('Kağıt') ? 'badge-orange' : 'badge-green')}">${order.type}</span></div>
                </div>
                <div>
                    <label style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Ödeme Şekli</label>
                    <div style="font-weight:600; color:var(--primary);">${order.paymentMethod || 'Belirtilmedi'}</div>
                </div>
            </div>
            <div style="background:var(--bg-color); padding:1rem; border-radius:8px; border:1px solid var(--border-color); margin-bottom:1.5rem;">
                <div style="font-weight:600; margin-bottom:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">Hesaplama Detayları</div>
                <div style="font-size:0.9rem; line-height:1.6;">
                    ${order.details.replace(/\|/g, '<br>')}
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--surface-hover); padding:1rem; border-radius:8px;">
                <div style="font-weight:600; font-size:1.1rem;">Toplam Tutar:</div>
                <div style="font-weight:700; font-size:1.4rem; color:var(--success);">${formatCurrency(order.totalPriceUSD)}</div>
            </div>
            ${order.totalPriceTRY ? `<div style="text-align:right; margin-top:0.5rem; color:var(--text-muted); font-size:0.9rem;">(₺${order.totalPriceTRY.toLocaleString('tr-TR', {minimumFractionDigits:2, maximumFractionDigits:2})})</div>` : ''}
        </div>
    `;

    modal.style.display = 'flex';
}

// Global scope'a ekle
window.showOrderDetails = showOrderDetails;

document.addEventListener('DOMContentLoaded', () => {
    // Tema Değiştirme (3 Aşamalı: Koyu, Açık, Mavi)
    const headerActions = document.querySelector('.header-actions');
    const currentTheme = localStorage.getItem('etiket_crm_theme') || 'dark';

    if (currentTheme === 'light') document.body.classList.add('light-mode');
    if (currentTheme === 'blue') document.body.classList.add('blue-mode');

    // Profil Baş Harfi Düzenleme
    const pName = localStorage.getItem('etiket_crm_userName');
    if (pName) {
        const initials = pName.trim().substring(0, 2).toUpperCase();
        const avatarEl = document.getElementById('userAvatarStr');
        if (avatarEl && initials.length > 0) avatarEl.textContent = initials;
    }



    // --- Mobil Menü Toggle Ekle (Drawer Menü) ---
    const topHeader = document.querySelector('.top-header');
    if (topHeader && !document.getElementById('mobileMenuBtn')) {
        const menuBtn = document.createElement('button');
        menuBtn.id = 'mobileMenuBtn';
        menuBtn.className = 'btn-icon';
        menuBtn.style.marginRight = '12px';
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        topHeader.insertBefore(menuBtn, topHeader.firstChild);

        // Karartma perdesi (Overlay)
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        menuBtn.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-open');
        });

        overlay.addEventListener('click', () => {
            document.body.classList.remove('sidebar-open');
        });

        // Sidebar linklerine tıklayınca menüyü kapat
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('sidebar-open');
            });
        });
    }

    // --- Profesyonel Mobil Alt Navigasyon (Bottom Nav) ---
    if (window.innerWidth <= 600 && !document.querySelector('.mobile-bottom-nav')) {
        const bottomNav = document.createElement('div');
        bottomNav.className = 'mobile-bottom-nav';
        
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const cleanedPath = currentPath.split('?')[0] || 'index.html';
        
        bottomNav.innerHTML = `
            <a href="index.html" class="bottom-nav-item ${cleanedPath === 'index.html' ? 'active' : ''}">
                <i class="fa-solid fa-chart-line"></i>
                <span>Özet</span>
            </a>
            <a href="analiz.html" class="bottom-nav-item ${cleanedPath === 'analiz.html' ? 'active' : ''}">
                <i class="fa-solid fa-chart-pie"></i>
                <span>Analiz</span>
            </a>
            <a href="firmalar.html" class="bottom-nav-item ${cleanedPath.includes('firmalar') || cleanedPath.includes('firma_detay') ? 'active' : ''}">
                <i class="fa-solid fa-users"></i>
                <span>Firmalar</span>
            </a>
            <a href="takvim.html" class="bottom-nav-item ${cleanedPath.includes('takvim') ? 'active' : ''}">
                <i class="fa-solid fa-calendar-days"></i>
                <span>Takvim</span>
            </a>
            <button class="bottom-nav-item" id="bottomMenuGridBtn">
                <i class="fa-solid fa-bars"></i>
                <span>Menü</span>
            </button>
        `;
        document.body.appendChild(bottomNav);

        document.getElementById('bottomMenuGridBtn').addEventListener('click', (e) => {
             e.preventDefault();
             document.body.classList.toggle('sidebar-open');
        });
    }


    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || (currentPath.includes('firma_detay') && linkHref === 'firmalar.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Para Birimi Çevirici Yardımcı
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
}

function formatTRY(amount) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

function formatEUR(amount) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

// Döviz Kurları (Anlık TCMB Taklidi API)
window.lastRates = { USD: 32.50, EUR: 35.20 }; // Global kurlar için varsayılan

async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const rates = {
            USD: parseFloat(data.rates.TRY).toFixed(4),
            EUR: (data.rates.TRY / data.rates.EUR).toFixed(4)
        };
        window.lastRates = rates; // Küresel olarak güncelle
        return rates;
    } catch (error) {
        console.error('Kurlar çekilemedi:', error);
        return window.lastRates;
    }
}

// --- Veri Yedekleme ve GitHub Senkronizasyonu ---

function showBackupModal() {
    let modal = document.getElementById('backupModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'backupModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content panel" style="max-width: 500px;">
            <div class="panel-header">
                <h2 class="panel-title"><i class="fa-solid fa-cloud"></i> Veri Senkronizasyonu</h2>
                <button class="btn-icon" onclick="document.getElementById('backupModal').style.display='none'">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <div style="margin-bottom:1.5rem;">
                <label style="font-weight:600; font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">GitHub / URL'den Veri Çek</label>
                <div style="display:flex; gap:0.5rem;">
                    <input type="text" id="githubUrl" class="form-control" placeholder="Raw JSON URL (GitHub, Gist vb.)" style="flex:1;">
                    <button class="btn btn-primary" onclick="loadFromUrl()"><i class="fa-solid fa-download"></i> Yükle</button>
                </div>
                <small style="color:var(--text-muted); font-size:0.75rem; display:block; margin-top:0.25rem;">Örn: raw.githubusercontent.com/.../data.json</small>
            </div>

            <div style="border-top:1px solid var(--border-color); padding-top:1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div>
                    <label style="font-weight:600; font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Cihaza Yedekle</label>
                    <button class="btn btn-outline" style="width:100%; justify-content:center;" onclick="exportData()"><i class="fa-solid fa-file-export"></i> Yedek İndir</button>
                </div>
                <div>
                    <label style="font-weight:600; font-size:0.85rem; color:var(--text-muted); display:block; margin-bottom:0.5rem;">Yedeği Geri Yükle</label>
                    <label class="btn btn-outline" style="display:flex; justify-content:center; cursor:pointer; width:100%;">
                        <i class="fa-solid fa-file-import"></i> Dosya Seç
                        <input type="file" id="importFile" style="display:none;" accept=".json" onchange="importData(this)">
                    </label>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

window.exportData = function() {
    const keys = ['etiket_crm_firmalar', 'etiket_crm_siparisler', 'etiket_crm_tahsilatlar', 'etiket_crm_malzeme_fiyatlari', 'etiket_crm_ziyaretler'];
    const backup = {};
    keys.forEach(k => { backup[k] = localStorage.getItem(k); });
    
    const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etiket_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

window.loadFromUrl = async function() {
    const url = document.getElementById('githubUrl').value;
    if (!url) { alert('Lütfen bir URL girin'); return; }

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Veri çekilemedi!');
        const data = await res.json();
        restoreBackup(data);
    } catch (e) {
        showToast('Veri çekme hatası: ' + e.message, 'error');
    }
}

window.importData = function(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            restoreBackup(data);
        } catch(err) {
            showToast('Dosya okuma hatası!', 'error');
        }
    };
    reader.readAsText(file);
}

function restoreBackup(data) {
    const keys = ['etiket_crm_firmalar', 'etiket_crm_siparisler', 'etiket_crm_tahsilatlar', 'etiket_crm_malzeme_fiyatlari', 'etiket_crm_ziyaretler'];
    
    let updated = 0;
    keys.forEach(k => {
        if (data[k]) {
            localStorage.setItem(k, typeof data[k] === 'string' ? data[k] : JSON.stringify(data[k]));
            updated++;
        }
    });

    if (updated > 0) {
        showToast('Veriler başarıyla yüklendi. Sayfa yenileniyor...', 'success');
        setTimeout(() => location.reload(), 1500);
    } else {
        showToast('Geçerli veri bulunamadı!', 'error');
    }
}
