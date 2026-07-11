"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, AlignLeft, X } from "lucide-react";

// Mock Events
const initialEvents = [
  { id: 1, title: "Örnek Matbaacılık Ziyareti", date: "2026-07-15", time: "14:00", type: "ziyaret", firma: "Örnek Matbaacılık", adres: "Atatürk Organize Sanayi Bölgesi 10001 Sk. No:14 Çiğli / İzmir" },
  { id: 2, title: "Haftalık Toplantı", date: "2026-07-10", time: "09:00", type: "toplanti", firma: null, adres: "" },
  { id: 3, title: "Sipariş Teslimatı (Yıldız Etiket)", date: "2026-07-18", time: "11:30", type: "teslimat", firma: "Yıldız Etiket", adres: "Kemalpaşa Mah. No:3 Bornova" },
];

export default function TakvimPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Temmuz 2026
  const [view, setView] = useState("month");
  const [events, setEvents] = useState(initialEvents);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDateForAdd, setSelectedDateForAdd] = useState<string>("");

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Adjust so Monday is 0
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

  const handlePrev = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNext = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const handleToday = () => {
    setCurrentDate(new Date(2026, 6, 11)); // Hardcoded for mockup consistency
  };

  const handleCellDoubleClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateForAdd(dateStr);
    setIsAddModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(ev => ev.date === dateStr);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 overflow-hidden">
      
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 w-48">
             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg">
            <button onClick={handlePrev} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition-all"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={handleToday} className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm rounded transition-all">Bugün</button>
            <button onClick={handleNext} className="p-1.5 rounded hover:bg-white hover:shadow-sm text-slate-600 transition-all"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => setView('day')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${view === 'day' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Gün</button>
            <button onClick={() => setView('week')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${view === 'week' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Hafta</button>
            <button onClick={() => setView('month')} className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${view === 'month' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Ay</button>
          </div>
          <Button onClick={() => { setSelectedDateForAdd(""); setIsAddModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 font-bold px-4">
            + Oluştur
          </Button>
        </div>
      </div>

      {/* Calendar Grid (Month View) */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-white">
          {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map(day => (
            <div key={day} className="py-2 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Month Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-200 gap-px">
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - startOffset + 1;
            const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
            const isToday = isCurrentMonth && dayNum === 11; // Mock today

            return (
              <div 
                key={i} 
                onDoubleClick={() => isCurrentMonth && handleCellDoubleClick(dayNum)}
                className={`bg-white p-1 flex flex-col transition-colors min-h-[100px] ${!isCurrentMonth ? 'bg-slate-50/50' : 'hover:bg-blue-50/10 cursor-pointer'}`}
              >
                {isCurrentMonth && (
                  <>
                    <div className="flex justify-center mb-1">
                      <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                        {dayNum}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                      {getEventsForDay(dayNum).map(ev => (
                        <div 
                          key={ev.id} 
                          onClick={(e) => handleEventClick(e, ev)}
                          className={`text-xs px-2 py-1 rounded truncate cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 font-semibold shadow-sm
                            ${ev.type === 'ziyaret' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 
                              ev.type === 'toplanti' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                              'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}
                        >
                          {ev.time} {ev.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Yeni Etkinlik</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Etkinlik Başlığı" className="w-full text-xl font-bold placeholder:text-slate-300 border-b-2 border-slate-100 focus:border-blue-500 outline-none pb-2 transition-colors bg-transparent"/>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Tarih</label>
                  <input type="date" defaultValue={selectedDateForAdd} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Saat</label>
                  <input type="time" defaultValue="09:00" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Firma (İsteğe Bağlı)</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  <option value="">Firma Seçin...</option>
                  <option value="1">Örnek Matbaacılık</option>
                  <option value="2">Yıldız Etiket</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="font-bold text-slate-600">İptal</Button>
              <Button onClick={() => setIsAddModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 font-bold px-6">Kaydet</Button>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {isViewModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"><Edit2 className="w-4 h-4"/></button>
              <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-6 pt-10">
              <h2 className="text-xl font-bold text-slate-800 mb-4">{selectedEvent.title}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-700">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-semibold">{selectedEvent.date}</p>
                    <p className="text-xs text-slate-500">{selectedEvent.time} - {selectedEvent.time.replace(/(\d+):/, (m: string, p1: string) => `${parseInt(p1)+1}:`)}</p>
                  </div>
                </div>
                
                {selectedEvent.firma && (
                  <div className="flex items-start gap-3 text-slate-700 pt-2 border-t border-slate-100">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{selectedEvent.firma}</p>
                      <p className="text-xs text-slate-500 mb-3">{selectedEvent.adres}</p>
                      
                      {/* Harita Görüntüsü Placeholder */}
                      <div className="h-32 bg-slate-100 rounded-lg overflow-hidden relative">
                        <iframe 
                          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d27.0!3d38.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1str!2str!4v1`} 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen={false} 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0 grayscale contrast-125"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3 text-slate-700 pt-2 border-t border-slate-100">
                  <AlignLeft className="w-5 h-5 text-slate-400 mt-0.5" />
                  <p className="text-sm text-slate-600">Bu etkinlik sistem tarafından otomatik oluşturulmuştur.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Quick inline icon component to avoid extra imports if not available in lucide
function Edit2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );
}
