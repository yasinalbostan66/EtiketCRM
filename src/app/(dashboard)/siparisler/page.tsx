"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { 
  ClipboardList, 
  Check, 
  Edit2, 
  Trash2, 
  Search 
} from "lucide-react";

// Mock Data
const initialSiparisler = [
  { id: 1, tarih: "04.07.2026", firma: "Siz Etiket", tur: "Kağıt / Ham Madde", urun: "Kuşe", miktar: "2160 m²", tutar: "$816.48", tlTutar: "₺40.374,709" },
  { id: 2, tarih: "04.07.2026", firma: "Siz Etiket", tur: "Mürekkep", urun: "Cyan Mürekkep", miktar: "25 kg", tutar: "$324.00", tlTutar: "₺16.021,71" },
  { id: 3, tarih: "02.07.2026", firma: "Siz Etiket", tur: "Kağıt / Ham Madde", urun: "Kuşe", miktar: "1500 m²", tutar: "$567.00", tlTutar: "₺27.930,283" },
  { id: 4, tarih: "26.03.2026", firma: "Yaz Etiket", tur: "Kağıt / Ham Madde", urun: "Parlak Kuşe", miktar: "5000 m²", tutar: "$962.28", tlTutar: "₺47.613,50" },
  { id: 5, tarih: "19.03.2026", firma: "Siz Etiket", tur: "Kağıt / Ham Madde", urun: "Termal", miktar: "3300 m²", tutar: "$160,380.00", tlTutar: "₺8.153.414,478" },
  { id: 6, tarih: "18.03.2026", firma: "Tek Etiket", tur: "Mürekkep", urun: "Magenta Mürekkep", miktar: "50 kg", tutar: "$648.00", tlTutar: "₺32.043,42" },
];

export default function SiparislerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const openModal = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(initialSiparisler.map(sip => sip.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" strokeWidth={2.5} /> Alınan Siparişler
          </h2>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Sipariş veya Firma Ara..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === initialSiparisler.length && initialSiparisler.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                </TableHead>
                <TableHead>TARİH</TableHead>
                <TableHead>FİRMA</TableHead>
                <TableHead>İŞLEM TÜRÜ</TableHead>
                <TableHead>SİPARİŞ DETAYI</TableHead>
                <TableHead>MİKTAR</TableHead>
                <TableHead>TUTAR ($)</TableHead>
                <TableHead className="text-right">
                  <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 gap-1.5 font-bold">
                    <Check className="w-4 h-4" /> Toplu Onay
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {initialSiparisler.map((siparis) => (
                <TableRow key={siparis.id}>
                  <TableCell className="text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(siparis.id)}
                      onChange={() => handleSelectRow(siparis.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{siparis.tarih}</TableCell>
                  <TableCell className="font-bold text-slate-800">{siparis.firma}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase
                      ${siparis.tur.includes('Kağıt') ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                      {siparis.tur}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-slate-800">{siparis.urun}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{siparis.miktar}</TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-800">{siparis.tutar}</div>
                    <div className="text-[10px] text-slate-400 font-medium">({siparis.tlTutar})</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 gap-1 px-3">
                        <Check className="w-3.5 h-3.5" /> Tekli Onay
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openModal(siparis)}
                        className="border-orange-200 text-orange-500 hover:bg-orange-50 hover:border-orange-300 px-2.5"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 px-2.5"
                        title="Sil"
                      >
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

      {/* Sipariş Düzenleme Modalı */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-slate-400" />
            <span>Sipariş Detay & Düzenleme</span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button variant="outline" onClick={closeModal}>Kapat</Button>
            <Button>Değişiklikleri Kaydet</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Firma</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer">
              <option>{selectedOrder?.firma || "Siz Etiket"}</option>
              <option>Yaz Etiket</option>
              <option>Tek Etiket</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Sipariş Türü</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer">
              <option>{selectedOrder?.tur || "Kağıt / Ham Madde"}</option>
              <option>Mürekkep</option>
              <option>Sarf Malzeme</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Sipariş / Malzeme Adı</label>
            <input 
              type="text" 
              defaultValue={selectedOrder?.urun || "Kuşe"}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Miktar</label>
            <input 
              type="text" 
              defaultValue={selectedOrder?.miktar || "2160 m²"}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Toplam Tutar ($)</label>
            <input 
              type="text" 
              defaultValue={selectedOrder?.tutar?.replace('$', '') || "816.48"}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
