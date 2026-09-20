---
published: false
layout: post
title: Sitemi neden React.js'ten Jekyll'e taşıdım
date: 2026-09-20 12:00:00+0300
description: React.js ile başlayan kişisel sitemi neden Jekyll/GitHub Pages'e taşıdığımın hikayesi.
tags: jekyll react personal-site
categories: veri-mühendisliği
related_posts: false
---

<!--
TASLAK — bu senin anlattığın hikayenin düzenlenmiş hali, gözden geçirip kendi sesine göre son rötuşları sen yap.
Yazı bitince en üstteki "published: false" satırını sil (ya da true yap), sonra canlıya alırız.
-->

Okuldan mezuniyetime yakın bir zamanda, kişisel bir web sitemin olmasının faydalı olacağını düşünmeye başlamıştım. Hem teknik hem hobi amaçlı içeriklerimin bir arada bulunacağı, kişisel marka inşası için gerekli bir alan arayışındaydım. Kısacası, bir blog arayışım vardı.

## Neden sıfırdan değil, bir klon proje ile başladım

Bu alandaki uzmanlığımın henüz kısıtlı olması sebebiyle, bir klon projeyi kendi tercih ve isteklerime göre uyarlama fikri doğdu. Sıfırdan yapmak her ne kadar öğretici ve tecrübe kazanmak için iyi bir yöntem olsa da, siteyi inşa ettiğim 2024 yılında henüz iş hayatına atılmamıştım ve frontend/web geliştirmenin doygunlaşmaya başladığını, bu alanda çok fazla rekabet olduğunu görüyordum. Dolayısıyla kariyerime doğrudan fayda sağlamayacak bir alanda fazla zaman harcamak istemedim ve bir klon proje ile başlamaya karar verdim.

## İlham kaynağım: JavaScript Mastery

YouTube'da uzun zamandır takip ettiğim [JavaScript Mastery](https://www.youtube.com/@javascriptmastery) adında bir kanal var. AI hype'ına kapılmadan, okul ve kişisel projelerimiz için gerçekten ihtiyaç duyduğumuz, tutarlı teknolojileri anlatan içerikler paylaşıyorlar. Hâlâ çok başarılı içerikler üretiyorlar; özellikle hâlâ öğrenciyseniz videolarına göz atmanızı şiddetle tavsiye ederim. Bir konuda hiçbir şey bilmeyen ama o konuda uzmanlaşmak isteyen birine, her zaman uçtan uca çalışan bir klon proje yapmasını tavsiye etmişimdir.

Bu araştırma sürecinde "Build and Deploy an Amazing 3D Web Developer Portfolio in React JS | Beginner Three.js Tutorial" adlı [videoyu](https://www.youtube.com/watch?v=0fYi8SGA20k) buldum. Başlangıç için statik bir sitenin fena olmayacağını, ileride kendime göre uyarlamak istersem bunun görece basit olacağı kanaatine vardım ve bu videodan faydalanarak projemi ayağa kaldırdım.

## İlk sürüm: domain arayışı ve React.js portföyü

O zamanlar Google Domains üzerinden ad-soyad temalı domainlere bakıyordum; arzu ettiğim tüm domainlerin alınmış olması hayal kırıklığı yaratsa da sonunda `salihkilic.net`'i satın aldım. YouTube videosunu izleyerek projemi ayağa kaldırdım.

Kaynak kodunu dilerseniz [buradaki repo](https://github.com/Salih2000/mypersonelwebsiteportfolio-main) üzerinden inceleyebilirsiniz. Site hâlâ Firebase üzerinde durduğu için canlı halini de paylaşayım: [personel-website-53a82.web.app](https://personel-website-53a82.web.app/)

## Sorun: 3D sahnelerin bedeli

Kişisel sitemi ayağa kaldırdıktan sonra, yoğun 3D sahne kullanımının görsel olarak iyi görünse de performans, indeksleme (indexing) ve SEO açısından ciddi problemler yarattığını fark ettim.

## Yeni arayış: içerik/blog odaklı bir teknolojiye geçiş

Sektörde adını duyurmuş birçok geliştiricinin blog ve içerik üretimi temalı web siteleri olduğunu görünce, blogumu üretebileceğim bir teknolojiye geçme fikri oluştu. Bir arkadaşımın tavsiyesiyle Jekyll'in bu tarz işler için çok ideal olduğunu öğrendim ve GitHub üzerinde hazır blog temalarını araştırmaya başladım.

İşte o sırada, tam da istediğim gibi sade, içerik odaklı, düzenli olarak topluluk tarafından desteklenen ve GitHub Pages'te ücretsiz olarak host edip kendi domainime bağlayabileceğim [al-folio](https://github.com/alshedivat/al-folio) temasına denk geldim. Kurulumu biraz zaman alsa da dokümantasyonuna bakarak canlıya aldım.

Ne yazık ki tam o sıralarda Google Domains, Google tarafından [öldürüldü](https://killedbygoogle.com/). Squarespace üzerinden DNS yönlendirmelerini yapıp web sitemi tekrar ayağa kaldırdım.

## Şu an neden bu yapıda karar kıldım

Mevcut haliyle, blog anlamında bir veri alanına ihtiyaç duyan, çalışan bir geliştirici olarak şimdilik tüm ihtiyaçlarımı karşılayacağını fark ettim. Şu özellikleri özellikle işime yarıyor:

- **Çoklu dil desteği** — Türkçe ve İngilizce içeriği aynı sitede, hem yerel hem uluslararası kitleye hitap edebiliyorum.
- **Markdown ile içerik üretimi** — kod yazmadan, sade bir metin dosyasıyla yeni bir yazı yayınlayabiliyorum.
- **GitHub Pages üzerinde tamamen ücretsiz barındırma**, kendi domainimi bağlayabilme imkanıyla birlikte.
- **Tek bir veri dosyasından CV üretimi** — özgeçmiş bilgim hem web sayfası hem indirilebilir PDF olarak tek kaynaktan güncelleniyor.
- **Hazır analitik entegrasyonları** — Google Analytics, Search Console ve Microsoft Clarity gibi araçları birkaç satır ayarla bağlayabiliyorum.
- **Statik site olduğu için hızlı yüklenme ve SEO dostu yapı** — eski sitemdeki 3D sahne yükünün aksine.
- **GitHub Actions ile otomatik deploy** — bir değişikliği push'ladığımda site kendiliğinden güncelleniyor.

Aslında bu yazının içeriği başta "bunu siz de nasıl yaparsınız" tarzı bir rehber olacaktı; ama sonunda bunun yerine "neden bunu tercih ettim" yazısı olmasının daha uygun olduğuna karar verdim. Çünkü günümüzde yapay zeka sayesinde böyle bir siteyi ayağa kaldırmak artık hiç iş bile değil.

Kısaca nasıl kurduğumdan da bahsedeyim: al-folio'nun çok dilli desteği olan bir [fork'unu](https://github.com/george-gca/multi-language-al-folio) temel aldım, Docker üzerinde yerel bir geliştirme ortamı kurup değişiklikleri canlıya almadan önce test ettim, GitHub Actions ile de her `push`'ta site otomatik olarak build edilip GitHub Pages'e deploy oluyor. Detaylara başka bir yazıda girerim, ama özetle süreç bu şekildeydi.
