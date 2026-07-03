// js/teknik_servis.js

document.addEventListener('DOMContentLoaded', () => {
    // Firmalar dropdown'ını doldur
    loadFirmaOptions();
    
    // Servis listesini yükle
    renderTeknikServis();

    // Firebase sync dinleyicisi
    window.addEventListener('storage', () => {
        loadFirmaOptions();
        renderTeknikServis();
    });
});

// Teknik Servis verilerini al
function getTeknikServis() {
    const items = localStorage.getItem('etiket_crm_teknik_servis');
    return items ? JSON.parse(items) : [];
}

// Teknik Servis verilerini kaydet
function saveTeknikServisLocal(data) {
    localStorage.setItem('etiket_crm_teknik_servis', JSON.stringify(data));
}

// Firmalar dropdown'ını yükle
function loadFirmaOptions() {
    const select = document.getElementById('serviceFirmaSec');
    if (!select) return;

    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
    
    // Mevcut seçimi korumak için sakla
    const currentVal = select.value;
    
    select.innerHTML = '<option value="" disabled selected>Lütfen Firma Seçin...</option>';
    
    firmalar.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.ad;
        select.appendChild(opt);
    });

    if (currentVal) {
        select.value = currentVal;
    }
}

// Firma değiştiğinde firma yetkilisini ve telefonunu otomatik getir
function onServiceFirmaChange() {
    const select = document.getElementById('serviceFirmaSec');
    const inputYetkili = document.getElementById('serviceYetkili');
    const inputTelefon = document.getElementById('serviceTelefon');
    
    if (!select || !select.value) return;

    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
    const selectedFirma = firmalar.find(f => f.id === select.value);

    if (selectedFirma) {
        inputYetkili.value = selectedFirma.yetkili !== '-' ? selectedFirma.yetkili : '';
        inputTelefon.value = selectedFirma.telefon !== '-' ? selectedFirma.telefon : '';
    }
}

// Teknik servis listesini tabloya render et
function renderTeknikServis() {
    const tbody = document.getElementById('serviceTableBody');
    if (!tbody) return;

    const query = document.getElementById('searchService').value.toLowerCase().trim();
    const filterStatus = document.getElementById('filterStatus').value;

    const allRecords = getTeknikServis();
    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];

    const filtered = allRecords.filter(rec => {
        const f = firmalar.find(fr => fr.id === rec.firmaId);
        const firmaAd = f ? f.ad.toLowerCase() : '';
        const cihazAd = (rec.cihaz || '').toLowerCase();
        const seriNo = (rec.seriNo || '').toLowerCase();
        
        const matchesSearch = firmaAd.includes(query) || cihazAd.includes(query) || seriNo.includes(query);
        const matchesStatus = filterStatus === 'HEPSİ' || rec.durum === filterStatus;

        return matchesSearch && matchesStatus;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Eşleşen servis kaydı bulunamadı.</td></tr>`;
        return;
    }

    // Yeniden eskiye sırala
    filtered.sort((a, b) => new Date(b.tarih || 0) - new Date(a.tarih || 0));

    filtered.forEach(rec => {
        const f = firmalar.find(fr => fr.id === rec.firmaId);
        const dateStr = rec.tarih ? new Date(rec.tarih).toLocaleDateString('tr-TR') : 'Tarih Yok';
        
        let statusClass = 'status-bekliyor';
        if (rec.durum === 'İşlemde') statusClass = 'status-islemde';
        if (rec.durum === 'Tamamlandı') statusClass = 'status-tamamlandi';
        if (rec.durum === 'İptal Edildi') statusClass = 'status-iptal';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color: var(--text-muted); font-size: 0.9rem;">${dateStr}</td>
            <td style="font-weight: 600;"><a href="firma_detay.html?id=${rec.firmaId}" style="color: var(--primary); text-decoration: none;">${f ? escapeHTML(f.ad) : 'Bilinmeyen Firma'}</a></td>
            <td><strong>${escapeHTML(rec.cihaz)}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${escapeHTML(rec.urunTipi || 'Genel')})</span></td>
            <td><code>${escapeHTML(rec.seriNo || '-')}</code></td>
            <td><span class="service-status ${statusClass}">${rec.durum}</span></td>
            <td class="hide-mobile" style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHTML(rec.islem || 'Sorun henüz çözülmedi')}">${escapeHTML(rec.islem || '-')}</td>
            <td style="text-align: right;">
                <button class="btn btn-icon" onclick="openEditServiceModal('${rec.id}')" title="Kayıt Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-icon" onclick="deleteServiceRecord('${rec.id}')" style="color: var(--danger);" title="Kaydı Sil"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
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
function openNewServiceModal() {
    document.getElementById('editServiceId').value = '';
    document.getElementById('serviceForm').reset();
    document.getElementById('newServiceModal').style.display = 'flex';
}

function closeNewServiceModal() {
    document.getElementById('newServiceModal').style.display = 'none';
    document.getElementById('serviceForm').reset();
}

// Düzenleme modalı aç
function openEditServiceModal(id) {
    const records = getTeknikServis();
    const rec = records.find(r => r.id === id);
    if (!rec) return;

    if (typeof checkRecordPermission === 'function' && !checkRecordPermission(rec.created_by)) {
        alert("Bu servis kaydını düzenleme yetkiniz yok! Sadece oluşturan kullanıcı düzenleyebilir.");
        return;
    }

    document.getElementById('editServiceId').value = rec.id;
    document.getElementById('serviceFirmaSec').value = rec.firmaId;
    document.getElementById('serviceYetkili').value = rec.yetkili || '';
    document.getElementById('serviceTelefon').value = rec.telefon || '';
    document.getElementById('serviceCihaz').value = rec.cihaz || '';
    document.getElementById('serviceSeriNo').value = rec.seriNo || '';
    document.getElementById('serviceUrunTipi').value = rec.urunTipi || '';
    document.getElementById('serviceAriza').value = rec.ariza || '';
    document.getElementById('serviceIslem').value = rec.islem || '';
    document.getElementById('serviceDurum').value = rec.durum || 'Bekliyor';
    document.getElementById('serviceUcret').value = rec.ucret || '';

    document.getElementById('newServiceModal').style.display = 'flex';
}

// Teknik servis kaydını kaydet
function saveServiceForm(event) {
    event.preventDefault();

    const id = document.getElementById('editServiceId').value;
    const firmaId = document.getElementById('serviceFirmaSec').value;
    const yetkili = document.getElementById('serviceYetkili').value.trim();
    const telefon = document.getElementById('serviceTelefon').value.trim();
    const cihaz = document.getElementById('serviceCihaz').value.trim();
    const seriNo = document.getElementById('serviceSeriNo').value.trim();
    const urunTipi = document.getElementById('serviceUrunTipi').value.trim();
    const ariza = document.getElementById('serviceAriza').value.trim();
    const islem = document.getElementById('serviceIslem').value.trim();
    const durum = document.getElementById('serviceDurum').value;
    const ucret = parseFloat(document.getElementById('serviceUcret').value) || 0;

    if (!firmaId || !cihaz || !ariza) return;

    let records = getTeknikServis();

    if (id) {
        // Güncelle
        const index = records.findIndex(r => r.id === id);
        if (index !== -1) {
            records[index] = {
                ...records[index],
                firmaId, yetkili, telefon, cihaz, seriNo, urunTipi, ariza, islem, durum, ucret
            };
        }
    } else {
        // Yeni Ekle
        const currentUser = firebase.auth().currentUser;
        const newRecord = {
            id: 'srv_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
            firmaId, yetkili, telefon, cihaz, seriNo, urunTipi, ariza, islem, durum, ucret,
            tarih: new Date().toISOString(),
            created_by: currentUser ? currentUser.uid : 'local_user'
        };
        records.push(newRecord);
    }

    saveTeknikServisLocal(records);
    closeNewServiceModal();
    renderTeknikServis();

    if (typeof showToast === 'function') {
        showToast(id ? 'Teknik servis kaydı güncellendi.' : 'Yeni teknik servis kaydı oluşturuldu.');
    }
}

// Kayıt sil
function deleteServiceRecord(id) {
    let records = getTeknikServis();
    const rec = records.find(r => r.id === id);
    if (rec && typeof checkRecordPermission === 'function' && !checkRecordPermission(rec.created_by)) {
        alert("Bu servis kaydını silme yetkiniz yok! Sadece oluşturan kullanıcı silebilir.");
        return;
    }

    if (!confirm('Bu teknik servis kaydını silmek istediğinize emin misiniz?')) return;
    records = records.filter(r => r.id !== id);
    saveTeknikServisLocal(records);
    renderTeknikServis();

    if (typeof showToast === 'function') {
        showToast('Kayıt silindi.', 'warning');
    }
}

// Global scope
window.renderTeknikServis = renderTeknikServis;
window.onServiceFirmaChange = onServiceFirmaChange;
window.openNewServiceModal = openNewServiceModal;
window.closeNewServiceModal = closeNewServiceModal;
window.openEditServiceModal = openEditServiceModal;
window.saveServiceForm = saveServiceForm;
window.deleteServiceRecord = deleteServiceRecord;
