// faehigkeiten.js — Wirkung der aktiven Klassenfaehigkeiten (skillRechtsklick in klassen.js ruft skillAusfuehren).
// Jede Faehigkeit hat eine eigene Form und eine eigene Zeichnung (effekte.js):
//   Krieger:  Wuchtschlag (Hiebbogen), Wirbelklinge (kreisende Klingen), Bruellen (Schallringe), Todesstoss (Stoss)
//   Druide:   Wurzelklinge (Wurzeln am Gegner), Heilkraut (Funken), Blaetterwurf (Blaetter), Baerengestalt (baer.js), Wolfsprung (Spur)
//   Zauberer: Blitzstrahl (Strahl entlang der Zielrichtung), Arkanwelle (Druckwelle im Kegel), Lambertsegen (Funken),
//             Heiligenlicht (Lichtkranz), Sperrkreis (Runenkreis am Zielpunkt), Sturmkontakt (Blitze von oben)
// Kein Modul; globale Funktionen. Nutzt klassen.js, effekte.js, gegner.js (schadenGegner), kampf.js (imSchlagbogen, popup).

// ---- Konstanten zum Nachjustieren -------------------------------------
var BLITZ_REICHWEITE = 300;       // px, +30 je Rang
var WELLE_REICHWEITE = 150;       // px, +10 je Rang
var WELLE_HALB = 0.75;            // halber Oeffnungswinkel des Kegels (rad)
var SPERR_REICHWEITE = 220;       // wie weit vom Zauberer der Kreis liegen darf
var SPERR_DAUER = 3.5;            // s
var STURM_REICHWEITE = 420;       // px
var SPRUNG_REICHWEITE = 140;      // px, +SPRUNG_PLUS je Rang (Wolfsprung)
var SPRUNG_PLUS = 30, SPRUNG_MIN = 70, SPRUNG_DAUER = 0.42, SPRUNG_HOEHE = 34;
var SPRUNG_LANDUNG = 70;          // px Radius der Landung
// -----------------------------------------------------------------------

// Zielpunkt der Maus in Weltpixeln (2D); in 3D: ein Stueck vor dem Helden.
function zielPunkt(sp) {
  if (DREI_D) return { x: sp.x + Math.cos(sp.blick) * 140, y: sp.y + Math.sin(sp.blick) * 140 };
  var cam = kamera(BILD_B, BILD_H, sp);
  return { x: MAUS.x / ZOOM + cam.x, y: MAUS.y / ZOOM + cam.y };
}

function skillAusfuehren(sp, z, id) {
  var r = sp.skills.stufen[id] || 1, i, g, w = sp.blick, fy = sp.y - 12;
  if (id === "wuchtschlag") {                            // Schwerer Schlag
    var d = (sp.komboT > 0 && sp.kombo === 3) ? 3 : 2;   // Nach Kombo: noch hart
    d += r;
    var wb = KOMBO_BOGEN + 0.25;
    for (i = 0; i < z.gegner.length; i++) {
      g = z.gegner[i];
      if (g.tot || !imSchlagbogen(sp, g, wb)) continue;
      schadenGegner(g, d, z, { bricht: true });
      var wg = Math.atan2(g.y - sp.y, g.x - sp.x);
      g.kvx += Math.cos(wg) * 380; g.kvy += Math.sin(wg) * 380;
    }
    fxNeu(z, { art: "bogen", x: sp.x, y: fy, w: w, halb: wb, r: (sp.reichweite || KOMBO_REICHWEITE) + 8, dauer: 0.3, farbe: "255,210,110", breite: 5 });
    trefferFeedback(z); sfx("schwung3");
  } else if (id === "wirbelklinge") {                    // Rundumschlag
    var rr = (sp.reichweite || KOMBO_REICHWEITE) + 26;
    var traf = false;
    for (i = 0; i < z.gegner.length; i++) {
      g = z.gegner[i];
      if (g.tot) continue;
      var dx = g.x - sp.x, dy = g.y - sp.y;
      if (dx * dx + dy * dy > rr * (rr + g.radius * 1.5)) continue;
      schadenGegner(g, 1 + r, z, { bricht: true }); traf = true;
    }
    fxNeu(z, { art: "ring", wirbel: true, x: sp.x, y: fy, r0: rr * 0.55, r1: rr, dauer: 0.35, farbe: "225,230,245", breite: 5 });
    if (traf) trefferFeedback(z);
    sfx("schwung3");
  } else if (id === "bruellen") {                        // Schrei: Gegner erstarren, drei Schallringe
    var dauer = STUN_DAUER * r;
    for (i = 0; i < z.gegner.length; i++) {
      g = z.gegner[i];
      if (g.tot) continue;
      var bx = g.x - sp.x, by = g.y - sp.y;
      if (bx * bx + by * by < 200 * 200) { g.gebRem = Math.max(g.gebRem || 0, dauer); }
    }
    for (i = 0; i < 3; i++) fxNeu(z, { art: "ring", x: sp.x, y: fy, r0: 14 + i * 10, r1: 200 - i * 20, dauer: 0.45 + i * 0.1, farbe: "255,165,80", breite: 4 });
    z.schuettelMs = 160; sfx("wandlung");
  } else if (id === "todesstoss") {                      // Vernichtungsschlag: langer Stoss
    for (i = 0; i < z.gegner.length; i++) {
      g = z.gegner[i];
      if (g.tot || !imSchlagbogen(sp, g, KOMBO_BOGEN + 0.4)) continue;
      schadenGegner(g, 6 + r, z, { bricht: true });
    }
    fxNeu(z, { art: "bogen", x: sp.x, y: fy, w: w, halb: KOMBO_BOGEN + 0.4, r: (sp.reichweite || KOMBO_REICHWEITE) + 14, dauer: 0.4, farbe: "255,80,60", breite: 6 });
    trefferFeedback(z); z.schuettelMs = 140; sfx("schwung3");
  } else if (id === "wurzelklinge") {                    // Wurzeln brechen unter den Gegnern auf
    var rw = (sp.reichweite || KOMBO_REICHWEITE) + 20;
    for (i = 0; i < z.gegner.length; i++) {
      g = z.gegner[i];
      if (g.tot) continue;
      var wx = g.x - sp.x, wy = g.y - sp.y;
      if (wx * wx + wy * wy > rw * rw) continue;
      schadenGegner(g, 2 + r, z);
      var ww = Math.atan2(wy, wx);
      g.kvx += Math.cos(ww) * 320; g.kvy += Math.sin(ww) * 320;
      fxNeu(z, { art: "wurzeln", x: g.x, y: g.y, dauer: 0.6 });
    }
    fxNeu(z, { art: "ring", x: sp.x, y: sp.y, r0: 10, r1: rw, dauer: 0.3, farbe: "120,160,70", breite: 3 });
    trefferFeedback(z); sfx("schwung3");
  } else if (id === "heilkraut" || id === "lambertsegen") {
    var heil = id === "heilkraut" ? 1 + r : r;
    sp.leben = Math.min(sp.lebenMax, sp.leben + heil);
    popup(z, sp.x, sp.y - 40, "+" + heil, "#7ad06a"); sfx("buch");
    fxNeu(z, { art: "funken", x: sp.x, y: sp.y, dauer: 0.9, farbe: id === "heilkraut" ? "130,230,120" : "255,225,130" });
  } else if (id === "blaetterwurf") {                    // 3 Projektile
    var winkel = sp.blick - 0.35;
    for (var k = 0; k < 3; k++) {
      z.pfeile.push({ x: sp.x, y: sp.y - 8, vx: Math.cos(winkel + k * 0.35) * 380, vy: Math.sin(winkel + k * 0.35) * 380,
                      schaden: 1 + Math.floor(r / 2), blatt: true, vonSpieler: true });
    }
    sfx("axt");
  } else if (id === "baerenschlag") {                    // Verwandlung in den Baeren (baer.js)
    baerStart(sp, z);
  } else if (id === "wolfsprung") {                      // Raubtiersprung: Bogen zum Zielpunkt, Prankenhieb im Flug, Erschuetterung bei der Landung
    var zp0 = zielPunkt(sp), sdx = zp0.x - sp.x, sdy = zp0.y - sp.y, sd = Math.sqrt(sdx * sdx + sdy * sdy), reach = SPRUNG_REICHWEITE + SPRUNG_PLUS * r;
    var sw = sd > 8 ? Math.atan2(sdy, sdx) : w, weite = Math.max(SPRUNG_MIN, Math.min(reach, sd));
    sp.sprung = { t: 0, dauer: SPRUNG_DAUER, vx: Math.cos(sw) * weite / SPRUNG_DAUER, vy: Math.sin(sw) * weite / SPRUNG_DAUER, r: r, getroffen: [], w: sw };
    sp.blick = sw; sp.unverw = Math.max(sp.unverw, SPRUNG_DAUER + 0.1);
    popup(z, sp.x, sp.y - 40, "Sprung", "#b08a4a"); sfx("wandlung");
  } else if (id === "blitzstrahl") {                     // Strahl entlang der Zielrichtung, durchschlaegt alle Gegner auf der Linie
    var len = BLITZ_REICHWEITE + 30 * r;
    var s = strahlLinie(z, sp.x, sp.y, w, len, 4);
    for (i = 0; i < s.getroffen.length; i++) {
      schadenGegner(s.getroffen[i], 2 + r, z, { durch: true });
      fxNeu(z, { art: "ring", x: s.getroffen[i].x, y: s.getroffen[i].y - 12, r0: 4, r1: 22, dauer: 0.2, farbe: "190,215,255", breite: 3 });
    }
    fxNeu(z, { art: "strahl", x: sp.x, y: fy, ex: s.ex, ey: s.ey - 12, dauer: 0.22, farbe: "150,190,255", breite: 3 });
    if (s.getroffen.length) trefferFeedback(z);
    sfx("nova");
  } else if (id === "arkanwell") {                       // Druckwelle im Kegel nach vorn, wirft Gegner zurueck
    var rk = WELLE_REICHWEITE + 10 * r;
    for (i = 0; i < z.gegner.length; i++) {
      g = z.gegner[i];
      if (g.tot) continue;
      var ax = g.x - sp.x, ay = g.y - sp.y, ad = Math.sqrt(ax * ax + ay * ay);
      if (ad > rk + g.radius) continue;
      if (ad > 8 && Math.abs(winkelDiff(Math.atan2(ay, ax), w)) > WELLE_HALB) continue;
      schadenGegner(g, 3 + r, z, { durch: true });
      if (g.art !== "ambros") { g.kvx += ax / (ad || 1) * 300; g.kvy += ay / (ad || 1) * 300; }
    }
    fxNeu(z, { art: "kegel", x: sp.x, y: fy, w: w, halb: WELLE_HALB, r: rk, dauer: 0.5, farbe: "170,110,255" });
    z.schuettelMs = 100; sfx("nova");
  } else if (id === "heiligenlicht") {                   // Lichtkranz: Schaden an allem Nahen, Untote erstarren
    var schaden = 2 * r;
    for (i = 0; i < z.gegner.length; i++) {
      g = z.gegner[i];
      if (g.tot) continue;
      var hx = g.x - sp.x, hy = g.y - sp.y;
      if (hx * hx + hy * hy > 180 * 180) continue;
      schadenGegner(g, schaden, z, { durch: true });
      if (g.art !== "spinne") g.gebRem = Math.max(g.gebRem || 0, STUN_DAUER * r);
    }
    fxNeu(z, { art: "kranz", x: sp.x, y: sp.y, r: 190, dauer: 0.6, farbe: "255,225,140" });
    z.blitzMs = 0.1; sfx("nova");
  } else if (id === "sperrkreis") {                      // Runenkreis am Zielpunkt: Schaden im Takt, drueckt Gegner hinaus
    var zp = zielPunkt(sp), zdx = zp.x - sp.x, zdy = zp.y - sp.y, zd = Math.min(SPERR_REICHWEITE, Math.sqrt(zdx * zdx + zdy * zdy)), zw = Math.atan2(zdy, zdx), zl = 0;
    while (zl < zd && begehbar(z.ebene, Math.floor((sp.x + Math.cos(zw) * (zl + 8)) / KACHEL), Math.floor((sp.y + Math.sin(zw) * (zl + 8)) / KACHEL))) zl += 8;
    fxNeu(z, { art: "zone", x: sp.x + Math.cos(zw) * zl, y: sp.y + Math.sin(zw) * zl, r: 58 + 5 * r, dauer: SPERR_DAUER, tick: 0.1, schaden: r, rueck: 420, farbe: "255,190,90" });
    sfx("nova");
  } else if (id === "sturmkontakt") {                    // Blitze von oben auf alle Gegner in Sicht
    var eb = z.ebene, sch = 4 + r, n = 0;
    for (i = 0; i < z.gegner.length; i++) {
      g = z.gegner[i];
      var sx = g.x - sp.x, sy = g.y - sp.y;
      if (g.tot || sx * sx + sy * sy > STURM_REICHWEITE * STURM_REICHWEITE || !sichtbar(eb, sp.x, sp.y, g.x, g.y)) continue;
      schadenGegner(g, sch, z, { durch: true }); n++;
      g.gebRem = Math.max(g.gebRem || 0, 0.5);
      fxNeu(z, { art: "himmel", x: g.x, y: g.y - 10, dauer: 0.35 + n * 0.02, farbe: "180,200,255" });
    }
    z.blitzMs = 0.12; z.schuettelMs = 160; if (n) trefferFeedback(z);
    sfx("nova");
  }
}

// Flug des Wolfsprungs: Bogen (sp.sprungH fuer die Zeichnung), Prankenhieb an allem unter dem Helden, Landung mit Erschuetterung.
function sprungSchritt(sp, z, ebene, dt) {
  var s = sp.sprung;
  if (!s) { sp.sprungH = 0; return; }
  s.t += dt;
  var p = Math.min(1, s.t / s.dauer);
  bewegeSpieler(sp, ebene, s.vx * dt, s.vy * dt);
  sp.sprungH = Math.sin(p * Math.PI) * SPRUNG_HOEHE;
  sp.unverw = Math.max(sp.unverw, 0.05);
  for (var i = 0; i < z.gegner.length; i++) {                         // im Flug: Hieb auf alles, was unter dem Helden durchgeht (einmal je Gegner)
    var g = z.gegner[i];
    if (g.tot || s.getroffen.indexOf(g) >= 0) continue;
    var dx = g.x - sp.x, dy = g.y - sp.y, rr = sp.radius + g.radius + 10;
    if (dx * dx + dy * dy > rr * rr) continue;
    s.getroffen.push(g);
    schadenGegner(g, 1 + s.r, z, { bricht: true });
    var q = Math.atan2(dy, dx) - s.w, seit = Math.sin(q) >= 0 ? 1 : -1;      // zur Seite wegstossen
    g.kvx += Math.cos(s.w + seit * 1.57) * 260; g.kvy += Math.sin(s.w + seit * 1.57) * 260;
    fxNeu(z, { art: "bogen", x: sp.x, y: sp.y - 12 - sp.sprungH, w: s.w + seit * 1.2, halb: 0.5, r: 30, dauer: 0.2, farbe: "255,210,150", breite: 3 });
    trefferFeedback(z);
  }
  if (p < 1) return;
  sp.sprung = null; sp.sprungH = 0;                                   // Landung
  var tr = false, n = 0;
  for (i = 0; i < z.gegner.length; i++) {
    g = z.gegner[i];
    if (g.tot) continue;
    var lx = g.x - sp.x, ly = g.y - sp.y, ld = Math.sqrt(lx * lx + ly * ly);
    if (ld > SPRUNG_LANDUNG + g.radius) continue;
    schadenGegner(g, 3 + s.r, z, { bricht: true }); tr = true; n++;
    if (g.art !== "ambros") { g.kvx += lx / (ld || 1) * 340; g.kvy += ly / (ld || 1) * 340; g.gebRem = Math.max(g.gebRem || 0, 0.6); }
  }
  fxNeu(z, { art: "ring", x: sp.x, y: sp.y, r0: 10, r1: SPRUNG_LANDUNG, dauer: 0.35, farbe: "200,160,100", breite: 5 });
  fxNeu(z, { art: "ring", x: sp.x, y: sp.y, r0: 6, r1: SPRUNG_LANDUNG * 0.7, dauer: 0.25, farbe: "255,235,200", breite: 3 });
  z.schuettelMs = 120; sfx("schwung3"); if (tr) trefferFeedback(z);
}
