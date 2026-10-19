// gegner2.js — Gegner mit Aufgaben: Schildtraeger (Schild haelt Treffer von vorn ab), Brecher (Anlauf,
// Telegraph, laeuft in die Wand und ist dann benommen), Beschwoerer (ruft Skelette, bleibt hinten;
// stirbt er, zerfallen die Diener). Dazu die Besatzung der Raeume je Ebene (raumBesatzung).
// Kein Modul; globale Funktionen. Nutzt gegner.js (gegnerBasis, bewegeGegner, schrittZombie, schadenGegner),
// wege.js (gehZu, weicheAus, breitSichtbar), kampf.js (popup, trefferFeedback).

// ---- Konstanten zum Nachjustieren -------------------------------------
var SCHILD_BOGEN = 1.05;       // halber Winkel, in dem das Schild blockt (rad, ca. 60 Grad)
var SCHILD_DREH = 1.5;         // wie schnell das Schild dem Spieler folgt (rad/s) -> Umlaufen lohnt sich
var SCHILD_BRUCH = 1.8;        // s ungeschuetzt nach einem Schildbruch (3. Komboschlag, Wuchtschlag)
var BRECHER_ANK = 0.9;         // s Telegraph vor dem Sturm
var BRECHER_SPRUNG = 360;      // Sturmgeschwindigkeit (px/s)
var BRECHER_STRECKE = 330;     // laengster Sturm (px)
var BRECHER_BENOMMEN = 2.0;    // s benommen nach dem Wandtreffer (doppelter Schaden)
var BRECHER_ABKLING = 2.4;     // s zwischen zwei Stuermen
var BESCHW_RUF_ZEIT = 1.0;     // s Beschwoerung (Kreis am Boden)
var BESCHW_ABKLING = 7.5;      // s zwischen zwei Rufen
var BESCHW_MAX_DIENER = 4;     // gleichzeitig lebende Diener je Beschwoerer
var NEUE_ARTEN = { schildtraeger: 1, brecher: 1, beschwoerer: 1 };
// -----------------------------------------------------------------------

function winkelDiff(a, b) { var w = a - b; while (w > Math.PI) w -= TAU; while (w < -Math.PI) w += TAU; return w; }

// Werte der neuen Arten (gegner.js gegnerBasis ruft; n = Ebene).
function neueArtWerte(g, art, n) {
  if (art === "schildtraeger") { g.radius = 12; g.leben = 4 + 2 * (n - 1); g.schaden = 1 + Math.ceil(n / 2); g.tempo = 54 + 6 * (n - 1); g.reich = 40; g.schildW = 0; g.schildDown = 0; }
  else if (art === "brecher") { g.radius = 14; g.leben = 7 + 3 * (n - 1); g.schaden = 2 + n; g.tempo = 44 + 4 * (n - 1); g.reich = 46; g.sturmCd = 1.5; }
  else { g.radius = 10; g.leben = 3 + (n - 1); g.schaden = 1; g.tempo = 62; g.rufT = 2.5 + Math.random() * 2; }   // beschwoerer
}

// ---- Schildtraeger ------------------------------------------------------------
function schrittSchildtraeger(g, z, ebene, sp, d, dt) {
  var w = Math.atan2(sp.y - g.y, sp.x - g.x);
  if (g.schildW === undefined || g.zustand === "idle") g.schildW = w;
  var df = winkelDiff(w, g.schildW), m = SCHILD_DREH * dt;
  g.schildW += Math.max(-m, Math.min(m, df));                       // dreht nur langsam: von der Seite kommt man hin
  if (g.blockT > 0) g.blockT -= dt;
  if (g.schildDown > 0) { g.schildDown -= dt; return; }              // Schild gebrochen: benommen, kann nichts tun
  schrittZombie(g, z, ebene, sp, d, dt);                             // Schildstoss wie der Hieb eines Zombies
}
// Blockt das Schild einen Treffer des Spielers? (gegner.js schadenGegner ruft; opt: { durch, bricht })
function schildBlockt(g, z, opt) {
  if (g.art !== "schildtraeger" || g.schildDown > 0 || (opt && opt.durch)) return false;
  var sp = z.spieler, w = Math.atan2(sp.y - g.y, sp.x - g.x);
  if (Math.abs(winkelDiff(w, g.schildW || 0)) >= SCHILD_BOGEN) return false;       // Flanke oder Ruecken: trifft
  if (opt && opt.bricht) {
    g.schildDown = SCHILD_BRUCH; g.zustand = "jagd"; g.t = 0;
    g.kvx += Math.cos(w + Math.PI) * 240; g.kvy += Math.sin(w + Math.PI) * 240;
    popup(z, g.x, g.y - 34, "Schild gebrochen!", "#ffd75a"); sfx("treffer");
    return true;
  }
  g.blockT = 0.18;
  popup(z, g.x, g.y - 30, "Geblockt", "#9aa0b0"); sfx("hurt");
  return true;
}

// ---- Brecher ----------------------------------------------------------------------
function schrittBrecher(g, z, ebene, sp, d, dt) {
  if (g.sturmCd > 0) g.sturmCd -= dt;
  if (g.zustand === "jagd") {
    if (d > 2) gehZu(g, ebene, sp.x, sp.y, dt, g.tempo);
    var sicht = sichtbar(ebene, g.x, g.y, sp.x, sp.y);
    if (d < g.reich + sp.radius && sicht) { g.zustand = "ank"; g.t = 0.6; g.nah = true; }                      // nah: normaler Schlag
    else if (d > 90 && d < 320 && g.sturmCd <= 0 && breitSichtbar(ebene, g.x, g.y, sp.x, sp.y, 8)) {
      g.zustand = "ank"; g.t = BRECHER_ANK; g.nah = false; g.zielW = g.blick;
    }
  } else if (g.zustand === "ank") {
    g.t -= dt;
    if (!g.nah && g.t > 0.35) g.zielW = Math.atan2(sp.y - g.y, sp.x - g.x);   // zielt zuerst mit, dann fest: Ausweichen mit Leertaste/Seitenschritt
    if (g.t <= 0) {
      if (g.nah) {
        if (d < g.reich + sp.radius + 10) playerTreffer(sp, g.schaden, z, g);
        g.zustand = "jagd";
      } else { g.zustand = "sturm"; g.strecke = 0; g.getroffen = false; }
    }
  } else if (g.zustand === "sturm") {
    var s = BRECHER_SPRUNG * dt, x0 = g.x, y0 = g.y;
    bewegeGegner(g, ebene, Math.cos(g.zielW) * s, Math.sin(g.zielW) * s);
    var bewegt = Math.sqrt((g.x - x0) * (g.x - x0) + (g.y - y0) * (g.y - y0));
    g.strecke += bewegt;
    var dx = sp.x - g.x, dy = sp.y - g.y;
    if (!g.getroffen && Math.sqrt(dx * dx + dy * dy) < g.radius + sp.radius + 4) {
      g.getroffen = true;
      if (playerTreffer(sp, g.schaden + 1, z, g)) { sp.x += Math.cos(g.zielW) * 14; sp.y += Math.sin(g.zielW) * 14; }
    }
    if (bewegt < s * 0.4) {                                                    // Wand: benommen
      g.zustand = "benommen"; g.t = BRECHER_BENOMMEN; g.benommen = true; z.schuettelMs = 220;
      popup(z, g.x, g.y - 40, "Benommen!", "#ffd75a"); sfx("wandlung");
    } else if (g.strecke >= BRECHER_STRECKE) { g.zustand = "erholung"; g.t = 0.8; }
  } else if (g.zustand === "benommen") {
    g.t -= dt;
    if (g.t <= 0) { g.benommen = false; g.zustand = "jagd"; g.sturmCd = BRECHER_ABKLING; }
  } else if (g.zustand === "erholung") {
    g.t -= dt;
    if (g.t <= 0) { g.zustand = "jagd"; g.sturmCd = BRECHER_ABKLING; }
  }
}

// ---- Beschwoerer ---------------------------------------------------------------------
function dienerAnzahl(z, g) { var n = 0; for (var i = 0; i < z.gegner.length; i++) if (z.gegner[i].herr === g.id && !z.gegner[i].tot) n++; return n; }
function schrittBeschwoerer(g, z, ebene, sp, d, dt) {
  if (g.zustand === "jagd") {
    var sicht = sichtbar(ebene, g.x, g.y, sp.x, sp.y);
    if (d < 150) weicheAus(g, ebene, sp, dt, g.tempo * 1.15);
    else if (d > 250 || !sicht) gehZu(g, ebene, sp.x, sp.y, dt, g.tempo);
    g.rufT -= dt;
    if (g.rufT <= 0 && sicht && d < SICHT + 60 && dienerAnzahl(z, g) < BESCHW_MAX_DIENER) { g.zustand = "ank"; g.t = BESCHW_RUF_ZEIT; }
  } else if (g.zustand === "ank") {
    g.t -= dt;
    if (g.t <= 0) {
      var gerufen = 0;
      for (var v = 0; v < 30 && gerufen < 2 && dienerAnzahl(z, g) < BESCHW_MAX_DIENER; v++) {
        var a = Math.random() * TAU, r = 26 + Math.random() * 16, x = g.x + Math.cos(a) * r, y = g.y + Math.sin(a) * r;
        if (stoesstAn(ebene, x, y, 11) || !sichtbar(ebene, g.x, g.y, x, y)) continue;
        var m = gegnerBasis(x, y, "skelett", g.ebene); m.zustand = "jagd"; m.keinXp = true; m.herr = g.id; z.gegner.push(m); gerufen++;
      }
      if (gerufen) popup(z, g.x, g.y - 40, "Ruf!", "#c09aff");
      g.zustand = "jagd"; g.rufT = BESCHW_ABKLING;
    }
  }
}
// Stirbt der Beschwoerer, zerfallen seine Diener (gegner.js schadenGegner ruft).
function dienerZerfallen(g, z) {
  var n = 0;
  for (var i = 0; i < z.gegner.length; i++) if (z.gegner[i].herr === g.id && !z.gegner[i].tot) { z.gegner[i].tot = true; n++; }
  if (n) popup(z, g.x, g.y - 44, "Die Diener zerfallen", "#c09aff");
}

// ---- Besatzung der Raeume je Ebene ---------------------------------------------------------
// Ebene 1 fuehrt den Schildtraeger ein, 2 den Brecher, 3 den Beschwoerer; spaeter mischt alles.
// Rueckgabe: Liste von Arten fuer den Raum (raum.typ siehe raeume.js).
function raumBesatzung(raum, nr) {
  var neu = ["schildtraeger", "brecher", "beschwoerer"][nr - 1];
  var alt = ["schildtraeger", "brecher", "beschwoerer"].slice(0, nr - 1);
  function grund() { return Math.random() < 0.35 + 0.1 * (nr - 1) ? "skelett" : (Math.random() < 0.15 + 0.1 * (nr - 1) ? "spinne" : "zombie"); }
  var n = zufall(2, 4), l = [], i;
  if (raum.typ === "horde") {                                      // Lager: Masse plus ein Sonderling
    n = zufall(HORDE_MIN, HORDE_MAX);
    for (i = 0; i < n - 1; i++) l.push(grund());
    l.push(neu);
  } else if (raum.typ === "schatz") {                              // Wache: zwei Neue Seite an Seite, Rest Grund
    l = [neu, alt.length ? alt[zufall(0, alt.length - 1)] : "skelett", grund()];
    if (nr >= 2) l.push(grund());
  } else if (raum.typ === "schluessel") {                          // Elite ist die neue Art (gegner.js macht sie dazu)
    l = [neu, grund(), grund()];
  } else {                                                         // normal: mit Wahrscheinlichkeit ein Sonderling
    for (i = 0; i < n; i++) l.push(grund());
    var r = Math.random();
    if (r < 0.28) l[0] = neu;
    else if (r < 0.40 && alt.length) l[0] = alt[zufall(0, alt.length - 1)];
    if (nr === 3 && l[0] === "beschwoerer" && n >= 3) l[1] = "schildtraeger";      // Kombination: Schild schuetzt den Rufer
  }
  return l;
}
