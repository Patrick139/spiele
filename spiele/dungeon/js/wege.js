// wege.js — Wegfindung fuer Gegner: Zombies und Skelett-Bogenschuetzen laufen um Ecken statt in die Wand.
// Prinzip: Ist der Weg zum Ziel frei (Sichtlinie mit Koerperbreite), geht der Gegner geradeaus.
// Sonst sucht er einen Weg ueber das Kachelraster (Breitensuche, Diagonalen ohne Ecken-Schneiden),
// glaettet ihn und folgt ihm. Haengt er trotz freier Sicht fest, zwingt er sich kurz auf den Weg.
// Kein Modul; globale Funktionen. Setzt karte.js (begehbar, stoesstAn) und gegner.js (sichtbar) voraus.

var WEG_NEU = 0.45;          // Weg hoechstens alle 0,45 s neu berechnen (je Gegner leicht versetzt)
var WEG_ZIEL_NAH = 6;        // Wegpunkt gilt als erreicht bei so vielen Pixeln
var HAENGT_NACH = 0.35;      // so lange ohne Fortschritt = festgehangen (Sekunden)
var HAENGT_WEG_ZEIT = 0.9;   // dann so lange den Weg erzwingen

// Sichtlinie mit Koerperbreite: Mitte plus zwei seitlich versetzte Strahlen.
function breitSichtbar(ebene, x1, y1, x2, y2, r) {
  if (!sichtbar(ebene, x1, y1, x2, y2)) return false;
  var dx = x2 - x1, dy = y2 - y1, l = Math.sqrt(dx * dx + dy * dy);
  if (l < 1 || !r) return true;
  var nx = -dy / l * r, ny = dx / l * r;
  return sichtbar(ebene, x1 + nx, y1 + ny, x2 + nx, y2 + ny) && sichtbar(ebene, x1 - nx, y1 - ny, x2 - nx, y2 - ny);
}

// Breitensuche von (vx, vy) nach (zx, zy) in Pixeln. Gibt Wegpunkte (Pixel, Kachelmitten) ohne den
// Startpunkt zurueck, oder null, wenn kein Weg existiert. r = Koerperradius fuer die Glaettung.
function wegSuchen(ebene, vx, vy, zx, zy, r) {
  var sx = Math.floor(vx / KACHEL), sy = Math.floor(vy / KACHEL), tx = Math.floor(zx / KACHEL), ty = Math.floor(zy / KACHEL);
  if (sx < 0 || sy < 0 || sx >= RASTER || sy >= RASTER || tx < 0 || ty < 0 || tx >= RASTER || ty >= RASTER) return null;
  if (!begehbar(ebene, tx, ty)) return null;
  if (sx === tx && sy === ty) return [{ x: zx, y: zy }];
  var vor = new Int32Array(RASTER * RASTER).fill(-2), start = sy * RASTER + sx, ziel = ty * RASTER + tx;
  var warte = [start], kopf = 0;
  vor[start] = -1;
  var N = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (kopf < warte.length && vor[ziel] === -2) {
    var cur = warte[kopf++], cx = cur % RASTER, cy = (cur - cx) / RASTER;
    for (var k = 0; k < 8; k++) {
      var nx = cx + N[k][0], ny = cy + N[k][1];
      if (nx < 0 || ny < 0 || nx >= RASTER || ny >= RASTER) continue;
      var id = ny * RASTER + nx;
      if (vor[id] !== -2 || !begehbar(ebene, nx, ny)) continue;
      if (k >= 4 && (!begehbar(ebene, cx + N[k][0], cy) || !begehbar(ebene, cx, cy + N[k][1]))) continue;   // keine Ecken schneiden
      vor[id] = cur; warte.push(id);
    }
  }
  if (vor[ziel] === -2) return null;
  var kette = [], p = ziel;
  while (p !== start) { kette.push({ x: ((p % RASTER) + 0.5) * KACHEL, y: (Math.floor(p / RASTER) + 0.5) * KACHEL }); p = vor[p]; }
  kette.reverse();
  kette[kette.length - 1] = { x: zx, y: zy };                      // zuletzt genau zum Ziel
  // Glaetten: von der Position aus den fernsten Punkt nehmen, der noch breit sichtbar ist.
  var glatt = [], ax = vx, ay = vy, i = 0;
  while (i < kette.length) {
    var j = kette.length - 1;
    while (j > i && !breitSichtbar(ebene, ax, ay, kette[j].x, kette[j].y, r)) j--;
    glatt.push(kette[j]); ax = kette[j].x; ay = kette[j].y; i = j + 1;
  }
  return glatt;
}

// Ein Schritt zum Ziel: geradeaus, wenn frei; sonst ueber den Weg. Gibt true zurueck, wenn er sich bewegt hat.
function gehZu(g, ebene, tx, ty, dt, tempo) {
  var x0 = g.x, y0 = g.y, dx, dy, l, ziel = null;
  var direkt = !(g.zwingWeg > 0) && breitSichtbar(ebene, g.x, g.y, tx, ty, g.radius * 0.8);
  if (g.zwingWeg > 0) g.zwingWeg -= dt;
  if (direkt) {
    g.weg = null; ziel = { x: tx, y: ty };
  } else {
    g.wegT = (g.wegT || 0) - dt;
    if (g.wegT <= 0 || !g.weg || !g.weg.length) {
      g.weg = wegSuchen(ebene, g.x, g.y, tx, ty, g.radius * 0.8);
      g.wegT = WEG_NEU + (g.id % 5) * 0.04;
    }
    while (g.weg && g.weg.length > 1 && Math.hypot(g.weg[0].x - g.x, g.weg[0].y - g.y) < WEG_ZIEL_NAH) g.weg.shift();
    ziel = g.weg && g.weg.length ? g.weg[0] : null;                // kein Weg gefunden: stehen bleiben
  }
  if (!ziel) { g.haengtT = 0; return false; }
  dx = ziel.x - g.x; dy = ziel.y - g.y; l = Math.sqrt(dx * dx + dy * dy);
  if (l < 1) return false;
  bewegeGegner(g, ebene, dx / l * tempo * dt, dy / l * tempo * dt);
  // Haengt er? (soll laufen, kommt aber kaum voran)
  var bewegt = Math.hypot(g.x - x0, g.y - y0);
  if (bewegt < tempo * dt * 0.25) {
    g.haengtT = (g.haengtT || 0) + dt;
    if (g.haengtT > HAENGT_NACH) { g.zwingWeg = HAENGT_WEG_ZEIT; g.haengtT = 0; g.wegT = 0; }
  } else g.haengtT = 0;
  return bewegt > 0;
}

// Ausweichen vor dem Spieler: aus 16 Richtungen die waehlen, die vom Spieler wegfuehrt und frei ist.
// Sackgassen (Wand voraus) zaehlen weniger. Die Richtung wird kurz gehalten, damit nichts zittert.
function weicheAus(g, ebene, sp, dt, tempo) {
  g.fluchtT = (g.fluchtT || 0) - dt;
  if (g.fluchtT <= 0 || g.fluchtW === undefined) {
    var weg = Math.atan2(g.y - sp.y, g.x - sp.x), beste = null, bw = -9;
    for (var k = 0; k < 16; k++) {
      var off = (k % 2 ? 1 : -1) * Math.ceil(k / 2) * Math.PI / 8;          // 0, +-22,5, +-45 ... bis 180 Grad
      if (Math.abs(off) > Math.PI * 0.56) continue;                           // nie auf den Spieler zu
      var a = weg + off, c = Math.cos(a), s = Math.sin(a), frei = 0;
      for (var st = 1; st <= 4; st++) { if (stoesstAn(ebene, g.x + c * st * 14, g.y + s * st * 14, g.radius)) break; frei = st; }
      if (frei < 2) continue;                                                 // Wand zu nah
      var wert = Math.cos(off) + frei * 0.18;
      if (wert > bw) { bw = wert; beste = a; }
    }
    g.fluchtW = beste; g.fluchtT = 0.3;
  }
  if (g.fluchtW === null) return false;
  var x0 = g.x, y0 = g.y;
  bewegeGegner(g, ebene, Math.cos(g.fluchtW) * tempo * dt, Math.sin(g.fluchtW) * tempo * dt);
  return Math.hypot(g.x - x0, g.y - y0) > 0;
}
