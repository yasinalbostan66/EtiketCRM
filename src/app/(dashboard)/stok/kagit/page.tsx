import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function KagitStokPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kağıt Stokları</h1>
          <p className="text-sm text-gray-500 mt-1">Bobin, tabaka kağıt ve folyo stoklarını yönetin.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Stok Sayımı Gir</Button>
          <Button>+ Yeni Kağıt Ekle</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün Kodu</TableHead>
                <TableHead>Kağıt Cinsi</TableHead>
                <TableHead>Ebat / Gramaj</TableHead>
                <TableHead>Mevcut Stok</TableHead>
                <TableHead>Kritik Seviye</TableHead>
                <TableHead className="text-right">Aksiyon</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell className="font-medium">KG-001</TableCell>
                <TableCell>Kuşe Etiket Kağıdı</TableCell>
                <TableCell>90gr / 33cm Bobin</TableCell>
                <TableCell className="text-red-600 font-bold">12 Rulo</TableCell>
                <TableCell>50 Rulo</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Düzenle</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">KG-002</TableCell>
                <TableCell>Termal Karton</TableCell>
                <TableCell>200gr / 100x70 Tabaka</TableCell>
                <TableCell className="text-green-600 font-bold">1200 Tabaka</TableCell>
                <TableCell>500 Tabaka</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Düzenle</Button>
                </TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
