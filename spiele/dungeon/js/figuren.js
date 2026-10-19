// figuren.js — Helden und Dorfbewohner (Canvas-Formen). Setzt sprites.js voraus.
// heldZeichnen(ctx, sx, sy, sp, held): sp = Spieler (blick, geht, gehT, schlagAktiv ...).

function heldZeichnen(ctx, sx, sy, sp, h) {
  var f = h.farben, bl = sp.blick || 0, t = sp.gehT || 0, geht = !!sp.geht;
  var bob = geht ? Math.abs(Math.sin(t * 10)) * 2 : Math.sin(ANIM * 2) * 0.6;
  var sw = geht ? Math.sin(t * 10) * 3 : 0;
  var oben = Math.sin(bl) < -0.55, cx = Math.cos(bl);
  var robe = h.id === "anselm";
  if (sp.dodgeT > 0) ctx.globalAlpha = 0.6;
  var hub = sp.sprungH || 0;                                          // Wolfsprung: Figur in der Luft, Schatten bleibt am Boden
  if (hub) { schatten(ctx, sx, sy, 11 * (1 - hub / 90)); sy -= hub; } else schatten(ctx, sx, sy, 11);
  if (!robe) {                                                        // Umhang hinter dem Koerper
    poly(ctx, [sx - 8, sy - 25 - bob, sx + 8, sy - 25 - bob, sx + 11 - cx * 3, sy - 4, sx - 11 - cx * 3, sy - 4], f.umhang);
    rc(ctx, sx - 5, sy - 10 - Math.max(0, sw * 0.5), 4, 10, f.beine); rc(ctx, sx + 1, sy - 10 - Math.max(0, -sw * 0.5), 4, 10, f.beine);
    rc(ctx, sx - 6, sy - 3, 5, 3, "#1f1812"); rc(ctx, sx + 1, sy - 3, 5, 3, "#1f1812");
  }
  if (h.id === "mara") rc(ctx, sx - 3 - cx * 5, sy - 28 - bob, 5, 15, "#4a3220");                    // Koecher
  if (robe) {                                                         // lange Kutte
    poly(ctx, [sx - 7, sy - 25 - bob, sx + 7, sy - 25 - bob, sx + 11, sy - 1, sx - 11, sy - 1], f.rock);
    lin(ctx, sx - 9, sy - 2, sx + 9, sy - 2, "rgba(0,0,0,0.3)", 2);
  } else {
    rc(ctx, sx - 7, sy - 25 - bob, 14, 16, f.rock);
    rc(ctx, sx - 7, sy - 22 - bob, 14, 2, "rgba(255,255,255,0.12)");
  }
  ausrKoerper(ctx, sx, sy, bob, robe, sp);                            // getragener Koerperteil, Amulett (itemgrafik.js)
  rc(ctx, sx - 7, sy - 14 - bob, 14, 2.4, f.guertel);
  if (h.id === "garrick") {                                           // Schulterstuecke, Bart
    kr(ctx, sx - 8, sy - 24 - bob, 4.6, "#8a8f9c"); kr(ctx, sx + 8, sy - 24 - bob, 4.6, "#8a8f9c");
    kr(ctx, sx - 9, sy - 25.5 - bob, 1.6, "rgba(255,255,255,0.5)");
  }
  kr(ctx, sx, sy - 30 - bob, 6.5, f.haut);                           // Kopf
  ctx.fillStyle = f.haar; ctx.beginPath(); ctx.arc(sx, sy - 31 - bob, 6.8, Math.PI, TAU); ctx.fill();
  if (oben) kr(ctx, sx, sy - 30 - bob, 6.6, f.haar);
  if (h.id === "mara") {                                              // Kapuze, Zopf
    ctx.fillStyle = f.umhang; ctx.beginPath(); ctx.arc(sx, sy - 30 - bob, 7.6, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
    lin(ctx, sx - cx * 5, sy - 28 - bob, sx - cx * 9, sy - 18 - bob, f.haar, 2.6);
  }
  if (h.id === "anselm") { ctx.fillStyle = f.umhang; ctx.beginPath(); ctx.arc(sx, sy - 27 - bob, 8, Math.PI * 1.05, Math.PI * 1.95); ctx.fill(); }
  ausrKopf(ctx, sx, sy, bob, sp, oben);                               // getragener Kopfschutz
  if (!oben) {
    var ex = cx * 2;
    rc(ctx, sx - 3 + ex, sy - 31 - bob, 2, 2, "#1d1814"); rc(ctx, sx + 1 + ex, sy - 31 - bob, 2, 2, "#1d1814");
    if (h.id === "garrick") { ctx.fillStyle = f.haar; ctx.beginPath(); ctx.arc(sx + ex, sy - 28 - bob, 5, 0.2, Math.PI - 0.2); ctx.fill(); }
  }
  // Waffe: ruht seitlich, schwingt waehrend des Schlags im Bogen
  var a = bl + 0.9, hx, hy, p;
  if (sp.schlagAktiv > 0) { p = 1 - sp.schlagAktiv / KOMBO_SCHLAGDAUER; a = bl + ((sp.kombo || 0) % 2 ? -1 : 1) * (-1.1 + 2.2 * p); }
  hx = sx + Math.cos(a) * 9; hy = sy - 18 - bob + Math.sin(a) * 5;
  lin(ctx, sx + (cx >= 0 ? 6 : -6), sy - 22 - bob, hx, hy, f.haut, 3);
  var wart = sp.ausr && sp.ausr.waffe ? sp.ausr.waffe.art : h.waffe, L = ausrWaffeLaenge(wart);
  var ex2 = hx + Math.cos(a) * L, ey2 = hy + Math.sin(a) * L;
  ausrWaffe(ctx, wart, hx, hy, ex2, ey2, a);
  if (h.id === "anselm") {                                            // Laterne in der anderen Hand (gehoert zu ihm, nicht zur Waffe)
    var lx = sx + (cx >= 0 ? -10 : 10), ly = sy - 15 - bob + Math.sin(ANIM * 3) * 0.8;
    lin(ctx, sx + (cx >= 0 ? -6 : 6), sy - 22 - bob, lx, ly - 3, f.haut, 3);
    rc(ctx, lx - 3, ly - 3, 6, 7, "#3a2c1c"); rc(ctx, lx - 2, ly - 2, 4, 5, "#ffd890");
    glut(ctx, lx, ly, 34, "255,200,120", 0.35 + Math.sin(ANIM * 9) * 0.04);
  }
  ctx.globalAlpha = 1;
}

// ---- Dorfbewohner ---------------------------------------------------------
function npcZeichnen(ctx, sx, sy, n) {
  if (n.art === "ambros") { priesterZeichnen(ctx, sx, sy, 1.15, 0); return; }
  var sway = Math.sin(ANIM * 1.7 + n.x) * 0.8;
  var haut = "#d6b08c";
  schatten(ctx, sx, sy, n.art === "schmied" ? 14 : (n.art === "tilda" ? 7 : 11));
  if (n.art === "agnes") {
    poly(ctx, [sx - 6, sy - 24, sx + 6, sy - 24, sx + 11, sy - 1, sx - 11, sy - 1], "#5b5360");
    poly(ctx, [sx - 8, sy - 25, sx + 8, sy - 25, sx, sy - 12], "#7a4a4a");
    kr(ctx, sx, sy - 29, 5.8, haut); kr(ctx, sx, sy - 34, 4, "#bdbab4"); rc(ctx, sx - 6, sy - 33, 12, 3, "#bdbab4");
    lin(ctx, sx + 12, sy - 4, sx + 11, sy - 21, "#6a4a2c", 2.4);
  } else if (n.art === "schmied") {
    rc(ctx, sx - 7, sy - 11, 5, 11, "#2c2a2e"); rc(ctx, sx + 2, sy - 11, 5, 11, "#2c2a2e");
    rc(ctx, sx - 11, sy - 28 + sway * 0.3, 22, 18, "#6b4a3a"); rc(ctx, sx - 8, sy - 22, 16, 13, "#3a2a22");
    kr(ctx, sx - 12, sy - 22, 4.2, haut); kr(ctx, sx + 12, sy - 22, 4.2, haut);
    kr(ctx, sx, sy - 33, 6.5, haut); ctx.fillStyle = "#3a2a1c"; ctx.beginPath(); ctx.arc(sx, sy - 31, 6.5, 0.1, Math.PI - 0.1); ctx.fill();
    rc(ctx, sx - 3, sy - 35, 2, 2, "#1d1814"); rc(ctx, sx + 1, sy - 35, 2, 2, "#1d1814");
    lin(ctx, sx + 12, sy - 22, sx + 16, sy - 36, "#6a4a2c", 2.6); rc(ctx, sx + 12, sy - 40, 9, 5, "#7a7f8c");
  } else if (n.art === "ilse") {
    poly(ctx, [sx - 6, sy - 24, sx + 6, sy - 24, sx + 10, sy - 1, sx - 10, sy - 1], "#2a2a34");
    rc(ctx, sx - 4, sy - 22, 8, 8, "#d8d4c8");
    kr(ctx, sx, sy - 29, 7.2, "#e6e2d6"); kr(ctx, sx, sy - 29, 5, haut);
    rc(ctx, sx - 2.4, sy - 30, 1.8, 1.8, "#1d1814"); rc(ctx, sx + 1, sy - 30, 1.8, 1.8, "#1d1814");
    lin(ctx, sx, sy - 21, sx, sy - 16, "#c8a860", 1.4); lin(ctx, sx - 1.6, sy - 19, sx + 1.6, sy - 19, "#c8a860", 1.4);
    kr(ctx, sx - 3, sy - 14, 2.2, haut); kr(ctx, sx + 3, sy - 14, 2.2, haut);
  } else if (n.art === "berta") {                                     // Haushaelterin: dunkles Kleid, weisse Schuerze, Schluesselbund
    poly(ctx, [sx - 7, sy - 25, sx + 7, sy - 25, sx + 11, sy - 1, sx - 11, sy - 1], "#3a3a40");
    poly(ctx, [sx - 4, sy - 22, sx + 4, sy - 22, sx + 6, sy - 3, sx - 6, sy - 3], "#e4e0d4");
    kr(ctx, sx, sy - 30, 5.6, haut); kr(ctx, sx, sy - 35, 4.2, "#8a8a90"); rc(ctx, sx - 5.4, sy - 33, 10.8, 2.6, "#8a8a90");
    rc(ctx, sx - 2.2, sy - 30.6, 1.6, 1.6, "#1d1814"); rc(ctx, sx + 0.8, sy - 30.6, 1.6, 1.6, "#1d1814");
    kr(ctx, sx - 3.5, sy - 15, 2.2, haut); kr(ctx, sx + 3.5, sy - 15, 2.2, haut);                      // Haende gefaltet
    lin(ctx, sx + 7, sy - 14, sx + 9, sy - 8, "#8a6b3a", 1.2); kr(ctx, sx + 9, sy - 7, 2, "#c9a24a"); kr(ctx, sx + 7, sy - 6, 1.6, "#c9a24a");   // Schluessel am Guertel
  } else {                                                            // Tilda, ein Kind
    rc(ctx, sx - 3, sy - 7, 2.4, 7, "#5a4a3a"); rc(ctx, sx + 1, sy - 7, 2.4, 7, "#5a4a3a");
    poly(ctx, [sx - 5, sy - 17, sx + 5, sy - 17, sx + 7, sy - 6, sx - 7, sy - 6], "#7a6a5a");
    lin(ctx, sx - 4, sy - 23, sx - 7, sy - 13, "#6a4a2c", 2); lin(ctx, sx + 4, sy - 23, sx + 7, sy - 13, "#6a4a2c", 2);
    kr(ctx, sx, sy - 22, 5.6, haut); ctx.fillStyle = "#6a4a2c"; ctx.beginPath(); ctx.arc(sx, sy - 23, 5.8, Math.PI, TAU); ctx.fill();
    rc(ctx, sx - 2.6, sy - 22, 1.8, 1.8, "#1d1814"); rc(ctx, sx + 1, sy - 22, 1.8, 1.8, "#1d1814");
  }
}

// Kerzenschrein in der Kapelle (Gegenstand zum Ansprechen).
function schreinZeichnen(ctx, sx, sy, tode) {
  schatten(ctx, sx, sy, 12);
  rc(ctx, sx - 9, sy - 12, 18, 12, "#4a4a52"); rc(ctx, sx - 9, sy - 12, 18, 2, "#74747e");
  var hoehe = Math.max(3, 10 - (tode || 0) * 2);                      // Kerze brennt mit jedem Tod ein Stueck herunter
  rc(ctx, sx - 2.5, sy - 12 - hoehe, 5, hoehe, "#e8dcb8"); rc(ctx, sx - 3.5, sy - 13, 7, 2, "rgba(255,255,255,0.35)");
  flamme(ctx, sx, sy - 12 - hoehe, 2.4, 3);
  glut(ctx, sx, sy - 18, 46, "255,190,110", 0.4 + Math.sin(ANIM * 9) * 0.05);
}
