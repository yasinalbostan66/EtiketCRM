// js/firebase-sync.js
const firebaseConfig = {
  apiKey: "AIzaSyDeVtAMX-q5Zlz_S-eKzEMOaAFb_5BYq-c",
  authDomain: "etiketcrm.firebaseapp.com",
  projectId: "etiketcrm",
  storageBucket: "etiketcrm.firebasestorage.app",
  messagingSenderId: "579736235492",
  appId: "1:579736235492:web:dcb3b1da19a12847842bf1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// 0. Auth Guard
auth.onAuthStateChanged(user => {
    if (!user && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
    }
});

let isSyncingFromFirestore = false;

const COLLECTIONS = ['firmalar', 'siparisler', 'tahsilatlar', 'malzeme_fiyatlari', 'ziyaretler'];

// 1. Live Sync from Firestore to LocalStorage
COLLECTIONS.forEach(col => {
    db.collection(col).onSnapshot(snapshot => {
        isSyncingFromFirestore = true;
        try {
            // 1. Mevcut yerel veriyi al
            const localItems = JSON.parse(localStorage.getItem(`etiket_crm_${col}`) || '[]');
            
            // 2. Firestore'dan gelen veriler
            const firestoreItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // 3. Birleştir (Merge)
            const merged = [...localItems];
            firestoreItems.forEach(fItem => {
                const index = merged.findIndex(l => l.id === fItem.id);
                if (index > -1) {
                    merged[index] = fItem; 
                } else {
                    merged.push(fItem); 
                }
            });

            localStorage.setItem(`etiket_crm_${col}`, JSON.stringify(merged));
        } catch (e) {
            console.error(`Snapshot İşleme Hatası [${col}]:`, e);
        } finally {
            isSyncingFromFirestore = false;
        }
        
        // Ekranları tetikle (Trigger events)
        window.dispatchEvent(new Event('storage'));
        if (typeof renderAll === 'function') renderAll();
        if (typeof renderFirmalar === 'function') renderFirmalar();
        if (typeof renderSiparisler === 'function') renderSiparisler();
        if (typeof renderTahsilatlar === 'function') renderTahsilatlar();
        if (typeof loadFirmaDetails === 'function') loadFirmaDetails();
        if (col === 'ziyaretler') {
            const calendarEl = document.getElementById('calendar');
            if (calendarEl && calendarEl.FullCalendar) {
                // FullCalendar güncellemesi tetiklenebilir
            }
        }
    });
});

// 2. Intercept saves to sync back to Firestore (Adds/Updates/Deletes)
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (typeof window.addDiagLog === 'function') window.addDiagLog(`Belleğe Yazıldı: ${key}`);
    if (isSyncingFromFirestore) return;
    
    if (key.startsWith('etiket_crm_')) {
        const col = key.replace('etiket_crm_', '');
        if (col === 'theme') return; // Filtrele
        
        try {
            const data = JSON.parse(value);
            if (Array.isArray(data)) {
                if (typeof window.addDiagLog === 'function') window.addDiagLog(`[${col}] Buluta Gönderiliyor (${data.length} adet)...`);
                
                // 2a. Güncelle ve Ekle
                data.forEach(item => {
                    if (item.id) {
                        db.collection(col).doc(item.id).set(item, { merge: true })
                          .then(() => {
                              if (typeof window.addDiagLog === 'function') window.addDiagLog(`✅ Buluta Yazıldı: ${item.ad || item.id}`);
                          })
                          .catch(e => {
                              console.error(`Firestore Kayıt Hatası [${col}]:`, e);
                              if (typeof window.addDiagLog === 'function') window.addDiagLog(`❌ Yazım Hatası: ${e.message}`);
                              if (e.code === 'permission-denied') {
                                  alert('Veri Kaydedilemedi: Oturum açılmamış veya yetkiniz yok. Menüden çıkış yapıp tekrar şifreyle girin.');
                              }
                          });
                    }
                });

                // 2b. Silinenleri Firestore'dan Temizle (GEÇİCİ OLARAK PASİF EDİLDİ - ÇATIŞMADAN DOLAYI YUTUYOR OLABİLİR)
                /*
                db.collection(col).get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        if (!data.find(d => d.id === doc.id)) {
                            doc.ref.delete();
                        }
                    });
                });
                */
            }
        } catch (e) {
            console.error('Firebase Sync Hatası - Key: ' + key, e);
        }
    }
};


// 4. Connection Status Indicator for Diagnostics (Click to Expand)
document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'syncStatusIndicator';
    statusDiv.style.position = 'fixed';
    statusDiv.style.bottom = '85px';
    statusDiv.style.right = '20px';
    statusDiv.style.width = '12px';
    statusDiv.style.height = '12px';
    statusDiv.style.borderRadius = '50%';
    statusDiv.style.background = '#ef4444';
    statusDiv.style.boxShadow = '0 0 6px #ef4444';
    statusDiv.style.zIndex = '99999';
    statusDiv.style.cursor = 'pointer';
    
    const logBox = document.createElement('div');
    logBox.id = 'syncLogs';
    logBox.style.display = 'none';
    logBox.style.position = 'fixed';
    logBox.style.bottom = '105px';
    logBox.style.right = '20px';
    logBox.style.width = '250px';
    logBox.style.background = 'rgba(15, 23, 42, 0.96)';
    logBox.style.padding = '15px';
    logBox.style.borderRadius = '12px';
    logBox.style.border = '1px solid rgba(255,255,255,0.08)';
    logBox.style.backdropFilter = 'blur(12px)';
    logBox.style.fontSize = '0.7rem';
    logBox.style.color = '#e2e8f0';
    logBox.style.maxHeight = '150px';
    logBox.style.overflowY = 'auto';
    logBox.style.zIndex = '99998';
    logBox.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';

    // Title inside logBox to help close
    const logTitle = document.createElement('div');
    logTitle.style = 'font-weight:700; margin-bottom:8px; font-size:0.75rem; color:#fff; display:flex; justify-content:space-between; align-items:center;';
    logTitle.innerHTML = '<span>⚡ Bağlantı Kayıtları</span> <span style="cursor:pointer; color:#94a3b8;" onclick="document.getElementById(\'syncLogs\').style.display=\'none\'"><i class="fa-solid fa-xmark"></i></span>';
    logBox.appendChild(logTitle);

    const logContent = document.createElement('div');
    logContent.id = 'syncLogItems';
    logBox.appendChild(logContent);

    document.body.appendChild(statusDiv);
    document.body.appendChild(logBox);

    // Tıklayınca Aç / Kapat
    statusDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = logBox.style.display === 'block';
        logBox.style.display = isOpen ? 'none' : 'block';
    });

    // Dışına tıklayınca kapansın
    document.addEventListener('click', (e) => {
        if (logBox.style.display === 'block' && e.target !== statusDiv && !logBox.contains(e.target)) {
            logBox.style.display = 'none';
        }
    });

    logBox.addEventListener('click', (e) => {
        e.stopPropagation(); // Kutu içine tıklanınca kapanmasın
    });

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            statusDiv.style.background = '#22c55e';
            statusDiv.style.boxShadow = '0 0 8px #22c55e';
            statusDiv.title = 'Bulut Senkronizasyonu Aktif';
        } else {
            statusDiv.style.background = '#ef4444';
            statusDiv.style.boxShadow = '0 0 8px #ef4444';
            statusDiv.title = 'Oturum Açılmadı';
        }
    });

    window.addDiagLog = function(msg) {
        const item = document.createElement('div');
        item.style.padding = '3px 0';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
        item.textContent = `> ${msg}`;
        const container = document.getElementById('syncLogItems');
        if (container) container.prepend(item);
    };
});

// 5. Remote Diagnostic Test Function for User
window.runDiagnosticTest = function() {
    let report = [];
    try {
        report.push("--- TANI BAŞLATILIYOR ---");
        report.push("Cihaz: " + (navigator.userAgent.indexOf('iPhone') > -1 ? 'iPhone' : 'Diğer'));
        
        if (typeof firebase === 'undefined') throw "Firebase Yüklü Değil!";
        if (!firebase.apps.length) throw "Firebase Init Başarısız!";
        
        report.push("Firebase: Yüklü ✅");
        const currUser = firebase.auth().currentUser;
        report.push("Kullanıcı: " + (currUser ? currUser.email : 'Oturum Yok ❌'));
        report.push("Kilit Durumu: " + (window.isSyncingFromFirestore === true ? 'KİLİTLİ ❌' : 'AÇIK ✅'));
        
        // Test Intercept
        if (typeof window.addDiagLog === 'function') window.addDiagLog("Test Kaydı Başlatılıyor...");
        localStorage.setItem('etiket_crm_test_diag', JSON.stringify([{ id: 'test_123', ad: 'Tanı Testi' }]));
        report.push("Test SetItem: Gönderildi ✅");
        
        // Test Firestore write
        firebase.firestore().collection('test_diag').doc('diag_doc').set({ date: new Date().toISOString(), user: currUser ? currUser.email : 'none' })
          .then(() => alert("✅ FIRESTORE YAZMA BAŞARILI! Bilgisayara Bağlantınız Sorunsuzdur. Rapor:\n\n" + report.join("\n")))
          .catch(e => alert("❌ FIRESTORE YAZMA HATASI: " + e.message + "\n\nRapor:\n\n" + report.join("\n")));

    } catch (e) {
        alert("❌ CRITICAL BUG: " + e + "\n\nRapor:\n\n" + report.join("\n"));
    }
};

// Append Test Button into Diagnostic Div
document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('syncStatusIndicator');
    if (statusDiv) {
        const btn = document.createElement('button');
        btn.textContent = '🔍 Bağlantıyı Test Et';
        btn.style.marginTop = '8px';
        btn.style.padding = '4px 8px';
        btn.style.background = '#3b82f6';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.fontSize = '0.65rem';
        btn.style.cursor = 'pointer';
        btn.onclick = (e) => { e.stopPropagation(); window.runDiagnosticTest(); };
        statusDiv.appendChild(btn);
    }
});

// Logout Button Injection to Main Sidebar
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.sidebar-nav');
    if (nav && !document.getElementById('sidebarLogoutBtn')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.className = 'nav-item';
        logoutBtn.style.marginTop = '2rem';
        logoutBtn.style.color = '#ef4444';
        logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Çıkış Yap';
        logoutBtn.id = 'sidebarLogoutBtn';
        nav.appendChild(logoutBtn);
        
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
                firebase.auth().signOut().then(() => {
                    localStorage.clear();
                    window.location.href = 'login.html';
                });
            }
        });
    }
});
