"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Tags, Search, Plus, Edit2, TrendingUp, TrendingDown, Minus } from "lucide-react";

// Mock Data
const fiyatlar = [
  { id: 1, malzeme: "Kuşe Bobin 80gr", fiyat: "$0.38 / m²", tedarikci: "Örnek Matbaacılık", tarih: "08.07.2026", trend: "up" },
  { id: 2, fiyat: "€12.50 / kg", malzeme: "Cyan Mürekkep UV", tedarikci: "Renk Tedarik A.Ş.", tarih: "05.07.2026", trend: "same" },
  { id: 3, malzeme: "Termal Etiket 100x150", fiyat: "₺0.12 / Adet", tedarikci: "Siz Etiket", tarih: "01.07.2026", trend: "down" },
];

export default function FiyatlarPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Tags className="w-6 h-6 text-amber-500" strokeWidth={2.5} /> Malzeme Fiyat Listesi
          </h1>
          <p className="text-sm text-slate-500 mt-1">Tedarikçilerden alınan güncel fiyatlar ve kurlar.</p>
        </div>
        <Button className="shadow-lg shadow-amber-500/20 font-bold px-6 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4" /> Fiyat Güncelle
        </Button>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Güncel Fiyat Listesi</h2>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Malzeme veya Tedarikçi Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MALZEME CİNSİ</TableHead>
                <TableHead>BİRİM FİYATI</TableHead>
                <TableHead>TEDARİKÇİ</TableHead>
                <TableHead>SON GÜNCELLEME</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {fiyatlar.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-slate-800">{item.malzeme}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-700 tracking-tight">{item.fiyat}</span>
                      {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" title="Fiyat Arttı" />}
                      {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" title="Fiyat Düştü" />}
                      {item.trend === 'same' && <Minus className="w-4 h-4 text-slate-400" title="Fiyat Değişmedi" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">{item.tedarikci}</TableCell>
                  <TableCell className="text-slate-500 text-sm">{item.tarih}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="font-semibold text-amber-600 border-amber-200 hover:bg-amber-50 gap-1.5 px-3">
                      <Edit2 className="w-3.5 h-3.5" /> Düzenle
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
