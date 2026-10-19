// zurueck.js — kleiner Knopf "‹ Spiele" unten links in den Einzelspielen; fuehrt zur Spielesammlung (../../index.html).
(function () {
  var a = document.createElement("a");
  a.href = "../../index.html"; a.textContent = "‹ Spiele"; a.setAttribute("aria-label", "Zurück zur Spielesammlung");
  a.style.cssText = "position:fixed;left:6px;bottom:6px;z-index:99999;padding:4px 9px;border-radius:14px;background:rgba(0,0,0,.55);color:#fff;font:600 13px system-ui,sans-serif;text-decoration:none;opacity:.6;border:1px solid rgba(255,255,255,.25)";
  document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(a); });
  if (document.body) document.body.appendChild(a);
})();
