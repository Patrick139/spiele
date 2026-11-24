// sw.js — legt alle Dateien beim ersten Besuch im Geraet ab, damit die Sammlung danach ohne Internet startet.
// Geantwortet wird sofort aus der Ablage; im Hintergrund wird jede benutzte Datei frisch geholt und die Ablage erneuert.
// Eine geaenderte Datei ist damit beim uebernaechsten Oeffnen da, auch wenn VERSION einmal nicht erhoeht wurde.
// VERSION trotzdem erhoehen, wenn Dateien dazukommen oder wegfallen: Dann werden alle Dateien der Liste neu vorab geladen
// und die alte Ablage geloescht.
var VERSION = "sammlung-v23";
var DATEIEN = ["./", "index.html", "style.css", "manifest.json", "icon.svg", "icon-192.png", "icon-512.png",
  "js/qrcode.js", "js/tetris.js", "js/render.js", "js/render_wurf.js", "js/sound.js", "js/input.js", "js/verbindung.js", "js/spiel.js", "zurueck.js", "spiele/lieder.js",
  "spiele/snake/index.html", "spiele/asteroids/index.html", "spiele/dungeon/index.html", "spiele/dungeon/js/audio.js", "spiele/dungeon/js/baer.js", "spiele/dungeon/js/bildschirme.js", "spiele/dungeon/js/boss.js", "spiele/dungeon/js/bossgrafik.js", "spiele/dungeon/js/dorf.js", "spiele/dungeon/js/dorfgrafik.js", "spiele/dungeon/js/dreid.js", "spiele/dungeon/js/effekte.js", "spiele/dungeon/js/faehigkeiten.js", "spiele/dungeon/js/figuren.js", "spiele/dungeon/js/fortschritt.js", "spiele/dungeon/js/gebaeude.js", "spiele/dungeon/js/gegner.js", "spiele/dungeon/js/gegner2.js", "spiele/dungeon/js/gegnerbilder.js", "spiele/dungeon/js/geschichte.js", "spiele/dungeon/js/grafik.js", "spiele/dungeon/js/held.js", "spiele/dungeon/js/hud.js", "spiele/dungeon/js/itemgrafik.js", "spiele/dungeon/js/items.js", "spiele/dungeon/js/kammer.js", "spiele/dungeon/js/kampf.js", "spiele/dungeon/js/karte.js", "spiele/dungeon/js/klang.js", "spiele/dungeon/js/klassen.js", "spiele/dungeon/js/klassenbaum.js", "spiele/dungeon/js/leistung.js", "spiele/dungeon/js/musik.js", "spiele/dungeon/js/pause.js", "spiele/dungeon/js/raeume.js", "spiele/dungeon/js/speicher.js", "spiele/dungeon/js/spiel.js", "spiele/dungeon/js/spieler.js", "spiele/dungeon/js/sprites.js", "spiele/dungeon/js/szenen.js", "spiele/dungeon/js/wege.js", "spiele/dungeon/js/zauber.js", "spiele/schiessbude/index.html", "spiele/lernen/index.html", "spiele/lernen/js/stimme.js", "spiele/lernen/js/schrift.js", "spiele/lernen/js/woerter.js", "spiele/lernen/js/anlaut.js", "spiele/lernen/js/spuren.js", "spiele/lernen/js/rechnen.js", "spiele/lernen/js/lernen.js", "spiele/lernen/js/mampfi.js", "spiele/lernen/js/bauen.js", "spiele/lernen/js/fuettern.js", "spiele/lernen/js/uhr.js", "spiele/lernen/noten/index.html",
  "spiele/lernen/koreanisch/index.html", "spiele/lernen/koreanisch/js/srs.js", "spiele/lernen/koreanisch/js/kern.js", "spiele/lernen/koreanisch/js/ansicht.js", "spiele/lernen/koreanisch/js/ueben.js", "spiele/lernen/koreanisch/daten/a1_1.js", "spiele/lernen/koreanisch/daten/a1_2.js", "spiele/lernen/koreanisch/daten/grammatik.js", "spiele/lernen/koreanisch/daten/a2_1.js", "spiele/lernen/koreanisch/daten/grammatik_a2_1.js", "spiele/lernen/koreanisch/daten/a2_2.js", "spiele/lernen/koreanisch/daten/grammatik_a2_2.js", "spiele/lernen/koreanisch/daten/b1_1.js", "spiele/lernen/koreanisch/daten/grammatik_b1_1.js", "spiele/gitarre/index.html"];
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
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/koreanisch/ton/") >= 0) { e.respondWith(tonAntwort(e.request)); return; }
  e.respondWith(caches.open(VERSION).then(function (c) {
    return c.match(e.request, { ignoreSearch: true }).then(function (r) {
      var netz = fetch(e.request, { cache: "no-cache" }).then(function (a) {     // no-cache: beim Server nachfragen, ob es Neues gibt (meist nur eine kurze 304-Antwort)
        if (a && a.status === 200 && a.type === "basic") return c.put(url.origin + url.pathname, a.clone()).then(function () { return a; }, function () { return a; });
        return a;
      });
      if (!r) return netz;                               // nicht in der Ablage: aus dem Netz (und fuer das naechste Mal ablegen)
      e.waitUntil(netz.catch(function () {}));           // in der Ablage: sofort antworten, im Hintergrund erneuern; ohne Netz bleibt es bei der Ablage
      return r;
    });
  }));
});
