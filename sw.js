// sw.js — legt alle Dateien beim ersten Besuch im Geraet ab, damit die Sammlung danach ohne Internet startet.
// Bei jeder Aenderung an den Dateien VERSION erhoehen, sonst bleibt die alte Fassung auf dem Handy.
var VERSION = "sammlung-v21";
var DATEIEN = ["./", "index.html", "style.css", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png",
  "js/qrcode.js", "js/tetris.js", "js/render.js", "js/render_wurf.js", "js/sound.js", "js/input.js", "js/verbindung.js", "js/spiel.js", "zurueck.js",
  "spiele/snake/index.html", "spiele/asteroids/index.html", "spiele/dungeon/index.html", "spiele/dungeon/js/audio.js", "spiele/dungeon/js/baer.js", "spiele/dungeon/js/bildschirme.js", "spiele/dungeon/js/boss.js", "spiele/dungeon/js/bossgrafik.js", "spiele/dungeon/js/dorf.js", "spiele/dungeon/js/dorfgrafik.js", "spiele/dungeon/js/dreid.js", "spiele/dungeon/js/effekte.js", "spiele/dungeon/js/faehigkeiten.js", "spiele/dungeon/js/figuren.js", "spiele/dungeon/js/fortschritt.js", "spiele/dungeon/js/gebaeude.js", "spiele/dungeon/js/gegner.js", "spiele/dungeon/js/gegner2.js", "spiele/dungeon/js/gegnerbilder.js", "spiele/dungeon/js/geschichte.js", "spiele/dungeon/js/grafik.js", "spiele/dungeon/js/held.js", "spiele/dungeon/js/hud.js", "spiele/dungeon/js/itemgrafik.js", "spiele/dungeon/js/items.js", "spiele/dungeon/js/kammer.js", "spiele/dungeon/js/kampf.js", "spiele/dungeon/js/karte.js", "spiele/dungeon/js/klang.js", "spiele/dungeon/js/klassen.js", "spiele/dungeon/js/klassenbaum.js", "spiele/dungeon/js/leistung.js", "spiele/dungeon/js/musik.js", "spiele/dungeon/js/pause.js", "spiele/dungeon/js/raeume.js", "spiele/dungeon/js/speicher.js", "spiele/dungeon/js/spiel.js", "spiele/dungeon/js/spieler.js", "spiele/dungeon/js/sprites.js", "spiele/dungeon/js/szenen.js", "spiele/dungeon/js/wege.js", "spiele/dungeon/js/zauber.js", "spiele/schiessbude/index.html", "spiele/lernen/index.html", "spiele/lernen/js/stimme.js", "spiele/lernen/js/schrift.js", "spiele/lernen/js/woerter.js", "spiele/lernen/js/anlaut.js", "spiele/lernen/js/spuren.js", "spiele/lernen/js/rechnen.js", "spiele/lernen/js/lernen.js", "spiele/lernen/js/mampfi.js", "spiele/lernen/js/bauen.js", "spiele/lernen/js/fuettern.js", "spiele/lernen/js/uhr.js", "spiele/lernen/noten/index.html",
  "spiele/lernen/koreanisch/index.html", "spiele/lernen/koreanisch/js/srs.js", "spiele/lernen/koreanisch/js/kern.js", "spiele/lernen/koreanisch/js/ansicht.js", "spiele/lernen/koreanisch/daten/a1_1.js", "spiele/lernen/koreanisch/daten/a1_2.js", "spiele/lernen/koreanisch/daten/grammatik.js", "spiele/lernen/koreanisch/daten/a2_1.js", "spiele/lernen/koreanisch/daten/grammatik_a2_1.js", "spiele/lernen/koreanisch/daten/a2_2.js", "spiele/lernen/koreanisch/daten/grammatik_a2_2.js", "spiele/gitarre/index.html"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(DATEIEN); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION && k !== TON; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
// Tondateien der Koreanisch-App: nicht vorab laden (mehrere hundert), sondern beim ersten Abspielen im eigenen Ablagefach TON behalten.
// Der Audio-Spieler fragt mit "Range" nach Teilstücken; solche Antworten lassen sich nicht ablegen. Deshalb wird immer die ganze Datei
// geholt und abgelegt, und für eine Range-Anfrage daraus das verlangte Stück als 206-Antwort gebaut.
var TON = "ko-ton-v1";
function tonAntwort(anfrage) {
  var url = anfrage.url.split("?")[0];
  return caches.open(TON).then(function (c) {
    return c.match(url).then(function (r) {
      return r || fetch(url).then(function (a) { if (a.status === 200) c.put(url, a.clone()); return a; });
    });
  }).then(function (r) {
    var bereich = anfrage.headers.get("range"), m = bereich ? /bytes=(\d+)-(\d*)/.exec(bereich) : null;
    if (!m || r.status !== 200) return r;
    return r.arrayBuffer().then(function (b) {
      var von = parseInt(m[1], 10), bis = m[2] ? Math.min(parseInt(m[2], 10), b.byteLength - 1) : b.byteLength - 1;
      return new Response(b.slice(von, bis + 1), { status: 206, statusText: "Partial Content", headers: {
        "Content-Type": "audio/mpeg", "Accept-Ranges": "bytes", "Content-Length": String(bis - von + 1), "Content-Range": "bytes " + von + "-" + bis + "/" + b.byteLength } });
    });
  });
}
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (e.request.url.indexOf("/koreanisch/ton/") >= 0) { e.respondWith(tonAntwort(e.request)); return; }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); }));
});
