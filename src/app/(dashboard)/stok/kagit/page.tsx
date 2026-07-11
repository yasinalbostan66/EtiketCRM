"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Package, Plus, ClipboardList, Edit2 } from "lucide-react";

export default function KagitStokPage() {
  return (
    <div className="space-y-6">
      <BackButton />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" /> Kağıt Stokları
          </h1>
          <p className="text-sm text-slate-500 mt-1">Bobin, tabaka kağıt ve folyo stoklarını yönetin.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="font-bold border-slate-200 text-slate-700 gap-2">
            <ClipboardList className="w-4 h-4 text-slate-500" /> Stok Sayımı Gir
          </Button>
          <Button className="shadow-lg shadow-blue-500/20 font-bold px-6 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Yeni Kağıt Ekle
          </Button>
        </div>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ÜRÜN KODU</TableHead>
                <TableHead>KAĞIT CİNSİ</TableHead>
                <TableHead>EBAT / GRAMAJ</TableHead>
                <TableHead>MEVCUT STOK</TableHead>
                <TableHead>KRİTİK SEVİYE</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell className="font-bold text-slate-800">KG-001</TableCell>
                <TableCell className="font-semibold text-slate-700">Kuşe Etiket Kağıdı</TableCell>
                <TableCell className="text-slate-600">90gr / 33cm Bobin</TableCell>
                <TableCell className="text-red-600 font-black tracking-tight">12 Rulo</TableCell>
                <TableCell className="text-slate-500 font-medium">50 Rulo</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 gap-1.5 px-3">
                    <Edit2 className="w-3.5 h-3.5" /> Düzenle
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold text-slate-800">KG-002</TableCell>
                <TableCell className="font-semibold text-slate-700">Termal Karton</TableCell>
                <TableCell className="text-slate-600">200gr / 100x70 Tabaka</TableCell>
                <TableCell className="text-emerald-600 font-black tracking-tight">1200 Tabaka</TableCell>
                <TableCell className="text-slate-500 font-medium">500 Tabaka</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 gap-1.5 px-3">
                    <Edit2 className="w-3.5 h-3.5" /> Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
