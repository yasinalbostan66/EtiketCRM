import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function ZiyaretlerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Müşteri Ziyaretleri</h1>
          <p className="text-sm text-gray-500 mt-1">Saha satış, toplantı ve ziyaret kayıtlarını yönetin.</p>
        </div>
        <Button>+ Ziyaret Kaydı Ekle</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>İlgili Kişi</TableHead>
                <TableHead>Ziyaret Notu</TableHead>
                <TableHead className="text-right">Aksiyon</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">Kayıtlı ziyaret bulunmuyor.</TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
