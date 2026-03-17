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

const COLLECTIONS = ['firmalar', 'siparisler', 'tahsilatlar', 'malzeme_fiyatlari', 'visits'];

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
        if (col === 'visits') {
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
    if (isSyncingFromFirestore) return;
    
    if (key.startsWith('etiket_crm_')) {
        const col = key.replace('etiket_crm_', '');
        try {
            const data = JSON.parse(value);
            if (Array.isArray(data)) {
                // 2a. Güncelle ve Ekle
                data.forEach(item => {
                    if (item.id) {
                        db.collection(col).doc(item.id).set(item, { merge: true })
                          .catch(e => {
                              console.error(`Firestore Kayıt Hatası [${col}]:`, e);
                              if (e.code === 'permission-denied') {
                                  alert('Veri Kaydedilemedi: Oturum açılmamış veya yetkiniz yok. Lütfen menüden çıkış yapıp şifreyle tekrar girerek telefon belleğinizi yenileyin.');
                              }
                          });
                    }
                });

                // 2b. Silinenleri Firestore'dan Temizle
                db.collection(col).get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        if (!data.find(d => d.id === doc.id)) {
                            doc.ref.delete();
                        }
                    });
                });
            }
        } catch (e) {
            console.error('Firebase Sync Hatası - Key: ' + key, e);
        }
    }
};

// 3. User Sign Out Injection into Sidebar
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

// 4. Connection Status Indicator for Diagnostics
document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'syncStatusIndicator';
    statusDiv.style.position = 'fixed';
    statusDiv.style.bottom = '80px';
    statusDiv.style.right = '20px';
    statusDiv.style.padding = '6px 12px';
    statusDiv.style.borderRadius = '20px';
    statusDiv.style.background = 'rgba(15, 30, 50, 0.85)';
    statusDiv.style.color = '#e2e8f0';
    statusDiv.style.fontSize = '0.75rem';
    statusDiv.style.fontWeight = '600';
    statusDiv.style.zIndex = '9999';
    statusDiv.style.border = '1px solid rgba(255,255,255,0.05)';
    statusDiv.style.display = 'flex';
    statusDiv.style.alignItems = 'center';
    statusDiv.style.gap = '6px';
    statusDiv.style.backdropFilter = 'blur(4px)';
    statusDiv.innerHTML = '<span style="width:8px; height:8px; border-radius:50%; background:#ef4444; display:inline-block;" id="statusDot"></span> Bağlantı Yok';
    document.body.appendChild(statusDiv);
    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            statusDiv.innerHTML = '<span style="width:8px; height:8px; border-radius:50%; background:#22c55e; display:inline-block; box-shadow:0 0 6px #22c55e;"></span> Bulut Senkronizasyonu Aktif';
            statusDiv.style.color = '#22c55e';
        } else {
            statusDiv.innerHTML = '<span style="width:8px; height:8px; border-radius:50%; background:#ef4444; display:inline-block; box-shadow:0 0 6px #ef4444;"></span> Oturum Açılmadı (Bulut Pasif)';
            statusDiv.style.color = '#f87171';
        }
    });
});
