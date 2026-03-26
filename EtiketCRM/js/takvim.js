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

    populateFirmaSelect();

    // FullCalendar Kurulumu
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'tr',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today: 'Bugün',
            year: 'Yıl',
            month: 'Ay',
            week: 'Hafta',
            day: 'Gün'
        },
        events: getVisitsForCalendar(),
        datesSet: function(info) {
             const d = info.view.currentStart;
             const yearSelect = document.getElementById('fcYearSelect');
             if (yearSelect) {
                 yearSelect.value = d.getFullYear();
             }
        },
        dateClick: function(info) {
             const parts = info.dateStr.split('T');
             if (typeof window.openVisitModal === 'function') window.openVisitModal();
             document.getElementById('visitTarih').value = parts[0];
             if (parts[1]) {
                  document.getElementById('visitSaat').value = parts[1].substring(0, 5); // HH:MM
             }
             // O güne ait rota planını göster
             updateDailyRoute(parts[0]);
        },
        eventClick: function(info) {
             viewVisit(info.event.id);
        }
    });

    // Toolbar'a Özel Yıl Seçici Ekle
    function injectYearSelect() {
        const rightChunk = document.querySelector('#calendar .fc-toolbar-chunk:last-child');
        if (rightChunk) {
            const select = document.createElement('select');
            select.id = 'fcYearSelect';
            select.className = 'fc-button fc-button-primary'; // Match FC style if possible, or form-control
            select.style.padding = '4px 10px';
            select.style.background = 'var(--surface-color)';
            select.style.border = '1px solid var(--border-color)';
            select.style.color = 'var(--text-main)';
            select.style.borderRadius = '4px';
            select.style.marginLeft = '8px';
            select.style.height = '34px'; // Match button heights

            const currentYear = new Date().getFullYear();
            for (let y = currentYear - 3; y <= currentYear + 3; y++) {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                select.appendChild(opt);
            }
            select.value = calendar.view.currentStart.getFullYear();

            select.addEventListener('change', (e) => {
                 const current = calendar.view.currentStart;
                 calendar.gotoDate(new Date(parseInt(e.target.value), current.getMonth(), 1));
            });

            rightChunk.appendChild(select);
        }
    }

    calendar.render();
    injectYearSelect();

    const jumpBtn = { addEventListener: () => {} }; // Dummy to avoid errors if any other script binds to it

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
    function updateDailyRoute(dateStr) {
        const visits = getVisits().filter(v => v.date === dateStr);
        const routePanel = document.getElementById('routePanel');
        const routeList = document.getElementById('routeList');
        const btnOpenMapsRoute = document.getElementById('btnOpenMapsRoute');
        const firmalar = typeof getFirmalar === 'function' ? getFirmalar() : [];

        if (visits.length === 0) {
            routePanel.style.display = 'none';
            return;
        }

        routePanel.style.display = 'block';
        document.getElementById('routeTitle').innerHTML = `<i class="fa-solid fa-route"></i> ${new Date(dateStr).toLocaleDateString('tr-TR')} - Ziyaret Rotası`;

        let listHtml = `<div style="display:flex; flex-direction:column; gap:10px;">`;
        let addresses = [];

        visits.sort((a,b) => (a.time || '99:99').localeCompare(b.time || '99:99')).forEach((v, idx) => {
            const f = firmalar.find(item => item.id === v.firmaId);
            const adr = f ? f.adres : '';
            if (adr && adr !== '-') addresses.push(adr);

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

        if (addresses.length > 0) {
            btnOpenMapsRoute.style.display = 'block';
            btnOpenMapsRoute.onclick = () => {
                const url = `https://www.google.com/maps/dir/${addresses.map(a => encodeURIComponent(a)).join('/')}`;
                window.open(url, '_blank');
            };
        } else {
            btnOpenMapsRoute.style.display = 'none';
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
