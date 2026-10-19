// raeume.js — Raumtypen und Ebenenziele: Schluessel (oeffnet die Treppe), Truhe, Altar, Lager (Horde).
// Jede Ebene bekommt beim Erzeugen (karte.js) Raumtypen; spiel.js legt die Fundstuecke an, E nutzt sie.
// Typen: start | treppe | schluessel (Wachen + Elite, Schluessel) | schatz (Truhe, Wachen) |
//        kapelle (Altar heilt einmal, keine Gegner) | horde (viele Gegner, sicherer Trank) | normal.
// Kein Modul; globale Funktionen. Nutzt karte.js (begehbar, weglaengen), sprites.js (Zeichenhelfer),
// kampf.js (popup), fortschritt.js (xpGeben).

// ---- Konstanten zum Nachjustieren -------------------------------------
var HORDE_MIN = 6, HORDE_MAX = 8;          // Gegner im Lager
var TRUHE_TRAENKE = 2;                     // Heiltraenke aus der Truhe
var TRUHE_XP = 14;                         // Erfahrung je Ebene (Grundwert, steigt mit der Ebene)
var ELITE_LEBEN = 2, ELITE_SCHADEN = 1;    // Elite: Leben x2, Schaden +1
var SCHLUESSEL_NAMEN = ["Archivschlüssel", "Beinhausschlüssel", "Sakristeischlüssel"];
// -----------------------------------------------------------------------

function raumEnthaelt(raum, gx, gy) { return gx > raum.x && gx < raum.x + raum.w - 1 && gy > raum.y && gy < raum.y + raum.h - 1; }

// Typen vergeben (am Ende von erzeugeEbene). weit = Weglaengen vom Start (karte.js weglaengen).
function raumTypenVergeben(e, weit) {
  var rs = e.raeume, i, frei = [];
  e.typFeld = [];
  for (var y = 0; y < RASTER; y++) { e.typFeld.push([]); for (var x = 0; x < RASTER; x++) e.typFeld[y].push(""); }
  for (i = 0; i < rs.length; i++) {
    var r = rs[i];
    r.typ = "normal";
    if (raumEnthaelt(r, e.start.x, e.start.y)) r.typ = "start";
    else if (raumEnthaelt(r, e.treppe.x, e.treppe.y)) r.typ = "treppe";
    else frei.push(r);
  }
  e.schloss = false;
  if (frei.length >= 6) {
    function nimm(r, typ) { r.typ = typ; frei.splice(frei.indexOf(r), 1); }
    function wegZu(r) { return weit[r.cy][r.cx]; }
    frei.sort(function (a, b) { return wegZu(b) - wegZu(a); });                 // fern -> nah
    nimm(frei[zufall(0, Math.min(2, frei.length - 1))], "schluessel");          // einer der drei fernsten
    nimm(frei[zufall(0, frei.length - 1)], "schatz");
    nimm(frei[frei.length - 1 - zufall(0, Math.min(1, frei.length - 1))], "kapelle");   // eher nah am Start: Erholung vor dem Weg
    nimm(frei[zufall(0, frei.length - 1)], "horde");
    if (e.ebenenNr >= 2 && frei.length > 3) nimm(frei[zufall(0, frei.length - 1)], "horde");
    e.schloss = true; e.treppeOffen = false;
  }
  for (i = 0; i < rs.length; i++) {
    var q = rs[i];
    for (var yy = q.y + 1; yy < q.y + q.h - 1; yy++) for (var xx = q.x + 1; xx < q.x + q.w - 1; xx++) e.typFeld[yy][xx] = q.typ;
  }
}

function raumTypAn(ebene, gx, gy) { return ebene.typFeld && ebene.typFeld[gy] ? ebene.typFeld[gy][gx] || "" : ""; }
function treppeGesperrt(ebene) { return !!(ebene.schloss && !ebene.treppeOffen); }

// Fundstuecke der Ebene (spiel.js erzeugeFunde haengt sie an). Standplatz: eine Kachel ueber der Raummitte.
function raumFunde(ebene) {
  var liste = [];
  if (!ebene.schloss) return liste;
  var arten = { schluessel: "schluessel", schatz: "truhe", kapelle: "altar" };
  for (var i = 0; i < ebene.raeume.length; i++) {
    var r = ebene.raeume[i], art = arten[r.typ];
    if (!art) continue;
    var gx = r.cx, gy = r.cy - (begehbar(ebene, r.cx, r.cy - 1) ? 1 : 0);
    liste.push({ x: (gx + 0.5) * KACHEL, y: (gy + 0.5) * KACHEL, art: art, gelesen: false, verbraucht: false, offen: false, text: null });
  }
  return liste;
}

// Hinweiszeile fuer E
function raumHinweis(z, f) {
  if (f.art === "schluessel") return "E  —  Schlüssel nehmen";
  if (f.art === "truhe") return f.verbraucht ? "" : "E  —  Truhe öffnen";
  if (f.art === "altar") return f.verbraucht ? "" : "E  —  Am Altar beten";
  return "";
}

// E auf Schluessel/Truhe/Altar. true = behandelt (kein Gespraech).
function raumNutzen(z, f) {
  var sp = z.spieler, nr = z.ebenenNr;
  if (f.verbraucht) return true;
  if (f.art === "schluessel") {
    f.verbraucht = true; f.gelesen = true; z.ebene.treppeOffen = true;
    popup(z, sp.x, sp.y - 46, SCHLUESSEL_NAMEN[Math.min(nr, 3) - 1] + "!", "#ffe08a");
    popup(z, sp.x, sp.y - 66, "Die Treppe ist offen", "#e8d9a4");
    sfx("buch");
  } else if (f.art === "truhe") {
    f.verbraucht = true; f.offen = true; f.gelesen = true;
    for (var i = 0; i < TRUHE_TRAENKE; i++) z.traenke.push({ x: f.x + (i ? 16 : -16), y: f.y + 14 });
    sp.mana = sp.manaMax; sp.ausdauer = sp.ausdauerMax;
    popup(z, f.x, f.y - 34, "Truhe: +" + TRUHE_TRAENKE + " Tränke", "#ffe08a");
    beuteFallen(z, f.x, f.y + 26, "truhe");                          // ein Gegenstand (items.js)
    xpGeben(z, Math.round(TRUHE_XP * (1 + 0.5 * (nr - 1))), f.x, f.y - 54);
    sfx("buch");
  } else if (f.art === "altar") {
    if (sp.leben >= sp.lebenMax && sp.mana >= sp.manaMax) { popup(z, sp.x, sp.y - 40, "Du brauchst es gerade nicht", "#8a8fb8"); return true; }
    f.verbraucht = true; f.gelesen = true;
    sp.leben = sp.lebenMax; sp.mana = sp.manaMax; sp.ausdauer = sp.ausdauerMax;
    popup(z, sp.x, sp.y - 46, "Der Altar wärmt dich", "#9ec4ff");
    z.blitzMs = 0.18; sfx("nova");
  }
  return true;
}

// Elite: groesser, mehr Leben, sicherer Trank (gegner.js erzeugeGegner ruft).
function eliteMachen(g) {
  g.elite = true; g.leben = g.lebenMax = g.leben * ELITE_LEBEN; g.schaden += ELITE_SCHADEN; g.radius = Math.min(15, g.radius + 3);
  return g;
}

// ---- Zeichnen ---------------------------------------------------------------------
// Rueckgabe true, wenn das Fundstueck hier gezeichnet wurde (grafik.js fundZeichnen ruft).
function raumFundZeichnen(ctx, f, camX, camY) {
  var x = f.x - camX, y = f.y - camY + 8;
  if (f.art === "schluessel") {
    if (f.verbraucht) return true;
    var hb = Math.sin(ANIM * 2.4) * 2;
    schatten(ctx, x, y, 8); glut(ctx, x, y - 12, 44, "255,210,110", 0.4 + Math.sin(ANIM * 3) * 0.08);
    ctx.strokeStyle = "#e8c860"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x - 5, y - 16 + hb, 4, 0, TAU); ctx.stroke();
    lin(ctx, x - 1, y - 16 + hb, x + 10, y - 16 + hb, "#e8c860", 2.4); lin(ctx, x + 7, y - 16 + hb, x + 7, y - 11 + hb, "#e8c860", 2.2); lin(ctx, x + 10, y - 16 + hb, x + 10, y - 12 + hb, "#e8c860", 2.2);
    return true;
  }
  if (f.art === "truhe") {
    schatten(ctx, x, y, 14);
    rc(ctx, x - 13, y - 14, 26, 14, "#5a3a20"); rc(ctx, x - 13, y - 14, 26, 2, "#7a5230");
    rc(ctx, x - 13, y - 8, 26, 2, "#2a2a30"); rc(ctx, x - 2, y - 11, 4, 6, "#c8a860");
    if (f.offen) { poly(ctx, [x - 13, y - 14, x + 13, y - 14, x + 11, y - 24, x - 11, y - 24], "#4a2e18"); rc(ctx, x - 11, y - 14, 22, 3, "#0e0a08"); }
    else { poly(ctx, [x - 13, y - 14, x + 13, y - 14, x + 11, y - 19, x - 11, y - 19], "#6a4426"); rc(ctx, x - 13, y - 17, 26, 2, "#2a2a30");
           glut(ctx, x, y - 10, 36, "255,200,110", 0.2 + Math.sin(ANIM * 2) * 0.05); }
    return true;
  }
  if (f.art === "altar") {
    schatten(ctx, x, y, 16);
    rc(ctx, x - 14, y - 16, 28, 16, "#6a6a74"); rc(ctx, x - 16, y - 20, 32, 5, "#8a8a96"); rc(ctx, x - 14, y - 16, 28, 2, "rgba(255,255,255,0.15)");
    var an = f.verbraucht ? 0.08 : 0.5 + Math.sin(ANIM * 7) * 0.08;
    for (var k = -1; k <= 1; k += 2) { rc(ctx, x + k * 11 - 1.5, y - 30, 3, 10, "#e8dcc0"); if (!f.verbraucht) { kr(ctx, x + k * 11, y - 33, 2.2, "#ffd37a"); } }
    glut(ctx, x, y - 24, f.verbraucht ? 30 : 70, "255,200,120", an);
    lin(ctx, x, y - 36, x, y - 26, "#d8d2bc", 2); lin(ctx, x - 4, y - 32, x + 4, y - 32, "#d8d2bc", 2);   // Kreuz
    return true;
  }
  return false;
}

// Bodenschmuck je Raumtyp (sprites.js boden ruft).
function raumBoden(ctx, sx, sy, typ, gx, gy) {
  if (typ === "schatz") {                                           // roter Teppich mit Goldkante
    rc(ctx, sx + 2, sy + 2, KACHEL - 4, KACHEL - 4, "rgba(120,26,36,0.6)");
    ctx.strokeStyle = "rgba(200,168,80,0.45)"; ctx.strokeRect(sx + 4.5, sy + 4.5, KACHEL - 9, KACHEL - 9);
  } else if (typ === "kapelle") {                                   // helle Fliesen, Schachbrett
    if ((gx + gy) % 2) rc(ctx, sx, sy, KACHEL, KACHEL, "rgba(190,200,235,0.10)"); else rc(ctx, sx, sy, KACHEL, KACHEL, "rgba(20,24,40,0.18)");
  } else if (typ === "horde") {                                     // Lager: Flecken, Knochen
    var r = rausch(gx, gy, 41);
    if (r > 0.55) ell(ctx, sx + 10 + r * 12, sy + 12 + r * 8, 7, 4, "rgba(80,12,14,0.5)");
    if (r > 0.88) { lin(ctx, sx + 6, sy + 24, sx + 20, sy + 18, "#b8b29c", 2.2); kr(ctx, sx + 22, sy + 17, 2, "#b8b29c"); }
  } else if (typ === "schluessel") {                                // dunkle Rune im Boden
    if ((gx * 7 + gy * 3) % 5 === 0) { ctx.strokeStyle = "rgba(220,190,110,0.28)"; ctx.beginPath(); ctx.arc(sx + 16, sy + 16, 9, 0, TAU); ctx.stroke(); }
  }
}

// Wanddeko je Ebene (sprites.js wand ruft, nur Mauerflaechen mit Boden davor).
function raumWandDeko(ctx, sx, sy, ebeneNr, gx, gy) {
  var r = rausch(gx, gy, 11);
  if (r < 0.62) return;
  if (ebeneNr === 1) {                                              // Archiv: Regale mit Buchruecken
    rc(ctx, sx + 4, sy + 4, 24, 22, "#3a2616"); rc(ctx, sx + 5, sy + 5, 22, 20, "#1c120a");
    for (var row = 0; row < 3; row++) {
      for (var b = 0; b < 6; b++) {
        var h = 4 + rausch(gx + b, gy + row, 12) * 3, f = ["#7a3a2a", "#3a5a4a", "#6a5a2a", "#4a3a6a"][Math.floor(rausch(gx + b, gy * 3 + row, 13) * 4)];
        rc(ctx, sx + 6 + b * 3.6, sy + 5 + row * 6.6 + (6.4 - h), 3, h, f);
      }
      rc(ctx, sx + 5, sy + 11.6 + row * 6.6, 22, 1, "#5a3a22");
    }
  } else if (ebeneNr === 2) {                                       // Beinhaus: Nische mit Schaedeln
    rc(ctx, sx + 6, sy + 6, 20, 16, "#0c0a0a");
    for (var s = 0; s < 3; s++) { kr(ctx, sx + 11 + s * 5, sy + 15 - (s % 2) * 4, 3.4, "#cfc8b0"); rc(ctx, sx + 9.5 + s * 5, sy + 15.5 - (s % 2) * 4, 3, 1.4, "#14100c"); }
    rc(ctx, sx + 6, sy + 22, 20, 2, "#4a443a");
  } else {                                                          // Sakristei: Wandteppich, Kerzenhalter
    if (r > 0.82) { rc(ctx, sx + 9, sy + 4, 14, 24, "#5a1620"); rc(ctx, sx + 9, sy + 4, 14, 2, "#c8a050"); poly(ctx, [sx + 9, sy + 28, sx + 23, sy + 28, sx + 16, sy + 23], "#14080a"); lin(ctx, sx + 16, sy + 9, sx + 16, sy + 20, "#c8a050", 1.4); lin(ctx, sx + 12, sy + 13, sx + 20, sy + 13, "#c8a050", 1.4); }
    else { rc(ctx, sx + 6, sy + 6, 20, 18, "#2e1c14"); rc(ctx, sx + 7, sy + 7, 9, 16, "#3e2820"); rc(ctx, sx + 17, sy + 7, 8, 16, "#3e2820"); kr(ctx, sx + 15, sy + 15, 1, "#c8a050"); kr(ctx, sx + 17, sy + 15, 1, "#c8a050"); }
  }
}

// Gitter ueber der Treppe, solange sie verschlossen ist.
function raumTreppeGitter(ctx, sx, sy) {
  rc(ctx, sx, sy, KACHEL, KACHEL, "rgba(8,6,6,0.55)");
  for (var i = 0; i < 5; i++) rc(ctx, sx + 3 + i * 6.5, sy + 2, 2, KACHEL - 4, "#4a4650");
  rc(ctx, sx + 2, sy + 9, KACHEL - 4, 2.2, "#5a5660"); rc(ctx, sx + 2, sy + 21, KACHEL - 4, 2.2, "#5a5660");
  rc(ctx, sx + 13, sy + 14, 6, 6, "#c8a860");                      // Schloss
}

// ---- HUD: Schluesselanzeige oben links, Pfeil zur Treppe --------------------------------
function raumHud(ctx, b, h, z) {
  var e = z.ebene;
  if (z.phase !== "dungeon" || !e || !e.schloss) return;
  var offen = e.treppeOffen, x = 16, y = 82;
  ctx.save();
  ctx.strokeStyle = offen ? "#e8c860" : "#6a6454"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x + 4, y, 4, 0, TAU); ctx.stroke();
  lin(ctx, x + 8, y, x + 20, y, offen ? "#e8c860" : "#6a6454", 2); lin(ctx, x + 16, y, x + 16, y + 4, offen ? "#e8c860" : "#6a6454", 2);
  ctx.fillStyle = offen ? "#e8d9a4" : "#8a8368"; ctx.font = "12px Georgia, serif";
  ctx.fillText(offen ? "Treppe offen" : "Treppe verschlossen — Schlüssel suchen", x + 26, y + 4);
  ctx.restore();
  if (!offen || DREI_D || e.kammer) return;
  var cam = kamera(b, h, z.spieler), tx = ((e.treppe.x + 0.5) * KACHEL - cam.x) * ZOOM, ty = ((e.treppe.y + 0.5) * KACHEL - cam.y) * ZOOM;
  var m = 46;
  if (tx > m && tx < b - m && ty > m && ty < h - 110) return;       // Treppe im Bild: kein Pfeil
  var cx = b / 2, cy = h / 2 - 20, dx = tx - cx, dy = ty - cy, k = Math.min((b / 2 - m) / Math.abs(dx || 1e-6), (h / 2 - 120) / Math.abs(dy || 1e-6));
  var px = cx + dx * k, py = cy + dy * k, w = Math.atan2(dy, dx), puls = 1 + Math.sin(ANIM * 5) * 0.12;
  ctx.save(); ctx.translate(px, py); ctx.rotate(w); ctx.scale(puls, puls);
  glut(ctx, 0, 0, 40, "255,210,110", 0.35);
  poly(ctx, [14, 0, -8, -10, -3, 0, -8, 10], "#ffe08a"); ctx.strokeStyle = "#7a5a1a"; ctx.strokeRect(-0.5, -0.5, 0, 0);
  ctx.restore();
  ctx.fillStyle = "#e8d9a4"; ctx.font = "11px Georgia, serif"; ctx.textAlign = "center";
  ctx.fillText("Treppe", px - Math.cos(w) * 24, py - Math.sin(w) * 24 + 4); ctx.textAlign = "left";
}

