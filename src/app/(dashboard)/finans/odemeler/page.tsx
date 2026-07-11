"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Wallet, Search, Plus, FileText, ArrowDownLeft, ArrowUpRight, Check, Clock, DollarSign } from "lucide-react";

const odemeler = [
  { id: "OD-501", firma: "Yıldız Etiket", tutar: "₺3.200", tarih: "12 Tem 2026", tur: "Tahsilat", durum: "Bekliyor" },
  { id: "OD-502", firma: "Kardeşler Kutu", tutar: "₺8.400", tarih: "10 Tem 2026", tur: "Tahsilat", durum: "Tamamlandı" },
  { id: "OD-503", firma: "Mürekkep Tedarik A.Ş.", tutar: "₺12.000", tarih: "08 Tem 2026", tur: "Ödeme", durum: "Tamamlandı" },
];

export default function OdemeTakibiPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" strokeWidth={2.5} /> Ödeme Takibi
          </h1>
          <p className="text-sm text-slate-500 mt-1">Tahsilat ve ödeme işlemlerini yönetin.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold border-slate-200 text-slate-700 gap-2">
            <ArrowUpRight className="w-4 h-4 text-red-500" /> Gider Ekle
          </Button>
          <Button className="shadow-lg shadow-blue-500/20 font-bold px-6 flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4" /> Tahsilat Gir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm relative overflow-hidden">
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-500 opacity-5" />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-sm font-bold text-emerald-800">Bekleyen Tahsilatlar</h3>
            <p className="text-3xl font-black text-emerald-600 mt-2 tracking-tight">₺45.200</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100 shadow-sm relative overflow-hidden">
          <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-red-500 opacity-5" />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-sm font-bold text-red-800">Yapılacak Ödemeler</h3>
            <p className="text-3xl font-black text-red-600 mt-2 tracking-tight">₺18.500</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100 shadow-sm relative overflow-hidden">
          <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500 opacity-5" />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-sm font-bold text-blue-800">Kasa Bakiyesi</h3>
            <p className="text-3xl font-black text-blue-600 mt-2 tracking-tight">₺124.800</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Son İşlemler</h2>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Firma veya İşlem No Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İŞLEM NO</TableHead>
                <TableHead>FİRMA</TableHead>
                <TableHead>İŞLEM TÜRÜ</TableHead>
                <TableHead>TARİH</TableHead>
                <TableHead>TUTAR</TableHead>
                <TableHead>DURUM</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {odemeler.map((odeme) => (
                <TableRow key={odeme.id}>
                  <TableCell className="font-bold text-slate-700">{odeme.id}</TableCell>
                  <TableCell className="font-bold text-slate-800">{odeme.firma}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase border
                      ${odeme.tur === 'Tahsilat' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      {odeme.tur === 'Tahsilat' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {odeme.tur}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{odeme.tarih}</TableCell>
                  <TableCell className={`font-black tracking-tight ${odeme.tur === 'Tahsilat' ? 'text-emerald-600' : 'text-red-600'}`}>{odeme.tutar}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase
                      ${odeme.durum === 'Tamamlandı' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                      {odeme.durum === 'Tamamlandı' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {odeme.durum}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 gap-1.5 px-3">
                      <FileText className="w-3.5 h-3.5" /> Makbuz
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
