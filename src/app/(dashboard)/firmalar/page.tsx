"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Building2, Search, Plus, ExternalLink } from "lucide-react";

// Mock Data
const firmalar = [
  { id: 1, ad: "Örnek Matbaacılık", yetkili: "Ahmet Yılmaz", telefon: "0532 111 22 33", bakiye: "₺15.000" },
  { id: 2, ad: "Yıldız Etiket", yetkili: "Ayşe Demir", telefon: "0533 222 33 44", bakiye: "₺4.500" },
  { id: 3, ad: "Kardeşler Kutu", yetkili: "Mehmet Kaya", telefon: "0535 333 44 55", bakiye: "₺0" },
];

export default function FirmalarPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Firmalar
          </h1>
          <p className="text-sm text-slate-500 mt-1">Müşteri ve tedarikçi firmalarınızı yönetin.</p>
        </div>
        <Button className="shadow-lg shadow-blue-500/20 font-bold px-6 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yeni Firma Ekle
        </Button>
      </div>

      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Firma Listesi</h2>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Firma veya Yetkili Ara..." 
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
                <TableHead>FİRMA ADI</TableHead>
                <TableHead>YETKİLİ</TableHead>
                <TableHead>TELEFON</TableHead>
                <TableHead>BAKİYE</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {firmalar.map((firma) => (
                <TableRow key={firma.id}>
                  <TableCell className="font-bold text-slate-800">{firma.ad}</TableCell>
                  <TableCell className="text-slate-600">{firma.yetkili}</TableCell>
                  <TableCell className="text-slate-600">{firma.telefon}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${firma.bakiye === '₺0' ? 'text-slate-400' : 'text-emerald-500'}`}>
                      {firma.bakiye}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/firmalar/${firma.id}`}>
                      <Button variant="outline" size="sm" className="font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 gap-1.5 px-3">
                        <ExternalLink className="w-3.5 h-3.5" /> Detay Görüntüle
                      </Button>
                    </Link>
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
