"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Truck, Search, Plus, FileText, Check, Clock } from "lucide-react";

// Mock Data
const sevkiyatlar = [
  { id: 1, irsaliyeNo: "IRS-2026-001", firma: "Örnek Matbaacılık", siparisNo: "SP-1042", tarih: "05.07.2026", durum: "Hazırlanıyor", sofor: "Ahmet Y." },
  { id: 2, irsaliyeNo: "IRS-2026-002", firma: "Yıldız Etiket", siparisNo: "SP-1043", tarih: "05.07.2026", durum: "Yolda", sofor: "Mehmet K." },
  { id: 3, irsaliyeNo: "IRS-2026-003", firma: "Siz Etiket", siparisNo: "SP-1039", tarih: "04.07.2026", durum: "Teslim Edildi", sofor: "Ali R." },
];

export default function SevkiyatPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-500" strokeWidth={2.5} /> Sevkiyat Planlama
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gönderime hazır siparişleri ve kargo süreçlerini yönetin.</p>
        </div>
        <Button className="shadow-lg shadow-emerald-500/20 font-bold px-6 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4" /> İrsaliye Oluştur
        </Button>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Bekleyen ve Çıkan Sevkiyatlar</h2>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Firma, İrsaliye veya Sipariş Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İRSALİYE NO</TableHead>
                <TableHead>FİRMA</TableHead>
                <TableHead>SİPARİŞ NO</TableHead>
                <TableHead>TARİH</TableHead>
                <TableHead>ŞOFÖR / KARGO</TableHead>
                <TableHead>DURUM</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {sevkiyatlar.map((sevkiyat) => (
                <TableRow key={sevkiyat.id}>
                  <TableCell className="font-bold text-slate-700">{sevkiyat.irsaliyeNo}</TableCell>
                  <TableCell className="font-bold text-slate-800">{sevkiyat.firma}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{sevkiyat.siparisNo}</TableCell>
                  <TableCell className="text-slate-600">{sevkiyat.tarih}</TableCell>
                  <TableCell className="text-slate-600">{sevkiyat.sofor}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase
                      ${sevkiyat.durum === 'Teslim Edildi' ? 'bg-emerald-50 text-emerald-600' : 
                        sevkiyat.durum === 'Yolda' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      {sevkiyat.durum === 'Teslim Edildi' && <Check className="w-3 h-3" />}
                      {sevkiyat.durum === 'Yolda' && <Truck className="w-3 h-3" />}
                      {sevkiyat.durum === 'Hazırlanıyor' && <Clock className="w-3 h-3" />}
                      {sevkiyat.durum}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 gap-1.5 px-3">
                        <FileText className="w-3.5 h-3.5" /> Görüntüle
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
