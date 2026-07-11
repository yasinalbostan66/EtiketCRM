import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AyarlarPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-sm text-gray-500 mt-1">Uygulama tercihleri ve kullanıcı yönetimi.</p>
        </div>
        <Button>Değişiklikleri Kaydet</Button>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Şirket Profili</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Şirket Adı" defaultValue="EtiketCRM Matbaacılık A.Ş." />
            <Input label="Vergi Dairesi" defaultValue="Marmara V.D." />
            <Input label="Vergi No" defaultValue="1234567890" />
            <Input label="İletişim E-posta" defaultValue="info@etiketcrm.com" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900">Kullanıcı Yönetimi</h3>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Ahmet Yılmaz (Yönetici)</p>
              <p className="text-sm text-gray-500">ahmet@etiketcrm.com</p>
            </div>
            <Button variant="outline" size="sm">Düzenle</Button>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-gray-900">Ayşe Demir (Satış Temsilcisi)</p>
              <p className="text-sm text-gray-500">ayse@etiketcrm.com</p>
            </div>
            <Button variant="outline" size="sm">Düzenle</Button>
          </div>
          <Button variant="outline" className="w-full mt-4">+ Yeni Kullanıcı Ekle</Button>
        </CardContent>
      </Card>
    </div>
  );
}
