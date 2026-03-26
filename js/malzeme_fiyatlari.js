document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('malzemeForm');
    const tableContainer = document.getElementById('malzemeTableContainer');
    const searchInput = document.getElementById('searchInput');
    const iptalBtn = document.getElementById('iptalBtn');
    const submitBtn = document.getElementById('kaydetBtn');
    const formTitle = document.querySelector('#malzemeForm .panel-header .panel-title'); // Wait, there's no panel title inside form, it's above it

    // Form inputs
    const inputId = document.getElementById('editMaterialId');
    const inputTuru = document.getElementById('malzemeTuru');
    const inputAdi = document.getElementById('malzemeAdi');
    const inputFiyat = document.getElementById('birimFiyat');
    const inputDoviz = document.getElementById('dovizCinsi');
    const inputStok = document.getElementById('malzemeStok');
    const inputBirim = document.getElementById('malzemeBirim');

    let currentCategory = 'Tümü';

    window.filterCategory = function(cat) {
        currentCategory = cat;
        // Buton aktiflik sınıflarını güncelle
        ['Tümü', 'Kağıt', 'Mürekkep', 'Sarf Malzeme', 'Klişe'].forEach(c => {
            const elId = `tab_${c.replace(/ /g, '_')}`;
            const btn = document.getElementById(elId);
            if (btn) {
                if (c === cat) {
                    btn.classList.add('active');
                    btn.style.background = 'var(--primary)';
                    btn.style.color = 'var(--surface-color)';
                } else {
                    btn.classList.remove('active');
                    btn.style.background = 'transparent';
                    btn.style.color = 'var(--text-main)';
                }
            }
        });
        renderTable();
    };

    // CSV İçe Aktar
    const csvInput = document.getElementById('csvInput');
    if (csvInput) {
        csvInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.split('\n');
                let fiyatlar = getMalzemeFiyatlari();
                let addedCount = 0;

                lines.forEach((line, index) => {
                    if (index === 0 && (line.toLowerCase().includes('tür') || line.toLowerCase().includes('tur'))) return; 
                    if (!line.trim()) return;

                    // Virgül veya Noktalı Virgül kontrolü
                    const separator = line.includes(';') ? ';' : ',';
                    const cols = line.split(separator);
                    
                    if (cols.length >= 4) {
                        const turu = cols[0].trim();
                        const adi = cols[1].trim();
                        const fiyat = parseFloat(cols[2].trim());
                        const doviz = cols[3].trim().toUpperCase();

                        if (turu && adi && !isNaN(fiyat)) {
                            const newItem = {
                                id: 'mat_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
                                turu: ['Kağıt', 'Mürekkep', 'Sarf Malzeme', 'Klişe'].includes(turu) ? turu : 'Sarf Malzeme',
                                adi,
                                fiyat,
                                doviz: ['USD', 'EUR', 'TRY'].includes(doviz) ? doviz : 'USD',
                                dateAdded: new Date().toISOString()
                            };
                            fiyatlar.push(newItem);
                            addedCount++;
                        }
                    }
                });

                if (addedCount > 0) {
                    saveMalzemeFiyatlari(fiyatlar);
                    showToast(`${addedCount} adet malzeme fiyatı içe aktarıldı.`, 'success');
                    renderTable();
                } else {
                    showToast('Geçerli veri bulunamadı! Format: Tür,Ad,Fiyat,Döviz', 'error');
                }
                csvInput.value = '';
            };
            reader.readAsText(file);
        });
    }

    // CSV Dışa Aktar
    window.exportToCSV = function() {
        const fiyatlar = getMalzemeFiyatlari();
        if (fiyatlar.length === 0) {
            showToast('Dışa aktarılacak kayıt bulunmuyor.', 'error');
            return;
        }

        let csvContent = "\ufeffGrup,Malzeme Adı,Birim Fiyat,Döviz,Stok,Birim\n"; // BOM for excel Turkish chars
        fiyatlar.forEach(f => {
            csvContent += `${f.turu},${f.adi},${f.fiyat},${f.doviz},${f.stok || 0},${f.birim || 'kg'}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Malzeme_Fiyatlari_${new Date().toLocaleDateString('tr-TR')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV Dosyası indirildi.', 'success');
    };

    // Render Table
    function renderTable() {
        const fiyatlar = getMalzemeFiyatlari();
        const searchTerm = searchInput.value.toLowerCase();
        
        const filtered = fiyatlar.filter(f => 
            (currentCategory === 'Tümü' || f.turu === currentCategory) &&
            (f.adi.toLowerCase().includes(searchTerm) || f.turu.toLowerCase().includes(searchTerm))
        );

        if (filtered.length === 0) {
            tableContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                    <p>Kayıtlı malzeme fiyatı bulunamadı.</p>
                </div>
            `;
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Grup / Tür</th>
                        <th>Malzeme Adı</th>
                        <th>Birim Fiyat</th>
                        <th>Döviz</th>
                        <th>Stok Miktarı</th>
                        <th style="text-align: right;">İşlem</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filtered.forEach(item => {
            const stokValue = item.stok ? parseFloat(item.stok) : 0;
            const stokBadge = `<span class="badge ${stokValue > 10 ? 'badge-green' : (stokValue > 0 ? 'badge-orange' : 'badge-red')}">${stokValue} ${item.birim || 'kg'}</span>`;

            html += `
                <tr>
                    <td><span class="badge ${item.turu === 'Kağıt' ? 'badge-orange' : (item.turu === 'Mürekkep' ? 'badge-blue' : 'badge-green')}">${item.turu}</span></td>
                    <td style="font-weight: 500;">${item.adi}</td>
                    <td style="font-weight: 600;">${parseFloat(item.fiyat).toFixed(4)}</td>
                    <td>${item.doviz}</td>
                    <td>${stokBadge}</td>
                    <td style="text-align: right;">
                        <button class="btn-icon" onclick="duzeltMalzeme('${item.id}')" style="color: var(--warning); margin-right: 0.5rem;" title="Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="btn-icon" onclick="silMalzeme('${item.id}')" style="color: var(--danger);" title="Sil"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;
    }

    // Submit Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = inputId.value;
        const turu = inputTuru.value;
        const adi = inputAdi.value.trim();
        const fiyat = parseFloat(inputFiyat.value);
        const doviz = inputDoviz.value;
        const stok = inputStok ? parseFloat(inputStok.value) || 0 : 0;
        const birim = inputBirim ? inputBirim.value : 'kg';

        if (!turu || !adi || isNaN(fiyat)) {
            showToast('Lütfen tüm alanları doldurun.', 'error');
            return;
        }

        let fiyatlar = getMalzemeFiyatlari();

        if (id) {
            // Update
            const index = fiyatlar.findIndex(f => f.id === id);
            if (index !== -1) {
                fiyatlar[index] = { ...fiyatlar[index], turu, adi, fiyat, doviz, stok, birim, dateModified: new Date().toISOString() };
                saveMalzemeFiyatlari(fiyatlar);
                showToast('Kayıt güncellendi.', 'success');
            }
        } else {
            // Add
            const newItem = {
                id: 'mat_' + Date.now().toString(36) + Math.random().toString(36).substr(2),
                turu,
                adi,
                fiyat,
                doviz,
                stok,
                birim,
                dateAdded: new Date().toISOString()
            };
            fiyatlar.push(newItem);
            saveMalzemeFiyatlari(fiyatlar);
            showToast('Kayıt kaydedildi.', 'success');
        }

        form.reset();
        inputId.value = '';
        iptalBtn.style.display = 'none';
        submitBtn.textContent = 'Fiyatı Kaydet';
        renderTable();
    });

    // Cancel Edit
    iptalBtn.addEventListener('click', () => {
        form.reset();
        inputId.value = '';
        iptalBtn.style.display = 'none';
        submitBtn.textContent = 'Fiyatı Kaydet';
    });

    // Search
    searchInput.addEventListener('input', renderTable);

    // Global Functions for buttons
    window.duzeltMalzeme = function(id) {
        const fiyatlar = getMalzemeFiyatlari();
        const item = fiyatlar.find(f => f.id === id);
        if (!item) return;

        inputId.value = item.id;
        inputTuru.value = item.turu;
        inputAdi.value = item.adi;
        inputFiyat.value = item.fiyat;
        inputDoviz.value = item.doviz;
        if (inputStok) inputStok.value = item.stok || '';
        if (inputBirim) inputBirim.value = item.birim || 'kg';

        iptalBtn.style.display = 'inline-block';
        submitBtn.textContent = 'Değişiklikleri Kaydet';
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth' });
    };

    window.silMalzeme = function(id) {
        if (confirm('Bu malzeme fiyatını silmek istediğinize emin misiniz?')) {
            let fiyatlar = getMalzemeFiyatlari();
            fiyatlar = fiyatlar.filter(f => f.id !== id);
            saveMalzemeFiyatlari(fiyatlar);
            renderTable();
            showToast('Fiyat silindi.', 'error');
        }
    };

    // Initial Render
    renderTable();
});
