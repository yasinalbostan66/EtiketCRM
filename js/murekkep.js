document.addEventListener('DOMContentLoaded', async () => {
    const firmaSec = document.getElementById('firmaSec');
    const inputColor = document.getElementById('inkColor');
    const inputQuantity = document.getElementById('inkQuantity');
    const inputPrice = document.getElementById('inkPrice');
    const inputCurrency = document.getElementById('priceCurrency');
    const inputRate = document.getElementById('currencyRate');
    const inputPayment = document.getElementById('paymentMethod');
    
    const resColor = document.getElementById('resColor');
    const resQuantity = document.getElementById('resQuantity');
    const resPrice = document.getElementById('resPrice');
    const resTotalUSD = document.getElementById('resTotalUSD');
    const resTotalTRY = document.getElementById('resTotalTRY');
    const tlRow = document.getElementById('tlRow');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const saveOrderBtn = document.getElementById('saveOrderBtn');
    
    // Malzeme Fiyatları Otomatik Doldurma (Merkezden)
    function loadInkOptions(selectedName = null) {
        const fiyatlar = getMalzemeFiyatlari().filter(f => f.turu === 'Mürekkep');
        inputColor.innerHTML = '<option value="" disabled selected>Lütfen Veritabanından Seçiniz...</option>';
        fiyatlar.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.adi;
            opt.textContent = `${f.adi} (${f.fiyat.toFixed(3)} ${f.doviz}/${f.birim})`;
            opt.dataset.fiyat = f.fiyat;
            opt.dataset.doviz = f.doviz;
            inputColor.appendChild(opt);
        });
        if (selectedName) {
            inputColor.value = selectedName;
        }
    }
    
    loadInkOptions();

    window.addEventListener('malzemeEklendi', (e) => {
        if(e.detail && e.detail.turu === 'Mürekkep') {
            loadInkOptions(e.detail.adi);
            inputColor.dispatchEvent(new Event('change'));
        }
    });

    inputColor.addEventListener('change', () => {
        const selectedOpt = inputColor.options[inputColor.selectedIndex];
        if (selectedOpt && selectedOpt.value) {
            inputPrice.value = selectedOpt.dataset.fiyat;
            inputCurrency.value = selectedOpt.dataset.doviz;
            if (typeof updateRateInput === 'function') updateRateInput();
        }
    });

    let currentCalculation = null;

    // Firmalar ve Kur yükle
    const rates = await fetchExchangeRates();
    const updateRateInput = () => {
        inputRate.value = rates[inputCurrency.value] || rates.USD;
        // Eğer hesaplama yapılmışsa kur değişiminde otomatik güncelle (isteğe bağlı ama kullanıcı deneyimi için iyi)
    };
    updateRateInput();
    inputCurrency.addEventListener('change', updateRateInput);

    const firmalar = getFirmalar();
    firmalar.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.ad;
        firmaSec.appendChild(opt);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedFirma = urlParams.get('firmaId');
    if (preSelectedFirma) {
        firmaSec.value = preSelectedFirma;
        // Firma seçimi panelini gizle (Daha profesyonel akış)
        const firmaPanel = firmaSec.closest('.panel');
        if (firmaPanel) firmaPanel.style.display = 'none';
        
        // Üst başlığa firma adını ekle (Opsiyonel ama şık olur)
        const firma = getFirmaById(preSelectedFirma);
        if (firma) {
            document.querySelector('.page-title').innerHTML += ` <small style="color:var(--text-muted); font-size:0.8rem;">(${firma.ad})</small>`;
        }
    }

    calculateBtn.addEventListener('click', () => {
        const color = inputColor.value.trim() || 'Standart Renk';
        const quantity = parseFloat(inputQuantity.value);
        const price = parseFloat(inputPrice.value);
        const selectedCurrency = inputCurrency.value;
        const rate = parseFloat(inputRate.value) || 0;

        if (isNaN(quantity) || isNaN(price)) {
            showToast('Lütfen miktar ve fiyatı girin!', 'error');
            return;
        }

        let totalNative = quantity * price;
        let totalUSD = totalNative;
        const eurToUsd = 1.08; // Fallback parite

        if (selectedCurrency === 'EUR') {
            totalUSD = totalNative * eurToUsd;
        }

        resColor.textContent = color;
        resQuantity.textContent = quantity + ' kg';
        resPrice.textContent = `${price} ${selectedCurrency}`;
        resTotalUSD.textContent = formatCurrency(totalNative, selectedCurrency);

        if (rate > 0) {
            resTotalTRY.textContent = formatTRY(totalNative * rate);
            tlRow.style.display = 'flex';
        } else {
            tlRow.style.display = 'none';
        }

        currentCalculation = {
            type: 'Mürekkep',
            name: `${color} Mürekkep`,
            quantity: quantity,
            unit: 'kg',
            unitPrice: price,
            currency: selectedCurrency,
            totalPriceUSD: totalUSD,
            exchangeRate: rate,
            totalPriceTRY: rate > 0 ? (totalNative * rate) : 0,
            paymentMethod: inputPayment.value,
            details: `Renk: ${color} | Miktar: ${quantity}kg | Birim: ${price} ${selectedCurrency}`
        };

        saveOrderBtn.disabled = false;
    });

    saveOrderBtn.addEventListener('click', () => {
        const firmaId = firmaSec.value;
        if (!firmaId) {
            showToast('Lütfen bir firma seçin!', 'error');
            return;
        }

        addSiparis(firmaId, currentCalculation);
        showToast('Sipariş başarıyla kaydedildi.', 'success');
        
        setTimeout(() => {
            window.location.href = `firma_detay.html?id=${firmaId}`;
        }, 1500);
    });
});
