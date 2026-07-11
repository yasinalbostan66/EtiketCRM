"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Wrench, Search, Plus, Wrench as Tool, Check, Clock, Edit2 } from "lucide-react";

// Mock Data
const servisKayitlari = [
  { id: "SRV-2026-081", makine: "Heidelberg Speedmaster 52", ariza: "Baskı merdanesinde çizik var.", tarih: "12.07.2026", durum: "Açık", oncelik: "Yüksek" },
  { id: "SRV-2026-080", makine: "HP Indigo 6900", ariza: "Periyodik Bakım", tarih: "10.07.2026", durum: "İşlemde", oncelik: "Normal" },
  { id: "SRV-2026-079", makine: "Polar Giyotin", ariza: "Bıçak değişimi ve kalibrasyon", tarih: "05.07.2026", durum: "Tamamlandı", oncelik: "Normal" },
];

export default function TeknikServisPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-slate-600" /> Teknik Servis ve Bakım
          </h1>
          <p className="text-sm text-slate-500 mt-1">Makine arızaları ve periyodik bakımları takip edin.</p>
        </div>
        <Button className="shadow-lg shadow-red-500/20 font-bold px-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4" /> Arıza / Servis Talebi
        </Button>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Servis Kayıtları</h2>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Kayıt No veya Makine Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KAYIT NO</TableHead>
                <TableHead>MAKİNE / CİHAZ</TableHead>
                <TableHead>ARIZA DETAYI</TableHead>
                <TableHead>TARİH</TableHead>
                <TableHead>DURUM</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {servisKayitlari.map((kayit) => (
                <TableRow key={kayit.id}>
                  <TableCell className="font-bold text-slate-800">{kayit.id}</TableCell>
                  <TableCell className="font-semibold text-slate-700">{kayit.makine}</TableCell>
                  <TableCell className="text-slate-600 max-w-xs truncate">{kayit.ariza}</TableCell>
                  <TableCell className="text-slate-500 text-sm font-medium">{kayit.tarih}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide
                      ${kayit.durum === 'Tamamlandı' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 
                        kayit.durum === 'İşlemde' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                      {kayit.durum === 'Tamamlandı' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {kayit.durum}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 gap-1.5 px-3">
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
