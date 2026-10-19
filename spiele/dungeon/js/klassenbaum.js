// klassenbaum.js — Fertigkeitenfenster des Klassenbaums: Kaufregeln (Vorstufen), Zeichnen mit
// Beschreibung unter der Maus, Klick. Daten und Wirkung der Faehigkeiten: klassen.js.
// Nutzt fortschritt.js (fp, zahlText), hud.js (metallBox), bildschirme.js (umbruch), sprites.js (rc).

// ---- Kauf im Baum (Fortgeschrittenen-Fenster) --------------------------
// Vorstufe: ab Reihe 2 braucht es mindestens Rang 1 in der Reihe darueber im selben Zweig.
function skillVorstufe(sp, d) {
  if (d.tier === 0) return null;
  var baum = klasseVon(sp).skills, e0 = null;
  for (var i = 0; i < baum.length; i++) {
    var e = baum[i];
    if (e.zweig === d.zweig && e.tier === d.tier - 1) { e0 = e; if (sp.skills.stufen[e.id] > 0) return null; }
  }
  return e0;                                             // diese Faehigkeit fehlt noch
}
function baumMeldung(z, txt) { z.baumMeldung = { txt: txt, bis: performance.now() + 2200 }; }
function skillKaufen(z, id) {
  var sp = z.spieler, f = fp(), d = skillDefVon(sp, id);
  if (!d) return false;
  if (sp.skills.stufen[id] >= d.max) { baumMeldung(z, d.name + ": höchster Rang erreicht."); return false; }
  if (f.punkte < 1) { baumMeldung(z, "Keine freien Punkte (jede Stufe gibt einen)."); return false; }
  var vor = skillVorstufe(sp, d);
  if (vor) { baumMeldung(z, "Gesperrt: erst einen Rang in " + vor.name + "."); return false; }
  sp.skills.stufen[id]++;
  fp().klasse[id] = sp.skills.stufen[id];                // Rang im Held-Fortschritt merken
  f.punkte--;
  klassenAnwenden(sp);
  fortschrittSpeichern();
  sfx("skill");
  return true;
}

// ---- Zeichnen des Baums im Fertigkeitenfenster (fortschritt.js ruft) ---
var BAUM_KN = { w: 96, h: 52, dx: 102, dy: 84, x0: 14, y0: 128 };
function klassenBaumBereich() { return { x: 626, y: 24, w: 318, h: 592 }; }
function klassenBaumKnopf(d, sp) {
  var B = klassenBaumBereich();
  return { x: B.x + BAUM_KN.x0 + d.zweig * BAUM_KN.dx, y: B.y + BAUM_KN.y0 + d.tier * BAUM_KN.dy, w: BAUM_KN.w, h: BAUM_KN.h };
}
function skillTaste(sp, id) {                            // welche Zifferntaste waehlt die Faehigkeit? (0 = keine)
  var rost = skillRoster(zustand), i = rost.indexOf(id);
  return i >= 0 && i < 9 ? i + 1 : 0;
}
function zeichneKlassenBaum(ctx, z) {
  var B = klassenBaumBereich(), sp = z.spieler, baum = klasseVon(sp), f = fp(), i, d, hover = null;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.62)"; ctx.fillRect(B.x, 0, B.w, 640);
  metallBox(ctx, B.x, B.y, B.w, B.h);
  ctx.textAlign = "center";
  ctx.fillStyle = "#e8d9a4"; ctx.font = "20px Georgia, serif";
  ctx.fillText("Klassenbaum: " + baum.name, B.x + B.w / 2, B.y + 36);
  ctx.fillStyle = f.punkte > 0 ? "#ffe08a" : "#9a9370"; ctx.font = "13px Georgia, serif";
  ctx.fillText(f.punkte > 0 ? "Klick: Rang einsetzen  ·  " + f.punkte + " Punkt" + (f.punkte > 1 ? "e" : "") + " frei" : "Keine freien Punkte", B.x + B.w / 2, B.y + 58);
  ctx.fillStyle = "#7d7660"; ctx.font = "11px Georgia, serif";
  ctx.fillText("A = aktiv (rechte Maustaste)  ·  P = passiv, wirkt immer", B.x + B.w / 2, B.y + 76);
  for (var w = 0; w < 3; w++) {                            // Zweig-Titel
    ctx.fillStyle = baum.farben[w]; ctx.font = "bold 14px Georgia, serif";
    ctx.fillText(baum.zweige[w], B.x + BAUM_KN.x0 + w * BAUM_KN.dx + BAUM_KN.w / 2, B.y + 112);
  }
  for (i = 0; i < baum.skills.length; i++) {               // Verbindungslinien zwischen den Reihen
    d = baum.skills[i];
    if (d.tier === 0) continue;
    var k1 = klassenBaumKnopf(d, sp), offen = !skillVorstufe(sp, d);
    ctx.strokeStyle = offen ? baum.farben[d.zweig] : "#3a3426"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(k1.x + k1.w / 2, k1.y); ctx.lineTo(k1.x + k1.w / 2, k1.y - (BAUM_KN.dy - BAUM_KN.h)); ctx.stroke(); ctx.lineWidth = 1;
  }
  for (i = 0; i < baum.skills.length; i++) {
    d = baum.skills[i];
    var kn = klassenBaumKnopf(d, sp), rang = sp.skills.stufen[d.id], gesperrt = !!skillVorstufe(sp, d);
    var geht = f.punkte > 0 && rang < d.max && !gesperrt, fz = baum.farben[d.zweig];
    var drin = MAUS.x >= kn.x && MAUS.x <= kn.x + kn.w && MAUS.y >= kn.y && MAUS.y <= kn.y + kn.h;
    if (drin) hover = d;
    ctx.fillStyle = geht ? "rgba(200,168,96,0.20)" : (rang > 0 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)");
    if (drin) ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(kn.x, kn.y, kn.w, kn.h);
    ctx.strokeStyle = geht ? "#ffe08a" : (rang > 0 ? fz : "#3a3426"); ctx.lineWidth = geht ? 2 : 1.5;
    ctx.strokeRect(kn.x + 0.5, kn.y + 0.5, kn.w - 1, kn.h - 1); ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.fillStyle = gesperrt ? "#5a5444" : (rang > 0 ? "#f0e6b8" : "#a39a7c"); ctx.font = "12px Georgia, serif";
    ctx.fillText(d.name, kn.x + kn.w / 2, kn.y + 19);
    for (var k = 0; k < d.max; k++) rc(ctx, kn.x + kn.w / 2 - d.max * 7 + k * 14 + 1, kn.y + 27, 11, 7, k < rang ? fz : "#2a2318");   // Rangpunkte
    ctx.fillStyle = gesperrt ? "#5a5444" : "#8a8368"; ctx.font = "10px Georgia, serif";
    var tz = d.aktiv ? skillTaste(sp, d.id) : 0;
    ctx.fillText(gesperrt ? "gesperrt" : (d.aktiv ? "A" + (tz ? "  ·  Taste " + tz : "") : "P"), kn.x + kn.w / 2, kn.y + 47);
  }
  // Beschreibung der Faehigkeit unter der Maus (oder Meldung nach einem abgelehnten Klick)
  var ty = B.y + BAUM_KN.y0 + 3 * BAUM_KN.dy + 6;
  ctx.strokeStyle = "#3a3426"; ctx.beginPath(); ctx.moveTo(B.x + 14, ty); ctx.lineTo(B.x + B.w - 14, ty); ctx.stroke();
  ctx.textAlign = "left";
  if (hover) {
    var rg = sp.skills.stufen[hover.id], vor = skillVorstufe(sp, hover), res = skillRes(hover);
    ctx.fillStyle = baum.farben[hover.zweig]; ctx.font = "bold 15px Georgia, serif";
    ctx.fillText(hover.name + "  " + rg + " / " + hover.max, B.x + 18, ty + 24);
    ctx.fillStyle = "#a89a70"; ctx.font = "italic 12px Georgia, serif";
    ctx.fillText(hover.aktiv ? "Aktiv  ·  " + hover.kosten + (res === "mana" ? " Mana" : " Ausdauer") + "  ·  Abklingzeit " + zahlText(hover.abkling) + " s" : "Passiv  ·  wirkt dauerhaft", B.x + 18, ty + 42);
    ctx.fillStyle = "#cfc8b0"; ctx.font = "13px Georgia, serif";
    var zl = umbruch(ctx, hover.text, B.w - 36);
    for (i = 0; i < zl.length; i++) ctx.fillText(zl[i], B.x + 18, ty + 66 + i * 18);
    if (vor) { ctx.fillStyle = "#c88a8a"; ctx.fillText("Voraussetzung: ein Rang in " + vor.name, B.x + 18, ty + 72 + zl.length * 18); }
  } else if (z.baumMeldung && z.baumMeldung.bis > performance.now()) {
    ctx.fillStyle = "#e0a090"; ctx.font = "14px Georgia, serif";
    var ml = umbruch(ctx, z.baumMeldung.txt, B.w - 36);
    for (i = 0; i < ml.length; i++) ctx.fillText(ml[i], B.x + 18, ty + 28 + i * 18);
  } else {
    ctx.fillStyle = "#7d7660"; ctx.font = "italic 13px Georgia, serif";
    ctx.fillText("Maus über eine Fähigkeit: Beschreibung.", B.x + 18, ty + 28);
  }
  ctx.textAlign = "left";
  ctx.restore();
}

// Klick in den Baum (aus skillSchritt).
function klassenBaumKlick(z, mx, my) {
  var sp = z.spieler, baum = klasseVon(sp);
  for (var i = 0; i < baum.skills.length; i++) {
    var kn = klassenBaumKnopf(baum.skills[i], sp);
    if (mx >= kn.x && mx <= kn.x + kn.w && my >= kn.y && my <= kn.y + kn.h) skillKaufen(z, baum.skills[i].id);
  }
}
