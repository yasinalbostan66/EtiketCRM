document.addEventListener('DOMContentLoaded', () => {
    let allMaterials = getMalzemeFiyatlari();
    const tableBody = document.getElementById('stokTableBody');
    const filterType = document.getElementById('filterType');
    const searchTerm = document.getElementById('searchTerm');
    const totalCountSpan = document.getElementById('totalCountSpan');

    const editModal = document.getElementById('stokEditModal');
    const editMalzemeAdi = document.getElementById('editMalzemeAdi');
    const editMalzemeDetay = document.getElementById('editMalzemeDetay');
    const newStokInput = document.getElementById('newStokValue');
    const saveStokBtn = document.getElementById('saveStokBtn');

    let currentEditId = null;

    function renderTable() {
        const typeFilter = filterType.value;
        const search = searchTerm.value.toLowerCase().trim();

        const filtered = allMaterials.filter(m => {
            const matchesType = (typeFilter === 'HEPSİ') || (m.turu === typeFilter);
            const matchesSearch = m.adi.toLowerCase().includes(search);
            return matchesType && matchesSearch;
        });

        tableBody.innerHTML = '';
        totalCountSpan.textContent = filtered.length;

        if (filtered.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">Eşleşen malzeme bulunamadı.</td></tr>';
            return;
        }

        filtered.forEach(m => {
            const tr = document.createElement('tr');
            
            let colorClass = '';
            if (m.turu === 'Kağıt') colorClass = 'badge-orange';
            else if (m.turu === 'Mürekkep') colorClass = 'badge-blue';
            else if (m.turu === 'Sarf Malzeme') colorClass = 'badge-green';
            else colorClass = 'badge-muted';

            tr.innerHTML = `
                <td><strong>${m.adi}</strong></td>
                <td><span class="badge ${colorClass}">${m.turu}</span></td>
                <td><span style="font-weight: 700; font-size: 1.1rem; color: ${m.stok > 0 ? 'var(--success)' : 'var(--danger)'};">${m.stok || 0}</span></td>
                <td style="color: var(--text-muted);">${m.birim || 'Birim Yok'}</td>
                <td style="text-align: right;">
                    <button class="btn btn-icon" onclick="openStokEdit('${m.id}')">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-icon" onclick="adjustStok('${m.id}', 1)" title="1 Artır">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                    <button class="btn btn-icon" onclick="adjustStok('${m.id}', -1)" title="1 Eksilt">
                        <i class="fa-solid fa-minus"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    window.openStokEdit = (id) => {
        const mat = allMaterials.find(m => m.id === id);
        if (!mat) return;

        currentEditId = id;
        editMalzemeAdi.textContent = mat.adi;
        editMalzemeDetay.textContent = `Tür: ${mat.turu} | Birim: ${mat.birim || '-'}`;
        newStokInput.value = mat.stok || 0;
        
        editModal.style.display = 'flex';
        setTimeout(() => newStokInput.focus(), 100);
    };

    window.adjustStok = (id, amount) => {
        const mat = allMaterials.find(m => m.id === id);
        if (!mat) return;
        
        mat.stok = (parseFloat(mat.stok) || 0) + amount;
        saveMalzemeFiyatlari(allMaterials);
        renderTable();
        showToast('Stok güncellendi!', 'success');
    };

    saveStokBtn.onclick = () => {
        const newVal = parseFloat(newStokInput.value);
        if (isNaN(newVal)) {
            showToast('Lütfen geçerli bir sayı girin.', 'error');
            return;
        }

        const mat = allMaterials.find(m => m.id === currentEditId);
        if (mat) {
            mat.stok = newVal;
            saveMalzemeFiyatlari(allMaterials);
            renderTable();
            editModal.style.display = 'none';
            showToast('Stok başarıyla güncellendi.', 'success');
        }
    };

    filterType.onchange = renderTable;
    searchTerm.oninput = renderTable;

    renderTable();

    // Merkezi veri tabanında değişiklik olursa yenile (event dinleyicisi artırılabilir)
    window.addEventListener('malzemeEklendi', () => {
        allMaterials = getMalzemeFiyatlari();
        renderTable();
    });

    // --- CSV İçe Aktar ---
    const csvInput = document.getElementById('csvInput');
    if (csvInput) {
        csvInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                const text = event.target.result;
                const rows = text.split('\n');
                let count = 0;

                // Skip header (CSV format: Grup,Malzeme Adı,Birim Fiyat,Döviz,Stok,Birim)
                for (let i = 1; i < rows.length; i++) {
                    const columns = rows[i].split(',');
                    if (columns.length < 5) continue;

                    const turu = columns[0].trim();
                    const adi = columns[1].trim();
                    const stok = parseFloat(columns[4]);

                    if (adi && !isNaN(stok)) {
                        // Mevcut malzemeyi bul ve stok güncelle
                        const mat = allMaterials.find(m => m.adi.toLowerCase() === adi.toLowerCase() && m.turu === turu);
                        if (mat) {
                            mat.stok = stok;
                            count++;
                        }
                    }
                }

                if (count > 0) {
                    saveMalzemeFiyatlari(allMaterials);
                    renderTable();
                    showToast(`${count} kalemin stoğu güncellendi!`, 'success');
                } else {
                    showToast('Eşleşen malzeme bulunamadı veya CSV formatı hatalı!', 'error');
                }
                csvInput.value = '';
            };
            reader.readAsText(file);
        });
    }

    // --- PDF Dışa Aktar ---
    window.exportToPDF = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Türkçe Karakter Desteği için latinze (Opsiyonel ama güvenli)
        const trMap = { 'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U' };
        function fixTr(text) {
            return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, m => trMap[m]);
        }

        const typeFilter = filterType.value;
        const search = searchTerm.value.toLowerCase().trim();
        const filtered = allMaterials.filter(m => {
            const matchesType = (typeFilter === 'HEPSİ') || (m.turu === typeFilter);
            const matchesSearch = m.adi.toLowerCase().includes(search);
            return matchesType && matchesSearch;
        });

        const tableData = filtered.map(m => [
            fixTr(m.adi),
            fixTr(m.turu),
            m.stok || 0,
            fixTr(m.birim || '-')
        ]);

        doc.setFontSize(18);
        doc.text(fixTr("Malzeme Stok Raporu"), 14, 20);
        doc.setFontSize(10);
        doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
        doc.text(`Filtre: ${fixTr(typeFilter)} | Arama: ${fixTr(search) || 'Yok'}`, 14, 35);

        doc.autoTable({
            startY: 45,
            head: [[fixTr('Malzeme Adı'), fixTr('Tur'), fixTr('Stok'), fixTr('Birim')]],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [56, 189, 248] }
        });

        doc.save(`Stok_Raporu_${new Date().toISOString().slice(0,10)}.pdf`);
        showToast('PDF Dosyası oluşturuldu.', 'success');
    };

    // Stok Raporu Paylaş (NEW)
    window.shareStokReport = async function() {
        if (!navigator.share) {
            window.exportToPDF();
            showToast('Cihazınızda paylaşım desteklenmiyor, PDF indirildi.', 'warning');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const trMap = { 'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U' };
        function fixTr(text) { return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, m => trMap[m]); }

        const typeFilter = filterType.value;
        const search = searchTerm.value.toLowerCase().trim();
        const filtered = allMaterials.filter(m => {
            const matchesType = (typeFilter === 'HEPSİ') || (m.turu === typeFilter);
            const matchesSearch = m.adi.toLowerCase().includes(search);
            return matchesType && matchesSearch;
        });

        const tableData = filtered.map(m => [
            fixTr(m.adi),
            fixTr(m.turu),
            m.stok || 0,
            fixTr(m.birim || '-')
        ]);

        doc.setFontSize(18);
        doc.text(fixTr("Malzeme Stok Raporu"), 14, 20);
        doc.setFontSize(10);
        doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 30);
        doc.text(`Filtre: ${fixTr(typeFilter)} | Arama: ${fixTr(search) || 'Yok'}`, 14, 35);

        doc.autoTable({
            startY: 45,
            head: [[fixTr('Malzeme Adı'), fixTr('Tur'), fixTr('Stok'), fixTr('Birim')]],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [56, 189, 248] }
        });

        try {
            const pdfOutput = doc.output('blob');
            const file = new File([pdfOutput], `Stok_Raporu_${new Date().toISOString().slice(0,10)}.pdf`, { type: 'application/pdf' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Malzeme Stok Raporu',
                    text: 'Güncel stok ve malzeme dökümü.',
                    files: [file]
                });
            } else {
                window.exportToPDF();
                showToast('Paylaşım desteklenmiyor, PDF indirildi.', 'warning');
            }
        } catch (err) {
            console.error('Paylaşım hatası:', err);
            showToast('Paylaşım sırasında bir hata oluştu.', 'error');
        }
    };
});
