# Etiket CRM - Proje Gereksinimleri ve Mimari

## 1. Teknoloji Yığını (Tech Stack)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Veritabanı & Backend:** Supabase (Auth, Postgres DB, Storage, Realtime)
- **State Management:** Zustand veya Context API
- **Form Yönetimi:** React Hook Form & Zod

## 2. Mimari Kararlar
- **Modüler Yapı:** Bütün tekrar eden UI elemanları `components/` klasöründe tutulacaktır. (Örn: Butonlar, Tablolar, Modallar)
- **Layout Yönetimi:** Sayfa şablonları `app/layout.tsx` ve gerektiğinde alt layout dosyaları ile yönetilecektir.
- **Mobil Uyumluluk (Mobile-First):** İleride React Native ile mobil uygulama geliştirilebilmesi için, iş mantığı (business logic) ve servis katmanları UI'dan bağımsız, kancalar (hooks) ve servis dosyaları olarak ayrılacaktır.
- **Stil Tutarlılığı ve Kurumsal Renk:** Kurumsal renk olan **#3b82f6** (Tailwind `blue-500`) ana tema rengi olarak ayarlanacaktır. Mümkün olan tüm elementler Tailwind utility class'ları ile stillendirilecek, zorunlu kalmadıkça (ve nadir yerler dışında) custom CSS yazılmayacaktır.
- **Sayfa Yapılandırması:** Eski sistemdeki her HTML sayfası birebir yeni bir Next.js sayfası olmak zorunda değildir. İhtiyaca göre sayfalar birleştirilecek, sekmeler (tabs) veya modallar kullanılarak daha modern ve kullanıcı dostu bir deneyim (UX) kurgulanacaktır.

## 3. Geliştirme Standartları
- Bir bileşende veya fonksiyonda değişiklik yapıldığında, projede bu bileşeni kullanan tüm sayfalar kontrol edilecektir.
- Kod tekrarlarından kaçınılacak (DRY prensibi).
- Soru sorulduğunda doğrudan eyleme geçilmeyecek, önce cevap verilip strateji belirlenecektir.
