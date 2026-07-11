import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function KliseStokPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klişe ve Bıçak Stokları</h1>
          <p className="text-sm text-gray-500 mt-1">Üretime ait kalıp, klişe ve özel kesim bıçaklarını yönetin.</p>
        </div>
        <Button>+ Yeni Klişe Ekle</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Raf Kodu</TableHead>
                <TableHead>Firma / Müşteri</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Ebat</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">Aksiyon</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell className="font-medium">R1-B2</TableCell>
                <TableCell>Örnek Matbaacılık</TableCell>
                <TableCell>Oval Kesim Bıçağı</TableCell>
                <TableCell>50x50mm</TableCell>
                <TableCell><span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium">Kullanıma Hazır</span></TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">Detay</Button>
                </TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
