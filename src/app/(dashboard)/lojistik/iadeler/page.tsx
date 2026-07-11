import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function IadelerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İade Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">Müşterilerden dönen iadeleri ve fire süreçlerini takip edin.</p>
        </div>
        <Button variant="danger">+ İade Talebi Gir</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İade Kodu</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>Ürün</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Şu anda açık bir iade talebi bulunmuyor.
                </TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
