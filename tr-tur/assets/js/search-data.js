
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
          description: "`_data/repositories.yml` dosyasını düzenleyip `github_users` ve `github_repos` listelerini kendi GitHub profilini ve repository&#39;lerini içerecek şekilde değiştir.",
          section: "Navigasyon menüsü",
          handler: () => {
            window.location.href = "/tr-tur/repositories/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Özgeçmişimin tamamını ve tüm projelerimin detaylı bilgilerini görmek isterseniz, Hakkımda sayfamda yer alan e-posta adresim veya sosyal medya hesaplarım üzerinden benimle iletişime geçmekten çekinmeyin.",
          section: "Navigasyon menüsü",
          handler: () => {
            window.location.href = "/tr-tur/cv/";
          },
        },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "",handler: () => {
              window.location.href = "/tr-tur/books/the_godfather/";
            },},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projeler",handler: () => {
              window.location.href = "/tr-tur/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projeler",handler: () => {
              window.location.href = "/tr-tur/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projeler",handler: () => {
              window.location.href = "/tr-tur/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projeler",handler: () => {
              window.location.href = "/tr-tur/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projeler",handler: () => {
              window.location.href = "/tr-tur/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projeler",handler: () => {
              window.location.href = "/tr-tur/projects/6_project/";
            },},{
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
