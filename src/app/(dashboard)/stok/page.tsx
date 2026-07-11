"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Package, 
  Printer, 
  Droplets, 
  Box, 
  AlertTriangle, 
  Tags,
  ScanBarcode,
  ArrowDownToLine,
  ArrowUpFromLine
} from "lucide-react";

export default function StokTakibiPage() {
  const stokKategorileri = [
    { baslik: "Kağıt Stokları", link: "/stok/kagit", adet: 45, icon: <Package className="w-8 h-8 text-blue-500" />, bg: "bg-blue-50", border: "hover:border-blue-200" },
    { baslik: "Klişe Stokları", link: "/stok/klise", adet: 120, icon: <Printer className="w-8 h-8 text-purple-500" />, bg: "bg-purple-50", border: "hover:border-purple-200" },
    { baslik: "Mürekkep Stokları", link: "/stok/murekkep", adet: 32, icon: <Droplets className="w-8 h-8 text-cyan-500" />, bg: "bg-cyan-50", border: "hover:border-cyan-200" },
    { baslik: "Sarf Malzemeler", link: "/stok/sarf-malzeme", adet: 85, icon: <Box className="w-8 h-8 text-orange-500" />, bg: "bg-orange-50", border: "hover:border-orange-200" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-500" /> Stok Takibi
          </h1>
          <p className="text-sm text-slate-500 mt-1">Depodaki tüm malzemelerin güncel durumunu yönetin.</p>
        </div>
        <Link href="/stok/fiyatlar">
          <Button variant="outline" className="font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 gap-2">
            <Tags className="w-4 h-4" /> Malzeme Fiyat Listesi
          </Button>
        </Link>
      </div>

      {/* Barkod ile Hızlı İşlem */}
      <Card className="shadow-sm border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <ScanBarcode className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 w-full relative max-w-md">
              <input 
                type="text" 
                placeholder="Barkod Okutun veya Yazın..." 
                autoFocus
                className="w-full pl-4 pr-4 py-3 bg-white border-2 border-indigo-100 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all font-mono font-bold text-slate-700 shadow-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 py-6">
              <ArrowDownToLine className="w-5 h-5" /> İçe Aktar (Giriş)
            </Button>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white font-bold gap-2 py-6">
              <ArrowUpFromLine className="w-5 h-5" /> Dışa Aktar (Çıkış)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kategoriler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stokKategorileri.map((kat, index) => (
          <Link key={index} href={kat.link}>
            <Card className={`shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all cursor-pointer border-slate-100 ${kat.border} hover:-translate-y-1`}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl ${kat.bg} flex items-center justify-center shadow-inner`}>
                  {kat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{kat.baslik}</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{kat.adet} Çeşit Ürün</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Kritik Stok Uyarıları */}
      <Card className="border-red-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50 flex justify-between items-center">
          <h3 className="font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Kritik Seviyedeki Stoklar
          </h3>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            <div className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-800">Kuşe Etiket Kağıdı (Bobin)</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Minimum: 50 Bobin</p>
              </div>
              <div className="text-red-600 font-black bg-red-100/50 px-4 py-2 rounded-lg tracking-tight">12 Bobin Kaldı</div>
            </div>
            <div className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-bold text-slate-800">Siyah Mürekkep (UV)</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Minimum: 10 Kutu</p>
              </div>
              <div className="text-red-600 font-black bg-red-100/50 px-4 py-2 rounded-lg tracking-tight">3 Kutu Kaldı</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
