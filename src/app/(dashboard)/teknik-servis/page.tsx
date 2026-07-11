import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function TeknikServisPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teknik Servis ve Bakım</h1>
          <p className="text-sm text-gray-500 mt-1">Makine arızaları ve periyodik bakımları takip edin.</p>
        </div>
        <Button variant="danger">+ Arıza / Servis Talebi</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kayıt No</TableHead>
                <TableHead>Makine / Cihaz</TableHead>
                <TableHead>Arıza Detayı</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">Aksiyon</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">Açık servis kaydı bulunmamaktadır.</TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
