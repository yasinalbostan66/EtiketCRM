// --- Global Logout Logic (Instant & Fail-safe) ---
(function killOldServiceWorkers() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
            for(let reg of regs) {
                reg.unregister();
                console.log("Legacy SW uninstalled to prevent caching issues.");
            }
        });
    }
})();

window.handleLogout = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    console.log("Forced logout triggered");
    
    // Clear ALL data immediately
    localStorage.clear();
    sessionStorage.clear();
    
    if (typeof showToast === 'function') showToast("Sistemden çıkılıyor...", "warning");
    
    // Try cloud sync signout if available
    try {
        if (window.firebase && firebase.auth()) {
            firebase.auth().signOut().finally(() => {
                window.location.href = 'login.html';
            });
            // Fallback for slow signout
            setTimeout(() => { window.location.href = 'login.html'; }, 800);
        } else {
            window.location.href = 'login.html';
        }
    } catch(err) {
        window.location.href = 'login.html';
    }
    return false;
};

// --- Global Veri Yönetimi ---
const FIRMALAR_KEY = 'etiket_crm_firmalar';
const SIPARISLER_KEY = 'etiket_crm_siparisler';
const TAHSILATLAR_KEY = 'etiket_crm_tahsilatlar';

// Parlaklık ayarını uygula – her sayfada çalışır
(function applyBrightness() {
    const b = localStorage.getItem('etiket_crm_brightness');
    if (b && parseInt(b) < 100) {
        // body'i hemen ayarla; DOMContentLoaded beklemeye gerek yok
        document.documentElement.style.filter = `brightness(${b}%)`;
        // DOMContentLoaded sonrası app-wrapper'a da uygula
        document.addEventListener('DOMContentLoaded', () => {
            const w = document.querySelector('.app-wrapper');
            if (w) {
                document.documentElement.style.filter = '';
                w.style.filter = `brightness(${b}%)`;
            }
        });
    }
})();

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

window.getDueDateStr = function(method, date) {
    if (!method || !method.includes('Gün Vadeli')) return null;
    const match = method.match(/(\d+)\s*Gün/i);
    if (match) {
        const d = new Date(date);
        d.setDate(d.getDate() + parseInt(match[1], 10));
        return d.toLocaleDateString('tr-TR', {day:'2-digit', month:'2-digit', year:'numeric'});
    }
    return null;
}

window.getDueDateRaw = function(method, date) {
    if (!method || !method.includes('Gün Vadeli')) return null;
    const match = method.match(/(\d+)\s*Gün/i);
    if (match) {
        const d = new Date(date);
        d.setDate(d.getDate() + parseInt(match[1], 10));
        return d;
    }
    return null;
}

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
                    ${window.getDueDateStr(order.paymentMethod, order.date) ? `<div style="font-size:0.75rem; color:var(--danger); font-weight:700; margin-top:4px;">Vade: ${window.getDueDateStr(order.paymentMethod, order.date)}</div>` : ''}
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
    let currentTheme = localStorage.getItem('etiket_crm_theme');
    if (!currentTheme) {
        currentTheme = 'light';
        localStorage.setItem('etiket_crm_theme', 'light');
    }

    if (currentTheme === 'light') document.body.classList.add('light-mode');
    if (currentTheme === 'blue') document.body.classList.add('blue-mode');

    // Özel Vurgu Rengi (Renk Paleti)
    const savedPrimary = localStorage.getItem('etiket_crm_primary_color');
    if (savedPrimary) {
        document.body.style.setProperty('--primary', savedPrimary, 'important');
    }

    // Profil Baş Harfi Düzenleme
    const pName = localStorage.getItem('etiket_crm_userName');
    if (pName) {
        const initials = pName.trim().substring(0, 2).toUpperCase();
        const avatarEl = document.getElementById('userAvatarStr');
        if (avatarEl && initials.length > 0) avatarEl.textContent = initials;
    }

    // --- Vade Gelmiş Sipariş Hatırlatması ---
    const allFirms = getFirmalar();
    const allOrds = getSiparisler();
    const allPays = getTahsilatlar();
    let pendingDueCount = 0;
    const today = new Date();

    allFirms.forEach(f => {
        const fSip = allOrds.filter(s => s.firmaId === f.id);
        const fTah = allPays.filter(t => t.firmaId === f.id);
        const sSum = fSip.reduce((a,c) => a+(c.totalPriceUSD||0), 0);
        const tSum = fTah.reduce((a,c) => a+(c.totalAmountUSD||0), 0);
        
        if (sSum - tSum > 0.1) {
            fSip.forEach(s => {
                const limitDt = window.getDueDateRaw(s.paymentMethod, s.date);
                if (limitDt && limitDt <= today) {
                    pendingDueCount++;
                }
            });
        }
    });

    if (pendingDueCount > 0) {
        setTimeout(() => {
            showToast(`${pendingDueCount} adet siparişin vade tarihi geldi veya geçti!`, 'error');
        }, 1500);
    }



    // --- Mobil Menü Toggle Ekle (Drawer Menü) ---
    const topHeader = document.querySelector('.top-header');
    let menuBtn = document.getElementById('mobileMenuBtn');
    
    if (topHeader && !menuBtn) {
        menuBtn = document.createElement('button');
        menuBtn.id = 'mobileMenuBtn';
        menuBtn.className = 'btn-icon hide-desktop';
        menuBtn.style.marginRight = '12px';
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        topHeader.insertBefore(menuBtn, topHeader.firstChild);
    }
    
    if (menuBtn && !document.querySelector('.sidebar-overlay')) {
        // Karartma perdesi (Overlay)
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
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
                <i class="fa-solid fa-house"></i>
                <span>Özet</span>
            </a>
            <a href="firmalar.html" class="bottom-nav-item ${cleanedPath.includes('firmalar') || cleanedPath.includes('firma_detay') ? 'active' : ''}">
                <i class="fa-solid fa-users"></i>
                <span>Firmalar</span>
            </a>
            <a href="odeme_takibi.html" class="bottom-nav-item ${cleanedPath === 'odeme_takibi.html' ? 'active' : ''}">
                <i class="fa-solid fa-money-bill-trend-up"></i>
                <span>Cari</span>
            </a>
            <a href="analiz.html" class="bottom-nav-item ${cleanedPath === 'analiz.html' ? 'active' : ''}">
                <i class="fa-solid fa-chart-pie"></i>
                <span>Analiz</span>
            </a>
            <button class="bottom-nav-item" onclick="window.toggleMobileGridMenu()" id="bottomMenuGridBtn">
                <i class="fa-solid fa-grid-2"></i>
                <i class="fa-solid fa-caret-up" style="font-size: 0.6rem; position: absolute; top: 8px; right: 25%;"></i>
                <span>Menü</span>
            </button>
        `;
        document.body.appendChild(bottomNav);

    }

    // --- Modern Grid Menu Injection (Replaces Sidebar on Mobile) ---
    window.toggleMobileGridMenu = function() {
        let menuId = 'mobileGridOverlay';
        let existing = document.getElementById(menuId);
        
        if (existing) {
            existing.classList.toggle('active');
            return;
        }

        const menuOverlay = document.createElement('div');
        menuOverlay.id = menuId;
        menuOverlay.className = 'mobile-grid-overlay';
        
        menuOverlay.innerHTML = `
            <div class="grid-menu-content">
                <div class="grid-menu-header">
                    <h3>Hızlı Menü</h3>
                    <button class="close-btn" onclick="document.getElementById('${menuId}').classList.remove('active')">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="grid-items">
                    <a href="ziyaretler.html" class="grid-item">
                        <div class="icon-box" style="background: rgba(79, 70, 229, 0.1); color: #4f46e5;">
                            <i class="fa-solid fa-clipboard-list"></i>
                        </div>
                        <span>Ziyaretler</span>
                    </a>
                    <a href="takvim.html" class="grid-item">
                        <div class="icon-box" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
                            <i class="fa-solid fa-calendar-days"></i>
                        </div>
                        <span>Takvim</span>
                    </a>
                    <a href="malzeme_fiyatlari.html" class="grid-item">
                        <div class="icon-box" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
                            <i class="fa-solid fa-tags"></i>
                        </div>
                        <span>Fiyatlar</span>
                    </a>
                    <a href="stok_takibi.html" class="grid-item">
                        <div class="icon-box" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                            <i class="fa-solid fa-file-export"></i>
                        </div>
                        <span>Stok / Rapor</span>
                    </a>
                    <a href="ayarlar.html" class="grid-item">
                        <div class="icon-box" style="background: rgba(100, 116, 139, 0.1); color: #64748b;">
                            <i class="fa-solid fa-gear"></i>
                        </div>
                        <span>Ayarlar</span>
                    </a>
                    <div class="grid-item" onclick="handleLogout()">
                        <div class="icon-box" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                            <i class="fa-solid fa-right-from-bracket"></i>
                        </div>
                        <span style="color: #ef4444; font-weight:700;">ÇIKIŞ YAP</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(menuOverlay);
        setTimeout(() => menuOverlay.classList.add('active'), 10);
    }

    function toggleMobileSidebar() {
        const isOpening = !document.body.classList.contains('sidebar-open');
        document.body.classList.toggle('sidebar-open');
        
        let overlay = document.querySelector('.sidebar-overlay');
        if (isOpening) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
                overlay.addEventListener('click', () => {
                    document.body.classList.remove('sidebar-open');
                });
            }
            overlay.style.display = 'block';
        } else if (overlay) {
            overlay.style.display = 'none';
        }
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

window.openYeniMalzemeModal = function(turu) {
    let modal = document.getElementById('yeniMalzemeModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'yeniMalzemeModal';
        modal.className = 'modal-overlay';
        modal.style.zIndex = '999999';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content panel" style="max-width: 480px; width: 95%;">
            <div class="panel-header">
                <h2 class="panel-title"><i class="fa-solid fa-plus-circle"></i> Yeni ${turu} Ekle</h2>
                <button class="btn-icon" onclick="document.getElementById('yeniMalzemeModal').style.display='none'">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <form id="yeniMalzemeFormModal">
                <div class="modal-body-scroll">
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; text-align: center;">Bu formu kullanarak veritabanına yeni malzeme ekleyebilirsiniz.</p>
                    
                    <div class="form-group">
                        <label>Malzeme Adı *</label>
                        <input type="text" id="ymAdi" class="form-control" placeholder="Örn: X Marka Kuşe" required>
                    </div>
                    
                    <div class="form-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label>Birim Fiyat *</label>
                            <input type="number" id="ymFiyat" class="form-control" step="0.0001" placeholder="0.00" required>
                        </div>
                        <div class="form-group">
                            <label>Para Birimi</label>
                            <select id="ymDoviz" class="form-control" required>
                                <option value="USD">$ USD</option>
                                <option value="EUR">€ EUR</option>
                                <option value="TRY">₺ TRY</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Ölçü Birimi</label>
                        <select id="ymBirim" class="form-control">
                            <option value="kg">kg</option>
                            <option value="m²">m²</option>
                            <option value="cm²">cm²</option>
                            <option value="adet">adet</option>
                            <option value="Litre">Litre</option>
                            <option value="Rulo">Rulo</option>
                            <option value="Paket">Paket</option>
                        </select>
                        <small style="color: var(--text-muted); font-size:0.75rem;">Hesaplamada kullanılacak miktar birimi.</small>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="document.getElementById('yeniMalzemeModal').style.display='none'">Vazgeç</button>
                    <button type="submit" class="btn btn-primary">Kaydet ve Listeye Ekle</button>
                </div>
            </form>
        </div>
    `;
    modal.style.display = 'flex';
    
    document.getElementById('yeniMalzemeFormModal').addEventListener('submit', (e) => {
        e.preventDefault();
        const fiyatlar = getMalzemeFiyatlari();
        const newAdi = document.getElementById('ymAdi').value.trim();
        
        // Aynı isimde var mı kontrolü
        if(fiyatlar.some(f => f.turu === turu && f.adi.toLowerCase() === newAdi.toLowerCase())) {
            showToast('Bu malzeme zaten veritabanında mevcut!', 'error');
            return;
        }

        const obj = {
            id: 'mal_' + Date.now().toString(36),
            turu: turu,
            adi: newAdi,
            fiyat: parseFloat(document.getElementById('ymFiyat').value),
            doviz: document.getElementById('ymDoviz').value,
            birim: document.getElementById('ymBirim').value,
            stok: 0
        };
        
        fiyatlar.push(obj);
        saveMalzemeFiyatlari(fiyatlar);
        document.getElementById('yeniMalzemeModal').style.display = 'none';
        showToast('Yeni malzeme fiyatı veritabanına başarıyla eklendi!', 'success');
        
        // Sayfalara malzemeyi otomatik seçtirmek için event fırlat
        window.dispatchEvent(new CustomEvent('malzemeEklendi', { detail: obj }));
    });
};

// --- Bildirim Sistemi ---
document.addEventListener('DOMContentLoaded', () => {
    initNotificationSystem();
});

function initNotificationSystem() {
    // Zil butonunu bul (i.fa-bell'i içeren butonu seç)
    const bellIcon = document.querySelector('.fa-bell');
    if (!bellIcon) return;
    const bellBtn = bellIcon.closest('button');
    if (!bellBtn) return;

    // Bell butonunu sarmala
    const wrapper = document.createElement('div');
    wrapper.className = 'bell-container';
    bellBtn.parentNode.insertBefore(wrapper, bellBtn);
    wrapper.appendChild(bellBtn);

    // Kırmızı nokta (badge) ekle
    const badge = document.createElement('div');
    badge.className = 'notification-badge';
    badge.id = 'notifBadge';
    wrapper.appendChild(badge);

    // Dropdown ekle
    const dropdown = document.createElement('div');
    dropdown.className = 'notification-dropdown';
    dropdown.id = 'notifDropdown';
    dropdown.innerHTML = `
        <div class="notification-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-color);">
            <h4 style="margin:0; font-size:0.95rem; font-weight:700;">Bildirimler</h4>
            <span id="notifCount" style="font-size: 0.75rem; background: var(--primary); color: #fff; padding: 2px 8px; border-radius: 10px; font-weight: 700;">0</span>
        </div>
        <div class="notification-body" id="notifBody" style="max-height: 400px; overflow-y: auto;">
            <div class="notification-empty" style="padding: 2rem; text-align: center; color: var(--text-muted);">Bildiriminiz bulunmuyor.</div>
        </div>
    `;
    wrapper.appendChild(dropdown);

    // Click olayı
    bellBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.style.display === 'flex';
        // Tüm dropdownları kapat (başka varsa)
        document.querySelectorAll('.notification-dropdown').forEach(d => d.style.display = 'none');
        dropdown.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) updateNotifications();
    };

    document.addEventListener('click', () => {
        dropdown.style.display = 'none';
    });

    dropdown.onclick = (e) => e.stopPropagation();

    // İlk kontrol
    updateNotifications();
}

function updateNotifications() {
    const list = calculateAllNotifications();
    const badge = document.getElementById('notifBadge');
    const body = document.getElementById('notifBody');
    const countEl = document.getElementById('notifCount');

    if (!badge || !body || !countEl) return;

    if (list.length > 0) {
        badge.style.display = 'block';
        countEl.textContent = list.length;
        body.innerHTML = '';
        list.forEach(item => {
            const div = document.createElement('a');
            div.className = 'notification-item';
            div.href = item.link || '#';
            div.style.display = 'flex';
            div.style.padding = '1rem 1.25rem';
            div.style.borderBottom = '1px solid var(--border-color)';
            div.style.textDecoration = 'none';
            div.style.gap = '12px';
            
            div.innerHTML = `
                <i class="${item.icon}" style="color: ${item.color}; font-size: 1.1rem; padding-top: 3px;"></i>
                <div class="content" style="flex:1;">
                    <div class="title" style="font-weight:700; font-size:0.85rem; color: var(--text-main);">${item.title}</div>
                    <div class="desc" style="font-size:0.8rem; color: var(--text-muted); margin-top:2px; line-height:1.4;">${item.desc}</div>
                    <div class="time" style="font-size:0.75rem; color: var(--primary); margin-top:4px; font-weight:500;">${item.timeText}</div>
                </div>
            `;
            body.appendChild(div);
        });
    } else {
        badge.style.display = 'none';
        countEl.textContent = '0';
        body.innerHTML = '<div class="notification-empty" style="padding: 2rem; text-align: center; color: var(--text-muted);">Şu an için yeni bir bildirim yok.</div>';
    }
}

function calculateAllNotifications() {
    const today = new Date();
    today.setHours(0,0,0,0);
    const notifications = [];

    const siparisler = getSiparisler();
    const tahsilatlar = getTahsilatlar();
    const firmalar = getFirmalar();

    // Performans için Sipariş ve Tahsilatları firmaya göre grupla (O(n))
    const sipMap = {};
    siparisler.forEach(s => {
        if(!sipMap[s.firmaId]) sipMap[s.firmaId] = [];
        sipMap[s.firmaId].push(s);
    });
    const tahMap = {};
    tahsilatlar.forEach(t => {
        if(!tahMap[t.firmaId]) tahMap[t.firmaId] = [];
        tahMap[t.firmaId].push(t);
    });

    // 1. Düşük Stok (Değişmedi, zaten hızlı)
    const malzemeler = getMalzemeFiyatlari();
    malzemeler.filter(m => m.stok > 0 && m.stok <= 10).forEach(m => {
        notifications.push({
            type: 'STOCK',
            title: 'Stok Azaldı!',
            desc: `${m.adi} stoğu sadece ${m.stok} ${m.birim || ''} kaldı.`,
            timeText: 'Hemen Sipariş Ver',
            icon: 'fa-solid fa-box-open',
            color: '#ef4444',
            link: 'stok_takibi.html'
        });
    });

    // 2. Ödemeler (Optimize edildi)
    firmalar.forEach(f => {
        const fSip = sipMap[f.id] || [];
        const fTah = tahMap[f.id] || [];
        const sSum = fSip.reduce((a,c) => a+(parseFloat(c.totalPriceUSD)||0), 0);
        const tSum = fTah.reduce((a,c) => a+(parseFloat(c.totalAmountUSD)||0), 0);

        if (sSum - tSum > 1) { 
            fSip.forEach(s => {
                const dueDt = window.getDueDateRaw(s.paymentMethod, s.date);
                if (dueDt) {
                    const diff = Math.ceil((dueDt - today) / (1000 * 3600 * 24));
                    if (diff <= 5) {
                        notifications.push({
                            type: 'PAYMENT',
                            title: diff < 0 ? 'Gecikmiş Ödeme!' : 'Ödeme Vadesi Yaklaştı',
                            desc: `${f.ad} firmasının ${formatCurrency(s.totalPriceUSD)} tutarlı ödemesi.`,
                            timeText: diff < 0 ? `${Math.abs(diff)} gün gecikti` : (diff === 0 ? 'Vade BUGÜN!' : `${diff} gün kaldı`),
                            icon: 'fa-solid fa-hand-holding-dollar',
                            color: diff < 0 ? '#ef4444' : '#f59e0b',
                            link: 'odeme_takibi.html'
                        });
                    }
                }
            });
        }
    });

    // 3. Yaklaşan Ziyaretler
    const ziyaretler = JSON.parse(localStorage.getItem('etiket_crm_ziyaretler') || '[]');
    ziyaretler.forEach(z => {
        if (z.status === 'Planlandı' && z.date) {
            const zDate = new Date(z.date);
            zDate.setHours(0,0,0,0);
            const diff = Math.ceil((zDate - today) / (1000 * 3600 * 24));
            
            if (diff >= 0 && diff <= 1) {
                const f = firmalar.find(fr => fr.id === z.firmaId);
                notifications.push({
                    type: 'VISIT',
                    title: diff === 0 ? 'Bugün Ziyaretiniz Var' : 'Yarın Ziyaretiniz Var',
                    desc: `${f ? f.ad : 'Bilinmeyen Firma'} ziyareti planlandı.`,
                    timeText: diff === 0 ? `Saat: ${z.time || '--:--'}` : 'Ziyaret Zamanı Yaklaşıyor',
                    icon: 'fa-solid fa-calendar-check',
                    color: '#4f46e5',
                    link: 'takvim.html'
                });
            }
        }
    });

    return notifications;
}
