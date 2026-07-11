import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { BarChart3, PieChart } from "lucide-react";

export default function AnalizPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" /> Analiz ve Raporlar
          </h1>
          <p className="text-sm text-slate-500 mt-1">Üretim, satış ve personel verimlilik raporları.</p>
        </div>
        <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer">
          <option>Bu Ay</option>
          <option>Geçen Ay</option>
          <option>Bu Yıl</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-400" /> Aylık Satış Grafiği
            </h3>
          </div>
          <CardContent className="p-6">
            <div className="h-64 flex items-end justify-between gap-2">
              {/* CSS Bar Chart */}
              {[40, 70, 45, 90, 65, 55, 80, 100, 75, 60, 85, 50].map((h, i) => (
                <div key={i} className="w-full bg-slate-100 rounded-t-sm relative group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-600"
                    style={{ height: `${h}%` }}
                  ></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-opacity z-10 whitespace-nowrap">
                    ${h},000
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-[11px] font-bold text-slate-400 uppercase">
              <span>Oca</span>
              <span>Şub</span>
              <span>Mar</span>
              <span>Nis</span>
              <span>May</span>
              <span>Haz</span>
              <span>Tem</span>
              <span>Ağu</span>
              <span>Eyl</span>
              <span>Eki</span>
              <span>Kas</span>
              <span>Ara</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-400" /> Ürün Bazlı Üretim Dağılımı
            </h3>
          </div>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-full relative shadow-inner mb-6" style={{
              background: 'conic-gradient(#3b82f6 0% 45%, #f97316 45% 75%, #10b981 75% 90%, #8b5cf6 90% 100%)'
            }}>
              {/* Inner circle for donut chart look */}
              <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-2xl font-black text-slate-800">12K</span>
                <span className="text-[10px] font-bold text-slate-400">Üretim</span>
              </div>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-semibold text-slate-700">Kağıt (%45)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm font-semibold text-slate-700">Mürekkep (%30)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-semibold text-slate-700">Klişe (%15)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-semibold text-slate-700">Diğer (%10)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
