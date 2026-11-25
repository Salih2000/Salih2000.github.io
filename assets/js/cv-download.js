// Names a downloaded CV after its owner, the download date and the language, for example
// Salih_Abdullah_Kilic_Resume_Long_2026-11-25_ENG.pdf, instead of resume.pdf. The links carry data-cv-download and
// data-cv-lang (_layouts/cv.liquid, strings in _data/<lang>/strings.yml) and a download name without a date, which stays
// in place when this script does not run. The date is the reader's own date: set when the page loads, so "Save link as"
// gets it too, and again on each click in case the page stayed open past midnight.
(function () {
  "use strict";

  function today() {
    var d = new Date();
    function two(n) {
      return (n < 10 ? "0" : "") + n;
    }
    return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate());
  }

  function name(link) {
    link.setAttribute("download", [link.getAttribute("data-cv-download"), today(), link.getAttribute("data-cv-lang")].join("_") + ".pdf");
  }

  var links = document.querySelectorAll("a[data-cv-download]");
  Array.prototype.forEach.call(links, function (link) {
    name(link);
    link.addEventListener("click", function () {
      name(link);
    });
  });
})();
