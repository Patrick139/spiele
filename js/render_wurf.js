// render_wurf.js — Zeichnen im Modus "Ruebergeben": dein Feld links, das Feld des Freundes rechts, dazwischen die Wand mit dem Tor.
// Erweitert ZEICH und FX aus render.js (muss danach geladen werden). Kein Modul.

ZEICH.wurf = false;
ZEICH.setWurf = function (an) { this.wurf = !!an; this.groesse(); };

ZEICH.groesseWurf = function () {
  var d = Math.min(window.devicePixelRatio || 1, 2), WW = window.innerWidth, H = window.innerHeight;
  var quer = WW > H * 1.2 && H < 560, top = quer ? 8 : 142, ctrl = quer ? 0 : Math.round(Math.min(170, H * 0.22)), luecke = 16, infoW = quer ? 100 : 0;
  var c = Math.floor(Math.min((WW - 16 - luecke - infoW) / (2 * T_B), (H - top - ctrl - 34) / T_H));
  c = Math.max(10, Math.min(40, c));
  var inhalt = 2 * T_B * c + luecke + infoW, gw = Math.min(WW, inhalt + (quer ? 120 : 80));
  this.dpr = d; this.W = gw; this.H = H; this.winW = WW;
  this.cv.width = Math.round(gw * d); this.cv.height = Math.round(H * d);
  this.cv.style.width = gw + "px"; this.cv.style.height = H + "px"; this.cv.style.left = Math.round((WW - gw) / 2) + "px";
  var bx = Math.round((gw - inhalt) / 2) + infoW;
  this.lay = { c: c, bx: bx, by: top, wx: bx + T_B * c, fx: bx + T_B * c + luecke, luecke: luecke, ix: bx - infoW, hx: bx - infoW, hy: top, sx: bx, ctrlH: ctrl, top: top, quer: quer, wurf: true };
  this.spr = {};
  var bg = document.getElementById("bg");
  if (bg) { this.bg = bg; this.bgW = 144; this.bgH = Math.max(80, Math.round(144 * H / WW)); bg.width = this.bgW; bg.height = this.bgH; this.bgCtx = bg.getContext("2d"); this.bgT = -1; }
};

// ---- Fluege: ein Stein springt ueber die Wand --------------------------------------------------------------
FX.fluege = [];
(function () {
  var altEreignis = FX.ereignis, altSchritt = FX.schritt, altReset = FX.reset;
  FX.reset = function () { altReset.call(this); this.fluege = []; };
  FX.ereignis = function (e, s) {
    altEreignis.call(this, e, s);
    var L = ZEICH.lay, c = L.c;
    if (!L.wurf) return;
    if (e.art === "wurf") {
      var mx = 0, my = 0; e.zellen.forEach(function (q) { mx += q[0]; my += q[1]; });
      this.fluege.push({ typ: e.typ, rot: e.rot, x0: L.bx + (mx / 4 + 0.5) * c, y0: L.by + (my / 4 - T_VERDECKT + 0.5) * c, x1: L.fx + 5 * c, y1: L.by + 1.2 * c, t: 0, dauer: 0.45 });
      this.text("RÜBER!", L.wx + L.luecke / 2, L.by + 6 * c, "#ffb36b", Math.min(30, c * 1.5));
    } else if (e.art === "stein") {
      this.fluege.push({ typ: e.typ, rot: 0, x0: L.fx + 2 * c, y0: L.by + 9 * c, x1: L.bx + 5 * c, y1: L.by + 1.2 * c, t: 0, dauer: 0.45 });
      this.text("Stein vom Freund!", L.bx + 5 * c, L.by + 7 * c, "#ff8a9a", Math.min(24, c * 1.1));
    } else if (e.art === "verpufft") {
      this.text("Stein verpufft", L.bx + 5 * c, L.by + 5 * c, "#cbbcff", Math.min(22, c * 1.1));
    } else if (e.art === "tor" && e.offen) {
      this.teil(L.wx + L.luecke / 2, L.by + (s.tor.y + s.tor.h / 2) * c, "#7dffd8", 14, c * 4, c * 0.2);
    }
  };
  FX.schritt = function (dt) {
    altSchritt.call(this, dt);
    for (var i = this.fluege.length - 1; i >= 0; i--) { this.fluege[i].t += dt; if (this.fluege[i].t >= this.fluege[i].dauer) this.fluege.splice(i, 1); }
  };
})();

// ---- Die Wand mit dem Tor ----------------------------------------------------------------------------------
ZEICH.torZeichnen = function (ctx, s, L) {
  var c = L.c, x = L.wx + 4, w = L.luecke - 8, by = L.by, bh = T_H * c, t = s.tor, z = this.zeit;
  var g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, "#5a3fb0"); g.addColorStop(0.5, "#9a7cff"); g.addColorStop(1, "#4a3296");
  this.rr(ctx, x, by, w, bh, 4); ctx.fillStyle = g; ctx.fill();
  if (!t) return;
  var ty = by + t.y * c, th = t.h * c;
  if (t.offen) {
    var a = Math.max(0.35, Math.min(1, t.t / 0.6));
    ctx.fillStyle = "rgba(8,4,28,0.95)"; ctx.fillRect(x - 3, ty, w + 6, th);
    var gl = ctx.createLinearGradient(L.wx - 10, 0, L.fx + 10, 0); gl.addColorStop(0, "rgba(125,255,216,0)"); gl.addColorStop(0.5, "rgba(125,255,216," + (0.55 * a) + ")"); gl.addColorStop(1, "rgba(125,255,216,0)");
    ctx.fillStyle = gl; ctx.fillRect(L.wx - 10, ty, L.luecke + 20, th);
    ctx.fillStyle = "rgba(255,255,255," + (0.9 * a) + ")"; ctx.font = "900 " + Math.round(c * 0.8) + "px system-ui, sans-serif"; ctx.textAlign = "center";
    for (var k = 0; k < Math.floor(t.h); k++) ctx.fillText("▶", L.wx + L.luecke / 2 + ((z * 14 + k * 3) % 6) - 3, ty + (k + 0.78) * c);
    ctx.fillStyle = "#7dffd8"; ctx.fillRect(x - 3, ty - 3, w + 6, 3); ctx.fillRect(x - 3, ty + th, w + 6, 3);
    ctx.fillStyle = "rgba(125,255,216,0.9)"; ctx.fillRect(x - 3, by + bh + 6, (w + 6 + 2 * c * 2) * (t.t / T_TOR_OFFEN), 3);       // Restzeit
  } else if (t.vor) {
    var bl = 0.35 + 0.65 * Math.abs(Math.sin(z * 12));
    ctx.strokeStyle = "rgba(255,200,90," + bl + ")"; ctx.lineWidth = 2; ctx.strokeRect(x - 3, ty, w + 6, th);
    ctx.fillStyle = "rgba(255,200,90," + (bl * 0.25) + ")"; ctx.fillRect(x - 3, ty, w + 6, th);
  }
};

// ---- Das Feld des Freundes (gleich gross wie deins) -------------------------------------------------------
ZEICH.fremdesFeld = function (ctx, g, L) {
  var c = L.c, bw = T_B * c, bh = T_H * c, x = L.fx, y = L.by, i;
  this.rr(ctx, x - 3, y - 3, bw + 6, bh + 6, 10); ctx.fillStyle = "rgba(8,4,28,0.72)"; ctx.fill();
  ctx.strokeStyle = "rgba(255,150,170,0.5)"; ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, bw, bh); ctx.clip();
  ctx.strokeStyle = "rgba(255,190,200,0.06)"; ctx.lineWidth = 1; ctx.beginPath();
  for (i = 1; i < T_B; i++) { ctx.moveTo(x + i * c + 0.5, y); ctx.lineTo(x + i * c + 0.5, y + bh); }
  for (i = 1; i < T_H; i++) { ctx.moveTo(x, y + i * c + 0.5); ctx.lineTo(x + bw, y + i * c + 0.5); }
  ctx.stroke();
  var ab = g.abbild || "";
  for (i = 0; i < ab.length; i++) { var v = ab.charCodeAt(i) - 48; if (v > 0 && v <= 8) this.block(ctx, x + (i % T_B) * c, y + Math.floor(i / T_B) * c, c, v); }
  if (g.eier > 0) { var eh = Math.min(bh, g.eier * c); ctx.fillStyle = "rgba(255,140,70,0.9)"; ctx.fillRect(x, y + bh - eh, Math.max(4, c * 0.25), eh); }
  if (g.tot) { ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(x, y, bw, bh); ctx.fillStyle = "#fff"; ctx.font = "900 28px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText("Aus!", x + bw / 2, y + bh / 2); }
  ctx.restore();
  ctx.fillStyle = "rgba(255,200,210,0.9)"; ctx.font = "700 13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText(g.name || "Freund", x + bw / 2, y + bh + 17);
};

// ---- Halten, Naechste, Punkte -----------------------------------------------------------------------------------
ZEICH.infoZeichnen = function (ctx, s, L) {
  var c = L.c, total = 2 * T_B * c + L.luecke, i, liste = [];
  s.geworfen.forEach(function (q) { liste.push({ typ: q.typ, frei: true }); });
  for (i = 0; i < s.schlange.length && liste.length < 5; i++) liste.push({ typ: s.schlange[i] });
  var punkte = String(s.punkte).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  ctx.textAlign = "left";
  if (!L.quer) {
    var y = 50, h = 84;
    this.panel(ctx, L.bx, y, 66, h, "HALTEN");
    if (s.halten) { ctx.globalAlpha = s.halteOk ? 1 : 0.35; this.mini(ctx, s.halten, L.bx + 33, y + 52, 11); ctx.globalAlpha = 1; }
    var nw = total - 74 - 124;
    this.panel(ctx, L.bx + 74, y, nw, h, "NÄCHSTE");
    var n = Math.min(liste.length, Math.max(2, Math.floor((nw - 8) / 42)));
    for (i = 0; i < n; i++) {
      var cx = L.bx + 74 + 8 + 21 + i * 42;
      if (liste[i].frei) { ctx.strokeStyle = "rgba(255,110,130,0.9)"; ctx.lineWidth = 2; this.rr(ctx, cx - 19, y + 24, 38, 50, 6); ctx.stroke(); }
      this.mini(ctx, liste[i].typ, cx, y + 49, i ? 9 : 11);
    }
    var sx = L.bx + total - 116;
    ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = "800 26px system-ui, sans-serif"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(60,20,120,0.8)"; ctx.lineJoin = "round";
    ctx.strokeText(punkte, sx, y + 30); ctx.fillText(punkte, sx, y + 30);
    ctx.font = "600 12px system-ui, sans-serif"; ctx.fillStyle = "rgba(220,210,255,0.85)"; ctx.fillText("Zeilen " + s.linien + "  Stufe " + s.level, sx, y + 52);
    ctx.fillText("Würfe " + s.gewuerfe + "  Eier " + s.eierGelegt, sx, y + 70);
  } else {
    var x = L.ix + 4, y0 = L.by;
    this.panel(ctx, x, y0, 84, 62, "HALTEN");
    if (s.halten) { ctx.globalAlpha = s.halteOk ? 1 : 0.35; this.mini(ctx, s.halten, x + 42, y0 + 38, 12); ctx.globalAlpha = 1; }
    this.panel(ctx, x, y0 + 70, 84, 24 + 4 * 34, "NÄCHSTE");
    for (i = 0; i < Math.min(4, liste.length); i++) {
      if (liste[i].frei) { ctx.strokeStyle = "rgba(255,110,130,0.9)"; ctx.lineWidth = 2; this.rr(ctx, x + 12, y0 + 70 + 24 + i * 34 - 2, 60, 32, 6); ctx.stroke(); }
      this.mini(ctx, liste[i].typ, x + 42, y0 + 70 + 40 + i * 34, i ? 9 : 11);
    }
    var yy = y0 + 70 + 24 + 4 * 34 + 22; ctx.textAlign = "left";
    ctx.fillStyle = "#fff"; ctx.font = "800 22px system-ui, sans-serif"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(60,20,120,0.8)"; ctx.lineJoin = "round";
    ctx.strokeText(punkte, x, yy); ctx.fillText(punkte, x, yy);
    ctx.font = "600 11px system-ui, sans-serif"; ctx.fillStyle = "rgba(220,210,255,0.85)"; ctx.fillText("Zeilen " + s.linien + "  Stufe " + s.level, x, yy + 16); ctx.fillText("Würfe " + s.gewuerfe + "  Eier " + s.eierGelegt, x, yy + 30);
  }
};

// ---- Gesamtbild ------------------------------------------------------------------------------------------------------
ZEICH.frameWurf = function (dt, s, g, k) {
  var ctx = this.ctx, L = this.lay, c = L.c, W = this.W, H = this.H, i;
  var sx = 0, sy = 0;
  if (FX.schuettel > 0) { sx = (Math.random() - 0.5) * FX.schuettel; sy = (Math.random() - 0.5) * FX.schuettel; }
  ctx.save(); ctx.translate(sx, sy); ctx.textBaseline = "alphabetic";
  this.eigenesFeld(ctx, s);
  this.torZeichnen(ctx, s, L);
  if (g) this.fremdesFeld(ctx, g, L);
  this.infoZeichnen(ctx, s, L);
  if (this.zeit - (k && k.start || 0) < 40) {                                                                  // kleiner Hinweis, die ersten 40 s
    ctx.fillStyle = "rgba(200,190,255,0.75)"; ctx.textAlign = L.quer ? "left" : "center";
    if (L.quer) { ctx.font = "600 10px system-ui, sans-serif"; ["Tor offen: ▶ an die", "Wand schieben =", "Stein zum Freund"].forEach(function (z, j) { ctx.fillText(z, L.ix + 6, L.by + 70 + 24 + 4 * 34 + 100 + j * 12); }); }
    else { ctx.font = "600 12px system-ui, sans-serif"; var mx = L.bx + (T_B * c * 2 + L.luecke) / 2; ctx.fillText("Tor offen: ▶ an die Wand schieben, wenn der Stein", mx, L.by + T_H * c + 30); ctx.fillText("auf Tor-Höhe ist, dann fliegt er zum Freund", mx, L.by + T_H * c + 46); }
  }
  for (i = 0; i < FX.fluege.length; i++) {                                                                       // fliegende Steine
    var f = FX.fluege[i], p = f.t / f.dauer, e = p * p * (3 - 2 * p), fx = f.x0 + (f.x1 - f.x0) * e, fy = f.y0 + (f.y1 - f.y0) * e - Math.sin(p * Math.PI) * c * 3;
    this.glow(ctx, fx, fy, c * 1.6, "#ffb36b"); ctx.globalAlpha = 1 - p * 0.2; this.mini(ctx, f.typ, fx, fy, c * 0.7); ctx.globalAlpha = 1;
  }
  for (i = 0; i < FX.teile.length; i++) {
    var q = FX.teile[i], al = 1 - q.t / q.max;
    ctx.globalAlpha = Math.max(0, al); ctx.fillStyle = q.f; ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.r + q.t * 5); ctx.fillRect(-q.g / 2, -q.g / 2, q.g, q.g); ctx.restore();
  }
  ctx.globalAlpha = 1;
  for (i = 0; i < FX.texte.length; i++) {
    var tx = FX.texte[i], u = tx.t / 1.3, sc = u < 0.12 ? 0.6 + u / 0.12 * 0.6 : 1.2 - Math.min(0.2, (u - 0.12));
    ctx.save(); ctx.globalAlpha = u > 0.7 ? Math.max(0, 1 - (u - 0.7) / 0.3) : 1; ctx.translate(tx.x, tx.y - u * 46); ctx.scale(sc, sc);
    ctx.font = "900 " + tx.g + "px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 5; ctx.strokeStyle = "rgba(20,0,50,0.85)"; ctx.strokeText(tx.txt, 0, 0);
    ctx.globalAlpha *= 0.35; ctx.lineWidth = 11; ctx.strokeStyle = tx.f; ctx.strokeText(tx.txt, 0, 0); ctx.globalAlpha /= 0.35; ctx.fillStyle = tx.f; ctx.fillText(tx.txt, 0, 0); ctx.restore();
  }
  ctx.restore();
  if (k && k.pause) {
    ctx.save(); ctx.fillStyle = "rgba(10,4,30,0.62)"; ctx.fillRect(0, 0, W, H); ctx.textAlign = "center"; ctx.fillStyle = "#fff";
    ctx.font = "900 48px system-ui, sans-serif"; ctx.fillText("PAUSE", W / 2, H * 0.42); ctx.restore();
  }
  if (k && k.countdown > 0) {
    var cd = Math.ceil(k.countdown), fr = k.countdown - Math.floor(k.countdown), sz = 120 + (1 - fr) * 40;
    ctx.save(); ctx.fillStyle = "rgba(10,4,30,0.45)"; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.4 + 0.6 * fr; ctx.font = "900 " + sz + "px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#fff"; ctx.fillText(cd, W / 2, H * 0.45); ctx.restore();
  }
};
