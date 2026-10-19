// sprites.js — Kacheln, Gegner und Gegenstaende. Nur Canvas-Formen, keine Bilder.
//
// >>>>>> SPRITES-TABELLE: hier spaeter Figuren/Kacheln gegen Bilder tauschen.
// Alle Zeichenfunktionen bekommen Weltkoordinaten (sx, sy = Ankerpunkt: bei
// Figuren die Fuesse, bei Kacheln die obere linke Ecke); die Skalierung
// (ZOOM) setzt grafik.js. ANIM = Sekunden, fuer Flackern und Laufanimation.

var ANIM = 0;
var TAU = Math.PI * 2;

// Stabiles Pseudo-Zufallsrauschen 0..1 je Kachel (s = Variante).
function rausch(x, y, s) {
  var h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul((s | 0) + 1, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function rgb(c, v) {
  function k(n) { return Math.max(0, Math.min(255, Math.round(n + v))); }
  return "rgb(" + k(c[0]) + "," + k(c[1]) + "," + k(c[2]) + ")";
}
function ell(ctx, x, y, rx, ry, f) { ctx.fillStyle = f; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill(); }
function kr(ctx, x, y, r, f) { ctx.fillStyle = f; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
function rc(ctx, x, y, w, h, f) { ctx.fillStyle = f; ctx.fillRect(x, y, w, h); }
function lin(ctx, x1, y1, x2, y2, f, b) {
  ctx.strokeStyle = f; ctx.lineWidth = b; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.lineWidth = 1; ctx.lineCap = "butt";
}
function poly(ctx, pts, f) {
  ctx.fillStyle = f; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath(); ctx.fill();
}
function schatten(ctx, sx, sy, rx) { ell(ctx, sx, sy - 1, rx, rx * 0.4, "rgba(0,0,0,0.5)"); }
// Weicher Lichtfleck (additiv) — Fackeln, Fenster, Kerzen.
function glut(ctx, x, y, r, rgbText, a) {
  var g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, "rgba(" + rgbText + "," + a + ")"); g.addColorStop(1, "rgba(" + rgbText + ",0)");
  ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
function flamme(ctx, x, y, gr, seed) {
  var fl = Math.sin(ANIM * 11 + seed) * 0.15 + Math.sin(ANIM * 23 + seed * 2) * 0.1;
  poly(ctx, [x - gr * 0.5, y, x, y - gr * (2.1 + fl), x + gr * 0.5, y], "#e8761e");
  poly(ctx, [x - gr * 0.3, y, x, y - gr * (1.5 + fl), x + gr * 0.3, y], "#ffd36a");
}

// Farbwelten je Ebene: Boden, Mauer, Mauerdeckel, Glut (RGB-Text).
var PALETTEN = {
  1: { boden: [40, 36, 40], wand: [96, 86, 74], oben: "#121016", glut: "255,170,90" },
  2: { boden: [36, 41, 52], wand: [80, 86, 98], oben: "#0e1118", glut: "150,190,255" },
  3: { boden: [48, 30, 34], wand: [92, 64, 62], oben: "#160d0f", glut: "255,90,70" }
};
function palette(n) { return PALETTEN[n] || PALETTEN[1]; }

var SPRITES = {
  // info = { gx, gy, ebene, flaeche (Fussboden unterhalb der Mauerkachel) }
  wand: {
    groesse: { b: KACHEL, h: KACHEL }, anker: { ax: 0, ay: 0 },
    zeichnen: function (ctx, sx, sy, info) {
      var p = palette(info.ebene);
      if (!info.flaeche) {                              // Mauerdeckel: dunkel, kaum Zeichnung
        rc(ctx, sx, sy, KACHEL, KACHEL, p.oben);
        if (rausch(info.gx, info.gy, 6) > 0.6) rc(ctx, sx + 4, sy + 6, 14, 8, "rgba(255,255,255,0.03)");
        return;
      }
      rc(ctx, sx, sy, KACHEL, KACHEL, "#1a1716");       // Fugenfarbe als Grund
      for (var row = 0; row < 2; row++) {               // Quader in zwei Reihen, versetzt
        var off = row ? 8 : 0;
        for (var i = -1; i < 3; i++) {
          var x0 = Math.max(0, i * 16 + off), x1 = Math.min(KACHEL, i * 16 + off + 16);
          if (x1 <= x0) continue;
          var v = (rausch(info.gx * 4 + i, info.gy * 2 + row, 4) - 0.5) * 24;
          rc(ctx, sx + x0 + 0.5, sy + row * 16 + 0.5, x1 - x0 - 1, 15, rgb(p.wand, v));
          rc(ctx, sx + x0 + 0.5, sy + row * 16 + 0.5, x1 - x0 - 1, 1.5, "rgba(255,255,255,0.12)");
        }
      }
      var g = ctx.createLinearGradient(0, sy, 0, sy + KACHEL);
      g.addColorStop(0, "rgba(0,0,0,0.15)"); g.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = g; ctx.fillRect(sx, sy, KACHEL, KACHEL);
      raumWandDeko(ctx, sx, sy, info.ebene, info.gx, info.gy);         // Regale / Schaedelnischen / Teppiche je Ebene (raeume.js)
    }
  },
  boden: {
    groesse: { b: KACHEL, h: KACHEL }, anker: { ax: 0, ay: 0 },
    zeichnen: function (ctx, sx, sy, info) {
      var p = palette(info.ebene), gx = info.gx, gy = info.gy;
      var r = rausch(gx, gy, 1), d = rausch(gx, gy, 3);
      rc(ctx, sx, sy, KACHEL, KACHEL, rgb(p.boden, (r - 0.5) * 14));
      if (info.typ) raumBoden(ctx, sx, sy, info.typ, gx, gy);          // Teppich, Kapellenfliesen, Lager (raeume.js)
      var j = r > 0.5 ? 10 + Math.floor(r * 12) : 0;                 // innere Plattenfuge
      if (j) rc(ctx, sx + j, sy, 1, KACHEL, "rgba(0,0,0,0.28)");
      else rc(ctx, sx, sy + 12 + Math.floor(r * 14), KACHEL, 1, "rgba(0,0,0,0.28)");
      rc(ctx, sx, sy, KACHEL, 1, "rgba(255,255,255,0.06)"); rc(ctx, sx, sy, 1, KACHEL, "rgba(255,255,255,0.04)");
      rc(ctx, sx, sy + KACHEL - 1, KACHEL, 1, "rgba(0,0,0,0.4)"); rc(ctx, sx + KACHEL - 1, sy, 1, KACHEL, "rgba(0,0,0,0.4)");
      if (rausch(gx, gy, 2) > 0.82) {                                // Riss
        ctx.strokeStyle = "rgba(0,0,0,0.5)"; ctx.beginPath();
        ctx.moveTo(sx + 4 + r * 8, sy + 3); ctx.lineTo(sx + 12 + d * 6, sy + 14); ctx.lineTo(sx + 9 + r * 10, sy + 27); ctx.stroke();
      }
      if (d > 0.93) {                                                // Dekor je Ebene
        if (info.ebene === 1) ell(ctx, sx + 14, sy + 18, 9, 5, "rgba(70,95,55,0.45)");          // Moos
        else if (info.ebene === 2) {                                                             // Knochen
          lin(ctx, sx + 6, sy + 22, sx + 20, sy + 14, "#b8b29c", 2.4); kr(ctx, sx + 22, sy + 13, 2.2, "#b8b29c");
          kr(ctx, sx + 5, sy + 23, 2, "#b8b29c");
        } else {                                                                                 // Wachs
          ell(ctx, sx + 16, sy + 17, 6, 3.5, "rgba(214,196,160,0.55)"); ell(ctx, sx + 22, sy + 21, 3, 2, "rgba(214,196,160,0.45)");
        }
      } else if (d < 0.05) {                                         // Geroell
        poly(ctx, [sx + 8, sy + 24, sx + 13, sy + 17, sx + 20, sy + 22, sx + 17, sy + 27], "rgba(20,18,22,0.7)");
        poly(ctx, [sx + 19, sy + 12, sx + 23, sy + 9, sx + 26, sy + 14], "rgba(70,66,72,0.8)");
      }
    }
  },
  treppe: {
    groesse: { b: KACHEL, h: KACHEL }, anker: { ax: 0, ay: 0 },
    zeichnen: function (ctx, sx, sy, info) {
      var p = palette(info.ebene);
      rc(ctx, sx, sy, KACHEL, KACHEL, "#151317");
      for (var i = 0; i < 5; i++) {                     // Stufen fuehren in die Tiefe
        var b = KACHEL - 2 - i * 4, h = 5, y = sy + 2 + i * 6;
        rc(ctx, sx + (KACHEL - b) / 2, y, b, h, rgb([150 - i * 24, 130 - i * 22, 96 - i * 16], 0));
        rc(ctx, sx + (KACHEL - b) / 2, y, b, 1, "rgba(255,255,255,0.25)");
      }
      var pulse = 0.18 + Math.sin(ANIM * 2.5) * 0.06;
      glut(ctx, sx + KACHEL / 2, sy + KACHEL / 2 + 6, 34, p.glut, pulse);
      ctx.strokeStyle = "rgba(" + p.glut + ",0.7)"; ctx.strokeRect(sx + 1.5, sy + 1.5, KACHEL - 3, KACHEL - 3);
      if (info.gesperrt) raumTreppeGitter(ctx, sx, sy);              // verschlossen bis der Schluessel da ist (raeume.js)
    }
  },
  zombie: {
    groesse: { b: 28, h: 36 }, anker: { ax: 0.5, ay: 1 },
    zeichnen: function (ctx, sx, sy, g) {
      var t = ANIM + g.id * 1.3, a = g.blick || 0, cx = Math.cos(a), cy = Math.sin(a);
      var blink = g.trefferBlink > 0, lauf = g.zustand !== "idle" ? 1 : 0.25;
      var wank = Math.sin(t * 4) * 1.4 * lauf, l = Math.sin(t * 6) * 2.2 * lauf;
      var ox = cx * 3, hoch = (g.zustand === "ank" || g.zustand === "stampf") ? -9 : 0;
      schatten(ctx, sx, sy, 13);
      rc(ctx, sx - 6, sy - 11 + l * 0.4, 5, 11, "#2a3326"); rc(ctx, sx + 1, sy - 11 - l * 0.4, 5, 11, "#323d2c");
      poly(ctx, [sx - 9 + ox, sy - 12, sx + 9 + ox, sy - 12, sx + 7 + ox * 1.4, sy - 27 + wank, sx - 7 + ox * 1.4, sy - 27 + wank],
           blink ? "#f2f2e6" : "#58704a");
      if (!blink) {
        poly(ctx, [sx - 9 + ox, sy - 12, sx - 3 + ox, sy - 12, sx - 5 + ox, sy - 19, sx - 8 + ox, sy - 17], "#3a4a31");   // Fetzen
        ell(ctx, sx + 3 + ox, sy - 19, 3, 2, "rgba(120,20,20,0.7)");                                                      // Wunde
      }
      for (var s = -1; s <= 1; s += 2) {                // Arme nach vorn, im Hieb erhoben
        var hx = sx + s * 8 + ox + cx * 13, hy = sy - 24 + cy * 8 + hoch;
        lin(ctx, sx + s * 7 + ox, sy - 25 + wank, hx, hy, blink ? "#f2f2e6" : "#6a8656", 4);
        kr(ctx, hx, hy, 2.4, "#8aa874");
      }
      kr(ctx, sx + ox * 1.6, sy - 31 + wank, 6.5, blink ? "#ffffff" : "#8aa874");
      rc(ctx, sx - 3 + ox * 1.6, sy - 28 + wank, 6, 3, "#1a1a12");                                                   // offener Kiefer
      kr(ctx, sx - 2.6 + ox * 1.6, sy - 32.5 + wank, 1.5, "#e9ff7a"); kr(ctx, sx + 2.6 + ox * 1.6, sy - 32.5 + wank, 1.5, "#e9ff7a");
    }
  },
  skelett: {
    groesse: { b: 24, h: 36 }, anker: { ax: 0.5, ay: 1 },
    zeichnen: function (ctx, sx, sy, g) {
      var t = ANIM + g.id * 1.7, ank = g.zustand === "ank";
      var a = (ank ? g.zielW : g.blick) || 0, cx = Math.cos(a), cy = Math.sin(a);
      var kn = g.trefferBlink > 0 ? "#ffffff" : "#d8d2bc", sw = Math.sin(t * 7) * 2 * (g.zustand === "idle" ? 0.2 : 1);
      schatten(ctx, sx, sy, 10);
      lin(ctx, sx - 3, sy - 14, sx - 3 + sw, sy - 1, kn, 2.2); lin(ctx, sx + 3, sy - 14, sx + 3 - sw, sy - 1, kn, 2.2);
      rc(ctx, sx - 5, sy - 17, 10, 3, kn); lin(ctx, sx, sy - 17, sx, sy - 28, kn, 2);
      ctx.strokeStyle = kn; ctx.lineWidth = 1.6;
      for (var i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(sx, sy - 26 + i * 3, 6.5 - i * 0.6, 2, 0, 0, Math.PI); ctx.stroke(); }
      ctx.lineWidth = 1;
      kr(ctx, sx, sy - 33, 5.8, kn); rc(ctx, sx - 3, sy - 29, 6, 3, kn);
      kr(ctx, sx - 2.2, sy - 33.5, 1.8, "#1a0f0c"); kr(ctx, sx + 2.2, sy - 33.5, 1.8, "#1a0f0c");
      kr(ctx, sx - 2.2, sy - 33.5, 0.9, "#ff4a3a"); kr(ctx, sx + 2.2, sy - 33.5, 0.9, "#ff4a3a");
      var hx = sx + cx * 10, hy = sy - 26 + cy * 6;
      lin(ctx, sx, sy - 27, hx, hy, kn, 2);
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(a);   // Bogen zeigt auf das Ziel
      ctx.strokeStyle = "#8a6b3a"; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(-5, 0, 10, -1.1, 1.1); ctx.stroke();
      var ex = -5 + 10 * Math.cos(1.1), ey = 10 * Math.sin(1.1), z = ank ? -9 : -3;
      ctx.strokeStyle = "#cfc9b4"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ex, -ey); ctx.lineTo(z, 0); ctx.lineTo(ex, ey); ctx.stroke();
      if (ank) lin(ctx, z, 0, 13, 0, "#e8e0c0", 1.6);
      ctx.restore();
    }
  },
  spinne: {
    groesse: { b: 22, h: 18 }, anker: { ax: 0.5, ay: 1 },
    zeichnen: function (ctx, sx, sy, g) {
      var t = ANIM + g.id * 2.3, blink = g.trefferBlink > 0, lauf = g.zustand !== "idle" ? 1 : 0.25;
      var kopf = Math.sin(t * 9) * 1.4 * lauf;
      schatten(ctx, sx, sy, 9);
      // 8 Beine: 4 je Seite, stilisierte gebogene Striche, animiert
      ctx.strokeStyle = blink ? "#f2f2e6" : "#2b2018"; ctx.lineWidth = 1.4;
      for (var i = 0; i < 4; i++) {
        var s = (i % 2 ? 1 : -1), hoch = Math.sin(t * 8 + i) * 2 * lauf;
        ctx.beginPath();
        ctx.moveTo(sx, sy - 7);
        ctx.lineTo(sx + s * (4 + i * 2), sy - 12 - hoch);
        ctx.lineTo(sx + s * (7 + i * 2.6), sy - 2);
        ctx.stroke();
      }
      // Rumpf (Hinterteil) + Kopf, dunkelrot
      ell(ctx, sx, sy - 9 - kopf * 0.4, 7, 5, blink ? "#f2f2e6" : "#4a1512");
      ell(ctx, sx, sy - 9 - kopf * 0.4, 4, 3, blink ? "#ffffff" : "#6a221a");
      kr(ctx, sx, sy - 13 - kopf, 3.4, blink ? "#f2f2e6" : "#330d0a");
      kr(ctx, sx - 1.2, sy - 14 - kopf, 0.7, "#ff6a3a");
      kr(ctx, sx + 1.2, sy - 14 - kopf, 0.7, "#ff6a3a");
    }
  },
  axt: {
    groesse: { b: 18, h: 18 }, anker: { ax: 0.5, ay: 0.5 },
    zeichnen: function (ctx, sx, sy, z) {
      ctx.save();
      ctx.translate(sx, sy); ctx.rotate((z ? z.zeit : 0) * 14);   // wirbelt im Flug
      lin(ctx, -7, 0, 7, 0, "#7a5a34", 2.5);
      poly(ctx, [3, -7, 10, -4, 10, 4, 3, 7], "#c4cbd8");
      lin(ctx, 10, -4, 10, 4, "#ffffff", 1);
      ctx.restore();
    }
  },
  pfeil: {
    groesse: { b: 16, h: 4 }, anker: { ax: 0.5, ay: 0.5 },
    zeichnen: function (ctx, sx, sy, z) {
      ctx.save();
      ctx.translate(sx, sy); ctx.rotate(z ? z.winkel : 0);
      lin(ctx, -7, 0, 6, 0, "#d8d2bc", 2);
      poly(ctx, [7, 0, 3, -2.5, 3, 2.5], "#aab3c5");
      rc(ctx, -7, -2, 3, 4, "#9a3a4c");
      ctx.restore();
    }
  },
  traenk: {
    groesse: { b: 14, h: 18 }, anker: { ax: 0.5, ay: 1 },
    zeichnen: function (ctx, sx, sy) {
      schatten(ctx, sx, sy, 6);
      glut(ctx, sx, sy - 7, 16, "255,80,60", 0.28 + Math.sin(ANIM * 4) * 0.08);
      kr(ctx, sx, sy - 6, 5.5, "#c8422e"); kr(ctx, sx - 2, sy - 8, 1.8, "rgba(255,255,255,0.4)");
      rc(ctx, sx - 2, sy - 15, 4, 4, "#8a6b3a");
    }
  },
  // Seite aus dem Pfarrbuch des Ambros Wendel (Fundstueck, E zum Lesen).
  buch: {
    groesse: { b: 20, h: 14 }, anker: { ax: 0.5, ay: 1 },
    zeichnen: function (ctx, sx, sy, f) {
      var gelesen = f && f.gelesen;
      schatten(ctx, sx, sy, 9);
      if (!gelesen) glut(ctx, sx, sy - 6, 30, "255,220,140", 0.3 + Math.sin(ANIM * 3) * 0.1);
      poly(ctx, [sx - 9, sy - 3, sx, sy - 6, sx + 9, sy - 3, sx + 9, sy - 9, sx, sy - 12, sx - 9, sy - 9], gelesen ? "#6a604a" : "#d8c9a0");
      lin(ctx, sx, sy - 6, sx, sy - 12, "#3a2c1c", 1.2);
      for (var i = 0; i < 3; i++) { lin(ctx, sx - 7, sy - 8 + i * 1.6, sx - 2, sy - 9.4 + i * 1.6, "rgba(60,40,20,0.6)", 0.8);
                                    lin(ctx, sx + 2, sy - 9.4 + i * 1.6, sx + 7, sy - 8 + i * 1.6, "rgba(60,40,20,0.6)", 0.8); }
    }
  }
};
// <<<<<< ENDE DER SPRITES-TABELLE
