import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function MurekkepStokPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mürekkep ve Yaldız Stokları</h1>
          <p className="text-sm text-gray-500 mt-1">Baskı mürekkepleri, UV lak ve yaldız stoklarını yönetin.</p>
        </div>
        <Button>+ Yeni Mürekkep Ekle</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün Kodu</TableHead>
                <TableHead>Renk / Tür</TableHead>
                <TableHead>Mevcut Stok</TableHead>
                <TableHead className="text-right">Aksiyon</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">Kayıt bulunamadı.</TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
