"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { 
  ShoppingCart, 
  Droplets, 
  Scroll, 
  Package, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Calculator, 
  Check 
} from "lucide-react";

export default function YeniSiparisPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFirm, setSelectedFirm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleNext = () => {
    if (!selectedFirm || !selectedType) {
      alert("Lütfen firma ve sipariş türü seçin.");
      return;
    }
    setStep(2);
  };

  const firmName = selectedFirm === "1" ? "Örnek Matbaacılık" : selectedFirm === "2" ? "Yıldız Etiket" : selectedFirm === "3" ? "Siz Etiket" : "Firma Adı";

  return (
    <div className="w-full flex justify-center py-6">
      {step === 1 && (
        <Card className="w-full max-w-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" strokeWidth={2.5} /> Sipariş Giriş Sihirbazı
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Sipariş oluşturmak istediğiniz firmayı seçin ve ardından sipariş kaleminin türünü seçerek devam edin.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Müşteri / Firma Seçin *</label>
              <select 
                value={selectedFirm}
                onChange={(e) => setSelectedFirm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">Lütfen firma seçin...</option>
                <option value="1">Örnek Matbaacılık</option>
                <option value="2">Yıldız Etiket</option>
                <option value="3">Siz Etiket</option>
              </select>
            </div>

            <div className="space-y-3 pt-4">
              <label className="text-sm font-bold text-slate-800">Sipariş Türü Seçin *</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mürekkep */}
                <div 
                  onClick={() => setSelectedType("murekkep")}
                  className={`cursor-pointer rounded-2xl p-6 border-2 flex flex-col items-center text-center transition-all duration-200 ${
                    selectedType === "murekkep" 
                      ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10" 
                      : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Droplets className={`w-10 h-10 mb-4 ${selectedType === "murekkep" ? "text-blue-500" : "text-blue-400"}`} strokeWidth={2} />
                  <h3 className="font-bold text-slate-800 mb-2">Mürekkep</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Mürekkep sarfiyat hesabı ve siparişi</p>
                </div>
                {/* Kağıt / Bobin */}
                <div 
                  onClick={() => setSelectedType("kagit")}
                  className={`cursor-pointer rounded-2xl p-6 border-2 flex flex-col items-center text-center transition-all duration-200 ${
                    selectedType === "kagit" 
                      ? "border-orange-500 bg-orange-50/50 shadow-md shadow-orange-500/10" 
                      : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Scroll className={`w-10 h-10 mb-4 ${selectedType === "kagit" ? "text-orange-500" : "text-orange-400"}`} strokeWidth={2} />
                  <h3 className="font-bold text-slate-800 mb-2">Kağıt / Bobin</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Metraj/Rulo kağıt hesabı ve siparişi</p>
                </div>
                {/* Sarf Malzeme */}
                <div 
                  onClick={() => setSelectedType("sarf")}
                  className={`cursor-pointer rounded-2xl p-6 border-2 flex flex-col items-center text-center transition-all duration-200 ${
                    selectedType === "sarf" 
                      ? "border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-500/10" 
                      : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Package className={`w-10 h-10 mb-4 ${selectedType === "sarf" ? "text-emerald-500" : "text-emerald-400"}`} strokeWidth={2} />
                  <h3 className="font-bold text-slate-800 mb-2">Sarf Malzeme</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Klişe, bıçak veya sarf malzeme girişi</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleNext} 
                className="w-full py-4 text-base font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                disabled={!selectedFirm || !selectedType}
              >
                Devam Et <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && selectedType === "murekkep" && (
        <MurekkepForm firmName={firmName} onBack={() => setStep(1)} />
      )}
      
      {step === 2 && selectedType === "kagit" && (
        <KagitForm firmName={firmName} onBack={() => setStep(1)} />
      )}

      {step === 2 && selectedType === "sarf" && (
        <SarfForm firmName={firmName} onBack={() => setStep(1)} />
      )}
    </div>
  );
}

// Mürekkep Form Bileşeni
function MurekkepForm({ firmName, onBack }: { firmName: string, onBack: () => void }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm focus:outline-none">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Droplets className="w-7 h-7 text-blue-500" strokeWidth={2.5} /> Mürekkep Stok & Maliyet <span className="text-slate-400 font-medium text-lg">({firmName})</span>
          </h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-semibold text-slate-600 flex items-center gap-3">
          <span>TCMB Kurları:</span>
          <span className="text-slate-800">USD: 46.9800 ₺</span>
          <span className="text-slate-800">EUR: 53.6301 ₺</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon - Veri Girişi */}
        <Card className="lg:col-span-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="p-8">
            <h3 className="font-bold text-slate-800 mb-6">Veri Girişi</h3>
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Renk / Mürekkep Türü</label>
                <div className="flex gap-2">
                  <select className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer">
                    <option value="">Lütfen Veritabanından Seçiniz...</option>
                    <option value="cyan">Cyan Mürekkep</option>
                    <option value="magenta">Magenta Mürekkep</option>
                  </select>
                  <Button className="shrink-0 px-6">+ Ekle</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Miktar (kg)</label>
                <input type="text" placeholder="Örn: 5" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Lock className="w-4 h-4" /> Birim Fiyat (Otomatik)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="0.00" className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                  <select className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer">
                    <option>$ USD</option>
                    <option>€ EUR</option>
                    <option>₺ TRY</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Ödeme Şekli</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer">
                  <option value="nakit">Nakit</option>
                  <option value="vadeli">Vadeli</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kur (Opsiyonel - TL bazlı görmek için)</label>
                <input type="text" defaultValue="46,9800" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full py-6 font-bold bg-slate-50 border-slate-200 text-slate-700 flex gap-2 justify-center items-center hover:bg-slate-100">
                  <Calculator className="w-5 h-5" /> Maliyeti Görüntüle
                </Button>
              </div>

            </div>
          </div>
        </Card>

        {/* Sağ Kolon - Hesaplama Özeti */}
        <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-blue-100 bg-blue-50/10 flex flex-col h-full">
          <div className="p-8 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-8">Hesaplama Özeti</h3>
            
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Mürekkep Türü:</span>
                <span className="text-sm font-bold text-slate-800">-</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Miktar:</span>
                <span className="text-sm font-bold text-slate-800">- kg</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Birim Fiyat:</span>
                <span className="text-sm font-bold text-slate-800">-$</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-slate-800">Toplam:</span>
                <span className="text-2xl font-black text-emerald-500">$0.00</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <Button className="w-full py-4 font-bold shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Firmaya Sipariş Olarak Kaydet
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Kağıt Form Bileşeni
function KagitForm({ firmName, onBack }: { firmName: string, onBack: () => void }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-orange-600 transition-all shadow-sm focus:outline-none">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Scroll className="w-7 h-7 text-orange-500" strokeWidth={2.5} /> Kağıt / Bobin Stok & Maliyet <span className="text-slate-400 font-medium text-lg">({firmName})</span>
          </h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-semibold text-slate-600 flex items-center gap-3">
          <span>TCMB Kurları:</span>
          <span className="text-slate-800">USD: 46.9800 ₺</span>
          <span className="text-slate-800">EUR: 53.6301 ₺</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="p-8">
            <h3 className="font-bold text-slate-800 mb-6">Veri Girişi</h3>
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kağıt Türü</label>
                <div className="flex gap-2">
                  <select className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all cursor-pointer">
                    <option value="">Lütfen Veritabanından Seçiniz...</option>
                    <option value="kuse">Kuşe</option>
                    <option value="termal">Termal</option>
                  </select>
                  <Button className="shrink-0 px-6 bg-orange-500 hover:bg-orange-600">+ Ekle</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Miktar (m² / Rulo)</label>
                <input type="text" placeholder="Örn: 2000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Lock className="w-4 h-4" /> Birim Fiyat (Otomatik)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="0.00" className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" />
                  <select className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all cursor-pointer">
                    <option>$ USD</option>
                    <option>€ EUR</option>
                    <option>₺ TRY</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Ödeme Şekli</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all cursor-pointer">
                  <option value="nakit">Nakit</option>
                  <option value="vadeli">Vadeli</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kur (Opsiyonel)</label>
                <input type="text" defaultValue="46,9800" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" />
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full py-6 font-bold bg-slate-50 border-slate-200 text-slate-700 flex gap-2 justify-center items-center hover:bg-slate-100 hover:text-orange-600 hover:border-orange-200">
                  <Calculator className="w-5 h-5" /> Maliyeti Görüntüle
                </Button>
              </div>

            </div>
          </div>
        </Card>

        <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-orange-100 bg-orange-50/10 flex flex-col h-full">
          <div className="p-8 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-8">Hesaplama Özeti</h3>
            
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Kağıt Türü:</span>
                <span className="text-sm font-bold text-slate-800">-</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Miktar:</span>
                <span className="text-sm font-bold text-slate-800">-</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Birim Fiyat:</span>
                <span className="text-sm font-bold text-slate-800">-$</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-slate-800">Toplam:</span>
                <span className="text-2xl font-black text-orange-500">$0.00</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <Button className="w-full py-4 font-bold shadow-lg shadow-orange-500/20 text-sm flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600">
                <Check className="w-5 h-5" /> Firmaya Sipariş Olarak Kaydet
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Sarf Malzeme Form Bileşeni
function SarfForm({ firmName, onBack }: { firmName: string, onBack: () => void }) {
  return (
    <div className="w-full max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-emerald-600 transition-all shadow-sm focus:outline-none">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-7 h-7 text-emerald-500" strokeWidth={2.5} /> Sarf Malzeme Girişi <span className="text-slate-400 font-medium text-lg">({firmName})</span>
          </h1>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-semibold text-slate-600 flex items-center gap-3">
          <span>TCMB Kurları:</span>
          <span className="text-slate-800">USD: 46.9800 ₺</span>
          <span className="text-slate-800">EUR: 53.6301 ₺</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="p-8">
            <h3 className="font-bold text-slate-800 mb-6">Veri Girişi</h3>
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Sarf Malzeme Türü</label>
                <div className="flex gap-2">
                  <select className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer">
                    <option value="">Lütfen Veritabanından Seçiniz...</option>
                    <option value="klise">Klişe</option>
                    <option value="bicak">Bıçak</option>
                    <option value="bant">Çift Taraflı Bant</option>
                  </select>
                  <Button className="shrink-0 px-6 bg-emerald-500 hover:bg-emerald-600">+ Ekle</Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Miktar (Adet / Top)</label>
                <input type="text" placeholder="Örn: 2" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Lock className="w-4 h-4" /> Birim Fiyat (Otomatik)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="0.00" className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
                  <select className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer">
                    <option>$ USD</option>
                    <option>€ EUR</option>
                    <option>₺ TRY</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Ödeme Şekli</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer">
                  <option value="nakit">Nakit</option>
                  <option value="vadeli">Vadeli</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Kur (Opsiyonel)</label>
                <input type="text" defaultValue="46,9800" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full py-6 font-bold bg-slate-50 border-slate-200 text-slate-700 flex gap-2 justify-center items-center hover:bg-slate-100 hover:text-emerald-600 hover:border-emerald-200">
                  <Calculator className="w-5 h-5" /> Maliyeti Görüntüle
                </Button>
              </div>

            </div>
          </div>
        </Card>

        <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-emerald-100 bg-emerald-50/10 flex flex-col h-full">
          <div className="p-8 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-8">Hesaplama Özeti</h3>
            
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Malzeme Türü:</span>
                <span className="text-sm font-bold text-slate-800">-</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Miktar:</span>
                <span className="text-sm font-bold text-slate-800">-</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm font-medium text-slate-500">Birim Fiyat:</span>
                <span className="text-sm font-bold text-slate-800">-$</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-slate-800">Toplam:</span>
                <span className="text-2xl font-black text-emerald-500">$0.00</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <Button className="w-full py-4 font-bold shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600">
                <Check className="w-5 h-5" /> Firmaya Sipariş Olarak Kaydet
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
