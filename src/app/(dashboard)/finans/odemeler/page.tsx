import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

const odemeler = [
  { id: "OD-501", firma: "Yıldız Etiket", tutar: "₺3.200", tarih: "12 Tem 2026", tur: "Tahsilat", durum: "Bekliyor" },
  { id: "OD-502", firma: "Kardeşler Kutu", tutar: "₺8.400", tarih: "10 Tem 2026", tur: "Tahsilat", durum: "Tamamlandı" },
  { id: "OD-503", firma: "Mürekkep Tedarik A.Ş.", tutar: "₺12.000", tarih: "08 Tem 2026", tur: "Ödeme", durum: "Tamamlandı" },
];

export default function OdemeTakibiPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ödeme Takibi</h1>
          <p className="text-sm text-gray-500 mt-1">Tahsilat ve ödeme işlemlerini yönetin.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Gider Ekle</Button>
          <Button>Tahsilat Gir</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-green-800">Bekleyen Tahsilatlar</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">₺45.200</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-red-800">Yapılacak Ödemeler</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">₺18.500</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-blue-800">Kasa Bakiyesi</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">₺124.800</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İşlem No</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>İşlem Türü</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">Aksiyon</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {odemeler.map((odeme) => (
                <TableRow key={odeme.id}>
                  <TableCell className="font-medium">{odeme.id}</TableCell>
                  <TableCell>{odeme.firma}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border
                      ${odeme.tur === 'Tahsilat' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                      {odeme.tur === 'Tahsilat' ? '↓ Tahsilat' : '↑ Ödeme'}
                    </span>
                  </TableCell>
                  <TableCell>{odeme.tarih}</TableCell>
                  <TableCell className="font-bold">{odeme.tutar}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${odeme.durum === 'Tamamlandı' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}`}>
                      {odeme.durum}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Makbuz</Button>
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
