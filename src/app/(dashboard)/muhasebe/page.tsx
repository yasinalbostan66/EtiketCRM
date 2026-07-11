"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Calculator, Plus, Receipt, FileText, Search, CreditCard, Landmark, Wallet, TrendingUp, ArrowDownRight, ArrowUpRight, Check, AlertCircle } from "lucide-react";

// Mock Data
const faturalar = [
  { id: "INV-2026-1042", cari: "Yıldız Etiket San. Tic. A.Ş.", tarih: "12.07.2026", tutar: "₺12.450,00", kdv: "Dahil", durum: "Ödendi", tip: "Satiş" },
  { id: "INV-2026-1041", cari: "Örnek Matbaacılık", tarih: "10.07.2026", tutar: "₺8.200,00", kdv: "Hariç", durum: "Bekliyor", tip: "Satiş" },
  { id: "EXP-2026-089", cari: "Kağıtçı Kardeşler A.Ş.", tarih: "05.07.2026", tutar: "₺45.000,00", kdv: "Dahil", durum: "Ödenecek", tip: "Alış" },
];

export default function MuhasebePage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-teal-600" /> Genel Muhasebe
          </h1>
          <p className="text-sm text-slate-500 mt-1">Fatura, irsaliye, çek/senet ve cari hesap takibi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-200 text-slate-700 font-bold hover:bg-slate-50 gap-2">
            <Receipt className="w-4 h-4 text-slate-500" /> Yeni Fatura Kes
          </Button>
          <Button className="shadow-lg shadow-teal-500/20 font-bold px-6 flex items-center gap-2 bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4" /> Fatura İşle
          </Button>
        </div>
      </div>

      {/* 7 Kartlık Özet Alanı */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Satır 1 */}
        <Card className="shadow-sm border-emerald-100 bg-gradient-to-br from-emerald-50 to-white relative overflow-hidden">
          <ArrowDownRight className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500 opacity-5" />
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Toplam Alacaklar</h3>
            <p className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">₺184.500</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-rose-100 bg-gradient-to-br from-rose-50 to-white relative overflow-hidden">
          <ArrowUpRight className="absolute -right-4 -bottom-4 w-24 h-24 text-rose-500 opacity-5" />
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wide">Toplam Borçlar</h3>
            <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight">₺42.300</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-blue-100 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
          <Wallet className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500 opacity-5" />
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wide">Kasa Bakiyesi</h3>
            <p className="text-2xl font-black text-blue-600 mt-1 tracking-tight">₺18.250</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-indigo-100 bg-gradient-to-br from-indigo-50 to-white relative overflow-hidden">
          <Landmark className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500 opacity-5" />
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Banka Hesapları</h3>
            <p className="text-2xl font-black text-indigo-600 mt-1 tracking-tight">₺124.800</p>
          </CardContent>
        </Card>

        {/* Satır 2 */}
        <Card className="shadow-sm border-slate-200 bg-white relative overflow-hidden lg:col-span-2">
          <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-500 opacity-5" />
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Aylık Ciro (Temmuz)</h3>
            <p className="text-2xl font-black text-slate-800 mt-1 tracking-tight">₺345.000</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-amber-100 bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">
          <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-500 opacity-5" />
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Vadesi Gelen Çekler</h3>
            <p className="text-2xl font-black text-amber-600 mt-1 tracking-tight">3 Adet</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-purple-100 bg-gradient-to-br from-purple-50 to-white relative overflow-hidden">
          <Calculator className="absolute -right-4 -bottom-4 w-24 h-24 text-purple-500 opacity-5" />
          <CardContent className="p-5">
            <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wide">Ödenecek KDV Durumu</h3>
            <p className="text-2xl font-black text-purple-600 mt-1 tracking-tight">₺12.450</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Son Faturalar ve Fişler</h2>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Fatura No veya Cari Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FATURA NO</TableHead>
                <TableHead>CARİ / FİRMA</TableHead>
                <TableHead>TARİH</TableHead>
                <TableHead>TUTAR</TableHead>
                <TableHead>KDV DURUMU</TableHead>
                <TableHead>DURUM</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {faturalar.map((fatura) => (
                <TableRow key={fatura.id}>
                  <TableCell className="font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      {fatura.tip === 'Satiş' ? <ArrowDownRight className="w-4 h-4 text-emerald-500" /> : <ArrowUpRight className="w-4 h-4 text-rose-500" />}
                      {fatura.id}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">{fatura.cari}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{fatura.tarih}</TableCell>
                  <TableCell className="font-black text-slate-800 tracking-tight">{fatura.tutar}</TableCell>
                  <TableCell className="text-slate-500 font-medium">{fatura.kdv}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide
                      ${fatura.durum === 'Ödendi' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                        fatura.durum === 'Bekliyor' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                      {fatura.durum === 'Ödendi' ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {fatura.durum}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 gap-1.5 px-3">
                      <FileText className="w-3.5 h-3.5" /> Görüntüle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
