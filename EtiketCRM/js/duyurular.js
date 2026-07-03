// js/duyurular.js

document.addEventListener('DOMContentLoaded', () => {
    // Duyuruları yükle
    renderDuyurular();

    // Firebase sync dinleyicisi
    window.addEventListener('storage', renderDuyurular);
});

// Duyuruları localstorage/firebase'den al
function getDuyurular() {
    const items = localStorage.getItem('etiket_crm_duyurular');
    return items ? JSON.parse(items) : [];
}

// Duyuruları kaydet
function saveDuyurularLocal(data) {
    localStorage.setItem('etiket_crm_duyurular', JSON.stringify(data));
}

// Duyuru listesini ekrana çiz
function renderDuyurular() {
    const listContainer = document.getElementById('announcementsList');
    if (!listContainer) return;

    const query = document.getElementById('searchAnnouncements').value.toLowerCase().trim();
    const filterPriority = document.getElementById('filterPriority').value;

    const allDuyurular = getDuyurular();
    
    // Filtrele
    const filtered = allDuyurular.filter(ann => {
        const matchesSearch = (ann.baslik || '').toLowerCase().includes(query) || (ann.icerik || '').toLowerCase().includes(query);
        const matchesPriority = filterPriority === 'HEPSİ' || ann.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    listContainer.innerHTML = '';

    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="panel" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                <i class="fa-solid fa-bullhorn" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Yayınlanmış duyuru bulunmuyor.</p>
            </div>
        `;
        return;
    }

    // Tarihe göre yeniden eskiye sırala
    filtered.sort((a, b) => new Date(b.tarih || 0) - new Date(a.tarih || 0));

    filtered.forEach(ann => {
        const card = document.createElement('div');
        card.className = 'announcement-card';
        
        let priorityLabel = 'Bilgi';
        if (ann.priority === 'uyari') priorityLabel = 'Uyarı';
        if (ann.priority === 'acil') priorityLabel = 'Önemli / Acil';

        const dateStr = ann.tarih ? new Date(ann.tarih).toLocaleDateString('tr-TR', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }) : 'Tarih Belirtilmedi';

        card.innerHTML = `
            <div class="announcement-header">
                <div>
                    <h3 class="announcement-title">${escapeHTML(ann.baslik)}</h3>
                    <div class="announcement-meta">
                        <span><i class="fa-regular fa-clock"></i> ${dateStr}</span>
                        <span><i class="fa-regular fa-user"></i> Ekleyen: ${escapeHTML(ann.ekleyen || 'Sistem')}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="priority-badge priority-${ann.priority}">${priorityLabel}</span>
                    <button class="btn btn-icon" onclick="deleteAnnouncement('${ann.id}')" style="color: var(--danger); background: transparent; border: none; padding: 4px;" title="Duyuruyu Sil">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>
            <div class="announcement-content">${escapeHTML(ann.icerik)}</div>
        `;
        listContainer.appendChild(card);
    });
}

// XSS koruması
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Modal aç/kapa
function openNewAnnouncementModal() {
    document.getElementById('newAnnouncementModal').style.display = 'flex';
}

function closeNewAnnouncementModal() {
    document.getElementById('newAnnouncementModal').style.display = 'none';
    document.getElementById('announcementForm').reset();
}

// Duyuru Kaydet
function saveAnnouncement(event) {
    event.preventDefault();

    const title = document.getElementById('annTitle').value.trim();
    const priority = document.getElementById('annPriority').value;
    const content = document.getElementById('annContent').value.trim();

    if (!title || !content) return;

    const user = firebase.auth().currentUser;
    const authorName = localStorage.getItem('etiket_crm_userName') || (user ? user.email.split('@')[0].toUpperCase() : 'YÖNETİCİ');

    const newAnn = {
        id: 'ann_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
        baslik: title,
        priority: priority,
        icerik: content,
        tarih: new Date().toISOString(),
        ekleyen: authorName
    };

    const duyurular = getDuyurular();
    duyurular.push(newAnn);
    saveDuyurularLocal(duyurular);

    closeNewAnnouncementModal();
    renderDuyurular();

    if (typeof showToast === 'function') {
        showToast('Duyuru başarıyla yayınlandı!');
    }
}

// Duyuru Sil
function deleteAnnouncement(id) {
    if (!confirm('Bu duyuruyu silmek istediğinize emin misiniz?')) return;

    let duyurular = getDuyurular();
    duyurular = duyurular.filter(ann => ann.id !== id);
    saveDuyurularLocal(duyurular);
    renderDuyurular();

    if (typeof showToast === 'function') {
        showToast('Duyuru kaldırıldı.', 'warning');
    }
}

// Global scope
window.renderDuyurular = renderDuyurular;
window.deleteAnnouncement = deleteAnnouncement;
window.openNewAnnouncementModal = openNewAnnouncementModal;
window.closeNewAnnouncementModal = closeNewAnnouncementModal;
window.saveAnnouncement = saveAnnouncement;
