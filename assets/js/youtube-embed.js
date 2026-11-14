// Turns a saved video cover into a playable YouTube player while the video is still available on YouTube.
//
// Markup in a post:
//   <div class="youtube-video" data-youtube-id="VIDEO_ID">
//     <a href="https://www.youtube.com/watch?v=VIDEO_ID"><img src="/assets/img/saved-cover.jpg" alt="..."></a>
//   </div>
//
// The page ships with the saved cover and its link. The script asks YouTube's oEmbed endpoint whether the video
// still exists; only if it does is the cover replaced by the player (youtube-nocookie.com). If the video was removed,
// made private, or YouTube cannot be reached, the saved cover and its link stay.
(function () {
  "use strict";

  var boxes = document.querySelectorAll(".youtube-video[data-youtube-id]");
  if (!boxes.length || !window.fetch) return;

  var style = document.createElement("style");
  style.textContent =
    ".youtube-video iframe{display:block;width:100%;height:auto;aspect-ratio:16/9;border:0;border-radius:.25rem;" +
    "box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12)}";
  document.head.appendChild(style);

  Array.prototype.forEach.call(boxes, function (box) {
    var id = box.getAttribute("data-youtube-id");
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    var watchUrl = "https://www.youtube.com/watch?v=" + id;

    fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(watchUrl), { credentials: "omit" })
      .then(function (response) {
        if (!response.ok) throw new Error("video unavailable");
        return response.json();
      })
      .then(function (info) {
        var frame = document.createElement("iframe");
        frame.src = "https://www.youtube-nocookie.com/embed/" + id;
        frame.title = (info && info.title) || "YouTube video";
        frame.loading = "lazy";
        frame.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        frame.allowFullscreen = true;
        while (box.firstChild) box.removeChild(box.firstChild);
        box.appendChild(frame);
      })
      .catch(function () {
        // Keep the saved cover and its link.
      });
  });
})();
