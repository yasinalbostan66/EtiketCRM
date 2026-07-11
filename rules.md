# Etiket CRM - Geliştirme Kuralları

1. **İletişim ve Onay:** Soru sorulduğunda doğrudan bir eylem (iş emri) alınmayacak. Önce analiz edilip cevap verilecek, ardından gerekiyorsa plan dahilinde adım atılacaktır.
2. **Bileşen Kullanımı:** Tekrarlanan hiçbir HTML/JSX kodu aynı sayfada birden fazla kez yazılmayacak. Yeniden kullanılabilir her parça `components/` dizininde kendi dosyası olarak oluşturulacaktır.
3. **Layout Yönetimi:** Farklı sayfa yapıları (örneğin auth sayfaları vs. ana dashboard) `layout/` veya Next.js'in `layout.tsx` yapısı altında ayrı ayrı tutulacaktır. Menüde yer alan her ana modülün kendi `page.tsx` dosyası olacaktır. Hiyerarşik yapı profesyonel bir CRM mantığıyla kurgulanacak, ancak gereksiz sayfa değişimleri önlenecektir.
4. **Etki Analizi:** Bir bileşende veya stilde değişiklik yapılacağı zaman, projedeki hangi sayfaların ve diğer bileşenlerin bundan etkilendiği kontrol edilecek ve gerekirse oralarda da düzenleme yapılacaktır. Ekranlar arası görsel tutarsızlığa izin verilmez.
5. **Git Süreçleri:** Yeni büyük geliştirmeler her zaman ayrı bir branch (dal) üzerinden yürütülecek ve test edildikten sonra ana branch'e entegre edilecektir.
6. **Tasarım ve Stiller:** Kurumsal renk **#3b82f6**'dır. Sadece temel seviyede değil, Tailwind kullanarak göze hitap eden (Premium hissi veren) tasarımlar oluşturulacaktır. Mümkün olan tüm elementler Tailwind utility sınıflarıyla stillendirilecek, nadir görülen ve tekrarlanmayacak özel ihtiyaçlar dışında custom CSS yazılmayacaktır.
