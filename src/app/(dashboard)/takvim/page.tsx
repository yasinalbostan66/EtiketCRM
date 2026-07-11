import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TakvimPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Takvim</h1>
          <p className="text-sm text-gray-500 mt-1">Randevu, teslimat ve iş planınızı takip edin.</p>
        </div>
        <Button>+ Yeni Etkinlik</Button>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Takvim Görünümü</h3>
            <p className="text-gray-500">Takvim bileşeni entegrasyonu tamamlandığında burada aylık görünüm yer alacaktır.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
