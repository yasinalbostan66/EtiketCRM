// js/iadeler.js - İade Yönetimi

document.addEventListener('DOMContentLoaded', () => {
    // --- Buton bağlama ---
    const btnYeniIade = document.getElementById('btnYeniIade');
    if (btnYeniIade) btnYeniIade.addEventListener('click', openIadeModal);

    const btnCloseIadeModal = document.getElementById('btnCloseIadeModal');
    if (btnCloseIadeModal) btnCloseIadeModal.addEventListener('click', closeIadeModal);

    const btnCancelIade = document.getElementById('btnCancelIade');
    if (btnCancelIade) btnCancelIade.addEventListener('click', closeIadeModal);

    // Modal dışına tıklayınca kapat
    const iadeModal = document.getElementById('iadeModal');
    if (iadeModal) {
        iadeModal.addEventListener('click', (e) => {
            if (e.target === iadeModal) closeIadeModal();
        });
    }

    // Mobil menü
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.sidebar')?.classList.add('active');
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
            }
            overlay.classList.add('active');
            overlay.addEventListener('click', () => {
                document.querySelector('.sidebar')?.classList.remove('active');
                overlay.classList.remove('active');
            });
        });
    }

    // Arama ve filtre
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', () => renderIadeler());

    const filterFirma = document.getElementById('filterFirma');
    if (filterFirma) filterFirma.addEventListener('change', () => renderIadeler());

    // Tutar - kur ipucu
    const iadeTutar = document.getElementById('iadeTutar');
    const iadeUSD = document.getElementById('iadeUSD');
    const iadeTRY = document.getElementById('iadeTRY');
    if (iadeTutar) {
        iadeTutar.addEventListener('input', updateTutarHint);
        iadeUSD?.addEventListener('change', updateTutarHint);
        iadeTRY?.addEventListener('change', updateTutarHint);
    }

    // Stok Düş işlemleri
    const iadeStokDus = document.getElementById('iadeStokDus');
    const iadeStokAlanlari = document.getElementById('iadeStokAlanlari');
    if (iadeStokDus && iadeStokAlanlari) {
        iadeStokDus.addEventListener('change', (e) => {
            iadeStokAlanlari.style.display = e.target.checked ? 'block' : 'none';
        });
    }

    // Form kaydetme
    const iadeForm = document.getElementById('iadeForm');
    if (iadeForm) iadeForm.addEventListener('submit', handleIadeSubmit);

    // Storage değişince güncelle
    window.addEventListener('storage', () => {
        populateFirmaDropdown();
        renderIadeler();
    });

    // İlk yükleme
    populateFirmaDropdown();
    renderIadeler();
});

// ── Yardımcı Fonksiyonlar ──────────────────────────────────

function updateTutarHint() {
    const val = parseFloat(document.getElementById('iadeTutar')?.value || 0);
    const isUSD = document.getElementById('iadeUSD')?.checked;
    const rate = parseFloat(window.lastRates?.USD || 32.50);
    const hintEl = document.getElementById('iadeTutarHint');
    if (!hintEl) return;
    if (val > 0) {
        hintEl.textContent = isUSD
            ? `≈ ₺${(val * rate).toLocaleString('tr-TR', {maximumFractionDigits:2})}`
            : `≈ $${(val / rate).toLocaleString('en-US', {maximumFractionDigits:2})}`;
    } else {
        hintEl.textContent = '';
    }
}

function populateFirmaDropdown() {
    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];

    // Ana form select
    const iadeFirma = document.getElementById('iadeFirma');
    if (iadeFirma) {
        iadeFirma.innerHTML = '<option value="">Firma Seçin...</option>';
        firmalar.sort((a, b) => a.ad.localeCompare(b.ad, 'tr')).forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = f.ad + (f.durum === 'Pasif' ? ' (Pasif)' : '');
            iadeFirma.appendChild(opt);
        });
    }

    // Filtre select
    const filterFirma = document.getElementById('filterFirma');
    if (filterFirma) {
        const cur = filterFirma.value;
        filterFirma.innerHTML = '<option value="">Tüm Firmalar</option>';
        firmalar.sort((a, b) => a.ad.localeCompare(b.ad, 'tr')).forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = f.ad;
            filterFirma.appendChild(opt);
        });
        filterFirma.value = cur;
    }

    // Malzemeleri yükle
    const iadeMalzemeSec = document.getElementById('iadeMalzemeSec');
    if (iadeMalzemeSec) {
        const malzemeler = typeof getMalzemeFiyatlari === 'function' ? getMalzemeFiyatlari() : [];
        iadeMalzemeSec.innerHTML = '<option value="">Malzeme Seçin...</option>';
        malzemeler.sort((a, b) => a.adi.localeCompare(b.adi, 'tr')).forEach(m => {
            const opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = `${m.turu} - ${m.adi}`;
            iadeMalzemeSec.appendChild(opt);
        });
    }
}

function renderIadeler() {
    const tbody = document.getElementById('iadeTableBody');
    if (!tbody) return;

    const iadeler = typeof getIadeler === 'function' ? getIadeler() : [];
    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];

    const searchText = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const filterFirmaId = document.getElementById('filterFirma')?.value || '';

    const filtered = iadeler.filter(i => {
        const firma = firmalar.find(f => f.id === i.firmaId);
        const firmaAd = firma ? firma.ad.toLowerCase() : '';
        const matchSearch = !searchText ||
            firmaAd.includes(searchText) ||
            (i.urun || '').toLowerCase().includes(searchText) ||
            (i.sebep || '').toLowerCase().includes(searchText);
        const matchFirma = !filterFirmaId || i.firmaId === filterFirmaId;
        return matchSearch && matchFirma;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    // İstatistik güncelle
    const totalIadeTutar = iadeler.reduce((acc, i) => acc + (i.tutarUSD || 0), 0);
    const statTotalIade = document.getElementById('statTotalIade');
    const statTotalIadeTutar = document.getElementById('statTotalIadeTutar');
    if (statTotalIade) statTotalIade.textContent = iadeler.length;
    if (statTotalIadeTutar && typeof formatCurrency === 'function') {
        statTotalIadeTutar.textContent = formatCurrency(totalIadeTutar);
    }

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2.5rem;">
            <i class="fa-solid fa-rotate-left" style="font-size:2rem; opacity:0.3; display:block; margin-bottom:8px;"></i>
            Henüz iade kaydı bulunamadı.
        </td></tr>`;
        return;
    }

    filtered.forEach(iade => {
        const firma = firmalar.find(f => f.id === iade.firmaId);
        const firmaAd = firma ? firma.ad : '<Silinmiş Firma>';
        const dateStr = new Date(iade.date).toLocaleDateString('tr-TR', {day:'2-digit',month:'2-digit',year:'numeric'});
        const tutarStr = typeof formatCurrency === 'function' ? formatCurrency(iade.tutarUSD) : `$${(iade.tutarUSD||0).toFixed(2)}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Tarih" style="color:var(--text-muted); font-size:0.88rem;">${dateStr}</td>
            <td data-label="Firma" style="font-weight:600;">${firmaAd}</td>
            <td data-label="Ürün">${iade.urun || '-'}</td>
            <td data-label="Sebep" style="color:var(--text-muted); font-size:0.88rem;">${iade.sebep || '-'}</td>
            <td data-label="Tutar" style="text-align:right; font-weight:700; color:var(--danger);">- ${tutarStr}</td>
            <td style="text-align:right;">
                <button class="btn-icon" onclick="editIadeAction('${iade.id}')" style="color:var(--warning); margin-right:4px;" title="Düzenle">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-icon" onclick="deleteIadeAction('${iade.id}')" style="color:var(--danger);" title="Sil">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ── Modal Fonksiyonları ────────────────────────────────────

function openIadeModal(iadeId = null) {
    const modal = document.getElementById('iadeModal');
    const form = document.getElementById('iadeForm');
    const title = document.getElementById('iadeModalTitle');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('editIadeId').value = '';
    document.getElementById('iadeTarih').value = new Date().toISOString().split('T')[0];
    document.getElementById('iadeTutarHint').textContent = '';
    
    const iadeStokDus = document.getElementById('iadeStokDus');
    const iadeStokAlanlari = document.getElementById('iadeStokAlanlari');
    if (iadeStokDus) iadeStokDus.checked = false;
    if (iadeStokAlanlari) iadeStokAlanlari.style.display = 'none';

    populateFirmaDropdown();

    if (iadeId) {
        const iade = (typeof getIadeler === 'function' ? getIadeler() : []).find(i => i.id === iadeId);
        if (iade) {
            document.getElementById('editIadeId').value = iade.id;
            document.getElementById('iadeFirma').value = iade.firmaId;
            document.getElementById('iadeTarih').value = (iade.date || '').split('T')[0];
            document.getElementById('iadeUrun').value = iade.urun || '';
            document.getElementById('iadeSebep').value = iade.sebep || '';
            document.getElementById('iadeTutar').value = iade.originalTutar || iade.tutarUSD || '';
            if (iade.currency === 'TRY') {
                document.getElementById('iadeTRY').checked = true;
            } else {
                document.getElementById('iadeUSD').checked = true;
            }
            if (title) title.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> İadeyi Düzenle';
            updateTutarHint();
        }
    } else {
        if (title) title.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Yeni İade Oluştur';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeIadeModal() {
    const modal = document.getElementById('iadeModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
}

function handleIadeSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('editIadeId').value;
    const firmaId = document.getElementById('iadeFirma').value;
    const tarih = document.getElementById('iadeTarih').value;
    const urun = document.getElementById('iadeUrun').value.trim();
    const sebep = document.getElementById('iadeSebep').value.trim();
    const tutar = parseFloat(document.getElementById('iadeTutar').value);
    const isUSD = document.getElementById('iadeUSD').checked;

    if (!firmaId) { alert('Lütfen bir firma seçin!'); return; }
    if (!tutar || tutar <= 0) { alert('Geçerli bir tutar girin!'); return; }

    const rate = parseFloat(window.lastRates?.USD || 32.50);
    const tutarUSD = isUSD ? tutar : (tutar / rate);

    const iadeData = {
        date: tarih,
        urun, sebep,
        tutarUSD: Math.round(tutarUSD * 100) / 100,
        originalTutar: tutar,
        currency: isUSD ? 'USD' : 'TRY'
    };

    const iadeStokDus = document.getElementById('iadeStokDus');
    if (iadeStokDus && iadeStokDus.checked) {
        const malzemeId = document.getElementById('iadeMalzemeSec').value;
        const miktar = parseFloat(document.getElementById('iadeMiktar').value);
        if (!malzemeId || isNaN(miktar) || miktar <= 0) {
            alert('Stok düşmek için lütfen geçerli bir malzeme ve miktar seçin!');
            return;
        }
        iadeData.stokDus = true;
        iadeData.malzemeId = malzemeId;
        iadeData.quantity = miktar;
    }

    if (editId) {
        iadeData.id = editId;
        if (typeof updateIade === 'function') updateIade(iadeData);
        if (typeof showToast === 'function') showToast('İade başarıyla güncellendi.', 'success');
    } else {
        if (typeof addIade === 'function') addIade(firmaId, iadeData);
        if (typeof showToast === 'function') showToast('İade başarıyla eklendi.', 'success');
    }

    closeIadeModal();
    renderIadeler();
}

window.editIadeAction = function(id) {
    openIadeModal(id);
};

window.deleteIadeAction = function(id) {
    if (!confirm('Bu iade kaydını silmek istiyor musunuz?\nFirma bakiyesi otomatik güncellenecektir.')) return;
    if (typeof deleteIade === 'function') {
        if (deleteIade(id)) {
            if (typeof showToast === 'function') showToast('İade kaydı silindi.', 'success');
            renderIadeler();
        }
    }
};
