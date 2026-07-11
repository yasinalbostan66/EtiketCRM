"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { ArrowLeftRight, Search, Plus, FileText, Check, AlertCircle, Clock } from "lucide-react";

// Mock Data
const iadeler = [
  { id: 1, iadeKodu: "RET-26-001", firma: "Örnek Matbaacılık", urun: "Cyan Mürekkep", miktar: "5 kg", tarih: "06.07.2026", durum: "İnceleniyor", sebep: "Hasarlı Ambalaj" },
  { id: 2, iadeKodu: "RET-26-002", firma: "Yıldız Etiket", urun: "Kuşe Bobin", miktar: "150 m²", tarih: "05.07.2026", durum: "Kabul Edildi", sebep: "Kalite Uyuşmazlığı" },
  { id: 3, iadeKodu: "RET-26-003", firma: "Tek Etiket", urun: "Klişe", miktar: "1 Adet", tarih: "01.07.2026", durum: "Reddedildi", sebep: "Kullanıcı Hatası" },
];

export default function IadelerPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-red-500" strokeWidth={2.5} /> İade Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-1">Müşterilerden dönen iadeleri ve fire süreçlerini takip edin.</p>
        </div>
        <Button className="shadow-lg shadow-red-500/20 font-bold px-6 flex items-center gap-2 bg-red-500 hover:bg-red-600">
          <Plus className="w-4 h-4" /> İade Talebi Gir
        </Button>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">İade Talepleri Listesi</h2>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Firma, Kod veya Ürün Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İADE KODU</TableHead>
                <TableHead>FİRMA</TableHead>
                <TableHead>ÜRÜN & MİKTAR</TableHead>
                <TableHead>TARİH</TableHead>
                <TableHead>İADE SEBEBİ</TableHead>
                <TableHead>DURUM</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {iadeler.map((iade) => (
                <TableRow key={iade.id}>
                  <TableCell className="font-bold text-slate-700">{iade.iadeKodu}</TableCell>
                  <TableCell className="font-bold text-slate-800">{iade.firma}</TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-800">{iade.urun}</div>
                    <div className="text-[11px] font-semibold text-slate-500">{iade.miktar}</div>
                  </TableCell>
                  <TableCell className="text-slate-600">{iade.tarih}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{iade.sebep}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase
                      ${iade.durum === 'Kabul Edildi' ? 'bg-emerald-50 text-emerald-600' : 
                        iade.durum === 'Reddedildi' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                      {iade.durum === 'Kabul Edildi' && <Check className="w-3 h-3" />}
                      {iade.durum === 'Reddedildi' && <AlertCircle className="w-3 h-3" />}
                      {iade.durum === 'İnceleniyor' && <Clock className="w-3 h-3" />}
                      {iade.durum}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 gap-1.5 px-3">
                        <FileText className="w-3.5 h-3.5" /> İncele
                      </Button>
                    </div>
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
