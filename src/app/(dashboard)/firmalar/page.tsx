import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

// Mock Data
const firmalar = [
  { id: 1, ad: "Örnek Matbaacılık", yetkili: "Ahmet Yılmaz", telefon: "0532 111 22 33", bakiye: "₺15.000" },
  { id: 2, ad: "Yıldız Etiket", yetkili: "Ayşe Demir", telefon: "0533 222 33 44", bakiye: "₺4.500" },
  { id: 3, ad: "Kardeşler Kutu", yetkili: "Mehmet Kaya", telefon: "0535 333 44 55", bakiye: "₺0" },
];

export default function FirmalarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Firmalar</h1>
          <p className="text-sm text-gray-500 mt-1">Müşteri ve tedarikçi firmalarınızı yönetin.</p>
        </div>
        <Button>+ Yeni Firma Ekle</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Firma Adı</TableHead>
                <TableHead>Yetkili</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Bakiye</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {firmalar.map((firma) => (
                <TableRow key={firma.id}>
                  <TableCell className="font-medium text-gray-900">{firma.ad}</TableCell>
                  <TableCell>{firma.yetkili}</TableCell>
                  <TableCell>{firma.telefon}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${firma.bakiye === '₺0' ? 'text-gray-500' : 'text-blue-600'}`}>
                      {firma.bakiye}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/firmalar/${firma.id}`}>
                      <Button variant="outline" size="sm">
                        Detay Görüntüle
                      </Button>
                    </Link>
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
