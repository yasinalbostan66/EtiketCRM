"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Table, TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { 
  Building2, 
  Users, 
  Settings2, 
  DatabaseBackup, 
  Plug, 
  CreditCard,
  Upload,
  CheckCircle2,
  AlertCircle,
  Download,
  Cloud,
  Moon,
  Sun
} from "lucide-react";

export default function AyarlarPage() {
  const [activeTab, setActiveTab] = useState("sirket");

  const tabs = [
    { id: "sirket", label: "Şirket Profili", icon: <Building2 className="w-4 h-4" /> },
    { id: "kullanici", label: "Kullanıcılar ve Roller", icon: <Users className="w-4 h-4" /> },
    { id: "tercihler", label: "Tercihler", icon: <Settings2 className="w-4 h-4" /> },
    { id: "yedekleme", label: "Yedekleme ve Loglar", icon: <DatabaseBackup className="w-4 h-4" /> },
    { id: "entegrasyon", label: "Entegrasyonlar", icon: <Plug className="w-4 h-4" /> },
    { id: "fatura", label: "Fatura ve Abonelik", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="p-8 w-full max-w-6xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sistem Ayarları</h1>
          <p className="text-slate-500 font-medium mt-1">Uygulamanın genel işleyişini, şirket ve sistem yapılandırmalarını yönetin.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sol Menü */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? "bg-slate-800 text-white shadow-md" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* İçerik */}
        <div className="flex-1">
          
          {/* 1. Şirket Profili */}
          {activeTab === "sirket" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 space-y-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Varsayılan Fatura & Onay Bilgileri</h3>
                  
                  <div className="flex items-start gap-8">
                    <div className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mb-2" />
                      <span className="text-xs font-bold text-center">Şirket Logo<br/>Yükle</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Firma Adınız (Resmi)" defaultValue="Siz Etiket Matbaacılık A.Ş." />
                        <Input label="Kısa Ad / Marka" defaultValue="EtiketCRM" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Açık Adres</label>
                        <textarea 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                          defaultValue="Maltepe Mah. Matbaacılar Sitesi No: 42, Zeytinburnu, İstanbul"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input label="Vergi Dairesi" defaultValue="Zeytinburnu V.D." />
                        <Input label="Vergi No" defaultValue="1234567890" />
                        <Input label="Şirket Telefonu" type="tel" defaultValue="+90 212 555 1234" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button>Ayarları Kaydet</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 2. Kullanıcılar ve Roller */}
          {activeTab === "kullanici" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-0">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Personeller ve İzinler</h3>
                      <p className="text-sm font-medium text-slate-500">Sisteme erişimi olan kullanıcıları ve yetkilerini yönetin.</p>
                    </div>
                    <Button className="bg-slate-800 hover:bg-slate-900">+ Yeni Kullanıcı Davet Et</Button>
                  </div>
                  <Table>
                    <thead>
                      <TableRow className="bg-slate-50/50">
                        <TableHead>KULLANICI</TableHead>
                        <TableHead>ROL (YETKİ)</TableHead>
                        <TableHead>DURUM</TableHead>
                        <TableHead>SON GİRİŞ</TableHead>
                        <TableHead className="text-right">İŞLEMLER</TableHead>
                      </TableRow>
                    </thead>
                    <tbody>
                      {[
                        { name: "Yasin Albostan", role: "Sistem Yöneticisi", status: "Aktif", lastLogin: "Şimdi" },
                        { name: "Ahmet Yılmaz", role: "Üretim Sorumlusu", status: "Aktif", lastLogin: "2 saat önce" },
                        { name: "Ayşe Demir", role: "Muhasebe", status: "Bekliyor", lastLogin: "-" },
                      ].map((u, i) => (
                         <TableRow key={i}>
                           <TableCell className="font-bold text-slate-800">{u.name}</TableCell>
                           <TableCell className="text-slate-600 font-medium">{u.role}</TableCell>
                           <TableCell>
                             <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                               u.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                             }`}>
                               {u.status}
                             </span>
                           </TableCell>
                           <TableCell className="text-slate-500 text-sm">{u.lastLogin}</TableCell>
                           <TableCell className="text-right">
                             <Button variant="outline" size="sm">Düzenle</Button>
                           </TableCell>
                         </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 3. Tercihler & Para Birimi */}
          {activeTab === "tercihler" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 space-y-8">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Sistem Tercihleri</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sistem Geneli Tema</label>
                        <div className="flex items-center gap-3 p-1 bg-slate-100 rounded-xl w-fit">
                          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-slate-800">
                            <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                            <Moon className="w-4 h-4" /> Dark Mode
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Ana Para Birimi</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                          <option value="TRY">Türk Lirası (₺)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Tarih Formatı</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                          <option>GG/AA/YYYY (Örn: 14/05/2026)</option>
                          <option>GG.AA.YYYY (Örn: 14.05.2026)</option>
                          <option>AA/GG/YYYY (Örn: 05/14/2026)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sistem Dili</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                          <option>Türkçe</option>
                          <option>English</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button>Tercihleri Kaydet</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 4. Yedekleme ve Loglar */}
          {activeTab === "yedekleme" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Özel Bulut Sunucusu (Self-Host Firebase)</h3>
                      <p className="text-sm font-medium text-slate-500">Uygulamanın verilerini tamamen kendinize ait bir projede depolayın.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Firebase Web App JSON</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-[150px]"
                      placeholder="&#123;&#10;  &quot;apiKey&quot;: &quot;...&quot;,&#10;  &quot;authDomain&quot;: &quot;...&quot;,&#10;  &quot;projectId&quot;: &quot;...&quot;&#10;&#125;"
                    ></textarea>
                    <p className="text-xs text-slate-400 font-medium">Lütfen Firebase Console'dan aldığınız yapılandırma dosyasını eksiksiz yapıştırın.</p>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">Bağlantıyı Sına & Kaydet</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Veri Senkronizasyonu & Yedekleme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:border-blue-500 transition-colors cursor-pointer group">
                      <DatabaseBackup className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-bold text-slate-800">Google Drive Senkronizasyonu</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Veritabanını günlük olarak Drive'a yedekle.</p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 w-full">Google Hesabını Bağla</Button>
                    </div>

                    <div className="p-6 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:border-blue-500 transition-colors cursor-pointer group">
                      <Download className="w-8 h-8 text-slate-500 group-hover:text-blue-500 group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-bold text-slate-800">Manuel İndirme</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Sistemi JSON formatında yerel diskinize indirin.</p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-2 w-full">Hemen İndir (.json)</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Diğer 2 Sekme (Placeholder for brevity) */}
          {(activeTab === "entegrasyon" || activeTab === "fatura") && (
            <Card>
              <CardContent className="p-12 text-center text-slate-500">
                <Plug className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Bu modül yapım aşamasındadır.</h3>
                <p className="font-medium">Entegrasyonlar ve fatura detayları için altyapı hazırlanıyor.</p>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
