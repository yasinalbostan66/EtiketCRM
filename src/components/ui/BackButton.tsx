"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4 focus:outline-none"
    >
      <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
      Geri Dön
    </button>
  );
};
