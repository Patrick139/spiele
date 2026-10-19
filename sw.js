// sw.js — legt alle Dateien beim ersten Besuch im Geraet ab, damit die Sammlung danach ohne Internet startet.
// Bei jeder Aenderung an den Dateien VERSION erhoehen, sonst bleibt die alte Fassung auf dem Handy.
var VERSION = "sammlung-v5";
var DATEIEN = ["./", "index.html", "style.css", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png",
  "js/qrcode.js", "js/tetris.js", "js/render.js", "js/render_wurf.js", "js/sound.js", "js/input.js", "js/verbindung.js", "js/spiel.js"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(DATEIEN); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); }));
});
