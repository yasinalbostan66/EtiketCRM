"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Megaphone, Plus, Bell, Info, AlertTriangle, Clock } from "lucide-react";

export default function DuyurularPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-indigo-500" /> İç İletişim ve Duyurular
          </h1>
          <p className="text-sm text-slate-500 mt-1">Şirket içi panoya duyuru ekleyin veya okuyun.</p>
        </div>
        <Button className="shadow-lg shadow-indigo-500/20 font-bold px-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Yeni Duyuru Ekle
        </Button>
      </div>

      <div className="space-y-4 w-full">
        {/* Acil Duyuru */}
        <Card className="border-l-4 border-l-red-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-r-slate-200 border-t-slate-200 border-b-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Acil: UV Lak Makinesi Bakımı</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mt-1">
                    <span>Gönderen: Teknik Servis</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 15 Temmuz 2026, 08:30</span>
                  </div>
                </div>
              </div>
              <span className="bg-red-50 text-red-600 border border-red-200 text-[11px] px-3 py-1 rounded-md font-bold uppercase tracking-wide shrink-0">
                Acil
              </span>
            </div>
            <p className="mt-4 text-slate-700 font-medium pl-13 sm:pl-13">
              Yarın saat 09:00 ile 12:00 arasında UV Lak makinesinde periyodik bakım yapılacaktır. Bu saatler arasında üretim planlamanızı buna göre yapmanızı önemle rica ederiz.
            </p>
          </CardContent>
        </Card>

        {/* Genel Duyuru */}
        <Card className="border-l-4 border-l-blue-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-r-slate-200 border-t-slate-200 border-b-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Sistem Güncellemesi Hakkında</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mt-1">
                    <span>Gönderen: Yönetim</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 12 Temmuz 2026, 09:00</span>
                  </div>
                </div>
              </div>
              <span className="bg-blue-50 text-blue-600 border border-blue-200 text-[11px] px-3 py-1 rounded-md font-bold uppercase tracking-wide shrink-0">
                Genel
              </span>
            </div>
            <p className="mt-4 text-slate-700 font-medium pl-13 sm:pl-13">
              Değerli çalışma arkadaşlarımız, CRM sistemimiz bugün itibarıyla yeni modern altyapısına geçmiştir. Tüm modüller yeni arayüzle kullanıma hazırdır. Sorularınız için teknik ekiple iletişime geçebilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Bilgi Duyurusu */}
        <Card className="border-l-4 border-l-emerald-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-r-slate-200 border-t-slate-200 border-b-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Yeni Müşteri Anlaşması: ABC Gıda</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mt-1">
                    <span>Gönderen: Satış Departmanı</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 10 Temmuz 2026, 14:15</span>
                  </div>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] px-3 py-1 rounded-md font-bold uppercase tracking-wide shrink-0">
                Bilgi
              </span>
            </div>
            <p className="mt-4 text-slate-700 font-medium pl-13 sm:pl-13">
              Türkiye'nin önde gelen gıda markalarından ABC Gıda ile yıllık 5 milyon adetlik termal etiket sözleşmesi imzalanmıştır. Emeği geçen tüm satış ekibimizi tebrik ederiz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
