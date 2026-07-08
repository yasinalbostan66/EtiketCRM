// js/muhasebe.js

const GELIR_CATEGORIES = ['Satış Faturası', 'Tahsilat', 'Danışmanlık Geliri', 'Diğer Gelirler'];
const GIDER_CATEGORIES = ['Kira', 'Elektrik/Su/İnternet', 'Maaş & SGK', 'Hammadde Alımı', 'Yol & Yemek', 'Vergiler', 'Kargo Giderleri', 'Diğer Giderler'];
const IADE_CATEGORIES = ['Müşteri İadesi', 'Ürün İadesi', 'Hatalı Ürün İadesi', 'Fazla Teslimat İadesi', 'Diğer İade'];

document.addEventListener('DOMContentLoaded', () => {
    loadFirmaOptions();
    onTransTypeChange();
    renderMuhasebe();

    // Firebase Sync dinleyicisi
    window.addEventListener('storage', () => {
        loadFirmaOptions();
        renderMuhasebe();
    });
});

// Muhasebe verilerini al
function getMuhasebe() {
    const items = localStorage.getItem('etiket_crm_muhasebe');
    return items ? JSON.parse(items) : [];
}

// Muhasebe verilerini kaydet
function saveMuhasebeLocal(data) {
    localStorage.setItem('etiket_crm_muhasebe', JSON.stringify(data));
}

// Firmalar dropdown'ını doldur
function loadFirmaOptions() {
    const select = document.getElementById('transFirmaSec');
    if (!select) return;

    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
    const currentVal = select.value;

    select.innerHTML = '<option value="" selected>Firmadan Bağımsız (Genel Gider vs.)</option>';
    firmalar.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.ad;
        select.appendChild(opt);
    });

    if (currentVal) select.value = currentVal;
}

// İşlem tipi değiştiğinde kategorileri güncelle
function onTransTypeChange() {
    const typeSelect = document.getElementById('transType');
    const categorySelect = document.getElementById('transCategory');
    if (!typeSelect || !categorySelect) return;

    const type = typeSelect.value;
    categorySelect.innerHTML = '';

    let categories;
    if (type === 'Gelir') categories = GELIR_CATEGORIES;
    else if (type === 'İade') categories = IADE_CATEGORIES;
    else categories = GIDER_CATEGORIES;

    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });
}

// Fatura görselini Base64'e dönüştür
function handleTransFileChange(input) {
    const file = input.files[0];
    const statusDiv = document.getElementById('fileUploadStatus');
    const base64Input = document.getElementById('transFileBase64');
    
    if (!file) {
        statusDiv.style.display = 'none';
        base64Input.value = '';
        return;
    }

    // Dosya boyutu kontrolü (Firestore Firestore/LocalStorage sınırları için max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Fatura dosyası çok büyük! Lütfen 2MB altında bir görsel veya PDF yükleyin.');
        input.value = '';
        statusDiv.style.display = 'none';
        base64Input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        base64Input.value = e.target.result;
        statusDiv.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// Muhasebe listesini ekrana çiz ve kasayı hesapla
async function renderMuhasebe() {
    const tbody = document.getElementById('financeTableBody');
    if (!tbody) return;

    const query = document.getElementById('searchFinance').value.toLowerCase().trim();
    const filterType = document.getElementById('filterType').value;

    const allRecords = getMuhasebe();
    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
    
    // Kur bilgisini çek (varsayılan 1 Dolar = 35 TL civarı, dinamik çekilmeye çalışılacak)
    let usdRate = 35.0; 
    try {
        const rates = await fetchExchangeRates();
        if (rates && rates.USD) {
            usdRate = parseFloat(rates.USD) || 35.0;
        }
    } catch(e) {}

    let totalGelir = 0;
    let totalGider = 0;

    const filtered = [];

    allRecords.forEach(rec => {
        // İstatistik hesaplama (USD bazında)
        const tutar = parseFloat(rec.tutar) || 0;
        const tutarUSD = rec.doviz === 'TRY' ? (tutar / usdRate) : tutar;

        if (rec.tip === 'Gelir') {
            totalGelir += tutarUSD;
        } else {
            totalGider += tutarUSD;
        }

        // Filtreleme
        const f = firmalar.find(fr => fr.id === rec.firmaId);
        const firmaAd = f ? f.ad.toLowerCase() : '';
        const faturaNo = (rec.faturaNo || '').toLowerCase();
        const desc = (rec.description || '').toLowerCase();
        const category = (rec.kategori || '').toLowerCase();

        const matchesSearch = firmaAd.includes(query) || faturaNo.includes(query) || desc.includes(query) || category.includes(query);
        const matchesType = filterType === 'HEPSİ' || rec.tip === filterType;

        if (matchesSearch && matchesType) {
            filtered.push({
                ...rec,
                tutarUSD
            });
        }
    });

    // İstatistik Kartlarını Doldur
    document.getElementById('totalGelirUSD').textContent = formatCurrency(totalGelir);
    document.getElementById('totalGiderUSD').textContent = formatCurrency(totalGider);
    
    const netBakiye = totalGelir - totalGider;
    const netBakiyeEl = document.getElementById('netBakiyeUSD');
    netBakiyeEl.textContent = formatCurrency(netBakiye);
    if (netBakiye >= 0) {
        netBakiyeEl.style.color = 'var(--success)';
    } else {
        netBakiyeEl.style.color = 'var(--danger)';
    }

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">İşlem kaydı bulunamadı.</td></tr>`;
        return;
    }

    // Tarihe göre sırala
    filtered.sort((a, b) => new Date(b.tarih || 0) - new Date(a.tarih || 0));

    filtered.forEach(rec => {
        const f = firmalar.find(fr => fr.id === rec.firmaId);
        const dateStr = rec.tarih ? new Date(rec.tarih).toLocaleDateString('tr-TR') : 'Tarih Yok';
        
        let typeBadge = '';
        let tutarColor = 'var(--text-main)';
        if (rec.tip === 'Gelir') {
            typeBadge = `<span class="badge badge-green">GELİR</span>`;
            tutarColor = 'var(--success)';
        } else if (rec.tip === 'İade') {
            typeBadge = `<span class="badge" style="background:rgba(239,68,68,0.12); color:var(--danger);">ADE</span>`;
            tutarColor = 'var(--danger)';
        } else {
            typeBadge = `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">GİDER</span>`;
            tutarColor = '#f87171';
        }

        const formattedTutar = rec.doviz === 'USD' 
            ? formatCurrency(rec.tutar) 
            : `${parseFloat(rec.tutar).toLocaleString('tr-TR', {minimumFractionDigits:2})} ₺`;

        // Fatura butonu
        const faturaBtn = rec.faturaBase64 
            ? `<button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" onclick="viewInvoiceImage('${rec.id}')"><i class="fa-solid fa-receipt"></i> Gör</button>` 
            : `<span style="color: var(--text-muted); font-size: 0.75rem;">Dosya Yok</span>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="color: var(--text-muted); font-size: 0.9rem;">${dateStr}</td>
            <td style="font-weight: 600;">${f ? escapeHTML(f.ad) : 'Genel İşlem (Şirket içi)'}</td>
            <td><strong>${escapeHTML(rec.faturaNo || 'Makbuz Yok')}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${escapeHTML(rec.description || '-')}</span></td>
            <td><span class="badge badge-blue">${escapeHTML(rec.kategori)}</span></td>
            <td>${typeBadge}</td>
            <td style="font-weight: 700; color: ${tutarColor}">${formattedTutar}</td>
            <td>${faturaBtn}</td>
            <td style="text-align: right;">
                <button class="btn btn-icon" onclick="openEditTransactionModal('${rec.id}')" title="Kayıt Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-icon" onclick="deleteTransactionRecord('${rec.id}')" style="color: var(--danger);" title="Kaydı Sil"><i class="fa-regular fa-trash-can"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// PDF Dışa Aktarım (Gelir & Gider)
window.exportMuhasebeToPDF = async function() {
    if (typeof window.jspdf === 'undefined') {
        return showToast('PDF kütüphanesi yüklenemedi. Lütfen sayfayı yenileyin.', 'error');
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Gelir & Gider Muhasebesi Raporu', 14, 15);
    doc.setFontSize(10);
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 22);

    const table = document.querySelector('.table-wrapper table');
    if (!table) return showToast('Tablo bulunamadı!', 'error');

    const rows = [];
    const trs = table.querySelectorAll('tbody tr');
    if (trs.length === 1 && trs[0].cells.length === 1) return showToast('Aktarılacak veri yok.', 'warning');

    trs.forEach(tr => {
        const cells = tr.querySelectorAll('td');
        if (cells.length >= 6) {
            rows.push([
                cells[0].textContent.trim(),
                fixTrForPDF(cells[1].textContent.trim()),
                fixTrForPDF(cells[2].textContent.trim()),
                fixTrForPDF(cells[3].textContent.trim()),
                fixTrForPDF(cells[4].textContent.trim()),
                cells[5].textContent.trim()
            ]);
        }
    });

    doc.autoTable({
        head: [['Tarih', 'Firma', 'Fatura / Aciklama', 'Kategori', 'Tip', 'Tutar']],
        body: rows,
        startY: 30,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: { 5: { halign: 'right' } }
    });

    try {
        const pdfBlob = doc.output('blob');
        const fileName = `Muhasebe_Raporu_${new Date().toISOString().slice(0,10)}.pdf`;
        if (typeof window.openShareModal === 'function') {
            window.openShareModal(pdfBlob, fileName, 'Muhasebe Raporu', 'Güncel gelir/gider muhasebesi raporu ektedir.');
        } else {
            const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({ title: 'Muhasebe Raporu', files: [file] });
            } else {
                doc.save(fileName);
            }
        }
    } catch (err) { console.error('Share error:', err); }
};

// XSS koruması
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Modallar aç / kapa
function openNewTransactionModal() {
    document.getElementById('editTransId').value = '';
    document.getElementById('transactionForm').reset();
    document.getElementById('fileUploadStatus').style.display = 'none';
    document.getElementById('transFileBase64').value = '';
    onTransTypeChange();
    document.getElementById('newTransactionModal').style.display = 'flex';
}

function closeNewTransactionModal() {
    document.getElementById('newTransactionModal').style.display = 'none';
    document.getElementById('transactionForm').reset();
}

// Fatura görselini izleme modalı
function viewInvoiceImage(id) {
    const records = getMuhasebe();
    const rec = records.find(r => r.id === id);
    if (!rec || !rec.faturaBase64) return;

    const modal = document.getElementById('invoiceViewModal');
    const img = document.getElementById('invoiceModalImg');
    
    img.src = rec.faturaBase64;
    modal.style.display = 'flex';
}

function closeInvoiceViewModal() {
    document.getElementById('invoiceViewModal').style.display = 'none';
    document.getElementById('invoiceModalImg').src = '';
}

// Düzenleme modalı
function openEditTransactionModal(id) {
    const records = getMuhasebe();
    const rec = records.find(r => r.id === id);
    if (!rec) return;

    if (typeof checkRecordPermission === 'function' && !checkRecordPermission(rec.created_by)) {
        alert("Bu muhasebe kaydını düzenleme yetkiniz yok! Sadece oluşturan kullanıcı düzenleyebilir.");
        return;
    }

    document.getElementById('editTransId').value = rec.id;
    document.getElementById('transFirmaSec').value = rec.firmaId || '';
    document.getElementById('transType').value = rec.tip;
    onTransTypeChange();
    
    document.getElementById('transCategory').value = rec.kategori;
    document.getElementById('transFaturaNo').value = rec.faturaNo || '';
    document.getElementById('transTutar').value = rec.tutar;
    document.getElementById('transCurrency').value = rec.doviz || 'USD';
    document.getElementById('transDescription').value = rec.description || '';
    
    const base64Input = document.getElementById('transFileBase64');
    const statusDiv = document.getElementById('fileUploadStatus');
    
    if (rec.faturaBase64) {
        base64Input.value = rec.faturaBase64;
        statusDiv.style.display = 'block';
    } else {
        base64Input.value = '';
        statusDiv.style.display = 'none';
    }

    document.getElementById('newTransactionModal').style.display = 'flex';
}

// Kaydet
function saveTransactionForm(event) {
    event.preventDefault();

    const id = document.getElementById('editTransId').value;
    const firmaId = document.getElementById('transFirmaSec').value;
    const tip = document.getElementById('transType').value;
    const kategori = document.getElementById('transCategory').value;
    const faturaNo = document.getElementById('transFaturaNo').value.trim();
    const tutar = parseFloat(document.getElementById('transTutar').value) || 0;
    const doviz = document.getElementById('transCurrency').value;
    const description = document.getElementById('transDescription').value.trim();
    const faturaBase64 = document.getElementById('transFileBase64').value;

    if (!tutar) return;

    let records = getMuhasebe();

    if (id) {
        const index = records.findIndex(r => r.id === id);
        if (index !== -1) {
            records[index] = {
                ...records[index],
                firmaId, tip, kategori, faturaNo, tutar, doviz, description, faturaBase64
            };
        }
    } else {
        const currentUser = firebase.auth().currentUser;
        const newTrans = {
            id: 'tr_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
            firmaId, tip, kategori, faturaNo, tutar, doviz, description, faturaBase64,
            tarih: new Date().toISOString(),
            created_by: currentUser ? currentUser.uid : 'local_user'
        };
        records.push(newTrans);
    }

    saveMuhasebeLocal(records);
    closeNewTransactionModal();
    renderMuhasebe();

    if (typeof showToast === 'function') {
        showToast('Finansal işlem başarıyla kaydedildi.');
    }
}

// Kayıt sil
function deleteTransactionRecord(id) {
    let records = getMuhasebe();
    const rec = records.find(r => r.id === id);
    if (rec && typeof checkRecordPermission === 'function' && !checkRecordPermission(rec.created_by)) {
        alert("Bu işlemi silme yetkiniz yok! Sadece oluşturan kullanıcı silebilir.");
        return;
    }

    if (!confirm('Bu muhasebe kaydını silmek istediğinize emin misiniz?')) return;
    records = records.filter(r => r.id !== id);
    saveMuhasebeLocal(records);
    renderMuhasebe();

    if (typeof showToast === 'function') {
        showToast('İşlem silindi.', 'warning');
    }
}

// Global scope
window.renderMuhasebe = renderMuhasebe;
window.onTransTypeChange = onTransTypeChange;
window.handleTransFileChange = handleTransFileChange;
window.openNewTransactionModal = openNewTransactionModal;
window.closeNewTransactionModal = closeNewTransactionModal;
window.viewInvoiceImage = viewInvoiceImage;
window.closeInvoiceViewModal = closeInvoiceViewModal;
window.openEditTransactionModal = openEditTransactionModal;
window.saveTransactionForm = saveTransactionForm;
window.deleteTransactionRecord = deleteTransactionRecord;
