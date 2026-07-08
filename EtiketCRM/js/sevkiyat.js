// js/sevkiyat.js

document.addEventListener('DOMContentLoaded', () => {
    // Dropdown lists
    loadShipmentFirmaOptions();
    
    // Set default filter date or trigger initial render
    renderSevkiyatlar();

    // Listen for storage events (e.g., Firestore live sync updates)
    window.addEventListener('storage', () => {
        loadShipmentFirmaOptions();
        renderSevkiyatlar();
    });
});

// Dropdown: Load all firm options
function loadShipmentFirmaOptions() {
    const select = document.getElementById('shipmentFirmaSec');
    if (!select) return;

    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
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

// Event handler: When selected Firma changes
function onShipmentFirmaChange() {
    const selectFirma = document.getElementById('shipmentFirmaSec');
    const selectSiparis = document.getElementById('shipmentSiparisSec');
    const textareaAdres = document.getElementById('shipmentAdres');

    if (!selectFirma || !selectFirma.value) return;
    
    const firmaId = selectFirma.value;
    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
    const selectedFirma = firmalar.find(f => f.id === firmaId);

    // 1. Autofill Address
    if (selectedFirma && textareaAdres) {
        textareaAdres.value = (selectedFirma.adres && selectedFirma.adres !== '-') ? selectedFirma.adres : '';
    }

    // 2. Populate orders for this company
    if (selectSiparis) {
        selectSiparis.innerHTML = '<option value="">Sipariş Seçin (Opsiyonel)...</option>';
        const siparisler = typeof getSiparisler === 'function' ? getSiparisler() : [];
        const firmaSiparisleri = siparisler.filter(s => s.firmaId === firmaId);

        if (firmaSiparisleri.length === 0) {
            selectSiparis.innerHTML = '<option value="">Bu firmaya ait aktif sipariş bulunmamaktadır.</option>';
        } else {
            firmaSiparisleri.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = `${s.name} (${s.type}) - $${parseFloat(s.totalPriceUSD || 0).toFixed(2)}`;
                selectSiparis.appendChild(opt);
            });
        }
    }
}

// Render Shipments with search and status filtering
function renderSevkiyatlar() {
    const tbody = document.getElementById('shipmentTableBody');
    if (!tbody) return;

    const query = document.getElementById('searchShipment').value.toLowerCase().trim();
    const filterStatus = document.getElementById('filterShipmentStatus').value;

    const allShipments = typeof getSevkiyatlar === 'function' ? getSevkiyatlar() : [];
    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
    const siparisler = typeof getSiparisler === 'function' ? getSiparisler() : [];

    // Calculate Stats
    let total = allShipments.length;
    let prep = 0, yolda = 0, teslim = 0;

    allShipments.forEach(s => {
        if (s.durum === 'Hazırlanıyor') prep++;
        if (s.durum === 'Yolda') yolda++;
        if (s.durum === 'Teslim Edildi') teslim++;
    });

    document.getElementById('statTotalSevkiyat').textContent = total;
    document.getElementById('statPreparing').textContent = prep;
    document.getElementById('statOnTheWay').textContent = yolda;
    document.getElementById('statDelivered').textContent = teslim;

    // Filter list
    const filtered = allShipments.filter(item => {
        const firma = firmalar.find(f => f.id === item.firmaId);
        const siparis = siparisler.find(s => s.id === item.siparisId);
        
        const firmaAd = firma ? firma.ad.toLowerCase() : '';
        const siparisAd = siparis ? siparis.name.toLowerCase() : '';
        const takipNo = (item.takipNo || '').toLowerCase();
        const tasiyici = (item.tasiyici || '').toLowerCase();
        const notlar = (item.notlar || '').toLowerCase();

        const matchesSearch = firmaAd.includes(query) || 
                              siparisAd.includes(query) || 
                              takipNo.includes(query) || 
                              tasiyici.includes(query) || 
                              notlar.includes(query);

        const matchesStatus = filterStatus === 'HEPSİ' || item.durum === filterStatus;

        return matchesSearch && matchesStatus;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">Eşleşen sevkiyat kaydı bulunamadı.</td></tr>`;
        return;
    }

    // Sort: Newest created/planned first
    filtered.sort((a, b) => new Date(b.tarih || 0) - new Date(a.tarih || 0));

    filtered.forEach(item => {
        const f = firmalar.find(fr => fr.id === item.firmaId);
        const s = siparisler.find(sp => sp.id === item.siparisId);
        
        const dateStr = item.tarih ? new Date(item.tarih).toLocaleDateString('tr-TR') : 'Tarih Yok';
        const deliveryDateStr = item.teslimTarihi ? new Date(item.teslimTarihi).toLocaleDateString('tr-TR') : 'Planlanmadı';
        
        let statusClass = 'status-hazirlaniyor';
        if (item.durum === 'Yolda') statusClass = 'status-yolda';
        if (item.durum === 'Teslim Edildi') statusClass = 'status-teslimat';
        if (item.durum === 'İptal Edildi') statusClass = 'status-iptal';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color: var(--text-muted); font-size: 0.9rem;">${dateStr}</td>
            <td style="font-weight: 600;">
                <a href="firma_detay.html?id=${item.firmaId}" style="color: var(--primary); text-decoration: none;">
                    ${f ? escapeHTML(f.ad) : 'Bilinmeyen Firma'}
                </a>
            </td>
            <td>${s ? `<strong>${escapeHTML(s.name)}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${escapeHTML(s.type)})</span>` : '<span style="color: var(--text-muted); font-style: italic;">Siparişsiz Gönderim</span>'}</td>
            <td><span class="badge" style="background: rgba(167, 139, 250, 0.1); color: #a78bfa; font-weight: 600; padding: 4px 8px; border-radius: 6px;">${escapeHTML(item.tasiyici || 'Diğer')}</span></td>
            <td><code>${escapeHTML(item.takipNo || '-')}</code></td>
            <td><span class="shipment-status ${statusClass}">${item.durum}</span></td>
            <td style="font-weight: 500;">${deliveryDateStr}</td>
            <td style="text-align: right; white-space: nowrap;">
                <button class="btn btn-icon" onclick="openPrintStickerModal('${item.id}')" title="Etiket Yazdır" style="color: #38bdf8;"><i class="fa-solid fa-print"></i></button>
                <button class="btn btn-icon" onclick="openEditShipmentModal('${item.id}')" title="Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-icon" onclick="deleteShipmentRecord('${item.id}')" style="color: var(--danger);" title="Sil"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// XSS Sanitizer Helper
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Modal open/close
function openNewShipmentModal() {
    document.getElementById('editShipmentId').value = '';
    document.getElementById('shipmentForm').reset();
    document.getElementById('shipmentModalTitle').innerHTML = '<i class="fa-solid fa-truck-fast"></i> Yeni Sevkiyat Planla';
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('shipmentTeslimTarihi').value = today;

    document.getElementById('newShipmentModal').style.display = 'flex';
}

function closeNewShipmentModal() {
    document.getElementById('newShipmentModal').style.display = 'none';
    document.getElementById('shipmentForm').reset();
}

// Load edit form fields
function openEditShipmentModal(id) {
    const records = typeof getSevkiyatlar === 'function' ? getSevkiyatlar() : [];
    const item = records.find(r => r.id === id);
    if (!item) return;

    if (typeof checkRecordPermission === 'function' && !checkRecordPermission(item.created_by)) {
        alert("Bu sevkiyat kaydını düzenleme yetkiniz yok! Sadece oluşturan kullanıcı düzenleyebilir.");
        return;
    }

    document.getElementById('editShipmentId').value = item.id;
    document.getElementById('shipmentModalTitle').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Sevkiyat Düzenle';

    // Set company select, trigger dynamic address & order loading
    document.getElementById('shipmentFirmaSec').value = item.firmaId;
    onShipmentFirmaChange();

    // Wait slightly to let select populate from onShipmentFirmaChange
    setTimeout(() => {
        if (item.siparisId) {
            document.getElementById('shipmentSiparisSec').value = item.siparisId;
        }
        document.getElementById('shipmentDurum').value = item.durum || 'Hazırlanıyor';
        document.getElementById('shipmentTasiyici').value = item.tasiyici || 'Kargo';
        document.getElementById('shipmentTakipNo').value = item.takipNo || '';
        document.getElementById('shipmentTeslimTarihi').value = item.teslimTarihi ? item.teslimTarihi.split('T')[0] : '';
        document.getElementById('shipmentAdres').value = item.adres || '';
        document.getElementById('shipmentNotlar').value = item.notlar || '';

        document.getElementById('newShipmentModal').style.display = 'flex';
    }, 50);
}

// Form Submission handler
function saveShipmentForm(event) {
    event.preventDefault();

    const id = document.getElementById('editShipmentId').value;
    const firmaId = document.getElementById('shipmentFirmaSec').value;
    const siparisId = document.getElementById('shipmentSiparisSec').value;
    const durum = document.getElementById('shipmentDurum').value;
    const tasiyici = document.getElementById('shipmentTasiyici').value;
    const takipNo = document.getElementById('shipmentTakipNo').value.trim();
    const teslimTarihi = document.getElementById('shipmentTeslimTarihi').value;
    const adres = document.getElementById('shipmentAdres').value.trim();
    const notlar = document.getElementById('shipmentNotlar').value.trim();

    if (!firmaId || !tasiyici || !teslimTarihi) {
        if (typeof showToast === 'function') showToast('Lütfen zorunlu alanları doldurun.', 'error');
        return;
    }

    let records = typeof getSevkiyatlar === 'function' ? getSevkiyatlar() : [];

    if (id) {
        // Edit Mode
        const index = records.findIndex(r => r.id === id);
        if (index !== -1) {
            records[index] = {
                ...records[index],
                firmaId, siparisId, durum, tasiyici, takipNo, teslimTarihi, adres, notlar
            };
        }
    } else {
        // Insert Mode
        const currentUser = firebase.auth().currentUser;
        const newRecord = {
            id: 'sh_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
            firmaId, siparisId, durum, tasiyici, takipNo, teslimTarihi, adres, notlar,
            tarih: new Date().toISOString(),
            created_by: currentUser ? currentUser.uid : 'local_user'
        };
        records.push(newRecord);
    }

    if (typeof saveSevkiyatlar === 'function') {
        saveSevkiyatlar(records);
    } else {
        localStorage.setItem('etiket_crm_sevkiyatlar', JSON.stringify(records));
    }

    // Trigger UI reload globally and locally
    window.dispatchEvent(new Event('storage'));
    closeNewShipmentModal();
    renderSevkiyatlar();

    if (typeof showToast === 'function') {
        showToast(id ? 'Sevkiyat kaydı güncellendi.' : 'Yeni sevkiyat kaydı oluşturuldu.', 'success');
    }
}

// Delete Record
function deleteShipmentRecord(id) {
    let records = typeof getSevkiyatlar === 'function' ? getSevkiyatlar() : [];
    const item = records.find(r => r.id === id);
    if (item && typeof checkRecordPermission === 'function' && !checkRecordPermission(item.created_by)) {
        alert("Bu sevkiyat kaydını silme yetkiniz yok! Sadece oluşturan kullanıcı silebilir.");
        return;
    }

    if (!confirm('Bu sevkiyat kaydını silmek istediğinizden emin misiniz?')) return;
    
    records = records.filter(r => r.id !== id);
    
    if (typeof saveSevkiyatlar === 'function') {
        saveSevkiyatlar(records);
    } else {
        localStorage.setItem('etiket_crm_sevkiyatlar', JSON.stringify(records));
    }

    window.dispatchEvent(new Event('storage'));
    renderSevkiyatlar();

    if (typeof showToast === 'function') {
        showToast('Sevkiyat kaydı silindi.', 'warning');
    }
}

// STICKER / WAYBILL LABEL GENERATION
function openPrintStickerModal(id) {
    const records = typeof getSevkiyatlar === 'function' ? getSevkiyatlar() : [];
    const item = records.find(r => r.id === id);
    if (!item) return;

    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
    const f = firmalar.find(fr => fr.id === item.firmaId);
    
    const siparisler = typeof getSiparisler === 'function' ? getSiparisler() : [];
    const s = siparisler.find(sp => sp.id === item.siparisId);

    const senderName = localStorage.getItem('etiket_crm_companyName') || 'LINKUP ETİKET SAN. TİC.';
    const dateStr = new Date().toLocaleDateString('tr-TR');
    
    // Generate barcode layout
    let barcodeLines = '';
    for (let i = 0; i < 40; i++) {
        const thickness = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
        const spacing = [1, 2][Math.floor(Math.random() * 2)];
        barcodeLines += `<div style="width: ${thickness}px; margin-right: ${spacing}px; background: #000; height: 40px;"></div>`;
    }

    const modalArea = document.getElementById('printStickerArea');
    modalArea.innerHTML = `
        <div class="sticker-header">
            <div style="font-weight: 800; font-size: 1.15rem; letter-spacing: 1px;">${escapeHTML(senderName)}</div>
            <div style="font-size: 0.65rem; color: #333; margin-top: 3px;">CRM SEVKİYAT SEVK FORMU</div>
        </div>
        
        <div style="font-size: 0.75rem; margin-bottom: 8px;">
            <strong>TARİH:</strong> ${dateStr} <br>
            <strong>TAŞIYICI:</strong> ${escapeHTML(item.tasiyici)} <br>
            <strong>TAKİP/İRSALİYE:</strong> ${escapeHTML(item.takipNo || 'Belirtilmedi')}
        </div>
        
        <div style="border: 1px solid #000; padding: 8px; margin: 10px 0; border-radius: 6px; background: #fafafa;">
            <div style="font-size: 0.7rem; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 5px; text-transform: uppercase;">ALICI (RECIPIENT)</div>
            <div style="font-size: 0.85rem; font-weight: bold;">${f ? escapeHTML(f.ad) : 'Bilinmeyen Müşteri'}</div>
            <div style="font-size: 0.75rem; margin-top: 4px;">
                <strong>Yetkili:</strong> ${f && f.yetkili && f.yetkili !== '-' ? escapeHTML(f.yetkili) : 'Belirtilmedi'} <br>
                <strong>Tel:</strong> ${f && f.telefon && f.telefon !== '-' ? escapeHTML(f.telefon) : 'Belirtilmedi'} <br>
                <strong>Adres:</strong> ${escapeHTML(item.adres || (f ? f.adres : 'Adres Kaydı Yok'))}
            </div>
        </div>

        <div style="font-size: 0.75rem; min-height: 40px; border: 1px solid #000; border-radius: 6px; padding: 6px; margin-bottom: 10px;">
            <strong>İçerik Detayları:</strong> <br>
            ${s ? `1 Paket - ${escapeHTML(s.name)} (${escapeHTML(s.type)})` : 'Sipariş Dışı Gönderi'}
            ${item.notlar ? `<div style="font-size: 0.65rem; color: #555; margin-top: 4px;"><strong>Not:</strong> ${escapeHTML(item.notlar)}</div>` : ''}
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 15px;">
            <div style="display: flex; align-items: flex-end;">
                ${barcodeLines}
            </div>
            <div style="font-size: 0.75rem; font-weight: bold; letter-spacing: 4px; margin-top: 3px;">*${item.id.toUpperCase()}*</div>
        </div>

        <div class="sticker-footer">
            <div style="font-size: 0.6rem; color: #444;">LINKUP CRM TEKNOLOJİSİ İLE ÜRETİLMİŞTİR</div>
        </div>
    `;

    document.getElementById('printStickerModal').style.display = 'flex';
}

function closePrintStickerModal() {
    document.getElementById('printStickerModal').style.display = 'none';
}

function triggerPrint() {
    window.print();
}

// Global Exports for inline HTML click events
window.renderSevkiyatlar = renderSevkiyatlar;
window.onShipmentFirmaChange = onShipmentFirmaChange;
window.openNewShipmentModal = openNewShipmentModal;
window.closeNewShipmentModal = closeNewShipmentModal;
window.openEditShipmentModal = openEditShipmentModal;
window.saveShipmentForm = saveShipmentForm;
window.deleteShipmentRecord = deleteShipmentRecord;
window.openPrintStickerModal = openPrintStickerModal;
window.closePrintStickerModal = closePrintStickerModal;
window.triggerPrint = triggerPrint;
