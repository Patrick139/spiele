// fortschritt.js — Erfahrung, Stufen und Fertigkeiten (Grundsystem).
// Der Fortschritt gehoert dem HELDEN (je einer pro Held), bleibt nach Tod und Neustart erhalten
// und wird im Browser gespeichert (localStorage). Erfahrung gibt es fuer erschlagene Gegner;
// jede neue Stufe gibt 1 Fertigkeitspunkt und heilt voll. Punkte setzt man im Fertigkeitenfenster
// (Taste K) ein. Kein Modul; globale Funktionen. Setzt held.js, zauber.js (MANA_MAX) voraus.

// ---- Konstanten zum Nachjustieren -------------------------------------
var XP_ZOMBIE = 4, XP_SKELETT = 5, XP_WAECHTER = 30;   // Erfahrung auf Ebene 1
var XP_NEU = { schildtraeger: 6, brecher: 9, beschwoerer: 8 };   // gegner2.js
var XP_JE_EBENE = 0.5;       // jede tiefere Ebene gibt 50 % der Grundwerte mehr
var XP_BASIS = 25;           // Erfahrung bis Stufe 2
var XP_ZUWACHS = 20;         // jede weitere Stufe braucht so viel mehr
var STUFE_MAX = 12;
var FERTIGKEITEN = [
  { id: "vital",  name: "Zähigkeit",   max: 5, text: "+1 Leben je Rang" },
  { id: "kraft",  name: "Kampfkraft",  max: 4, text: "+0,5 Schaden je Rang (Nahkampf und Wurf)" },
  { id: "atem",   name: "Atem",        max: 4, text: "+15 Ausdauer je Rang" },
  { id: "geist",  name: "Geist",       max: 5, text: "+15 Mana je Rang (für die Nova)" },
  { id: "fuss",   name: "Flinke Füße", max: 4, text: "+4 % Lauftempo je Rang" }
];
// -----------------------------------------------------------------------

var SPEICHER_SCHLUESSEL = "zehnte_fortschritt";

function fortschrittNeu() {
  var r = {};
  FERTIGKEITEN.forEach(function (f) { r[f.id] = 0; });
  return { xp: 0, stufe: 1, punkte: 0, raenge: r, klasse: {}, wahl: "axt", ausruestung: leereAusruestung(), beutel: [] };
}

// Aus dem Browserspeicher laden. Ist etwas kaputt oder unvollstaendig: sauber neu beginnen.
function fortschrittLaden() {
  var alle = [fortschrittNeu(), fortschrittNeu(), fortschrittNeu()];
  try {
    var roh = JSON.parse(localStorage.getItem(SPEICHER_SCHLUESSEL));
    if (Array.isArray(roh)) for (var i = 0; i < 3; i++) {
      var s = roh[i];
      if (!s || typeof s.xp !== "number" || typeof s.stufe !== "number" || typeof s.punkte !== "number") continue;
      alle[i].stufe = Math.max(1, Math.min(STUFE_MAX, Math.floor(s.stufe)));
      alle[i].xp = Math.max(0, s.xp); alle[i].punkte = Math.max(0, Math.floor(s.punkte));
      FERTIGKEITEN.forEach(function (f) {
        var v = s.raenge && s.raenge[f.id];
        if (typeof v === "number") alle[i].raenge[f.id] = Math.max(0, Math.min(f.max, Math.floor(v)));
      });
      if (s.klasse && typeof s.klasse === "object") alle[i].klasse = s.klasse;  // Klassenbaum-Rang (klassen.js)
      if (typeof s.wahl === "string") alle[i].wahl = s.wahl;                    // gewaehlte Faehigkeit
      if (s.ausruestung && typeof s.ausruestung === "object") SLOTS.forEach(function (sl) {   // Gegenstaende (items.js): nur Gueltiges, Platz muss passen
        var it = itemPruefen(s.ausruestung[sl]); if (it && it.slot === sl) alle[i].ausruestung[sl] = it; });
      if (Array.isArray(s.beutel)) s.beutel.slice(0, BEUTEL_MAX).forEach(function (r) { var it = itemPruefen(r); if (it) alle[i].beutel.push(it); });
    }
  } catch (e) {}
  return alle;
}
function fortschrittSpeichern() {
  try { localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(zustand.fortschritt)); } catch (e) {}
}
function fp() { return zustand.fortschritt[HELD]; }                  // Fortschritt des gewaehlten Helden
function xpBedarf(stufe) { return XP_BASIS + XP_ZUWACHS * (stufe - 1); }
function zahlText(x) { return Number.isInteger(x) ? String(x) : x.toFixed(1).replace(".", ","); }

// ---- Erfahrung ----------------------------------------------------------------
function xpFuerKill(g, z) {
  if (g.art === "ambros" || g.keinXp) return;                        // Ambros beendet das Spiel; Gerufene geben nichts
  var basis = g.boss ? XP_WAECHTER : (g.art === "skelett" ? XP_SKELETT : (XP_NEU[g.art] || XP_ZOMBIE));
  var xp = Math.round(basis * (1 + XP_JE_EBENE * ((g.ebene || 1) - 1)));
  xpGeben(z, xp, g.x, g.y - 44);
}
function xpGeben(z, xp, x, y) {
  var f = fp(), sp = z.spieler;
  if (f.stufe >= STUFE_MAX) return;
  f.xp += xp;
  if (x !== undefined) popup(z, x, y, "+" + xp + " EP", "#b9a8ff");
  while (f.stufe < STUFE_MAX && f.xp >= xpBedarf(f.stufe)) {
    f.xp -= xpBedarf(f.stufe); f.stufe++; f.punkte++;
    z.stufeAuf = (z.stufeAuf || 0) + 1;
    sp.leben = sp.lebenMax; sp.mana = sp.manaMax; sp.ausdauer = sp.ausdauerMax;      // neue Stufe heilt voll
    popup(z, sp.x, sp.y - 54, "Stufe " + f.stufe + "!", "#ffe08a");
  }
  if (f.stufe >= STUFE_MAX) f.xp = 0;
  fortschrittSpeichern();
}

// ---- Fertigkeiten wirken -----------------------------------------------------------
// voll = true: Spieler neu (alles voll). Sonst nur die Zugewinne auffuellen (Punkt eingesetzt).
function fertigkeitenAnwenden(sp, voll) {
  var h = sp.held, r = fp().raenge, alt = { l: sp.lebenMax, a: sp.ausdauerMax, m: sp.manaMax };
  sp.lebenMax = h.leben + r.vital;
  sp.ausdauerMax = h.ausdauer + 15 * r.atem;
  sp.manaMax = (h.mana || MANA_MAX) + 15 * r.geist;
  sp.tempo = Math.round(h.tempo * (1 + 0.04 * r.fuss));
  sp.schadenPlus = 0.5 * r.kraft;
  if (voll) { sp.leben = sp.lebenMax; sp.ausdauer = sp.ausdauerMax; sp.mana = sp.manaMax; return; }
  sp.leben += Math.max(0, sp.lebenMax - alt.l); sp.ausdauer += Math.max(0, sp.ausdauerMax - alt.a);
  sp.mana += Math.max(0, sp.manaMax - alt.m);
}
function fertigkeitKaufen(z, i) {
  var f = fp(), d = FERTIGKEITEN[i];
  if (!d || f.punkte < 1 || f.raenge[d.id] >= d.max) return false;
  f.raenge[d.id]++; f.punkte--;
  // fertigkeitenAnwenden setzt Maximalwerte auf Heldenbasis zurueck: Klassen-Passive (klassen.js)
  // danach neu aufsetzen, sonst waren Panzerfell/Geistkontakt/Tempo nach jedem Kauf weg.
  var sp = z.spieler, alt = { l: sp.leben, a: sp.ausdauer, m: sp.mana, lm: sp.lebenMax, am: sp.ausdauerMax, mm: sp.manaMax };
  fertigkeitenAnwenden(sp, false);
  sp.klassenBonus = null; klassenAnwenden(sp);
  sp.leben = Math.min(sp.lebenMax, alt.l + Math.max(0, sp.lebenMax - alt.lm));
  sp.ausdauer = Math.min(sp.ausdauerMax, alt.a + Math.max(0, sp.ausdauerMax - alt.am));
  sp.mana = Math.min(sp.manaMax, alt.m + Math.max(0, sp.manaMax - alt.mm));
  fortschrittSpeichern();
  sfx("skill");
  return true;
}

// ---- Fertigkeitenfenster (Taste K): Welt steht, solange es offen ist ------------------------
var SKILL_FENSTER = { x: 16, y: 24, w: 600, h: 592, zeileY: 220, zeileH: 60 };
function skillKnopf(i) { return { x: SKILL_FENSTER.x + SKILL_FENSTER.w - 78, y: SKILL_FENSTER.zeileY + i * SKILL_FENSTER.zeileH + 12, w: 52, h: 34 }; }

// Ein Schritt bei offenem Fenster. fl = Tastenflanken, (mx, my) Maus, klick = Mausklick.
function skillSchritt(z, fl, mx, my, klick) {
  if (fl.k || fl.escape) { z.skillOffen = false; return; }
  for (var i = 0; i < FERTIGKEITEN.length; i++) {
    var kn = skillKnopf(i);
    if (fl[String(i + 1)] || (klick && mx >= kn.x && mx <= kn.x + kn.w && my >= kn.y && my <= kn.y + kn.h)) fertigkeitKaufen(z, i);
  }
  if (klick) klassenBaumKlick(z, mx, my);          // Rang im Klassenbaum einsetzen (klassen.js)
}

function zeichneSkills(ctx, b, h, z) {
  var F = SKILL_FENSTER, f = fp(), sp = z.spieler, i;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.62)"; ctx.fillRect(0, 0, b, h);
  metallBox(ctx, F.x, F.y, F.w, F.h);
  ctx.textAlign = "center";
  ctx.fillStyle = "#e8d9a4"; ctx.font = "30px Georgia, serif"; ctx.fillText("Fertigkeiten", b / 2, F.y + 46);
  ctx.fillStyle = "#a89a70"; ctx.font = "italic 16px Georgia, serif"; ctx.fillText(sp.held.name + "  ·  " + sp.held.klasse, b / 2, F.y + 72);
  ctx.fillStyle = "#f0e6b8"; ctx.font = "20px Georgia, serif"; ctx.fillText("Stufe " + f.stufe, b / 2, F.y + 108);
  var bx = F.x + 120, bw = F.w - 240;                                    // Erfahrungsbalken
  rc(ctx, bx - 1, F.y + 120, bw + 2, 14, "#2a2318"); rc(ctx, bx, F.y + 121, bw, 12, "#14110c");
  var anteil = f.stufe >= STUFE_MAX ? 1 : f.xp / xpBedarf(f.stufe);
  rc(ctx, bx, F.y + 121, bw * anteil, 12, "#8a6ad0");
  ctx.fillStyle = "#cfc8ff"; ctx.font = "13px Georgia, serif";
  ctx.fillText(f.stufe >= STUFE_MAX ? "höchste Stufe erreicht" : "Erfahrung " + f.xp + " / " + xpBedarf(f.stufe), b / 2, F.y + 150);
  ctx.fillStyle = f.punkte > 0 ? "#ffe08a" : "#8a8368"; ctx.font = "bold 18px Georgia, serif";
  ctx.fillText(f.punkte > 0 ? "Freie Punkte: " + f.punkte : "Keine freien Punkte", b / 2, F.y + 176);
  ctx.textAlign = "left";
  for (i = 0; i < FERTIGKEITEN.length; i++) {
    var d = FERTIGKEITEN[i], y = F.zeileY + i * F.zeileH, r = f.raenge[d.id], voll = r >= d.max, kn = skillKnopf(i), geht = f.punkte > 0 && !voll;
    rc(ctx, F.x + 24, y, F.w - 48, F.zeileH - 8, "rgba(255,255,255,0.04)");
    ctx.fillStyle = "#a89a70"; ctx.font = "bold 18px Georgia, serif"; ctx.fillText(String(i + 1), F.x + 38, y + 30);
    ctx.fillStyle = "#f0e6b8"; ctx.font = "bold 18px Georgia, serif"; ctx.fillText(d.name, F.x + 66, y + 24);
    ctx.fillStyle = "#9a937f"; ctx.font = "13px Georgia, serif"; ctx.fillText(d.text, F.x + 66, y + 44);
    for (var k = 0; k < d.max; k++) rc(ctx, F.x + 340 + k * 20, y + 16, 15, 15, k < r ? "#c8a860" : "#2a2318");
    ctx.fillStyle = "#cfc8b0"; ctx.font = "12px Georgia, serif"; ctx.fillText(r + " / " + d.max, F.x + 340, y + 46);
    ctx.fillStyle = geht ? "rgba(200,168,96,0.25)" : "rgba(255,255,255,0.05)"; ctx.fillRect(kn.x, kn.y, kn.w, kn.h);
    ctx.strokeStyle = geht ? "#c8a860" : "#3a3426"; ctx.strokeRect(kn.x + 0.5, kn.y + 0.5, kn.w - 1, kn.h - 1);
    ctx.fillStyle = geht ? "#ffe08a" : "#4a4434"; ctx.font = "bold 22px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText(voll ? "max" : "+", kn.x + kn.w / 2, kn.y + 25); ctx.textAlign = "left";
  }
  ctx.textAlign = "center"; ctx.fillStyle = "#cfc8b0"; ctx.font = "14px Georgia, serif";
  ctx.fillText("Leben " + sp.lebenMax + "  ·  Ausdauer " + sp.ausdauerMax + "  ·  Mana " + sp.manaMax + "  ·  Schaden +" + zahlText(sp.schadenPlus) + "  ·  Tempo " + sp.tempo, b / 2, F.y + F.h - 54);
  ctx.fillStyle = "#7d7660"; ctx.font = "13px Georgia, serif";
  ctx.fillText("1 bis 5 oder Klick auf +  ·  K oder Esc schließt", b / 2, F.y + F.h - 28);
  ctx.restore();
  zeichneKlassenBaum(ctx, z);                            // Klassenbaum rechts daneben (klassen.js)
}

// Erfahrungsbalken und Hinweis unter dem Ortsschild (aus hud.js gerufen).
function zeichneXpBalken(ctx, x, y, w, z) {
  var f = fp(), anteil = f.stufe >= STUFE_MAX ? 1 : f.xp / xpBedarf(f.stufe);
  ctx.save();
  rc(ctx, x, y, w, 7, "rgba(0,0,0,0.7)"); rc(ctx, x + 1, y + 1, (w - 2) * anteil, 5, "#8a6ad0");
  ctx.strokeStyle = "#7a6a44"; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, 6);
  if (f.punkte > 0) {
    ctx.fillStyle = "rgba(255,224,138," + (0.7 + 0.3 * Math.sin(ANIM * 5)) + ")"; ctx.font = "bold 14px Georgia, serif"; ctx.textAlign = "left";
    ctx.fillText("K  —  Fertigkeiten (" + f.punkte + " Punkt" + (f.punkte > 1 ? "e" : "") + ")  ·  I  —  Ausrüstung", x + 2, y + 26);
  }
  ctx.restore();
}
