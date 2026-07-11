"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { 
  User, 
  Bell, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Smartphone, 
  Lock, 
  Key, 
  Clock, 
  Monitor, 
  Moon, 
  Sun
} from "lucide-react";

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState("kisisel");

  const tabs = [
    { id: "kisisel", label: "Kişisel Bilgiler", icon: <User className="w-4 h-4" /> },
    { id: "bildirim", label: "Bildirim Ayarları", icon: <Bell className="w-4 h-4" /> },
    { id: "guvenlik", label: "Güvenlik", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="p-8 w-full max-w-6xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Profilim</h1>
            <p className="text-slate-500 font-medium mt-1">Kişisel bilgilerinizi ve tercihlerinizi yönetin.</p>
          </div>
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
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
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
          {activeTab === "kisisel" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-lg flex items-center justify-center text-blue-600 text-3xl font-black">
                      YA
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Yasin Albostan</h3>
                      <p className="text-slate-500 font-medium">Sistem Yöneticisi</p>
                      <div className="mt-3 flex gap-3">
                        <Button variant="outline" size="sm">Fotoğrafı Değiştir</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Kaldır</Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Ad Soyad" defaultValue="Yasin Albostan" icon={<User className="w-4 h-4" />} />
                    <Input label="E-posta Adresi" type="email" defaultValue="yasin@etiketcrm.com" icon={<Mail className="w-4 h-4" />} />
                    <Input label="Telefon Numarası" type="tel" defaultValue="+90 555 123 4567" icon={<Phone className="w-4 h-4" />} />
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Kısa Biyografi / Ünvan</label>
                      <input 
                        type="text" 
                        defaultValue="Sistem Yöneticisi & Geliştirici" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button>Bilgileri Kaydet</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "bildirim" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 space-y-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Bildirim Tercihleri</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">Sistem İçi Bildirimler</p>
                          <p className="text-sm font-medium text-slate-500">Uygulama açıkken sağ üstte bildirim alın.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">E-posta Bildirimleri</p>
                          <p className="text-sm font-medium text-slate-500">Önemli gelişmeler e-posta adresinize gönderilsin.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">SMS Bildirimleri</p>
                          <p className="text-sm font-medium text-slate-500">Acil durumlarda telefonunuza SMS gönderilsin.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "guvenlik" && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 space-y-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Şifre Değiştir</h3>
                  <div className="grid grid-cols-1 gap-6 max-w-md">
                    <Input label="Mevcut Şifre" type="password" icon={<Lock className="w-4 h-4" />} />
                    <Input label="Yeni Şifre" type="password" icon={<Key className="w-4 h-4" />} />
                    <Input label="Yeni Şifre (Tekrar)" type="password" icon={<Key className="w-4 h-4" />} />
                    <Button>Şifreyi Güncelle</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">İki Adımlı Doğrulama (2FA)</h3>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">2FA Etkinleştir</Button>
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    Hesabınızın güvenliğini artırmak için Google Authenticator gibi bir uygulama ile iki adımlı doğrulamayı kullanın. Şu anda <span className="font-bold text-rose-500">kapalı</span> durumda.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-lg font-bold text-slate-800">Aktif Oturumlar & Aktiviteler</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-blue-50/50">
                      <div className="flex items-center gap-4">
                        <Monitor className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-800">MacBook Pro - Chrome</p>
                          <p className="text-sm font-medium text-slate-500">İstanbul, Türkiye • Şu an aktif</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">Bu Cihaz</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-4">
                        <Smartphone className="w-8 h-8 text-slate-400" />
                        <div>
                          <p className="font-bold text-slate-800">iPhone 14 Pro - Safari</p>
                          <p className="text-sm font-medium text-slate-500">İstanbul, Türkiye • Son giriş: Dün, 14:30</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-rose-500 border-rose-200 hover:bg-rose-50">Oturumu Kapat</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
