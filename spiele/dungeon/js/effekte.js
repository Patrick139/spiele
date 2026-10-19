// effekte.js — Sichtbare Wirkung der Klassenfaehigkeiten (klassen.js). Jede Faehigkeit hat ihre eigene Form:
// strahl (Blitz entlang der Linie), kegel (Druckwelle), bogen (Schwerthieb), ring (Welle, Wirbel, Bruell),
// himmel (Blitz von oben), kranz (Licht), funken (Heilung), wurzeln, spur (Sprung), zone (stehender Runenkreis
// mit Schaden und Rueckstoss). z.fx = Liste der laufenden Effekte; fxSchritt zaehlt sie ab, fxZeichnen malt sie
// (kampf.js zeichneKampf). Kein Modul; globale Funktionen. Nutzt sprites.js (glut, lin, TAU, ANIM).

var ZONE_TICK = 0.5;          // s zwischen zwei Schadenstakten im Runenkreis

function fxNeu(z, o) { o.t = 0; if (!z.fx) z.fx = []; z.fx.push(o); return o; }

// Strahl-Schuss (Hitscan): von (x,y) in Richtung w bis zur Wand oder len; trifft alle Gegner auf der Linie.
// Rueckgabe { ex, ey, getroffen:[g...] }. Die Treffer richtet der Aufrufer an.
function strahlLinie(z, x, y, w, len, breite) {
  var c = Math.cos(w), s = Math.sin(w), l = 0, ebene = z.ebene;
  while (l < len && begehbar(ebene, Math.floor((x + c * (l + 6)) / KACHEL), Math.floor((y + s * (l + 6)) / KACHEL))) l += 6;
  var ex = x + c * l, ey = y + s * l, treffer = [];
  for (var i = 0; i < z.gegner.length; i++) {
    var g = z.gegner[i];
    if (g.tot) continue;
    var dx = g.x - x, dy = g.y - y, t = dx * c + dy * s;                 // Abstand entlang der Linie
    if (t < 0 || t > l + g.radius) continue;
    var q = Math.abs(-dx * s + dy * c);                                  // Abstand quer zur Linie
    if (q <= g.radius + breite) treffer.push(g);
  }
  return { ex: ex, ey: ey, laenge: l, getroffen: treffer };
}

function fxSchritt(z, dt) {
  if (!z.fx) return;
  for (var i = z.fx.length - 1; i >= 0; i--) {
    var f = z.fx[i];
    f.t += dt;
    if (f.art === "zone") {                                              // Runenkreis: Schaden und Rueckstoss im Takt
      f.tick -= dt;
      if (f.tick <= 0) {
        f.tick += ZONE_TICK;
        var traf = false;
        for (var k = 0; k < z.gegner.length; k++) {
          var g = z.gegner[k];
          if (g.tot) continue;
          var dx = g.x - f.x, dy = g.y - f.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d > f.r + g.radius) continue;
          schadenGegner(g, f.schaden, z, { durch: true }); traf = true;
          if (g.art !== "ambros" && d > 1) { g.kvx += dx / d * f.rueck; g.kvy += dy / d * f.rueck; }
        }
        if (traf) trefferFeedback(z);
      }
    }
    if (f.t >= f.dauer) z.fx.splice(i, 1);
  }
}

// ---- Zeichnen --------------------------------------------------------------------
function fxZickzack(ctx, pts, versatz, seed) {                            // gezackte Linie zwischen erstem und letztem Punkt
  var a = pts[0], b = pts[pts.length - 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
  var n = Math.max(3, Math.floor(l / 16)), nx = -dy / l, ny = dx / l;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]);
  for (var i = 1; i < n; i++) {
    var p = i / n, r = (rausch(i, seed, 61) - 0.5) * 2 * versatz * Math.sin(p * Math.PI);
    ctx.lineTo(a[0] + dx * p + nx * r, a[1] + dy * p + ny * r);
  }
  ctx.lineTo(b[0], b[1]);
}

function fxZeichnen(ctx, camX, camY, z) {
  if (!z.fx || !z.fx.length) return;
  var flackern = Math.floor(ANIM * 28);
  for (var i = 0; i < z.fx.length; i++) {
    var f = z.fx[i], p = Math.min(1, f.t / f.dauer), a = 1 - p, x = f.x - camX, y = f.y - camY, k;
    ctx.save(); ctx.lineCap = "round";
    if (f.art === "strahl") {                                             // Blitzstrahl: weisser Kern, blauer Schein, Zickzack flackert
      var pts = [[f.x - camX, f.y - camY], [f.ex - camX, f.ey - camY]];
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.35 * a) + ")"; ctx.lineWidth = f.breite * 4; fxZickzack(ctx, pts, 7, flackern); ctx.stroke();
      ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.8 * a) + ")"; ctx.lineWidth = f.breite * 1.6; fxZickzack(ctx, pts, 6, flackern + 3); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255," + a + ")"; ctx.lineWidth = f.breite * 0.7; fxZickzack(ctx, pts, 4, flackern + 7); ctx.stroke();
      glut(ctx, pts[0][0], pts[0][1], 34, f.farbe, 0.6 * a); glut(ctx, pts[1][0], pts[1][1], 46, f.farbe, 0.7 * a);
    } else if (f.art === "spur") {                                        // Sprung: verblassende Spur
      ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.5 * a) + ")"; ctx.lineWidth = f.breite * a + 1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(f.ex - camX, f.ey - camY); ctx.stroke();
    } else if (f.art === "ring") {                                        // Welle um einen Punkt (Bruell, Wirbel)
      var r = f.r0 + (f.r1 - f.r0) * (1 - a * a);
      ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.85 * a) + ")"; ctx.lineWidth = f.breite * (0.4 + a);
      if (f.wirbel) {                                                     // drei kurze Klingenboegen kreisen
        for (k = 0; k < 3; k++) { var w0 = f.t * 14 + k * TAU / 3; ctx.beginPath(); ctx.arc(x, y, r, w0, w0 + 1.3); ctx.stroke(); }
        ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.25 * a) + ")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
      } else { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); }
    } else if (f.art === "bogen") {                                       // Hieb: Mondsichel, die ueber den Bogen laeuft
      var w1 = f.w - f.halb, w2 = f.w + f.halb, kopf = w1 + (w2 - w1) * Math.min(1, p * 2.4);
      var gr = ctx.createRadialGradient(x, y, f.r * 0.3, x, y, f.r);
      gr.addColorStop(0, "rgba(" + f.farbe + ",0)"); gr.addColorStop(1, "rgba(" + f.farbe + "," + (0.55 * a) + ")");
      ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, f.r, w1, kopf); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255," + (0.9 * a) + ")"; ctx.lineWidth = f.breite || 3; ctx.beginPath(); ctx.arc(x, y, f.r, Math.max(w1, kopf - 0.5), kopf); ctx.stroke();
    } else if (f.art === "kegel") {                                       // Druckwelle: drei Boegen laufen nach vorn
      ctx.globalCompositeOperation = "lighter";
      var gk = ctx.createRadialGradient(x, y, 0, x, y, f.r); gk.addColorStop(0, "rgba(" + f.farbe + "," + (0.4 * a) + ")"); gk.addColorStop(1, "rgba(" + f.farbe + ",0)");
      ctx.fillStyle = gk; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, f.r, f.w - f.halb, f.w + f.halb); ctx.closePath(); ctx.fill();
      for (k = 0; k < 3; k++) {
        var pk = Math.max(0, Math.min(1, p * 1.5 - k * 0.18)); if (pk <= 0 || pk >= 1) continue;
        ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.9 * (1 - pk)) + ")"; ctx.lineWidth = 4 * (1 - pk) + 1;
        ctx.beginPath(); ctx.arc(x, y, f.r * (0.25 + 0.75 * pk), f.w - f.halb * (0.6 + 0.4 * pk), f.w + f.halb * (0.6 + 0.4 * pk)); ctx.stroke();
      }
    } else if (f.art === "himmel") {                                      // Blitz von oben auf einen Punkt
      var hy = y - 360, top = [[x + (rausch(flackern, 1, 62) - 0.5) * 30, hy], [x, y]];
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.4 * a) + ")"; ctx.lineWidth = 10; fxZickzack(ctx, top, 14, flackern); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255," + a + ")"; ctx.lineWidth = 2.6; fxZickzack(ctx, top, 10, flackern + 2); ctx.stroke();
      glut(ctx, x, y, 60, f.farbe, 0.8 * a);
    } else if (f.art === "kranz") {                                       // Licht: Strahlen und goldener Schein
      glut(ctx, x, y - 10, f.r * (0.6 + 0.6 * p), f.farbe, 0.7 * a);
      ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.7 * a) + ")"; ctx.lineWidth = 2;
      for (k = 0; k < 16; k++) { var wk = k / 16 * TAU + f.t * 1.5, r0 = f.r * 0.2 * (0.5 + p), r1 = f.r * (0.5 + 0.5 * p) * (k % 2 ? 0.8 : 1);
        ctx.beginPath(); ctx.moveTo(x + Math.cos(wk) * r0, y - 10 + Math.sin(wk) * r0); ctx.lineTo(x + Math.cos(wk) * r1, y - 10 + Math.sin(wk) * r1); ctx.stroke(); }
    } else if (f.art === "funken") {                                      // Heilung: Funken steigen auf
      ctx.globalCompositeOperation = "lighter";
      for (k = 0; k < 16; k++) {
        var wk2 = k * 2.4, ra = 8 + (k % 4) * 3, py = y - 4 - p * (26 + (k % 5) * 6), px = x + Math.cos(wk2 + p * 3) * ra;
        ctx.fillStyle = "rgba(" + f.farbe + "," + (0.9 * a) + ")"; ctx.beginPath(); ctx.arc(px, py, 1.6 + (k % 3) * 0.5, 0, TAU); ctx.fill();
      }
      glut(ctx, x, y - 14, 36, f.farbe, 0.35 * a);
    } else if (f.art === "wurzeln") {                                     // Wurzeln brechen aus dem Boden
      var hoch = Math.sin(Math.min(1, p * 1.6) * Math.PI);
      for (k = 0; k < 6; k++) {
        var wk3 = k / 6 * TAU, bx = x + Math.cos(wk3) * 9, by = y + Math.sin(wk3) * 5, h = (10 + (k % 3) * 5) * hoch;
        ctx.strokeStyle = "#3a2a16"; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(wk3) * 3, by - h); ctx.stroke();
        ctx.strokeStyle = "#6a8a3a"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(wk3) * 3, by - h); ctx.stroke();
      }
    } else if (f.art === "zone") {                                        // stehender Runenkreis
      var ein = Math.min(1, f.t / 0.25), aus = Math.min(1, (f.dauer - f.t) / 0.5), al = Math.min(ein, aus), r2 = f.r * (0.7 + 0.3 * ein);
      ctx.globalCompositeOperation = "lighter";
      var gz = ctx.createRadialGradient(x, y, 0, x, y, r2); gz.addColorStop(0, "rgba(" + f.farbe + "," + (0.10 * al) + ")"); gz.addColorStop(1, "rgba(" + f.farbe + "," + (0.28 * al) + ")");
      ctx.fillStyle = gz; ctx.beginPath(); ctx.arc(x, y, r2, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(" + f.farbe + "," + (0.9 * al) + ")"; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, r2, 0, TAU); ctx.stroke();
      ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(x, y, r2 * 0.82, 0, TAU); ctx.stroke();
      for (k = 0; k < 12; k++) {                                          // Runenstriche zwischen den Ringen, drehen langsam
        var wr = k / 12 * TAU + f.t * 0.6, c1 = Math.cos(wr), s1 = Math.sin(wr);
        ctx.beginPath(); ctx.moveTo(x + c1 * r2 * 0.86, y + s1 * r2 * 0.86); ctx.lineTo(x + c1 * r2 * 0.96, y + s1 * r2 * 0.96); if (k % 2) ctx.lineTo(x + Math.cos(wr + 0.08) * r2 * 0.91, y + Math.sin(wr + 0.08) * r2 * 0.91); ctx.stroke();
      }
      ctx.beginPath(); for (k = 0; k <= 5; k++) { var ws = f.t * -0.8 + k * 2 * TAU / 5; ctx.lineTo(x + Math.cos(ws) * r2 * 0.7, y + Math.sin(ws) * r2 * 0.7); } ctx.stroke();   // Pentagramm
      var puls = Math.max(0, 1 - (f.tick / ZONE_TICK)); if (puls > 0.7) { ctx.strokeStyle = "rgba(255,255,255," + (al * (puls - 0.7) * 2) + ")"; ctx.beginPath(); ctx.arc(x, y, r2, 0, TAU); ctx.stroke(); }   // Takt aufleuchtet
    }
    ctx.restore();
  }
}
