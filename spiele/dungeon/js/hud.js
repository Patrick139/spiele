// hud.js — Anzeigen ueber dem Bild: Lebens-/Ausdauerkugel, Faehigkeitsleiste,
// Ortsschild, Hinweise, Ebenen-Banner, Vignette, Trefferrand.

function metallBox(ctx, x, y, w, h) {
  var g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "rgba(34,28,22,0.9)"); g.addColorStop(1, "rgba(12,10,9,0.9)");
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#7a6a44"; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  kr(ctx, x + 2, y + 2, 1.6, "#b8a574"); kr(ctx, x + w - 2, y + 2, 1.6, "#b8a574");
  kr(ctx, x + 2, y + h - 2, 1.6, "#b8a574"); kr(ctx, x + w - 2, y + h - 2, 1.6, "#b8a574");
}

// Zwei Kugeln unten wie in Diablo 1: links Leben (rot), rechts Mana (blau).
// Ausdauer ist KEINE Kugel: gelb-gruener Balken ueber der Faehigkeitsleiste (zeichneAusdauer).
function zeichneKugeln(ctx, breite, hoehe, sp) {
  var r = 46;
  function kugel(cx, cy, anteil, oben, unten, titel, text, markierung) {
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
    ctx.fillStyle = "#0c0c10";                         // leere Kugel
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    var fuell = cy + r - r * 2 * Math.max(0, Math.min(1, anteil));
    var grad = ctx.createLinearGradient(0, fuell, 0, cy + r);
    grad.addColorStop(0, oben); grad.addColorStop(1, unten);
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, fuell, r * 2, cy + r - fuell);
    ctx.fillStyle = "rgba(255,255,255,0.18)";          // Wellenlinie an der Oberkante
    ctx.fillRect(cx - r, fuell, r * 2, 2);
    var sh = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, 2, cx, cy, r);
    sh.addColorStop(0, "rgba(255,255,255,0.22)"); sh.addColorStop(0.5, "rgba(255,255,255,0)"); sh.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = sh; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    if (markierung) {                                  // Kosten des gewaehlten Zaubers als Strich
      var my = cy + r - r * 2 * Math.min(1, markierung);
      ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillRect(cx - r, my - 1, r * 2, 2);
    }
    ctx.restore();
    ctx.strokeStyle = "#8a7a50"; ctx.lineWidth = 3;    // Metallrand
    ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, TAU); ctx.stroke();
    ctx.strokeStyle = "#2a2318"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, r + 3, 0, TAU); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.fillStyle = "#a89a70"; ctx.font = "italic 12px Georgia, serif";   // Titel ueber der Kugel
    ctx.fillText(titel, cx, cy - r - 8);
    ctx.shadowColor = "rgba(0,0,0,0.9)"; ctx.shadowBlur = 4;              // Zahl IN der Kugel (unterhalb des Randes war sie ausserhalb des Bildes)
    ctx.fillStyle = "#f4ecd0"; ctx.font = "bold 14px Georgia, serif";
    ctx.fillText(text, cx, cy + 5);
    ctx.shadowBlur = 0; ctx.textAlign = "left";
  }
  var cy = hoehe - 56;
  kugel(60, cy, sp.leben / sp.lebenMax, "#e0503f", "#5e1a12", "Leben", sp.leben + " / " + sp.lebenMax, 0);
  var nk = (sp.skills && sp.skills.gewaehlt === "nova") ? NOVA_KOSTEN / sp.manaMax : 0;
  kugel(breite - 60, cy, sp.mana / sp.manaMax, "#4a7ae0", "#142a62", "Mana", Math.floor(sp.mana) + " / " + sp.manaMax, nk);
}

// Ausdauer: schmaler Balken in der Mitte ueber der Leiste (gelb, wird rot wenn der Ausweichschritt fehlt).
function zeichneAusdauer(ctx, breite, hoehe, sp) {
  var w = 170, h = 8, x = breite / 2 - w / 2, y = hoehe - 84, a = Math.max(0, Math.min(1, sp.ausdauer / sp.ausdauerMax));
  ctx.save();
  rc(ctx, x - 1, y - 1, w + 2, h + 2, "#2a2318"); rc(ctx, x, y, w, h, "#14110c");
  var knapp = sp.ausdauer < DODGE_KRAFT;
  rc(ctx, x, y, w * a, h, knapp ? "#b0583a" : "#c8b83a");
  rc(ctx, x, y, w * a, 2, "rgba(255,255,255,0.25)");
  ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(x + w * Math.min(1, DODGE_KRAFT / sp.ausdauerMax) - 1, y - 2, 2, h + 4);   // Kosten Ausweichschritt
  ctx.fillStyle = "#cfc59a"; ctx.font = "11px Georgia, serif"; ctx.textAlign = "center";
  ctx.fillText("Ausdauer " + Math.round(sp.ausdauer) + " / " + sp.ausdauerMax, breite / 2, y - 5);
  ctx.restore();
  baerHud(ctx, breite, hoehe, sp);                       // Restzeit der Baerengestalt (baer.js)
}

// Faehigkeitsleiste unten in der Mitte (nur Anzeige, mit Abklingzeit-Schleier).
function zeichneLeiste(ctx, breite, hoehe, sp) {
  var slots = [
    { taste: "LMB", name: "Kombo", cd: 0, icon: function (x, y) { for (var i = 0; i < 3; i++) lin(ctx, x - 9 + i * 6, y + 8, x - 3 + i * 6, y - 8, "#d6dbe6", 2); } },
    { taste: "RMB", name: "Wurf", cd: sp.axtT > 0 ? sp.axtT / (sp.axtAb || AXT_ABKLING) : 0,
      icon: function (x, y) { lin(ctx, x - 7, y + 7, x + 6, y - 6, "#7a5a34", 2.4); poly(ctx, [x + 2, y - 10, x + 10, y - 6, x + 6, y + 2], "#c4cbd8"); } },
    { taste: "Leer", name: "Ausweichen", cd: sp.dodgeCd > 0 ? sp.dodgeCd / DODGE_ABKLING : (sp.ausdauer < DODGE_KRAFT ? 1 : 0),
      icon: function (x, y) { lin(ctx, x - 9, y, x + 8, y, "#9ec4ff", 2.4); poly(ctx, [x + 11, y, x + 4, y - 5, x + 4, y + 5], "#9ec4ff"); } }
  ];
  var sel = sp.skills && sp.skills.gewaehlt;             // gewaehlte Faehigkeit (klassen.js)
  if (sel === "nova") slots[1] = novaSlot(ctx, sp);       // zauber.js: Nova statt Wurf
  else if (sel && sel !== "axt") slots[1] = skillSlot(ctx, sp);  // Klassen-Faehigkeit
  var w = 46, gap = 8, x0 = breite / 2 - (slots.length * w + (slots.length - 1) * gap) / 2, y0 = hoehe - 62;
  for (var i = 0; i < slots.length; i++) {
    var s = slots[i], x = x0 + i * (w + gap);
    metallBox(ctx, x, y0, w, w);
    s.icon(x + w / 2, y0 + w / 2 - 3);
    if (s.cd > 0) { ctx.fillStyle = "rgba(0,0,0,0.62)"; ctx.fillRect(x + 3, y0 + 3 + (w - 6) * (1 - Math.min(1, s.cd)), w - 6, (w - 6) * Math.min(1, s.cd)); }
    if (i === 1 || s.hinweis) {                          // nur die rechte-Maustaste-Belegung beschriften (sonst ueberlappen die Zeilen)
      var beschr = s.hinweis || (s.kosten ? s.name + "  ·  " + s.kosten : s.name);
      ctx.fillStyle = s.hinweis ? "#c88a8a" : "#a89a70"; ctx.font = "11px Georgia, serif"; ctx.textAlign = "center"; ctx.fillText(beschr, x + w / 2, y0 - 5); ctx.textAlign = "left";
    }
    ctx.fillStyle = "#a89a70"; ctx.font = "10px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText(s.taste, x + w / 2, y0 + w - 4); ctx.textAlign = "left";
  }
  ctx.fillStyle = "#7d7660"; ctx.font = "11px Georgia, serif"; ctx.textAlign = "center";
  ctx.fillText("Q  Trank trinken (in der Nähe)  ·  P Pause  ·  K Fertigkeiten  ·  I Ausrüstung  ·  R Dorf" + (skillRoster(zustand).length > 1 ? "  ·  1 bis 9 / Mausrad: Faehigkeit" : ""), breite / 2, hoehe - 6); ctx.textAlign = "left";
}

// Ortsschild oben links, Hinweiszeile, Banner, Pause.
function zeichneHud(ctx, breite, hoehe, z) {
  var dorf = z.phase === "dorf";
  var titel = dorf ? "Hollenfurt" : (z.ebene.kammer ? KAMMER_NAME[0] :
              "Ebene " + z.ebenenNr + " / " + EBENEN_MAX + "  ·  " + EBENEN_NAMEN[z.ebenenNr - 1][0]);
  ctx.save();
  ctx.font = "16px Georgia, serif"; ctx.textBaseline = "middle";
  var bw = Math.max(210, ctx.measureText(titel).width + 40);
  metallBox(ctx, 10, 10, bw, 40);
  ctx.fillStyle = "#e0d19a"; ctx.fillText(titel, 24, 26);
  ctx.fillStyle = "#8a8368"; ctx.font = "11px Georgia, serif";
  ctx.fillText(z.spieler.held.name + "  ·  Stufe " + fp().stufe + (dorf ? "" : "  ·  Tötungen " + z.toetungen), 24, 42);
  zeichneXpBalken(ctx, 10, 54, bw, z);
  if (z.hinweis) {
    ctx.font = "17px Georgia, serif"; ctx.textAlign = "center";
    var tw = ctx.measureText(z.hinweis).width + 30;
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(breite / 2 - tw / 2, hoehe - 126, tw, 28);
    ctx.fillStyle = "#f0e6b8"; ctx.fillText(z.hinweis, breite / 2, hoehe - 112);
  }
  if (z.banner && z.banner.t > 0) {                      // Titel beim Betreten eines Ortes
    var t = z.banner.t, a = Math.min(1, (z.banner.dauer - t) / 0.8, t / 1.2);
    ctx.globalAlpha = Math.max(0, a); ctx.textAlign = "center";
    ctx.fillStyle = "#e6d79a"; ctx.font = "38px Georgia, serif"; ctx.fillText(z.banner.titel.split("").join(" "), breite / 2, 150);
    ctx.fillStyle = "#b9b196"; ctx.font = "italic 17px Georgia, serif"; ctx.fillText(z.banner.sub, breite / 2, 188);
    ctx.fillStyle = "#7a6a44"; ctx.fillRect(breite / 2 - 90, 166, 180, 1);
    if (z.banner.ziel) { ctx.fillStyle = "#c9a46a"; ctx.font = "15px Georgia, serif"; ctx.fillText(z.banner.ziel, breite / 2, 218); }
  }
  ctx.restore();
  if (z.pause) zeichnePause(ctx, breite, hoehe, z);          // Menue: pause.js
}

// Dunkle Raender (Vignette) und roter Rand nach einem Treffer.
function zeichneVignette(ctx, breite, hoehe, z) {
  var g = ctx.createRadialGradient(breite / 2, hoehe / 2, hoehe * 0.35, breite / 2, hoehe / 2, breite * 0.65);
  g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, breite, hoehe);
  if (z.blitzMs > 0) { ctx.fillStyle = "rgba(255,248,220," + Math.min(0.45, z.blitzMs / 0.22 * 0.45) + ")"; ctx.fillRect(0, 0, breite, hoehe); }   // Heiligenlicht
  if (z.blutMs > 0) {
    var b = ctx.createRadialGradient(breite / 2, hoehe / 2, hoehe * 0.3, breite / 2, hoehe / 2, breite * 0.6);
    b.addColorStop(0, "rgba(160,0,0,0)"); b.addColorStop(1, "rgba(160,10,10," + Math.min(0.5, z.blutMs / 320 * 0.5) + ")");
    ctx.fillStyle = b; ctx.fillRect(0, 0, breite, hoehe);
  }
}
