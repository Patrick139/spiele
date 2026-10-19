// bossgrafik.js — Ambros in drei Stufen, Kerzen der Kammer, Gefahren, Lichtkugeln, Lebensbalken.
// Nur Canvas-Formen. Setzt sprites.js (rc, kr, ell, lin, poly, glut) und szenen.js (priesterZeichnen) voraus.

// Stufe 1: der Pfarrer (mit Hirtenstab). Stufe 2: aufgerissen, schwarz darunter.
// Stufe 3: der Pfandherr, gross, Geweih, geoeffnetes Gesicht, Schatten als Tentakel.
function bossZeichnen(ctx, g, camX, camY) {
  var x = g.x - camX, y = g.y - camY + 10, t = ANIM, st = g.stufe, blink = g.trefferBlink > 0;
  var heb = g.pause > 0 ? 6 : 0;                                  // Zauber: Arme heben sich
  ctx.save();
  if (blink) ctx.filter = "brightness(2.4)";
  schatten(ctx, x, y, st === 3 ? 30 : 17);
  if (g.verwandelT > 0) glut(ctx, x, y - 24, 90, "255,60,40", 0.5 * g.verwandelT);
  if (g.flucht && st === 3) { ctx.translate(x, y); ctx.scale(0.8, 0.8); ctx.translate(-x, -y); }     // Verfolger Ebene 3: kleiner als die Endgestalt
  if (st === 1) {
    glut(ctx, x, y - 22, 52, "255,225,160", 0.2);
    priesterZeichnen(ctx, x, y, 1.2, g.flucht ? 1 : 0);
    lin(ctx, x + 16, y - 2, x + 16, y - 46 - heb, "#8a6b3a", 2.6); kr(ctx, x + 16, y - 48 - heb, 3.8, "#e8c860");
    if (g.flucht) {                                              // Ebene 1 der Verfolgung: zerrissen, Haende rot, Adern, ein Auge leuchtet
      kr(ctx, x - 2.6, y - 15.6, 2.8, "#8a1c1c"); kr(ctx, x + 2.6, y - 15.6, 2.8, "#8a1c1c");
      ell(ctx, x - 4, y - 10, 4.4, 7, "rgba(120,16,20,0.75)");
      for (var tz = 0; tz < 4; tz++) poly(ctx, [x - 14 + tz * 7, y - 1, x - 10 + tz * 7, y - 1, x - 12 + tz * 7, y - 8 - (tz % 2) * 3], "#16131a");
      lin(ctx, x + 3.6, y - 42, x + 2, y - 36, "#3a2a4a", 1.1); lin(ctx, x - 3, y - 41, x - 4, y - 37, "#3a2a4a", 1);
      glut(ctx, x + 1.9, y - 41, 14, "190,100,255", 0.4);
    }
  } else if (st === 2) {
    var s = 1.25, bob = Math.sin(t * 2.4) * 1.2;
    poly(ctx, [x - 11 * s, y - 2, x + 11 * s, y - 2, x + 8 * s, y - 28 * s + bob, x - 8 * s, y - 28 * s + bob], "#0a0710");  // schwarzer Leib
    poly(ctx, [x - 10 * s, y - 2, x - 3 * s, y - 2, x - 5 * s, y - 15 * s, x - 9 * s, y - 12 * s], "rgba(230,224,208,0.85)");  // Chorrock-Fetzen
    poly(ctx, [x + 5 * s, y - 2, x + 11 * s, y - 2, x + 9 * s, y - 10 * s], "rgba(230,224,208,0.7)");
    for (var c = 0; c < 4; c++) lin(ctx, x - 5 + c * 3, y - 24 + c * 4, x - 1 + c * 3, y - 17 + c * 4, "rgba(255,70,50," + (0.5 + 0.3 * Math.sin(t * 4 + c)) + ")", 1.4);   // Risse
    lin(ctx, x - 9 * s, y - 24 * s, x - 18 - heb, y - 4 - heb, "#0a0710", 4);                   // lange Arme
    lin(ctx, x + 9 * s, y - 24 * s, x + 20 + heb, y - 6 - heb, "#0a0710", 4);
    kr(ctx, x - 18 - heb, y - 3 - heb, 2.6, "#d6b08c"); kr(ctx, x + 20 + heb, y - 5 - heb, 2.8, "#050308");
    kr(ctx, x, y - 33 * s + bob, 6.4, "#d6b08c");                                              // Kopf: links noch Mensch, rechts leer
    ctx.fillStyle = "#08050c"; ctx.beginPath(); ctx.arc(x, y - 33 * s + bob, 6.4, -Math.PI / 2, Math.PI / 2); ctx.fill();
    kr(ctx, x - 2.4, y - 34 * s + bob, 1.2, "#1d1814"); kr(ctx, x + 2.4, y - 34 * s + bob, 1.6, "#e0a8ff");
    glut(ctx, x + 2.4, y - 34 * s + bob, 22, "170,90,255", 0.35);
    for (var h = -1; h <= 1; h += 2) { ctx.strokeStyle = "#0a0710"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + h * 4, y - 38 * s + bob); ctx.quadraticCurveTo(x + h * 12, y - 48 * s, x + h * 9, y - 54 * s); ctx.stroke(); ctx.lineWidth = 1; }
  } else {
    var S3 = 1.9, b3 = Math.sin(t * 2) * 1.5;
    for (var k = 0; k < (g.flucht ? 0 : 6); k++) {                // Tentakel aus dem Boden (nicht beim Verfolger)
      var a = k / 6 * 6.28 + t * 0.5;
      ctx.strokeStyle = "rgba(10,6,16,0.9)"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(a) * 40, y - 20 + Math.sin(t * 3 + k) * 10, x + Math.cos(a) * 66, y + Math.sin(a) * 16 + Math.sin(t * 2 + k) * 8); ctx.stroke(); ctx.lineWidth = 1;
    }
    poly(ctx, [x - 12 * S3, y, x + 12 * S3, y, x + 8 * S3, y - 26 * S3 + b3, x - 8 * S3, y - 26 * S3 + b3], "#06040a");
    for (var r = 0; r < 5; r++) lin(ctx, x - 14 + r * 7, y - 12 * S3 + r * 3, x - 8 + r * 7, y - 6 * S3 + r * 3, "rgba(255,50,40," + (0.55 + 0.3 * Math.sin(t * 5 + r)) + ")", 1.8);
    lin(ctx, x - 9 * S3, y - 22 * S3, x - 38, y + 4, "#06040a", 6); lin(ctx, x + 9 * S3, y - 22 * S3, x + 38, y + 4, "#06040a", 6);
    for (var f = -1; f <= 1; f += 2) for (var kl = 0; kl < 3; kl++) lin(ctx, x + f * 38, y + 4, x + f * (44 + kl * 3), y + 12 + kl * 3, "#d8d2bc", 1.8);   // Krallen
    var hy = y - 30 * S3 + b3;                                    // Kopf, Mund senkrecht geoeffnet
    ell(ctx, x, hy, 13, 15, "#0a0710");
    poly(ctx, [x - 3, hy - 14, x + 3, hy - 14, x + 7, hy + 6, x, hy + 14, x - 7, hy + 6], "#600a10");
    glut(ctx, x, hy, 34, "255,40,30", 0.4 + 0.1 * Math.sin(t * 6));
    for (var ee = -1; ee <= 1; ee += 2) { kr(ctx, x + ee * 8, hy - 6, 2.4, "#f0b8ff"); glut(ctx, x + ee * 8, hy - 6, 20, "190,100,255", 0.45); }
    for (var h3 = -1; h3 <= 1; h3 += 2) for (var zz = 0; zz < 3; zz++) {   // Geweih
      ctx.strokeStyle = "#16101a"; ctx.lineWidth = 4 - zz; ctx.beginPath(); ctx.moveTo(x + h3 * 9, hy - 10);
      ctx.quadraticCurveTo(x + h3 * (24 + zz * 12), hy - 28 - zz * 10, x + h3 * (30 + zz * 14), hy - 50 - zz * 12); ctx.stroke(); ctx.lineWidth = 1;
    }
  }
  ctx.restore();
}

// Besiegt: ein alter Mann im zerrissenen Chorrock liegt am Boden.
function bossLeiche(ctx, x, y) {
  ell(ctx, x, y + 2, 20, 8, "rgba(60,8,12,0.6)");
  poly(ctx, [x - 18, y - 2, x + 16, y - 6, x + 14, y + 4, x - 16, y + 6], "#d6d0c0");
  kr(ctx, x - 22, y, 5.4, "#d6b08c"); ctx.fillStyle = "#e8e8e8"; ctx.beginPath(); ctx.arc(x - 23, y - 1, 5.8, Math.PI * 0.6, Math.PI * 1.7); ctx.fill();
}

// Geisterhafte Gestalt neben der Treppe (Begegnungen auf Ebene 1 und 2).
function begegnungZeichnen(ctx, f, camX, camY) {
  var x = f.x - camX, y = f.y - camY + 8;
  ctx.save(); ctx.globalAlpha = 0.6 + Math.sin(ANIM * 1.7) * 0.1;
  glut(ctx, x, y - 20, 50, f.stufe >= 2 ? "170,90,255" : "255,220,170", 0.22);
  priesterZeichnen(ctx, x, y, 1.15, f.stufe);
  ctx.restore();
}

// Kerze in einem Glas; "mein" = die des gesuchten Kindes, sie brennt heller.
function kerzeZeichnen(ctx, k, camX, camY) {
  var x = k.x - camX, y = k.y - camY, st = k.stufe || 1, ruh = st >= 3 ? 0.55 : 1;
  schatten(ctx, x, y, 8);
  rc(ctx, x - 5, y - 15, 10, 15, "rgba(205,225,240,0.28)"); rc(ctx, x - 2.6, y - 11, 5.2, 11, "#e8dcb8");
  flamme(ctx, x, y - 11, (k.mein ? 3.4 : 2.6) * ruh, k.nr * 3);
  glut(ctx, x, y - 14, (k.mein ? 110 : 62) * (st >= 3 ? 0.8 : 1) + Math.sin(ANIM * 9 + k.nr) * 4, "255,180,110", k.mein ? 0.5 : 0.26);
}

// Ankuendigungen: Kreise (rot = Schaden, violett = Beschwoerung/Ring) und Linien.
function zeichneGefahren(ctx, camX, camY, z) {
  for (var i = 0; i < z.gefahren.length; i++) {
    var f = z.gefahren[i], x = f.x - camX, y = f.y - camY, p = f.dauer ? 1 - Math.max(0, f.t) / f.dauer : 1;
    ctx.save();
    if (f.typ === "kreis") {
      var rot = !f.warn;
      ctx.globalAlpha = f.flash > 0 ? 0.8 : 0.16 + 0.3 * p;
      ctx.fillStyle = f.flash > 0 ? "#fff0d8" : (rot ? "#d94438" : "#8a4ad0");
      ctx.beginPath(); ctx.arc(x, y, f.r, 0, TAU); ctx.fill();
      ctx.globalAlpha = 0.9; ctx.strokeStyle = rot ? "#ff7a60" : "#c090ff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, f.r, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, f.r * p, 0, TAU); ctx.stroke();            // zieht sich zum Rand zusammen
    } else {
      ctx.globalAlpha = f.flash > 0 ? 0.2 : 0.35 + 0.4 * p;
      ctx.strokeStyle = "#d94438"; ctx.lineWidth = f.breit ? 8 : 2; ctx.setLineDash(f.breit ? [] : [6, 5]);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(f.w) * f.len, y + Math.sin(f.w) * f.len); ctx.stroke();
    }
    ctx.restore();
  }
}

function orbZeichnen(ctx, sx, sy) {
  glut(ctx, sx, sy, 20, "255,220,150", 0.5);
  kr(ctx, sx, sy, 4.4, "#fff2c0"); kr(ctx, sx, sy, 2.4, "#ffffff");
}

// Lebensbalken oben in der Mitte (nur waehrend des Kampfes).
function zeichneBossBalken(ctx, breite, z) {
  var g = bossVon(z), zb = false;
  if (!g) { g = waechterVon(z); zb = true; }
  if (!g || g.tot || (zb ? g.zustand === "idle" : !g.aktiv)) return;
  var w = 460, x = (breite - w) / 2, y = 22;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(x - 3, y - 3, w + 6, 18);
  ctx.fillStyle = "#3a0a0e"; ctx.fillRect(x, y, w, 12);
  ctx.fillStyle = zb ? "#7a5aa8" : g.stufe === 3 ? "#c0392b" : (g.stufe === 2 ? "#a5573a" : "#c9b27a");
  ctx.fillRect(x, y, w * Math.max(0, g.leben / g.lebenMax), 12);
  ctx.fillStyle = "rgba(0,0,0,0.55)";                                           // Stufenmarken bei 2/3 und 1/3
  if (!zb && !g.flucht) { ctx.fillRect(x + w * 2 / 3 - 1, y, 2, 12); ctx.fillRect(x + w / 3 - 1, y, 2, 12); }
  ctx.strokeStyle = "#7a6a44"; ctx.strokeRect(x - 2.5, y - 2.5, w + 5, 17);
  ctx.textAlign = "center"; ctx.fillStyle = "#e8e0c0"; ctx.font = "15px Georgia, serif";
  ctx.fillText(zb ? WAECHTER_NAME : bossName(g), breite / 2, y + 32);
  ctx.restore();
}
