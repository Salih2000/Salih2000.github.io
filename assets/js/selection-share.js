// Sharing a passage of a post (the bar in _includes/selection_share.liquid).
//
// Selecting at least two words of the post shows a small bar next to the selection: LinkedIn, X, WhatsApp, a link to
// the passage and, where the browser has one, the system share sheet. While the bar's data-right-click is "true", a
// right click on the selected text opens the bar at the pointer in place of the browser's own menu.
//
// The link to the passage carries a text fragment (#id:~:text=...): Chrome, Edge, Safari and Firefox open the post at
// the passage and highlight it. A browser takes the first match on the whole page, so every term is checked against
// the text of the whole page (navigation, title, contents sidebar, boxes) and gets words from before or after the
// selection until it matches only once. The id before ":~:" is the heading above the passage, or the post's text when
// no heading comes before it: a browser lands there when an edit has changed the text since, and language-choice.js
// sees it in location.hash, which browsers keep while they hide the ":~:text=" part from scripts.
//
// LinkedIn's share address takes no text, so its button copies the selected text first and then offers LinkedIn.
(function () {
  "use strict";

  var bar = document.querySelector(".selection-share");
  var content = document.getElementById("markdown-content");
  if (!bar || !content || !window.getSelection || !window.Map || !document.createTreeWalker) return;
  document.body.appendChild(bar);

  var buttons = bar.querySelector(".selection-share-buttons");
  var message = bar.querySelector(".selection-share-message");
  var go = bar.querySelector(".selection-share-go");
  var xLink = bar.querySelector('[data-share="x"]');
  var whatsappLink = bar.querySelector('[data-share="whatsapp"]');
  var nativeButton = bar.querySelector('[data-share="native"]');
  var base = bar.getAttribute("data-url");
  var title = bar.getAttribute("data-title");

  var MIN_WORDS = 2;
  var EXACT_WORDS = 10; // up to this many words of one paragraph go into the link whole
  var EDGE_WORDS = 3; // a longer passage is named by its first and last words, at least this many
  var MAX_EDGE_WORDS = 10;
  var CONTEXT_WORDS = 5; // words before or after the selection that may be added to make a term unique
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEMPLATE: 1, TEXTAREA: 1, SELECT: 1 };
  var APOSTROPHES = "'’";
  // X, WhatsApp and chat apps take a final ".", "_" or "~" for the end of the sentence and leave it out of the link,
  // so the term that ends the link may not end in one.
  var TRAILING = /[._~]+$/;

  var current = null; // what the bar shares: {range, quote, link, point}
  var timer = 0;
  var hideTimer = 0;
  var mouseDown = false;
  var blockCache = null;
  var foldCache = {};
  var pageCache = null;
  var watching = false;

  if (navigator.share) nativeButton.hidden = false;

  // The page text is built once and again only after the page changes (contents sidebar, language note, embeds).
  if (window.MutationObserver) {
    new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        if (!bar.contains(records[i].target)) {
          pageCache = null;
          return;
        }
      }
    }).observe(document.body, { childList: true, characterData: true, subtree: true });
    watching = true;
  }

  // ---- Text as the browser searches it -------------------------------------------------------------------------

  function isBlock(el) {
    var known = blockCache.get(el);
    if (known !== undefined) return known;
    var display = window.getComputedStyle(el).display;
    known = display !== "contents" && display.indexOf("inline") !== 0;
    blockCache.set(el, known);
    return known;
  }

  function blockOf(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    while (el && el !== document.body && !isBlock(el)) el = el.parentElement;
    return el;
  }

  // Text nodes and <br> elements under root in document order, without scripts, styles, form fields and the bar.
  function walker(root) {
    return document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (node.nodeType === 3) return NodeFilter.FILTER_ACCEPT;
        if (SKIP[node.tagName] || node === bar) return NodeFilter.FILTER_REJECT;
        return node.tagName === "BR" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    });
  }

  function isSpace(c) {
    return /\s/.test(c);
  }

  function isWordChar(c) {
    return !!c && (c.toLowerCase() !== c.toUpperCase() || (c >= "0" && c <= "9"));
  }

  // Whether position i of text lies inside a word ("MinIO'nun", "3.6"), where a link term may not begin or end.
  function insideWord(text, i) {
    var before = text.charAt(i - 1);
    var after = text.charAt(i);
    if (isWordChar(before) && isWordChar(after)) return true;
    if (APOSTROPHES.indexOf(before) !== -1 && isWordChar(text.charAt(i - 2)) && isWordChar(after)) return true;
    if (APOSTROPHES.indexOf(after) !== -1 && isWordChar(before) && isWordChar(text.charAt(i + 1))) return true;
    var digits = /[0-9]/;
    if ((before === "." || before === ",") && digits.test(text.charAt(i - 2)) && digits.test(after)) return true;
    if ((after === "." || after === ",") && digits.test(before) && digits.test(text.charAt(i + 1))) return true;
    return false;
  }

  // Comparison form of a character: lower case without accents, "ı" and "İ" as "i", typographic quotes as plain ones.
  // It keeps the length, and it treats more text as equal than a browser does, which only makes the terms longer.
  function foldChar(c) {
    var f = foldCache[c];
    if (f !== undefined) return f;
    f = c.normalize ? c.normalize("NFD").charAt(0) : c;
    f = f.toLowerCase();
    if (f.length !== 1) f = c;
    if (f === "ı") f = "i";
    if (APOSTROPHES.indexOf(f) !== -1 || f === "‘" || f === "ʼ") f = "'";
    if ("“”„«»".indexOf(f) !== -1) f = '"';
    if (isSpace(f)) f = " ";
    foldCache[c] = f;
    return f;
  }

  function fold(text) {
    var out = [];
    for (var i = 0; i < text.length; i++) out.push(foldChar(text.charAt(i)));
    return out.join("");
  }

  // The text of the whole page in comparison form. Block boundaries become spaces, so a term may match across them
  // here although a browser would not let it: that can only count too many matches, never too few.
  function pageText() {
    if (pageCache !== null && watching) return pageCache;
    var parts = [];
    var lastBlock = null;
    var walk = walker(document.body);
    for (var node = walk.nextNode(); node; node = walk.nextNode()) {
      if (node.nodeType !== 3) {
        parts.push(" ");
        continue;
      }
      var block = blockOf(node);
      if (block !== lastBlock) {
        parts.push(" ");
        lastBlock = block;
      }
      parts.push(node.data);
    }
    pageCache = fold(parts.join("").replace(/\s+/g, " "));
    return pageCache;
  }

  // How often term occurs in the page text as whole words, counting up to two.
  function matches(hay, term) {
    var needle = fold(term);
    if (!needle) return 0;
    var wordStart = isWordChar(needle.charAt(0));
    var wordEnd = isWordChar(needle.charAt(needle.length - 1));
    var count = 0;
    var from = 0;
    for (;;) {
      var i = hay.indexOf(needle, from);
      if (i === -1) return count;
      if (!(wordStart && isWordChar(hay.charAt(i - 1))) && !(wordEnd && isWordChar(hay.charAt(i + needle.length)))) {
        count++;
        if (count === 2) return count;
      }
      from = i + 1;
    }
  }

  // Whether a term with words before or after it matches once. Browsers also accept the two parts glued together
  // ("Chain-,guard’ın" finds "Chainguard’ın"), so both joins count.
  function joinedOnce(hay, left, right) {
    return matches(hay, left + " " + right) + matches(hay, left + right) === 1;
  }

  // The text from the start of the block where the range starts to the end of the block where it ends, as runs that
  // no block boundary or <br> interrupts, whitespace collapsed, with the positions of the range's start and end:
  // {segments: ["...", ...], start: {segment, offset}, end: {segment, offset}}.
  function segmentsOf(range) {
    var first = null;
    var last = null;
    var scan = walker(content);
    for (var n = scan.nextNode(); n; n = scan.nextNode()) {
      if (n.nodeType !== 3) continue;
      if (range.intersectsNode(n)) {
        if (!first) first = n;
        last = n;
      } else if (first) {
        break;
      }
    }
    if (!first) return null;
    var endBlock = blockOf(last);

    var segments = [];
    var text = null;
    var lastBlock = null;
    var start = null;
    var end = null;
    var walk = walker(content);
    walk.currentNode = blockOf(first);

    function here() {
      return { segment: segments.length, offset: text.length };
    }

    for (var node = walk.nextNode(); node; node = walk.nextNode()) {
      if (!endBlock.contains(node) && endBlock.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) break;
      if (node.nodeType !== 3) {
        if (text !== null) segments.push(text);
        text = null;
        continue;
      }
      var block = blockOf(node);
      if (text === null || block !== lastBlock) {
        if (text !== null) segments.push(text);
        text = "";
        lastBlock = block;
      }
      var inRange = range.intersectsNode(node);
      var data = node.data;
      if (!start && inRange && node !== range.startContainer) start = here();
      for (var i = 0; i <= data.length; i++) {
        if (node === range.startContainer && i === range.startOffset) start = here();
        if (node === range.endContainer && i === range.endOffset) end = here();
        if (i === data.length) break;
        var c = data.charAt(i);
        if (!isSpace(c)) text += c;
        else if (text && text.charAt(text.length - 1) !== " ") text += " ";
      }
      if (inRange && node !== range.endContainer && range.endContainer.nodeType !== 3) end = here();
    }
    if (text !== null) segments.push(text);
    return { segments: segments, start: start, end: end };
  }

  function words(text) {
    return text.split(" ").filter(Boolean);
  }

  // Percent-encodes a term; "-", "," and "&" are part of the text directive's syntax.
  function encodeTerm(term) {
    return encodeURIComponent(term).replace(/[-!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

  // The text directive for the selected pieces (their own runs of text, in order), or null when no term is unique.
  function textDirective(pieces, before, after, hay) {
    var beforeWords = words(before);
    var afterWords = words(after);

    function unique(term) {
      return matches(hay, term) === 1;
    }
    function prefixFor(term) {
      for (var k = 1; k <= Math.min(CONTEXT_WORDS, beforeWords.length); k++) {
        var prefix = beforeWords.slice(-k).join(" ");
        if (joinedOnce(hay, prefix, term)) return prefix;
      }
      return null;
    }
    // The suffix ends the link, so it loses a final period too.
    function suffixFor(term) {
      for (var k = 1; k <= Math.min(CONTEXT_WORDS, afterWords.length); k++) {
        var suffix = afterWords.slice(0, k).join(" ").replace(TRAILING, "");
        if (suffix && joinedOnce(hay, term, suffix)) return suffix;
      }
      return null;
    }

    var single = pieces.length === 1;
    var first = words(pieces[0]);
    var last = words(pieces[pieces.length - 1]);

    if (single && first.length <= EXACT_WORDS) {
      var whole = pieces[0].replace(TRAILING, "");
      if (!whole) return null;
      if (unique(whole)) return encodeTerm(whole);
      var prefix = prefixFor(whole);
      if (prefix) return encodeTerm(prefix) + "-," + encodeTerm(whole);
      // A suffix has to follow the term directly, which a dropped final period would prevent.
      var suffix = whole === pieces[0] ? suffixFor(whole) : null;
      if (suffix) return encodeTerm(whole) + ",-" + encodeTerm(suffix);
      return null;
    }

    // A longer passage: its first and last words. In a single paragraph they may not overlap.
    var startMax = single ? first.length - EDGE_WORDS : first.length;
    var startTerm = null;
    var startPrefix = "";
    for (var k = Math.min(EDGE_WORDS, startMax); k <= Math.min(MAX_EDGE_WORDS, startMax); k++) {
      var candidate = first.slice(0, k).join(" ");
      if (unique(candidate)) {
        startTerm = candidate;
        break;
      }
    }
    if (!startTerm) {
      startTerm = first.slice(0, Math.min(EDGE_WORDS, first.length)).join(" ");
      startPrefix = prefixFor(startTerm);
      if (!startPrefix) return null;
    }

    var endMax = single ? last.length - words(startTerm).length : last.length;
    if (endMax < 1) return null;
    var endTerm = null;
    var endSuffix = "";
    for (var j = Math.min(EDGE_WORDS, endMax); j <= Math.min(MAX_EDGE_WORDS, endMax); j++) {
      var tail = last.slice(-j).join(" ").replace(TRAILING, "");
      if (tail && unique(tail)) {
        endTerm = tail;
        break;
      }
    }
    if (!endTerm) {
      var edge = last.slice(-Math.min(EDGE_WORDS, endMax)).join(" ");
      if (TRAILING.test(edge)) return null; // no suffix can follow a term whose final period was dropped
      endSuffix = suffixFor(edge);
      if (!endSuffix) return null;
      endTerm = edge;
    }

    return (
      (startPrefix ? encodeTerm(startPrefix) + "-," : "") +
      encodeTerm(startTerm) +
      "," +
      encodeTerm(endTerm) +
      (endSuffix ? ",-" + encodeTerm(endSuffix) : "")
    );
  }

  // The last heading with an id at or before node.
  function headingBefore(node) {
    var found = null;
    var headings = content.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]");
    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i];
      if (heading === node || heading.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) found = heading;
      else break;
    }
    return found;
  }

  // What the bar shares for a selection inside the post, or null when it shares nothing.
  function describe(range, point) {
    blockCache = new Map();
    try {
      var run = segmentsOf(range);
      if (!run || !run.start || !run.end) return null;
      var segments = run.segments;
      var firstText = segments[run.start.segment];
      var lastText = segments[run.end.segment];
      var a = run.start.offset;
      var b = run.end.offset;
      // Whole words, and no spaces at either edge.
      while (a > 0 && insideWord(firstText, a)) a--;
      while (b < lastText.length && insideWord(lastText, b)) b++;
      if (run.start.segment === run.end.segment && a >= b) return null;
      while (a < firstText.length && firstText.charAt(a) === " ") a++;
      while (b > 0 && lastText.charAt(b - 1) === " ") b--;

      var pieces;
      if (run.start.segment === run.end.segment) {
        pieces = [firstText.slice(a, b)];
      } else {
        pieces = [firstText.slice(a)];
        for (var s = run.start.segment + 1; s < run.end.segment; s++) pieces.push(segments[s]);
        pieces.push(lastText.slice(0, b));
      }
      // Words before and after the selection in its first and last run, for terms that need context. A run of which
      // nothing but space is selected gives none: the passage then starts or ends at the edge of the next run.
      var before = pieces[0].trim() ? firstText.slice(0, a) : "";
      var after = pieces[pieces.length - 1].trim() ? lastText.slice(b) : "";
      pieces = pieces
        .map(function (piece) {
          return piece.trim();
        })
        .filter(Boolean);
      var quote = pieces.join(" ");
      if (words(quote).length < MIN_WORDS) return null;

      var heading = headingBefore(range.startContainer);
      var anchor = "#" + encodeURIComponent(heading ? heading.id : content.id);
      var directive = null;
      var insideHeading = heading && heading.contains(range.startContainer) && heading.contains(range.endContainer);
      if (!insideHeading) directive = textDirective(pieces, before, after, pageText());
      var link = base + anchor + (directive ? ":~:text=" + directive : "");
      return { range: range, quote: quote, link: link, point: point || null };
    } finally {
      blockCache = null;
    }
  }

  // ---- The bar -------------------------------------------------------------------------------------------------

  function shorten(text, max) {
    if (text.length <= max) return text;
    var cut = text.slice(0, max - 1);
    var space = cut.lastIndexOf(" ");
    if (space > max * 0.6) cut = cut.slice(0, space);
    return cut.replace(/[\s.,;:!?…-]+$/, "") + "…";
  }

  function quoted(text, max) {
    return "“" + shorten(text, max) + "”";
  }

  function closestElement(node, selector) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    return el && el.closest ? el.closest(selector) : null;
  }

  // Whether nothing but space (outside scripts and styles) lies inside range.
  function onlySpace(range) {
    var root = range.commonAncestorContainer;
    if (root.nodeType !== 1) root = root.parentNode;
    var walk = walker(root);
    for (var node = walk.nextNode(); node; node = walk.nextNode()) {
      if (node.nodeType !== 3 || !range.intersectsNode(node)) continue;
      var text = node.data;
      if (node === range.endContainer) text = text.slice(0, range.endOffset);
      if (node === range.startContainer) text = text.slice(range.startOffset);
      if (text.trim()) return false;
    }
    return true;
  }

  // A triple click on the post's first or last paragraph selects up to the edge of the next block, outside the post.
  // Such an edge is pulled back into the post when nothing but space lies between them.
  function clampToContent(range) {
    var gap = document.createRange();
    if (content.contains(range.startContainer) && !content.contains(range.endContainer)) {
      gap.setStart(content, content.childNodes.length);
      gap.setEnd(range.endContainer, range.endOffset);
      if (onlySpace(gap)) range.setEnd(content, content.childNodes.length);
    }
    if (!content.contains(range.startContainer) && content.contains(range.endContainer)) {
      gap.setStart(range.startContainer, range.startOffset);
      gap.setEnd(content, 0);
      if (onlySpace(gap)) range.setStart(content, 0);
    }
  }

  function selectionState(point) {
    var selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    if (words(selection.toString().replace(/\s+/g, " ")).length < MIN_WORDS) return null;
    var range = selection.getRangeAt(0).cloneRange();
    clampToContent(range);
    if (!content.contains(range.startContainer) || !content.contains(range.endContainer)) return null;
    if (closestElement(range.startContainer, "pre") || closestElement(range.endContainer, "pre")) return null;
    return describe(range, point);
  }

  function navigationBottom() {
    var nav = document.getElementById("navbar");
    if (!nav) return 0;
    var position = window.getComputedStyle(nav).position;
    return position === "fixed" || position === "sticky" ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
  }

  function place() {
    if (!current || bar.hidden) return;
    // Measured at the page's left edge: at its old place the bar would only get the width left over to its right.
    bar.style.position = "absolute";
    bar.style.left = "0px";
    bar.style.top = "0px";
    var width = bar.offsetWidth;
    var height = bar.offsetHeight;
    var viewWidth = document.documentElement.clientWidth;
    var viewHeight = window.innerHeight;
    var top = navigationBottom() + 8;
    var touch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var gap = 10;
    var gapBelow = touch ? 36 : gap; // the phone's own selection handles sit right under the text
    var x;
    var y;
    var below = null;
    var center = viewWidth / 2;

    if (current.point) {
      x = current.point.x;
      y = Math.min(Math.max(current.point.y, top), viewHeight - height - 8);
    } else {
      var rects = [];
      var all = current.range.getClientRects();
      for (var i = 0; i < all.length; i++) if (all[i].width > 0 && all[i].height > 0) rects.push(all[i]);
      if (!rects.length) return hide();
      var first = rects[0];
      var last = rects[rects.length - 1];
      // Room above the first line, under the navigation bar, and room under the last line. A selection that lies
      // wholly off screen has one of them, so the bar stays next to it and scrolls back into view with it.
      var roomAbove = first.top - height - gap >= top;
      var roomBelow = last.bottom + gapBelow + height <= viewHeight - 8;
      if (roomAbove && (!touch || !roomBelow)) {
        below = false;
        y = first.top - height - gap;
        center = first.left + first.width / 2;
      } else if (roomBelow) {
        below = true;
        y = last.bottom + gapBelow;
        center = last.left + last.width / 2;
      } else {
        y = top; // the selection covers the screen: keep the bar just under the navigation bar
      }
      x = center - width / 2;
    }
    x = Math.max(8, Math.min(x, viewWidth - width - 8));

    bar.classList.toggle("is-below", below === true);
    bar.classList.toggle("no-arrow", below === null);
    bar.style.setProperty("--arrow-left", Math.max(14, Math.min(center - x, width - 14)) + "px");
    if (below === null) {
      // Fixed while it does not point at the text, so that it does not shake while the page scrolls.
      bar.style.position = "fixed";
      bar.style.top = Math.round(y) + "px";
      bar.style.left = Math.round(x) + "px";
      return;
    }
    var origin =
      window.getComputedStyle(document.body).position === "static"
        ? { top: -window.pageYOffset, left: -window.pageXOffset }
        : document.body.getBoundingClientRect();
    bar.style.top = Math.round(y - origin.top) + "px";
    bar.style.left = Math.round(x - origin.left) + "px";
  }

  function resetMessage() {
    buttons.hidden = false;
    message.textContent = "";
    go.hidden = true;
  }

  function say(text) {
    var hadFocus = bar.contains(document.activeElement);
    buttons.hidden = true;
    message.textContent = text;
    place();
    if (hadFocus) (go.hidden ? message : go).focus(); // the focused button has just been hidden
  }

  function show(state) {
    clearTimeout(hideTimer);
    current = state;
    resetMessage();
    xLink.href = "https://x.com/intent/post?text=" + encodeURIComponent(quoted(state.quote, 230)) + "&url=" + encodeURIComponent(state.link);
    whatsappLink.href = "https://api.whatsapp.com/send?text=" + encodeURIComponent(quoted(state.quote, 700) + "\n\n" + state.link);
    go.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(state.link);
    bar.hidden = false;
    place();
  }

  function hide() {
    clearTimeout(hideTimer);
    current = null;
    bar.hidden = true;
    resetMessage();
  }

  function hideLater(ms) {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, ms);
  }

  function copy(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        window.prompt("", text);
        done();
      });
    } else {
      window.prompt("", text);
      done();
    }
  }

  function sameRange(a, b) {
    return (
      a.startContainer === b.startContainer && a.startOffset === b.startOffset && a.endContainer === b.endContainer && a.endOffset === b.endOffset
    );
  }

  function update() {
    if (mouseDown) return;
    var state = selectionState(null);
    // A bar opened by a right click stays at the pointer while the selection is the same.
    if (state && current && current.point && sameRange(state.range, current.range)) state.point = current.point;
    if (state) show(state);
    else if (!message.textContent) hide();
    else if (!go.hidden) hideLater(6000); // the LinkedIn note stays a little while after the selection is gone
  }

  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(update, ms);
  }

  function released() {
    mouseDown = false;
    schedule(10);
  }

  document.addEventListener("selectionchange", function () {
    schedule(250);
  });
  document.addEventListener("mousedown", function (event) {
    if (event.button !== 0 || bar.contains(event.target)) return;
    mouseDown = true;
    hide();
  });
  document.addEventListener("mouseup", function (event) {
    if (event.button !== 0) return;
    mouseDown = false;
    if (!bar.contains(event.target)) schedule(10); // a click in the bar keeps its message
  });
  // Dragging the selected text ends without a mouseup, and so does a drag that leaves the window.
  document.addEventListener("dragend", released);
  window.addEventListener("blur", function () {
    mouseDown = false;
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !bar.hidden) hide();
  });
  // Whether the point (x, y) lies on the selected text.
  function onSelection(range, x, y) {
    var rects = range.getClientRects();
    for (var i = 0; i < rects.length; i++) {
      var r = rects[i];
      if (x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2) return true;
    }
    return false;
  }

  // A right click on the selected text opens the bar at the pointer in place of the browser's menu. Anywhere else,
  // for example on a link while some text is selected, the browser's own menu opens as usual.
  content.addEventListener("contextmenu", function (event) {
    if (bar.getAttribute("data-right-click") !== "true") return;
    var selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    if (!onSelection(selection.getRangeAt(0), event.clientX, event.clientY)) return;
    var state = selectionState({ x: event.clientX, y: event.clientY });
    if (!state) return;
    event.preventDefault();
    show(state);
  });

  var frame = 0;
  function follow() {
    if (frame || bar.hidden) return;
    frame = window.requestAnimationFrame(function () {
      frame = 0;
      if (current) current.point = null; // once the page moves, the bar returns to the selected text
      place();
    });
  }
  // Captured, so that the bar also follows a selection inside a table that scrolls sideways.
  document.addEventListener("scroll", follow, { capture: true, passive: true });
  window.addEventListener("resize", follow);

  // Clicks in the bar must not clear the selection.
  bar.addEventListener("mousedown", function (event) {
    event.preventDefault();
  });
  bar.addEventListener("click", function (event) {
    var target = event.target.closest("[data-share], .selection-share-go");
    if (!target || !current) return;
    var kind = target.getAttribute("data-share");
    if (kind === "copy") {
      copy(current.link, function () {
        say(message.getAttribute("data-copied"));
        hideLater(2500);
      });
    } else if (kind === "linkedin") {
      copy(quoted(current.quote, 700), function () {
        go.hidden = false;
        say(message.getAttribute("data-linkedin"));
      });
    } else if (kind === "native") {
      navigator.share({ title: title, text: quoted(current.quote, 700), url: current.link }).catch(function () {});
    } else {
      hideLater(300); // X, WhatsApp and LinkedIn open in a new tab
    }
  });
})();
