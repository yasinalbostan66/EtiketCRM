document.addEventListener('DOMContentLoaded', async () => {
    const firmaSec = document.getElementById('firmaSec');
    const inputWidth = document.getElementById('plateWidth');
    const inputHeight = document.getElementById('plateHeight');
    const inputCount = document.getElementById('plateCount');
    const inputPrice = document.getElementById('platePrice');
    const inputCurrency = document.getElementById('priceCurrency');
    const inputPayment = document.getElementById('paymentMethod');
    
    const resArea = document.getElementById('resArea');
    const resQuantity = document.getElementById('resQuantity');
    const resPrice = document.getElementById('resPrice');
    const resTotalUSD = document.getElementById('resTotalUSD');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const saveOrderBtn = document.getElementById('saveOrderBtn');

    // Firmalar yükle
    const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
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
    }

    let currentCalculation = null;

    calculateBtn.addEventListener('click', () => {
        const width = parseFloat(inputWidth.value);
        const height = parseFloat(inputHeight.value);
        const count = parseInt(inputCount.value);
        const price = parseFloat(inputPrice.value);
        const sellPrice = parseFloat(document.getElementById('plateSellPrice').value) || price;
        const currency = inputCurrency.value;

        if (isNaN(width) || isNaN(height) || isNaN(count) || isNaN(price)) {
            showToast('Lütfen tüm alanları doldurun!', 'error');
            return;
        }

        const area = width * height; // cm²
        const m2Area = area / 10000; // m²
        const totalAreaM2 = m2Area * count; // Toplam m²
        
        const priceM2 = price; // gelen fiyat m²
        const priceCm2 = price / 10000; // cm² fiyat

        const totalCost = totalAreaM2 * priceM2; // Toplam maliyet
        const totalSell = totalAreaM2 * sellPrice; // Toplam Satış
        const profit = totalSell - totalCost;

        let totalCostUSD = totalSell; // Biz sipariş fiyatı olarak Toptan Satışı kaydederiz
        if (currency === 'EUR') {
            totalCostUSD = totalSell * 1.08; 
        }

        resArea.textContent = `${area.toFixed(1)} cm² (${m2Area.toFixed(4)} m²)`;
        const resTotalArea = document.getElementById('resTotalArea');
        if (resTotalArea) resTotalArea.textContent = `${totalAreaM2.toFixed(4)} m²`;
        
        resQuantity.textContent = `${count} Adet / Renk`;
        resPrice.textContent = `${priceM2.toFixed(2)} ${currency}`;
        
        const resPriceCm = document.getElementById('resPriceCm');
        if (resPriceCm) resPriceCm.textContent = `${priceCm2.toFixed(6)} ${currency}`;
        
        document.getElementById('resCostTotal').textContent = `${totalCost.toFixed(2)} ${currency}`;
        document.getElementById('resSellTotal').textContent = `${totalSell.toFixed(2)} ${currency}`;
        document.getElementById('resProfit').textContent = `${profit.toFixed(2)} ${currency}`;

        resTotalUSD.textContent = formatCurrency(totalCostUSD);

        currentCalculation = {
            type: 'Klişe',
            name: `${width}x${height} cm Klişe (${count} Renk)`,
            quantity: count,
            price: sellPrice / 10000, // Sales unit price in cm2 format mapped for invoices
            currency: currency,
            totalPriceUSD: totalCostUSD,
            paymentMethod: inputPayment.value
        };

        if (saveOrderBtn) saveOrderBtn.disabled = false;
        showToast('Hesaplama tamamlandı.', 'success');
    });

    if (saveOrderBtn) {
        saveOrderBtn.addEventListener('click', () => {
            const selectedFirmaId = firmaSec.value;
            if (!selectedFirmaId) {
                showToast('Lütfen işlem yapılacak firmayı seçiniz!', 'error');
                return;
            }

            if (!currentCalculation) return;

            const siparisler = typeof getSiparisler === 'function' ? getSiparisler() : [];
            const newOrder = {
                id: 'ord_' + Date.now().toString(36),
                firmaId: selectedFirmaId,
                date: new Date().toISOString(),
                ...currentCalculation
            };

            siparisler.push(newOrder);
            if (typeof saveSiparisler === 'function') {
                saveSiparisler(siparisler);
            } else {
                localStorage.setItem('etiket_crm_orders', JSON.stringify(siparisler));
            }

            showToast('Klişe siparişi firmaya kaydedildi.', 'success');
            
            setTimeout(() => {
                window.location.href = `firma_detay.html?id=${selectedFirmaId}`;
            }, 1200);
        });
    }
});
