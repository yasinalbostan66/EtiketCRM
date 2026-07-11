---
name: EtiketCRM Guidelines
description: Etiket CRM projesi için uyulması gereken temel kurallar ve mimari kararlar.
---

# Etiket CRM Guidelines

Bu projede çalışırken aşağıdaki kurallara her zaman dikkat et:

1. **Önce Cevap, Sonra İş:** Kullanıcı soru sorduğunda hemen koda müdahale etme. Önce analizini paylaş, soruyu cevapla, onayı aldıktan sonra geliştir.
2. **Tutarlı Stil & Tasarım:** Tüm sayfalarda tutarlı bir tasarım dili kullan. Değişiklik yaptığında bu değişikliğin diğer sayfaları bozmadığından emin ol.
3. **Modülerlik:** Tekrarlanan hiçbir yapıyı kopyala-yapıştır yapma. `components/` klasöründe yeni bir bileşen oluştur.
4. **Layoutlar ve Sayfa Yapısı:** Eski HTML yapılarına (örn. her işlem için ayrı HTML dosyası) bağlı kalma. Farklı sayfa yapılarını `layout/` veya Next.js layout mekanizmalarıyla ayrı ayrı yönet; gerekirse işlemleri tek sayfada modallar veya tab'lar (sekmeler) ile birleştirerek UX'i iyileştir.
5. **Next.js, Supabase ve Stiller:** Veritabanı ve backend olarak Supabase, UI için Tailwind CSS kullanılmaktadır. İş mantığını UI'dan ayrı tut. **Kurumsal renk #3b82f6**'dır. Tüm elementleri Tailwind utility class'ları ile stillendir, çok zorunlu olmadıkça custom CSS yazma.
