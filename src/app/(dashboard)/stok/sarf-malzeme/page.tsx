import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function SarfMalzemePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sarf Malzemeler</h1>
          <p className="text-sm text-gray-500 mt-1">Koli, bant, streç ve diğer ambalaj malzemeleri.</p>
        </div>
        <Button>+ Yeni Malzeme Ekle</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Malzeme Adı</TableHead>
                <TableHead>Mevcut Stok</TableHead>
                <TableHead className="text-right">Aksiyon</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">Kayıt bulunamadı.</TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
