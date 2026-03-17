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
    if (localStorage.getItem('debug_bypass_auth') === 'true') return; // Debug Geçici Giriş
    if (!user && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
    }
});

// Dynamic bypass wrapper injector for login.html explicitly
if (window.location.pathname.endsWith('login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('loginForm');
        if (form && !document.getElementById('dynamicBypassBtn')) {
            const p = document.createElement('p');
            p.style.textAlign = 'center';
            p.style.fontSize = '1.1rem';
            p.style.marginTop = '2rem';
            p.style.background = 'rgba(239, 68, 68, 0.1)';
            p.style.padding = '10px';
            p.style.border = '1px dashed #ef4444';
            p.style.borderRadius = '8px';
            p.innerHTML = `<a href="#" id="dynamicBypassBtn" onclick="localStorage.setItem('debug_bypass_auth', 'true'); window.location.href='index.html'; return false;" style="color: #ef4444; text-decoration: none; font-weight:700;">🚨 BURAYA TIKLAYARAK GİRİŞ YAPIN 🚨</a>`;
            form.appendChild(p);
        }
    });
}

let isSyncingFromFirestore = false;

const COLLECTIONS = ['firmalar', 'siparisler', 'tahsilatlar', 'malzeme_fiyatlari', 'visits'];

// 1. Live Sync from Firestore to LocalStorage
COLLECTIONS.forEach(col => {
    db.collection(col).onSnapshot(snapshot => {
        isSyncingFromFirestore = true;
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        localStorage.setItem(`etiket_crm_${col}`, JSON.stringify(items));
        isSyncingFromFirestore = false;
        
        // Tetikleme: Sayfada ilgili render fonksiyonu varsa günceller
        if (typeof renderFirmalar === 'function' && col === 'firmalar') renderFirmalar();
        if (typeof renderSiparisler === 'function' && col === 'siparisler') renderSiparisler();
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
                        db.collection(col).doc(item.id).set(item, { merge: true });
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
