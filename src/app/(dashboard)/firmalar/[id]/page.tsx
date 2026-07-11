import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function FirmaDetayPage({ params }: { params: Promise<{ id: string }> }) {
  // Mock Data Fetching - Gerçek uygulamada Supabase'den gelecek
  const { id } = await params;
  const firmaId = id;
  
  return (
    <div className="space-y-6">
      {/* Üst Bar: Geri Dönüş ve Başlık */}
      <div className="flex items-center gap-4">
        <Link href="/firmalar">
          <Button variant="outline" className="text-gray-500 hover:text-gray-700">
            ← Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Firma Detayı</h1>
          <p className="text-sm text-gray-500 mt-1">ID: #{firmaId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon: Firma Bilgileri */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Genel Bilgiler</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">Firma Adı</label>
                <p className="text-sm font-medium text-gray-900 mt-1">Örnek Matbaacılık</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Yetkili Kişi</label>
                <p className="text-sm text-gray-900 mt-1">Ahmet Yılmaz</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">İletişim</label>
                <p className="text-sm text-gray-900 mt-1">0532 111 22 33<br/>info@ornekmatbaa.com</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Vergi Dairesi / No</label>
                <p className="text-sm text-gray-900 mt-1">Marmara V.D. / 1234567890</p>
              </div>
              <Button className="w-full mt-2" variant="outline">Düzenle</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Finansal Özet</h3>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">₺15.000</div>
              <p className="text-sm text-gray-500 mt-1">Güncel Bakiye (Alacaklı)</p>
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" variant="primary" size="sm">Ödeme Al</Button>
                <Button className="flex-1" variant="outline" size="sm">Ekstre</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Kolon: Geçmiş İşlemler & Siparişler */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-gray-900">Son Siparişler</h3>
              <Button variant="outline" size="sm">Yeni Sipariş</Button>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-lg">
                Henüz sipariş kaydı bulunmuyor.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">Son Ödemeler / Tahsilatlar</h3>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-gray-500 border-2 border-dashed border-gray-100 rounded-lg">
                Geçmiş ödeme kaydı bulunmuyor.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
