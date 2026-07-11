import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DuyurularPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İç İletişim ve Duyurular</h1>
          <p className="text-sm text-gray-500 mt-1">Şirket içi panoya duyuru ekleyin veya okuyun.</p>
        </div>
        <Button>+ Yeni Duyuru Ekle</Button>
      </div>

      <div className="space-y-4 max-w-4xl">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Sistem Güncellemesi Hakkında</h3>
                <p className="text-sm text-gray-500 mt-1">Gönderen: Yönetim - 12 Temmuz 2026, 09:00</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">Genel</span>
            </div>
            <p className="mt-4 text-gray-700">
              Değerli çalışma arkadaşlarımız, CRM sistemimiz bugün itibarıyla yeni Next.js altyapısına geçmiştir. Tüm modüller yeni arayüzle kullanıma hazırdır. Sorularınız için teknik ekiple iletişime geçebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
