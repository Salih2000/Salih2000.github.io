
const currentUrl = window.location.href;
const siteUrl = "https://salihkilic.net";
let updatedUrl = currentUrl.replace("https://salihkilic.net", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("tr-tur".length > 0) {
  updatedUrl = updatedUrl.replace("/tr-tur", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-hakkımda",
    title: "Hakkımda",
    section: "Navigasyon menüsü",
    handler: () => {
      window.location.href = "/tr-tur/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "Düşünce ve fikirlerimi paylaştığım blogum.",
          section: "Navigasyon menüsü",
          handler: () => {
            window.location.href = "/tr-tur/blog/";
          },
        },{id: "nav-repository",
          title: "Repository",
          description: "",
          section: "Navigasyon menüsü",
          handler: () => {
            window.location.href = "/tr-tur/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigasyon menüsü",
          handler: () => {
            window.location.href = "/tr-tur/cv/";
          },
        },{id: "post-sitemi-neden-react-js-39-ten-jekyll-39-e-taşıdım",
        
          title: "Sitemi neden React.js&#39;ten Jekyll&#39;e taşıdım",
        
        description: "React.js ile başlayan kişisel sitemi neden Jekyll/GitHub Pages&#39;e taşıdığımın hikayesi.",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2026/neden-jekyll-tasidim/";
          
        },
      },{id: "news-yeni-blogum-artık-yayında-sparkles",
          title: 'Yeni blogum artık yayında! :sparkles:',
          description: "",
          section: "Haberler",},{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Sosyal medya',
        handler: () => {
          window.open("https://www.linkedin.com/in/salih-abdullah-kilic", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Sosyal medya',
        handler: () => {
          window.open("https://github.com/Salih2000", "_blank");
        },
      },{
        id: 'social-email',
        title: 'E-posta gönder',
        section: 'Sosyal medya',
        handler: () => {
          window.open("mailto:%73%61%6C%69%68%61%62%64%75%6C%6C%61%68%6B%69%6C%69%63@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-medium',
        title: 'Medium',
        section: 'Sosyal medya',
        handler: () => {
          window.open("https://medium.com/@salihabdullahkilic", "_blank");
        },
      },{
        id: 'social-cv',
        title: 'CV',
        section: 'Sosyal medya',
        handler: () => {
          window.open("/assets/pdf/tr-tur//assets/pdf/[LANG]/resume.pdf", "_blank");
        },
      },{
        id: 'social-youtube',
        title: 'YouTube',
        section: 'Sosyal medya',
        handler: () => {
          window.open("https://youtube.com/@salihabdullahkilic", "_blank");
        },
      },{
          id: 'lang-en-us',
          title: 'en-us',
          section: 'Diller',
          handler: () => {
            window.location.href = "" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: 'Temayı aydınlık yap',
      description: 'Site temasını Aydınlık olarak değiştir',
      section: 'Tema',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Temayı karanlık yap',
      description: 'Site temasını Karanlık olarak değiştir',
      section: 'Tema',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Sistem varsayılan temasını kullan',
      description: 'Site temasını sistem varsayılanına göre değiştir',
      section: 'Tema',
      handler: () => {
        setThemeSetting("system");
      },
    },];
