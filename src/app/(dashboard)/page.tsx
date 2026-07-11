import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function DashboardPage() {
  const stats = [
    { title: "Toplam Firma", value: "124", icon: "🏢", change: "+12%" },
    { title: "Aktif Sipariş", value: "45", icon: "📦", change: "+5%" },
    { title: "Kritik Stok", value: "8", icon: "⚠️", change: "-2%" },
    { title: "Aylık Ciro", value: "₺284.500", icon: "💰", change: "+18%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alt Bölümler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Siparişler Tablosu (Örnek) */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="font-semibold text-gray-900">Son Eklenen Siparişler</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Tümünü Gör</button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 text-center text-gray-500 text-sm">
              Siparişler modülü tamamlandığında burada liste görünecektir.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
