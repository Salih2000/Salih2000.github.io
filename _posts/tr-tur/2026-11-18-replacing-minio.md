---
layout: post
title: "MinIO'nun yerini doldurmak: açık kaynak da bir lisanstır, geleceğe dair söz vermez"
date: 2026-11-18 01:00:00+0300
description: MinIO'nun topluluk sürümü adım adım geri çekildi ve Docker imajları kalktı. Ona bağımlı bir uygulamada yerine ne koyduğumu, MinIO alternatiflerini ve açık kaynak hakkında çıkardığım dersleri anlatıyorum.
tags: minio minio-alternatives s3 object-storage open-source agpl self-hosting dependencies
categories: engineering
related_posts: true
giscus_comments: true
og_image: https://salihkilic.net/assets/img/2026-11-14-minio-og-tr-v3.png
toc:
  sidebar: left
---

Ekim ayında, üzerinde çalıştığım bir uygulamanın kurulum paketini planlarken kurulumun indirdiği konteyner imajlarının, onları daha önce hiç indirmemiş bir makineden hâlâ indirilebildiğini kontrol etmek istedim. Diğer imajlar sorunsuz indi; fakat MinIO'nun iki imajı için imaj deposu "repository does not exist" cevabını verdi.

Kendi bilgisayarımda her şey aylardır çalışıyordu, çünkü o iki imaj Docker'ın önbelleğinde duruyordu. Uygulama, ben farkına varmadan, yalnızca daha önce kurulduğu makinelerde çalışabilir hale gelmişti.

Docker Hub'daki `minio/minio` ve quay.io'daki `quay.io/minio/minio` imajlarını indirmeye çalışanların aldığı hatalar aşağıdaki gibi:

```text
Error response from daemon: pull access denied for minio, repository does not exist or may require authorization
unauthorized: access to the requested resource is not authorized
```

İlk satırdaki Docker Hub hatası [Milvus](https://github.com/milvus-io/milvus/issues/53430) projesinin, ikinci satırdaki quay.io hatası [katta-compose](https://github.com/shift7-ch/katta-compose/issues/22) projesinin issue'sundan alındı.

Bu hatalardan biriyle siz de karşılaştıysanız ve hemen ne yapabileceğinizi görmek istiyorsanız doğrudan [MinIO imajı inmiyorsa bugün ne yapabilirsiniz](#minio-imajı-inmiyorsa-bugün-ne-yapabilirsiniz) bölümüne atlayabilirsiniz.

<!-- prettier-ignore-start -->
> ##### Kısaca
>
> MinIO'nun topluluk sürümü Ekim 2025'ten itibaren yalnızca kaynak kod olarak dağıtıldı, Aralık 2025'te bakım moduna alındı ve deposu Şubat 2026'da arşivlendi. Eylül 2026'da `minio/minio` imajları Docker Hub'dan kalktı, quay.io'daki imajlar da anonim indirmeye kapandı. Lisans hâlâ AGPLv3, fakat topluluk sürümü artık yeni sürüm, hazır imaj ya da güvenlik yaması almıyor. Ben üzerinde çalıştığım uygulamada MinIO'yu, aynı beş fonksiyonun arkasında çalışan küçük bir disk deposuyla değiştirdim ve S3 desteğini isteğe bağlı bıraktım. Gerçekten bir S3 sunucusuna ihtiyacınız varsa, yazının ilerisinde versitygw, Garage, SeaweedFS, RustFS, Ceph ve MinIO çatallarını karşılaştırıyorum.
{: .block-tip }
<!-- prettier-ignore-end -->

## Uygulamam [MinIO'yu](https://github.com/minio/minio) ne için kullanıyordu

[MinIO](https://github.com/minio/minio), dosyaları klasörler yerine "bucket" adı verilen kaplarda saklayan ve bunlara HTTP istekleriyle ulaşılmasını sağlayan açık kaynak bir nesne deposudur. Amazon'un bulut depolama servisi S3 ile aynı arayüzü kullandığından, S3 için yazılmış bir uygulama, kodunu değiştirmeden dosyalarını kendi sunucunuzda çalışan MinIO'ya yazabiliyordu ve MinIO'yu asıl yaygınlaştıran da bu oldu.

Uygulama, kurumların kendi sunucularına kurduğu bir analiz aracı. Kullanıcı bir log dosyası yüklediğinde uygulama dosyanın aslını olduğu gibi saklıyor, içeriğini ayrıştırıyor ve sonuçları PostgreSQL'e yazıyor. MinIO bu işin ilk yarısını üstleniyor, yani yüklenen dosyaların aslını tutuyordu.

Birkaç yıl önce kimse bu tercihi sorgulamazdı. MinIO tek bir konteynerle ayağa kalkıyor, ücretsiz geliyor ve neredeyse her örnek `docker-compose.yml` dosyasında karşınıza çıkıyordu. Uygulama da ona yalnızca beş fonksiyon üzerinden dokunuyordu: yükle, indir, metin olarak oku, satırlara böl ve sil.

## MinIO'da adım adım ne oldu

Kaynak kod hâlâ GitHub'da duruyor ve lisansı hâlâ AGPLv3, fakat bakım, hazır ikili dosyalar, konteyner imajları, yönetim arayüzü ve güvenlik yamaları birkaç yıl içinde birer birer ortadan kalktı.

| Tarih           | Ne oldu                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mayıs 2021      | Sunucunun lisansı Apache 2.0'dan [AGPLv3'e](https://github.com/minio/minio/releases/tag/RELEASE.2021-05-11T23-27-41Z) çevrildi.                                                                                                                                                                                                                                                                                                                             |
| Kasım 2024      | Şirket, ticari ürünü [AIStor'u duyurdu](https://www.newswire.ca/news-releases/minio-releases-aistor-purpose-built-for-ai-and-data-workloads-862123650.html). Duyuru ürünü yapay zeka ve veri iş yükleri için tasarlanmış bir depo olarak tanıtıyordu.                                                                                                                                                                                                       |
| Mayıs 2025      | Topluluk sürümünün web arayüzünden yönetim işlevleri [çıkarıldı](https://github.com/minio/minio/releases/tag/RELEASE.2025-05-24T17-08-30Z); sürüm notları bu işlevler için ticari ürünü gösteriyordu.                                                                                                                                                                                                                                                       |
| Ekim 2025       | README, topluluk sürümünün artık [yalnızca kaynak kod olarak](https://github.com/minio/minio/commit/9e49d5e7a648f00e26f2246f4dc28e6b07f8c84a) dağıtıldığını yazdı. Ertesi gün çıkan [güvenlik düzeltmesi](https://github.com/minio/minio/releases/tag/RELEASE.2025-10-15T17-29-55Z) hazır ikili dosya ve resmî imaj olmadan yayımlandı. Bu, topluluk sürümünün son sürümü oldu.                                                                             |
| Aralık 2025     | README ["bakım modu"nu](https://github.com/minio/minio/commit/27742d4694) ilan etti: Yeni özellik ve katkı kabul edilmeyecekti.                                                                                                                                                                                                                                                                                                                             |
| Şubat 2026      | README'nin başına deponun [artık bakılmadığını](https://github.com/minio/minio/commit/7aac2a2c5b) söyleyen bir not kondu ve [depo](https://github.com/minio/minio) ertesi gün arşivlendi.                                                                                                                                                                                                                                                                   |
| Mart–Nisan 2026 | Topluluk sürümünü etkileyen yedi [güvenlik bildirimi](https://github.com/minio/minio/security/advisories) yayımlandı; hiçbiri için topluluk sürümü çıkmadı. Depo Nisan sonunda kısa bir süre yeniden açıldı ve 25 Nisan'da tekrar arşivlendi. GitHub bugün yalnızca bu son tarihi gösteriyor.                                                                                                                                                               |
| Eylül 2026      | Önce Docker Hub'daki imajlar [kayboldu](https://github.com/milvus-io/milvus/issues/53430); kaldırılmadan birkaç gün önceki [son kayıtta](https://web.archive.org/web/20260907043539/https://hub.docker.com/r/minio/minio) imaj yaklaşık 1,85 milyar kez indirilmiş görünüyordu. Ardından quay.io'daki imajlar anonim indirmeye [kapandı](https://github.com/shift7-ch/katta-compose/issues/22). İmajların kaldırılması için MinIO'dan bir duyuru bulamadım. |

{% include figure.liquid loading="lazy" path="assets/img/2026-11-14-minio-erosion-tr.svg" class="img-fluid w-100" width="680" height="524" alt="MinIO topluluk sürümünde kaynak kodun yerinde kaldığını; yönetim arayüzünün, yeni ikili dosyaların ve imajların, güvenlik yamalarının ve eski imajları indirme imkânının 2025 ile 2026 arasında sırayla kalktığını gösteren tablo" zoomable=true %}

<div class="caption">
    Kaynak kod yerinde kaldı, onu kullanılabilir kılan parçalar 2025 ile 2026 arasında sırayla kalktı.
</div>

### "Paralı oldu" demek doğru mu?

Olanları tek cümleyle özetlemek isteyenler "MinIO paralı oldu" diyor; fakat bu cümle olanı tam anlatmıyor. Şirketin [fiyat sayfasına](https://www.min.io/pricing) göre açık kaynak sürüm ömrünü tamamladı ve artık hata düzeltmesi ya da güvenlik yaması almıyor. Sayfa, bu sürümün kullanıcılarına alternatifleri değerlendirmelerini ya da ticari ürün için şirketle görüşmelerini öneriyor.

O ticari ürünün, yani [AIStor'un](https://www.min.io/product/aistor) ücretsiz bir katmanı da var; ancak bu katman özgür yazılım anlamında ücretsiz sayılmaz. [Lisans sözleşmesi](https://www.min.io/legal/aistor-free-agreement) yazılımın yalnızca tek düğümde çalıştırılmasına izin veriyor, üçüncü kişilere dağıtılmasını yasaklıyor ve yazılım bir lisans dosyası olmadan çalışmıyor. Dağıtık kurulum isteyenler için ücretli katmanlar var.

Yazılımı kendi sunucunuzda tek başınıza kullanıyorsanız bu koşullar sizi rahatsız etmeyebilir. Benim durumumda uygulama MinIO'yu kurulum paketinin içinde başka kurumlara taşıyordu ve dağıtımı yasaklayan bir lisansla bunu yapamazdım.

## Bizim tarafta gözden kaçanlar

İşin bana düşen kısmı pek iç açıcı değil. Repo geçmişine dönüp baktığımda üç ayrı uyarıyı kaçırdığımızı görüyorum.

**Birincisi:** MinIO uygulamaya Nisan 2026'da eklendi. O tarihte MinIO'nun deposu yaklaşık iki aydır arşivdeydi ve README'si deponun artık bakılmadığını söylüyordu. Kimse bakmadı, çünkü imaj iniyordu ve her şey çalışıyordu.

**İkincisi:** Eylül ortasında compose dosyasındaki `minio/minio:latest` imajı indirilemez hâle geldi. İmajların Docker Hub'dan kalktığını görünce adresi quay.io'ya çevirdim, sürümü sabitledim ve commit mesajıma da "MinIO imaj dağıtımını quay.io'ya taşımış" diye not düştüm. Yani belirtiyi tedavi etmiş, fakat "Bu imaj neden kayboldu?" sorusunu hiç sormamıştım.

**Üçüncüsü:** On bir gün sonra quay.io'daki imajlar da anonim indirmeye kapandı. Bunu bir ay boyunca fark etmedim, çünkü önbelleğim sayesinde hiçbir şey bozulmadı.

<!-- prettier-ignore-start -->
> ##### İPUCU
>
> Kurulumunuzun indirdiği her imajı ve paketi, önbelleği boş bir ortamdan düzenli olarak indirmeyi deneyen küçük bir kontrol ekleyin. Böyle bir kontrol olsaydı bu sorunu haftalar önce fark ederdim.
{: .block-tip }
<!-- prettier-ignore-end -->

Hangi çözümü seçeceğimi bilmeden önce, önbellekteki iki imajı `docker save` ile tek bir arşiv dosyasına aldım. 85 MB'lık o dosya, o andan itibaren eski verilere ulaşmanın elimdeki en sağlam yoluydu, çünkü MinIO dosyaları diskte kendi biçiminde saklıyor. Onları güvenle okuyabilecek program yine MinIO'nun kendisi ve o program artık resmî adreslerinden hazır olarak indirilemiyordu.

## Seçenekleri neye göre eledim

Kendime koyduğum kural basitti. Önce ücretsiz ve gerçekten açık bir alternatif arayacak, uygun bir şey bulamazsam ve iş de büyük değilse kendi çözümümü geliştirecektim.

Adayları lisans ve yeniden dağıtım, kimlik doğrulaması olmadan indirilebilirlik, bakım, yönetişim ve katkı sözleşmesi, güvenlik bildirimleri, ayak izi, yedekleme ve taşıma açısından değerlendirdim. Lisansta önemli olan, bileşeni kurulum paketinin içinde başka kurumlara teslim edip edemeyeceğimdi, çünkü AGPL lisanslı bir imajı dağıtmak kaynak sunma yükümlülüğü getiriyor ve birçok kurumun açık kaynak politikası AGPL'yi kısıtlıyor.

On üç seçeneği tek tek kontrol ettim. Aşağıdaki tablo bunlardan öne çıkanların Ekim 2026 sonundaki durumunu ve benim ihtiyacım açısından vardığım sonucu gösteriyor. Sizin ihtiyacınız farklıysa sonuç da farklı çıkabilir.

| Seçenek                                  | Lisans               | Benim gördüğüm                                                                                                         | Sonuç                   |
| :--------------------------------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------- | :---------------------- |
| AIStor Free                              | Ticari (özel lisans) | Her kurulum lisans dosyası istiyor, yalnızca tek düğüm, yeniden dağıtım yasak.                                         | Eledim.                 |
| MinIO çatalları (PGSTY Silo, Chainguard) | AGPLv3               | Güvenlik yamaları sürüyor; ikisi de tek bir kuruluşa bağlı.                                                            | Yalnızca geçici köprü.  |
| versitygw                                | Apache 2.0           | Nesneleri diskte düz dosya olarak tutan küçük bir S3 ağ geçidi; katkı için lisans devri istemiyor.                     | En iyi ücretsiz sunucu. |
| RustFS                                   | Apache 2.0           | MinIO'ya en yakın yeni motor; çok genç ve katkı sözleşmesi şirkete katkıları başka bir lisansla dağıtma hakkı veriyor. | Seçmedim.               |
| SeaweedFS                                | Apache 2.0           | Çok yetenekli ve çok bileşenli; birkaç GB dosya için fazla geniş bir yüzey.                                            | Seçmedim.               |
| Garage                                   | AGPLv3               | Küçük ve bağımsız; kendi belgeleri tek kopyalı kullanımı yalnızca test için uygun görüyor.                             | Seçmedim.               |
| Ceph                                     | LGPL                 | Gerçek ölçek için tasarlanmış bir küme; tek sunucuya fazla.                                                            | Ölçek dışı.             |
| Dosyaları PostgreSQL'de saklamak         | Ek bileşen yok       | Tek yedek ve işlem tutarlılığı sağlıyor; ama her yedek dosyalarla birlikte büyüyor.                                    | Varsayılan yapmadım.    |
| Kendi disk depom                         | Kendi kodum          | 300 satırdan kısa bir disk deposu; ek konteyner, port ve parola yok.                                                   | **Bunu seçtim.**        |

## Çözüm: bağımlılığı tamamen kaldırmak

Alternatifleri karşılaştırırken asıl soruyu geç sorduğumu fark ettim. Benim gerçekten bir nesne deposuna ihtiyacım var mıydı?

Uygulama tek sunucuda, tek süreç olarak çalışıyor; dosyalar bir kez yazılıyor, bir daha değişmiyor ve toplam boyut birkaç GB'ı geçmiyor. Bu koşullarda nesne deposu bana dosya sisteminin zaten verdiğinden fazlasını vermiyordu, buna karşılık ayrı bir konteyneri ve takip etmem gereken bir güvenlik bildirimi akışını da beraberinde getiriyordu.

Sonunda bağımlılığı başka bir ürünle değiştirmek yerine tamamen kaldırdım ve bunu yapay zeka ajanlarını orkestre ederek üç adımda yaptım:

- Aynı beş fonksiyonun arkasına, dosyaları bir Docker biriminde düz dosyalar olarak tutan küçük bir depo ekledim. Disk deposunun kendisi 300 satırdan kısa; S3 arka ucu, önbellek ve hata yönetimiyle birlikte modülün tamamı bin satır kadar.
- Mevcut S3 kodunu atmak yerine elden geçirip isteğe bağlı ikinci bir arka uç haline getirdim. Kendi S3 deposu olan bir kurum, tek bir ayarla dosyaları oraya yazdırabiliyor.
- Dosya adlarının düzenini ve veritabanındaki işaretçi kolonunu hiç değiştirmedim. Böylece veritabanı tarafında taşınacak hiçbir şey kalmadı.

Bu beş fonksiyonun altında, iki deponun da uyguladığı arayüz kabaca aşağıdaki gibi:

```python
class BlobStore(Protocol):
    def put(self, key: str, data: bytes) -> None: ...
    def get(self, key: str) -> bytes: ...
    def read_range(self, key: str, offset: int, length: int) -> bytes: ...
    def exists(self, key: str) -> bool: ...
    def delete(self, key: str) -> None: ...
```

{% include figure.liquid loading="lazy" path="assets/img/2026-11-14-minio-architecture-tr.svg" class="img-fluid w-100" width="680" height="456" alt="Önce: uygulama, beş fonksiyonluk bir S3 istemcisi üzerinden MinIO konteynerine ve onun birimine yazıyor. Sonra: uygulama aynı beş fonksiyonluk depo arayüzü üzerinden varsayılan olarak disk deposuna, isteğe bağlı olarak kurumun kendi S3 deposuna yazıyor" zoomable=true %}

<div class="caption">
    Uygulama, değişiklikten önce de sonra da aynı beş fonksiyonu kullanıyor.
</div>

"Düz dosyaya yazmak" kulağa basit gelse de, nesne deposunun sizin yerinize üstlendiği bazı ayrıntılar bu kez size kalıyor:

- **Atomik yazma:** Dosyayı önce aynı klasörde geçici bir adla yazıyorum, `fsync` ile diske indiğinden emin oluyorum, sonra tek hamlede asıl adına taşıyorum. Elektrik yarıda kesilirse ortada yarım bir dosya kalmıyor.
- **Yol güvenliği:** Depo yalnızca kendi ürettiği biçimdeki anahtarları kabul ediyor ve sembolik bağlantıları izlemiyor. Böylece hiçbir anahtar deponun klasörünün dışına çıkamıyor.
- **Anlaşılır hatalar:** Eksik dosya 404, dolu disk 507, ulaşılamayan S3 deposu 503 dönüyor. Eskiden bunların hepsi anlamsız bir 500 hatasıydı.

Tasarım incelenirken çıkan iki hata da bu ayrıntılar kadar öğreticiydi:

1. **Silme sırası.** Eski kod önce dosyayı, sonra veritabanı satırını siliyordu ve araya bir hata girerse elinizde dosyası olmayan bir kayıt kalıyordu. Sırayı tersine çevirdim; artık önce satırın silinmesi commit ediliyor, dosya ancak ondan sonra siliniyor. Arada bir hata olursa en kötü ihtimalle diskte sahipsiz bir dosya kalıyor ve bu, dosyası olmayan bir kayıttan çok daha zararsız.
2. **Gerçek bir S3 sunucusuna karşı test.** "S3 uyumlu" her sunucu aynı davranmıyor. Örneğin istemci kütüphanesinin varsayılan olarak eklediği checksum değerlerini her sunucunun kabul edeceğinin garantisi yok. Bu yüzden S3 arka ucu her değişiklikte, CI içinde gerçek bir S3 sunucusuna karşı test ediliyor ve bu davranış ayarlanabiliyor.

## Taşıma: geri dönüş yolunu açık tutarak

Yeni depo yazıldıktan sonra mevcut dosyaları taşırken tek bir ilkem vardı, o da geri dönemeyeceğim hiçbir adımı atmamaktı.

- Taşıma, elle çalıştırılan ayrı bir komut. Uygulama açılışta kendiliğinden hiçbir şey taşımıyor, eksik dosya görürse yalnızca uyarıyor ve çalıştırılacak komutu söylüyor.
- Komut önce bir dry run yapıyor ve kaç dosya olduğunu, kaç bayt kopyalanacağını ve hedefte yeterli yer olup olmadığını gösteriyor.
- Asıl çalıştırmada her dosya kopyalanıyor, hedeften geri okunuyor ve sha256 özeti kaynağınkiyle karşılaştırılıyor. Sonuçlar bir manifest dosyasına yazılıyor ve ayrı bir doğrulama komutu o manifesti yeniden denetliyor.
- Komut hiçbir şey silmiyor ve var olan bir dosyanın üzerine yazmıyor. İkinci kez çalıştırıldığında hiçbir şey kopyalamıyor.
- Hepsini önce atılabilir bir kopya kurulumda prova ettim, sonra kendi kurulumumda çalıştırdım.

Eski MinIO birimi, imaj arşivi ve geri dönüş adımları hâlâ duruyor ve en az bir sürüm boyunca da duracak.

## Ne kazandım, neyi üstlendim

Kazandıklarım:

- Kurulum artık yalnızca herkesin indirebildiği imajları indiriyor.
- Bir servis ve bir başlatma işi eksildi; iki port ve bir parola çifti ortadan kalktı.
- Kurulum paketi 85 MB küçüldü ve konteynerlerin toplam bellek sınırı 512 MB düştü.
- Pakette AGPL lisanslı bir bileşen ve güvenlik taramalarının işaretlediği bilinen bir açık kalmadı.
- Yedek, bir veritabanı dökümü ile bir `tar` dosyasından ibaret.

Üstlendiklerim:

- Atomik yazma, dolu disk ve yol güvenliği gibi dayanıklılık ayrıntıları artık benim sorumluluğumda.
- Aynı makinedeki başka araçlar için hazır bir S3 uç noktası yok.
- Mevcut kurulumlar bir kereliğine taşıma yapmak zorunda.

Uygulama birden fazla sunucuda çalışacaksa, değiştirilemez saklama zorunluysa ya da kurumun politikası nesne deposunu şart koşuyorsa bu çözüm yanlış olur ve doğru seçenek S3 arka ucudur; S3 seçeneğini de bu yüzden açık bıraktım.

## MinIO imajı inmiyorsa bugün ne yapabilirsiniz

Yazının başındaki hatalardan birini yeni aldıysanız ilk iş elinizdeki kopyayı korumak olmalı. `docker image prune` ya da `docker system prune` gibi temizlik komutlarını şimdilik çalıştırmayın, çünkü önbellekteki MinIO imajı elinizdeki son kopya olabilir. Sizin makinenizde yoksa başka bir sunucuda, CI makinesinde ya da kurumunuzun imaj deposunda kalmış olabilir. Bulduğunuz kopyayı `docker save` ile bir dosyaya alıp `docker load` ile ihtiyacınız olan makineye taşıyabilirsiniz.

Hiçbir yerde kopya yoksa eski sunucuyu bir süreliğine bir çatalla ayağa kaldırabilirsiniz. 14 Kasım 2026'da kontrol ettiğimde imaj depoları Pigsty'nin `pgsty/silo` ve Chainguard'ın `cgr.dev/chainguard/minio:latest` imajlarını oturum açmadan veriyordu. Silo, MinIO'nun disk biçimini koruduğunu söylüyor ve root kullanıcısıyla çalışıyor. Chainguard'ın imajı ise root olmayan bir kullanıcıyla çalıştığı için veri klasörünün sahibini değiştirmeniz gerekebilir. Son çare olarak, [son topluluk sürümünün notlarındaki](https://github.com/minio/minio/releases/tag/RELEASE.2025-10-15T17-29-55Z) adımlarla imajı kaynak koddan kendiniz derleyebilirsiniz.

Verilerinizi taşımadan önce birimin bir yedeğini alın ve eski sunucuyu dışarıya kapalı biçimde bu kopya üzerinde çalıştırın. Dosyaları S3 üzerinden `mc mirror` ya da `rclone copy` ile yeni yerine kopyalayabilirsiniz, ancak iki araç da varsayılan olarak nesne sürümlerini ve özel üst verileri taşımıyor. Kopyaları kaynakla karşılaştırmadan hiçbir şeyi silmeyin.

Son topluluk sürümünü kalıcı bir çözüm olarak görmeyin. Nisan 2026'da yayımlanan iki [güvenlik bildirimi](https://github.com/minio/minio/security/advisories), geçerli bir erişim anahtarını, örneğin varsayılan `minioadmin` anahtarını bilen birinin gizli anahtar olmadan nesne yazabildiğini gösteriyor. Topluluk sürümü için bu açıkların yaması yok. Bucket oluşturmak için `minio/mc` imajını kullanıyorsanız o imaj da artık inmiyor. Chainguard'ın `minio-client` imajı ya da AWS CLI aynı işi görebilir.

## MinIO alternatifleri: gerçekten bir S3 sunucusuna ihtiyacınız varsa

Birden fazla sunucunuz varsa, dosyalarınız terabaytları buluyorsa ya da kullandığınız araçlar S3 konuşan bir uç nokta bekliyorsa bir nesne deposuna ihtiyacınız var demektir. Bu durumda bence "hangisi daha hızlı" sorusundan önce "hangisi beş yıl sonra da aynı koşullarla burada olur" sorusunu sormalı, cevabını da özellik listelerinden çok projenin lisansında, yönetişiminde ve gelir modelinde aramalısınız.

Ekim 2026 sonunda baktığım adayları ve onlarda gördüklerimi aşağıya yazdım:

- **[versitygw](https://github.com/versity/versitygw)** (Apache 2.0): S3 çağrılarını bir klasöre çeviren küçük bir ağ geçidi. Nesneleriniz diskte düz dosya olarak durduğu için yarın versitygw ortadan kalksa bile dosyalarınız elinizde kalır. Tek sunucuda bir S3 uç noktası gerekiyorsa ilk bakacağım yer burası, S3 arka ucumun testlerini de zaten ona karşı çalıştırıyorum.
- **[Garage](https://garagehq.deuxfleurs.fr/)** (AGPLv3): Bir dernek tarafından geliştiriliyor ve kamu hibeleriyle finanse ediliyor. Birkaç düğümlü, coğrafi olarak dağıtık küçük kurulumlar için tasarlanmış. Kendi belgeleri tek düğümlü kurulumu üretim için önermiyor.
- **[SeaweedFS](https://github.com/seaweedfs/seaweedfs)** (Apache 2.0): Çok hızlı gelişiyor, ancak son üç ayda katkıların üçte ikisi tek bir kişiden geldi ve projenin ayrı, kapalı lisanslı bir kurumsal sürümü de var.
- **[RustFS](https://github.com/rustfs/rustfs)** (Apache 2.0): MinIO'ya en çok benzeyen yeni motor ve pek çok proje testlerinde MinIO'nun yerine onu koydu. Yalnız ilk kararlı sürümü Eylül 2026'da çıktı ve [katkı sözleşmesi](https://github.com/rustfs/rustfs/blob/main/CLA.md) şirkete katkıları başka bir lisansla dağıtma hakkı veriyor.
- **[Ceph](https://ceph.io/en/)** (LGPL): Linux Foundation çatısı altında gelişiyor ve son üç ayda iki yüzden fazla kişi katkı verdi. Gerçek ölçek için doğru cevap olsa da tek sunucu için fazla ağır. Aynı ölçekte, Apache Software Foundation çatısındaki [Apache Ozone](https://ozone.apache.org/) da var.
- **MinIO çatalları** (AGPLv3): [PGSTY Silo](https://github.com/pgsty/silo) yönetim arayüzünü geri getirdi ve güvenlik yamalarını sürdürüyor; [Chainguard](https://www.chainguard.dev/unchained/fork-yeah-were-adding-ten-new-open-source-projects-to-emeritoss) yalnızca güvenlik düzeltmesi alan bir çatalı ücretsiz bir imajla yayımlıyor.

RustFS ve SeaweedFS için bu yıl onlarca güvenlik bildirimi yayımlandı. Hızlı büyüyen ve yakından incelenen projelerde bu şaşırtıcı sayılmaz, ama hangisini seçerseniz seçin takip etmeniz gereken bir bildirim akışı olacak.

{% include figure.liquid loading="lazy" path="assets/img/2026-11-14-minio-decision-tr.svg" class="img-fluid w-100" width="680" height="525" alt="Üç soruluk karar akışı: tek sunucu ve bir kez yazılan dosyalar için düz dosyalar ve dar bir arayüz; kurumun kendi S3 deposu varsa o; yoksa ölçeğe göre versitygw, Garage ya da SeaweedFS ve büyük ölçekte Ceph" zoomable=true %}

<div class="caption">
    Karar verirken izlediğim sıra
</div>

Başka projelerin ne yaptığına da baktım ve tek bir cevap olmadığını gördüm. [GitLab](https://gitlab.com/gitlab-org/charts/gitlab/-/work_items/6281) Helm paketinden gömülü MinIO'yu çıkardı ve yerine bir şey koymadı, yani kendi S3 deponuzu getirmeniz gerekiyor. [NixOS](https://github.com/NixOS/nixpkgs/pull/492794) nesne deposu testini Garage'a taşıdı. [Apache Iceberg](https://github.com/apache/iceberg/pull/18247) testlerinde RustFS'e, [Grafana Loki](https://github.com/grafana/loki/pull/25393) örnek kurulumlarında Silo'ya, [Zalando Spilo](https://github.com/zalando/spilo/pull/1218) SeaweedFS'e geçti. [Incus](https://github.com/lxc/incus/pull/3258) ise bana benzer bir yol seçti ve MinIO'ya dayanan özelliği kendi yerleşik S3 uç noktasıyla değiştirdi. GitHub'da son haftalarda birleştirilen ve başlığında MinIO'nun değiştirildiği yazan kırk değişikliğe baktığımda da aynı dağınıklığı gördüm. Bunların on ikisi RustFS'i, on biri SeaweedFS'i, dördü Garage'ı, dördü düz diski, ikisi de versitygw'yi seçmişti. Silo, LocalStack ve S3Mock ise birer kez geçiyordu.

## Yapay zeka dönemi bu tabloyu nasıl değiştirdi

MinIO, ticari ürünü [AIStor'u](https://www.min.io/product/aistor) yapay zeka iş yükleri için tasarlanmış bir veri deposu olarak tanıtıyor ve Şubat 2025'teki bir [basın duyurusunda](https://www.newswire.ca/news-releases/minio-grows-arr-by-149-as-demand-for-ai-data-storage-skyrockets-860182236.html) yıllık yinelenen gelirinin iki yılda yüzde 149 büyüdüğünü, kârlı çalıştığını ve bu büyümenin yapay zeka talebinden geldiğini söyledi.

Şirketin kendi açıkladığı gerekçe ise yalnızca bir adım için var. Yönetim arayüzü budanırken kurucuları, topluluk sürümü için ikinci bir arayüzü sürdürmenin ciddi bir iş yükü olduğunu ve bakılmayan kodun güvenlik riski taşıdığını [söyledi](https://www.futuriom.com/articles/news/minio-faces-fallout-for-stripping-features-from-web-gui/2025/06). Sonraki adımlar için, imajların kaldırılması da dahil, şirketin [fiyat sayfasında](https://www.min.io/pricing) mühendislik odağının artık AIStor olduğunu söylemesi dışında bir gerekçe bulamadım.

Bana kalırsa para yapay zekaya aktı ve altyapı şirketleri de ürünlerini paranın aktığı yere göre yeniden konumladı. Eğitim verisini çok büyük ölçekte saklayan kurumların en değerli müşteri olduğu bir şirketin gözünde, birkaç GB dosya saklayan küçük ekiplerin kullandığı topluluk sürümü para kazandırmayan bir yük haline geliyor. Şirket kârlı olduğunu söylediğine göre bu kararı zorunluluktan çok tercihle almış görünüyor. Yapay zeka ile bu tercih arasındaki bağı ben zamanlamaya bakarak kuruyorum; MinIO böyle bir şey söylemedi ve aynı tabloyu yatırım almış bir şirketin olağan ticarileşme adımları olarak okumak da mümkün.

Bunun yanında bir ihtimal daha görüyorum. Açık kaynak kodu alıp kendi ürününe gömen, bunun üzerine büyük işler kuran, ama koda emek verenlere hiçbir pay bırakmayan şirketler hep oldu ve MinIO da bundan uzun süredir şikayetçiydi. Temmuz 2022'de, Nutanix'in nesne deposu ürününde MinIO'yu yıllarca belirtmeden kullandığını söyleyerek Nutanix'in lisansını [iptal ettiğini duyurdu](https://www.blocksandfiles.com/object/2022/07/19/minio-accuses-nutanix-of-violating-open-source-license/1617140). Nutanix 28 Temmuz'da Apache 2.0 lisansının istediği atıf ve bildirimleri eksik bıraktığı için [özür diledi](https://www.blocksandfiles.com/hci/2022/07/28/nutanix-apologizes-to-minio-for-apache-2-licence-infraction/1607943) ve yalnızca Apache 2.0 lisanslı MinIO kodu kullandığını söyledi. Mart 2023'te MinIO benzer bir suçlamayı Weka'ya yöneltti ve onun da lisansını [iptal ettiğini açıkladı](https://www.blocksandfiles.com/file/2023/03/26/we-object-minio-says-no-more-open-license-for-weka/1612500). Weka ise yalnızca Apache 2.0 lisanslı kod kullandığını, suçlamaların asılsız olduğunu ve bu lisansın geri alınamayacağını söyledi. Nutanix de aynı haberdeki açıklamasında MinIO kodunu yalnızca birkaç yardımcı işlev için kullandığını ve 2 Kasım 2022'de çıkan Objects 3.6 sürümüyle tamamen kaldırdığını belirtti.

Bu yüzden imajların erişime kapatılmasında, hazır imajları ve ikili dosyaları alıp ticari ürünlerinin içinde dağıtan şirketlerin de payı olabileceğini düşünüyorum. Bu yalnızca benim tahminim. MinIO böyle bir gerekçe söylemedi. Kaynak kod hâlâ herkese açık, yani isteyen kodu yine derleyip kullanabilir. Fakat hazır imaj ve ikili dosya olmadan bunu yapmak artık hem zahmetli hem de ayrı bir bakım yükü.

Aynı dönem benim tarafımdaki hesabı da değiştirdi, çünkü dar bir bileşeni kendim yazmanın maliyeti artık eskisi kadar yüksek değil. Bu iş için kâğıt üzerindeki tahminim dört beş odaklı gündü, fakat yapay zeka ajanlarıyla çalışarak kararın ertesi günü kodu ana dala almış ve kendi kurulumumu taşımıştım. Yine de bunu genellemek istemem, çünkü kontrollü çalışmalar küçük ve iyi tanımlı işlerde ilk sürümün [daha hızlı yazıldığını](https://arxiv.org/abs/2302.06590) gösterse de deneyimli geliştiricilerin olgun kod tabanlarında [yavaşladığını](https://arxiv.org/abs/2507.09089) bulan bir çalışma da var.

Yapay zeka asistanları da eğitildikleri dönemin bilgisini taşıyor ve araştırmalar, modellerin kütüphanelerin [kullanımdan kalkmış çağrılarını](https://arxiv.org/abs/2406.09834) önermeyi sürdürdüğünü, zaman zaman da [var olmayan paketler](https://arxiv.org/abs/2406.10279) uydurduğunu gösteriyor. Benim gözlemime göre bir asistana dosyaları nerede saklayacağınızı sorarsanız birkaç yıl önceki örnek dosyalarda en çok geçen cevabı alma ihtimaliniz yüksek ve önerilen bağımlılığın bugün hâlâ ayakta olup olmadığını kontrol etmek yine size kalıyor.

## On yıl önceki benzer bir hikaye: left-pad incident

Bu yazıyı yazmamda, [Tech Buddy](https://www.youtube.com/@TechBuddyTR) kanalının 8 Kasım'da yayımladığı "11 Satırlık işi neden başkasına bıraktık" adlı [videonun](https://www.youtube.com/watch?v=R8W8KD3PdkU) etkisi oldu. Bu tarz teknoloji hikayelerini seviyorsanız, yazılım geliştirme üzerine faydalı Türkçe videolar paylaşan bu kanala göz atmanızı tavsiye ederim.

<div class="youtube-video" data-youtube-id="R8W8KD3PdkU"><a href="https://www.youtube.com/watch?v=R8W8KD3PdkU"><img src="{{ '/assets/img/2026-11-14-video-tech-buddy.jpg' | relative_url }}" alt="Tech Buddy kanalındaki 11 Satırlık işi neden başkasına bıraktık videosunun kapak görseli" class="img-fluid rounded z-depth-1" width="1280" height="720" loading="lazy"></a></div>
<div class="caption">
    Tech Buddy, "11 Satırlık işi neden başkasına bıraktık" (YouTube, 8 Kasım 2026)
</div>

Yazılım dünyasında "left-pad incident" olarak bilinen olayda, npm'den kaldırılan küçük bir paket, ona dayanan pek çok projenin derlenmesini kısa bir süreliğine durdurdu. Mart 2016'da Kik adlı mesajlaşma şirketi, marka hakkını gerekçe göstererek geliştirici [Azer Koçulu](https://azerkoculu.com/)’dan npm'deki "kik" paketinin adını istedi. Koçulu kabul etmeyince npm, paketi şirkete devretti; Koçulu da 22 Mart'ta npm'deki bütün paketlerini kaldırdı. Aralarında bir metnin soluna boşluk ekleyen 11 satırlık left-pad de vardı ve ona doğrudan ya da dolaylı olarak bağlı olan, Babel ve React'in de bulunduğu binlerce proje bir anda derlenemez hale geldi. npm left-pad'i yaklaşık iki saat sonra geri yükledi, ardından da kurallarını değiştirdi. npm'in olayla ilgili açıklamasını [blogunda](https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm) okuyabilirsiniz.

Olayın öbür tarafını Azer Koçulu'nun kendi yazılarından okumak da mümkün. Paketleri kaldırdıktan hemen sonra yayımladığı ["I've Just Liberated My Modules"](https://azerkoculu.com/posts/i-ve-just-liberated-my-modules) yazısında, kendi izni olmadan paket adının devredilmesinin ona npm'i şirketlerin insanlardan daha güçlü olduğu özel bir alan gibi gösterdiğini anlatıyor. Sekiz yıl sonra yazdığı ["left-pad"](https://azerkoculu.com/posts/left-pad) yazısında ise kararın bir öfke anında verilmediğini yazıyor.

Bu olayla MinIO'nun hikayesi arasında on yıl var, fakat ikisinde de sorun kodu bize ulaştıran kanalda ve o kanalla ilgili verilen kararlarda başladı. Videonun başlığındaki soru da yazının sonunda kendime sorduğum ilk soruyla aynı kapıya çıkıyor.

## Açık kaynak üzerine düşündüklerim

Yaşananlar yalnızca MinIO'ya özgü de değil. Son yıllarda benzer kararları iki farklı biçimde gördük. İlki lisans değişikliğiydi; [HashiCorp](https://www.hashicorp.com/en/blog/hashicorp-adopts-business-source-license) 2023'te, [Redis](https://redis.io/blog/redis-adopts-dual-source-available-licensing/) 2024'te lisansını değiştirdi. İkincisi de dağıtımın geri çekilmesiydi. [Bitnami](https://github.com/bitnami/containers/issues/83267) 2025'te hazır imajlarını güncellenmeyen bir depoya taşıyıp güncel olanları aboneliğe bağladı, [LocalStack](https://blog.localstack.cloud/the-road-ahead-for-localstack/) da 2026'da topluluk imajını sonlandırıp deposunu arşivledi. Bu ikinci türde lisans hiç değişmiyor ve MinIO da bu türe giriyor.

Asıl farkı, kararın ardından neler olduğu belirliyor. Redis'in çatalı Valkey sekiz gün içinde [Linux Foundation çatısında](https://www.linuxfoundation.org/press/linux-foundation-launches-open-source-valkey-community) ve büyük destekçilerle kuruldu, Terraform'un çatalı OpenTofu için bu süre yaklaşık [altı hafta](https://www.linuxfoundation.org/press/announcing-opentofu) oldu. MinIO'nun çatallarının arkasında ise yalnızca birer kuruluş var.

Bazı şirketler açık kaynağı topluluk odaklı büyüme için sahipleniyor ve kodunu açtıkları bir ürün etrafında bir topluluk oluşturup onun üzerinden kurumsal müşterilerle iş birliği fırsatı yakalıyor. Cloudflare'in Şubat 2026 tarihli [blog yazısına](https://blog.cloudflare.com/vinext) göre şirket, Vercel'in geliştirdiği [Next.js'i](https://github.com/vercel/next.js) yapay zekayı yönlendiren tek bir mühendisle bir haftadan kısa sürede sıfırdan yeniden yazdı. Ortaya çıkan alternatif, Cloudflare'in kendi platformuna tek komutla yayına alınabiliyor. Cloudflare Next.js ekibine övgüyle yer verdi, ancak başka şirketlerin aynı yolla, tersine mühendislikle inceledikleri yazılımları kaynak göstermeden kendi adlarıyla piyasaya süreceğini bekliyorum. Böyle örnekler çoğalırsa şirketlerin açık kaynağa verdikleri desteği sorgulamaya başlamalarını olası buluyorum.

Bütün bunlardan kendi adıma birkaç ders çıkardım.

**Lisans yalnızca bugünkü kodu kapsıyor.** Açık kaynak lisansı size var olan kodu kullanma, değiştirme ve dağıtma hakkı veriyor. Fakat yarın yeni bir sürüm çıkacağına, hazır ikili dosyaların yayımlanacağına ya da imajın aynı adreste duracağına dair hiçbir söz vermiyor.

**Lisans size bir çıkış yolu bırakıyor.** MinIO'nun lisansı sonuna kadar AGPL olarak kaldı ve bugün güvenlik yamalarını sürdüren çatallar o lisans sayesinde var. Kapalı bir üründe aynı şey olsaydı elimde okuyabileceğim bir kod bile olmazdı.

**Kimsenin bize bir borcu yok.** MinIO yıllarca çok iyi bir yazılımı karşılıksız sundu ve bedavaya aldığım bir şeyin sonsuza kadar bedava kalmasını beklemeye hakkım yok. Bağımlılığı seçen de, onu takip etmesi gereken de bendim.

**Bir bağımlılığın dört parçası var.** Kodun yanında, o kodu size ulaştıran dağıtım kanalı, onu ayakta tutan bakım ve bütün bunlara kimin karar verdiğini belirleyen yönetişim de bağımlılığın parçası. MinIO'da kod hiç değişmedi, ama öbür üç parça birer birer ortadan kalktı.

**Projeyi kimin yönettiği önemli.** Projenin markası, deposu ve katkıların hakları tek bir şirketteyse, o şirketin öncelikleri değiştiği gün proje de değişir. Bir vakfın ya da derneğin çatısındaki projelerde bu karar tek bir elde toplanmıyor. [NATS'in](https://www.cncf.io/blog/2025/04/24/protecting-nats-and-the-integrity-of-open-source-cncfs-commitment-to-the-community/) arkasındaki şirket 2025'te lisansı değiştirmek istediğinde, proje vakfın çatısında olduğu için bunu tek başına yapamadı. Mayıs 2025'teki [uzlaşmayla](https://www.cncf.io/announcements/2025/05/01/cncf-and-synadia-align-on-securing-the-future-of-the-nats-io-project/) şirket NATS markasını Linux Foundation'a devretti, proje de Apache 2.0 lisansıyla CNCF'de kaldı.

**Dar bir arayüz işi çok kolaylaştırıyor.** Bu değişikliği bu kadar kısa sürede yapabilmemin en önemli sebeplerinden biri, uygulamanın MinIO'ya beş fonksiyon üzerinden dokunmasıydı.

**Standartlara yaslanmak daha güvenli.** S3 bir ürün olmaktan çıkıp bir protokole dönüştüğü için bugün MinIO'nun yerine koyabileceğim yarım düzine sunucu var; dosya sistemi için de durum aynı.

## Yeni bir bağımlılık eklemeden önce sorduklarım

Bu olaydan sonra bir bağımlılık eklemeden önce kendime şu soruları soruyorum:

1. Bu ihtiyacı standart kütüphaneyle ya da birkaç yüz satırla kendim karşılayabilir miyim?
2. Projeyi kim yönetiyor: tek bir şirket mi, bir vakıf ya da dernek mi?
3. Katkı sözleşmesi, proje sahibine lisansı tek başına değiştirme imkânı veriyor mu?
4. Şirket parayı nereden kazanıyor ve benim kullanım biçimim o yolun üstünde mi?
5. İmajı ya da paketi kim dağıtıyor; o adres yarın kapanırsa elimde ne kalır?
6. Kurulumum, önbelleği boş bir makinede düzenli olarak deneniyor mu?
7. Bu bağımlılığa kodun kaç yerinden dokunuyorum?
8. Verimi buradan çıkarıp başka bir yere taşıyabiliyor muyum?

Siz de benzer bir durum yaşadıysanız ya da MinIO'nun yerine başka bir yol seçtiyseniz aşağıya yorum olarak yazarsanız sevinirim. Başkalarının bu durumda hangi soruları sorduğunu merak ediyorum.
