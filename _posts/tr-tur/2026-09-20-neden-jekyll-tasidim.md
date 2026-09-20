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
TASLAK — gözden geçir, kendi sesine göre son rötuşları sen yap.
Yazı bitince en üstteki "published: false" satırını sil (ya da true yap), sonra canlıya alırız.
-->

Okuldan mezuniyetime yakın bir zamanda, kişisel bir web sitemin olmasının faydalı olacağını düşünmeye başlamıştım. Hem teknik hem hobi amaçlı içeriklerimin bir arada bulunacağı, kişisel marka inşası için gerekli bir alan arayışındaydım. Kısacası, bir blog arayışım vardı.

## Neden sıfırdan değil, bir klon proje ile başladım

Bu alandaki uzmanlığımın henüz kısıtlı olması sebebiyle, bir klon projeyi kendi tercih ve isteklerime göre uyarlama fikri doğdu. Sıfırdan yapmak her ne kadar öğretici ve tecrübe kazanmak için iyi bir yöntem olsa da, siteyi inşa ettiğim 2024 yılında henüz iş hayatına atılmamıştım ve frontend/web geliştirmenin doygunlaşmaya başladığını, bu alanda çok fazla rekabet olduğunu görüyordum. Dolayısıyla kariyerime doğrudan fayda sağlamayacak bir alanda fazla zaman harcamak istemedim ve bir klon proje ile başlamaya karar verdim.

## İlham kaynağım: JavaScript Mastery

YouTube'da uzun zamandır takip ettiğim [JavaScript Mastery](https://www.youtube.com/@javascriptmastery) adında bir kanal var. AI hype'ı henüz doğmamışken, how-to tarzında tutoriallara sahip, yazılım geliştirmenin bir çok alanına dokunan bir kanal; özellikle okul ve kişisel projelerimiz için gerçekten ihtiyaç duyduğumuz, tutarlı teknolojileri anlatan içerikler paylaşıyorlar. Hâlâ çok başarılı içerikler üretiyorlar; özellikle hâlâ öğrenciyseniz videolarına göz atmanızı şiddetle tavsiye ederim. Bir konuda hiçbir şey bilmeyen ama o konuda uzmanlaşmak isteyen birine, her zaman uçtan uca çalışan bir klon proje yapmasını tavsiye etmişimdir — bu, developer'ların ne yaptığını anlamak isteyen biri için çok tecrübe dolu oluyor ve ne yapmak istediğini ya da istemediğini çok daha iyi kavrıyorsun.

Bu araştırma sürecinde "Build and Deploy an Amazing 3D Web Developer Portfolio in React JS | Beginner Three.js Tutorial" adlı [videoyu](https://www.youtube.com/watch?v=0fYi8SGA20k) buldum. Başlangıç için statik bir sitenin fena olmayacağını, ileride kendime göre uyarlamak istersem bunun görece basit olacağı kanaatine vardım ve bu videodan faydalanarak projemi ayağa kaldırdım.

## İlk sürüm: domain arayışı ve React.js portföyü

O zamanlar Google Domains üzerinden ad-soyad temalı domainlere bakıyordum; arzu ettiğim tüm domainlerin alınmış olması hayal kırıklığı yaratsa da sonunda `salihkilic.net`'i satın aldım. YouTube videosunu izleyerek projemi ayağa kaldırdım.

Kaynak kodunu dilerseniz [buradaki repo](https://github.com/Salih2000/mypersonelwebsiteportfolio-main) üzerinden inceleyebilirsiniz. Site hâlâ Firebase üzerinde durduğu için canlı halini de paylaşayım: [personel-website-53a82.web.app](https://personel-website-53a82.web.app/)

{% include figure.liquid loading="eager" path="assets/img/2026-09-20-old-react-portfolio.png" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    Eski React.js/Three.js portföyümün ana sayfası
</div>

## Sorun: 3D sahnelerin ve yüksek render maliyetinin bedeli

Kişisel sitemi ayağa kaldırdıktan sonra, yoğun 3D sahne kullanımının görsel olarak iyi görünse de performans, indeksleme (indexing) ve SEO açısından ciddi problemler yarattığını fark ettim.

## Yeni arayış: içerik/blog odaklı bir teknolojiye geçiş

Sektörde adını duyurmuş birçok geliştiricinin blog ve içerik üretimi temalı web siteleri olduğunu görünce, blogumu üretebileceğim bir teknolojiye geçme fikri oluştu. Klasik WordPress ya da benzeri araçları da araştırdım ama arzu ettiğim açık kaynak kodlama esnekliğini tam olarak yakalayamadım. Bir arkadaşımın tavsiyesiyle Jekyll'in bu tarz işler için çok ideal olduğunu öğrendim ve GitHub üzerinde hazır blog temalarını araştırmaya başladım.

İşte o sırada, tam da istediğim gibi sade, içerik odaklı, düzenli olarak topluluk tarafından desteklenen, Jekyll ile inşa edilen ve GitHub Pages'te ücretsiz olarak host edip kendi domainime bağlayabileceğim [al-folio](https://github.com/alshedivat/al-folio) temasına denk geldim. Kurulumu biraz zaman alsa da dokümantasyonuna bakarak canlıya aldım.

Domainimi eski React formatıyla ayağa kaldırdıktan sonra aradan biraz zaman geçmişti; o sırada Google Domains'in Google tarafından kapatıldığına dair mail gelmiş olsa da tam takip edememiştim ([killedbygoogle.com](https://killedbygoogle.com/)). Akabinde Squarespace üzerinden ilgili DNS yönlendirmelerini yaparak web sitemi tekrar ayağa kaldırdım.

{% include figure.liquid loading="eager" path="assets/img/2026-09-20-killed-by-google.png" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    killedbygoogle.com'da Google Domains'in kaydı
</div>

## Şu an neden bu yapıda karar kıldım

Mevcut haliyle, blog anlamında bir veri alanına ihtiyaç duyan, çalışan bir geliştirici olarak şimdilik tüm ihtiyaçlarımı karşılayacağını fark ettim. Şu özellikleri özellikle işime yarıyor:

- **Çoklu dil desteği** — Türkçe ve İngilizce içeriği aynı sitede, hem yerel hem uluslararası kitleye hitap edebiliyorum.
- **Markdown ile içerik üretimi** — kod yazmadan, sade bir metin dosyasıyla yeni bir yazı yayınlayabiliyorum.
- **GitHub Pages üzerinde tamamen ücretsiz barındırma**, kendi domainimi bağlayabilme imkanıyla birlikte.
- **Tek bir veri dosyasından CV üretimi** — özgeçmiş bilgim hem web sayfası hem indirilebilir PDF olarak tek kaynaktan güncelleniyor.
- **Hazır analitik entegrasyonları** — Google Analytics, Search Console ve Microsoft Clarity gibi araçları birkaç satır ayarla bağlayabiliyorum.
- **Statik site olduğu için hızlı yüklenme ve SEO dostu yapı** — eski sitemdeki 3D sahne yükünün aksine.
- **GitHub Actions ile otomatik deploy** — bir değişikliği push'ladığımda site kendiliğinden güncelleniyor.

Aslında bu yazının içeriği başta "bunu siz de nasıl yaparsınız" tarzı bir rehber olacaktı; ama sonunda bunun yerine "neden bunu tercih ettim" yazısı olmasının daha uygun olduğuna karar verdim. Çünkü günümüzde yapay zeka sayesinde böyle bir siteyi ayağa kaldırmak, açıkçası benim burada yazacağım bir rehberden çok daha fazla yardımcı olacaktır size — muhtemelen blogumda oluşturmak istediğim içerikler de artık "nasıl yapılır" demekten ziyade "neden tercih ettim" ve o konudaki geri dönütlerime yönelik olacak, zira Agentic AI artık bu tarz kurulum/manuel süreçleri çok daha anlaşılır ve uygulanabilir şekilde sunuyor.

Gün sonunda mevcut yapıda ağırlıklı ve kaliteli sayılabilecek bir içeriğim henüz yok; bunlara nasıl zaman ayıracağımı planlamam gereken bir durum. Lakin yakın zamanda blogumu doldurmayı düşünüyorum — gerek mesleki deneyim ve uzmanlığıma, gerekse hobilerime ve günlük hayatta yaşadığım durumlara yönelik içerikler olabilir bunlar.
