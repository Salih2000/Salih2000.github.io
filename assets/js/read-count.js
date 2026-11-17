// Read count of a blog post, shown in the post header (markup in _includes/read_count.liquid).
//
// GoatCounter keeps the numbers. A browser adds one read to a post the first time it stays on the post for 10 seconds
// with the tab in view, and remembers that in localStorage, so reloads and later visits add nothing. GoatCounter itself
// also drops a second hit on the same post from the same IP address and browser within 8 hours, and its count.js skips
// bots, pre-rendered pages, frames, local addresses and browsers that once opened a page with #toggle-goatcounter.
// Only the site's own address adds reads; a local preview or a copy of the site just shows the number.
//
// GoatCounter caches the number it hands out for up to four hours, so a new read shows up later. When the number
// cannot be fetched (a blocker, an outage) or no one has read the post yet, the count stays hidden.
(function () {
  "use strict";

  var box = document.querySelector("[data-read-count]");
  if (!box) return;

  var DWELL_MS = 10000;
  var site = box.getAttribute("data-goatcounter").replace(/\/+$/, "");
  var path = box.getAttribute("data-path");
  var storageKey = "read-count:" + path;

  function alreadyCounted() {
    try {
      return window.localStorage.getItem(storageKey) !== null;
    } catch (e) {
      // Without storage, GoatCounter's own 8-hour check is what keeps reloads out.
      return false;
    }
  }

  function rememberCounted() {
    try {
      window.localStorage.setItem(storageKey, new Date().toISOString());
    } catch (e) {}
  }

  function formatNumber(n) {
    try {
      return n.toLocaleString(document.documentElement.lang || undefined);
    } catch (e) {
      return String(n);
    }
  }

  function showCount() {
    if (!window.fetch) return;
    fetch(site + "/counter/" + encodeURIComponent(path) + ".json", { credentials: "omit" })
      .then(function (response) {
        // 404 means no one has read the post yet.
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        // GoatCounter sends the number with thousands separators, e.g. "1 234".
        var n = parseInt(String(data.count).replace(/\D/g, ""), 10);
        if (!(n > 0)) return;
        box.querySelector("[data-read-count-number]").textContent = formatNumber(n);
        box.querySelector("[data-read-count-label]").textContent = box.getAttribute(n === 1 ? "data-label-one" : "data-label-other");
        box.hidden = false;
      })
      .catch(function () {});
  }

  function countRead(triesLeft) {
    var gc = window.goatcounter;
    if (!gc || typeof gc.count !== "function" || typeof gc.filter !== "function") {
      // count.js may still be loading. If a blocker stopped it, give up quietly; the next visit tries again.
      if (triesLeft > 0) {
        setTimeout(function () {
          countRead(triesLeft - 1);
        }, 1000);
      }
      return;
    }
    if (alreadyCounted() || gc.filter()) return;
    gc.count({ path: path, title: document.title, event: false });
    rememberCounted();
  }

  function countAfterDwell() {
    var left = DWELL_MS;
    var startedAt = 0;
    var timer = null;

    function start() {
      if (timer || document.visibilityState !== "visible") return;
      startedAt = Date.now();
      timer = setTimeout(function () {
        document.removeEventListener("visibilitychange", onVisibilityChange);
        countRead(10);
      }, left);
    }

    function pause() {
      if (!timer) return;
      clearTimeout(timer);
      timer = null;
      left -= Date.now() - startedAt;
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") start();
      else pause();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    start();
  }

  showCount();
  if (location.hostname === box.getAttribute("data-host") && !alreadyCounted()) countAfterDwell();
})();
