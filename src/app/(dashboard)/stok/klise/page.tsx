"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Printer, Plus, Edit2, Search } from "lucide-react";

export default function KliseStokPage() {
  return (
    <div className="space-y-6">
      <BackButton />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Printer className="w-6 h-6 text-purple-500" /> Klişe ve Bıçak Stokları
          </h1>
          <p className="text-sm text-slate-500 mt-1">Üretime ait kalıp, klişe ve özel kesim bıçaklarını yönetin.</p>
        </div>
        <div className="flex gap-2">
          <Button className="shadow-lg shadow-purple-500/20 font-bold px-6 flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4" /> Yeni Klişe Ekle
          </Button>
        </div>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RAF KODU</TableHead>
                <TableHead>FİRMA / MÜŞTERİ</TableHead>
                <TableHead>TÜR</TableHead>
                <TableHead>EBAT</TableHead>
                <TableHead>DURUM</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell className="font-bold text-slate-800">R1-B2</TableCell>
                <TableCell className="font-semibold text-slate-700">Örnek Matbaacılık</TableCell>
                <TableCell className="text-slate-600">Oval Kesim Bıçağı</TableCell>
                <TableCell className="text-slate-600">50x50mm</TableCell>
                <TableCell>
                  <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide">
                    Kullanıma Hazır
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" className="font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 gap-1.5 px-3">
                      <Search className="w-3.5 h-3.5" /> Detay
                    </Button>
                    <Button variant="outline" size="sm" className="font-semibold text-purple-600 border-purple-200 hover:bg-purple-50 gap-1.5 px-3">
                      <Edit2 className="w-3.5 h-3.5" /> Düzenle
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
