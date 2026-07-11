"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LineChart,
  BarChart3,
  Building2,
  ShoppingCart,
  ClipboardList,
  Truck,
  Users,
  Calendar,
  Wallet,
  Tags,
  Package,
  Megaphone,
  Wrench,
  Briefcase,
  Settings,
  LogOut
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  const menuCategories = [
    {
      title: "GENEL",
      items: [
        { name: "Genel Bakış", href: "/", icon: LineChart, color: "text-blue-500" },
        { name: "Analiz & Raporlar", href: "/analiz", icon: BarChart3, color: "text-purple-500" },
        { name: "Firmalar", href: "/firmalar", icon: Building2, color: "text-emerald-500" },
      ],
    },
    {
      title: "SİPARİŞ YÖNETİMİ",
      items: [
        { name: "Sipariş Oluştur", href: "/siparisler/yeni", icon: ShoppingCart, color: "text-indigo-500" },
        { name: "Alınan Siparişler", href: "/siparisler", icon: ClipboardList, color: "text-sky-500" },
        { name: "Sevkiyat Takibi", href: "/lojistik/sevkiyat", icon: Truck, color: "text-teal-500" },
      ],
    },
    {
      title: "ZİYARET & PLANLAMA",
      items: [
        { name: "Ziyaret Kayıtları", href: "/ziyaretler", icon: ClipboardList, color: "text-amber-400" },
        { name: "Ziyaret Takvimi", href: "/takvim", icon: Calendar, color: "text-pink-400" },
      ],
    },
    {
      title: "FİNANS & ÜRÜN",
      items: [
        { name: "Ödeme Takibi & Cari", href: "/finans/odemeler", icon: Wallet, color: "text-cyan-400" },
        { name: "Malzeme Fiyatları", href: "/stok/fiyatlar", icon: Tags, color: "text-pink-500" },
        { name: "Stok ve Rapor Paylaşımı", href: "/stok", icon: Package, color: "text-orange-400" },
      ],
    },
    {
      title: "OPERASYON & DESTEK",
      items: [
        { name: "Duyurular", href: "/duyurular", icon: Megaphone, color: "text-orange-500" },
        { name: "Teknik Servis", href: "/teknik-servis", icon: Wrench, color: "text-cyan-500" },
        { name: "Muhasebe Paneli", href: "/muhasebe", icon: Briefcase, color: "text-lime-500" },
      ],
    },
    {
      title: "SİSTEM",
      items: [
        { name: "Ayarlar", href: "/ayarlar", icon: Settings, color: "text-slate-500" },
      ],
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-40">
      <div className="flex flex-col items-center justify-center pt-8 pb-6 shrink-0 bg-white">
        <div className="w-14 h-14 rounded-2xl bg-[#1d4ed8] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-3">
          <LineChart className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl font-black text-[#1d4ed8] tracking-tight leading-none">
            LINKUP
          </span>
          <span className="text-sm font-bold text-slate-600 mt-1">
            <span className="text-red-500">CRM</span> by Yasin
          </span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 overflow-y-auto space-y-6 custom-scrollbar bg-white">
        {menuCategories.map((category, idx) => (
          <div key={idx}>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
              {category.title}
            </h4>
            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = 
                  pathname === item.href || 
                  (item.href !== "/" && pathname?.startsWith(item.href) && !(item.href === "/siparisler" && pathname?.startsWith("/siparisler/yeni")));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-bold group ${
                      isActive 
                        ? "bg-blue-100 text-blue-700" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.color} ${!isActive && 'opacity-80 group-hover:opacity-100'} transition-all`} strokeWidth={2.5} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="p-4 bg-white shrink-0">
        <div className="flex items-center justify-between px-2 py-3 border border-slate-200 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 ml-3"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">PATRON</span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 mr-4">Aktif</span>
        </div>
      </div>
    </aside>
  );
};
