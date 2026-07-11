"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Eğer Supabase ayarlanmadıysa mock giriş yap
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sol Taraf - Görsel Alan (Brand Theme) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-blue-900/50"></div>
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 mb-8 shadow-2xl">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
            Matbaanızın <br/> <span className="text-blue-200">Dijital Gücü</span>
          </h1>
          <p className="text-lg text-blue-100 font-medium leading-relaxed">
            Siparişten üretime, sevkiyattan finansa kadar tüm iş süreçlerinizi tek bir merkezden, güvenle yönetin.
          </p>
          
          <div className="mt-12 flex items-center gap-4 text-sm font-bold text-blue-200">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-blue-800"></div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-blue-800"></div>
              <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-blue-800"></div>
            </div>
            <p>500+ matbaa profesyoneline katılın.</p>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Form Alanı (Light Theme) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-8 relative">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Tekrar Hoş Geldiniz</h2>
            <p className="text-slate-500 mt-2 font-medium">Hesabınıza giriş yaparak kaldığınız yerden devam edin.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 mt-10">
            <div className="space-y-4">
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">E-posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@etiketcrm.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Şifre</label>
                  <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Şifremi Unuttum?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-sm font-semibold text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-500/20"
              disabled={loading}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-slate-600 mt-8">
            Hesabınız yok mu?{" "}
            <Link href="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Hemen Oluşturun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
