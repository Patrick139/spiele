// sw.js — legt alle Dateien beim ersten Besuch im Geraet ab, damit die Sammlung danach ohne Internet startet.
// Bei jeder Aenderung an den Dateien VERSION erhoehen, sonst bleibt die alte Fassung auf dem Handy.
var VERSION = "sammlung-v5";
var DATEIEN = ["./", "index.html", "style.css", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png",
  "js/qrcode.js", "js/tetris.js", "js/render.js", "js/render_wurf.js", "js/sound.js", "js/input.js", "js/verbindung.js", "js/spiel.js", "zurueck.js",
  "spiele/snake/index.html", "spiele/asteroids/index.html", "spiele/dungeon/index.html", "spiele/dungeon/js/audio.js", "spiele/dungeon/js/baer.js", "spiele/dungeon/js/bildschirme.js", "spiele/dungeon/js/boss.js", "spiele/dungeon/js/bossgrafik.js", "spiele/dungeon/js/dorf.js", "spiele/dungeon/js/dorfgrafik.js", "spiele/dungeon/js/dreid.js", "spiele/dungeon/js/effekte.js", "spiele/dungeon/js/faehigkeiten.js", "spiele/dungeon/js/figuren.js", "spiele/dungeon/js/fortschritt.js", "spiele/dungeon/js/gebaeude.js", "spiele/dungeon/js/gegner.js", "spiele/dungeon/js/gegner2.js", "spiele/dungeon/js/gegnerbilder.js", "spiele/dungeon/js/geschichte.js", "spiele/dungeon/js/grafik.js", "spiele/dungeon/js/held.js", "spiele/dungeon/js/hud.js", "spiele/dungeon/js/itemgrafik.js", "spiele/dungeon/js/items.js", "spiele/dungeon/js/kammer.js", "spiele/dungeon/js/kampf.js", "spiele/dungeon/js/karte.js", "spiele/dungeon/js/klang.js", "spiele/dungeon/js/klassen.js", "spiele/dungeon/js/klassenbaum.js", "spiele/dungeon/js/leistung.js", "spiele/dungeon/js/musik.js", "spiele/dungeon/js/pause.js", "spiele/dungeon/js/raeume.js", "spiele/dungeon/js/speicher.js", "spiele/dungeon/js/spiel.js", "spiele/dungeon/js/spieler.js", "spiele/dungeon/js/sprites.js", "spiele/dungeon/js/szenen.js", "spiele/dungeon/js/wege.js", "spiele/dungeon/js/zauber.js", "spiele/schiessbude/index.html"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(DATEIEN); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); }));
});
