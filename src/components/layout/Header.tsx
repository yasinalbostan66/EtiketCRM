"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const getPageTitle = () => {
    switch (pathname) {
      case "/": return "Genel Bakış";
      case "/analiz": return "Analiz & Raporlar";
      case "/firmalar": return "Firmalar";
      case "/siparisler/yeni": return "Sipariş Oluştur";
      case "/siparisler": return "Alınan Siparişler";
      case "/lojistik/sevkiyat": return "Sevkiyat Takibi";
      case "/ziyaretler": return "Ziyaret Kayıtları";
      case "/takvim": return "Ziyaret Takvimi";
      case "/finans/odemeler": return "Ödeme Takibi & Cari";
      case "/stok/fiyatlar": return "Malzeme Fiyatları";
      case "/stok": return "Stok ve Rapor Paylaşımı";
      case "/duyurular": return "Duyurular";
      case "/teknik-servis": return "Teknik Servis";
      case "/muhasebe": return "Muhasebe Paneli";
      case "/ayarlar": return "Ayarlar";
      case "/profil": return "Profilim";
      default: return "";
    }
  };

  const handleLogout = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.auth.signOut();
    }
    router.push("/login");
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center">
        <h1 className="text-[17px] font-bold text-slate-800">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span>TCMB Kurları:</span>
          <span className="font-bold text-slate-800">USD: 46.9800 ₺</span>
          <span className="font-bold text-slate-800 ml-1">EUR: 53.6301 ₺</span>
        </div>
        
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        {/* Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm hover:ring-2 hover:ring-blue-600/30 transition-all focus:outline-none"
          >
            YA
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Yasin Albostan</p>
                <p className="text-xs text-slate-500">yasin@etiketcrm.com</p>
              </div>
              <Link 
                href="/profil" 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
              >
                <User className="w-4 h-4" />
                Profil
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Çıkış Yap
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
