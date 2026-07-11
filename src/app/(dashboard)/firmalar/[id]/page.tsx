"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Building, 
  FileText,
  Calendar,
  Clock,
  Edit2,
  Plus,
  Trash2,
  Search,
  ShoppingCart,
  Download,
  DollarSign,
  TrendingUp,
  AlertCircle,
  FileCheck
} from "lucide-react";

// Mock Data
const firma = {
  id: 1,
  ad: "Örnek Matbaacılık ve Ambalaj San. Tic. A.Ş.",
  yetkili: "Ahmet Yılmaz",
  telefon: "0532 111 22 33",
  email: "info@ornekmatbaa.com",
  adres: "Atatürk Organize Sanayi Bölgesi 10001 Sk. No:14 Çiğli / İzmir",
  vergiDairesi: "Çiğli V.D.",
  vergiNo: "1234567890",
  kayitTarihi: "12.01.2025"
};

const finansalDurum = {
  guncelBakiye: "₺15.450,00",
  toplamHacim: "₺128.500,00",
  gecikenOdeme: "₺0,00",
  sonOdemeTarihi: "01.07.2026"
};

const siparisGecmisi = [
  { id: 1, tarih: "04.07.2026", siparis: "5x5 Kuşe Etiket", malzeme: "Kuşe Kağıt", miktar: "2160 m²", tutar: "$816.48" },
  { id: 2, tarih: "04.07.2026", siparis: "Cyan Baskı Boyası", malzeme: "Mürekkep", miktar: "25 kg", tutar: "$324.00" },
];

const aktiviteGecmisi = [
  { id: 1, tarih: "04.07.2026", aktivite: "Sipariş", kategori: "Kuşe Kağıt", aciklama: "5x5 Kuşe Etiket Siparişi", tutar: "$816.48" },
  { id: 2, tarih: "05.07.2026", aktivite: "Tahsilat", kategori: "Nakit", aciklama: "Haziran ayı ödemesi", tutar: "₺10.000,00" },
];

const ozelFiyatlar = [
  { id: 1, urun: "Kuşe Etiket (Boş)", birim: "M2", fiyat: "$0.45", gecerlilik: "31.12.2026" },
  { id: 2, urun: "Cyan Mürekkep", birim: "KG", fiyat: "$12.00", gecerlilik: "31.12.2026" },
];

const ziyaretler = [
  { id: 1, tarih: "01.07.2026", tip: "Ziyaret", aciklama: "Yeni sezon fiyat görüşmesi yapıldı." },
  { id: 2, tarih: "20.06.2026", tip: "Telefon", aciklama: "Ödeme hatırlatması yapıldı, haftaya yapılacak." },
];

export default function FirmaDetayPage() {
  const params = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold gap-2">
          <Edit2 className="w-4 h-4" /> Firmayı Düzenle
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-800">{firma.ad}</h1>
        <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
          Müşteri ID: #{params.id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Genel Bilgiler Kartı (Haritalı) */}
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <div className="h-48 bg-slate-100 relative w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d27.0!3d38.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1str!2str!4v1" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>
          </div>
          <CardContent className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-500" /> Genel Bilgiler
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Yetkili Kişi</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400"/>{firma.yetkili}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Kayıt Tarihi</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400"/>{firma.kayitTarihi}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Telefon</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400"/>{firma.telefon}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">E-Posta</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400"/>{firma.email}</p>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Adres</p>
                <p className="text-sm font-semibold text-slate-800 flex items-start gap-1.5"><MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0"/>{firma.adres}</p>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Vergi Dairesi / No</p>
                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><FileText className="w-4 h-4 text-slate-400"/>{firma.vergiDairesi} / {firma.vergiNo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Finansal Durum Kartı */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4">
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <DollarSign className="w-5 h-5 text-emerald-500" /> Finansal Durum
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Güncel Cari Bakiye</p>
                <h3 className="text-3xl font-black text-emerald-700">{finansalDurum.guncelBakiye}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 border-r border-slate-100 pr-4">
                  <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Toplam Hacim</p>
                  <p className="text-lg font-bold text-slate-700">{finansalDurum.toplamHacim}</p>
                </div>
                <div className="space-y-1 pl-4">
                  <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Geciken Ödeme</p>
                  <p className="text-lg font-bold text-slate-700">{finansalDurum.gecikenOdeme}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Son Ödeme Tarihi</p>
                <p className="text-sm font-semibold text-slate-800">{finansalDurum.sonOdemeTarihi}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Hızlı İşlemler (Firmaya Yeni Sipariş) */}
      <Card className="shadow-sm border-blue-100 bg-blue-50/30">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Firmaya Yeni Sipariş Oluştur</h3>
              <p className="text-xs font-medium text-slate-500">Bu firma için hızlıca yeni bir sipariş kaydı açın.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1.5 flex-1 sm:flex-none">
              <Plus className="w-3.5 h-3.5" /> Etiket / Kağıt
            </Button>
            <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100 gap-1.5 flex-1 sm:flex-none">
              <Plus className="w-3.5 h-3.5" /> Mürekkep
            </Button>
            <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100 gap-1.5 flex-1 sm:flex-none">
              <Plus className="w-3.5 h-3.5" /> Klişe / Bıçak
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ALT KARTLAR (SEKME YERİNE ALT ALTA) */}

      {/* Sipariş Geçmişi */}
      <Card className="shadow-sm border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Sipariş Geçmişi</h2>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TARİH</TableHead>
                <TableHead>SİPARİŞ</TableHead>
                <TableHead>MALZEME</TableHead>
                <TableHead>MİKTAR</TableHead>
                <TableHead>TUTAR</TableHead>
                <TableHead className="text-right">İŞLEMLER</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {siparisGecmisi.map((sip) => (
                <TableRow key={sip.id}>
                  <TableCell className="font-medium text-slate-600">{sip.tarih}</TableCell>
                  <TableCell className="font-bold text-slate-800">{sip.siparis}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{sip.malzeme}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{sip.miktar}</TableCell>
                  <TableCell className="font-bold text-slate-800">{sip.tutar}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50 px-2.5" title="Tekil Onay Formu">
                        <FileCheck className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50 px-2.5" title="Toplu Onay Formu">
                        <FileText className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-orange-200 text-orange-500 hover:bg-orange-50 px-2.5" title="Düzenle">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50 px-2.5" title="Sil">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      {/* Aktivite Geçmişi (Genel) */}
      <Card className="shadow-sm border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Aktivite Geçmişi</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Sistemdeki diğer işlemlerden otomatik düşen kayıtlar.</p>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TARİH</TableHead>
                <TableHead>AKTİVİTE</TableHead>
                <TableHead>KATEGORİ</TableHead>
                <TableHead>AÇIKLAMA</TableHead>
                <TableHead>TUTAR</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {aktiviteGecmisi.map((akt) => (
                <TableRow key={akt.id}>
                  <TableCell className="font-medium text-slate-600">{akt.tarih}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase
                      ${akt.aktivite === 'Tahsilat' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {akt.aktivite}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-slate-800">{akt.kategori}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{akt.aciklama}</TableCell>
                  <TableCell className="font-bold text-slate-800">{akt.tutar}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      {/* Firmaya Özel Fiyat Listesi */}
      <Card className="shadow-sm border-slate-200">
        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">Özel Fiyat Listesi</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200">
              <Download className="w-3.5 h-3.5" /> Dışa Aktar
            </Button>
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Yeni Fiyat Ekle
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ÜRÜN / HİZMET</TableHead>
                <TableHead>BİRİM</TableHead>
                <TableHead>ÖZEL FİYAT</TableHead>
                <TableHead>GEÇERLİLİK TARİHİ</TableHead>
                <TableHead className="text-right">İŞLEMLER</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {ozelFiyatlar.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-slate-800">{item.urun}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{item.birim}</TableCell>
                  <TableCell className="font-bold text-emerald-600">{item.fiyat}</TableCell>
                  <TableCell className="text-slate-500 font-medium">{item.gecerlilik}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-orange-200 text-orange-500 hover:bg-orange-50 px-2.5">
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50 px-2.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      {/* Ziyaretler / Görüşmeler */}
      <Card className="shadow-sm border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Ziyaretler ve Görüşmeler</h2>
        </div>
        <CardContent className="p-6">
          <div className="space-y-6">
            {ziyaretler.map(akt => (
              <div key={akt.id} className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 z-10">
                  {akt.tip === 'Ziyaret' ? <MapPin className="w-4 h-4 text-blue-500" /> : <Phone className="w-4 h-4 text-blue-500" />}
                </div>
                {/* Timeline line */}
                <div className="absolute top-10 left-5 bottom-[-24px] w-px bg-slate-200 last:hidden"></div>
                
                <div className="pt-2 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800">{akt.tip}</span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {akt.tarih}</span>
                  </div>
                  <p className="text-sm text-slate-600">{akt.aciklama}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4 mt-6">
               <Button variant="outline" className="font-bold border-dashed text-slate-500 w-full sm:w-auto">
                 + Yeni Ziyaret / Görüşme Ekle
               </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
