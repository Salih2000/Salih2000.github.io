# TODO

Site denetiminden (2026-09-23) çıkan yapılacaklar. Düzeltmeden önce her maddeyi tekrar kontrol et; kod bu tarihten sonra değişmiş olabilir.

## 🔴 Kritik

- [ ] **HTTPS zorunlu değil:** Settings → Pages → "Enforce HTTPS" kapalı (`https_enforced: false`).
- [ ] **Geçersiz dil kodu `tr-tur`:** `_config.yml:363` içindeki kod `hreflang`, `<html lang>` ve `og:locale` alanlarına yazılıyor; Google bunu yok sayıyor. Etiketlerde `tr-TR` / `en-US`, og:locale için `tr_TR` / `en_US` kullan; `/tr-tur/` URL'leri kalabilir.
  - `_includes/head.liquid:84-98`, `_layouts/default.liquid:2`, `_includes/metadata.liquid:107`
- [ ] **Sitemap'te Türkçe sayfalar yok:** `/tr-tur/sitemap.xml` İngilizce adresleri ve bir 404'ü (`/blog/category/kişisel/`) listeliyor. İki dili de dolaşan özel bir sitemap şablonu yaz.
- [ ] **Scholar atıf görevi sessizce bozuk:** `update-citations.yml` her çalışmada `ModuleNotFoundError: bibtexparser.bibdatabase` veriyor ama `set +e` hatayı gizliyor. `requirements.txt` içinde `bibtexparser<2` ile sürümü sabitle ve adımın hata kodunu döndürmesini sağla.

## 🟠 Yüksek

- [ ] **Türkçe sayfalarda yanlış adres:** `og:url` ve JSON-LD `url` İngilizce adresi gösteriyor (`metadata.liquid:102,282`).
- [ ] **JSON-LD zayıf:** Ayrı bir `Person` kaydı ekle (`@id`, `jobTitle`, `worksFor`, `knowsAbout`, `alternateName`). `sameAs` alanını Person kaydına taşı. BlogPosting'in `name` alanına yazı başlığını yaz.
- [ ] **`/blog/2026/` yanlış işaretleniyor:** Arşiv sayfası BlogPosting olarak işaretleniyor, headline "blank" (`metadata.liquid:91-95,285`).
- [ ] **About / ana sayfa çok kısa:** Yaklaşık 60 kelime ve SAS/Python/SQL hiç geçmiyor. Net bir tanım cümlesi, yetenekler ve kısa bir SSS ekle; başlık "Salih A. Kilic – Data Engineer & SAS/Python Consultant" gibi olsun.
- [ ] **`llms.txt` hatalı:** Yayında olmayan `/projects/` ve `/publications/` linklerini kaldır, uzmanlık özeti ekle, adı site genelindekiyle aynı yaz.
- [ ] **Actions sabitlenmemiş:** `fjogeleit/yaml-update-action@main` sürümünü SHA'ya sabitle (ya da `sed` ile değiştir). Diğer action'ları da SHA'ya sabitle. Repodaki varsayılan workflow yetkisini "read" yap.
- [ ] **`bin/deploy` scriptini sil:** Olmayan `origin` remote'una push ediyor, `rm -rf` ile ignore edilen klasörleri siliyor ve CRLF satır sonları yüzünden çalışmıyor.

## 🟡 Orta

- [ ] **Kategori slug'ı dillere göre farklı** (`personal` / `kişisel`), dil değiştirici ve hreflang 404 veriyor. Slug'ı iki dilde aynı yap, sadece görünen adı çevir.
- [ ] **Demo sayfa yayında:** `_pages/tr-tur/about_einstein.md` dosyasını `exclude` listesine ekle.
- [ ] **Giscus yorumları hep İngilizce** (`_includes/giscus.liquid:11`).
- [ ] **Eski gem'ler:** `bundle update nokogiri json addressable concurrent-ruby css_parser loofah activesupport`
- [ ] **Eski ön yüz kütüphaneleri:** Bootstrap 4.6.2 artık desteklenmiyor. Kullanılmayan mermaid, vega, swiper ve echarts girişlerini kaldır.
- [ ] **Performans:**
  - MathJax ve Altmetric/Dimensions rozetlerini varsayılan olarak kapat.
  - `particles.js` dosyasına `defer` ekle.
  - Yazıdaki görsellerde `loading="eager"` kullanma.
  - 14 MB'lık PNG ve 26 MB'lık videoyu (kullanılmayan demo dosyaları) sil.
- [ ] **Meta açıklamalar:** CV, repositories ve news sayfalarına kendi `description` alanını ekle.
- [ ] **İnce arşiv sayfaları:** Etiket, kategori ve yıl arşivleri ile news öğelerine `noindex` ekle ya da sitemap'ten çıkar.
- [ ] **RSS:** Akış başlığı "blank"; `<head>` içine `{% feed_meta %}` ekle.
- [ ] **Erişilebilirlik:**
  - Parçacık animasyonu `prefers-reduced-motion` tercihine uysun.
  - Telefon penceresi klavyeyle kapatılabilsin.
  - Newsletter metinleri Türkçeye çevrilsin.
- [ ] **`deploy.yml`:**
  - Yol filtresine `_plugins/**` ve `*.txt` ekle.
  - purgecss ve nbconvert sürümlerini sabitle.
  - Link kontrolünü deploy'un içine al.

## 🟢 Düşük

- [ ] Karşılama animasyonu için `aria` etiketleri ekle (ekran okuyucu metni harf harf okuyor).
- [ ] Profil fotoğrafının alt metnini düzelt (şu an dosya adı).
- [ ] Yazılar için 1200×630 boyutunda og görseli ekle.
- [ ] JSON-LD değerlerini `jsonify` ile yaz.
- [ ] Footer'da "©Copyright" arasına boşluk ekle.
- [ ] Tema düğmesinin ilk tıklamasını düzelt.
- [ ] Upstream'den kalan workflow'ları sil: docker ile ilgili 3 workflow, lighthouse-badger, prettier-html, update-tocs, codeql, prettier-comment-on-pr.
- [ ] Upstream kalıntılarını temizle:
  - `lighthouse_results/` klasörünü kaldır.
  - `disqus_shortname` ayarını sil.
  - `.gitignore` içindeki `Gemfile.lock` satırını kaldır.
  - `docker-compose.yml` dosyasındaki upstream imajını değiştir.
