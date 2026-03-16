document.addEventListener('DOMContentLoaded', () => {
    // Sadece firmalar.html sayfasındaysak listeyi render et
    if (document.getElementById('firmalarBody')) {
        renderFirmalar();
        
        const firmaForm = document.getElementById('firmaForm');
        firmaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const ad = document.getElementById('firmaAd').value.trim();
            const yetkili = document.getElementById('firmaYetkili').value.trim();
            const telefon = document.getElementById('firmaTelefon').value.trim();
            const email = document.getElementById('firmaEmail').value.trim();
            const vergiDairesi = document.getElementById('vergiDairesi').value.trim();
            const vergiNo = document.getElementById('vergiNo').value.trim();
            const sektor = document.getElementById('firmaSektor').value.trim();
            const adres = document.getElementById('firmaAdres').value.trim();
            
            if (!ad) {
                showToast('Lütfen firma adını girin.', 'error');
                return;
            }

            const mode = firmaForm.getAttribute('data-mode');
            const editId = firmaForm.getAttribute('data-id');

            const firmaObj = {
                ad: ad,
                yetkili: yetkili || '-',
                telefon: telefon || '-',
                email: email || '-',
                vergiDairesi: vergiDairesi || '-',
                vergiNo: vergiNo || '-',
                sektor: sektor || '-',
                adres: adres || '-'
            };
            
            if (mode === 'edit' && editId) {
                firmaObj.id = editId;
                updateFirma(firmaObj);
                showToast('Firma başarıyla güncellendi.', 'success');
            } else {
                addFirma(firmaObj);
                showToast('Firma başarıyla kaydedildi.', 'success');
            }
            
            // Formu temizle ve modalı kapat
            firmaForm.reset();
            firmaForm.removeAttribute('data-mode');
            firmaForm.removeAttribute('data-id');
            document.querySelector('.panel-title').textContent = 'Firma Kayıt Formu';
            document.getElementById('addFirmaModal').style.display='none';
            
            renderFirmalar();
        });

        // Arama (Filter) İşlemi
        const searchInput = document.getElementById('searchInput');
        if(searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                const val = e.target.value.toLowerCase();
                renderFirmalar(val);
            });
        }
    }
});

function renderFirmalar(filterVal = '') {
    const tbody = document.getElementById('firmalarBody');
    if (!tbody) return;
    
    let firmalar = getFirmalar();
    
    if (filterVal) {
        firmalar = firmalar.filter(f => f.ad.toLowerCase().includes(filterVal) || f.yetkili.toLowerCase().includes(filterVal));
    }
    
    tbody.innerHTML = '';
    
    if (firmalar.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    <i class="fa-solid fa-address-book" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5; display: block;"></i>
                    Listelenecek firma bulunamadı.
                </td>
            </tr>
        `;
        return;
    }
    
    firmalar.forEach(firma => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <a href="firma_detay.html?id=${firma.id}" style="color: var(--primary); font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-building"></i> ${firma.ad}
                </a>
            </td>
            <td>${firma.yetkili}</td>
            <td>${firma.telefon}</td>
            <td>
                <div class="d-flex gap-2">
                    <button class="btn-icon" onclick="window.location.href='firma_detay.html?id=${firma.id}'" title="Siparişler/Detay">
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    <button class="btn-icon" onclick="duzenleFirma('${firma.id}')" title="Firmayı Düzenle">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon" onclick="silFirma('${firma.id}')" title="Firmayı Sil" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Düzenleme İşlemi Top-Level
window.duzenleFirma = function(id) {
    const firma = getFirmaById(id);
    if (!firma) return;

    // Modalı Aç ve Formu Doldur
    document.getElementById('addFirmaModal').style.display = 'flex';
    document.querySelector('.panel-title').innerHTML = '<i class="fa-solid fa-pen"></i> Firma Düzenleme';
    
    document.getElementById('firmaAd').value = firma.ad;
    document.getElementById('firmaEmail').value = firma.email || '';
    document.getElementById('firmaYetkili').value = firma.yetkili || '';
    document.getElementById('firmaTelefon').value = firma.telefon || '';
    document.getElementById('vergiDairesi').value = firma.vergiDairesi || '';
    document.getElementById('vergiNo').value = firma.vergiNo || '';
    document.getElementById('firmaSektor').value = firma.sektor || '';
    document.getElementById('firmaAdres').value = firma.adres || '';

    // Form submit olayını "Update" yapacak şekilde işaretle
    const form = document.getElementById('firmaForm');
    form.setAttribute('data-mode', 'edit');
    form.setAttribute('data-id', id);
};

// Global scope'a silme işlemini çıkar
window.silFirma = function(id) {
    if (confirm('Dikkat! Firmayı sildiğinizde firmaya ait sipariş kayıtları kalacaktır ancak firma adı "Silinmiş" olarak görünecektir. Silmek istediğinize emin misiniz?')) {
        let firmalar = getFirmalar();
        firmalar = firmalar.filter(item => item.id !== id);
        saveFirmalar(firmalar);
        renderFirmalar();
        showToast('Firma silindi.', 'error');
    }
};
