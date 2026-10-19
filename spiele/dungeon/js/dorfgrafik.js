// dorfgrafik.js — Hollenfurt zeichnen: Boden, Wald, Brunnen, Bewohner, Daemmerlicht,
// Nebel und fallende Asche. Gebaeude und Abtei: gebaeude.js.

function dorfBoden(ctx, gx, gy, sx, sy, k, weg) {
  var r = rausch(gx, gy, 1), d = rausch(gx, gy, 2), K1 = KACHEL + 1;   // +1: kein Spalt zwischen Kacheln
  if (k === 2) {                                         // Schwelle vor dem Tor
    rc(ctx, sx, sy, K1, K1, rgb([40, 34, 36], (r - 0.5) * 10));
    rc(ctx, sx, sy + 15, KACHEL, 1, "rgba(0,0,0,0.4)");
    return;
  }
  if (k === 0) { rc(ctx, sx, sy, K1, K1, rgb([26, 34, 28], (r - 0.5) * 8)); return; }
  if (weg) {
    rc(ctx, sx, sy, K1, K1, rgb([96, 80, 58], (r - 0.5) * 7));
    rc(ctx, sx + 8, sy, 3, KACHEL, "rgba(0,0,0,0.07)"); rc(ctx, sx + 21, sy, 3, KACHEL, "rgba(0,0,0,0.07)");   // Wagenspuren
    if (d > 0.6) kr(ctx, sx + r * 26 + 3, sy + d * 24 + 4, 1.6, "rgba(60,50,40,0.7)");
    if (d < 0.1) kr(ctx, sx + 20, sy + 10, 2.4, "rgba(150,140,125,0.6)");
    return;
  }
  rc(ctx, sx, sy, K1, K1, rgb([56, 66, 46], (r - 0.5) * 6));
  if (d > 0.45) for (var i = 0; i < 3; i++) {            // Grasbueschel
    var bx = sx + rausch(gx, gy, 20 + i) * 28 + 2, by = sy + rausch(gx, gy, 30 + i) * 26 + 5;
    lin(ctx, bx, by, bx - 1.5, by - 4, "rgba(30,44,24,0.8)", 1); lin(ctx, bx, by, bx + 1.5, by - 4, "rgba(30,44,24,0.8)", 1);
  }
  if (d > 0.9) ell(ctx, sx + r * 22 + 4, sy + d * 20 + 6, 3.2, 1.8, "rgba(190,110,40,0.7)");   // Herbstlaub
  if (d < 0.04) poly(ctx, [sx + 8, sy + 22, sx + 13, sy + 15, sx + 20, sy + 21, sx + 17, sy + 26], "rgba(110,108,104,0.9)");
}

// Baum auf Kachel (gx,gy): Tanne im Wald, Laubbaum (Herbstfarben) im Dorf.
function baumZeichnen(ctx, t, camX, camY) {
  var r = rausch(t.gx, t.gy, 4), x = t.gx * KACHEL + 16 + (r - 0.5) * 14 - camX, y = (t.gy + 1) * KACHEL - 2 - camY;
  var s = t.wald ? 1.15 + r * 0.5 : 1 + r * 0.25;
  schatten(ctx, x, y + 2, 14 * s);
  rc(ctx, x - 2.5 * s, y - 14 * s, 5 * s, 14 * s, "#2e2118");
  if (t.wald || r < 0.45) {
    for (var i = 0; i < 3; i++) {
      var w = (17 - i * 3.5) * s, h = 17 * s, yy = y - 10 * s - i * 11 * s;
      poly(ctx, [x - w, yy, x + w, yy, x, yy - h], rgb(t.wald ? [26, 52, 38] : [34, 66, 44], -i * 3 + (r - 0.5) * 20));
      poly(ctx, [x, yy - h, x + w, yy, x + w * 0.2, yy], "rgba(0,0,0,0.25)");
    }
  } else {
    var herbst = [[140, 84, 28], [168, 106, 34], [112, 74, 30], [96, 90, 40]][Math.floor(r * 7) % 4];
    kr(ctx, x - 9 * s, y - 28 * s, 11 * s, rgb(herbst, -18)); kr(ctx, x + 9 * s, y - 27 * s, 11 * s, rgb(herbst, -10));
    kr(ctx, x, y - 36 * s, 13 * s, rgb(herbst, 0)); kr(ctx, x - 3 * s, y - 39 * s, 6 * s, rgb(herbst, 16));
  }
}

function brunnenZeichnen(ctx, ignoriert, camX, camY) {
  var x = 25 * KACHEL - camX, y = 24 * KACHEL - camY - 4;
  schatten(ctx, x, y + 6, 34);
  ell(ctx, x, y - 6, 31, 19, "#6a6a72"); ell(ctx, x, y - 8, 25, 14, "#1a2230");
  ell(ctx, x - 6, y - 10, 9, 3, "rgba(160,190,230,0.35)");
  ctx.strokeStyle = "#8a8a94"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y - 8, 28, 16, 0, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke(); ctx.lineWidth = 1;
  rc(ctx, x - 24, y - 44, 4, 38, "#4a3624"); rc(ctx, x + 20, y - 44, 4, 38, "#4a3624");
  poly(ctx, [x - 32, y - 42, x + 32, y - 42, x, y - 64], "#4a3a4e");
  lin(ctx, x, y - 42, x, y - 20, "#7a6a50", 1); rc(ctx, x - 4, y - 21, 8, 7, "#5a4228");
}

// Alles Dorfliche in einem Bild; z.spieler steht im Dorf.
function zeichneDorf(ctx, breite, hoehe, z) {
  ANIM = performance.now() / 1000;
  DORFLICHT.length = 0;
  var sp = z.spieler, ebene = z.ebene, cam = kamera(breite, hoehe, sp), camX = cam.x, camY = cam.y;
  var sb = breite / ZOOM, sh = hoehe / ZOOM;
  var gx0 = Math.max(0, Math.floor(camX / KACHEL) - 1), gy0 = Math.max(0, Math.floor(camY / KACHEL) - 1);
  var gx1 = Math.min(RASTER - 1, Math.ceil((camX + sb) / KACHEL) + 1), gy1 = Math.min(RASTER - 1, Math.ceil((camY + sh) / KACHEL) + 3);
  var gx, gy, i;
  ctx.fillStyle = "#0b100e"; ctx.fillRect(0, 0, breite, hoehe);
  ctx.save(); ctx.scale(ZOOM, ZOOM);
  for (gy = gy0; gy <= gy1; gy++)
    for (gx = gx0; gx <= gx1; gx++)
      dorfBoden(ctx, gx, gy, gx * KACHEL - camX, gy * KACHEL - camY, ebene.feld[gy][gx], ebene.weg[gy][gx]);
  for (gy = Math.floor(camY / 128) - 1; gy <= Math.ceil((camY + sh) / 128); gy++)     // weiche Flecken
    for (gx = Math.floor(camX / 128) - 1; gx <= Math.ceil((camX + sb) / 128); gx++) {
      var fr = rausch(gx, gy, 14), fx = gx * 128 + rausch(gx, gy, 15) * 128 - camX, fy = gy * 128 + rausch(gx, gy, 16) * 128 - camY;
      var fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 70 + fr * 60);   // helle/dunkle Flecken (normal gemischt)
      fg.addColorStop(0, fr > 0.5 ? "rgba(255,240,200,0.05)" : "rgba(0,0,0,0.14)"); fg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fg; ctx.fillRect(fx - 130, fy - 130, 260, 260);
    }
  if (camY < 230) zeichneAbtei(ctx, camX, camY);

  var ents = [];
  for (gy = gy0; gy <= gy1; gy++) {
    for (gx = gx0; gx <= gx1; gx++) {
      var k = ebene.feld[gy][gx];
      if (k === 5 || (k === 0 && !(gy < 7 && gx >= 15 && gx <= 35)))
        ents.push({ y: (gy + 1) * KACHEL, f: baumZeichnen, a: { gx: gx, gy: gy, wald: k === 0 } });
    }
  }
  for (i = 0; i < ebene.gebaeude.length; i++) {
    var b = ebene.gebaeude[i];
    if ((b.x + b.w) * KACHEL > camX - 40 && b.x * KACHEL < camX + sb + 40 && (b.y + b.h) * KACHEL > camY - 100 && b.y * KACHEL < camY + sh + 140)
      ents.push({ y: (b.y + b.h) * KACHEL, f: zeichneHaus, a: b });
  }
  ents.push({ y: 24 * KACHEL, f: brunnenZeichnen, a: null });
  for (i = 0; i < DORF_DINGE.length; i++) {
    var d = DORF_DINGE[i];
    if (d.art === "tuer" || (d.weg && d.weg())) continue;
    ents.push({ y: d.y * KACHEL, f: dingZeichnen, a: d });
  }
  ents.push({ y: sp.y, f: spielerZeichnen, a: sp });
  ents.sort(function (a, c) { return a.y - c.y; });
  for (i = 0; i < ents.length; i++) ents[i].f(ctx, ents[i].a, camX, camY);

  // Daemmerung: kuehle Abdunklung, dann warme Lichter additiv darueber
  ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "#a4abd2"; ctx.fillRect(0, 0, sb, sh);
  ctx.globalCompositeOperation = "source-over";
  for (i = 0; i < DORFLICHT.length; i++) {
    var l = DORFLICHT[i];
    glut(ctx, l.x, l.y, l.r, l.rgb, l.a);
  }
  for (i = 0; i < 4; i++) {                              // Bodennebel
    var nx = ((i * 190 + ANIM * (6 + i * 2)) % (sb + 300)) - 150, ny = sh * (0.3 + i * 0.2);
    var ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 160);
    ng.addColorStop(0, "rgba(170,180,200,0.1)"); ng.addColorStop(1, "rgba(170,180,200,0)");
    ctx.fillStyle = ng; ctx.fillRect(nx - 160, ny - 160, 320, 320);
  }
  for (i = 0; i < 70; i++) {                             // Asche und Laub treiben ueber das Dorf
    var ax = (rausch(i, 1, 8) * sb * 1.3 + ANIM * (9 + i % 4 * 4) + Math.sin(ANIM + i) * 8) % (sb * 1.3) - sb * 0.15;
    var ay = (rausch(i, 2, 8) * sh + ANIM * (14 + i % 5 * 5)) % sh;
    ctx.fillStyle = i % 3 ? "rgba(210,205,200,0.45)" : "rgba(255,150,60,0.6)";
    ctx.fillRect(ax, ay, 1.4, 1.4);
  }
  ctx.restore();
}

function dingZeichnen(ctx, d, camX, camY) {
  var sx = d.x * KACHEL - camX, sy = d.y * KACHEL - camY + 6;
  if (d.art === "schrein") schreinZeichnen(ctx, sx, sy, zustand.tode || 0);
  else npcZeichnen(ctx, sx, sy, d);
}
