// itemgrafik.js — Gegenstaende zeichnen (Symbole, Beute am Boden), Ausruestung am Helden (figuren.js ruft ausrKoerper/
// ausrKopf/ausrWaffe) und das Ausruestungsfenster (Taste I). Kein Modul; globale Funktionen. Nutzt sprites.js (rc, kr, lin, poly, glut).

var INV = { x: 70, y: 24, w: 820, h: 592, slotG: 62, beutelX: 520, beutelY: 150, spalten: 4 };
var BEUTE_RADIUS = 22;               // px: so nah muss der Held sein, um Beute aufzunehmen
function slotPos(sl) {               // Plaetze links neben der Figur
  var i = SLOTS.indexOf(sl), pos = [[110, 150], [110, 232], [110, 314], [110, 396], [110, 478]];
  return { x: INV.x + pos[i][0] - 90 + 20, y: INV.y + pos[i][1] - 30, w: INV.slotG, h: INV.slotG };
}
function beutelPos(i) { return { x: INV.beutelX + (i % INV.spalten) * (INV.slotG + 8), y: INV.beutelY + Math.floor(i / INV.spalten) * (INV.slotG + 8), w: INV.slotG, h: INV.slotG }; }

// ---- Symbole ----------------------------------------------------------------------------
function itemSymbol(ctx, cx, cy, s, it) {          // s = Seitenlaenge des Feldes, Symbol mittig
  var u = s / 40, c = it.farbe, a = it.art;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(u, u); ctx.lineCap = "round";
  if (a === "schwert") { lin(ctx, -12, 12, 12, -12, "#e4e8f0", 4); lin(ctx, -12, 12, 12, -12, "rgba(255,255,255,0.5)", 1.4); lin(ctx, -9, 4, -2, 11, "#8a6b3a", 3); lin(ctx, -13, 13, -9, 9, "#5a3a22", 4); }
  else if (a === "axt") { lin(ctx, -10, 14, 8, -12, "#7a5a34", 3.4); poly(ctx, [3, -14, 15, -10, 14, 2, 6, -2], c); }
  else if (a === "keule") { lin(ctx, -12, 13, 6, -9, c, 5); kr(ctx, 9, -12, 7, "#8a6a40"); kr(ctx, 7, -14, 2, "#a88a5a"); }
  else if (a === "sichel") { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-2, 0, 13, -2.4, 1.0); ctx.stroke(); lin(ctx, -10, 12, -4, 4, "#7a5a34", 3); }
  else if (a === "stab") { lin(ctx, -12, 14, 10, -10, c, 3.4); kr(ctx, 11, -12, 4, "#c8a860"); }
  else if (a === "kristall") { lin(ctx, -12, 14, 8, -8, "#6a4a2c", 3.2); poly(ctx, [11, -18, 17, -10, 11, -2, 5, -10], c); glut(ctx, 11, -10, 22, "150,190,255", 0.5); }
  else if (a === "kappe") { poly(ctx, [-14, 8, -11, -6, 0, -13, 11, -6, 14, 8], c); rc(ctx, -14, 6, 28, 4, "#4a3320"); }
  else if (a === "helm") { poly(ctx, [-13, 8, -12, -5, 0, -13, 12, -5, 13, 8], c); rc(ctx, -2, -4, 4, 12, "#6a707c"); rc(ctx, -13, 5, 26, 3, "#6a707c"); }
  else if (a === "kapuze") { poly(ctx, [-13, 12, -9, -4, 0, -15, 9, -4, 13, 12, 5, 6, -5, 6], c); poly(ctx, [-4, 6, 0, -2, 4, 6], "rgba(0,0,0,0.6)"); }
  else if (a === "reif") { ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 2, 13, 8, 0, 0, TAU); ctx.stroke(); kr(ctx, 0, -6, 3.4, "#c04040"); }
  else if (a === "leder") { poly(ctx, [-11, -12, 11, -12, 14, 14, -14, 14], c); rc(ctx, -11, 2, 22, 3, "#3a2a1c"); lin(ctx, -8, -12, -8, 14, "rgba(0,0,0,0.25)", 1); }
  else if (a === "kette") { poly(ctx, [-12, -12, 12, -12, 15, 14, -15, 14], c); for (var y = -8; y < 14; y += 6) for (var x = -10; x < 12; x += 6) rc(ctx, x, y, 3, 3, "rgba(255,255,255,0.22)"); }
  else if (a === "robe") { poly(ctx, [-8, -14, 8, -14, 15, 14, -15, 14], c); rc(ctx, -8, -2, 16, 3, "#d8cfa8"); lin(ctx, 0, -14, 0, 14, "rgba(0,0,0,0.25)", 1.5); }
  else if (a === "platte") { poly(ctx, [-13, -12, 13, -12, 14, 13, -14, 13], c); kr(ctx, -13, -11, 5, "#cfd4e0"); kr(ctx, 13, -11, 5, "#cfd4e0"); lin(ctx, 0, -10, 0, 12, "rgba(0,0,0,0.3)", 1.5); lin(ctx, -9, 0, 9, 0, "rgba(255,255,255,0.3)", 1.5); }
  else if (a === "ring") { ctx.strokeStyle = c; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.arc(0, 3, 9, 0, TAU); ctx.stroke(); poly(ctx, [0, -13, 5, -8, 0, -3, -5, -8], it.seltenheit === 2 ? "#ffd75a" : "#7ab0ff"); }
  else if (a === "amulett") { ctx.strokeStyle = "#8a6b3a"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-12, -14); ctx.lineTo(0, 4); ctx.lineTo(12, -14); ctx.stroke(); kr(ctx, 0, 8, 7, "#3a2a1c"); kr(ctx, 0, 8, 5.2, c); kr(ctx, -1.6, 6, 1.6, "rgba(255,255,255,0.5)"); }
  ctx.restore();
}

function itemFeld(ctx, r, it, markiert) {          // Kasten mit Seltenheitsrand und Symbol
  var sel = it ? SELTENHEIT[it.seltenheit].farbe : "#3a3426";
  rc(ctx, r.x, r.y, r.w, r.h, "rgba(255,255,255,0.05)");
  if (it) { var g = ctx.createRadialGradient(r.x + r.w / 2, r.y + r.h / 2, 2, r.x + r.w / 2, r.y + r.h / 2, r.w * 0.7); g.addColorStop(0, "rgba(255,255,255,0.10)"); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h); }
  ctx.strokeStyle = markiert ? "#ffe08a" : sel; ctx.lineWidth = markiert ? 2 : 1; ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1); ctx.lineWidth = 1;
  if (it) itemSymbol(ctx, r.x + r.w / 2, r.y + r.h / 2, r.w * 0.8, it);
}

// Beute am Boden: leuchtendes Symbol, Farbe nach Seltenheit.
function beuteZeichnen(ctx, sx, sy, b) {
  var it = b.item, hell = it.seltenheit === 2 ? "255,215,90" : (it.seltenheit === 1 ? "122,176,255" : "220,210,180");
  var hub = Math.sin(ANIM * 3 + b.x) * 1.5;
  schatten(ctx, sx, sy, 8);
  glut(ctx, sx, sy - 10, 20 + it.seltenheit * 8, hell, 0.3 + Math.sin(ANIM * 4 + b.y) * 0.08);
  itemSymbol(ctx, sx, sy - 11 + hub, 24, it);
}

// ---- Am Helden (figuren.js) -----------------------------------------------------------------
function ausrArt(sp, slot) { var it = sp.ausr && sp.ausr[slot]; return it ? it : null; }

// Koerper: ueber die Grundkleidung gelegt, vor dem Guertel. robe = lange Kutte (Anselm).
function ausrKoerper(ctx, sx, sy, bob, robe, sp) {
  var it = ausrArt(sp, "koerper");
  if (!it) return;
  var c = it.farbe, a = it.art;
  if (a === "robe" || robe) poly(ctx, [sx - 7, sy - 25 - bob, sx + 7, sy - 25 - bob, sx + 11, sy - 1, sx - 11, sy - 1], robe && a !== "robe" ? "rgba(255,255,255,0.0)" : c);
  else rc(ctx, sx - 7, sy - 25 - bob, 14, 16, c);
  if (a === "kette") for (var y = 0; y < 14; y += 4) for (var x = 0; x < 14; x += 4) rc(ctx, sx - 7 + x + (y % 8 ? 2 : 0), sy - 24 - bob + y, 2, 2, "rgba(255,255,255,0.25)");
  if (a === "platte") { rc(ctx, sx - 7, sy - 25 - bob, 14, 16, c); rc(ctx, sx - 1, sy - 25 - bob, 2, 16, "rgba(0,0,0,0.3)"); rc(ctx, sx - 7, sy - 20 - bob, 14, 2, "rgba(255,255,255,0.35)"); kr(ctx, sx - 8, sy - 25 - bob, 4.8, "#cfd4e0"); kr(ctx, sx + 8, sy - 25 - bob, 4.8, "#cfd4e0"); }
  if (a === "robe") { rc(ctx, sx - 7, sy - 14 - bob, 14, 2.4, "#d8cfa8"); lin(ctx, sx, sy - 24 - bob, sx, sy - 2, "rgba(0,0,0,0.25)", 1.4); }
  if (a === "leder") { rc(ctx, sx - 7, sy - 18 - bob, 14, 2, "#3a2a1c"); lin(ctx, sx - 4, sy - 25 - bob, sx - 4, sy - 10 - bob, "rgba(0,0,0,0.25)", 1); }
  var am = ausrArt(sp, "amulett");
  if (am) { lin(ctx, sx - 3, sy - 25 - bob, sx, sy - 20 - bob, "#8a6b3a", 1); lin(ctx, sx + 3, sy - 25 - bob, sx, sy - 20 - bob, "#8a6b3a", 1); kr(ctx, sx, sy - 19 - bob, 2.2, am.farbe); }
}

// Kopf: nach Haar und Gesicht. oben = Held blickt nach oben (nur Hinterkopf).
function ausrKopf(ctx, sx, sy, bob, sp, oben) {
  var it = ausrArt(sp, "kopf");
  if (!it) return;
  var c = it.farbe, a = it.art, hy = sy - 31 - bob;
  if (a === "helm") {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(sx, hy + 0.5, 7.6, Math.PI, TAU); ctx.fill(); rc(ctx, sx - 7.6, hy, 15.2, 2.4, "#6a707c");
    if (!oben) rc(ctx, sx - 1, hy, 2, 6, "#6a707c"); else kr(ctx, sx, sy - 30 - bob, 7, c);
    rc(ctx, sx - 4, hy - 6, 3, 2, "rgba(255,255,255,0.35)");
  } else if (a === "kappe") {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(sx, hy + 1, 7.4, Math.PI * 1.02, Math.PI * 1.98); ctx.fill(); rc(ctx, sx - 7.4, hy, 14.8, 2, "#4a3320"); if (oben) kr(ctx, sx, sy - 30 - bob, 7, c);
  } else if (a === "kapuze") {
    poly(ctx, [sx - 8, hy + 3, sx - 6, hy - 7, sx + 1, hy - 15, sx + 6, hy - 7, sx + 8, hy + 3], c);   // spitze Kapuze
    if (!oben) poly(ctx, [sx - 5, hy + 3, sx - 4, hy - 5, sx + 4, hy - 5, sx + 5, hy + 3], "rgba(0,0,0,0.0)"); else kr(ctx, sx, sy - 30 - bob, 7, c);
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.moveTo(sx - 6, hy - 6); ctx.lineTo(sx, hy - 14); ctx.stroke();
  } else if (a === "reif") {
    rc(ctx, sx - 6.8, hy - 1, 13.6, 2.2, c); kr(ctx, sx, hy - 0.2, 1.6, "#c04040");
  }
}

// Waffe: Zeichnung an Griff (hx, hy), Richtung a, Laenge L. Rueckgabe: Laenge der Waffe.
function ausrWaffeLaenge(art) { return art === "schwert" ? 20 : (art === "axt" ? 18 : (art === "keule" ? 16 : (art === "sichel" ? 13 : (art === "kristall" ? 24 : (art === "stab" ? 24 : 12))))); }
function ausrWaffe(ctx, art, hx, hy, ex, ey, a) {
  var nx = Math.cos(a + 1.57), ny = Math.sin(a + 1.57);
  if (art === "schwert") {
    lin(ctx, hx, hy, ex, ey, "#d6dbe6", 2.6); lin(ctx, hx, hy, ex, ey, "rgba(255,255,255,0.5)", 0.8);
    lin(ctx, hx + nx * 4, hy + ny * 4, hx - nx * 4, hy - ny * 4, "#8a6b3a", 2);
  } else if (art === "axt") {
    lin(ctx, hx, hy, ex, ey, "#7a5a34", 2.4);
    poly(ctx, [ex - Math.cos(a) * 7 + nx * 7, ey - Math.sin(a) * 7 + ny * 7, ex + Math.cos(a) * 2 + nx * 9, ey + Math.sin(a) * 2 + ny * 9, ex + Math.cos(a) * 2 - nx * 2, ey + Math.sin(a) * 2 - ny * 2, ex - Math.cos(a) * 7, ey - Math.sin(a) * 7], "#c4cbd8");
  } else if (art === "keule") {
    lin(ctx, hx, hy, ex, ey, "#7a5a34", 2.6); kr(ctx, ex, ey, 4.6, "#8a6a40"); kr(ctx, ex - 1, ey - 1, 1.4, "#a88a5a");
  } else if (art === "sichel") {
    lin(ctx, hx, hy, hx + Math.cos(a) * 8, hy + Math.sin(a) * 8, "#7a5a34", 2.4);
    ctx.strokeStyle = "#c8d4b8"; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(hx + Math.cos(a) * 10 + nx * 3, hy + Math.sin(a) * 10 + ny * 3, 6, a + 1.3, a + 4.4); ctx.stroke();
  } else if (art === "kristall") {
    lin(ctx, hx, hy, ex, ey, "#6a4a2c", 2.6); poly(ctx, [ex + Math.cos(a) * 6, ey + Math.sin(a) * 6, ex + nx * 3, ey + ny * 3, ex - Math.cos(a) * 2, ey - Math.sin(a) * 2, ex - nx * 3, ey - ny * 3], "#9ec4ff"); glut(ctx, ex, ey, 16, "150,190,255", 0.5 + Math.sin(ANIM * 5) * 0.1);
  } else if (art === "beil") {
    lin(ctx, hx, hy, ex, ey, "#7a5a34", 2.4);
    poly(ctx, [ex, ey, ex + Math.cos(a + 1.1) * 7, ey + Math.sin(a + 1.1) * 7, ex + Math.cos(a) * 3 + Math.cos(a - 1.1) * 6, ey + Math.sin(a) * 3 + Math.sin(a - 1.1) * 6], "#c4cbd8");
  } else {
    lin(ctx, hx, hy, ex, ey, "#6a4a2c", 2.6); kr(ctx, ex, ey, 2.6, "#c8a860");
  }
}

// ---- Beute aufnehmen (spiel.js ruft jeden Schritt) -------------------------------------------------
function beuteFallen(z, x, y, quelle, minSel) {
  var it = beuteWuerfeln(z.ebene ? z.ebene.ebenenNr : 1, quelle, HELDEN[HELD].klasseId);
  if (quelle === "boss") it = itemNeu(z.ebene ? z.ebene.ebenenNr : 1, HELDEN[HELD].klasseId, undefined, 2);
  if (!it) return null;
  if (!z.beute) z.beute = [];
  z.beute.push({ x: x, y: y, item: it });
  return it;
}
function beuteSchritt(z, sp) {
  if (!z.beute || !z.beute.length) return;
  for (var i = z.beute.length - 1; i >= 0; i--) {
    var b = z.beute[i], dx = b.x - sp.x, dy = b.y - sp.y;
    if (dx * dx + dy * dy > BEUTE_RADIUS * BEUTE_RADIUS) continue;
    if (!beutelPlatz(fp())) { if (!z.beutelVollMs || z.beutelVollMs < performance.now()) { popup(z, sp.x, sp.y - 44, "Beutel voll (I)", "#c88a8a"); z.beutelVollMs = performance.now() + 1500; } continue; }
    beutelAufnehmen(z, b.item); z.beute.splice(i, 1);
    popup(z, sp.x, sp.y - 44, b.item.name, SELTENHEIT[b.item.seltenheit].farbe); sfx("buch");
  }
}

// ---- Fenster (Taste I) -------------------------------------------------------------------------------
function invTreffer(mx, my) {          // { art: "slot"|"beutel", slot|idx } oder null
  var i, r;
  for (i = 0; i < SLOTS.length; i++) { r = slotPos(SLOTS[i]); if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return { art: "slot", slot: SLOTS[i] }; }
  for (i = 0; i < BEUTEL_MAX; i++) { r = beutelPos(i); if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return { art: "beutel", idx: i }; }
  return null;
}
function invSchritt(z, fl, mx, my, klick) {
  if (fl.i || fl.escape) { z.invOffen = false; return; }
  var t = invTreffer(mx, my), f = fp();
  if (t && klick) {
    if (t.art === "beutel" && f.beutel[t.idx]) itemAnlegen(z, t.idx);
    else if (t.art === "slot" && f.ausruestung[t.slot]) { if (!itemAblegen(z, t.slot)) popup(z, z.spieler.x, z.spieler.y - 40, "Beutel voll", "#c88a8a"); }
  }
  if (t && fl.x) {
    if (t.art === "beutel") itemWegwerfen(z, t.idx);
  }
}

function tooltipZeichnen(ctx, it, mx, my, vergleich) {
  var zeilen = itemZeilen(it), w = 230, h = 58 + zeilen.length * 18 + (vergleich ? 22 : 0);
  var x = Math.min(mx + 16, 960 - w - 8), y = Math.min(my + 10, 640 - h - 8);
  metallBox(ctx, x, y, w, h);
  ctx.textAlign = "left"; ctx.fillStyle = SELTENHEIT[it.seltenheit].farbe; ctx.font = "bold 16px Georgia, serif"; ctx.fillText(it.name, x + 12, y + 24);
  ctx.fillStyle = "#8a8368"; ctx.font = "italic 12px Georgia, serif"; ctx.fillText(SLOT_NAMEN[it.slot] + "  ·  " + SELTENHEIT[it.seltenheit].name + "  ·  Stufe " + it.stufe, x + 12, y + 42);
  ctx.fillStyle = "#d8d0b4"; ctx.font = "14px Georgia, serif";
  for (var i = 0; i < zeilen.length; i++) ctx.fillText(zeilen[i], x + 12, y + 64 + i * 18);
  if (vergleich) { ctx.fillStyle = "#7d7660"; ctx.font = "12px Georgia, serif"; ctx.fillText("ersetzt: " + vergleich.name, x + 12, y + h - 10); }
}

function zeichneInventar(ctx, b, h, z) {
  var I = INV, f = fp(), sp = z.spieler, i, r, mx = MAUS.x, my = MAUS.y, t = invTreffer(mx, my);
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.62)"; ctx.fillRect(0, 0, b, h);
  metallBox(ctx, I.x, I.y, I.w, I.h);
  ctx.textAlign = "center"; ctx.fillStyle = "#e8d9a4"; ctx.font = "30px Georgia, serif"; ctx.fillText("Ausrüstung", b / 2, I.y + 46);
  ctx.fillStyle = "#a89a70"; ctx.font = "italic 16px Georgia, serif"; ctx.fillText(sp.held.name + "  ·  " + sp.held.klasse, b / 2, I.y + 72);
  // Plaetze
  ctx.font = "12px Georgia, serif";
  for (i = 0; i < SLOTS.length; i++) {
    r = slotPos(SLOTS[i]); itemFeld(ctx, r, f.ausruestung[SLOTS[i]], t && t.art === "slot" && t.slot === SLOTS[i]);
    ctx.fillStyle = "#8a8368"; ctx.textAlign = "left"; ctx.fillText(SLOT_NAMEN[SLOTS[i]], r.x + r.w + 10, r.y + 24);
    var it = f.ausruestung[SLOTS[i]];
    ctx.fillStyle = it ? SELTENHEIT[it.seltenheit].farbe : "#4a4434"; ctx.fillText(it ? it.name : "leer", r.x + r.w + 10, r.y + 42);
  }
  // Figur
  ctx.save(); ctx.translate(I.x + 395, I.y + 400); ctx.scale(4, 4);
  var vorschau = { blick: Math.PI / 2, geht: false, gehT: 0, schlagAktiv: 0, dodgeT: 0, ausr: f.ausruestung, kombo: 0 };
  ANIM = performance.now() / 1000;
  heldZeichnen(ctx, 0, 0, vorschau, sp.held);
  ctx.restore();
  // Beutel
  ctx.textAlign = "left"; ctx.fillStyle = "#a89a70"; ctx.font = "bold 16px Georgia, serif"; ctx.fillText("Beutel  " + f.beutel.length + " / " + BEUTEL_MAX, I.beutelX, I.beutelY - 14);
  for (i = 0; i < BEUTEL_MAX; i++) itemFeld(ctx, beutelPos(i), f.beutel[i], t && t.art === "beutel" && t.idx === i);
  // Werte
  var s = itemSumme(f.ausruestung);
  ctx.textAlign = "center"; ctx.fillStyle = "#cfc8b0"; ctx.font = "14px Georgia, serif";
  ctx.fillText("Leben " + sp.lebenMax + "  ·  Ausdauer " + sp.ausdauerMax + "  ·  Mana " + sp.manaMax + " (+" + zahlText(MANA_REGEN + s.manaReg) + " /s)  ·  Schaden +" + zahlText(sp.schadenPlus) + "  ·  Verteidigung " + (sp.armor || 0) + "  ·  Tempo " + sp.tempo, b / 2, I.y + I.h - 54);
  ctx.fillStyle = "#7d7660"; ctx.font = "13px Georgia, serif";
  ctx.fillText("Klick auf ein Teil im Beutel: anlegen  ·  Klick auf einen Platz: ablegen  ·  X: Teil im Beutel wegwerfen  ·  I oder Esc schließt", b / 2, I.y + I.h - 28);
  ctx.restore();
  // Tooltip zuletzt
  if (t) {
    var ti = t.art === "slot" ? f.ausruestung[t.slot] : f.beutel[t.idx];
    if (ti) { ctx.save(); tooltipZeichnen(ctx, ti, mx, my, t.art === "beutel" ? f.ausruestung[ti.slot] : null); ctx.restore(); }
  }
}
