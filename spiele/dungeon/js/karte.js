// karte.js — Zufallsdungeon aus Raeumen und Gaengen auf einem Raster.
// Kein Modul, kein export: alles haengt an globalen Funktionen/Variablen,
// damit index.html per Doppelklick laeuft.
//
// Raster: 50 x 50 Kacheln, Kachelgroesse 32 px.
// Kachelwerte: 0 = Fels (undurchdringlich), 1 = Fussboden, 2 = Treppe.

// ---- Konstanten zum Nachjustieren -------------------------------------
var KACHEL = 32;          // Kantenlaenge einer Kachel in Pixeln
var RASTER = 50;          // Breite und Hoehe des Dungeons in Kacheln
var EBENEN_MAX = 3;       // ab dieser Ebene fuehrt die Treppe ins Ziel
var MIN_RAUM = 6;         // kleinste Raumseite (inkl. Waende): Innenmass mindestens 4 x 4
var GANG_BREITE = 2;      // Gaenge sind zwei Kacheln breit (grosse Gegner und der Waechter kommen durch)
var TUER = 8;             // Kachelwert: Tuer in der Raumwand dort, wo ein Gang in einen Raum fuehrt
var MAX_RAUM = 12;        // groesste Raumseite
var ANZAHL_RAeUME = 12;   // versuchte Raeume pro Ebene
// -----------------------------------------------------------------------

function zufall(min, max) { // ganzzahlig, beide Grenzen inklusive
  return min + Math.floor(Math.random() * (max - min + 1));
}

// Eine einzelne Ebene erzeugen: Fels meisseln, Raeume graben, Gaenge verbinden.
function erzeugeEbene(ebenenNr) {
  var feld = [];
  var y, x;
  for (y = 0; y < RASTER; y++) {
    var zeile = [];
    for (x = 0; x < RASTER; x++) zeile.push(0);
    feld.push(zeile);
  }

  var raeume = [];
  var versuche = 0;
  while (raeume.length < ANZAHL_RAeUME && versuche < 200) {
    versuche++;
    var w = zufall(MIN_RAUM, MAX_RAUM);
    var h = zufall(MIN_RAUM, MAX_RAUM);
    var rx = zufall(1, RASTER - w - 2);
    var ry = zufall(1, RASTER - h - 2);
    var kandidat = { x: rx, y: ry, w: w, h: h, cx: rx + (w >> 1), cy: ry + (h >> 1) };

    // Uberlappung mit bereits gegrabenen Raeumen vermeiden (1 Kachel Puffer)
    var kollidiert = false;
    for (var i = 0; i < raeume.length; i++) {
      var a = raeume[i];
      if (kandidat.x < a.x + a.w + 1 && kandidat.x + kandidat.w + 1 > a.x &&
          kandidat.y < a.y + a.h + 1 && kandidat.y + kandidat.h + 1 > a.y) {
        kollidiert = true;
        break;
      }
    }
    if (kollidiert) continue;

    // Innenbereich ausgraben (Waende bleiben als Fels stehen)
    for (var yy = ry + 1; yy < ry + h - 1; yy++)
      for (var xx = rx + 1; xx < rx + w - 1; xx++)
        feld[yy][xx] = 1;
    raeume.push(kandidat);
  }

  if (raeume.length < 2) return null; // zu wenig Platz — neu versuchen

  // Gaenge: Spannbaum ueber die naechstgelegenen Raeume (Prim) statt Kette in Erzeugungsreihenfolge —
  // kuerzere, weniger kreuzende Gaenge; dazu zwei Querverbindungen zwischen NAHEN Raeumen (Rundwege).
  function rd(a, b) { return Math.abs(a.cx - b.cx) + Math.abs(a.cy - b.cy); }
  var drin = [0], verbunden = {};
  while (drin.length < raeume.length) {
    var bi = -1, bj = -1, bd = 1e9;
    for (var ii = 0; ii < drin.length; ii++) for (var jj = 0; jj < raeume.length; jj++) {
      if (drin.indexOf(jj) >= 0) continue;
      var dd = rd(raeume[drin[ii]], raeume[jj]);
      if (dd < bd) { bd = dd; bi = drin[ii]; bj = jj; }
    }
    grabeGang(feld, raeume[bi].cx, raeume[bi].cy, raeume[bj].cx, raeume[bj].cy);
    verbunden[bi + "-" + bj] = verbunden[bj + "-" + bi] = true;
    drin.push(bj);
  }
  for (var extra = 0; extra < 2; extra++) {
    var q1 = zufall(0, raeume.length - 1), nah = [];
    for (var n2 = 0; n2 < raeume.length; n2++) if (n2 !== q1 && !verbunden[q1 + "-" + n2]) nah.push(n2);
    nah.sort(function (a, b) { return rd(raeume[q1], raeume[a]) - rd(raeume[q1], raeume[b]); });
    if (!nah.length) continue;
    var q2 = nah[zufall(0, Math.min(2, nah.length - 1))];
    grabeGang(feld, raeume[q1].cx, raeume[q1].cy, raeume[q2].cx, raeume[q2].cy);
    verbunden[q1 + "-" + q2] = verbunden[q2 + "-" + q1] = true;
  }

  tuerenSetzen(feld, raeume);                                  // Wandoeffnungen werden Tueren (Raeume nach Gaengen)

  // Startraum = Raum oben links; Treppe = Raum mit dem laengsten WEG (Breitensuche), nicht Luftlinie:
  // so liegt die Treppe wirklich tief im Dungeon und nie im Startraum.
  var start = raeume[0];
  for (var s = 1; s < raeume.length; s++) {
    if (raeume[s].x + raeume[s].y < start.x + start.y) start = raeume[s];
  }
  var weit = weglaengen(feld, start.cx, start.cy);
  var treppe = null, dmax = -1;
  for (var t = 0; t < raeume.length; t++) {
    var w2 = weit[raeume[t].cy][raeume[t].cx];
    if (w2 > dmax && raeume[t] !== start) { dmax = w2; treppe = raeume[t]; }
  }
  if (!treppe || dmax < 0) return null;                       // Raum unerreichbar: neu wuerfeln
  for (y = 0; y < RASTER; y++) for (x = 0; x < RASTER; x++) if (feld[y][x] > 0 && weit[y][x] < 0) return null;   // keine Inseln
  var tx = treppe.cx, ty = treppe.cy;
  feld[ty][tx] = 2;

  var ebene = {
    feld: feld,
    raeume: raeume,
    start: { x: start.cx, y: start.cy },
    treppe: { x: tx, y: ty },
    ebenenNr: ebenenNr
  };
  raumTypenVergeben(ebene, weit);                              // Schluessel-, Schatz-, Kapellen-, Lagerraum (raeume.js)
  return ebene;
}

// Breitensuche ueber begehbare Kacheln: Weglaenge von (sx,sy), -1 = nicht erreichbar.
function weglaengen(feld, sx, sy) {
  var d = [], x, y;
  for (y = 0; y < RASTER; y++) { d.push([]); for (x = 0; x < RASTER; x++) d[y].push(-1); }
  var q = [[sx, sy]]; d[sy][sx] = 0;
  for (var i = 0; i < q.length; i++) {
    var cx = q[i][0], cy = q[i][1], r = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (var k = 0; k < 4; k++) {
      var nx = cx + r[k][0], ny = cy + r[k][1];
      if (nx < 0 || ny < 0 || nx >= RASTER || ny >= RASTER || d[ny][nx] >= 0 || !feld[ny][nx]) continue;
      d[ny][nx] = d[cy][cx] + 1; q.push([nx, ny]);
    }
  }
  return d;
}

// L-foermiger Gang von (x1,y1) nach (x2,y2): erst waagerecht, dann senkrecht, GANG_BREITE Kacheln breit.
function grabeGang(feld, x1, y1, x2, y2) {
  var x, y, b;
  var von = Math.min(x1, x2), bis = Math.max(x1, x2);
  for (b = 0; b < GANG_BREITE; b++) for (x = von; x <= bis + GANG_BREITE - 1; x++) if (y1 + b < RASTER - 1 && x < RASTER - 1 && feld[y1 + b][x] === 0) feld[y1 + b][x] = 1;
  von = Math.min(y1, y2); bis = Math.max(y1, y2);
  for (b = 0; b < GANG_BREITE; b++) for (y = von; y <= bis + GANG_BREITE - 1; y++) if (x2 + b < RASTER - 1 && y < RASTER - 1 && feld[y][x2 + b] === 0) feld[y][x2 + b] = 1;
}

// Tueren: wo ein Gang die Wand eines Raums durchbricht (Boden vor und hinter der Wandkachel), wird die Kachel zur Tuer.
// Ein Gang von zwei Kacheln Breite gibt eine Doppeltuer. Gaenge, die nur an der Wand entlanglaufen, bleiben Boden.
function tuerenSetzen(feld, raeume) {
  for (var i = 0; i < raeume.length; i++) {
    var r = raeume[i], x, y, cand = [];
    for (x = r.x + 1; x < r.x + r.w - 1; x++) {
      if (feld[r.y][x] === 1 && feld[r.y - 1][x] === 1 && feld[r.y + 1][x] === 1) cand.push([x, r.y]);
      var yb = r.y + r.h - 1;
      if (feld[yb][x] === 1 && feld[yb - 1][x] === 1 && feld[yb + 1][x] === 1) cand.push([x, yb]);
    }
    for (y = r.y + 1; y < r.y + r.h - 1; y++) {
      if (feld[y][r.x] === 1 && feld[y][r.x - 1] === 1 && feld[y][r.x + 1] === 1) cand.push([r.x, y]);
      var xr = r.x + r.w - 1;
      if (feld[y][xr] === 1 && feld[y][xr - 1] === 1 && feld[y][xr + 1] === 1) cand.push([xr, y]);
    }
    for (var c = 0; c < cand.length; c++) feld[cand[c][1]][cand[c][0]] = TUER;
  }
}

// Neue Ebene erzeugen (mit Ausfallsicherheit, falls der Zufall Pech hat).
function neueEbene(ebenenNr) {
  for (var versuch = 0; versuch < 25; versuch++) {
    var ebene = erzeugeEbene(ebenenNr);
    if (ebene) return ebene;
  }
  // Notfall: ein einziger grosser Saal — damit das Spiel nie haengen bleibt
  var feld = [], y, x;
  for (y = 0; y < RASTER; y++) {
    var z = [];
    for (x = 0; x < RASTER; x++) z.push(y === 0 || y === RASTER - 1 || x === 0 || x === RASTER - 1 ? 0 : 1);
    feld.push(z);
  }
  return {
    feld: feld,
    raeume: [{ x: 0, y: 0, w: RASTER, h: RASTER, cx: RASTER >> 1, cy: RASTER >> 1 }],
    start: { x: 3, y: 3 },
    treppe: { x: RASTER - 4, y: RASTER - 4 },
    ebenenNr: ebenenNr
  };
}

// Zugriffs-Helfer fuer Kollision und Grafik.
function kachelAn(ebene, gx, gy) {
  if (gx < 0 || gy < 0 || gx >= RASTER || gy >= RASTER) return 0; // ausserhalb = Fels
  return ebene.feld[gy][gx];
}

function begehbar(ebene, gx, gy) {
  var k = kachelAn(ebene, gx, gy);
  return k === 1 || k === 2 || k === TUER;
}
