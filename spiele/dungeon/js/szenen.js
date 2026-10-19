// szenen.js — Bilder fuer Titel, Prolog und das Ende (Canvas-Formen).

// Nachtbild: Mond, Abtei auf dem Huegel, Dorf darunter, Aschefall.
function zeichneNachtbild(ctx, b, h, dim) {
  var g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#080b18"); g.addColorStop(0.6, "#1b1730"); g.addColorStop(1, "#2a1a22");
  ctx.fillStyle = g; ctx.fillRect(0, 0, b, h);
  var i;
  for (i = 0; i < 70; i++)
    kr(ctx, rausch(i, 1, 12) * b, rausch(i, 2, 12) * h * 0.55, 0.6 + rausch(i, 3, 12) * 0.9,
       "rgba(255,255,240," + (0.3 + 0.4 * Math.abs(Math.sin(ANIM * 0.8 + i))) + ")");
  glut(ctx, 110, 130, 150, "150,170,255", 0.22);
  kr(ctx, 110, 130, 36, "#e8e4d0"); kr(ctx, 98, 122, 33, "#14172b");                     // Sichelmond
  poly(ctx, [0, h * 0.7, 160, h * 0.6, 330, h * 0.5, 480, h * 0.46, 630, h * 0.5, 800, h * 0.6, b, h * 0.68, b, h, 0, h], "#0a0c12");
  var ax = 480, ay = h * 0.46;                                                            // Abtei auf der Kuppe
  rc(ctx, ax - 90, ay - 70, 180, 70, "#07080e"); rc(ctx, ax - 110, ay - 120, 36, 120, "#07080e"); rc(ctx, ax + 74, ay - 100, 36, 100, "#07080e");
  poly(ctx, [ax - 114, ay - 120, ax - 92, ay - 160, ax - 70, ay - 120], "#07080e"); poly(ctx, [ax + 70, ay - 100, ax + 92, ay - 136, ax + 114, ay - 100], "#07080e");
  rc(ctx, ax - 20, ay - 46, 40, 46, "#1a0608");
  glut(ctx, ax, ay - 20, 70 + Math.sin(ANIM * 2) * 6, "255,60,40", 0.4);
  for (i = 0; i < 3; i++) rc(ctx, ax - 96 + i * 76, ay - 100, 6, 14, "rgba(255,110,60," + (0.5 + 0.2 * Math.sin(ANIM * 3 + i)) + ")");
  for (i = 0; i < 9; i++) {                                                               // Dorfdaecher mit Licht
    var hx = 90 + i * 92 + rausch(i, 4, 12) * 20, hy = h * 0.74 + rausch(i, 5, 12) * 60 + (i % 2) * 20;
    poly(ctx, [hx - 28, hy, hx + 28, hy, hx, hy - 26], "#05060a"); rc(ctx, hx - 22, hy, 44, 26, "#05060a");
    rc(ctx, hx - 5, hy + 7, 8, 8, "rgba(255,190,100," + (0.7 + 0.2 * Math.sin(ANIM * 5 + i)) + ")");
    glut(ctx, hx, hy + 11, 34, "255,170,80", 0.25);
  }
  for (i = -1; i <= 1; i += 2) for (var t = 0; t < 4; t++) {                              // Tannen im Vordergrund
    var tx = b / 2 + i * (b * 0.5 - 30 - t * 60), ty = h + 10 - t * 12, ts = 1.4 - t * 0.15;
    for (var k = 0; k < 4; k++) poly(ctx, [tx - (50 - k * 9) * ts, ty - 30 * k * ts, tx + (50 - k * 9) * ts, ty - 30 * k * ts, tx, ty - (30 * k + 70) * ts], "#04050a");
  }
  for (i = 0; i < 90; i++) {
    var fx = (rausch(i, 6, 12) * b * 1.2 + ANIM * (10 + i % 5 * 4) + Math.sin(ANIM + i) * 12) % (b * 1.2) - b * 0.1;
    var fy = (rausch(i, 7, 12) * h + ANIM * (18 + i % 4 * 6)) % h;
    ctx.fillStyle = i % 4 ? "rgba(220,220,230,0.5)" : "rgba(255,140,60,0.6)"; ctx.fillRect(fx, fy, 1.6, 1.6);
  }
  if (dim) { ctx.fillStyle = "rgba(0,0,0," + dim + ")"; ctx.fillRect(0, 0, b, h); }
}

// Die Kammer der Kerzen. fig = 0..1: wie sichtbar der Pfandherr schon ist.
function zeichneKammer(ctx, b, h, fig) {
  var g = ctx.createRadialGradient(b / 2, h * 0.5, 20, b / 2, h * 0.5, 560);
  g.addColorStop(0, "#2a1219"); g.addColorStop(1, "#040206");
  ctx.fillStyle = g; ctx.fillRect(0, 0, b, h);
  ell(ctx, b / 2, h * 0.8, 380, 84, "#120a10");
  ctx.strokeStyle = "rgba(190,40,40,0.35)"; ctx.beginPath(); ctx.ellipse(b / 2, h * 0.8, 300, 62, 0, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(b / 2, h * 0.8, 230, 46, 0, 0, TAU); ctx.stroke();
  var cx = b / 2, i;
  if (fig > 0) {                                                                          // hinter ihm: etwas viel Groesseres
    ctx.save(); ctx.globalAlpha = fig * 0.9;
    var rg = ctx.createLinearGradient(0, -40, 0, h * 0.8);
    rg.addColorStop(0, "#030204"); rg.addColorStop(1, "#190c14");
    poly(ctx, [cx - 70, 0, cx + 70, 0, cx + 120, 190, cx + 320, h * 0.8, cx - 320, h * 0.8, cx - 120, 190], rg);
    for (var s = -1; s <= 1; s += 2) {
      ctx.strokeStyle = "#030204"; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx + s * 40, 30);
      ctx.quadraticCurveTo(cx + s * 120, -10, cx + s * 96, -70); ctx.stroke(); ctx.lineWidth = 1;
      var pe = 0.55 + Math.sin(ANIM * 1.1) * 0.15;
      kr(ctx, cx + s * 22, 66, 3.4, "rgba(230,170,255," + pe + ")"); glut(ctx, cx + s * 22, 66, 34, "170,90,255", 0.28);
    }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = fig;                                                    // der Pfarrer: klein, ruhig, freundlich
    priesterZeichnen(ctx, cx, h * 0.76, 3.2);
    ctx.restore();
  }
  for (i = 0; i < 9; i++) {                                                               // neun Kerzen im Halbkreis
    var a = Math.PI * (0.1 + 0.8 * i / 8), x = cx - Math.cos(a) * 400, y = h * 0.78 - Math.sin(a) * 250;
    var meine = i === 2, f = 1 + (meine ? 0.5 : 0);
    rc(ctx, x - 8, y - 4, 16, 30, "rgba(210,225,240,0.18)"); rc(ctx, x - 4, y + 4, 8, 20, "#e8dcb8");
    flamme(ctx, x, y + 4, 4.2 * f, i * 3);
    glut(ctx, x, y, (meine ? 120 : 70) + Math.sin(ANIM * 9 + i) * 4, "255,170,90", meine ? 0.55 : 0.28);
  }
  var sp = { blick: -Math.PI / 2, geht: false, gehT: 0, schlagAktiv: 0, kombo: 0, dodgeT: 0 };
  ctx.save(); ctx.translate(cx, h * 0.9); ctx.scale(2.6, 2.6);                            // der Held, winzig davor
  heldZeichnen(ctx, 0, 0, sp, HELDEN[HELD]); ctx.restore();
}

// Pfarrer Ambros Wendel: alter Mann, weisser Chorrock ueber schwarzer Soutane, Stola.
// stufe 0 = freundlich; 1 = sein Schatten passt nicht zu ihm; 2 = linke Hand schwarz, Schatten mit Geweih.
function priesterZeichnen(ctx, x, y, k, stufe) {
  stufe = stufe || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ell(ctx, 0, -1, 15, 6, "rgba(0,0,0,0.55)");
  if (stufe >= 1) {                                                                       // der Schatten ist groesser, als er sein duerfte
    ctx.globalAlpha = 0.55;
    poly(ctx, [-14, -2, 14, -2, 9, -34, -9, -34], "#030204"); kr(ctx, 0, -40, 8, "#030204");
    if (stufe >= 2) for (var h = -1; h <= 1; h += 2) { ctx.strokeStyle = "#030204"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(h * 4, -45); ctx.quadraticCurveTo(h * 12, -54, h * 9, -62); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  poly(ctx, [-7, -26, 7, -26, 12, -1, -12, -1], "#16131a");                               // Soutane
  poly(ctx, [-8, -28, 8, -28, 10, -12, -10, -12], "#e6e0d0"); poly(ctx, [-10, -14, 10, -14, 11, -7, -11, -7], "#d6d0c0");   // Chorrock
  poly(ctx, [-2.5, -28, 2.5, -28, 4, -10, -4, -10], "#6a3a8a");                           // Stola
  rc(ctx, -3, -17, 6, 5, "#3a2c1c"); rc(ctx, -2.4, -16.4, 4.8, 1, "#c8a860");             // Buch in den gefalteten Haenden
  kr(ctx, -2, -13, 2, "#d6b08c"); kr(ctx, 2, -13, 2, stufe >= 2 ? "#0a0810" : "#d6b08c");
  kr(ctx, 0, -33, 6, "#d6b08c");                                                          // Kopf
  ctx.fillStyle = "#e8e8e8"; ctx.beginPath(); ctx.arc(0, -34.5, 6.4, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();   // weisses Haar
  rc(ctx, -3.4, -34, 1.8, 1.2, "#1d1814"); rc(ctx, 1.6, -34, 1.8, 1.2, stufe >= 1 ? "#a85ae0" : "#1d1814");        // Augen
  ctx.strokeStyle = "#8a5a4a"; ctx.beginPath(); ctx.arc(0, -31, 2.2, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();   // mildes Laecheln
  ctx.restore();
}
