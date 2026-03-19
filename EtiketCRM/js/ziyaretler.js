const getVisits = () => JSON.parse(localStorage.getItem('etiket_crm_ziyaretler')) || [];
const saveVisits = (visits) => {
    localStorage.setItem('etiket_crm_ziyaretler', JSON.stringify(visits));
    try {
        if (firebase.auth().currentUser) {
            visits.forEach(item => {
                if (item.id) {
                    firebase.firestore().collection('ziyaretler').doc(item.id).set(item, { merge: true })
                       .catch(e => console.error("Firestore Save Fail (Visits):", e));
                }
            });
        }
    } catch (e) {}
};

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('ziyaretTableBody');
    const form = document.getElementById('ziyaretForm');
    const searchInput = document.getElementById('searchInput');
    const iptalBtn = document.getElementById('iptalBtn');

    if (!tableBody || !form) return;

    // Firma Seçim Kutusunu Doldur
    function populateFirmaSelect() {
        const select = document.getElementById('visitFirma');
        const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
        select.innerHTML = '<option value="">Seçiniz...</option>';
        firmalar.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = f.ad;
            select.appendChild(opt);
        });
    }
    populateFirmaSelect();

    function renderTable() {
        const visits = getVisits().sort((a, b) => new Date(b.date) - new Date(a.date));
        const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        tableBody.innerHTML = '';

        if (visits.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">Henüz ziyaret kaydı bulunmuyor.</td></tr>`;
            return;
        }

        filteredCount = 0;
        visits.forEach(v => {
            const f = firmalar.find(item => item.id === v.firmaId);
            const firmaAd = f ? f.ad : 'Bilinmeyen Firma';

            if (firmaAd.toLowerCase().includes(searchTerm) || (v.note && v.note.toLowerCase().includes(searchTerm))) {
                filteredCount++;
                const tr = document.createElement('tr');
                const dateStr = new Date(v.date).toLocaleDateString('tr-TR');
                const statusHTML = `<span class="badge ${v.status === 'Tamamlandı' ? 'badge-green' : (v.status === 'İptal Edildi' ? 'badge-orange' : 'badge-blue')}">${v.status || 'Planlandı'}</span>`;
                tr.innerHTML = `
                    <td style="font-weight:600;">${dateStr}</td>
                    <td>${v.time || '-'}</td>
                    <td>${firmaAd}</td>
                    <td>${statusHTML}</td>
                    <td style="font-size:0.85rem; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${v.note || ''}">${v.note || '-'}</td>
                    <td>
                        <div style="display: flex; justify-content: flex-end; gap: 10px; align-items: center;">
                            <button class="btn-icon" onclick="duzeltZiyaret('${v.id}')" style="color: var(--warning);" title="Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon" onclick="silZiyaret('${v.id}')" style="color: var(--danger);" title="Sil"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            }
        });

        if (filteredCount === 0 && visits.length > 0) {
             tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">Arama kriterine uygun kayıt bulunamadı.</td></tr>`;
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('editVisitId').value;
        const firmaId = document.getElementById('visitFirma').value;
        const date = document.getElementById('visitTarih').value;
        const time = document.getElementById('visitSaat').value;
        const note = document.getElementById('visitNot').value;
        const durum = document.getElementById('visitDurum').value;

        if (!firmaId || !date) {
            showToast('Lütfen firma ve tarih seçiniz.', 'error');
            return;
        }

        let visits = getVisits();
        if (editId) {
             visits = visits.map(v => v.id === editId ? { ...v, firmaId, date, time, note, status: durum } : v);
             showToast('Ziyaret güncellemesi kaydedildi.', 'success');
        } else {
             visits.push({
                 id: 'vis_' + Date.now().toString(36),
                 firmaId,
                 date,
                 time,
                 note,
                 status: durum
             });
             showToast('Yeni ziyaret kaydı eklendi.', 'success');
        }

        saveVisits(visits);
        closeZiyaretModal();
        renderTable();
    });

    window.openZiyaretModal = function() {
        form.reset();
        document.getElementById('editVisitId').value = '';
        document.getElementById('modalTitle').innerHTML = '<i class="fa-solid fa-plus-circle"></i> Yeni Ziyaret Kaydı Ekle';
        document.getElementById('kaydetBtn').textContent = 'Kaydı Kaydet';
        document.getElementById('ziyaretModal').style.display = 'flex';
    };

    window.closeZiyaretModal = function() {
        document.getElementById('ziyaretModal').style.display = 'none';
        form.reset();
    };

    window.duzeltZiyaret = function(id) {
        const v = getVisits().find(item => item.id === id);
        if (!v) return;

        document.getElementById('editVisitId').value = v.id;
        document.getElementById('visitFirma').value = v.firmaId;
        document.getElementById('visitTarih').value = v.date;
        document.getElementById('visitSaat').value = v.time || '';
        document.getElementById('visitNot').value = v.note || '';
        if (document.getElementById('visitDurum')) {
             document.getElementById('visitDurum').value = v.status || 'Planlandı';
        }

        document.getElementById('modalTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Ziyaret Kaydını Düzenle';
        document.getElementById('kaydetBtn').textContent = 'Güncelle';
        document.getElementById('ziyaretModal').style.display = 'flex';
    };

    window.silZiyaret = function(id) {
        if (confirm('Bu ziyaret kaydını silmek istediğinize emin misiniz?')) {
            const visits = getVisits().filter(v => v.id !== id);
            saveVisits(visits);
            showToast('Ziyaret kaydı silindi.', 'warning');
            renderTable();
        }
    };

    if (iptalBtn) {
        iptalBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('editVisitId').value = '';
            iptalBtn.style.display = 'none';
            document.querySelector('#ziyaretForm .panel-title').innerHTML = '<i class="fa-solid fa-plus-circle"></i> Yeni Ziyaret Kaydı Ekle';
            document.getElementById('kaydetBtn').textContent = 'Kaydı Kaydet';
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', renderTable);
    }

    // Bulut Senkronizasyonu Tetikleyicisi
    window.addEventListener('storage', () => {
        if (typeof renderTable === 'function') renderTable();
    });

    renderTable();
});
