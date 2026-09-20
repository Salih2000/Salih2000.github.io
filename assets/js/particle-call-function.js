document.addEventListener("DOMContentLoaded", function () {
  // Load the particles.js config, then hand color control over to
  // setParticlesTheme() (theme.js) so it always matches the current theme.
  particlesJS.load("particles-js", "/assets/json/particles.json", function () {
    // On reading pages (e.g. blog posts) keep the particles visible but freeze
    // their movement, since a moving background is distracting while reading.
    var container = document.getElementById("particles-js");
    if (container && container.dataset.static === "true" && typeof pJSDom !== "undefined" && pJSDom.length > 0) {
      pJSDom[0].pJS.particles.move.enable = false;
      pJSDom[0].pJS.interactivity.events.onhover.enable = false;
      pJSDom[0].pJS.interactivity.events.onclick.enable = false;
      pJSDom[0].pJS.fn.particlesRefresh();
    }

    if (typeof setParticlesTheme === "function") {
      setParticlesTheme(determineComputedTheme());
    }
  });
});
