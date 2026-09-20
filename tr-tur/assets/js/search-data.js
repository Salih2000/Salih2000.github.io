
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
        },{id: "post-plotly-js-içeren-bir-yazı",
        
          title: "plotly.js içeren bir yazı",
        
        description: "this is what included plotly.js code could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2025/plotly/";
          
        },
      },{id: "post-resim-galerisi-içeren-bir-yazı",
        
          title: "resim galerisi içeren bir yazı",
        
        description: "this is what included image galleries could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/photo-gallery/";
          
        },
      },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Yazılar",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-a-post-with-tabs",
        
          title: "a post with tabs",
        
        description: "this is what included tabs in a post could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/tabs/";
          
        },
      },{id: "post-a-post-with-typograms",
        
          title: "a post with typograms",
        
        description: "this is what included typograms code could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/typograms/";
          
        },
      },{id: "post-a-post-that-can-be-cited",
        
          title: "a post that can be cited",
        
        description: "this is what a post that can be cited looks like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/post-citation/";
          
        },
      },{id: "post-a-post-with-pseudo-code",
        
          title: "a post with pseudo code",
        
        description: "this is what included pseudo code could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/pseudocode/";
          
        },
      },{id: "post-a-post-with-code-diff",
        
          title: "a post with code diff",
        
        description: "this is how you can display code diffs",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/code-diff/";
          
        },
      },{id: "post-a-post-with-advanced-image-components",
        
          title: "a post with advanced image components",
        
        description: "this is what advanced image components could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/advanced-images/";
          
        },
      },{id: "post-a-post-with-vega-lite",
        
          title: "a post with vega lite",
        
        description: "this is what included vega lite code could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/vega-lite/";
          
        },
      },{id: "post-a-post-with-geojson",
        
          title: "a post with geojson",
        
        description: "this is what included geojson code could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/geojson-map/";
          
        },
      },{id: "post-a-post-with-echarts",
        
          title: "a post with echarts",
        
        description: "this is what included echarts code could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/echarts/";
          
        },
      },{id: "post-a-post-with-chart-js",
        
          title: "a post with chart.js",
        
        description: "this is what included chart.js code could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2024/chartjs/";
          
        },
      },{id: "post-a-post-with-tikzjax",
        
          title: "a post with TikZJax",
        
        description: "this is what included TikZ code could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/tikzjax/";
          
        },
      },{id: "post-a-post-with-bibliography",
        
          title: "a post with bibliography",
        
        description: "an example of a blog post with bibliography",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/post-bibliography/";
          
        },
      },{id: "post-a-post-with-jupyter-notebook",
        
          title: "a post with jupyter notebook",
        
        description: "an example of a blog post with jupyter notebook",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/jupyter-notebook/";
          
        },
      },{id: "post-a-post-with-custom-blockquotes",
        
          title: "a post with custom blockquotes",
        
        description: "an example of a blog post with custom blockquotes",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/custom-blockquotes/";
          
        },
      },{id: "post-a-post-with-table-of-contents-on-a-sidebar",
        
          title: "a post with table of contents on a sidebar",
        
        description: "an example of a blog post with table of contents on a sidebar",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/sidebar-table-of-contents/";
          
        },
      },{id: "post-a-post-with-audios",
        
          title: "a post with audios",
        
        description: "this is what included audios could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/audios/";
          
        },
      },{id: "post-a-post-with-videos",
        
          title: "a post with videos",
        
        description: "this is what included videos could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/videos/";
          
        },
      },{id: "post-displaying-beautiful-tables-with-bootstrap-tables",
        
          title: "displaying beautiful tables with Bootstrap Tables",
        
        description: "an example of how to use Bootstrap Tables",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/tables/";
          
        },
      },{id: "post-a-post-with-table-of-contents",
        
          title: "a post with table of contents",
        
        description: "an example of a blog post with table of contents",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2023/table-of-contents/";
          
        },
      },{id: "post-a-post-with-giscus-comments",
        
          title: "a post with giscus comments",
        
        description: "an example of a blog post with giscus comments",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2022/giscus-comments/";
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Yazılar",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "post-a-post-with-redirect",
        
          title: "a post with redirect",
        
        description: "you can also redirect to assets like pdf",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/assets/pdf/en-us/example_pdf.pdf";
          
        },
      },{id: "post-a-post-with-diagrams",
        
          title: "a post with diagrams",
        
        description: "an example of a blog post with diagrams",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2021/diagrams/";
          
        },
      },{id: "post-a-post-with-twitter",
        
          title: "a post with twitter",
        
        description: "an example of a blog post with twitter",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2020/twitter/";
          
        },
      },{id: "post-a-distill-style-blog-post",
        
          title: "a distill-style blog post",
        
        description: "an example of a distill-style blog post and main elements",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2018/distill/";
          
        },
      },{id: "post-a-post-with-disqus-comments",
        
          title: "a post with disqus comments",
        
        description: "an example of a blog post with disqus comments",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2015/disqus-comments/";
          
        },
      },{id: "post-a-post-with-math",
        
          title: "a post with math",
        
        description: "an example of a blog post with some math",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2015/math/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2015/code/";
          
        },
      },{id: "post-a-post-with-images",
        
          title: "a post with images",
        
        description: "this is what included images could look like",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2015/images/";
          
        },
      },{id: "post-a-post-with-formatting-and-links",
        
          title: "a post with formatting and links",
        
        description: "march &amp; april, looking forward to summer",
        section: "Yazılar",
        handler: () => {
          
            window.location.href = "/tr-tur/blog/2015/formatting-and-links/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "",handler: () => {
              window.location.href = "/tr-tur/books/the_godfather/";
            },},{id: "news-basit-satır-içi-bir-duyuru",
          title: 'Basit, satır içi bir duyuru.',
          description: "",
          section: "Haberler",},{id: "news-detaylı-uzun-bir-duyuru",
          title: 'Detaylı, uzun bir duyuru',
          description: "",
          section: "Haberler",handler: () => {
              window.location.href = "/tr-tur/news/announcement_2/";
            },},{id: "news-markdown-emojili-basit-satır-içi-bir-duyuru-sparkles-smile",
          title: 'Markdown emojili basit, satır içi bir duyuru! :sparkles: :smile:',
          description: "",
          section: "Haberler",},{id: "projects-project-1",
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
