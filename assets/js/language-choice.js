// Picks the language version of a page from the visitor's browser language and remembers the visitor's own choice.
//
// - A visitor whose preferred language is Turkish is sent from an English page to its Turkish twin.
// - A visitor whose preferred language is anything else gets a short note in English on a Turkish page,
//   with a link to the English twin. They are not redirected.
// - The preferred language is the visitor's own choice, made with the language toggle in the navigation bar
//   or with the note, and otherwise the primary language of the browser.
//
// Turkish pages live under /tr-tur/ and every page has a twin at the mapped path. The version of the current page
// is read from the path: GitHub Pages serves the English 404 page for every missing address, Turkish ones included.
(function () {
  "use strict";

  var TR_PREFIX = "/tr-tur";
  var CHOICE_KEY = "site-language-choice"; // "en-us" or "tr-tur"
  var NOTE_DISMISSED_KEY = "site-language-note-dismissed"; // per tab
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

  // Remember the language the visitor picks with the toggle in the navigation bar or with the note.
  document.addEventListener(
    "click",
    function (event) {
      var link = event.target && event.target.closest ? event.target.closest("a[data-lang-choice]") : null;
      if (link && local) local.setItem(CHOICE_KEY, link.getAttribute("data-lang-choice"));
    },
    true
  );

  var path = window.location.pathname;
  var onTurkishPage = path === TR_PREFIX || path.indexOf(TR_PREFIX + "/") === 0;
  var browserLanguage = String((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
  var browserTurkish = browserLanguage === "tr" || browserLanguage.indexOf("tr-") === 0;
  var choice = local ? local.getItem(CHOICE_KEY) : null;
  var preferred = choice === "en-us" || choice === "tr-tur" ? choice : browserTurkish ? "tr-tur" : "en-us";

  if (!onTurkishPage && preferred === "tr-tur") {
    // Without storage a later choice of English could not be remembered, so the visitor would be sent back every time.
    if (!local || !session) return;
    var target = TR_PREFIX + path + window.location.search + window.location.hash;
    var last = session.getItem(LAST_REDIRECT_KEY);
    var now = Date.now();
    if (last) {
      var parts = last.split(" ");
      if (parts[1] === path && now - Number(parts[0]) < 5000) return;
    }
    session.setItem(LAST_REDIRECT_KEY, now + " " + path);
    window.location.replace(target);
    return;
  }

  if (onTurkishPage && preferred === "en-us" && !(session && session.getItem(NOTE_DISMISSED_KEY))) {
    var englishPath = path.slice(TR_PREFIX.length) || "/";
    var englishUrl = englishPath + window.location.search + window.location.hash;

    var showNote = function () {
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
        ".lang-note-actions button{border:1px solid var(--global-divider-color);background:transparent;color:var(--global-text-color)}";
      document.head.appendChild(style);

      var note = document.createElement("div");
      note.className = "lang-note";
      note.setAttribute("role", "region");
      note.setAttribute("aria-label", "Language");
      note.setAttribute("lang", "en");

      var text = document.createElement("p");
      text.textContent = "This page is also available in English. Would you like to read it in English?";

      var actions = document.createElement("div");
      actions.className = "lang-note-actions";

      var accept = document.createElement("a");
      accept.href = englishUrl;
      accept.setAttribute("data-lang-choice", "en-us");
      accept.setAttribute("hreflang", "en");
      accept.textContent = "Read in English";

      var dismiss = document.createElement("button");
      dismiss.type = "button";
      dismiss.textContent = "No, thanks";
      dismiss.addEventListener("click", function () {
        if (session) session.setItem(NOTE_DISMISSED_KEY, "1");
        note.parentNode.removeChild(note);
      });

      actions.appendChild(accept);
      actions.appendChild(dismiss);
      note.appendChild(text);
      note.appendChild(actions);

      var host = document.querySelector('[role="main"]') || document.body;
      host.insertBefore(note, host.firstChild);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showNote);
    } else {
      showNote();
    }
  }
})();
