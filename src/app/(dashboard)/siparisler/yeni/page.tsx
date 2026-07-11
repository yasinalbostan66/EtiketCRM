"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function YeniSiparisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Kayıt simülasyonu
    setTimeout(() => {
      router.push("/siparisler");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/siparisler">
          <Button variant="outline" className="text-gray-500 hover:text-gray-700">
            ← Geri
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Sipariş Oluştur</h1>
          <p className="text-sm text-gray-500 mt-1">Sipariş detaylarını girin ve onaylayın.</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Sipariş Detayları</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Firma Seçimi</label>
                <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Firma Seçiniz...</option>
                  <option value="1">Örnek Matbaacılık</option>
                  <option value="2">Yıldız Etiket</option>
                </select>
              </div>
              <Input label="Teslimat Tarihi" type="date" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Ürün / Hizmet Kalemleri</label>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center">
                <p className="text-sm text-gray-500 mb-4">Henüz ürün eklenmedi</p>
                <Button type="button" variant="outline" size="sm">+ Kalem Ekle</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Sipariş Notu</label>
                <textarea 
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  placeholder="Üretim veya teslimatla ilgili notlar..."
                ></textarea>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col justify-end space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ara Toplam:</span>
                  <span>₺0,00</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>KDV (%20):</span>
                  <span>₺0,00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2 mt-2">
                  <span>Genel Toplam:</span>
                  <span className="text-blue-600">₺0,00</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Link href="/siparisler">
                <Button type="button" variant="outline">İptal</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Kaydediliyor..." : "Siparişi Onayla ve Kaydet"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
