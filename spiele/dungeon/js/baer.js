// baer.js — Baerengestalt des Druiden (Faehigkeit "Baerenschlag", klassen.js): Wirkung und Zeichnung.
// Der Held verwandelt sich sichtbar (Ueberblendung mit Blaetterwirbel) in einen Baeren und am Ende zurueck.
// In der Gestalt: mehr Nahkampfschaden, mehr Reichweite, Verteidigung (weniger Schaden je Treffer),
// etwas schneller; Zauber (Heilkraut, Blaetterwurf) gehen nicht. Kein Modul; globale Funktionen.
// Nutzt sprites.js (ell, kr, poly, lin, schatten, glut), klassen.js (skills.dauer/stufen).

// ---- Konstanten zum Nachjustieren -------------------------------------
var BAER_DAUER = 8;         // s Grundzeit, +1 s je Rang
var BAER_SCHADEN = 3;       // Zusatzschaden im Nahkampf, +1 je Rang
var BAER_VERTEIDIGUNG = 1;  // Schaden weniger je Treffer, +1 je Rang (zusaetzlich zu Moosfell)
var BAER_REICHWEITE = 14;   // Pixel mehr Reichweite
var BAER_TEMPO = 1.12;      // Lauftempo-Faktor
var BAER_WANDEL = 0.55;     // s fuer die Verwandlung (Ueberblendung)
var BAER_BRUELL = 1.2;      // s: Gegner nahe am Wandlungsort erstarren kurz
// -----------------------------------------------------------------------

function baerAktiv(sp) { return !!(sp.skills && (sp.skills.dauer.baerenschlag || 0) > 0); }
function baerRang(sp) { return sp.skills.stufen.baerenschlag || 0; }
function baerSchaden(sp) { return baerAktiv(sp) ? BAER_SCHADEN + baerRang(sp) : 0; }
function baerVerteidigung(sp) { return baerAktiv(sp) ? BAER_VERTEIDIGUNG + baerRang(sp) : 0; }

// Beginn der Gestalt (klassen.js ruft): Zeit setzen, Gegner in der Naehe erschrecken.
function baerStart(sp, z) {
  sp.skills.dauer.baerenschlag = BAER_DAUER + baerRang(sp);
  popup(z, sp.x, sp.y - 48, "Bärengestalt!", "#c89a5a");
  for (var i = 0; i < z.gegner.length; i++) {
    var g = z.gegner[i];
    if (g.tot || g.art === "ambros" || g.boss) continue;
    var dx = g.x - sp.x, dy = g.y - sp.y;
    if (dx * dx + dy * dy < 110 * 110) g.gebRem = Math.max(g.gebRem || 0, BAER_BRUELL);
  }
  sfx("wandlung");
}

// Pro Schritt (klassenSchritt ruft): Ueberblendung, Reichweite, Tempo, Ende melden.
function baerSchritt(sp, z, dt) {
  var an = baerAktiv(sp), war = !!sp.baerWar;
  sp.baerWar = an;
  if (war && !an) { popup(z, sp.x, sp.y - 48, "Menschengestalt", "#b9b196"); sfx("wandlung"); }
  sp.baerWeich = Math.max(0, Math.min(1, (sp.baerWeich || 0) + (an ? 1 : -1) * dt / BAER_WANDEL));
  sp.reichweite = sp.held.reichweite + (sp.itemReich || 0) + (sp.baerWeich > 0.5 ? BAER_REICHWEITE : 0);
  sp.formTempo = sp.baerWeich > 0.5 ? BAER_TEMPO : 1;
}

// ---- Zeichnen --------------------------------------------------------------
// Statt heldZeichnen: Mensch, Baer oder Ueberblendung dazwischen (grafik.js spielerZeichnen ruft).
function figurZeichnen(ctx, px, py, sp) {
  var w = sp.baerWeich || 0;
  if (w <= 0) { heldZeichnen(ctx, px, py, sp, sp.held); return; }
  if (w >= 1) { baerZeichnen(ctx, px, py, sp, 1); return; }
  var puls = 1 + Math.sin(w * Math.PI) * 0.12;             // kurzes Aufblaehen in der Mitte der Wandlung
  ctx.save(); ctx.globalAlpha = 1 - w; ctx.translate(px, py); ctx.scale(puls, puls); heldZeichnen(ctx, 0, 0, sp, sp.held); ctx.restore();
  ctx.save(); ctx.globalAlpha = w; ctx.translate(px, py); ctx.scale(puls, puls); baerZeichnen(ctx, 0, 0, sp, w); ctx.restore();
  glut(ctx, px, py - 16, 40, "140,210,100", Math.sin(w * Math.PI) * 0.6);   // gruener Schein
  for (var i = 0; i < 9; i++) {                            // Blaetterwirbel
    var a = i / 9 * TAU + w * 7, r = 8 + Math.sin(w * Math.PI) * 20 + i % 3 * 3, y = py - 16 - w * 8 + Math.sin(a * 2) * 5;
    ctx.save(); ctx.translate(px + Math.cos(a) * r, y + Math.sin(a) * r * 0.5); ctx.rotate(a * 2);
    poly(ctx, [-4, 0, 0, -2.4, 4, 0, 0, 2.4], i % 2 ? "#7ab04a" : "#9acb62"); ctx.restore();
  }
}

// Der Baer: Seitenansicht, schaut nach links/rechts (cos(blick)); 1,35-fach so gross wie ein Mensch.
function baerZeichnen(ctx, sx, sy, sp, deckung) {
  var bl = sp.blick || 0, rich = Math.cos(bl) >= 0 ? 1 : -1, t = sp.gehT || 0, geht = !!sp.geht;
  var bob = geht ? Math.abs(Math.sin(t * 9)) * 1.6 : Math.sin(ANIM * 1.6) * 0.6;
  var fell = "#6b4a2a", dunkel = "#4a3019", hell = "#8a6238", schnauze = "#b89868";
  ctx.save(); ctx.translate(sx, sy); ctx.scale(rich * 1.35, 1.35);
  if (sp.dodgeT > 0) ctx.globalAlpha *= 0.6;
  schatten(ctx, 0, 0, 17);
  var bein = function (x, ph, farbe) {                     // Beine: Gegenschritt beim Gehen
    var s = geht ? Math.sin(t * 9 + ph) * 4 : 0;
    ell(ctx, x + s, -4 - Math.max(0, -Math.cos(t * 9 + ph)) * (geht ? 2 : 0), 3.6, 5.4, farbe);
  };
  bein(-9, 0, dunkel); bein(7, Math.PI, dunkel);           // hintere Reihe
  ell(ctx, -1, -14 - bob, 14, 9.5, fell);                  // Rumpf
  ell(ctx, 5, -19 - bob, 8, 7, hell);                      // Schulterbuckel
  ell(ctx, -3, -11 - bob, 11, 4, dunkel);                  // Bauchschatten
  for (var i = 0; i < 4; i++) lin(ctx, -8 + i * 4, -22 - bob, -6 + i * 4, -18 - bob, "rgba(255,230,180,0.14)", 1);   // Fellstruktur
  bein(-6, Math.PI, fell); bein(10, 0, fell);              // vordere Reihe
  var lunge = 0;                                           // Prankenhieb waehrend des Schlags
  if (sp.schlagAktiv > 0) lunge = Math.sin((1 - sp.schlagAktiv / KOMBO_SCHLAGDAUER) * Math.PI) * 9;
  var kx = 13 + lunge, ky = -16 - bob;
  ell(ctx, 8 + lunge * 0.5, ky - 2, 6, 3.4, fell);
  ell(ctx, kx + 2, ky - 1, 5, 4, hell);                    // Pranke
  if (lunge > 2) for (var c = -1; c <= 1; c++) lin(ctx, kx + 5, ky - 1 + c * 2.2, kx + 10, ky - 1 + c * 2.6, "#efe6cc", 1.2);   // Krallen
  kr(ctx, 15, -24 - bob, 7.6, fell);                       // Kopf
  kr(ctx, 10.4, -29.5 - bob, 2.6, dunkel); kr(ctx, 17.2, -30.5 - bob, 2.6, dunkel);     // Ohren
  ell(ctx, 20.5, -22 - bob, 4.6, 3.4, schnauze);           // Schnauze
  kr(ctx, 24, -23.2 - bob, 1.7, "#1a120c");                // Nase
  kr(ctx, 17.5, -26 - bob, 1.3, "#140e08"); kr(ctx, 13.2, -26.4 - bob, 1.1, "#140e08");  // Augen
  if (sp.schlagAktiv > 0) lin(ctx, 20, -20.2 - bob, 23, -19.4 - bob, "#efe6cc", 1.1);   // Zaehne beim Hieb
  ell(ctx, -15, -15 - bob, 2.6, 2.2, dunkel);              // Stummelschwanz
  ctx.restore();
}

// Anzeige der Restzeit (hud.js ruft ueber der Ausdauerleiste).
function baerHud(ctx, breite, hoehe, sp) {
  if (!baerAktiv(sp)) return;
  var rest = sp.skills.dauer.baerenschlag, gesamt = BAER_DAUER + baerRang(sp), x = breite / 2 - 85, y = hoehe - 150;
  rc(ctx, x, y, 170, 5, "#14110c"); rc(ctx, x, y, 170 * Math.max(0, Math.min(1, rest / gesamt)), 5, "#a8783a");
  ctx.fillStyle = "#d8b27a"; ctx.font = "11px Georgia, serif"; ctx.textAlign = "center";
  ctx.fillText("Bärengestalt  " + Math.ceil(rest) + " s  ·  +" + baerSchaden(sp) + " Schaden  ·  -" + baerVerteidigung(sp) + " Schaden pro Treffer", breite / 2, y - 3);
  ctx.textAlign = "left";
}
