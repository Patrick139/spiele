// boss.js — der Kampf gegen Pfarrer Ambros Wendel in der Kammer der Kerzen.
// Drei Stufen (Leben 60): 1 Hirte (60..40), 2 aufgerissen (40..20), 3 Pfandherr (20..0).
// Zwischen den Stufen laeuft ein Gespraech (Textbox), dabei steht die Welt still.
// Gefahren (z.gefahren): angekuendigte Kreise/Linien; erst am Ende der Ankuendigung wirkt
// der Schaden bzw. die Folge (fn) — gleiche Lesbarkeit wie die roten Hiebboegen der Zombies.
// Kein Modul; globale Funktionen. Nutzt gegner.js (gegnerBasis, bewegeGegner), kampf.js.

// ---- Konstanten zum Nachjustieren -------------------------------------
var BOSS_LEBEN = 60;
var BOSS_PAUSE_CD = [0, 2.4, 1.9, 1.5];     // Abstand zwischen Angriffen je Stufe (s)
var BOSS_ABSTAND = [0, 190, 120, 90];       // bevorzugter Abstand zum Spieler je Stufe (px)
var ORB_TEMPO = 190;                        // Lichtkugeln (px/s)
var BOSS_RUF_CD = 16;                       // Abstand der Beschwoerung (s)
var BOSS_DIENER_MAX = 3;                    // so viele Diener gleichzeitig
// -----------------------------------------------------------------------

function erzeugeBoss(x, y) {
  var g = gegnerBasis(x, y, "ambros", 3);
  g.zustand = "boss"; g.stufe = 1; g.mindest = 40; g.aktiv = false; g.sperre = false;
  g.cd = 1.8; g.pause = 0; g.letzter = ""; g.ruf = 4; g.sturm = null;
  return g;
}

// ---- Verfolgung: Ambros nach dem Angriff, auf jeder Ebene tiefer und weniger menschlich ----------
var VERFOLGER_LEBEN = [0, 24, 36, 48];      // je Ebene mehr Leben
var VERFOLGER_FLUCHT_ANTEIL = 0.4;          // bei so viel Restleben flieht er in die naechste Ebene
var XP_VERFOLGER = 25;                      // Erfahrung je Ebene bei seiner Flucht

function erzeugeVerfolger(x, y, n) {
  var g = gegnerBasis(x, y, "ambros", 3);
  g.zustand = "boss"; g.flucht = true; g.verfall = n; g.stufe = n;
  g.lebenMax = VERFOLGER_LEBEN[n]; g.leben = g.lebenMax; g.mindest = Math.ceil(g.lebenMax * VERFOLGER_FLUCHT_ANTEIL);
  g.tempo = 60 + 10 * (n - 1);
  g.radius = 11;                              // schmal genug fuer die Gaenge (die Endgestalt in der Kammer braucht das nicht)
  g.aktiv = true; g.sperre = false; g.cd = 1.4; g.pause = 0; g.letzter = ""; g.ruf = 6; g.sturm = null;
  return g;
}
function verfolgerStart(z, fund) {
  var i = z.funde.indexOf(fund);
  if (i >= 0) z.funde.splice(i, 1);
  z.gegner.push(erzeugeVerfolger(fund.x, fund.y, fund.stufe));
}
// Restleben erreicht: er flieht. Gespraech, dann ist er weg, seine Diener fallen, es gibt Erfahrung.
function verfolgerFlieht(g, z) {
  var n = g.stufe;
  g.sperre = true; g.sturm = null; z.gefahren = []; z.pfeile = [];
  dialogStart(verfolgerFlucht(n, HELD), null, function () {
    xpGeben(z, XP_VERFOLGER * n, g.x, g.y - 44);
    var i = z.gegner.indexOf(g);
    if (i >= 0) z.gegner.splice(i, 1);
    for (var k = 0; k < z.gegner.length; k++) if (z.gegner[k].keinXp) z.gegner[k].tot = true;
    spielSpeichern();
  });
}

function bossVon(z) {
  for (var i = 0; i < z.gegner.length; i++) if (z.gegner[i].art === "ambros") return z.gegner[i];
  return null;
}
function bossName(g) { return g.stufe === 1 ? "Pfarrer Ambros Wendel" : (g.stufe === 2 ? "Ambros Wendel" : FINSTER); }
function bossStart(z) { var b = bossVon(z); if (b) { b.aktiv = true; b.cd = 1.8; } }

function gefahr(z, o) { o.t = o.dauer; o.flash = 0; z.gefahren.push(o); }

function orb(z, x, y, w, schaden) {
  z.pfeile.push({ x: x, y: y, vx: Math.cos(w) * ORB_TEMPO, vy: Math.sin(w) * ORB_TEMPO, schaden: schaden, orb: true });
}

// Gefahren ticken; am Ende wirkt der Kreis (Schaden) und fn laeuft (Orbs, Diener, Sturm).
function gefahrenSchritt(z, dt) {
  var sp = z.spieler;
  for (var i = z.gefahren.length - 1; i >= 0; i--) {
    var f = z.gefahren[i];
    if (f.flash > 0) { f.flash -= dt; if (f.flash <= 0) z.gefahren.splice(i, 1); continue; }
    f.t -= dt;
    if (f.t > 0) continue;
    if (f.typ === "kreis" && f.schaden > 0) {
      var dx = sp.x - f.x, dy = sp.y - f.y, rr = f.r + sp.radius;
      if (dx * dx + dy * dy < rr * rr) playerTreffer(sp, f.schaden, z);
    }
    if (f.fn) f.fn();
    f.t = 0; f.flash = 0.15;
  }
}

function dienerAnzahl(z) {
  var n = 0;
  for (var i = 0; i < z.gegner.length; i++) if (!z.gegner[i].tot && z.gegner[i].art !== "ambros") n++;
  return n;
}

// ---- Angriffe --------------------------------------------------------------
function angriffSegen(g, z) {
  var n = [0, 3, 5, 7][g.stufe], w0 = g.blick, ox = g.x, oy = g.y - 12, sch = g.stufe >= 3 ? 2 : 1;
  g.pause = 0.75;
  for (var i = 0; i < n; i++) {
    var w = w0 + (i - (n - 1) / 2) * 0.3;
    gefahr(z, { typ: "linie", x: ox, y: oy, w: w, len: 280, dauer: 0.7,
                fn: (function (ww) { return function () { orb(z, ox, oy, ww, sch); }; })(w) });
  }
}
function angriffSchlag(g, z) {
  g.pause = 0.85;
  gefahr(z, { typ: "kreis", x: g.x, y: g.y, r: [0, 70, 90, 110][g.stufe], dauer: 0.75, schaden: 2 });
}
function angriffRing(g, z) {
  var n = g.stufe >= 3 ? 14 : 10, ox = g.x, oy = g.y - 12, off = Math.random() * 6.28, sch = g.stufe >= 3 ? 2 : 1;
  g.pause = 0.8;
  gefahr(z, { typ: "kreis", x: ox, y: g.y, r: 34, dauer: 0.7, schaden: 0, warn: true,
              fn: function () { for (var i = 0; i < n; i++) orb(z, ox, oy, off + i / n * 6.2832, sch); } });
}
function angriffAnsturm(g, z) {
  var w = g.blick, ox = g.x, oy = g.y - 8;
  g.pause = 0.7;
  gefahr(z, { typ: "linie", x: ox, y: oy, w: w, len: 360, dauer: 0.7, breit: true,
              fn: function () { g.sturm = { vx: Math.cos(w) * 430, vy: Math.sin(w) * 430, t: 0.5, hit: false }; } });
}
function angriffAusbruch(g, z, sp) {
  g.pause = 0.9;
  for (var i = 0; i < 4; i++) {
    var x = sp.x + (i ? (Math.random() - 0.5) * 260 : 0), y = sp.y + (i ? (Math.random() - 0.5) * 260 : 0);
    if (!begehbar(z.ebene, Math.floor(x / KACHEL), Math.floor(y / KACHEL))) { x = sp.x; y = sp.y; }
    gefahr(z, { typ: "kreis", x: x, y: y, r: 44, dauer: 1.0, schaden: 2 });
  }
}
function angriffRuf(g, z) {
  g.pause = 1.0; g.ruf = BOSS_RUF_CD;
  for (var i = 0; i < 2; i++) {
    var x = g.x, y = g.y;
    for (var versuch = 0; versuch < 12; versuch++) {
      var w = Math.random() * 6.28, r = 70 + Math.random() * 60;
      var tx = g.x + Math.cos(w) * r, ty = g.y + Math.sin(w) * r;
      if (begehbar(z.ebene, Math.floor(tx / KACHEL), Math.floor(ty / KACHEL))) { x = tx; y = ty; break; }
    }
    gefahr(z, { typ: "kreis", x: x, y: y, r: 18, dauer: 0.9, schaden: 0, warn: true,
                fn: (function (sx, sy, art) { return function () {
                  var m = gegnerBasis(sx, sy, art, 1); m.zustand = "jagd"; m.keinXp = true; z.gegner.push(m); }; })(x, y, i ? "skelett" : "zombie") });
  }
}

function bossAngriff(g, z, sp, d) {
  var opts = ["segen"];
  if (d < 110) opts.push("schlag", "schlag");
  if (g.stufe >= 2) opts.push("ansturm", "ring");
  if (g.stufe >= 3) opts.push("ausbruch", "ausbruch");
  var wahl;
  if (g.ruf <= 0 && dienerAnzahl(z) < BOSS_DIENER_MAX) wahl = "ruf";
  else {
    var frei = opts.filter(function (o) { return o !== g.letzter; });
    wahl = (frei.length ? frei : opts)[Math.floor(Math.random() * (frei.length ? frei.length : opts.length))];
  }
  g.letzter = wahl; g.cd = BOSS_PAUSE_CD[g.stufe];
  if (wahl === "segen") angriffSegen(g, z);
  else if (wahl === "schlag") angriffSchlag(g, z);
  else if (wahl === "ring") angriffRing(g, z);
  else if (wahl === "ansturm") angriffAnsturm(g, z);
  else if (wahl === "ausbruch") angriffAusbruch(g, z, sp);
  else angriffRuf(g, z);
}

// Stufenwechsel: Welt steht still (Gespraech), Gefahren und Kugeln verschwinden.
function bossWandlung(g, z) {
  g.sperre = true; g.stufe++; g.mindest = g.stufe === 2 ? 20 : 0; g.sturm = null; g.pause = 0;
  z.gefahren = []; z.pfeile = []; z.schuettelMs = 600;
  for (var i = 0; i < z.kerzen.length; i++) z.kerzen[i].stufe = g.stufe;
  g.verwandelT = 1;
  dialogStart(g.stufe === 2 ? PHASE2 : PHASE3, null, function () { g.sperre = false; g.cd = 1.4; g.ruf = Math.min(g.ruf, 3); });
}

// Ein Schritt des Bosses (aufgerufen aus gegnerSchritt, art "ambros").
function bossSchritt(g, z, ebene, sp, d, dt) {
  if (!g.aktiv || g.sperre) return;
  if (g.verwandelT > 0) g.verwandelT -= dt;
  if (g.flucht) { if (g.leben <= g.mindest) { verfolgerFlieht(g, z); return; } }
  else if (g.stufe < 3 && g.leben <= g.mindest) { bossWandlung(g, z); return; }
  g.ruf -= dt;

  if (g.sturm) {                                       // Ansturm: gerade Linie, ein Treffer
    var s = g.sturm;
    bewegeGegner(g, ebene, s.vx * dt, s.vy * dt);
    var dx = sp.x - g.x, dy = sp.y - g.y, rr = g.radius + sp.radius + 4;
    if (!s.hit && dx * dx + dy * dy < rr * rr) { s.hit = true; playerTreffer(sp, 2, z); }
    s.t -= dt;
    if (s.t <= 0) g.sturm = null;
    return;
  }
  if (g.pause > 0) { g.pause -= dt; return; }          // steht still, solange Ankuendigungen laufen

  var halten = BOSS_ABSTAND[g.stufe], tempo = g.tempo + (g.stufe - 1) * 16;
  var vx = Math.cos(g.blick), vy = Math.sin(g.blick);
  if (g.flucht) {                                      // Verfolger: um Ecken herum (wege.js), zurueckweichen ohne Wand
    if (d > halten + 25) gehZu(g, ebene, sp.x, sp.y, dt, tempo);
    else if (d < halten - 25) weicheAus(g, ebene, sp, dt, tempo);
  } else {
    if (d < halten - 25) { vx = -vx; vy = -vy; } else if (d <= halten + 25) { vx = 0; vy = 0; }
    if (vx !== 0 || vy !== 0) bewegeGegner(g, ebene, vx * tempo * dt, vy * tempo * dt);
  }
  g.cd -= dt;
  if (g.cd <= 0) bossAngriff(g, z, sp, d);
}

// Tod des Bosses -> Sieg-Text; wird jeden Schritt in dungeonSchritt geprueft.
function bossPruefeEnde(z) {
  if (!z.ebene.kammer || z.ziel) return;
  var b = bossVon(z);
  if (!b || !b.tot) return;
  z.ziel = true; z.gefahren = []; z.pfeile = [];
  for (var i = 0; i < z.gegner.length; i++) z.gegner[i].tot = true;   // Diener fallen mit ihm
  dialogStart(kammerSieg(HELD), null, insTitel);
}

// Die Kammer als eigene Karte: runder Saal, Mitte (25,25), Radius 10 Kacheln.
function baueKammer() {
  var feld = [], x, y, cx = 25, cy = 25, R = 10;
  for (y = 0; y < RASTER; y++) {
    feld.push([]);
    for (x = 0; x < RASTER; x++) {
      var dx = x - cx + 0.5, dy = y - cy + 0.5;
      feld[y].push(dx * dx + dy * dy <= R * R ? 1 : 0);
    }
  }
  return { feld: feld, raeume: [{ x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, cx: cx, cy: cy }],
           start: { x: cx, y: cy + 4 }, treppe: { x: 0, y: 0 }, ebenenNr: 3, kammer: true };
}

// Ein Schritt aller Gefahren und Pruefungen (aus dungeonSchritt).
function bossWeltSchritt(z, dt) {
  gefahrenSchritt(z, dt);
  bossPruefeEnde(z);
}
