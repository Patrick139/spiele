// leistung.js — Bildrate messen und anzeigen (Taste F). Hilft herauszufinden, wo es ruckelt:
// FPS, Bilddauer (Mittel, schlechtestes Prozent), Zeichenzeit auf dem Hauptthread, Simulationsschritte je Bild,
// Pixelverhaeltnis. Kein Modul; globale Funktionen.

var LEISTUNG = { bilder: [], zeichnen: [], schritte: [], an: false };

function leistungMessen(vergangenMs, zeichenMs, schritte) {
  var L = LEISTUNG;
  L.bilder.push(vergangenMs); L.zeichnen.push(zeichenMs); L.schritte.push(schritte);
  if (L.bilder.length > 180) { L.bilder.shift(); L.zeichnen.shift(); L.schritte.shift(); }
}
function leistungWerte() {
  var L = LEISTUNG, n = L.bilder.length;
  if (n < 10) return null;
  var s = L.bilder.slice().sort(function (a, b) { return a - b; });
  var mittel = L.bilder.reduce(function (a, b) { return a + b; }, 0) / n;
  var zm = L.zeichnen.reduce(function (a, b) { return a + b; }, 0) / n;
  var sm = L.schritte.reduce(function (a, b) { return a + b; }, 0) / n;
  return { fps: 1000 / mittel, mittel: mittel, p99: s[Math.min(n - 1, Math.floor(n * 0.99))], max: s[n - 1], zeichnen: zm, schritte: sm };
}
function zeichneLeistung(ctx, b) {
  var w = leistungWerte();
  if (!w) return;
  var zeilen = ["FPS " + w.fps.toFixed(0) + "   Bild " + w.mittel.toFixed(1) + " ms  (1 % schlechtester " + w.p99.toFixed(1) + ", max " + w.max.toFixed(0) + ")",
                "Zeichnen " + w.zeichnen.toFixed(1) + " ms   Schritte/Bild " + w.schritte.toFixed(2) + "   Puffer x" + (canvas.width / LOG_BREITE).toFixed(2) + (QUAL.aus ? " (fest)" : " (auto)")];
  ctx.save(); ctx.font = "12px monospace"; ctx.textAlign = "right";
  ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.fillRect(b - 372, 6, 366, 40);
  ctx.fillStyle = w.p99 > 25 ? "#ff9a7a" : "#9ae89a";
  for (var i = 0; i < zeilen.length; i++) ctx.fillText(zeilen[i], b - 12, 22 + i * 16);
  ctx.restore();
}
