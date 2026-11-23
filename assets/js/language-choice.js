// Picks the language version of a page from the visitor's browser language.
//
// - A visitor whose browser's primary language is Turkish is sent from an English page to its Turkish twin,
//   unless they chose English with the language toggle in the navigation bar, or the address points at a part of the
//   page (#...), such as a passage shared from the bar in _includes/selection_share.liquid.
// - Whenever the page is in another language than the browser, a short note in the browser's language offers the twin:
//   an English note on Turkish pages, and a Turkish note on English pages for a Turkish browser that stayed in English.
//   "No, thanks" shrinks the note to a small round "EN" or "TR" button, which later pages and later visits show too,
//   so the visitor is not asked again; clicking that button brings the note back. On an English page "Hayır,
//   teşekkürler" also counts as choosing English, so that the next English page does not switch to Turkish.
// - A browser whose first language is not Turkish but which lists Turkish further down, or whose region is Turkey
//   (such as "en-TR"), is not sent anywhere; it gets the Turkish note on English pages, so the visitor learns that a
//   Turkish version exists. Safari on the iPhone usually reports a single language, so it is not always caught.
// - Azerbaijani (az, az-AZ, az-Latn-AZ, anywhere in the list) counts the same way: Azerbaijani speakers read Turkish
//   easily, so they get the Turkish note on English pages too, but are never sent to Turkish automatically.
//
// Turkish pages live under /tr-tur/ and every page has a twin at the mapped path. The version of the current page
// is read from the path: GitHub Pages serves the English 404 page for every missing address, Turkish ones included.
(function () {
  "use strict";

  var TR_PREFIX = "/tr-tur";
  var CHOICE_KEY = "site-language-choice"; // "en-us" or "tr-tur", set by the toggle or by a note
  var NOTE_SMALL_KEY = "site-language-note-dismissed"; // "1" after "No, thanks": show the small box instead of the full note
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
  var browserLanguages = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]).map(function (l) {
    return String(l || "").toLowerCase();
  });
  function isTurkish(l) {
    return l === "tr" || l.indexOf("tr-") === 0;
  }
  function isAzerbaijani(l) {
    return l === "az" || l.indexOf("az-") === 0;
  }
  var browserTurkish = isTurkish(browserLanguages[0]);
  // Turkish further down the list, a Turkish region on any language, or Azerbaijani: the visitor can read the
  // Turkish version too.
  var browserKnowsTurkish = browserLanguages.some(function (l) {
    return isTurkish(l) || /-tr$/.test(l) || isAzerbaijani(l);
  });
  var choseEnglish = local ? local.getItem(CHOICE_KEY) === "en-us" : false;
  var choseTurkish = local ? local.getItem(CHOICE_KEY) === "tr-tur" : false;

  // An address that points at a part of this page keeps the visitor here: the twin's headings have other ids, and a
  // passage link's text (#id:~:text=...) only matches this language. Browsers hide the ":~:text=" part from scripts but
  // keep the id before it in location.hash; Chromium also shows the whole address in the navigation entry.
  function pointsIntoPage() {
    if (window.location.hash) return true;
    try {
      var entry = window.performance && performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
      return !!entry && String(entry.name).indexOf(":~:") !== -1;
    } catch (e) {
      return false;
    }
  }

  if (!onTurkishPage && browserTurkish && !choseEnglish && local && session && !pointsIntoPage()) {
    // Without storage a later choice of English could not be remembered, so the visitor would be sent back every time.
    var last = (session.getItem(LAST_REDIRECT_KEY) || "").split(" ");
    var now = Date.now();
    if (!(last[1] === path && now - Number(last[0]) < 5000)) {
      session.setItem(LAST_REDIRECT_KEY, now + " " + path);
      window.location.replace(TR_PREFIX + path + rest);
      return;
    }
  }

  // Turkish pages offer English to every browser whose first language is not Turkish, unless the visitor chose Turkish
  // (with the toggle or with the note on an English page, so they are not offered English right after choosing
  // Turkish); English pages offer Turkish to every browser that knows Turkish.
  if (onTurkishPage ? browserTurkish || choseTurkish : !browserKnowsTurkish) return;

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
      if (local) local.removeItem(NOTE_SMALL_KEY);
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
      // Kept in localStorage so that later visits do not ask again; the tab's sessionStorage when localStorage is blocked.
      var store = local || session;
      if (store) store.setItem(NOTE_SMALL_KEY, "1");
      // Turning down the Turkish page is a choice of English (a passage link can bring a Turkish browser here unchosen).
      if (note.choice === "tr-tur" && local) local.setItem(CHOICE_KEY, "en-us");
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
    var small = (local && local.getItem(NOTE_SMALL_KEY) === "1") || (session && session.getItem(NOTE_SMALL_KEY) === "1");
    var host = document.querySelector('[role="main"]') || document.body;
    host.insertBefore(small ? smallBox() : fullBox(), host.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showNote);
  } else {
    showNote();
  }
})();
