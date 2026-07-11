"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { MapPin, Search, Plus, ExternalLink, Calendar, Phone } from "lucide-react";

// Mock Data
const ziyaretler = [
  { id: 1, tarih: "05.07.2026", firma: "Örnek Matbaacılık", yetkili: "Ahmet Yılmaz", tip: "Ziyaret", not: "Yeni sezon siparişleri ve fiyat anlaşması konuşuldu." },
  { id: 2, tarih: "03.07.2026", firma: "Yıldız Etiket", yetkili: "Ayşe Demir", tip: "Telefon", not: "Mevcut borç bakiyesi hatırlatıldı, cuma ödeme sözü alındı." },
  { id: 3, tarih: "01.07.2026", firma: "Tek Etiket", yetkili: "Hasan Çelik", tip: "Ziyaret", not: "Yeni ürün numuneleri teslim edildi." },
];

export default function ZiyaretlerPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-600" /> Müşteri Ziyaretleri
          </h1>
          <p className="text-sm text-slate-500 mt-1">Saha satış, toplantı ve ziyaret kayıtlarını yönetin.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Firma veya Yetkili Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
            />
          </div>
          <Button className="w-full sm:w-auto shadow-lg shadow-purple-500/20 font-bold px-6 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4" /> Ziyaret Kaydı
          </Button>
        </div>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Geçmiş Ziyaretler ve Aktiviteler</h2>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TARİH / TİP</TableHead>
                <TableHead>FİRMA</TableHead>
                <TableHead>İLGİLİ KİŞİ</TableHead>
                <TableHead>ZİYARET NOTU</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {ziyaretler.map((ziyaret) => (
                <TableRow key={ziyaret.id}>
                  <TableCell>
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {ziyaret.tarih}
                    </div>
                    <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase
                      ${ziyaret.tip === 'Ziyaret' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      {ziyaret.tip === 'Ziyaret' ? <MapPin className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                      {ziyaret.tip}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-slate-800">{ziyaret.firma}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{ziyaret.yetkili}</TableCell>
                  <TableCell className="text-slate-600 text-sm max-w-xs truncate" title={ziyaret.not}>{ziyaret.not}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 gap-1.5 px-3">
                      <ExternalLink className="w-3.5 h-3.5" /> Detay
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
