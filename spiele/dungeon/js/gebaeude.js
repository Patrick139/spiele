// gebaeude.js — Haeuser, Schmiede, Kapelle und die Ruine der Abtei mit dem Tor.
// Zeichnet in Weltkoordinaten (Kamera schon abgezogen). Fenster- und
// Feuerlichter werden in DORFLICHT gesammelt und von dorfgrafik.js additiv
// ueber die abgedunkelte Szene gelegt.

var DORFLICHT = [];   // { x, y, r, rgb, a } — pro Bild neu gefuellt

function lichtMerken(x, y, r, rgbText, a) { DORFLICHT.push({ x: x, y: y, r: r, rgb: rgbText, a: a }); }

function rauch(ctx, x, y) {
  for (var i = 0; i < 6; i++) {
    var p = ((ANIM * 0.25 + i / 6) % 1);
    kr(ctx, x + Math.sin(p * 5 + i) * 5 + p * 10, y - p * 46, 3 + p * 7, "rgba(150,150,160," + (0.28 * (1 - p)) + ")");
  }
}

function fensterZeichnen(ctx, x, y, w, h, seed, farbe) {
  var fl = 0.8 + Math.sin(ANIM * 6 + seed) * 0.08 + Math.sin(ANIM * 15 + seed * 3) * 0.05;
  rc(ctx, x - 2, y - 2, w + 4, h + 4, "#2a1f16");
  ctx.fillStyle = farbe || "rgba(255,196,110," + fl + ")"; ctx.fillRect(x, y, w, h);
  rc(ctx, x + w / 2 - 0.5, y, 1, h, "#2a1f16"); rc(ctx, x, y + h / 2 - 0.5, w, 1, "#2a1f16");
  lichtMerken(x + w / 2, y + h / 2 + 8, 52, farbe ? "170,150,255" : "255,170,80", 0.3 * fl);
}

// b = Gebaeude { art, x, y, w, h, tuer } (Kacheln). x/y der Ecke oben links.
function zeichneHaus(ctx, b, camX, camY) {
  var X = b.x * KACHEL - camX, Y = b.y * KACHEL - camY, W = b.w * KACHEL, H = b.h * KACHEL;
  var FH = 42, rt = Y - 12, rb = Y + H - FH + 4;         // Dachoberkante / -unterkante
  var kap = b.art === "kapelle", sch = b.art === "schmiede";
  rc(ctx, X - 4, Y + H - 2, W + 8, 7, "rgba(0,0,0,0.35)");
  if (kap) {                                             // Glockenturm hinter dem Dach
    var tx = X + W / 2 - 26;
    rc(ctx, tx, rt - 56, 52, 80, "#7d786c"); rc(ctx, tx, rt - 56, 6, 80, "rgba(0,0,0,0.25)");
    poly(ctx, [tx - 4, rt - 56, tx + 26, rt - 108, tx + 56, rt - 56], "#3a3640");
    lin(ctx, tx + 26, rt - 108, tx + 26, rt - 124, "#b8a574", 2); lin(ctx, tx + 20, rt - 117, tx + 32, rt - 117, "#b8a574", 2);
    ctx.fillStyle = "#14110f"; ctx.beginPath(); ctx.arc(tx + 26, rt - 28, 12, Math.PI, TAU); ctx.fillRect(tx + 14, rt - 28, 24, 22); ctx.fill();
    kr(ctx, tx + 26, rt - 18, 5, "#a08a4a");
  }
  // Dachflaeche (leicht perspektivisch) mit Schindelreihen
  var dach = sch ? [74, 62, 60] : (kap ? [60, 58, 70] : [112, 56, 46]);
  poly(ctx, [X + 16, rt, X + W - 16, rt, X + W + 8, rb, X - 8, rb], rgb(dach, 0));
  poly(ctx, [X + 16, rt, X + W / 2, rt, X + W / 2 + 4, rb, X - 8, rb], "rgba(0,0,0,0.18)");
  for (var r = 1; r * 9 < rb - rt; r++) {
    var ry = rt + r * 9, inset = 16 - (16 + 8) * (r * 9) / (rb - rt);
    lin(ctx, X + inset, ry, X + W - inset, ry, "rgba(0,0,0,0.3)", 1);
    for (var s = 0; s < W / 12; s++) lin(ctx, X + inset + s * 12 + (r % 2) * 6, ry, X + inset + s * 12 + (r % 2) * 6, ry + 9, "rgba(0,0,0,0.16)", 1);
  }
  lin(ctx, X + 16, rt, X + W - 16, rt, "rgba(255,255,255,0.2)", 2);
  if (!kap) {                                            // Schornstein mit Rauch
    var cx = X + W * 0.72;
    rc(ctx, cx, rt - 14, 12, 28, "#5a5048"); rc(ctx, cx - 2, rt - 16, 16, 4, "#3a322c");
    rauch(ctx, cx + 6, rt - 16);
  }
  // Wandflaeche
  var wand = sch ? [96, 92, 88] : (kap ? [136, 132, 120] : [128, 110, 84]);
  rc(ctx, X, Y + H - FH, W, FH, rgb(wand, 0));
  rc(ctx, X, Y + H - FH, W, 3, "rgba(0,0,0,0.35)");
  if (b.art === "haus") {                                // Fachwerk
    for (var f = 0; f <= b.w; f++) rc(ctx, X + f * KACHEL - (f === b.w ? 3 : 0), Y + H - FH, 3, FH, "#3a281a");
    rc(ctx, X, Y + H - FH + 2, W, 3, "#3a281a");
  }
  ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(X, Y + H - 4, W, 4);
  // Tuer
  var dx = X + b.tuer * KACHEL + 3, dw = 26;
  if (sch) {
    rc(ctx, dx - 14, Y + H - 36, dw + 28, 36, "#1a0f0a");                   // offene Esse
    rc(ctx, dx - 8, Y + H - 12, dw + 16, 12, "#2a1c14");
    kr(ctx, dx + 13, Y + H - 16, 11, "rgba(255,120,30,0.9)");
    lichtMerken(dx + 13, Y + H - 14, 90 + Math.sin(ANIM * 12) * 8, "255,110,40", 0.5);
    rc(ctx, dx + 40, Y + H - 12, 14, 6, "#4a4a52"); rc(ctx, dx + 43, Y + H - 16, 8, 4, "#6a6a74");   // Amboss
  } else {
    ctx.fillStyle = kap ? "#1e1a2a" : "#2a1c12";
    ctx.beginPath(); ctx.moveTo(dx, Y + H); ctx.lineTo(dx, Y + H - 24); ctx.arc(dx + dw / 2, Y + H - 24, dw / 2, Math.PI, TAU); ctx.lineTo(dx + dw, Y + H); ctx.fill();
    if (!kap) { rc(ctx, dx + 6, Y + H - 12, 2, 2, "#c8a860"); }
  }
  // Fenster
  if (kap) {
    fensterZeichnen(ctx, X + 24, Y + H - 36, 14, 24, 1, "rgba(120,100,230,0.85)");
    fensterZeichnen(ctx, X + W - 38, Y + H - 36, 14, 24, 2, "rgba(210,70,80,0.85)");
  } else if (!sch) {
    fensterZeichnen(ctx, X + 14 + (b.tuer > 1 ? 0 : 60), Y + H - 34, 14, 14, b.x, null);
    if (b.w >= 5) fensterZeichnen(ctx, X + W - 30, Y + H - 34, 14, 14, b.x + 5, null);
    if (b.x === 8 && b.y === 31) {                       // dein Haus: Laterne an der Tuer
      lin(ctx, dx + dw + 6, Y + H - 34, dx + dw + 6, Y + H - 28, "#2a1c12", 1.5);
      rc(ctx, dx + dw + 3, Y + H - 28, 6, 7, "#ffd890"); lichtMerken(dx + dw + 6, Y + H - 24, 40, "255,200,120", 0.5);
    }
  } else fensterZeichnen(ctx, X + W - 34, Y + H - 34, 14, 14, 9, null);
}

// Ruine der Abtei Sankt Verena oben im Bild (Weltpixel y 0..224) mit dem Tor.
function zeichneAbtei(ctx, camX, camY) {
  var x0 = 15 * KACHEL, x1 = 36 * KACHEL, gy = 7 * KACHEL, i, hh;
  for (i = x0; i < x1; i += 16) {                        // Mauerreste als Saeulen verschiedener Hoehe
    var mitte = Math.abs(i + 8 - 25 * KACHEL) / 160;
    hh = 70 + rausch(i / 16, 0, 11) * 70 + (mitte > 1 ? 0 : (1 - mitte) * 20);
    if (i >= 23 * KACHEL && i < 27 * KACHEL) hh = 40;
    var turm = (i < 19 * KACHEL || i >= 32 * KACHEL) ? 60 : 0;
    var v = (rausch(i / 16, 3, 11) - 0.5) * 16;
    rc(ctx, i - camX, gy - hh - turm - camY, 16, hh + turm, rgb([74, 72, 78], v));
    rc(ctx, i - camX, gy - hh - turm - camY, 16, 3, "rgba(255,255,255,0.1)");
    for (var j = 0; j < hh + turm; j += 14) rc(ctx, i - camX, gy - j - camY, 16, 1, "rgba(0,0,0,0.3)");
  }
  var wx = [17, 20, 30, 33];                             // dunkle Spitzbogenfenster
  for (i = 0; i < wx.length; i++) {
    var fx = wx[i] * KACHEL - camX + 4, fy = gy - 120 - camY;
    ctx.fillStyle = "#0c0b10"; ctx.beginPath(); ctx.arc(fx + 8, fy, 8, Math.PI, TAU); ctx.fillRect(fx, fy, 16, 30); ctx.fill();
    glut(ctx, fx + 8, fy + 10, 28, "110,130,255", 0.1);
  }
  var cx = 25 * KACHEL - camX, base = gy - camY;          // Tor: Rundbogen, Schwelle am Boden
  ctx.fillStyle = "#6c6a72"; ctx.beginPath(); ctx.arc(cx, base - 90, 78, Math.PI, TAU); ctx.fillRect(cx - 78, base - 90, 156, 90); ctx.fill();
  var tg = ctx.createLinearGradient(0, base - 160, 0, base);
  tg.addColorStop(0, "#050407"); tg.addColorStop(0.7, "#14070a"); tg.addColorStop(1, "#3a1010");
  ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(cx, base - 90, 62, Math.PI, TAU); ctx.fillRect(cx - 62, base - 90, 124, 90); ctx.fill();
  for (i = 0; i < 9; i++) lin(ctx, cx - 78 + i * 20 + 4, base - 90 - Math.sin((i / 8) * Math.PI) * 78 + 4, cx - 78 + i * 20 + 4, base - 90 - Math.sin((i / 8) * Math.PI) * 78 - 6, "rgba(0,0,0,0.35)", 1);
  for (i = 0; i < 4; i++) {                              // Treppenstufen nach unten
    rc(ctx, cx - 56 + i * 6, base - 6 - i * 3, 112 - i * 12, 3, "rgba(90,70,60," + (0.5 - i * 0.1) + ")");
  }
  var pulse = 0.3 + Math.sin(ANIM * 2) * 0.1;
  lichtMerken(cx, base - 24, 110, "255,70,50", pulse * 0.6);
  lichtMerken(cx, base - 70, 90, "90,110,255", 0.1);
  for (i = -1; i <= 1; i += 2) {                        // zwei Feuerschalen am Tor
    var bx = cx + i * 104, by = base - 6;
    rc(ctx, bx - 2, by - 20, 4, 20, "#3a2c20"); rc(ctx, bx - 8, by - 24, 16, 5, "#4a4a52");
    flamme(ctx, bx, by - 24, 5, i * 4); lichtMerken(bx, by - 28, 100 + Math.sin(ANIM * 9 + i) * 6, "255,150,70", 0.5);
  }
}
