import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function FiyatlarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Malzeme Fiyat Listesi</h1>
          <p className="text-sm text-gray-500 mt-1">Tedarikçilerden alınan güncel fiyatlar ve kurlar.</p>
        </div>
        <Button>+ Fiyat Güncelle</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Malzeme Cinsi</TableHead>
                <TableHead>Birim Fiyatı</TableHead>
                <TableHead>Tedarikçi</TableHead>
                <TableHead>Son Güncelleme</TableHead>
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
