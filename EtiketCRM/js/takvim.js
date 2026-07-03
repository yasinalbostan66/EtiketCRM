const getVisits = () => JSON.parse(localStorage.getItem('etiket_crm_ziyaretler')) || [];
const saveVisits = (visits) => {
    localStorage.setItem('etiket_crm_ziyaretler', JSON.stringify(visits));
    try {
        if (firebase.auth().currentUser) {
            visits.forEach(item => {
                if (item.id) {
                    firebase.firestore().collection('ziyaretler').doc(item.id).set(item, { merge: true })
                       .catch(e => console.error("Firestore Save Fail (Visits):", e));
                }
            });
        }
    } catch (e) {}
};

document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    const form = document.getElementById('visitForm');
    const firmaSelect = document.getElementById('visitFirma');

    if (!calendarEl || !form) return;

    // Firma Seçim Kutusunu Doldur
    function populateFirmaSelect() {
        const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
        firmaSelect.innerHTML = '<option value="">Seçiniz...</option>';
        firmalar.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = f.ad;
            firmaSelect.appendChild(opt);
        });
    }
    populateFirmaSelect();

    populateFirmaSelect();    // FullCalendar Kurulumu
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek', // Haftalık Plan (zaman aralıklı)
        locale: 'tr',
        headerToolbar: false, // Varsayılan FC toolbar kapatıldı
        firstDay: 1, // Pazartesi başlasın
        slotMinTime: '08:00:00', // 08:00'den başlasın
        slotMaxTime: '17:00:00', // 17:00'de bitsin
        allDaySlot: false,
        events: getVisitsForCalendar(),
        datesSet: function(info) {
            // Görseldeki gibi başlığı güncelle (Örn: Haftalık Plan (29 Haz - 5 Tem 2026))
            const viewTitle = info.view.title;
            let customTitleText = viewTitle;
            if (info.view.type === 'timeGridWeek') {
                customTitleText = "Haftalık Plan (" + viewTitle + ")";
            } else if (info.view.type === 'timeGridDay') {
                customTitleText = "Günlük Plan (" + viewTitle + ")";
            } else if (info.view.type === 'dayGridMonth') {
                customTitleText = "Aylık Plan (" + viewTitle + ")";
            } else if (info.view.type === 'multiMonthYear') {
                customTitleText = "Yıllık Plan (" + viewTitle + ")";
            }
            const titleEl = document.getElementById('customCalendarTitle');
            if (titleEl) titleEl.textContent = customTitleText;

            // Rota hesaplamayı o günkü tarihe göre tetikle
            const todayStr = new Date().toISOString().split('T')[0];
            updateDailyRoute(todayStr);
        },
        dateClick: function(info) {
             const parts = info.dateStr.split('T');
             if (typeof window.openVisitModal === 'function') window.openVisitModal();
             document.getElementById('visitTarih').value = parts[0];
             if (parts[1]) {
                  document.getElementById('visitSaat').value = parts[1].substring(0, 5); // HH:MM
             }
             updateDailyRoute(parts[0]);
        },
        eventClick: function(info) {
             viewVisit(info.event.id);
        }
    });

    calendar.render();

    // Özel Arayüz Butonlarını FullCalendar API'sine bağla
    function wireCustomCalendarButtons() {
        const viewDay = document.getElementById('viewBtnDay');
        const viewWeek = document.getElementById('viewBtnWeek');
        const viewMonth = document.getElementById('viewBtnMonth');
        const viewYear = document.getElementById('viewBtnYear');

        const navPrev = document.getElementById('navBtnPrev');
        const navToday = document.getElementById('navBtnToday');
        const navNext = document.getElementById('navBtnNext');

        const mapRouteToggle = document.getElementById('btnMapRouteToggle');

        const updateBtnStates = (activeBtn) => {
            [viewDay, viewWeek, viewMonth, viewYear].forEach(btn => {
                if (btn) {
                    btn.style.background = '#f1f5f9';
                    btn.style.color = '#475569';
                }
            });
            if (activeBtn) {
                activeBtn.style.background = '#3b82f6';
                activeBtn.style.color = '#fff';
            }
        };

        if (viewDay) viewDay.onclick = () => { calendar.changeView('timeGridDay'); updateBtnStates(viewDay); };
        if (viewWeek) viewWeek.onclick = () => { calendar.changeView('timeGridWeek'); updateBtnStates(viewWeek); };
        if (viewMonth) viewMonth.onclick = () => { calendar.changeView('dayGridMonth'); updateBtnStates(viewMonth); };
        if (viewYear) viewYear.onclick = () => { calendar.changeView('multiMonthYear'); updateBtnStates(viewYear); }; // FullCalendar v6 includes multiMonthYear

        if (navPrev) navPrev.onclick = () => calendar.prev();
        if (navToday) navToday.onclick = () => calendar.today();
        if (navNext) navNext.onclick = () => calendar.next();

        if (mapRouteToggle) {
            mapRouteToggle.onclick = () => {
                const routePanel = document.getElementById('routePanel');
                if (routePanel) {
                    if (routePanel.style.display === 'none') {
                        routePanel.style.display = 'block';
                        // Haritayı yeniden boyutlandır Leaflet bug engellemek için
                        if (window.routeMapObj) {
                            setTimeout(() => window.routeMapObj.invalidateSize(), 200);
                        }
                    } else {
                        routePanel.style.display = 'none';
                    }
                }
            };
        }
    }
    wireCustomCalendarButtons();

    function getVisitsForCalendar() {
        const visits = getVisits();
        const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];
        return visits.map(v => {
            const f = firmalar.find(item => item.id === v.firmaId);
            
            // Duruma Göre Renk Ataması
            let eventColor = 'var(--primary)'; // Planlandı
            if (v.status === 'Tamamlandı') eventColor = 'var(--success)';
            if (v.status === 'İptal Edildi') eventColor = 'var(--danger)';
            if (v.status === 'Demo') eventColor = '#a78bfa'; // Purple for demo

            return {
                id: v.id,
                title: (f ? f.ad : 'Bilinmeyen Firma') + (v.time ? ` (${v.time})` : ''),
                start: v.date + (v.time ? `T${v.time}` : ''),
                extendedProps: { note: v.note, firmaId: v.firmaId },
                backgroundColor: eventColor,
                borderColor: eventColor,
                textColor: '#fff'
            };
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('editVisitId').value;
        const firmaId = firmaSelect.value;
        const date = document.getElementById('visitTarih').value;
        const time = document.getElementById('visitSaat').value;
        const durum = document.getElementById('visitDurum').value;
        const note = document.getElementById('visitNot').value;

        if (!firmaId || !date) {
            showToast('Lütfen firma ve tarih seçiniz.', 'error');
            return;
        }

        let visits = getVisits();
        if (editId) {
             visits = visits.map(v => v.id === editId ? { ...v, firmaId, date, time, note, status: durum } : v);
             showToast('Ziyaret kaydı güncellendi.', 'success');
        } else {
             visits.push({
                 id: 'vis_' + Date.now().toString(36),
                 firmaId,
                 date,
                 time,
                 note,
                 status: durum
             });
             showToast('Ziyaret kaydı eklendi.', 'success');
        }

        saveVisits(visits);
        document.getElementById('visitModal').style.display = 'none';
        form.reset();
        
        // Takvimi güncelle
        calendar.setOption('events', getVisitsForCalendar());
    });

    window.openVisitModal = function() {
        document.getElementById('editVisitId').value = '';
        form.reset();
        document.getElementById('visitTarih').value = new Date().toISOString().split('T')[0];
        document.getElementById('visitModalTitle').innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Ziyaret Kaydı Ekle';
        document.getElementById('visitSubmitBtn').textContent = 'Kaydet';
        document.getElementById('visitModal').style.display = 'flex';
    };

    window.openVisitModalOnDate = function(dateStr) {
        window.openVisitModal();
        document.getElementById('visitTarih').value = dateStr;
    };

    function viewVisit(id) {
        const v = getVisits().find(item => item.id === id);
        if (!v) return;

        document.getElementById('editVisitId').value = v.id;
        firmaSelect.value = v.firmaId;
        document.getElementById('visitTarih').value = v.date;
        document.getElementById('visitSaat').value = v.time || '';
        document.getElementById('visitNot').value = v.note || '';
        if (document.getElementById('visitDurum')) {
             document.getElementById('visitDurum').value = v.status || 'Planlandı';
        }

        document.getElementById('visitModalTitle').innerHTML = '<i class="fa-solid fa-calendar-check"></i> Ziyaret Kaydı Detay/Düzenleme';
        document.getElementById('visitSubmitBtn').textContent = 'Güncelle';
        document.getElementById('visitModal').style.display = 'flex';
        
        // Add a delete button in the footer for edit mode if it doesn't exist
        let deleteBtn = document.getElementById('deleteVisitBtn');
        if (!deleteBtn) {
            deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.id = 'deleteVisitBtn';
            deleteBtn.className = 'btn btn-danger';
            deleteBtn.style.marginRight = 'auto';
            deleteBtn.textContent = 'Sil';
            const footer = document.querySelector('#visitForm .d-flex');
            footer.insertBefore(deleteBtn, footer.firstChild);

            deleteBtn.addEventListener('click', () => {
                if (confirm('Bu ziyaret kaydını silmek istediğinize emin misiniz?')) {
                    let visits = getVisits().filter(item => item.id !== document.getElementById('editVisitId').value);
                    saveVisits(visits);
                    calendar.setOption('events', getVisitsForCalendar());
                    document.getElementById('visitModal').style.display = 'none';
                    showToast('Ziyaret kaydı silindi.', 'warning');
                }
            });
        } else {
             deleteBtn.style.display = 'block';
        }
    }

    // Modal kapatırken delete butonunu gizle
    document.querySelector('#visitModal .btn-outline').addEventListener('click', () => {
        const deleteBtn = document.getElementById('deleteVisitBtn');
        if (deleteBtn) deleteBtn.style.display = 'none';
    });
    
    document.querySelector('#visitModal .btn-icon').addEventListener('click', () => {
        const deleteBtn = document.getElementById('deleteVisitBtn');
        if (deleteBtn) deleteBtn.style.display = 'none';
    });

    // --- Günlük Rota Planlayıcı Mantığı ---
    let routeMapInstance = null;

    async function updateDailyRoute(dateStr) {
        const visits = getVisits().filter(v => v.date === dateStr);
        const routePanel = document.getElementById('routePanel');
        const routeList = document.getElementById('routeList');
        const btnOpenMapsRoute = document.getElementById('btnOpenMapsRoute');
        const btnShareRoute = document.getElementById('btnShareRoute');
        const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];

        if (visits.length === 0) {
            routePanel.style.display = 'none';
            return;
        }

        routePanel.style.display = 'block';
        document.getElementById('routeTitle').innerHTML = `<i class="fa-solid fa-route"></i> ${new Date(dateStr).toLocaleDateString('tr-TR')} - Ziyaret Rotası`;

        let listHtml = `<div style="display:flex; flex-direction:column; gap:10px;">`;
        let addresses = [];
        let sortedVisits = visits.sort((a,b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

        sortedVisits.forEach((v, idx) => {
            const f = firmalar.find(item => item.id === v.firmaId);
            const adr = f ? f.adres : '';
            if (adr && adr !== '-') addresses.push({ name: f.ad, address: adr, time: v.time || 'Belirtilmedi' });

            listHtml += `
                <div style="display:flex; align-items:center; gap:12px; padding:10px; background:var(--surface-hover); border-radius:8px; border:1px solid var(--border-color);">
                    <div style="width:24px; height:24px; border-radius:50%; background:var(--primary); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700;">${idx+1}</div>
                    <div style="flex:1;">
                        <div style="font-weight:600; font-size:0.9rem;">${f ? f.ad : 'Bilinmeyen Firma'}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-clock"></i> ${v.time || 'Belirtilmedi'} | <i class="fa-solid fa-location-dot"></i> ${adr || 'Adres Girilmemiş'}</div>
                    </div>
                </div>
            `;
        });
        listHtml += `</div>`;
        routeList.innerHTML = listHtml;

        // Haritayı İlklendir
        setTimeout(async () => {
            try {
                if (!routeMapInstance) {
                    routeMapInstance = L.map('routeMap').setView([39.9334, 32.8597], 6);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap'
                    }).addTo(routeMapInstance);
                } else {
                    // Mevcut katmanları/markerları temizle
                    routeMapInstance.eachLayer((layer) => {
                        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                            routeMapInstance.removeLayer(layer);
                        }
                    });
                }

                // Harita boyutu sorununu önlemek için invalidateSize çağır
                routeMapInstance.invalidateSize();

                if (addresses.length > 0) {
                    let points = [];
                    for (let i = 0; i < addresses.length; i++) {
                        const addrInfo = addresses[i];
                        try {
                            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(addrInfo.address)}`);
                            const data = await res.json();
                            if (data && data.length > 0) {
                                const lat = parseFloat(data[0].lat);
                                const lon = parseFloat(data[0].lon);
                                const latlng = [lat, lon];
                                points.push(latlng);

                                const marker = L.marker(latlng).addTo(routeMapInstance);
                                marker.bindPopup(`<b>${i+1}. ${addrInfo.name}</b><br><small>Saat: ${addrInfo.time}</small><br>${addrInfo.address}`);
                            }
                        } catch (e) {
                            console.error("Geocoding hatası:", e);
                        }
                    }

                    if (points.length > 0) {
                        if (points.length === 1) {
                            routeMapInstance.setView(points[0], 13);
                        } else {
                            const bounds = L.latLngBounds(points);
                            routeMapInstance.fitBounds(bounds, { padding: [30, 30] });
                            L.polyline(points, { color: '#0ea5e9', weight: 4, dashArray: '5, 8' }).addTo(routeMapInstance);
                        }
                    }
                }
            } catch (err) {
                console.error("Leaflet harita yükleme hatası:", err);
            }
        }, 300);

        if (addresses.length > 0) {
            btnOpenMapsRoute.style.display = 'block';
            btnOpenMapsRoute.onclick = () => {
                const url = `https://www.google.com/maps/dir/${addresses.map(a => encodeURIComponent(a.address)).join('/')}`;
                window.open(url, '_blank');
            };

            btnShareRoute.style.display = 'block';
            btnShareRoute.onclick = async () => {
                let shareText = `📅 *${new Date(dateStr).toLocaleDateString('tr-TR')} Ziyaret Planı*\n\n`;
                sortedVisits.forEach((v, idx) => {
                    const f = firmalar.find(item => item.id === v.firmaId);
                    shareText += `${idx+1}. *${f ? f.ad : 'Bilinmeyen'}* (${v.time || 'Saat Belirtilmedi'})\n`;
                    if (f && f.adres) shareText += `📍 Adres: ${f.adres}\n`;
                    shareText += `---\n`;
                });

                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Günlük Ziyaret Planı',
                            text: shareText
                        });
                    } catch (err) { console.error('Paylaşım İptal:', err); }
                } else {
                    navigator.clipboard.writeText(shareText);
                    showToast('Plan kopyalandı! WhatsApp veya Mail ile yapıştırabilirsiniz.', 'success');
                }
            };
        } else {
            btnOpenMapsRoute.style.display = 'none';
            btnShareRoute.style.display = 'none';
        }
    }

    // İlk yüklemede bugünün rotasını göster
    updateDailyRoute(new Date().toISOString().split('T')[0]);

    // Bulut Senkronizasyonu Tetikleyicisi
    window.addEventListener('storage', () => {
        if (typeof calendar !== 'undefined' && typeof getVisitsForCalendar === 'function') {
            calendar.setOption('events', getVisitsForCalendar());
        }
    });
});
