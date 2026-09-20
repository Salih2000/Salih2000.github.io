document.addEventListener("DOMContentLoaded", function () {
  // Load the particles.js config, then hand color control over to
  // setParticlesTheme() (theme.js) so it always matches the current theme.
  particlesJS.load("particles-js", "/assets/json/particles.json", function () {
    if (typeof setParticlesTheme === "function") {
      setParticlesTheme(determineComputedTheme());
    }
  });
});
