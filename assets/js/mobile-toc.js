// Phones don't show the sidebar table of contents, so posts that have one also get a collapsed
// "Contents" list at the top (_layouts/post.liquid). It is built here from the post's own h2 headings,
// so the links always use the headings' real ids, in both languages.
(function () {
  var box = document.querySelector(".mobile-toc");
  if (!box) return;
  var list = box.querySelector("ol");
  document.querySelectorAll("#markdown-content h2[id]").forEach(function (heading) {
    var link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent.trim();
    // Close the list first, so the page scrolls to the heading's final position.
    link.addEventListener("click", function () {
      box.open = false;
    });
    var item = document.createElement("li");
    item.appendChild(link);
    list.appendChild(item);
  });
  if (list.children.length) box.hidden = false;
})();
