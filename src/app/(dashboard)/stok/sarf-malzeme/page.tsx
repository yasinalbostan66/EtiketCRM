"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Box, Plus, Edit2 } from "lucide-react";

export default function SarfMalzemePage() {
  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Box className="w-6 h-6 text-orange-500" /> Sarf Malzemeler
          </h1>
          <p className="text-sm text-slate-500 mt-1">Koli, bant, streç ve diğer ambalaj malzemeleri.</p>
        </div>
        <div className="flex gap-2">
          <Button className="shadow-lg shadow-orange-500/20 font-bold px-6 flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4" /> Yeni Malzeme Ekle
          </Button>
        </div>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MALZEME ADI</TableHead>
                <TableHead>MEVCUT STOK</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell className="font-semibold text-slate-700">Koli Bandı 45x100</TableCell>
                <TableCell className="text-emerald-600 font-black tracking-tight">120 Adet</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="font-semibold text-orange-600 border-orange-200 hover:bg-orange-50 gap-1.5 px-3">
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
