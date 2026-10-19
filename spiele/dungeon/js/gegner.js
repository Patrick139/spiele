// gegner.js — Gegner: Zombie (langsam, viel Leben, Hieb mit roter
// Ankkuendigung) und Skelettbogenschuetze (haelt Abstand, Pfeil mit
// Ankkuendigung). Untaetig bis Sichtkontakt, dann verfolgen. Heiltrank-
// fallensaesst und Trinken per Q. Kein Modul; globale Funktionen.

// ---- Konstanten zum Nachjustieren ---------------------------------------
var SICHT = 320;            // Sichtkontakt in Pixeln (durch Wände blockiert)
var ZOMBIE_TEMPO = 52;      // Pixel pro Sekunde (basis, steigt je Ebene)
var ZOMBIE_REICH = 44;      // Hiebreichweite
var ZOMBIE_ANK = 0.5;       // Hieb kuendigt sich 0,5 s an
var SKELETT_TEMPO = 70;
var SKELETT_ABST_UNTEN = 150;   // naeher -> weicht zurueck
var SKELETT_ABST_OBEN = 240;    // weiter -> naeher heran
var SKELETT_ANK = 0.4;          // Pfeil-Ankkuendigung
var SKELETT_PAUSE = 0.5;        // nach jedem Schuss so lange bewegen statt zielen
var PFEIL_TEMPO = 260;
var KNOFF_REIBUNG = 8;          // Rueckstoß klingt exponentiell ab
var TRANK_CHANCE = 0.45;        // Chance auf Heiltrank beim Tod
var TRANK_HEILUNG = 3;
var TRANK_RADIUS = 26;          // Q wirkt in der Naehe eines Tranks
var SPINNE_TEMPO = 95;          // Schnell, aber schwach: nur Nahkampf, Hieb ohne Vorwarnung
var SPINNE_ANK = 0.35;
// -------------------------------------------------------------------------

var GEGNER_ID = 0;

function gegnerBasis(x, y, art, ebeneNr) {
  GEGNER_ID++;
  var g = {
    id: GEGNER_ID, art: art, x: x, y: y,
    zustand: "idle",      // idle | jagd | ank | hieb
    t: 0,                 // Timer des aktuellen Zustands
    blick: 0, kvx: 0, kvy: 0, tot: false, trefferBlink: 0,
    ebene: ebeneNr
  };
  var n = ebeneNr;        // Staerke skaliert mit der Ebene
  if (art === "zombie") {
    g.radius = 12;
    g.leben = 4 + 2 * (n - 1);
    g.schaden = 1 + n;
    g.tempo = ZOMBIE_TEMPO + 8 * (n - 1);
  } else if (art === "spinne") {
    g.radius = 9;
    g.leben = 2 + (n - 1);        // sehr schwach, aber schnell
    g.schaden = 1;
    g.tempo = SPINNE_TEMPO + 10 * (n - 1);
  } else if (NEUE_ARTEN[art]) {
    neueArtWerte(g, art, n);                                          // gegner2.js: Schildtraeger, Brecher, Beschwoerer
  } else if (art === "ambros") {
    g.radius = 16; g.leben = BOSS_LEBEN; g.schaden = 2; g.tempo = 60;   // Werte: boss.js
  } else {
    g.radius = 11;
    g.leben = 2 + 2 * (n - 1);
    g.schaden = 1 + Math.floor(n / 2);
    g.tempo = SKELETT_TEMPO + 8 * (n - 1);
  }
  g.lebenMax = g.leben;
  return g;
}

// Gegner je Raum: Anzahl und Arten nach Raumtyp und Ebene (gegner2.js raumBesatzung). Startraum und Kapelle bleiben leer.
function erzeugeGegner(ebene, ebeneNr, startPunkt) {
  var gegner = [];
  for (var r = 0; r < ebene.raeume.length; r++) {
    var raum = ebene.raeume[r];
    if (startPunkt.x >= raum.x && startPunkt.x < raum.x + raum.w &&
        startPunkt.y >= raum.y && startPunkt.y < raum.y + raum.h) continue;
    if (raum.typ === "kapelle") continue;                                        // Erholungsraum: leer (raeume.js)
    var arten = raumBesatzung(raum, ebeneNr), eliteNoch = raum.typ === "schluessel", erste = gegner.length;
    for (var i = 0; i < arten.length; i++) {
      var gx = 0, gy = 0, ok = false;
      for (var v = 0; v < 10 && !ok; v++) {                                      // freies Feld im Raum suchen
        gx = zufall(raum.x + 1, raum.x + raum.w - 2); gy = zufall(raum.y + 1, raum.y + raum.h - 2);
        ok = begehbar(ebene, gx, gy);
      }
      if (!ok) continue;
      var gg = gegnerBasis((gx + 0.5) * KACHEL, (gy + 0.5) * KACHEL, arten[i], ebeneNr);
      if (eliteNoch && arten[i] !== "spinne") { eliteMachen(gg); eliteNoch = false; }      // Wache des Schluessels
      gegner.push(gg);
    }
    if (raum.typ === "horde" && gegner.length > erste) gegner[gegner.length - 1].sichererTrank = true;
  }
  return gegner;
}

// Sichtkontakt: gerader Strahl, durch Fels blockiert (DDA ueber das Raster).
function sichtbar(ebene, x1, y1, x2, y2) {
  var dx = x2 - x1, dy = y2 - y1;
  var d = Math.sqrt(dx * dx + dy * dy);
  if (d < 1) return true;
  var schritte = Math.ceil(d / (KACHEL / 2));
  for (var i = 1; i < schritte; i++) {
    var t = i / schritte;
    if (!begehbar(ebene, Math.floor((x1 + dx * t) / KACHEL),
                            Math.floor((y1 + dy * t) / KACHEL))) return false;
  }
  return true;
}

// Schaden an einem Gegner inkl. Schadenszahl; Tod -> eventuell Heiltrank.
// opt (optional): { durch: true } Zauber/Flaechen ignorieren das Schild; { bricht: true } schwere Schlaege zerbrechen es.
function schadenGegner(g, schaden, z, opt) {
  if (g.tot) return;
  if (g.art === "schildtraeger" && schildBlockt(g, z, opt)) return;   // Schild haelt (gegner2.js)
  if (g.benommen) schaden *= 2;                                       // Brecher nach dem Wandtreffer: doppelter Schaden
  if (g.art === "ambros") {                       // Boss: erst nach dem Gespraech verwundbar, Stufen nicht ueberspringen
    if (g.sperre || !g.aktiv) return;
    schaden = Math.min(schaden, g.leben - g.mindest);
    if (schaden <= 0) return;
  }
  g.leben -= schaden;
  g.trefferBlink = 0.12;
  popup(z, g.x, g.y - 26, zahlText(schaden), "#f2e6b0");
  if (g.leben <= 0) {
    g.tot = true;
    z.toetungen++;
    if (g.boss) waechterTod(g, z);
    if (g.art === "beschwoerer") dienerZerfallen(g, z);                // Diener zerfallen mit ihm (gegner2.js)
    xpFuerKill(g, z);                                // Erfahrung (fortschritt.js)
    if (g.elite || g.sichererTrank || Math.random() < TRANK_CHANCE)
      z.traenke.push({ x: g.x, y: g.y });
    beuteFallen(z, g.x + 8, g.y + 6, g.boss ? "boss" : (g.elite ? "elite" : "normal"));   // Gegenstand (items.js)
  }
}

// Spieler bekommt Schaden; 0 wenn unverwundbar (Ausweichschritt).
// angreifer optional: Dornen-Passiv (klassen.js) trifft den Schaediger zurueck.
// Gibt true zurueck, wenn der Treffer wirklich saß.
function playerTreffer(sp, schaden, z, angreifer) {
  if (sp.unverw > 0 || z.tot) return false;
  schaden = Math.max(1, schaden - (sp.armor || 0) - baerVerteidigung(sp));   // Eisenhaut / Bannhueller / Moosfell / Baerengestalt
  sp.leben -= schaden;
  if (angreifer && (sp.dornen || 0) > 0) schadenGegner(angreifer, sp.dornen, z, { durch: true });
  popup(z, sp.x, sp.y - 34, "-" + schaden, "#e05a5a");
  trefferFeedback(z);
  z.blutMs = 320;                                  // roter Rand im Bild (hud.js)
  if (sp.leben <= 0) { sp.leben = 0; z.tot = true; z.tode = (z.tode || 0) + 1; }
  return true;
}

// Bewegung eines Gegners mit Wandkollision (beide Achsen getrennt).
function bewegeGegner(g, ebene, dx, dy) {
  if (dx !== 0 && !stoesstAn(ebene, g.x + dx, g.y, g.radius)) g.x += dx;
  if (dy !== 0 && !stoesstAn(ebene, g.x, g.y + dy, g.radius)) g.y += dy;
}

// Ein Simulationsschritt aller Gegner.
function gegnerSchritt(z, ebene, dt) {
  var sp = z.spieler;
  for (var i = 0; i < z.gegner.length; i++) {
    var g = z.gegner[i];
    if (g.tot) continue;
    if (g.trefferBlink > 0) g.trefferBlink -= dt;

    // Rueckstoß (dritter Komboschlag) klingt ab
    if (g.art !== "ambros" && (g.kvx !== 0 || g.kvy !== 0)) {
      bewegeGegner(g, ebene, g.kvx * dt, g.kvy * dt);
      var k = Math.exp(-KNOFF_REIBUNG * dt);
      g.kvx *= k; g.kvy *= k;
      if (Math.abs(g.kvx) < 5 && Math.abs(g.kvy) < 5) { g.kvx = 0; g.kvy = 0; }
    }

    var dx = sp.x - g.x, dy = sp.y - g.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var gegenSicht = d < SICHT && sichtbar(ebene, g.x, g.y, sp.x, sp.y);
    if (gegenSicht && g.zustand === "idle") g.zustand = "jagd";
    g.blick = Math.atan2(dy, dx);

    if (g.gebRem > 0) { g.gebRem -= dt; continue; }   // Bruellen/Heiligenlicht: Gegner erstarrt (klassen.js)
    if (g.art === "zombie") { schrittZombie(g, z, ebene, sp, d, dt); if (g.boss) waechterSchritt(g, z, d, dt); }
    else if (g.art === "spinne") schrittSpinne(g, z, ebene, sp, d, dt);
    else if (g.art === "ambros") bossSchritt(g, z, ebene, sp, d, dt);
    else if (g.art === "schildtraeger") schrittSchildtraeger(g, z, ebene, sp, d, dt);
    else if (g.art === "brecher") schrittBrecher(g, z, ebene, sp, d, dt);
    else if (g.art === "beschwoerer") schrittBeschwoerer(g, z, ebene, sp, d, dt);
    else schrittSkelett(g, z, ebene, sp, d, dt);
  }
}

// Zombie: verfolgen, dann Hieb mit 0,5 s roter Ankkuendigung.
function schrittZombie(g, z, ebene, sp, d, dt) {
  if (g.zustand === "jagd") {
    if (d > 2) gehZu(g, ebene, sp.x, sp.y, dt, g.tempo);             // um Ecken herum (wege.js)
    if (d < (g.reich || ZOMBIE_REICH) + sp.radius && sichtbar(ebene, g.x, g.y, sp.x, sp.y)) { g.zustand = "ank"; g.t = g.ankZeit || ZOMBIE_ANK; }
  } else if (g.zustand === "ank") {
    g.t -= dt;
    if (g.t <= 0) {
      g.zustand = "hieb"; g.t = 0.15;
      g.kvx += Math.cos(g.blick) * 170;                // Hieb: Schwung nach vorn
      g.kvy += Math.sin(g.blick) * 170;
      if (d < (g.reich || ZOMBIE_REICH) + sp.radius + 8) playerTreffer(sp, g.schaden, z);
    }
  } else if (g.zustand === "hieb") {
    g.t -= dt;
    if (g.t <= 0) g.zustand = "jagd";
  }
}

// Freie Schusslinie vom Gegner in Richtung w ueber die Strecke l (breit genug fuer den Pfeil).
function schussFrei(ebene, g, w, l) {
  var c = Math.cos(w), s = Math.sin(w), seit = [-4, 0, 4];            // Mitte und zwei Seitenlinien, fein abgetastet
  for (var k = 0; k < 3; k++) {
    var ox = -s * seit[k], oy = c * seit[k];
    for (var t = 6; t <= l; t += 6)
      if (!begehbar(ebene, Math.floor((g.x + ox + c * t) / KACHEL), Math.floor((g.y + oy + s * t) / KACHEL))) return false;
  }
  return true;
}

// Skelett: Sichtkontakt suchen (Wegfindung), Abstand halten, Pfeil mit 0,4 s Ankkuendigung (Richtung fixiert).
// Es schiesst nur, wenn die Schusslinie frei ist, und bricht ab, wenn sie waehrend der Ankuendigung zugeht.
function schrittSkelett(g, z, ebene, sp, d, dt) {
  var frei = d < SICHT + 80 && breitSichtbar(ebene, g.x, g.y, sp.x, sp.y, 4);
  if (g.zustand === "jagd") {
    if (g.pause > 0) g.pause -= dt;
    if (!frei) { gehZu(g, ebene, sp.x, sp.y, dt, g.tempo); return; }      // kein Sichtkontakt: Weg zum Spieler
    if (d < SKELETT_ABST_UNTEN) weicheAus(g, ebene, sp, dt, g.tempo);     // zu nah: zurueckweichen, ohne in die Wand zu laufen
    else if (d > SKELETT_ABST_OBEN) gehZu(g, ebene, sp.x, sp.y, dt, g.tempo);
    // dazwischen: stehen und zielen
    if (d < SKELETT_ABST_OBEN + 40 && !(g.pause > 0)) {
      g.zustand = "ank"; g.t = SKELETT_ANK;
      g.zielW = g.blick;            // Richtung wird bei Ankkuendigung fixiert
    }
  } else if (g.zustand === "ank") {
    g.t -= dt;
    if (!schussFrei(ebene, g, g.zielW, Math.min(d, SKELETT_ABST_OBEN) + 20)) {   // Linie zu: nicht in die Wand schiessen
      g.zustand = "jagd"; g.pause = 0.3; return;
    }
    if (g.t <= 0) {
      z.pfeile.push({ x: g.x, y: g.y,
        vx: Math.cos(g.zielW) * PFEIL_TEMPO, vy: Math.sin(g.zielW) * PFEIL_TEMPO,
        schaden: g.schaden });
      g.zustand = "jagd"; g.pause = SKELETT_PAUSE;                   // nach dem Schuss kurz neu positionieren
    }
  }
}

// Q: naechsten Heiltrank trinken, wenn Leben nicht voll.
function trinkFall(sp, z) {
  if (sp.leben >= sp.lebenMax) return false;
  for (var i = 0; i < z.traenke.length; i++) {
    var t = z.traenke[i];
    var dx = t.x - sp.x, dy = t.y - sp.y;
    if (dx * dx + dy * dy <= TRANK_RADIUS * TRANK_RADIUS) {
      z.traenke.splice(i, 1);
      var heil = sp.trank || TRANK_HEILUNG;
      sp.leben = Math.min(sp.lebenMax, sp.leben + heil);
      popup(z, sp.x, sp.y - 34, "+" + heil, "#6fd08a");
      return true;
    }
  }
  return false;
}

// Spinne: schnell, klein, umkreist und hebt immer wieder die Beine
// (Ankündigung), bevor sie zubeißt. Weicht ungeduldig seitwärts aus,
// wenn der Spieler sie zu nah heranlässt.
function schrittSpinne(g, z, ebene, sp, d, dt) {
  if (g.zustand === "jagd") {
    var t = ANIM + g.id * 1.9;
    if (d < 70 && Math.sin(t * 2.2) > 0.4) {                   // seitliches Umkreisen
      var w = Math.atan2(sp.y - g.y, sp.x - g.x) + Math.PI / 2;
      gehZu(g, ebene, g.x + Math.cos(w) * 30, g.y + Math.sin(w) * 30, dt, g.tempo);
      return;
    }
    if (d > 4) gehZu(g, ebene, sp.x, sp.y, dt, g.tempo);
    if (d < ZOMBIE_REICH * 0.8 && sichtbar(ebene, g.x, g.y, sp.x, sp.y)) {
      g.zustand = "ank"; g.t = SPINNE_ANK;
    }
  } else if (g.zustand === "ank") {
    g.t -= dt;
    if (g.t <= 0) {
      g.zustand = "hieb"; g.t = 0.1;
      if (d < ZOMBIE_REICH * 0.9 + sp.radius) playerTreffer(sp, g.schaden, z);
    }
  } else if (g.zustand === "hieb") {
    g.t -= dt;
    if (g.t <= 0) g.zustand = "jagd";
  }
}
