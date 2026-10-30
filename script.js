(function () {
  "use strict";

  // Email is stored reversed in data attributes so scrapers don't find it in the HTML.
  var rev = function (s) { return s.split("").reverse().join(""); };
  var links = document.querySelectorAll("a.email[data-u]");
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    var addr = rev(a.getAttribute("data-u")) + "@" + rev(a.getAttribute("data-d"));
    a.setAttribute("href", "mailto:" + addr);
    var label = a.querySelector(".email-text");
    if (label) label.textContent = addr;
  }

  // Theme toggle: explicit choice is saved; otherwise follows the OS setting.
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return !!(mq && mq.matches);
  }

  function sync() {
    if (!btn) return;
    var dark = isDark();
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  if (btn) {
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      sync();
    });
  }

  if (mq) {
    var onChange = function () { sync(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  sync();
})();
