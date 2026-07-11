"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Building2, 
  FileText, 
  Banknote, 
  HandCoins, 
  Megaphone, 
  Handshake, 
  User, 
  Clock 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
              <Building2 className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">5</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Kayıtlı Firma</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <FileText className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">7</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Toplam Sipariş Kalemi</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm shadow-orange-500/20">
              <Banknote className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">$100,300...</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Toplam Gelir (USD)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-200 text-purple-600 flex items-center justify-center shadow-sm shadow-purple-500/10">
              <HandCoins className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800">$64,021.46</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Alınacak Ödeme<br/>(USD)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alt Bölümler */}
      <div className="space-y-6">
        {/* Sistem Duyuruları */}
        <Card className="shadow-sm border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-orange-500 flex items-center gap-2">
              <Megaphone className="w-5 h-5" strokeWidth={2.5} /> Sistem Duyuruları
            </h3>
            <button className="text-[11px] font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              Tümünü Gör
            </button>
          </div>
          <CardContent className="p-6">
            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
              <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-[13px]">Ürünler Hakkında</h4>
                  <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                    Firmadan İrsaliyesiz yada faturasız ürün çıkmayacak. İade gelen ürünlerin üstüne not düşülecek.
                  </p>
                </div>
                <span className="bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded">Önemli</span>
              </div>
              <div className="px-4 py-3 bg-slate-50 flex items-center justify-between text-[11px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" strokeWidth={2.5} /> 7 Tem 12:13
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" strokeWidth={2.5} /> PATRON
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Son Yapılan Firma Ziyaretleri */}
        <Card className="shadow-sm border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-blue-600 flex items-center gap-2">
              <Handshake className="w-5 h-5" strokeWidth={2.5} /> Son Yapılan Firma Ziyaretleri
            </h3>
            <button className="text-[11px] font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              Tümünü Gör
            </button>
          </div>
          <CardContent className="p-6">
            <div className="relative pl-6 border-l-[3px] border-emerald-500 py-2">
              <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[8px] top-3 border-2 border-white shadow-sm"></div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-blue-600 text-[13px]">Yaz Etiket</h4>
                <span className="text-[11px] font-bold text-slate-400">19.03.2026 13:00</span>
              </div>
              <p className="text-[12px] font-medium text-slate-600 mb-4">
                Tanıtımı yapıldı.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <User className="w-3.5 h-3.5" strokeWidth={2.5} /> Satış Temsilcisi: YA
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded">Tamamlandı</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
