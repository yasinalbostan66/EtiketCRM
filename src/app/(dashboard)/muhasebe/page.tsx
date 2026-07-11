import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export default function MuhasebePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Genel Muhasebe</h1>
          <p className="text-sm text-gray-500 mt-1">Fatura, irsaliye, çek/senet ve cari hesap takibi.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Yeni Fatura Kes</Button>
          <Button>+ Fatura İşle</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Toplam Alacaklar</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">₺184.500</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Toplam Borçlar</h3>
            <p className="text-2xl font-bold text-red-600 mt-2">₺42.300</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Aylık KDV Durumu</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">₺12.450</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-gray-500">Vadesi Gelen Çekler</h3>
            <p className="text-2xl font-bold text-orange-500 mt-2">3 Adet</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fatura No</TableHead>
                <TableHead>Cari / Firma</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>KDV Durumu</TableHead>
                <TableHead className="text-right">Aksiyon</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">Muhasebe kayıtları henüz girilmedi.</TableCell>
              </TableRow>
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
