// Picks the language version of a page from the visitor's browser language.
//
// - A visitor whose browser's primary language is Turkish is sent from an English page to its Turkish twin,
//   unless they chose English with the language toggle in the navigation bar.
// - Whenever the page is in another language than the browser, a short note in the browser's language offers the twin:
//   an English note on Turkish pages, and a Turkish note on English pages for a Turkish browser that stayed in English.
//   "No, thanks" shrinks the note to a small round "EN" or "TR" button, which later pages in the same tab show too;
//   clicking that button brings the note back.
//
// Turkish pages live under /tr-tur/ and every page has a twin at the mapped path. The version of the current page
// is read from the path: GitHub Pages serves the English 404 page for every missing address, Turkish ones included.
(function () {
  "use strict";

  var TR_PREFIX = "/tr-tur";
  var CHOICE_KEY = "site-language-choice"; // "en-us" or "tr-tur", set by the toggle or by a note
  var NOTE_SMALL_KEY = "site-language-note-dismissed"; // per tab: show the small box instead of the full note
  var LAST_REDIRECT_KEY = "site-language-last-redirect"; // per tab, a backstop against redirect loops

  if (document.querySelector('meta[name="x-not-found"]')) return;
  if (/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|lighthouse/i.test(navigator.userAgent || "")) return;

  function storage(kind) {
    try {
      var s = window[kind];
      var probe = "site-language-probe";
      s.setItem(probe, "1");
      s.removeItem(probe);
      return s;
    } catch (e) {
      return null;
    }
  }
  var local = storage("localStorage");
  var session = storage("sessionStorage");

  // Remember the language the visitor picks with the toggle in the navigation bar or with a note.
  document.addEventListener(
    "click",
    function (event) {
      var link = event.target && event.target.closest ? event.target.closest("a[data-lang-choice]") : null;
      if (link && local) local.setItem(CHOICE_KEY, link.getAttribute("data-lang-choice"));
    },
    true
  );

  var path = window.location.pathname;
  var rest = window.location.search + window.location.hash;
  var onTurkishPage = path === TR_PREFIX || path.indexOf(TR_PREFIX + "/") === 0;
  var browserLanguage = String((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
  var browserTurkish = browserLanguage === "tr" || browserLanguage.indexOf("tr-") === 0;
  var choseEnglish = local ? local.getItem(CHOICE_KEY) === "en-us" : false;

  if (!onTurkishPage && browserTurkish && !choseEnglish && local && session) {
    // Without storage a later choice of English could not be remembered, so the visitor would be sent back every time.
    var last = (session.getItem(LAST_REDIRECT_KEY) || "").split(" ");
    var now = Date.now();
    if (!(last[1] === path && now - Number(last[0]) < 5000)) {
      session.setItem(LAST_REDIRECT_KEY, now + " " + path);
      window.location.replace(TR_PREFIX + path + rest);
      return;
    }
  }

  if (onTurkishPage === browserTurkish) return;

  var note = onTurkishPage
    ? {
        lang: "en",
        label: "Language",
        text: "This page is also available in English. Would you like to read it in English?",
        go: "Read in English",
        no: "No, thanks",
        badge: "EN",
        href: (path.slice(TR_PREFIX.length) || "/") + rest,
        choice: "en-us",
      }
    : {
        lang: "tr",
        label: "Dil",
        text: "Bu sayfanın Türkçesi de var. Türkçe okumak ister misiniz?",
        go: "Türkçe oku",
        no: "Hayır, teşekkürler",
        badge: "TR",
        href: TR_PREFIX + path + rest,
        choice: "tr-tur",
      };

  function frame(extraClass) {
    var box = document.createElement("div");
    box.className = "lang-note" + (extraClass ? " " + extraClass : "");
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", note.label);
    box.setAttribute("lang", note.lang);
    return box;
  }

  function goLink() {
    var go = document.createElement("a");
    go.href = note.href;
    go.setAttribute("data-lang-choice", note.choice);
    go.setAttribute("hreflang", note.choice === "en-us" ? "en" : "tr");
    go.textContent = note.go;
    return go;
  }

  // After "No, thanks" the note shrinks to a small round button ("EN" or "TR"); clicking it brings the note back.
  function smallBox() {
    var box = frame("lang-note-small");
    var badge = document.createElement("button");
    badge.type = "button";
    badge.textContent = note.badge;
    badge.setAttribute("aria-label", note.text);
    badge.title = note.text;
    badge.addEventListener("click", function () {
      if (session) session.removeItem(NOTE_SMALL_KEY);
      box.parentNode.replaceChild(fullBox(), box);
    });
    box.appendChild(badge);
    return box;
  }

  function fullBox() {
    var box = frame("");
    var text = document.createElement("p");
    text.textContent = note.text;
    var actions = document.createElement("div");
    actions.className = "lang-note-actions";
    var no = document.createElement("button");
    no.type = "button";
    no.textContent = note.no;
    no.addEventListener("click", function () {
      if (session) session.setItem(NOTE_SMALL_KEY, "1");
      box.parentNode.replaceChild(smallBox(), box);
    });
    actions.appendChild(goLink());
    actions.appendChild(no);
    box.appendChild(text);
    box.appendChild(actions);
    return box;
  }

  function showNote() {
    if (document.querySelector(".lang-note")) return;
    var style = document.createElement("style");
    style.textContent =
      ".lang-note{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem 1rem;margin:0 0 1.5rem;" +
      "padding:.75rem 1rem;border:1px solid var(--global-divider-color);border-left:4px solid var(--global-theme-color);border-radius:6px;" +
      "background:var(--global-card-bg-color);color:var(--global-text-color);font-size:.95rem;line-height:1.4}" +
      ".lang-note p{margin:0;flex:1 1 16rem}" +
      ".lang-note-actions{display:flex;flex-wrap:wrap;gap:.5rem}" +
      ".lang-note-actions a,.lang-note-actions button{padding:.35rem .85rem;border-radius:4px;font-size:.9rem;line-height:1.4;cursor:pointer}" +
      ".lang-note-actions a{background:var(--global-theme-color);color:var(--global-bg-color)!important;font-weight:600;text-decoration:none}" +
      ".lang-note-actions button{border:1px solid var(--global-divider-color);background:transparent;color:var(--global-text-color)}" +
      ".lang-note.lang-note-small{justify-content:flex-end;padding:0;border:0;background:transparent;margin:0 0 1rem}" +
      ".lang-note-small button{width:2.25rem;height:2.25rem;padding:0;border:1px solid var(--global-theme-color);border-radius:50%;" +
      "background:var(--global-card-bg-color);color:var(--global-theme-color);font-size:.8rem;font-weight:700;line-height:1;cursor:pointer}" +
      ".lang-note-small button:hover{background:var(--global-theme-color);color:var(--global-bg-color)}";
    document.head.appendChild(style);
    var small = session && session.getItem(NOTE_SMALL_KEY) === "1";
    var host = document.querySelector('[role="main"]') || document.body;
    host.insertBefore(small ? smallBox() : fullBox(), host.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showNote);
  } else {
    showNote();
  }
})();
