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
    
    // Sadece veri koleksiyonlarını ve geçici verileri temizle; ayarları ve Beni Hatırla bilgilerini KORU
    const COLLECTIONS = ['firmalar', 'siparisler', 'tahsilatlar', 'malzeme_fiyatlari', 'ziyaretler', 'duyurular', 'teknik_servis', 'muhasebe', 'kullanicilar', 'sevkiyatlar'];
    COLLECTIONS.forEach(col => {
        localStorage.removeItem(`etiket_crm_${col}`);
    });
    localStorage.removeItem('etiket_crm_last_vade_alert_date');
    localStorage.removeItem('etiket_crm_notif_dismissed_date');
    
    // sessionStorage'ı temizle
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
const SEVKIYATLAR_KEY = 'etiket_crm_sevkiyatlar';
const IADELER_KEY = 'etiket_crm_iadeler';

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

window.checkRecordPermission = function(createdBy) {
    if (!createdBy || createdBy === 'local_user') return true; 
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) return true; 
    return currentUser.uid === createdBy;
};

function addFirma(firma) {
    const firmalar = getFirmalar();
    const currentUser = firebase.auth().currentUser;
    firma.id = 'frm_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    firma.dateAdded = new Date().toISOString();
    firma.created_by = currentUser ? currentUser.uid : 'local_user';
    firmalar.push(firma);
    saveFirmalar(firmalar);
    return firma;
}

function updateFirma(firma) {
    const firmalar = getFirmalar();
    const index = firmalar.findIndex(f => f.id === firma.id);
    if (index !== -1) {
        if (!checkRecordPermission(firmalar[index].created_by)) {
            alert("Bu firmayı düzenleme yetkiniz yok! Sadece oluşturan kullanıcı düzenleyebilir.");
            return false;
        }
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
    const currentUser = firebase.auth().currentUser;
    siparisDetay.id = 'ord_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    siparisDetay.firmaId = firmaId;
    siparisDetay.date = new Date().toISOString();
    siparisDetay.created_by = currentUser ? currentUser.uid : 'local_user';
    siparisler.push(siparisDetay);
    saveSiparisler(siparisler);
    return siparisDetay;
}

function updateSiparis(siparis) {
    const siparisler = getSiparisler();
    const index = siparisler.findIndex(s => s.id === siparis.id);
    if (index !== -1) {
        if (!checkRecordPermission(siparisler[index].created_by)) {
            alert("Bu siparişi düzenleme yetkiniz yok! Sadece oluşturan kullanıcı düzenleyebilir.");
            return false;
        }
        siparisler[index] = { ...siparisler[index], ...siparis };
        saveSiparisler(siparisler);
        return true;
    }
    return false;
}

// Sevkiyatlar
function getSevkiyatlar() {
    const items = localStorage.getItem(SEVKIYATLAR_KEY);
    return items ? JSON.parse(items) : [];
}

function saveSevkiyatlar(data) {
    localStorage.setItem(SEVKIYATLAR_KEY, JSON.stringify(data));
    
    // Direct Cloud Backup
    try {
        if (firebase.auth().currentUser) {
            data.forEach(item => {
                if (item.id) {
                    firebase.firestore().collection('sevkiyatlar').doc(item.id).set(item, { merge: true })
                       .catch(e => console.error("Firestore Save Fail (Sevkiyat):", e));
                }
            });
        }
    } catch (e) {}
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
    const currentUser = firebase.auth().currentUser;
    tahsilat.id = 'pay_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    tahsilat.firmaId = firmaId;
    tahsilat.date = new Date().toISOString();
    tahsilat.type = 'Tahsilat';
    tahsilat.created_by = currentUser ? currentUser.uid : 'local_user';
    tahsilatlar.push(tahsilat);
    saveTahsilatlar(tahsilatlar);
    return tahsilat;
}

function updateTahsilat(tahsilat) {
    const tahsilatlar = getTahsilatlar();
    const index = tahsilatlar.findIndex(t => t.id === tahsilat.id);
    if (index !== -1) {
        if (!checkRecordPermission(tahsilatlar[index].created_by)) {
            alert("Bu tahsilatı düzenleme yetkiniz yok! Sadece oluşturan kullanıcı düzenleyebilir.");
            return false;
        }
        tahsilatlar[index] = { ...tahsilatlar[index], ...tahsilat };
        saveTahsilatlar(tahsilatlar);
        return true;
    }
    return false;
}

function getFirmaTahsilatlari(firmaId) {
    return getTahsilatlar().filter(t => t.firmaId === firmaId);
}

// --- İadeler ---
function getIadeler() {
    const items = localStorage.getItem(IADELER_KEY);
    return items ? JSON.parse(items) : [];
}

function saveIadeler(data) {
    localStorage.setItem(IADELER_KEY, JSON.stringify(data));
    try {
        if (firebase.auth().currentUser) {
            data.forEach(item => {
                if (item.id) {
                    firebase.firestore().collection('iadeler').doc(item.id).set(item, { merge: true })
                       .catch(e => console.error("Firestore Save Fail (İade):", e));
                }
            });
        }
    } catch (e) {}
}

function addIade(firmaId, iade) {
    const iadeler = getIadeler();
    const currentUser = firebase.auth().currentUser;
    iade.id = 'ret_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    iade.firmaId = firmaId;
    iade.date = iade.date || new Date().toISOString();
    iade.type = 'İade';
    iade.created_by = currentUser ? currentUser.uid : 'local_user';
    iadeler.push(iade);
    saveIadeler(iadeler);
    return iade;
}

function updateIade(iade) {
    const iadeler = getIadeler();
    const index = iadeler.findIndex(i => i.id === iade.id);
    if (index !== -1) {
        if (!checkRecordPermission(iadeler[index].created_by)) {
            alert("Bu iadeyi düzenleme yetkiniz yok!");
            return false;
        }
        iadeler[index] = { ...iadeler[index], ...iade };
        saveIadeler(iadeler);
        return true;
    }
    return false;
}

function getFirmaIadeler(firmaId) {
    return getIadeler().filter(i => i.firmaId === firmaId);
}

function deleteIade(id) {
    let iadeler = getIadeler();
    const iade = iadeler.find(i => i.id === id);
    if (iade && !checkRecordPermission(iade.created_by)) {
        alert("Bu iadeyi silme yetkiniz yok!");
        return false;
    }
    iadeler = iadeler.filter(i => i.id !== id);
    saveIadeler(iadeler);
    try {
        if (firebase.auth().currentUser) {
            firebase.firestore().collection('iadeler').doc(id).delete()
                .catch(e => console.error("Firestore Delete Fail (İade):", e));
        }
    } catch (e) {}
    return true;
}

// --- Malzeme Fiyatları ---
const MALZEME_FIYATLARI_KEY = 'etiket_crm_malzeme_fiyatlari';

function getMalzemeFiyatlari() {
    const items = localStorage.getItem(MALZEME_FIYATLARI_KEY);
    return items ? JSON.parse(items) : [];
}

function saveMalzemeFiyatlari(data) {
    localStorage.setItem(MALZEME_FIYATLARI_KEY, JSON.stringify(data));

    // Yeni stok güncellendiğinde düşük stok uyarılarının anında görünmesini sağla
    localStorage.removeItem('etiket_crm_notif_dismissed_date');
    sessionStorage.removeItem('etiket_crm_notif_seen');

    // Direct Cloud Backup
    try {
        if (firebase.auth().currentUser) {
            data.forEach(item => {
                if (item.id) {
                    firebase.firestore().collection('malzeme_fiyatlari').doc(item.id).set(item, { merge: true })
                       .catch(e => console.error("Firestore Save Fail (MalzemeFiyat):", e));
                }
            });
        }
    } catch (e) {}
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
                <div style="font-weight:600; font-size:1.1rem;">Toplam Tutar <span style="font-size:0.8rem; color:var(--text-muted); font-weight:400;">(USD)</span>:</div>
                <div style="font-weight:700; font-size:1.4rem; color:var(--success);">${formatCurrency(order.totalPriceUSD)}</div>
            </div>
            ${order.totalPriceTRY ? `<div style="text-align:right; margin-top:0.5rem; color:var(--text-muted); font-size:0.9rem;">TL Karşılığı: ₺${order.totalPriceTRY.toLocaleString('tr-TR', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>` : ''}
        </div>
    `;

    modal.style.display = 'flex';
}

// Global scope'a ekle
window.showOrderDetails = showOrderDetails;

document.addEventListener('DOMContentLoaded', () => {
    // TCMB Döviz Kurlarını Global Header'a Yerleştir
    if (typeof initGlobalRates === 'function') {
        initGlobalRates();
    }

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

    // --- Vade Gelmiş Sipariş Hatırlatması (Günde 1 Kez 09:00'dan Sonra & Oturumda Bir Kez) ---
    const now = new Date();
    const todayStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    const lastAlertDate = localStorage.getItem('etiket_crm_last_vade_alert_date');
    const wasShownThisSession = sessionStorage.getItem('etiket_crm_vade_alert_shown') === 'true';

    if (now.getHours() >= 9 && lastAlertDate !== todayStr && !wasShownThisSession) {
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
                localStorage.setItem('etiket_crm_last_vade_alert_date', todayStr);
                sessionStorage.setItem('etiket_crm_vade_alert_shown', 'true');
            }, 1500);
        } else {
            sessionStorage.setItem('etiket_crm_vade_alert_shown', 'true');
        }
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

    // --- Merkezi Yan Menü (Sidebar) Enjeksiyonu ---
    function injectSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const cleanedPath = currentPath.split('?')[0] || 'index.html';

        const storedLogo = localStorage.getItem('etiket_crm_companyLogo');
        const logoHtml = storedLogo 
            ? `<img src="${storedLogo}" alt="Firma Logosu" style="max-width: 100%; max-height: 80px; object-fit: contain;">`
            : `
                <i class="fa-solid fa-chart-line" style="color: #3b82f6; font-size: 2.2rem; filter: drop-shadow(0 4px 6px rgba(59,130,246,0.25));"></i>
                <div style="line-height: 1.1; text-align: center;">
                    <span style="color:#3b82f6; font-family:'Outfit', sans-serif; font-size:1.6rem; font-weight:900; letter-spacing:-0.5px;">LINKUP</span>
                    <span style="color:#ef4444; font-size:0.95rem; font-weight:800; display:block;">CRM <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">by Yasin</span></span>
                </div>
            `;

        sidebar.innerHTML = `
            <style>
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.5; }
                }
            </style>
            <div class="sidebar-header" style="padding: 1.5rem 1rem 1rem 1rem; display: flex; justify-content: center; align-items: center;">
                <a href="index.html" class="logo" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-decoration: none; text-align: center; width: 100%;">
                    ${logoHtml}
                </a>
            </div>
            
            <nav class="sidebar-nav">
                <div style="margin: 0.5rem 0 0.5rem 1rem; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Genel
                </div>
                <a href="index.html" class="nav-item ${cleanedPath === 'index.html' ? 'active' : ''}">
                    <i class="fa-solid fa-chart-line"></i>
                    Genel Bakış
                </a>
                <a href="analiz.html" class="nav-item ${cleanedPath.includes('analiz') ? 'active' : ''}">
                    <i class="fa-solid fa-chart-pie"></i>
                    Analiz & Raporlar
                </a>
                <a href="firmalar.html" class="nav-item ${cleanedPath.includes('firmalar') || cleanedPath.includes('firma_detay') ? 'active' : ''}">
                    <i class="fa-solid fa-users"></i>
                    Firmalar
                </a>
                
                <div style="margin: 1rem 0 0.5rem 1rem; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Sipariş Yönetimi
                </div>
                <a href="siparis.html" class="nav-item ${cleanedPath === 'siparis.html' || cleanedPath === 'murekkep.html' || cleanedPath === 'kagit.html' || cleanedPath === 'sarf_malzeme.html' || cleanedPath === 'klise.html' ? 'active' : ''}">
                    <i class="fa-solid fa-cart-plus"></i>
                    Sipariş Oluştur
                </a>
                <a href="siparis.html#siparisListesi" class="nav-item">
                    <i class="fa-solid fa-list-check"></i>
                    Alınan Siparişler
                </a>
                <a href="sevkiyat.html" class="nav-item ${cleanedPath === 'sevkiyat.html' ? 'active' : ''}">
                    <i class="fa-solid fa-truck-fast"></i>
                    Sevkiyat Takibi
                </a>

                <div style="margin: 1rem 0 0.5rem 1rem; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Ziyaret & Planlama
                </div>
                <a href="ziyaretler.html" class="nav-item ${cleanedPath === 'ziyaretler.html' ? 'active' : ''}">
                    <i class="fa-solid fa-clipboard-list"></i>
                    Ziyaret Kayıtları
                </a>
                <a href="takvim.html" class="nav-item ${cleanedPath === 'takvim.html' ? 'active' : ''}">
                    <i class="fa-solid fa-calendar-days"></i>
                    Ziyaret Takvimi
                </a>

                <div style="margin: 1rem 0 0.5rem 1rem; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Finans & Ürün
                </div>
                <a href="odeme_takibi.html" class="nav-item ${cleanedPath === 'odeme_takibi.html' ? 'active' : ''}">
                    <i class="fa-solid fa-money-bill-transfer"></i>
                    Ödeme Takibi & Cari
                </a>
                <a href="malzeme_fiyatlari.html" class="nav-item ${cleanedPath === 'malzeme_fiyatlari.html' ? 'active' : ''}">
                    <i class="fa-solid fa-tags"></i>
                    Malzeme Fiyatları
                </a>
                <a href="stok_takibi.html" class="nav-item ${cleanedPath === 'stok_takibi.html' ? 'active' : ''}">
                    <i class="fa-solid fa-file-export"></i>
                    Stok ve Rapor Paylaşımı
                </a>

                <div style="margin: 1rem 0 0.5rem 1rem; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Operasyon & Destek
                </div>
                <a href="duyurular.html" class="nav-item ${cleanedPath === 'duyurular.html' ? 'active' : ''}">
                    <i class="fa-solid fa-bullhorn" style="color: #fb923c !important;"></i>
                    Duyurular
                </a>
                <a href="teknik_servis.html" class="nav-item ${cleanedPath === 'teknik_servis.html' ? 'active' : ''}">
                    <i class="fa-solid fa-screwdriver-wrench" style="color: #38bdf8 !important;"></i>
                    Teknik Servis
                </a>
                <a href="muhasebe.html" class="nav-item ${cleanedPath === 'muhasebe.html' ? 'active' : ''}">
                    <i class="fa-solid fa-calculator" style="color: #a3e635 !important;"></i>
                    Muhasebe Paneli
                </a>

                <div style="margin: 1rem 0 0.5rem 1rem; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Sistem
                </div>
                <a href="ayarlar.html" class="nav-item ${cleanedPath === 'ayarlar.html' ? 'active' : ''}">
                    <i class="fa-solid fa-gear"></i>
                    Ayarlar
                </a>
                
                <div id="activeUsersWidget" style="margin-top: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid var(--border-color); font-size: 0.8rem;">
                    <div style="font-weight: 700; color: #fff; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-circle" style="color: var(--success); font-size: 0.55rem; animation: pulse 1.5s infinite;"></i>
                        Çalışan Durumları
                    </div>
                    <div id="activeUsersList" style="display: flex; flex-direction: column; gap: 6px; max-height: 120px; overflow-y: auto;">
                        <span style="color: var(--text-muted); font-size: 0.75rem;">Yükleniyor...</span>
                    </div>
                </div>

                <div style="margin-top: auto; border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-bottom: 0.5rem;">
                    <a href="#" onclick="handleLogout()" class="nav-item" id="sidebarLogoutBtn" style="color: var(--danger);">
                        <i class="fa-solid fa-right-from-bracket"></i>
                        Çıkış Yap
                    </a>
                </div>
            </nav>
        `;
    }

    injectSidebar();

    // --- Profesyonel Mobil Alt Navigasyon (Bottom Nav) ---
    // Her zaman oluştur; CSS @media (max-width: 992px) gösterim kontrolünü yapar
    if (!document.querySelector('.mobile-bottom-nav')) {
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
            <a href="siparis.html" class="bottom-nav-item ${cleanedPath === 'siparis.html' ? 'active' : ''}">
                <i class="fa-solid fa-cart-plus"></i>
                <span>Sipariş</span>
            </a>
            <a href="sevkiyat.html" class="bottom-nav-item ${cleanedPath === 'sevkiyat.html' ? 'active' : ''}">
                <i class="fa-solid fa-truck-fast"></i>
                <span>Sevkiyat</span>
            </a>
            <button class="bottom-nav-item" id="bottomMenuGridBtn">
                <i class="fa-solid fa-bars"></i>
                <span>Menü</span>
            </button>
        `;
        document.body.appendChild(bottomNav);

        document.getElementById('bottomMenuGridBtn').addEventListener('click', (e) => {
             e.preventDefault();
             e.stopPropagation();
             toggleMobileSidebar();
        });
    }

    function toggleMobileSidebar() {
        const isOpening = !document.body.classList.contains('sidebar-open');
        document.body.classList.toggle('sidebar-open');
        
        // Hide Grid menu if it existed
        let gridMenu = document.getElementById('mobileGridOverlay');
        if (gridMenu) gridMenu.classList.remove('active');

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
function formatCurrency(amount, currency = null) {
    if (!currency) {
        currency = localStorage.getItem('etiket_crm_defaultCurrency') || 'USD';
    }
    
    let convertedAmount = parseFloat(amount || 0);
    const usdToTry = parseFloat(window.lastRates?.USD || 32.50);
    const eurToTry = parseFloat(window.lastRates?.EUR || 35.20);
    
    if (currency === 'TRY') {
        convertedAmount = convertedAmount * usdToTry;
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(convertedAmount);
    } else if (currency === 'EUR') {
        const usdToEur = usdToTry / eurToTry;
        convertedAmount = convertedAmount * usdToEur;
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(convertedAmount);
    } else {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(convertedAmount);
    }
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

async function initGlobalRates() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    
    let ratesHeader = document.getElementById('exchangeRatesHeader');
    if (!ratesHeader) {
        ratesHeader = document.createElement('div');
        ratesHeader.id = 'exchangeRatesHeader';
        ratesHeader.className = 'header-rates d-flex gap-2';
        ratesHeader.style.cssText = 'background: rgba(255,255,255,0.05); padding: 5px 15px; border-radius: 20px; font-size: 0.85rem; border: 1px solid var(--border-color); margin-right: 15px;';
        ratesHeader.innerHTML = `
            <div style="color: var(--text-muted);">TCMB Kurları: </div>
            <div id="usdRate" style="font-weight: 600; color: var(--text-main);">USD: --.-- ₺</div>
            <div id="eurRate" style="font-weight: 600; color: var(--text-main);">EUR: --.-- ₺</div>
        `;
        headerActions.insertBefore(ratesHeader, headerActions.firstChild);
    }
    
    try {
        const rates = await fetchExchangeRates();
        const usdEl = document.getElementById('usdRate');
        const eurEl = document.getElementById('eurRate');
        if (usdEl) usdEl.textContent = `USD: ${rates.USD} ₺`;
        if (eurEl) eurEl.textContent = `EUR: ${rates.EUR} ₺`;
    } catch (e) {
        console.error('Kurlar yerleştirilemedi:', e);
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
        
        // Mark notifications as seen/read for the current session to dismiss red dot
        sessionStorage.setItem('etiket_crm_notif_seen', 'true');
        
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
    const badge = document.getElementById('notifBadge');
    const body = document.getElementById('notifBody');
    const countEl = document.getElementById('notifCount');
    if (!badge || !body || !countEl) return;

    const now = new Date();
    // Günde bir kez 9:00'dan sonra göster
    if (now.getHours() < 9) {
        badge.style.display = 'none';
        countEl.textContent = '0';
        body.innerHTML = '<div class="notification-empty" style="padding: 2rem; text-align: center; color: var(--text-muted);"><i class="fa-solid fa-clock" style="font-size: 1.5rem; margin-bottom: 8px; display: block; color: var(--primary);"></i> Bildirimler her gün saat 09:00\'dan sonra gösterilir.</div>';
        return;
    }

    const todayStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    const isDismissed = (localStorage.getItem('etiket_crm_notif_dismissed_date') === todayStr) || (sessionStorage.getItem('etiket_crm_notif_seen') === 'true');

    const list = calculateAllNotifications();

    if (list.length > 0 && !isDismissed) {
        badge.style.display = 'block';
        countEl.textContent = list.length;
        body.innerHTML = '';

        // "Bugün İçin Kapat" Butonu ekle
        const dismissDiv = document.createElement('div');
        dismissDiv.style = "padding: 10px 1.25rem; border-bottom: 1px solid var(--border-color); background: rgba(79, 70, 229, 0.05); display: flex; justify-content: center;";
        dismissDiv.innerHTML = `<button type="button" style="width: 100%; padding: 6px; background: var(--primary); color: white; border: none; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;"><i class="fa-solid fa-circle-check"></i> Bugünlük Bildirimleri Kapat</button>`;
        dismissDiv.querySelector('button').onclick = (e) => {
            e.stopPropagation();
            localStorage.setItem('etiket_crm_notif_dismissed_date', todayStr);
            updateNotifications();
        };
        body.appendChild(dismissDiv);

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
        if (isDismissed) {
            body.innerHTML = '<div class="notification-empty" style="padding: 2rem; text-align: center; color: var(--text-muted);"><i class="fa-solid fa-circle-check" style="font-size: 1.5rem; margin-bottom: 8px; display: block; color: var(--success);"></i> Bugünün bildirimlerini gördünüz.</div>';
        } else {
            body.innerHTML = '<div class="notification-empty" style="padding: 2rem; text-align: center; color: var(--text-muted);">Şu an için yeni bir bildirim yok.</div>';
        }
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

    // 1. Düşük Stok (Giriş: 10 ve altı, 0 dahil)
    const malzemeler = getMalzemeFiyatlari();
    malzemeler.filter(m => {
        const stokValue = (m.stok !== undefined && m.stok !== null && m.stok !== '') ? parseFloat(m.stok) : 0;
        return stokValue <= 10;
    }).forEach(m => {
        const stokValue = (m.stok !== undefined && m.stok !== null && m.stok !== '') ? parseFloat(m.stok) : 0;
        notifications.push({
            type: 'STOCK',
            title: 'Stok Azaldı!',
            desc: `${m.adi} stoğu sadece ${stokValue} ${m.birim || ''} kaldı.`,
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

// --- Çalışan / Kullanıcı Durum Listesi Güncelleme ---
function updateActiveUsersList() {
    const listContainer = document.getElementById('activeUsersList');
    if (!listContainer) return;

    let kullanicilar = [];
    try {
        kullanicilar = JSON.parse(localStorage.getItem('etiket_crm_kullanicilar') || '[]');
    } catch(e) {}

    if (kullanicilar.length === 0) {
        listContainer.innerHTML = `<span style="color: var(--text-muted); font-size: 0.75rem;">Kayıtlı kullanıcı yok</span>`;
        return;
    }

    listContainer.innerHTML = '';
    const now = new Date();

    // Kendimizi en üste alacak şekilde sıralayabiliriz
    kullanicilar.sort((a, b) => (b.durum === 'aktif' ? 1 : 0) - (a.durum === 'aktif' ? 1 : 0));

    kullanicilar.forEach(user => {
        let isOnline = false;
        const nameOrEmail = (user.ad || user.email || '').toLowerCase();
        const isPatron = nameOrEmail.includes('patron');
        if (isPatron && user.sonGorulme) {
            const lastSeenDate = new Date(user.sonGorulme);
            const diffInSeconds = Math.abs((now - lastSeenDate) / 1000);
            if (diffInSeconds <= 60 && user.durum === 'aktif') {
                isOnline = true;
            }
        }

        const userItem = document.createElement('div');
        userItem.style = "display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--text-main); padding: 2px 0;";
        
        userItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${isOnline ? 'var(--success)' : '#64748b'}; display: inline-block; box-shadow: ${isOnline ? '0 0 6px var(--success)' : 'none'};"></span>
                <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;" title="${user.email}">${user.ad || user.email.split('@')[0].toUpperCase()}</span>
            </div>
            <span style="font-size: 0.65rem; color: var(--text-muted);">${isOnline ? 'Aktif' : 'Pasif'}</span>
        `;
        listContainer.appendChild(userItem);
    });
}

// Sayfa yüklendiğinde ve storage değişiminde tetikle
document.addEventListener('DOMContentLoaded', () => {
    updateActiveUsersList();
    setInterval(updateActiveUsersList, 15000);
});
window.addEventListener('storage', updateActiveUsersList);
window.renderKullanicilar = updateActiveUsersList;

window.fixTrForPDF = function(text) {
    const trMap = { 'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U' };
    return text ? text.toString().replace(/[çÇğĞıİöÖşŞüÜ]/g, m => trMap[m]) : '';
};

// --- Global Share Modal ---
window.openShareModal = function(pdfBlob, pdfFilename, shareTitle, shareText) {
    let modal = document.getElementById('globalShareModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'globalShareModal';
        modal.className = 'modal-overlay';
        modal.style.zIndex = '99999';
        modal.innerHTML = `
            <div class="modal-content panel" style="max-width: 400px; text-align: center; padding: 20px;">
                <div class="panel-header" style="justify-content: center; position: relative; border-bottom: none; padding-bottom: 0;">
                    <h2 class="panel-title" style="font-size: 1.25rem;"><i class="fa-solid fa-share-nodes"></i> Paylaşım Seçenekleri</h2>
                    <button class="btn-icon" onclick="document.getElementById('globalShareModal').style.display='none'" style="position: absolute; right: 0px; top: -5px;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div style="padding: 1.5rem 0 0 0; display: flex; flex-direction: column; gap: 1rem;">
                    <button id="btnShareWhatsapp" class="btn" style="background: #25D366; color: white; padding: 12px; font-size: 1.1rem;">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp ile Gönder
                    </button>
                    <button id="btnShareEmail" class="btn" style="background: #ea4335; color: white; padding: 12px; font-size: 1.1rem;">
                        <i class="fa-solid fa-envelope"></i> E-Posta ile Gönder
                    </button>
                    <button id="btnSharePdf" class="btn btn-primary" style="padding: 12px; font-size: 1.1rem;">
                        <i class="fa-solid fa-file-pdf"></i> PDF Olarak İndir
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('btnShareWhatsapp').onclick = async () => {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], pdfFilename, { type: 'application/pdf' })] })) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText || '',
                    files: [new File([pdfBlob], pdfFilename, { type: 'application/pdf' })]
                });
            } catch (err) {
                if (err.name !== 'AbortError') showToast('Paylaşım desteklenmiyor.', 'warning');
            }
        } else {
            // Fallback for Whatsapp desktop/web
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = pdfFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            const text = encodeURIComponent((shareTitle || '') + ' - ' + (shareText || ''));
            window.open('https://api.whatsapp.com/send?text=' + text + '%0A%0ABelge cihazınıza indirildi, bu ekrandan dosyayı ekleyerek gönderebilirsiniz.', '_blank');
        }
        modal.style.display = 'none';
    };

    document.getElementById('btnShareEmail').onclick = async () => {
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], pdfFilename, { type: 'application/pdf' })] })) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText || '',
                    files: [new File([pdfBlob], pdfFilename, { type: 'application/pdf' })]
                });
            } catch (err) {
                if (err.name !== 'AbortError') showToast('Paylaşım desteklenmiyor.', 'warning');
            }
        } else {
            // Fallback for Email desktop/web
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = pdfFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            const subject = encodeURIComponent(shareTitle || 'CRM Dosya Paylaşımı');
            const body = encodeURIComponent((shareText || '') + '\n\nNot: Belge cihazınıza indirildi, mailinize ekleyerek gönderebilirsiniz.');
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }
        modal.style.display = 'none';
    };
    
    document.getElementById('btnSharePdf').onclick = () => {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        modal.style.display = 'none';
        showToast('PDF başarıyla indirildi.', 'success');
    };
    
    modal.style.display = 'flex';
};
