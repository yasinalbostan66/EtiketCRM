document.addEventListener('DOMContentLoaded', async () => {
    const firmaSec = document.getElementById('firmaSec');
    const materialTypeSelect = document.getElementById('materialType');
    const customMaterialGroup = document.getElementById('customMaterialGroup');
    const customMaterialName = document.getElementById('customMaterialName');
    
    const inputQuantity = document.getElementById('materialQuantity');
    const inputUnit = document.getElementById('materialUnit');
    const inputPrice = document.getElementById('materialPrice');
    const inputCurrency = document.getElementById('priceCurrency');
    
    const inputRate = document.getElementById('currencyRate');
    const inputPayment = document.getElementById('paymentMethod');
    
    const resType = document.getElementById('resType');
    const resQuantity = document.getElementById('resQuantity');
    const resPrice = document.getElementById('resPrice');
    const resTotalUSD = document.getElementById('resTotalUSD');
    const resTotalTRY = document.getElementById('resTotalTRY');
    const tlRow = document.getElementById('tlRow');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const saveOrderBtn = document.getElementById('saveOrderBtn');
    
    let currentCalculation = null;

    // Kurları çek ve inputu ayarla
    const rates = await fetchExchangeRates();
    const updateRateInput = () => {
        inputRate.value = rates[inputCurrency.value] || rates.USD;
    };
    updateRateInput();
    inputCurrency.addEventListener('change', updateRateInput);

    // Firmaları yükle
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
        const firmaPanel = firmaSec.closest('.panel');
        if (firmaPanel) firmaPanel.style.display = 'none';
        const firma = getFirmaById(preSelectedFirma);
        if (firma) {
            document.querySelector('.page-title').innerHTML += ` <small style="color:var(--text-muted); font-size:0.8rem;">(${firma.ad})</small>`;
        }
    }

    // Malzeme Fiyatlarını Yükle
    const sarfFiyatlar = getMalzemeFiyatlari().filter(f => f.turu === 'Sarf Malzeme');
    sarfFiyatlar.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.adi;
        opt.textContent = f.adi;
        const digerOpt = materialTypeSelect.querySelector('option[value="Diğer"]');
        if (digerOpt) {
            materialTypeSelect.insertBefore(opt, digerOpt);
        } else {
            materialTypeSelect.appendChild(opt);
        }
    });

    materialTypeSelect.addEventListener('change', () => {
        const selectedFiyat = sarfFiyatlar.find(f => f.adi === materialTypeSelect.value);
        if (selectedFiyat) {
            inputPrice.value = selectedFiyat.fiyat;
            inputCurrency.value = selectedFiyat.doviz;
            if (typeof updateRateInput === 'function') updateRateInput();
        }

        if (materialTypeSelect.value === 'Diğer') {
            customMaterialGroup.style.display = 'block';
        } else {
            customMaterialGroup.style.display = 'none';
        }
    });

    calculateBtn.addEventListener('click', () => {
        let type = materialTypeSelect.value;
        if (type === 'Diğer') {
            type = customMaterialName.value.trim() || 'Özel Malzeme';
        }

        const quantity = parseFloat(inputQuantity.value);
        const unit = inputUnit.value;
        const price = parseFloat(inputPrice.value);
        const selectedCurrency = inputCurrency.value;
        const rate = parseFloat(inputRate.value) || 0;
        const eurToUsd = 1.08; // Fallback parite

        if (!type || isNaN(quantity) || isNaN(price)) {
            showToast('Lütfen tüm zorunlu alanları doldurun.', 'error');
            return;
        }

        let totalUSD = quantity * price;
        if (selectedCurrency === 'EUR') totalUSD *= eurToUsd;

        resType.textContent = type;
        resQuantity.textContent = `${quantity} ${unit}`;
        resPrice.textContent = `${price} ${selectedCurrency}`;
        resTotalUSD.textContent = formatCurrency(totalUSD);

        if (rate > 0) {
            resTotalTRY.textContent = formatTRY(totalUSD * rate);
            tlRow.style.display = 'flex';
        } else {
            tlRow.style.display = 'none';
        }

        currentCalculation = {
            type: 'Sarf Malzeme',
            name: type,
            quantity: quantity,
            unit: unit,
            unitPrice: price,
            currency: selectedCurrency,
            totalPriceUSD: totalUSD,
            exchangeRate: rate,
            totalPriceTRY: rate > 0 ? (totalUSD * rate) : 0,
            paymentMethod: inputPayment.value,
            details: `${type} | Miktar: ${quantity}${unit} | Birim: ${price} ${selectedCurrency}${selectedCurrency === 'EUR' ? ' (USD\'ye çevrildi)' : ''}`
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
