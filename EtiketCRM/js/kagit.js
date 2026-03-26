document.addEventListener('DOMContentLoaded', async () => {
    const firmaSec = document.getElementById('firmaSec');
    const paperNameInput = document.getElementById('paperName');
    const calcTypeSelect = document.getElementById('calcType');
    
    const m2Inputs = document.getElementById('m2Inputs');
    const ruloInputs = document.getElementById('ruloInputs');
    
    const inputWidth = document.getElementById('paperWidth');
    const inputHeight = document.getElementById('paperHeight');
    const inputM2Price = document.getElementById('m2Price');
    const inputM2Currency = document.getElementById('m2Currency');
    
    const inputRuloQuantity = document.getElementById('ruloQuantity');
    const inputRuloPrice = document.getElementById('ruloPrice');
    const inputRuloCurrency = document.getElementById('ruloCurrency');
    
    const inputRate = document.getElementById('currencyRate');
    const inputPayment = document.getElementById('paymentMethod');
    
    const resPaperName = document.getElementById('resPaperName');
    const resTotalM2 = document.getElementById('resTotalM2');
    const resDetails = document.getElementById('resDetails');
    const resTotalUSD = document.getElementById('resTotalUSD');
    const resTotalTRY = document.getElementById('resTotalTRY');
    const tlRow = document.getElementById('tlRow');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const saveOrderBtn = document.getElementById('saveOrderBtn');
    
    // Malzeme Fiyatları Otomatik Doldurma (Merkezden)
    function loadPaperOptions(selectedName = null) {
        const fiyatlar = getMalzemeFiyatlari().filter(f => f.turu === 'Kağıt');
        paperNameInput.innerHTML = '<option value="" disabled selected>Lütfen Veritabanından Seçiniz...</option>';
        fiyatlar.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.adi;
            opt.textContent = `${f.adi} (${f.fiyat.toFixed(3)} ${f.doviz}/${f.birim})`;
            opt.dataset.fiyat = f.fiyat;
            opt.dataset.doviz = f.doviz;
            paperNameInput.appendChild(opt);
        });
        if (selectedName) {
            paperNameInput.value = selectedName;
        }
    }
    
    // İlk yükleme
    loadPaperOptions();

    // Dışarıdan (modal'dan) malzeme eklendiğinde listeyi güncelle
    window.addEventListener('malzemeEklendi', (e) => {
        if(e.detail && e.detail.turu === 'Kağıt') {
            loadPaperOptions(e.detail.adi);
            paperNameInput.dispatchEvent(new Event('change'));
        }
    });

    paperNameInput.addEventListener('change', () => {
        const selectedOpt = paperNameInput.options[paperNameInput.selectedIndex];
        if (selectedOpt && selectedOpt.value) {
            const f = parseFloat(selectedOpt.dataset.fiyat);
            const d = selectedOpt.dataset.doviz;
            
            if (calcTypeSelect.value === 'm2') {
                inputM2Price.value = f;
                inputM2Currency.value = d;
            } else {
                inputRuloPrice.value = f;
                inputRuloCurrency.value = d;
            }
            if (typeof updateRateInput === 'function') updateRateInput();
        }
    });

    let currentCalculation = null;

    // Kurları çek ve inputu ayarla
    const rates = await fetchExchangeRates();
    const updateRateInput = () => {
        const type = calcTypeSelect.value;
        const currency = (type === 'm2') ? inputM2Currency.value : inputRuloCurrency.value;
        inputRate.value = rates[currency] || rates.USD;
    };
    updateRateInput();
    inputM2Currency.addEventListener('change', updateRateInput);
    inputRuloCurrency.addEventListener('change', updateRateInput);
    calcTypeSelect.addEventListener('change', updateRateInput);

    // Firmaları Yükle
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

    calcTypeSelect.addEventListener('change', () => {
        if (calcTypeSelect.value === 'm2') {
            m2Inputs.style.display = 'block';
            ruloInputs.style.display = 'none';
        } else {
            m2Inputs.style.display = 'none';
            ruloInputs.style.display = 'block';
        }
    });

    calculateBtn.addEventListener('click', () => {
        const name = paperNameInput.value.trim();
        const type = calcTypeSelect.value;
        const rate = parseFloat(inputRate.value) || 0;
        const eurToUsd = 1.08; // Fallback

        let totalUSD = 0;
        let quantityVal = 0;
        let unitVal = '';
        let detailsText = '';
        let selectedCurrency = 'USD';

        if (type === 'm2') {
            const width = parseFloat(inputWidth.value) / 100;
            const height = parseFloat(inputHeight.value);
            const price = parseFloat(inputM2Price.value);
            selectedCurrency = inputM2Currency.value;

            if (isNaN(width) || isNaN(height) || isNaN(price)) {
                showToast('Lütfen m2 bazlı alanları doldurun.', 'error');
                return;
            }

            quantityVal = width * height;
            unitVal = 'm²';
            totalUSD = quantityVal * price;
            if (selectedCurrency === 'EUR') totalUSD *= eurToUsd;
            
            detailsText = `En: ${inputWidth.value}cm | Boy: ${height}mt | Birim: ${price} ${selectedCurrency}`;
        } else {
            quantityVal = parseInt(inputRuloQuantity.value);
            const price = parseFloat(inputRuloPrice.value);
            selectedCurrency = inputRuloCurrency.value;

            if (isNaN(quantityVal) || isNaN(price)) {
                showToast('Lütfen rulo bazlı alanları doldurun.', 'error');
                return;
            }

            unitVal = 'Rulo';
            totalUSD = quantityVal * price;
            if (selectedCurrency === 'EUR') totalUSD *= eurToUsd;
            
            detailsText = `Miktar: ${quantityVal} Rulo | Birim: ${price} ${selectedCurrency}`;
        }

        resPaperName.textContent = name || 'Belirtilmedi';
        resTotalM2.textContent = quantityVal.toFixed(2) + ' ' + unitVal;
        resDetails.textContent = detailsText;
        resTotalUSD.textContent = formatCurrency(totalUSD);

        if (rate > 0) {
            resTotalTRY.textContent = formatTRY(totalUSD * rate);
            tlRow.style.display = 'flex';
        } else {
            tlRow.style.display = 'none';
        }

        currentCalculation = {
            type: 'Kağıt / Ham Madde',
            name: name || 'Kağıt',
            quantity: quantityVal.toFixed(2),
            unit: unitVal,
            unitPrice: (type === 'm2') ? parseFloat(inputM2Price.value) : parseFloat(inputRuloPrice.value),
            currency: selectedCurrency,
            totalPriceUSD: totalUSD,
            exchangeRate: rate,
            totalPriceTRY: rate > 0 ? (totalUSD * rate) : 0,
            paymentMethod: inputPayment.value,
            details: detailsText + (selectedCurrency === 'EUR' ? ' (USD\'ye çevrildi)' : '')
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
