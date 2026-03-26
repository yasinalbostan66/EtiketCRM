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
});
