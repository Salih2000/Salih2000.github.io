// On phones, wide tables in posts (three or more columns) are shown as one block per row, each cell under its
// column name, instead of a table that has to be swiped sideways to see the last columns. The styles are in
// _sass/_base.scss (.stack-on-phone); purgecss keeps them because the class name appears in this file.
(function () {
  document.querySelectorAll("#markdown-content table").forEach(function (table) {
    var names = Array.prototype.map.call(table.querySelectorAll("thead th"), function (th) {
      return th.textContent.trim();
    });
    if (names.length < 3) return;
    table.classList.add("stack-on-phone");
    table.querySelectorAll("tbody tr").forEach(function (row) {
      Array.prototype.forEach.call(row.children, function (cell, i) {
        if (names[i]) cell.setAttribute("data-label", names[i]);
      });
    });
  });
})();
