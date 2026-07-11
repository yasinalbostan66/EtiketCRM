import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function AnalizPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analiz ve Raporlama</h1>
          <p className="text-sm text-gray-500 mt-1">Üretim, satış ve personel verimlilik raporları.</p>
        </div>
        <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Bu Ay</option>
          <option>Geçen Ay</option>
          <option>Bu Yıl</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Aylık Satış Grafiği</h3>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-gray-100">
            <p className="text-gray-400">Grafik kütüphanesi (Recharts/Chart.js) eklenecek</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Ürün Bazlı Üretim Dağılımı</h3>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-t border-gray-100">
            <p className="text-gray-400">Pasta grafik kütüphanesi eklenecek</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
