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

    // 4b. Log Kutusu (Log Box)
    statusDiv.style.flexDirection = 'column';
    statusDiv.style.alignItems = 'stretch';
    statusDiv.style.width = '240px';
    
    const logBox = document.createElement('div');
    logBox.id = 'syncLogs';
    logBox.style.marginTop = '8px';
    logBox.style.maxHeight = '120px';
    logBox.style.overflowY = 'auto';
    logBox.style.fontSize = '0.65rem';
    logBox.style.color = '#94a3b8';
    logBox.style.borderTop = '1px solid rgba(255,255,255,0.08)';
    logBox.style.paddingTop = '5px';
    statusDiv.appendChild(logBox);

    window.addDiagLog = function(msg) {
        const item = document.createElement('div');
        item.style.padding = '2px 0';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
        item.textContent = `> ${msg}`;
        logBox.prepend(item); // En yeni log en üstte
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

// 6. Change Password Modal Injection
document.addEventListener('DOMContentLoaded', () => {
    // 6a. Create Modal HTML Structure
    const modalHTML = `
    <div id="changePassModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:10000; justify-content:center; align-items:center; backdrop-filter:blur(4px);">
        <div style="background:#1e293b; padding:2rem; border-radius:12px; width:90%; max-width:320px; border:1px solid rgba(255,255,255,0.08); box-shadow:0 10px 25px rgba(0,0,0,0.5);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                <div style="font-weight:600; color:#f8fafc; font-size:1.1rem;"><i class="fa-solid fa-key"></i> Şifre Değiştir</div>
                <button onclick="document.getElementById('changePassModal').style.display='none'" style="background:none; border:none; color:#94a3b8; font-size:1.2rem; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="changePassForm">
                <div style="margin-bottom:1rem;">
                    <label style="display:block; font-size:0.8rem; color:#94a3b8; margin-bottom:0.4rem;">Yeni Şifre</label>
                    <input type="password" id="newPassInput" required style="width:100%; padding:8px 12px; border-radius:6px; background:#0f172a; border:1px solid #334155; color:#f8fafc; font-size:0.9rem;" placeholder="En az 6 karakter">
                </div>
                <div style="margin-bottom:1.5rem;">
                    <label style="display:block; font-size:0.8rem; color:#94a3b8; margin-bottom:0.4rem;">Yeni Şifre (Tekrar)</label>
                    <input type="password" id="newPassInputVerify" required style="width:100%; padding:8px 12px; border-radius:6px; background:#0f172a; border:1px solid #334155; color:#f8fafc; font-size:0.9rem;" placeholder="Şifreyi onaylayın">
                </div>
                <button type="submit" style="width:100%; padding:10px; border-radius:6px; background:#3b82f6; color:#fff; border:none; font-weight:600; cursor:pointer;" id="submitPassBtn">Kaydet</button>
                <div id="passMsg" style="margin-top:0.8rem; font-size:0.75rem; text-align:center;"></div>
            </form>
        </div>
    </div>`;

    // Append modal to body
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);

    // 6b. Form Handler
    const form = document.getElementById('changePassForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const p1 = document.getElementById('newPassInput').value;
        const p2 = document.getElementById('newPassInputVerify').value;
        const msg = document.getElementById('passMsg');
        const btn = document.getElementById('submitPassBtn');

        if (p1 !== p2) {
            msg.textContent = "❌ Şifreler uyuşmuyor!";
            msg.style.color = "#ef4444";
            return;
        }

        if (p1.length < 6) {
            msg.textContent = "❌ En az 6 karakter olmalıdır!";
            msg.style.color = "#ef4444";
            return;
        }

        btn.disabled = true;
        btn.textContent = "Kaydediliyor...";
        
        const user = firebase.auth().currentUser;
        if (user) {
            user.updatePassword(p1).then(() => {
                msg.textContent = "✅ Şifre başarıyla güncellendi!";
                msg.style.color = "#22c55e";
                setTimeout(() => {
                    document.getElementById('changePassModal').style.display = 'none';
                    form.reset();
                    msg.textContent = "";
                    btn.disabled = false;
                    btn.textContent = "Kaydet";
                }, 2000);
            }).catch(e => {
                console.error(e);
                msg.textContent = "❌ Hata: " + e.message;
                msg.style.color = "#ef4444";
                btn.disabled = false;
                btn.textContent = "Kaydet";
                if (e.code === 'auth/requires-recent-login') {
                    alert('Güvenlik için bu işlemden önce çıkış yapıp tekrar şifre ile girmeniz gerekmektedir.');
                }
            });
        }
    });

    // 6c. Append trigger on sidebar next to logout
    const logoutBtn = document.getElementById('sidebarLogoutBtn');
    if (logoutBtn && !document.getElementById('sidebarPassBtn')) {
        const passBtn = document.createElement('a');
        passBtn.href = '#';
        passBtn.className = 'nav-item';
        passBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Şifre Değiştir';
        passBtn.id = 'sidebarPassBtn';
        passBtn.style.color = '#3b82f6';
        passBtn.style.marginTop = '0.5rem';
        logoutBtn.parentNode.insertBefore(passBtn, logoutBtn);
        
        passBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('changePassModal').style.display = 'flex';
        });
    }
});
