document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const firmaId = urlParams.get('id');
    
    const contentArea = document.getElementById('contentArea');
    const errorArea = document.getElementById('errorArea');
    
    if (!firmaId) {
        contentArea.style.display = 'none';
        errorArea.style.display = 'block';
        return;
    }
    
    const firma = getFirmaById(firmaId);
    
    if (!firma) {
        contentArea.style.display = 'none';
        errorArea.style.display = 'block';
        return;
    }
    
    // Firma bilgilerini bas
    contentArea.style.display = 'block';
    
    document.getElementById('detayFirmaAd').innerHTML = `
        ${firma.logo ? `<img src="${firma.logo}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border-color);">` : '<i class="fa-solid fa-building" style="color: var(--primary);"></i>'}
        ${firma.ad}
    `;
    document.getElementById('detayFirmaAd').style.display = 'flex';
    document.getElementById('detayFirmaAd').style.alignItems = 'center';
    document.getElementById('detayFirmaAd').style.gap = '12px';
    document.getElementById('detayYetkili').textContent = firma.yetkili;
    document.getElementById('detayTelefon').textContent = firma.telefon;
    document.getElementById('detayEmail').textContent = firma.email || '-';
    document.getElementById('detayAdres').textContent = firma.adres || '-';
    
    const dateObj = new Date(firma.dateAdded);
    document.getElementById('detayTarih').textContent = dateObj.toLocaleDateString('tr-TR');
    
    // Sipariş bağlantı linklerine firma ID'sini ekle
    const moduleLinks = document.getElementById('moduleLinks');
    const links = moduleLinks.querySelectorAll('a');
    links.forEach(link => {
        let currentHref = link.getAttribute('href');
        link.setAttribute('href', `${currentHref}?firmaId=${firmaId}`);
    });
    
    // Tahsilat Formu İşleyicisi
    const tahsilatForm = document.getElementById('tahsilatForm');
    tahsilatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tutar = parseFloat(document.getElementById('tahsilatTutar').value);
        const metod = document.getElementById('tahsilatMetodu').value;
        const faturaNo = document.getElementById('tahsilatFaturaNo').value.trim();
        const not = document.getElementById('tahsilatNot').value.trim();
        const editId = document.getElementById('editTahsilatId').value;

        if (isNaN(tutar) || tutar <= 0) {
            showToast('Lütfen geçerli bir tutar girin.', 'error');
            return;
        }

        if (editId) {
            updateTahsilat({
                id: editId,
                totalAmountUSD: tutar,
                method: metod,
                faturaNo: faturaNo || '-',
                note: not || 'Ödeme Tahsilatı'
            });
            showToast('Tahsilat güncellendi.', 'success');
        } else {
            addTahsilat(firmaId, {
                totalAmountUSD: tutar,
                method: metod,
                faturaNo: faturaNo || '-',
                note: not || 'Ödeme Tahsilatı'
            });
            showToast('Tahsilat başarıyla kaydedildi.', 'success');
        }

        document.getElementById('tahsilatModal').style.display = 'none';
        tahsilatForm.reset();
        document.getElementById('editTahsilatId').value = '';
        renderFirmaEkstresi(firmaId);
    });

    // Sipariş Formu İşleyicisi
    const siparisForm = document.getElementById('siparisForm');
    if (siparisForm) {
        siparisForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('editSiparisId').value;
            const tutar = parseFloat(document.getElementById('siparisToplamTutar').value);
            const metod = document.getElementById('siparisMetodu').value;
            const detaylar = document.getElementById('siparisDetaylar').value.trim();

            if (isNaN(tutar) || tutar <= 0) {
                showToast('Lütfen geçerli bir tutar girin.', 'error');
                return;
            }

            updateSiparis({
                id: id,
                totalPriceUSD: tutar,
                paymentMethod: metod,
                details: detaylar,
                status: document.getElementById('siparisDurum').value
            });

            showToast('Sipariş güncellendi.', 'success');
            document.getElementById('siparisModal').style.display = 'none';
            renderFirmaEkstresi(firmaId);
        });
    }

    // Cari Ekstreyi render et
    renderFirmaEkstresi(firmaId);
    renderAktiviteler(firmaId);
});

function renderAktiviteler(firmaId) {
    const container = document.getElementById('aktivitelerContainer');
    if (!container) return;

    const siparisler = (getSiparisler ? getSiparisler() : []).filter(s => s.firmaId === firmaId);
    const tahsilatlar = (getTahsilatlar ? getTahsilatlar() : []).filter(t => t.firmaId === firmaId);
    const allVisits = JSON.parse(localStorage.getItem('etiket_crm_ziyaretler') || '[]');
    const ziyaretler = allVisits.filter(v => v.firmaId === firmaId);

    const allRows = [
        ...siparisler.map(s => ({ date: s.date, tip: 'SİPARİŞ', tur: s.type || '-', aciklama: s.name || '-', tutar: formatCurrency(s.totalPriceUSD), tutarColor: 'var(--text-main)', raw: s })),
        ...tahsilatlar.map(t => ({ date: t.date, tip: 'TAHSİLAT', tur: t.method || '-', aciklama: t.note || 'Tahsilat', tutar: '− ' + formatCurrency(t.totalAmountUSD), tutarColor: 'var(--success)', raw: t })),
        ...ziyaretler.map(v => ({ date: v.date, tip: 'ZİYARET', tur: v.time || '-', aciklama: v.note || 'Ziyaret', tutar: '—', tutarColor: 'var(--text-muted)', raw: v }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const tipRenk = { 'SİPARİŞ': '#f59e0b', 'TAHSİLAT': '#3b82f6', 'ZİYARET': '#a78bfa' };
    const tabs = ['TÜMÜ', 'SİPARİŞ', 'TAHSİLAT', 'ZİYARET'];
    const counts = { 'TÜMÜ': allRows.length, 'SİPARİŞ': siparisler.length, 'TAHSİLAT': tahsilatlar.length, 'ZİYARET': ziyaretler.length };

    function buildTable(rows) {
        if (rows.length === 0) return `<div style="text-align:center;padding:2rem;color:var(--text-muted);"><i class="fa-solid fa-folder-open" style="font-size:2rem;opacity:0.4;"></i><p style="margin-top:.5rem;">Bu kategoride aktivite bulunamadı.</p></div>`;
        let html = `<div class="table-responsive"><table><thead><tr><th>Tarih</th><th>Tür</th><th>Kategori</th><th>Açıklama</th><th style="text-align:right;">Tutar</th></tr></thead><tbody>`;
        rows.forEach(r => {
            const dateStr = new Date(r.date).toLocaleDateString('tr-TR', { day:'2-digit', month:'2-digit', year:'numeric' });
            const renk = tipRenk[r.tip] || '#64748b';
            html += `<tr>
                <td style="color:var(--text-muted);font-size:.85rem;white-space:nowrap;">${dateStr}</td>
                <td><span class="badge" style="background:${renk}22;color:${renk};font-weight:700;">${r.tip}</span></td>
                <td style="font-size:.85rem;color:var(--text-muted);">${r.tur}</td>
                <td style="font-weight:500;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.aciklama}">${r.aciklama}</td>
                <td style="text-align:right;font-weight:700;color:${r.tutarColor};white-space:nowrap;">${r.tutar}</td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        return html;
    }

    // Sekme başlıkları
    let tabHtml = `<div style="display:flex;gap:6px;flex-wrap:wrap;padding:0.75rem 1rem;border-bottom:1px solid var(--border-color);background:var(--bg-color);">`;
    tabs.forEach(t => {
        const active = t === 'TÜMÜ' ? 'style="background:var(--primary);color:#fff;border-color:var(--primary);"' : '';
        tabHtml += `<button data-tab="${t}" class="aktiv-tab btn btn-outline" ${active} style="padding:4px 12px;font-size:.8rem;border-radius:20px;">${t} <span style="opacity:.7;font-size:.75rem;">${counts[t]}</span></button>`;
    });
    tabHtml += `</div><div id="aktiv-table-area">${buildTable(allRows)}</div>`;

    container.innerHTML = tabHtml;

    // Sekme tıklama
    container.querySelectorAll('.aktiv-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.aktiv-tab').forEach(b => {
                b.removeAttribute('style');
                b.style.cssText = 'padding:4px 12px;font-size:.8rem;border-radius:20px;';
            });
            btn.style.cssText = 'padding:4px 12px;font-size:.8rem;border-radius:20px;background:var(--primary);color:#fff;border-color:var(--primary);';
            const tab = btn.dataset.tab;
            const filtered = tab === 'TÜMÜ' ? allRows : allRows.filter(r => r.tip === tab);
            document.getElementById('aktiv-table-area').innerHTML = buildTable(filtered);
        });
    });
}


window.openTahsilatModal = function() {
    document.getElementById('tahsilatModal').style.display = 'flex';
    document.getElementById('tahsilatForm').reset();
    document.getElementById('editTahsilatId').value = '';
    const modalTitleEl = document.querySelector('#tahsilatModal .panel-title');
    if (modalTitleEl) modalTitleEl.innerHTML = '<i class="fa-solid fa-hand-holding-dollar"></i> Tahsilat / Ödeme Girişi';
    const submitBtnEl = document.getElementById('tahsilatSubmitBtn');
    if (submitBtnEl) submitBtnEl.textContent = 'Tahsilatı Kaydet';
};

function renderFirmaEkstresi(firmaId) {
    const siparisler = getFirmaSiparisleri(firmaId).map(s => ({...s, transType: 'SIPARIS'}));
    const tahsilatlar = getFirmaTahsilatlari(firmaId).map(t => ({...t, transType: 'TAHSILAT'}));
    
    const container = document.getElementById('siparisTableContainer');
    const bakiyeEl = document.getElementById('detayBakiye');
    
    // Bakiye Hesaplama: Siparişler (+) - Tahsilatlar (-)
    let totalSiparis = siparisler.reduce((acc, curr) => acc + curr.totalPriceUSD, 0);
    let totalTahsilat = tahsilatlar.reduce((acc, curr) => acc + curr.totalAmountUSD, 0);
    let netBakiye = totalSiparis - totalTahsilat;
    
    bakiyeEl.textContent = formatCurrency(netBakiye);
    bakiyeEl.style.color = netBakiye > 0 ? 'var(--danger)' : (netBakiye < 0 ? 'var(--success)' : 'var(--text-muted)');
    
    const durumEl = document.getElementById('detayDurum');
    if (durumEl) {
        if (netBakiye > 0) {
            durumEl.innerHTML = `<span class="badge badge-orange" style="font-size: 0.85rem;"><i class="fa-solid fa-circle-exclamation"></i> Borçlu</span>`;
        } else if (netBakiye < 0) {
            durumEl.innerHTML = `<span class="badge badge-green" style="font-size: 0.85rem;"><i class="fa-solid fa-circle-check"></i> Alacaklı</span>`;
        } else {
            durumEl.innerHTML = `<span class="badge badge-blue" style="font-size: 0.85rem;"><i class="fa-solid fa-check"></i> Borcu Yok</span>`;
        }
    }
    
    const allTransactions = [...siparisler, ...tahsilatlar].sort((a,b) => new Date(b.date) - new Date(a.date));

    if (allTransactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>Bu firmaya ait henüz herhangi bir işlem (sipariş veya tahsilat) bulunmamaktadır.</p>
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Tarih</th>
                        <th>İşlem Türü</th>
                        <th>Detay / Metod</th>
                        <th>Miktar/Not</th>
                        <th>Tutar ($)</th>
                        <th style="text-align: right;">İşlem</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    allTransactions.forEach(s => {
        const dateStr = new Date(s.date).toLocaleDateString('tr-TR', {day:'2-digit', month:'2-digit', year:'numeric'});
        
        let trStyle = s.transType === 'TAHSILAT' ? 'background: rgba(59, 130, 246, 0.03);' : '';
        let typeBadge = '';
        let amountStr = '';
        let amountColor = '';
        let actionBtn = '';

        if (s.transType === 'SIPARIS') {
            typeBadge = `<span class="badge ${s.type === 'Mürekkep' ? 'badge-blue' : (s.type.includes('Kağıt') ? 'badge-orange' : 'badge-green')}">${s.type}</span>`;
            if (s.status) {
                const statusColor = s.status === 'Ödendi' ? 'badge-green' : (s.status === 'Sevk Edildi' ? 'badge-blue' : 'badge-orange');
                typeBadge += ` <span class="badge ${statusColor}" style="opacity: 0.85;">${s.status}</span>`;
            }
            amountStr = formatCurrency(s.totalPriceUSD);
            amountColor = 'var(--text-main)';
            actionBtn = `
                <a href="siparis_onay.html?id=${s.id}" target="_blank" class="btn-icon" style="color: var(--primary); margin-right: 0.5rem; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;" title="Onay Formu"><i class="fa-solid fa-file-contract"></i></a>
                <button class="btn-icon" onclick="duzeltSiparis('${s.id}')" style="color: var(--warning); margin-right: 0.5rem;" title="Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon" onclick="silSiparis('${s.id}', '${firmaId}')" style="color: var(--danger);" title="Sil"><i class="fa-solid fa-trash"></i></button>
            `;
        } else {
            typeBadge = `<span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #60a5fa;">TAHSİLAT</span>`;
            amountStr = '-' + formatCurrency(s.totalAmountUSD);
            amountColor = 'var(--primary)';
            actionBtn = `
                <button class="btn-icon" onclick="duzeltTahsilat('${s.id}')" style="color: var(--warning); margin-right: 0.5rem;" title="Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-icon" onclick="silTahsilat('${s.id}', '${firmaId}')" style="color: var(--danger);" title="Sil"><i class="fa-solid fa-trash"></i></button>
            `;
        }
        
        tableHTML += `
            <tr style="${trStyle} cursor:pointer;" onclick="${s.transType === 'SIPARIS' ? `showOrderDetails('${s.id}')` : ''}">
                <td data-label="Tarih" style="color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
                <td data-label="İşlem Türü">${typeBadge}</td>
                <td data-label="Açıklama" style="font-weight: 500;">${s.name || s.method} ${s.faturaNo ? `<br><small style="color:var(--text-muted)">Fat: ${s.faturaNo}</small>` : ''}</td>
                <td data-label="Miktar">${s.quantity ? `${s.quantity} ${s.unit}` : (s.note || '-')}</td>
                <td data-label="Tutar" style="font-weight: 700; color: ${amountColor};">
                    ${amountStr}
                    ${s.totalPriceTRY ? `<br><small style="color:var(--text-muted); font-weight:400; font-size:0.75rem;">(₺${s.totalPriceTRY.toLocaleString('tr-TR', {minimumFractionDigits:2})})</small>` : ''}
                </td>
                <td style="text-align: right;" onclick="event.stopPropagation();">
                    ${actionBtn}
                </td>
            </tr>
        `;
    });
    
    tableHTML += `</tbody></table></div>`;
    container.innerHTML = tableHTML;
}

window.silSiparis = function(id, firmaId) {
    if (confirm('Siparişi silmek istediğinize emin misiniz?')) {
        let items = getSiparisler();
        saveSiparisler(items.filter(i => i.id !== id));
        renderFirmaEkstresi(firmaId);
        showToast('Sipariş silindi.', 'error');
    }
};

window.silTahsilat = function(id, firmaId) {
    if (confirm('Tahsilat kaydını silmek istediğinize emin misiniz?')) {
        let items = getTahsilatlar();
        saveTahsilatlar(items.filter(i => i.id !== id));
        renderFirmaEkstresi(firmaId);
        showToast('Tahsilat silindi.', 'error');
    }
};

window.duzeltTahsilat = function(id) {
    const t = getTahsilatlar().find(item => item.id === id);
    if (!t) return;

    document.getElementById('editTahsilatId').value = t.id;
    document.getElementById('tahsilatTutar').value = t.totalAmountUSD;
    document.getElementById('tahsilatMetodu').value = t.method;
    document.getElementById('tahsilatFaturaNo').value = t.faturaNo === '-' ? '' : t.faturaNo;
    document.getElementById('tahsilatNot').value = t.note === 'Ödeme Tahsilatı' ? '' : t.note;

    const modalTitleEl = document.querySelector('#tahsilatModal .panel-title');
    if (modalTitleEl) modalTitleEl.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Tahsilat Düzenle';
    const submitBtnEl = document.getElementById('tahsilatSubmitBtn');
    if (submitBtnEl) submitBtnEl.textContent = 'Değişiklikleri Kaydet';

    document.getElementById('tahsilatModal').style.display = 'flex';
};

window.duzeltSiparis = function(id) {
    const s = getSiparisler().find(item => item.id === id);
    if (!s) return;

    document.getElementById('editSiparisId').value = s.id;
    document.getElementById('siparisToplamTutar').value = s.totalPriceUSD;
    document.getElementById('siparisMetodu').value = s.paymentMethod || 'Nakit';
    document.getElementById('siparisDetaylar').value = s.details;
    document.getElementById('siparisDurum').value = s.status || 'Ödeme Bekliyor';

    document.getElementById('siparisModal').style.display = 'flex';
};
