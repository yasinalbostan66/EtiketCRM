import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

// Mock Data
const siparisler = [
  { id: "SP-1001", firma: "Örnek Matbaacılık", urun: "Kuşe Kağıt 90gr", tutar: "₺12.500", durum: "Hazırlanıyor", tarih: "12 Tem 2026" },
  { id: "SP-1002", firma: "Yıldız Etiket", urun: "Mavi Mürekkep 5kg", tutar: "₺3.200", durum: "Onay Bekliyor", tarih: "11 Tem 2026" },
  { id: "SP-1003", firma: "Kardeşler Kutu", urun: "Klişe Seti", tutar: "₺8.400", durum: "Sevk Edildi", tarih: "10 Tem 2026" },
];

export default function SiparislerPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-sm text-gray-500 mt-1">Müşteri siparişlerini ve durumlarını takip edin.</p>
        </div>
        <Link href="/siparisler/yeni">
          <Button>+ Yeni Sipariş Oluştur</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sipariş No</TableHead>
                <TableHead>Firma</TableHead>
                <TableHead>Ürün / Hizmet</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Tutar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {siparisler.map((siparis) => (
                <TableRow key={siparis.id}>
                  <TableCell className="font-medium text-gray-900">{siparis.id}</TableCell>
                  <TableCell>{siparis.firma}</TableCell>
                  <TableCell>{siparis.urun}</TableCell>
                  <TableCell>{siparis.tarih}</TableCell>
                  <TableCell className="font-medium">{siparis.tutar}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${siparis.durum === 'Sevk Edildi' ? 'bg-green-100 text-green-800' : 
                        siparis.durum === 'Onay Bekliyor' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {siparis.durum}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Detay</Button>
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
