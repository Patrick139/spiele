// render.js — alles Zeichnen: Hintergrund, Feld, Steine (glaenzend, farbig), Eier, Partikel, Texte, Seitenleiste, Gegnerfeld.
// FX.ereignis(e, s) bekommt jedes Spielereignis (tetris.js s.ev) und erzeugt Effekte. Kein Modul; globale Objekte FX und ZEICH.

var PALETTE = {                 // [hell, mittel, dunkel] je Form
  1: ["#8ff6ff", "#12cfee", "#0a6f8f"],   // I
  2: ["#fff08a", "#ffc61a", "#b07a00"],   // O
  3: ["#e6a0ff", "#b03cf0", "#5c1a99"],   // T
  4: ["#a6ff9a", "#34dc50", "#127a2a"],   // S
  5: ["#ff9a9a", "#f03442", "#8a1020"],   // Z
  6: ["#9ab8ff", "#3c64f4", "#18348f"],   // J
  7: ["#ffc88a", "#ff8418", "#964400"]    // L
};
var FARBE_GLUEH = { 1: "#12cfee", 2: "#ffc61a", 3: "#b03cf0", 4: "#34dc50", 5: "#f03442", 6: "#3c64f4", 7: "#ff8418" };

var FX = {
  teile: [], texte: [], spuren: [], blitze: [], schuettel: 0, warnT: 0,
  reset: function () { this.teile = []; this.texte = []; this.spuren = []; this.blitze = []; this.schuettel = 0; this.warnT = 0; },
  teil: function (x, y, farbe, n, v, groesse) {
    for (var i = 0; i < n && this.teile.length < 400; i++) {
      var w = Math.random() * 6.283, sp = (0.3 + Math.random()) * v;
      this.teile.push({ x: x, y: y, vx: Math.cos(w) * sp, vy: Math.sin(w) * sp - v * 0.4, t: 0, max: 0.5 + Math.random() * 0.6, f: farbe, g: (groesse || 5) * (0.5 + Math.random()), r: Math.random() * 6 });
    }
  },
  text: function (txt, x, y, farbe, groesse) { this.texte.push({ txt: txt, x: x, y: y, t: 0, f: farbe || "#fff", g: groesse || 30 }); },
  ereignis: function (e, s) {
    var L = ZEICH.lay, c = L.c, i;
    if (e.art === "sperre") {
      e.zellen.forEach(function (z) { if (z[1] >= T_VERDECKT) FX.teil(L.bx + (z[0] + 0.5) * c, L.by + (z[1] - T_VERDECKT + 0.5) * c, FARBE_GLUEH[T_ZAHL[e.typ]], 2, c * 3, c * 0.18); });
    } else if (e.art === "hart") {
      var z = T_FORM[e.typ][e.rot];
      for (i = 0; i < 4; i++) this.spuren.push({ x: e.x + z[i][0], y0: e.y0 + z[i][1], y1: e.y1 + z[i][1], f: FARBE_GLUEH[T_ZAHL[e.typ]], t: 0 });
      this.schuettel = Math.max(this.schuettel, Math.min(10, 3 + (e.y1 - e.y0) * 0.25));
    } else if (e.art === "zeilen") {
      var info = ["", "", "DOPPEL!", "DREIFACH!", "TETRIS!"][e.n];
      e.reihen.forEach(function (y, k) {
        var py = L.by + (y - T_VERDECKT + 0.5) * c;
        FX.blitze.push({ y: y - T_VERDECKT, t: 0 });
        for (var x = 0; x < T_B; x++) FX.teil(L.bx + (x + 0.5) * c, py, PALETTE[e.farben[k][x]] ? PALETTE[e.farben[k][x]][0] : "#fff6d8", e.n >= 4 ? 4 : 2, c * (3 + e.n), c * 0.28);
      });
      if (info) this.text(info, L.bx + 5 * c, L.by + 8 * c, e.n >= 4 ? "#ffe45e" : "#ffffff", e.n >= 4 ? 44 : 34);
      if (e.kombo >= 1) this.text("KOMBO ×" + (e.kombo + 1), L.bx + 5 * c, L.by + 10.2 * c, "#7dffb5", 26);
      if (e.b2b) this.text("RUNDUM-BONUS", L.bx + 5 * c, L.by + 6.4 * c, "#ff9aef", 22);
      if (e.leer) this.text("ALLES LEER!", L.bx + 5 * c, L.by + 12 * c, "#9ad8ff", 34);
      this.schuettel = Math.max(this.schuettel, 4 + e.n * 3);
    } else if (e.art === "angriff") {
      this.text("+" + e.n + " Eier für den Freund", L.bx + 5 * c, L.by + 14 * c, "#ffe6a0", 22);
    } else if (e.art === "eier") {
      this.schuettel = Math.max(this.schuettel, 8 + e.n * 2);
      for (i = 0; i < e.n * 6; i++) this.teil(L.bx + Math.random() * T_B * c, L.by + (T_H - 0.5 - Math.random() * e.n) * c, "#fff0cf", 1, c * 4, c * 0.2);
      this.text(e.n + " Eier gelegt!", L.bx + 5 * c, L.by + 15 * c, "#ffd2a0", 26);
    } else if (e.art === "warnung") {
      this.warnT = 0.8;
    } else if (e.art === "halten") {
      this.text("HALTEN", L.hx + 50, L.hy + 70, "#cdbfff", 14);
    }
  },
  schritt: function (dt) {
    var i, p;
    for (i = this.teile.length - 1; i >= 0; i--) { p = this.teile[i]; p.t += dt; p.vy += 700 * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.t > p.max) this.teile.splice(i, 1); }
    for (i = this.texte.length - 1; i >= 0; i--) { p = this.texte[i]; p.t += dt; if (p.t > 1.3) this.texte.splice(i, 1); }
    for (i = this.spuren.length - 1; i >= 0; i--) { this.spuren[i].t += dt; if (this.spuren[i].t > 0.25) this.spuren.splice(i, 1); }
    for (i = this.blitze.length - 1; i >= 0; i--) { this.blitze[i].t += dt; if (this.blitze[i].t > 0.4) this.blitze.splice(i, 1); }
    this.schuettel = Math.max(0, this.schuettel - dt * 40);
    if (this.warnT > 0) this.warnT -= dt;
  }
};

var ZEICH = {
  cv: null, ctx: null, W: 0, H: 0, dpr: 1, lay: { c: 20, bx: 0, by: 0, hx: 0, hy: 0, sx: 0 }, zeit: 0, spr: {}, bgT: -1, bgLevel: 0, winW: 0, bg: null, bgCtx: null,
  init: function (cv) { this.cv = cv; this.ctx = cv.getContext("2d"); this.groesse(); window.addEventListener("resize", function () { ZEICH.groesse(); }); },
  groesse: function () {
    if (this.wurf) { this.groesseWurf(); return; }
    var d = Math.min(window.devicePixelRatio || 1, 2), WW = window.innerWidth, H = window.innerHeight;
    var quer = WW > H * 1.2 && H < 560, top = quer ? 8 : 58, ctrl = quer ? 0 : Math.round(Math.min(170, H * 0.22)), seite = 112;
    var c = Math.floor(Math.min((WW - seite - 12) / T_B, (H - top - ctrl - 8) / T_H));
    c = Math.max(12, Math.min(44, c));
    // Die Zeichenflaeche ist nur so breit wie das Spiel (plus Rand fuer Texte), nicht so breit wie das Fenster:
    // auf einem grossen Monitor sind das 5- bis 10-mal weniger Pixel pro Bild.
    var inhalt = T_B * c + seite, gw = Math.min(WW, inhalt + (quer ? 360 : 90));
    this.dpr = d; this.W = gw; this.H = H; this.winW = WW;
    this.cv.width = Math.round(gw * d); this.cv.height = Math.round(H * d);
    this.cv.style.width = gw + "px"; this.cv.style.height = H + "px"; this.cv.style.left = Math.round((WW - gw) / 2) + "px";
    var bx = Math.round((gw - inhalt) / 2);
    this.lay = { c: c, bx: bx, by: top, sx: bx + T_B * c + 10, hx: bx + T_B * c + 10, hy: top, ctrlH: ctrl, top: top, quer: quer };
    this.spr = {};                                                          // Steinbilder fuer die neue Groesse neu anlegen
    var bg = document.getElementById("bg");
    if (bg) { this.bg = bg; this.bgW = 144; this.bgH = Math.max(80, Math.round(144 * H / WW)); bg.width = this.bgW; bg.height = this.bgH; this.bgCtx = bg.getContext("2d"); this.bgT = -1; }
  },
  // Hintergrund: winziges Bild (144 Pixel breit), vom Browser weich auf Fenstergroesse gezogen; nur alle 0,15 s neu gemalt.
  hintergrundSchritt: function (level) {
    if (!this.bgCtx || this.zeit - this.bgT < 0.15 && this.bgLevel === level) return;
    this.bgT = this.zeit; this.bgLevel = level;
    this.hintergrund(this.bgCtx, this.bgW, this.bgH, level, this.zeit);
  },

  // ---- Bausteine -------------------------------------------------------------------------------
  rr: function (ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },
  blockRoh: function (ctx, x, y, c, zahl) {      // einmal gemalt, danach nur noch kopiert (siehe block)
    if (zahl === T_EI) { this.ei(ctx, x, y, c); return; }
    var p = PALETTE[zahl], m = 0.5, r = c * 0.2;
    var g = ctx.createLinearGradient(x, y, x + c, y + c);
    g.addColorStop(0, p[0]); g.addColorStop(0.45, p[1]); g.addColorStop(1, p[2]);
    this.rr(ctx, x + m, y + m, c - 1, c - 1, r); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.stroke();
    var h = ctx.createLinearGradient(0, y, 0, y + c * 0.55);                               // Glanz oben
    h.addColorStop(0, "rgba(255,255,255,0.55)"); h.addColorStop(1, "rgba(255,255,255,0)");
    this.rr(ctx, x + c * 0.1, y + c * 0.08, c * 0.8, c * 0.42, r * 0.8); ctx.fillStyle = h; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(x + c * 0.26, y + c * 0.26, c * 0.06, 0, 6.283); ctx.fill();
  },
  sprite: function (zahl, c) {
    var d = this.dpr, k = zahl + "_" + c, sp = this.spr[k];
    if (sp) return sp;
    var n = 0; for (var q in this.spr) n++;
    if (n > 120) this.spr = {};
    sp = document.createElement("canvas"); sp.width = sp.height = Math.ceil(c * d) + 2;
    var g = sp.getContext("2d"); g.scale(d, d); this.blockRoh(g, 0, 0, c, zahl);
    this.spr[k] = sp; return sp;
  },
  block: function (ctx, x, y, c, zahl, alpha) {
    var cc = Math.round(c * 4) / 4, sp = this.sprite(zahl, cc), d = this.dpr;
    if (alpha !== undefined && alpha !== 1) ctx.globalAlpha = alpha;
    ctx.drawImage(sp, x, y, sp.width / d, sp.height / d);
    if (alpha !== undefined && alpha !== 1) ctx.globalAlpha = 1;
  },
  glow: function (ctx, x, y, r, farbe) {         // weicher Schein: einmal als Bild gemalt, dann kopiert
    var k = "g" + farbe + "_" + Math.round(r), sp = this.spr[k], d = this.dpr;
    if (!sp) {
      sp = document.createElement("canvas"); sp.width = sp.height = Math.ceil(r * 2 * d); var g = sp.getContext("2d"); g.scale(d, d);
      var rg = g.createRadialGradient(r, r, 0, r, r, r); rg.addColorStop(0, farbe + "aa"); rg.addColorStop(1, farbe + "00"); g.fillStyle = rg; g.fillRect(0, 0, r * 2, r * 2);
      this.spr[k] = sp;
    }
    ctx.drawImage(sp, x - r, y - r, sp.width / d, sp.height / d);
  },
  ei: function (ctx, x, y, c) {                // Garbage-Zelle als Ei
    ctx.fillStyle = "rgba(255,230,190,0.10)"; ctx.fillRect(x, y, c, c);
    var cx = x + c / 2, cy = y + c / 2 + c * 0.03;
    var g = ctx.createRadialGradient(cx - c * 0.12, cy - c * 0.18, c * 0.05, cx, cy, c * 0.5);
    g.addColorStop(0, "#fffdf2"); g.addColorStop(0.6, "#f6dca6"); g.addColorStop(1, "#d7a766");
    ctx.beginPath(); ctx.ellipse(cx, cy, c * 0.38, c * 0.46, 0, 0, 6.283); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "rgba(90,50,10,0.45)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = "rgba(150,90,40,0.35)";
    ctx.beginPath(); ctx.arc(cx + c * 0.12, cy + c * 0.1, c * 0.05, 0, 6.283); ctx.arc(cx - c * 0.14, cy + c * 0.16, c * 0.035, 0, 6.283); ctx.arc(cx + c * 0.04, cy - c * 0.2, c * 0.03, 0, 6.283); ctx.fill();
  },
  panel: function (ctx, x, y, w, h, titel) {
    this.rr(ctx, x, y, w, h, 10); ctx.fillStyle = "rgba(14,8,40,0.55)"; ctx.fill();
    ctx.strokeStyle = "rgba(190,170,255,0.28)"; ctx.lineWidth = 1.2; ctx.stroke();
    if (titel) { ctx.fillStyle = "rgba(210,200,255,0.8)"; ctx.font = "bold 11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText(titel, x + w / 2, y + 14); }
  },
  mini: function (ctx, typ, cx, cy, c) {       // Stein mittig in (cx, cy) zeichnen
    var z = T_FORM[typ][0], minx = 9, maxx = 0, miny = 9, maxy = 0;
    z.forEach(function (q) { minx = Math.min(minx, q[0]); maxx = Math.max(maxx, q[0]); miny = Math.min(miny, q[1]); maxy = Math.max(maxy, q[1]); });
    var w = (maxx - minx + 1) * c, h = (maxy - miny + 1) * c;
    for (var i = 0; i < 4; i++) this.block(ctx, cx - w / 2 + (z[i][0] - minx) * c, cy - h / 2 + (z[i][1] - miny) * c, c, T_ZAHL[typ]);
  },

  hintergrund: function (ctx, W, H, level, t) {
    var hue = (222 + (level - 1) * 14) % 360;
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "hsl(" + hue + ",60%,13%)"); g.addColorStop(0.55, "hsl(" + ((hue + 30) % 360) + ",55%,9%)"); g.addColorStop(1, "hsl(" + ((hue + 70) % 360) + ",50%,6%)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (var i = 0; i < 6; i++) {                                                          // treibende Farbkleckse
      var x = (0.5 + 0.45 * Math.sin(t * 0.05 * (i + 1) + i * 2)) * W, y = (0.5 + 0.45 * Math.cos(t * 0.04 * (i + 2) + i)) * H, r = Math.max(W, H) * (0.28 + 0.05 * i);
      var rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, "hsla(" + ((hue + i * 55) % 360) + ",90%,55%,0.16)"); rg.addColorStop(1, "hsla(" + ((hue + i * 55) % 360) + ",90%,55%,0)");
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    }
  },

  // ---- Gegnerfeld klein ------------------------------------------------------------------------
  gegner: function (ctx, x, y, w, h, g) {
    this.panel(ctx, x, y, w, h, g.name || "Freund");
    var cs = Math.floor((w - 12) / T_B), bw = cs * T_B, bh = cs * T_H, ox = x + (w - bw) / 2, oy = y + 20;
    ctx.fillStyle = "rgba(0,0,10,0.55)"; ctx.fillRect(ox, oy, bw, bh);
    var ab = g.abbild || "";
    for (var i = 0; i < ab.length; i++) {
      var v = ab.charCodeAt(i) - 48;
      if (!v) continue;
      var cx = ox + (i % T_B) * cs, cy = oy + Math.floor(i / T_B) * cs;
      if (v === T_EI) { ctx.fillStyle = "#f2d9a8"; ctx.beginPath(); ctx.ellipse(cx + cs / 2, cy + cs / 2, cs * 0.38, cs * 0.45, 0, 0, 6.283); ctx.fill(); }
      else { ctx.fillStyle = PALETTE[v][1]; ctx.fillRect(cx, cy, cs - 0.5, cs - 0.5); ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(cx, cy, cs - 0.5, 1.5); }
    }
    if (g.eier > 0) {                                                                       // Eier, die bei ihm gleich ankommen
      ctx.fillStyle = "rgba(255,150,80,0.9)"; ctx.fillRect(ox - 4, oy + bh - Math.min(bh, g.eier * cs), 3, Math.min(bh, g.eier * cs));
    }
    if (g.tot) { ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(ox, oy, bw, bh); ctx.fillStyle = "#fff"; ctx.font = "bold 13px system-ui"; ctx.textAlign = "center"; ctx.fillText("Aus!", ox + bw / 2, oy + bh / 2); }
  },

  // Das eigene Feld mit Rahmen, Steinen, Schatten, fallendem Stein, Zeilenblitzen und Eier-Balken (Feldposition: lay.bx / lay.by).
  eigenesFeld: function (ctx, s) {
    var L = this.lay, c = L.c, i;
    var bw = T_B * c, bh = T_H * c;
    this.rr(ctx, L.bx - 3, L.by - 3, bw + 6, bh + 6, 10);
    var hot = FX.warnT > 0 ? "rgba(255,120,60," + (0.5 + 0.5 * Math.sin(this.zeit * 30)) + ")" : "rgba(170,140,255,0.55)";
    ctx.fillStyle = "rgba(8,4,28,0.72)"; ctx.fill(); ctx.globalAlpha = 0.25; ctx.strokeStyle = hot; ctx.lineWidth = 8; ctx.stroke(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(L.bx, L.by, bw, bh); ctx.clip();
    ctx.strokeStyle = "rgba(190,170,255,0.07)"; ctx.lineWidth = 1; ctx.beginPath();
    for (i = 1; i < T_B; i++) { ctx.moveTo(L.bx + i * c + 0.5, L.by); ctx.lineTo(L.bx + i * c + 0.5, L.by + bh); }
    for (i = 1; i < T_H; i++) { ctx.moveTo(L.bx, L.by + i * c + 0.5); ctx.lineTo(L.bx + bw, L.by + i * c + 0.5); }
    ctx.stroke();
    for (var y = T_VERDECKT; y < T_H + T_VERDECKT; y++) for (var x = 0; x < T_B; x++) if (s.feld[y][x]) this.block(ctx, L.bx + x * c, L.by + (y - T_VERDECKT) * c, c, s.feld[y][x]);
    for (i = 0; i < FX.spuren.length; i++) {                                                // Spuren des Hartfalls
      var sp = FX.spuren[i], a = 0.35 * (1 - sp.t / 0.25);
      var gr = ctx.createLinearGradient(0, L.by + (sp.y0 - T_VERDECKT) * c, 0, L.by + (sp.y1 - T_VERDECKT) * c);
      gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(1, sp.f);
      ctx.globalAlpha = a; ctx.fillStyle = gr; ctx.fillRect(L.bx + sp.x * c + c * 0.15, L.by + (sp.y0 - T_VERDECKT) * c, c * 0.7, (sp.y1 - sp.y0) * c); ctx.globalAlpha = 1;
    }
    if (s.akt && !s.tot) {                                                                  // Schatten und fallender Stein
      var gy = tGeisterY(s), a2 = s.akt, col = T_ZAHL[a2.typ];
      tZellen(a2.typ, a2.rot, a2.x, gy).forEach(function (q) {
        if (q[1] < T_VERDECKT) return;
        var px = L.bx + q[0] * c, py = L.by + (q[1] - T_VERDECKT) * c;
        ctx.strokeStyle = PALETTE[col][0]; ctx.globalAlpha = 0.55; ctx.lineWidth = 2; ZEICH.rr(ctx, px + 2, py + 2, c - 4, c - 4, c * 0.18); ctx.stroke();
        ctx.globalAlpha = 0.12; ctx.fillStyle = PALETTE[col][1]; ctx.fill(); ctx.globalAlpha = 1;
      });
      tZellen(a2.typ, a2.rot, a2.x, a2.y).forEach(function (q) { if (q[1] >= T_VERDECKT) ZEICH.glow(ctx, L.bx + (q[0] + 0.5) * c, L.by + (q[1] - T_VERDECKT + 0.5) * c, c * 1.1, FARBE_GLUEH[col]); });
      tZellen(a2.typ, a2.rot, a2.x, a2.y).forEach(function (q) { if (q[1] >= T_VERDECKT) ZEICH.block(ctx, L.bx + q[0] * c, L.by + (q[1] - T_VERDECKT) * c, c, col); });
    }
    for (i = 0; i < FX.blitze.length; i++) {                                                // Zeilenblitze
      var bz = FX.blitze[i], f = 1 - bz.t / 0.4;
      ctx.globalAlpha = f; ctx.fillStyle = "#fff"; ctx.fillRect(L.bx, L.by + bz.y * c + c * 0.5 * (1 - f), bw, c * f);
      ctx.globalAlpha = 1;
    }
    var n = tEierAnzahl(s);                                                                 // ankommende Eier: Balken am linken Rand
    if (n > 0) {
      var eh = Math.min(bh, n * c), pu = 0.6 + 0.4 * Math.sin(this.zeit * 10);
      var eg = ctx.createLinearGradient(0, L.by + bh - eh, 0, L.by + bh); eg.addColorStop(0, "rgba(255,120,60," + pu + ")"); eg.addColorStop(1, "rgba(255,200,90," + pu + ")");
      ctx.fillStyle = eg; ctx.fillRect(L.bx, L.by + bh - eh, Math.max(5, c * 0.3), eh);
      for (i = 0; i < Math.min(n, T_H); i++) this.ei(ctx, L.bx + 2, L.by + bh - (i + 1) * c, c * 0.6);
    }
    ctx.restore();
  },

  // ---- Das ganze Bild --------------------------------------------------------------------------
  // s = eigener Spielstand, g = Gegnerdaten oder null, k = { countdown }
  frame: function (dt, s, g, k) {
    var ctx = this.ctx, L = this.lay, c = L.c, W = this.W, H = this.H, i, d = this.dpr;
    this.zeit += dt; FX.schritt(dt);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, W, H);
    this.hintergrundSchritt(s ? s.level : 1 + Math.floor(this.zeit / 15) % 10);
    if (!s) return;
    if (this.wurf) { this.frameWurf(dt, s, g, k); return; }                             // Ruebergeben: zwei Felder (render_wurf.js)
    var sx = 0, sy = 0;
    if (FX.schuettel > 0) { sx = (Math.random() - 0.5) * FX.schuettel; sy = (Math.random() - 0.5) * FX.schuettel; }
    ctx.save(); ctx.translate(sx, sy);
    ctx.textBaseline = "alphabetic";
    // Kopfzeile
    var kx = L.quer ? Math.max(8, L.bx - 150) : L.bx, ky = L.quer ? 40 : 34, ky2 = L.quer ? 60 : 52;
    ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = "800 28px system-ui, sans-serif";
    ctx.lineWidth = 4; ctx.strokeStyle = "rgba(60,20,120,0.8)"; ctx.lineJoin = "round";
    ctx.strokeText(String(s.punkte).replace(/\B(?=(\d{3})+(?!\d))/g, "."), kx, ky); ctx.fillText(String(s.punkte).replace(/\B(?=(\d{3})+(?!\d))/g, "."), kx, ky);
    ctx.font = "600 13px system-ui, sans-serif"; ctx.fillStyle = "rgba(220,210,255,0.8)";
    ctx.fillText("Zeilen " + s.linien + "   Stufe " + s.level, kx, ky2);
    // Feld
    var bh = T_H * c;
    this.eigenesFeld(ctx, s);
    for (i = 0; i < FX.teile.length; i++) {                                                 // Partikel
      var p = FX.teile[i], al = 1 - p.t / p.max;
      ctx.globalAlpha = Math.max(0, al); ctx.fillStyle = p.f; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r + p.t * 5); ctx.fillRect(-p.g / 2, -p.g / 2, p.g, p.g); ctx.restore();
    }
    ctx.globalAlpha = 1;
    for (i = 0; i < FX.texte.length; i++) {                                                 // schwebende Texte
      var tx = FX.texte[i], u = tx.t / 1.3, sc = u < 0.12 ? 0.6 + u / 0.12 * 0.6 : 1.2 - Math.min(0.2, (u - 0.12));
      ctx.save(); ctx.globalAlpha = u > 0.7 ? Math.max(0, 1 - (u - 0.7) / 0.3) : 1; ctx.translate(tx.x, tx.y - u * 46); ctx.scale(sc, sc);
      ctx.font = "900 " + tx.g + "px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 5; ctx.strokeStyle = "rgba(20,0,50,0.85)"; ctx.strokeText(tx.txt, 0, 0);
      ctx.globalAlpha *= 0.35; ctx.lineWidth = 11; ctx.strokeStyle = tx.f; ctx.strokeText(tx.txt, 0, 0); ctx.globalAlpha /= 0.35; ctx.fillStyle = tx.f; ctx.fillText(tx.txt, 0, 0); ctx.restore();
    }
    var pw = 100;                                                                           // Seitenleiste
    this.panel(ctx, L.sx, L.by, pw, 62, "HALTEN");
    if (s.halten) { ctx.globalAlpha = s.halteOk ? 1 : 0.35; this.mini(ctx, s.halten, L.sx + pw / 2, L.by + 38, Math.min(16, c * 0.6)); ctx.globalAlpha = 1; }
    this.panel(ctx, L.sx, L.by + 70, pw, 28 + T_VORSCHAU * 38, "NÄCHSTE");
    for (i = 0; i < T_VORSCHAU; i++) this.mini(ctx, s.schlange[i], L.sx + pw / 2, L.by + 70 + 38 + i * 38, Math.min(i ? 12 : 15, c * 0.55));
    var gy2 = L.by + 70 + 28 + T_VORSCHAU * 38 + 8, gh = Math.min(bh - (gy2 - L.by), 20 + Math.floor((pw - 12) / T_B) * T_H + 8);
    if (g && gh > 80) this.gegner(ctx, L.sx, gy2, pw, gh, g);
    ctx.restore();
    if (k && k.pause) {
      ctx.save(); ctx.fillStyle = "rgba(10,4,30,0.62)"; ctx.fillRect(0, 0, W, H); ctx.textAlign = "center"; ctx.fillStyle = "#fff";
      ctx.font = "900 48px system-ui, sans-serif"; ctx.fillText("PAUSE", W / 2, H * 0.42); ctx.font = "600 16px system-ui, sans-serif"; ctx.fillStyle = "#cbbcff"; ctx.fillText("Tippen oder P: weiter", W / 2, H * 0.42 + 34); ctx.restore();
    }
    if (k && k.countdown > 0) {                                                             // Countdown
      var cd = Math.ceil(k.countdown), fr = k.countdown - Math.floor(k.countdown), sz = 120 + (1 - fr) * 40;
      ctx.save(); ctx.fillStyle = "rgba(10,4,30,0.45)"; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 0.4 + 0.6 * fr; ctx.font = "900 " + sz + "px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#fff";
      ctx.fillText(cd, W / 2, H * 0.45); ctx.restore();
    }
  }
};
