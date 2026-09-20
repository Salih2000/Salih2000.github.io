---
layout: post
title: Sitemi neden React.js'ten Jekyll'e taşıdım
date: 2026-09-20 12:00:00+0300
description: React.js ile başlayan kişisel sitemi neden Jekyll/GitHub Pages'e taşıdığımın hikayesi.
tags: jekyll react personal-site
categories: kişisel
related_posts: false
---

Okuldan mezuniyetime yakın, kişisel bir web sitemin olmasının hem teknik hem de hobi amaçlı içeriklerimi toplamak ve kişisel markamı inşa etmek için iyi bir adım olacağını düşünmeye başladım. Kısacası, bir blog arayışındaydım.

## Neden sıfırdan değil, bir klon proje ile başladım

Web teknolojilerindeki tecrübem henüz kısıtlı olduğu için, hazır bir klon projeyi kendi isteklerime göre uyarlama fikri cazip geldi. Sıfırdan yapmak şüphesiz öğretici bir yöntem; fakat siteyi inşa ettiğim 2024 yılında henüz iş hayatına atılmamıştım. Frontend ve web geliştirme alanının giderek doygunlaştığını, çok fazla rekabet olduğunu görüyordum. O dönemde daha çok veri odaklı ilerlemek istediğimden, bu alanda fazla zaman harcamak istemedim ve bir klon projeyle yola çıktım. 2026'ya gelindiğinde bile web teknolojilerinin gün geçtikçe daha da daralan ve aşırı rekabetçi bir alan olmaya devam ettiğini görüyorum; dolayısıyla o zamanki öngörümün ve iddiamın hâlâ geçerli olduğunu düşünüyorum.

YouTube'da uzun zamandır takip ettiğim [JavaScript Mastery](https://www.youtube.com/@javascriptmastery) kanalı bu süreçte oldukça işime yaradı. AI dönemi henüz başlamamışken bile uçtan uca çalışan, tutarlı teknolojileri anlatan harika tutoriallar paylaşıyorlar (hâlâ da üretmeye devam ediyorlar). Özellikle öğrenciyseniz kesinlikle göz atmalısınız. Zaten bir konuda hiçbir şey bilmeyip uzmanlaşmak istiyorsanız, uçtan uca çalışan bir klon proje yapmak yazılımcıların ne yaptığını anlamak ve neyi istemediğinizi fark etmek için en iyi yollardan biri.

Bu araştırmalar sırasında bulduğum "Build and Deploy an Amazing 3D Web Developer Portfolio in React JS \| Beginner Three.js Tutorial" adlı [videodan](https://www.youtube.com/watch?v=0fYi8SGA20k) faydalanarak ilk projemi ayağa kaldırdım. Başlangıç için statik ve havalı bir sitenin fena olmayacağını düşünmüştüm.

## İlk sürüm: domain arayışı ve React.js portföyü

O dönem Google Domains üzerinden ad-soyad temalı domain arıyordum. İstediğim adreslerin çoğu alınmış olsa da sonunda [salihkilic.net](https://salihkilic.net)'i satın aldım. Videoyu takip ederek projeyi kurdum.

Dilerseniz kaynak koduna [buradaki repo](https://github.com/Salih2000/mypersonelwebsiteportfolio-main) üzerinden göz atabilirsiniz. Site hâlâ Firebase üzerinde durduğu için canlı haline de [şuradan](https://personel-website-53a82.web.app/) ulaşabilirsiniz.

{% include figure.liquid loading="eager" path="assets/img/2026-09-20-old-react-portfolio.png" class="img-fluid rounded z-depth-1" alt="Eski React.js/Three.js portföyümün ana sayfasının ekran görüntüsü" %}
<div class="caption">
    Eski React.js/Three.js portföyümün ana sayfası
</div>

## Sorun: 3D sahnelerin ve yüksek render maliyetinin bedeli

Sitemi ayağa kaldırdıktan sonra fark ettim ki, yoğun 3D sahne kullanımı görsel olarak ne kadar şık dursa dursun; performans, indeksleme ve SEO açısından ciddi sıkıntılar yaratıyordu.

## Yeni arayış: içerik odaklı bir teknoloji

Sektörde beğendiğim birçok geliştiricinin içerik üretimi odaklı sade web siteleri olduğunu görünce, benim de bu yöne evrilmem gerektiğine karar verdim. Klasik WordPress veya benzeri araçları inceledim ancak aradığım açık kaynak kod esnekliğini bulamadım. Bir arkadaşımın tavsiyesiyle Jekyll'in bu iş için biçilmiş kaftan olduğunu öğrendim ve GitHub üzerindeki hazır temaları incelemeye başladım.

Tam da aradığım gibi sade, içerik odaklı, topluluk tarafından aktif desteklenen ve GitHub Pages üzerinde ücretsiz barındırıp kendi domainime bağlayabileceğim [al-folio](https://github.com/alshedivat/al-folio) temasına denk geldim. Kurulumu biraz vakit alsa da dokümantasyonu takip ederek sistemi canlıya aldım.

Bu süreçte Google Domains'in Google tarafından kapatıldığını öğrendim ([killedbygoogle.com](https://killedbygoogle.com/)). Hemen Squarespace üzerinden gerekli DNS yönlendirmelerini yaparak sitemi sorunsuz şekilde tekrar aktif hale getirdim.

{% include figure.liquid loading="eager" path="assets/img/2026-09-20-killed-by-google.png" class="img-fluid rounded z-depth-1" alt="killedbygoogle.com sitesindeki Google Domains kaydının ekran görüntüsü" %}
<div class="caption">
    killedbygoogle.com'da Google Domains'in kaydı
</div>

## Şu an neden bu yapıda karar kıldım

Mevcut yapım, çalışan bir geliştirici olarak tüm temel ihtiyaçlarımı fazlasıyla karşılıyor:

- **Çoklu dil desteği:** Türkçe ve İngilizce içeriği aynı sitede tutabiliyorum; hem yerel hem uluslararası kitleye hitap edebiliyorum.
- **Kolay içerik üretimi:** Yeni bir yazı yazmak için kod yazmama gerek kalmıyor; sade bir Markdown dosyası açmak yeterli oluyor.
- **Sıfır maliyet ve kolay barındırma:** GitHub Pages üzerinde tamamen ücretsiz host ediliyor ve kendi domainimle çalışıyor.
- **Tek kaynaktan CV:** Özgeçmişim tek bir veri dosyasından besleniyor; bilgileri bir kez güncellediğimde hem web sayfası hem de indirilebilir PDF otomatik güncelleniyor.
- **Kolay entegrasyonlar:** Google Analytics, Search Console ve Microsoft Clarity gibi araçları birkaç satırlık ayarla bağladım, ekstra bir entegrasyon derdi yok.
- **Hız ve SEO:** Statik bir yapıda olduğu için hem uçuyor hem de SEO dostu; eski sitemdeki ağır 3D sahnelerin tam zıttı bir performans sunuyor.
- **Otomatik dağıtım:** GitHub Actions sayesinde repoya ufak bir push yaptığımda site anında güncelleniyor.

Aslında bu yazının ilk taslağı "bunu siz de nasıl adım adım kurarsınız" tarzı bir rehber olacaktı. Fakat bunun yerine "neden bu tercihi yaptım" yazısı olmasının daha doğru olduğuna karar verdim. Çünkü günümüzde yapay zeka araçları sayesinde bu tarz teknik kurulumları yapmak, benim burada anlatacağımdan çok daha kolay ve anlaşılır hale geldi. Muhtemelen bundan sonra blogumda üreteceğim içerikler de "nasıl yapılır" rehberlerinden ziyade, "neden tercih ettim" odaklı ve teknik tecrübelerimi aktardığım yazılar olacak.

Şimdilik kaliteli ve ağırlıklı sayılabilecek geniş bir içeriğim henüz yok (henüz! :D), bunlara nasıl zaman ayıracağımı planlıyorum. Lakin yakın zamanda hem mesleki birikimlerimi hem de günlük hayattaki hobilerimi ve deneyimlerimi buraya taşımayı düşünüyorum.

Eğer siz de bu tarz bir altyapıyı kurmak isterseniz, kullandığım çok dilli [al-folio](https://github.com/george-gca/multi-language-al-folio) reposunun README dokümantasyonunu bir AI aracıyla birlikte incelemenizi tavsiye ederim. Az çok teknik altyapınız varsa hiç de zor değil. Dost ve müttefik çevremdeyseniz zaten doğrudan bana da ulaşabilirsiniz, seve seve yönlendiririm.
