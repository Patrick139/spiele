// gegnerbilder.js — Zeichnungen der Gegner mit Aufgaben (gegner2.js): Schildtraeger, Brecher, Beschwoerer,
// und ihre Ankuendigungen (Brecher: Sturmlinie, Beschwoerer: Kreis). Nur Canvas-Formen.
// Nutzt sprites.js (ell, kr, rc, lin, poly, glut, schatten, SPRITES, ANIM, TAU).

SPRITES.schildtraeger = {
  groesse: { b: 30, h: 38 }, anker: { ax: 0.5, ay: 1 },
  zeichnen: function (ctx, sx, sy, g) {
    var t = ANIM + g.id * 1.5, w = g.schildW || 0, cx = Math.cos(w), cy = Math.sin(w), blink = g.trefferBlink > 0;
    var unten = g.schildDown > 0, lauf = g.zustand === "idle" ? 0.2 : 1, sw = Math.sin(t * 6) * 2 * lauf;
    var stahl = blink ? "#ffffff" : "#8a909c", dunkel = blink ? "#f0f0f0" : "#5a606c";
    schatten(ctx, sx, sy, 13);
    rc(ctx, sx - 6, sy - 12 + sw * 0.3, 5, 12, dunkel); rc(ctx, sx + 1, sy - 12 - sw * 0.3, 5, 12, dunkel);       // Beine
    rc(ctx, sx - 8, sy - 27, 16, 16, stahl); rc(ctx, sx - 8, sy - 27, 16, 2, "rgba(255,255,255,0.25)");            // Harnisch
    rc(ctx, sx - 8, sy - 15, 16, 2.4, "#3a2a1a");
    kr(ctx, sx, sy - 32, 6.2, stahl); rc(ctx, sx - 4.5, sy - 33, 9, 2, "#14100c");                                  // Helm mit Sehschlitz
    if (g.zustand === "ank") lin(ctx, sx + cx * 6, sy - 22, sx + cx * 24, sy - 20 + cy * 10, "#cfcfd8", 3);        // Schildstoss
    var bx = sx + cx * (g.zustand === "ank" ? 20 : 11), by = sy - (unten ? 8 : 19) + cy * 6;
    ctx.save(); ctx.translate(bx, by); if (unten) ctx.rotate(0.9 * (cx >= 0 ? 1 : -1));
    var flash = g.blockT > 0;
    ell(ctx, 0, 0, 9, 13, flash ? "#ffffff" : "#6a4a2a"); ell(ctx, 0, 0, 7, 11, flash ? "#f4f4f4" : "#8a6a3a");     // Holzschild mit Eisenrand
    ctx.strokeStyle = flash ? "#ffffff" : "#aab0bc"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, 0, 9, 13, 0, 0, TAU); ctx.stroke(); ctx.lineWidth = 1;
    kr(ctx, 0, 0, 2.6, "#cfd2da");
    if (unten) lin(ctx, -4, -8, 3, 6, "#1a120c", 1.6);                                                              // Riss
    ctx.restore();
    if (unten) for (var i = 0; i < 3; i++) kr(ctx, sx + Math.cos(t * 3 + i * 2.1) * 9, sy - 42 + Math.sin(t * 3 + i * 2.1) * 3, 1.6, "#ffe08a");   // Sterne
  }
};

SPRITES.brecher = {
  groesse: { b: 40, h: 44 }, anker: { ax: 0.5, ay: 1 },
  zeichnen: function (ctx, sx, sy, g) {
    var t = ANIM + g.id * 1.1, a = (g.zustand === "ank" || g.zustand === "sturm" ? g.zielW : g.blick) || 0, cx = Math.cos(a), cy = Math.sin(a);
    var blink = g.trefferBlink > 0, sturm = g.zustand === "sturm", ank = g.zustand === "ank" && !g.nah, benommen = g.zustand === "benommen";
    var lauf = g.zustand === "idle" ? 0.2 : 1, wank = Math.sin(t * 3) * 1.2 * lauf, neig = (sturm ? 7 : (ank ? 3 : 0)) * cx, tief = benommen ? 4 : 0;
    var haut = blink ? "#ffffff" : "#7a6a58", dunkel = blink ? "#eeeeee" : "#54483c";
    schatten(ctx, sx, sy, 17);
    if (sturm) for (var s = 1; s <= 3; s++) ell(ctx, sx - cx * s * 12, sy - 2, 9 - s * 2, 3, "rgba(150,130,100," + (0.3 - s * 0.07) + ")");   // Staub
    rc(ctx, sx - 9, sy - 13, 7, 13, dunkel); rc(ctx, sx + 2, sy - 13, 7, 13, dunkel);                                // dicke Beine
    poly(ctx, [sx - 15 + neig, sy - 13, sx + 15 + neig, sy - 13, sx + 12 + neig * 1.6, sy - 32 + tief + wank, sx - 12 + neig * 1.6, sy - 32 + tief + wank], haut);
    poly(ctx, [sx - 15 + neig, sy - 13, sx - 4 + neig, sy - 13, sx - 6 + neig, sy - 22, sx - 12 + neig, sy - 20], dunkel);
    ell(ctx, sx + neig * 1.6, sy - 30 + tief + wank, 12, 5, haut);                                                  // breite Schultern
    lin(ctx, sx - 13 + neig * 1.6, sy - 29 + tief, sx - 17 + cx * 6, sy - 15, dunkel, 6); lin(ctx, sx + 13 + neig * 1.6, sy - 29 + tief, sx + 17 + cx * 6, sy - 15, dunkel, 6);   // Arme
    kr(ctx, sx - 17 + cx * 6, sy - 14, 4, haut); kr(ctx, sx + 17 + cx * 6, sy - 14, 4, haut);
    var kx = sx + neig * 2 + cx * 2, ky = sy - 36 + tief + wank + (sturm ? 3 : 0);
    kr(ctx, kx, ky, 7.6, blink ? "#ffffff" : "#6a5c4c"); rc(ctx, kx - 6, ky - 3, 12, 6, blink ? "#ffffff" : "#8a8f98");   // Eisenmaske
    rc(ctx, kx - 4, ky - 1, 8, 1.6, "#14100c");
    poly(ctx, [kx - 6, ky + 2, kx - 8, ky + 8, kx - 3, ky + 3], "#e8e0c8"); poly(ctx, [kx + 6, ky + 2, kx + 8, ky + 8, kx + 3, ky + 3], "#e8e0c8");   // Hauer
    if (ank || sturm) { kr(ctx, kx - 3, ky - 1, 1.6, "#ff4a30"); kr(ctx, kx + 3, ky - 1, 1.6, "#ff4a30"); glut(ctx, kx, ky, 26, "255,60,40", 0.4); }
    if (benommen) for (var i = 0; i < 3; i++) kr(ctx, kx + Math.cos(t * 4 + i * 2.1) * 11, ky - 11 + Math.sin(t * 4 + i * 2.1) * 3, 2, "#ffe08a");   // Sterne
  }
};

SPRITES.beschwoerer = {
  groesse: { b: 26, h: 40 }, anker: { ax: 0.5, ay: 1 },
  zeichnen: function (ctx, sx, sy, g) {
    var t = ANIM + g.id * 1.4, cx = Math.cos(g.blick || 0), blink = g.trefferBlink > 0, ruf = g.zustand === "ank";
    var schwebe = Math.sin(t * 2.2) * 2 - 3, rob = blink ? "#ffffff" : "#4a2a6a", rob2 = blink ? "#f0f0f0" : "#341c4e";
    if (ruf) {                                                      // Beschwoerungskreis am Boden, waechst mit der Zeit
      var p = 1 - Math.max(0, g.t) / BESCHW_RUF_ZEIT, rr = 14 + p * 34;
      ctx.save(); ctx.globalAlpha = 0.35 + p * 0.4; ctx.strokeStyle = "#c09aff"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.ellipse(sx, sy - 2, rr, rr * 0.45, 0, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(sx, sy - 2, rr * 0.6, rr * 0.27, t, 0, TAU); ctx.stroke(); ctx.restore();
      glut(ctx, sx, sy - 4, 50, "170,110,255", 0.35 * p);
    }
    schatten(ctx, sx, sy, 10 - schwebe * 0.4);
    poly(ctx, [sx - 6, sy - 26 + schwebe, sx + 6, sy - 26 + schwebe, sx + 11, sy - 2 + schwebe * 0.4, sx - 11, sy - 2 + schwebe * 0.4], rob);
    poly(ctx, [sx - 11, sy - 2 + schwebe * 0.4, sx - 3, sy - 2 + schwebe * 0.4, sx - 5, sy - 18 + schwebe], rob2);
    lin(ctx, sx - 7, sy - 24 + schwebe, sx - 11, sy - (ruf ? 36 : 17) + schwebe, rob2, 3.4); lin(ctx, sx + 7, sy - 24 + schwebe, sx + 11, sy - (ruf ? 36 : 17) + schwebe, rob2, 3.4);
    ctx.fillStyle = rob2; ctx.beginPath(); ctx.arc(sx, sy - 29 + schwebe, 7.6, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();   // Kapuze
    kr(ctx, sx + cx * 1.5, sy - 28 + schwebe, 4.6, "#0a0610");
    kr(ctx, sx - 1.6 + cx * 2, sy - 28.5 + schwebe, 1.1, "#d8b8ff"); kr(ctx, sx + 2.4 + cx * 2, sy - 28.5 + schwebe, 1.1, "#d8b8ff");
    var sx2 = sx + (cx >= 0 ? 12 : -12);                             // Stab mit Kugel
    lin(ctx, sx2, sy - 2 + schwebe * 0.4, sx2, sy - 36 + schwebe, "#3a2a1a", 2);
    kr(ctx, sx2, sy - 39 + schwebe, 3.6, ruf ? "#e8d0ff" : "#b080ff"); glut(ctx, sx2, sy - 39 + schwebe, ruf ? 40 : 22, "170,110,255", ruf ? 0.7 : 0.4);
  }
};

// Ankuendigungen: Brecher = rote Sturmlinie, Beschwoerer = (Kreis ist im Sprite). grafik.js zeichneAnkkuendigung ruft.
function zeichneAnkNeu(ctx, camX, camY, g) {
  if (g.art === "brecher" && g.zustand === "ank" && !g.nah) {
    var sx = g.x - camX, sy = g.y - camY, p = 1 - Math.max(0, g.t) / BRECHER_ANK, w = g.zielW;
    ctx.save(); ctx.translate(sx, sy - 6); ctx.rotate(w);
    ctx.globalAlpha = 0.25 + 0.4 * p; ctx.fillStyle = "#d94438"; ctx.fillRect(0, -g.radius, BRECHER_STRECKE, g.radius * 2);
    ctx.globalAlpha = 0.7; ctx.strokeStyle = "#ff7a60"; ctx.strokeRect(0.5, -g.radius + 0.5, BRECHER_STRECKE, g.radius * 2 - 1);
    ctx.restore();
  } else if (g.nah && g.zustand === "ank") {                        // Nahschlag wie beim Zombie: kleiner roter Kreis
    ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = "#d94438"; ctx.beginPath(); ctx.arc(g.x - camX, g.y - camY - 6, (g.reich || 44) + 6, g.blick - 0.9, g.blick + 0.9); ctx.lineTo(g.x - camX, g.y - camY - 6); ctx.fill(); ctx.restore();
  } else if (g.art === "schildtraeger" && g.zustand === "ank") {
    ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = "#d94438"; ctx.beginPath(); ctx.moveTo(g.x - camX, g.y - camY - 12);
    ctx.arc(g.x - camX, g.y - camY - 12, (g.reich || 40), g.blick - 0.8, g.blick + 0.8); ctx.closePath(); ctx.fill(); ctx.restore();
  }
}

// ---- Tuer (karte.js TUER; hier statt in raeume.js, weil SPRITES erst nach raeume.js geladen wird): Rahmen in der Wandoeffnung, Tuerfluegel offen an die Wand geschwenkt ------------
SPRITES.tuer = {
  groesse: { b: KACHEL, h: KACHEL }, anker: { ax: 0, ay: 0 },
  zeichnen: function (ctx, sx, sy, info) {
    var holz = "#4a3320", hell = "#6a4a2e", eisen = "#2a2a30", K = KACHEL;
    if (info.nordSued) {                                           // Wand verlaeuft O-W, Durchgang N-S
      rc(ctx, sx, sy + 10, K, 12, "rgba(0,0,0,0.22)"); rc(ctx, sx, sy + 10, K, 1, "rgba(255,255,255,0.12)");   // Schwelle
      if (info.wandL) { rc(ctx, sx, sy + 4, 6, 24, holz); rc(ctx, sx, sy + 4, 6, 2, hell); rc(ctx, sx + 6, sy + 6, 3, 18, "#7a5232"); rc(ctx, sx + 6, sy + 12, 3, 2, eisen); }
      if (info.wandR) { rc(ctx, sx + K - 6, sy + 4, 6, 24, holz); rc(ctx, sx + K - 6, sy + 4, 6, 2, hell); rc(ctx, sx + K - 9, sy + 6, 3, 18, "#7a5232"); rc(ctx, sx + K - 9, sy + 12, 3, 2, eisen); }
      rc(ctx, sx, sy + 3, K, 3, holz);                              // Sturz
    } else {                                                        // Wand verlaeuft N-S, Durchgang O-W
      rc(ctx, sx + 10, sy, 12, K, "rgba(0,0,0,0.22)"); rc(ctx, sx + 10, sy, 1, K, "rgba(255,255,255,0.12)");
      if (info.wandO) { rc(ctx, sx + 4, sy, 24, 6, holz); rc(ctx, sx + 4, sy, 2, 6, hell); rc(ctx, sx + 6, sy + 6, 18, 3, "#7a5232"); rc(ctx, sx + 12, sy + 6, 2, 3, eisen); }
      if (info.wandU) { rc(ctx, sx + 4, sy + K - 6, 24, 6, holz); rc(ctx, sx + 4, sy + K - 6, 2, 6, hell); rc(ctx, sx + 6, sy + K - 9, 18, 3, "#7a5232"); rc(ctx, sx + 12, sy + K - 9, 2, 3, eisen); }
      rc(ctx, sx + 3, sy, 3, K, holz);
    }
  }
};
