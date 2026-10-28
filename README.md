# Noctélia — Lüks Parfüm Sitesi

Hayali bir lüks parfüm markası için tasarlanmış, animasyonlu ve çok sayfalı bir e-ticaret vitrin sitesi.
Bir portfolyo çalışmasıdır: **Noctélia gerçek bir marka değildir**, sitede gerçek satış yapılmaz ve formlar hiçbir yere veri göndermez.

## Öne çıkanlar

- **Açan gül (hero):** Kapak kalkar, sprey başlığı basar, parfüm buharı saçılır ve şişeden SVG ile çizilmiş bir gül açar; etrafında yapraklar uçuşur, ardından gül kapanır ve döngü baştan başlar.
- **Şişenin yolculuğu:** Aşağı kaydırınca gül kaydırmayla birlikte şişeye geri katlanır, kapak kapanır ve şişe küçülerek koku piramidinin ortasına iner; yukarı çıkınca aynı yoldan geri döner.
- **Koku piramidi:** Altın çizgiler kendini çizer, kaydırdıkça üst, kalp ve dip notaları sırayla yanar. Ürün sayfalarında her kokunun kendi şişesi ve notalarıyla tekrar kullanılır.
- **Hikâyemiz:** Dokuz kokunun dokuz altın çiçek kapağı, kaydırmayla ortadan dışa açılır.
- **Koleksiyon:** Sayfa sayfa kayan kaydırıcı, aile filtresi ve fiyat sıralaması; fareyle gelince açılan kapaklar ve sepete ekle.
- **Ürün sayfası:** Kapalı, açık ve kapak detayı görünümleri, boyut ve adet seçimi, telefonda sabit satın alma çubuğu.
- **Kokunu bul:** Dört soruluk test, sonuçta en yakın koku ve iki alternatif.
- **Mağazalar:** Leaflet haritası ve konum arama.
- **Sepet ve hesap:** Yandan açılan sepet paneli, sepet sayfası, giriş ve üyelik akışı; veriler yalnızca tarayıcıda (`localStorage`) tutulur.
- **Ayrıntılar:** Yumuşak kaydırma (Lenis), altın alt çizgili bağlantılar, tutarlı buton dili, koyu şarap ve altın renk sistemi, `prefers-reduced-motion` desteği; masaüstü ve telefon için ayrı düzen.

## Teknolojiler

- HTML5, CSS3 (custom properties, grid, mask, `clamp()`)
- Vanilla JavaScript, SVG ve Canvas 2D
- [GSAP 3](https://gsap.com/) + ScrollTrigger, [Lenis](https://lenis.darkroom.engineering/) (CDN üzerinden)
- [Leaflet](https://leafletjs.com/) + Esri harita karoları (mağazalar sayfası)
- Google Fonts: Bodoni Moda, Jost

## Klasör yapısı

```
noctelia-site/
├── index.html          # ana sayfa: hero, koku piramidi, hikâyemiz, koleksiyon, bülten
├── koleksiyon.html     # tüm kokular, filtre ve sıralama
├── urun.html           # ürün sayfası (urun.html?id=rose-nocturne gibi)
├── kokunu-bul.html     # dört soruluk koku testi
├── sepet.html          # sepet
├── hesap.html          # giriş ve üyelik
├── magazalar.html      # mağaza bulucu
├── sss.html            # sıkça sorulan sorular
├── yasal.html          # gizlilik, çerezler, kullanım koşulları, KVKK
├── 404.html            # bulunamayan sayfa
├── css/style.css       # tüm stiller
├── js/main.js          # ana sayfa animasyonları
├── js/store.js         # ürün verileri, sepet, paneller ve ortak bileşenler
├── js/page.js          # iç sayfalar (ürün, koleksiyon, sepet, hesap, test, mağazalar)
└── assets/img/         # şişe, kapak, çiçek ve ikon görselleri
```

Ürün adları, fiyatlar (30 / 50 / 100 ml), notalar ve açıklamalar `js/store.js` içindeki `PRODUCTS` listesinden gelir.
İletişim adresi olarak yer tutucu `you@example.com` kullanılır.

## Çalıştırma

Derleme adımı yoktur. Yerel bir sunucuyla açmak yeterlidir:

```bash
python -m http.server 5173
```

Ardından tarayıcıda `http://localhost:5173` adresini açın.

## Yayınlama

Klasör herhangi bir statik barındırma hizmetinde (GitHub Pages, Netlify, Vercel) olduğu gibi yayınlanabilir.

## Lisans

© 2026 Efnan Yılmaz. Tüm hakları saklıdır. Kod, tasarım ve görseller izinsiz kopyalanamaz, değiştirilemez, dağıtılamaz veya ticari amaçla kullanılamaz. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.

---

Tasarım ve geliştirme — **Efnan Yılmaz**
