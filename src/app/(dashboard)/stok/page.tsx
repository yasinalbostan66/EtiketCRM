import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";

export default function StokTakibiPage() {
  const stokKategorileri = [
    { baslik: "Kağıt Stokları", link: "/stok/kagit", adet: 45, icon: "📄" },
    { baslik: "Klişe Stokları", link: "/stok/klise", adet: 120, icon: "🖨️" },
    { baslik: "Mürekkep Stokları", link: "/stok/murekkep", adet: 32, icon: "💧" },
    { baslik: "Sarf Malzemeler", link: "/stok/sarf-malzeme", adet: 85, icon: "📦" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stok Takibi</h1>
          <p className="text-sm text-gray-500 mt-1">Depodaki tüm malzemelerin güncel durumunu yönetin.</p>
        </div>
        <Link href="/stok/fiyatlar">
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            Malzeme Fiyat Listesi
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stokKategorileri.map((kat, index) => (
          <Link key={index} href={kat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-transparent hover:border-blue-100">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-3xl">
                  {kat.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{kat.baslik}</h3>
                  <p className="text-sm text-gray-500 mt-1">{kat.adet} Çeşit Ürün</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Kritik Stok Uyarıları */}
      <Card className="border-red-100">
        <div className="px-6 py-4 border-b border-red-50 bg-red-50 flex justify-between items-center">
          <h3 className="font-semibold text-red-800 flex items-center gap-2">
            <span>⚠️</span> Kritik Seviyedeki Stoklar
          </h3>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            <div className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Kuşe Etiket Kağıdı (Bobin)</p>
                <p className="text-xs text-gray-500">Minimum: 50 Bobin</p>
              </div>
              <div className="text-red-600 font-bold">12 Bobin Kaldı</div>
            </div>
            <div className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Siyah Mürekkep (UV)</p>
                <p className="text-xs text-gray-500">Minimum: 10 Kutu</p>
              </div>
              <div className="text-red-600 font-bold">3 Kutu Kaldı</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
