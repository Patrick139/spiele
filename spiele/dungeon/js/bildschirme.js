// bildschirme.js — Titel, Heldenwahl, Erzaehltext (Vollbild und Dialogbox), Tod, Blende.
// Der Erzaehler (dialogStart/dialogSchritt) ist eine Seitenfolge mit Schreibmaschine:
//   zustand.dialog = { seiten:[{wer,text}], i, n (sichtbare Zeichen), kulisse, fertig }
// kulisse = "prolog" | "kammer" -> Vollbild; null -> Box ueber dem Spielbild.

var TEXT_TEMPO = 70;   // Zeichen pro Sekunde

function umbruch(ctx, text, maxB) {
  var w = text.split(" "), zeilen = [], l = "";
  for (var i = 0; i < w.length; i++) {
    var t = l ? l + " " + w[i] : w[i];
    if (ctx.measureText(t).width > maxB && l) { zeilen.push(l); l = w[i]; } else l = t;
  }
  zeilen.push(l);
  return zeilen;
}

function dialogStart(seiten, kulisse, fertig) {
  zustand.dialog = { seiten: seiten, i: 0, n: 0, kulisse: kulisse || null, fertig: fertig || null,
                     seiteT: performance.now() / 1000 };
}

// weiter = Taste/Klick: erst Text vollschreiben, dann naechste Seite.
function dialogWaehle(d, w) {                 // Antwort gewaehlt: Reaktion einschieben, ggf. anderes Ende
  if (w.flag) zustand.wahlen.push(w.flag);
  if (w.fertig) d.fertig = w.fertig;
  d.seiten.splice.apply(d.seiten, [d.i + 1, 0].concat(w.antwort));
  d.i++; d.n = 0; d.seiteT = performance.now() / 1000;
}

function dialogSchritt(d, dt, weiter) {
  var s = d.seiten[d.i], len = s.text.length;
  if (d.n < len) { d.n = weiter ? len : d.n + TEXT_TEMPO * dt; return; }
  if (s.wahl) {                               // Auswahlseite: nur Tasten 1/2/3 gehen weiter
    for (var k = 0; k < s.wahl.length; k++) if (FL[String(k + 1)]) { dialogWaehle(d, s.wahl[k]); return; }
    return;
  }
  if (!weiter) return;
  d.i++; d.n = 0; d.seiteT = performance.now() / 1000;
  if (d.i >= d.seiten.length) { zustand.dialog = null; if (d.fertig) d.fertig(); }
}

function sprecherFarbe(wer) {
  if (wer === "") return "#d8cfa8";
  if (wer === PFANDHERR) return "#e8e4d8";          // freundlich, hell: das macht es schlimmer
  if (wer === FINSTER) return "#d9473a";
  if (wer === SCHATTEN) return "#9a6ad0";
  return wer.indexOf("Pfarrbuch") === 0 ? "#c9b27a" : "#ebd98c";
}

// Text mit Sprecher in einen Kasten (x, y, w, h). voll = true: ohne Rahmen (Vollbild).
function zeichneTextBlock(ctx, d, x, y, w, h, voll) {
  var s = d.seiten[d.i], rest = Math.floor(d.n), i;
  ctx.save();
  // Hoehe passt sich dem Text an (lange Pfarrbuchseiten): Kasten waechst nach oben.
  ctx.font = (s.wer === "" ? "italic " : "") + "19px Georgia, serif";
  var zl = umbruch(ctx, s.text, w - 48).length;
  var noetig = (s.wer ? 56 : 40) + zl * 27 + (s.wahl ? s.wahl.length * 26 + 14 : 0) + 34;
  if (noetig > h) { y -= noetig - h; h = noetig; }
  if (voll) {
    var g = ctx.createLinearGradient(0, y - 40, 0, y + h);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(0.25, "rgba(0,0,0,0.78)"); g.addColorStop(1, "rgba(0,0,0,0.9)");
    ctx.fillStyle = g; ctx.fillRect(0, y - 40, 960, h + 40);
  } else metallBox(ctx, x, y, w, h);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  var ty = y + (s.wer ? 56 : 40);
  if (s.wer) {
    ctx.fillStyle = sprecherFarbe(s.wer); ctx.font = "bold 18px Georgia, serif";
    ctx.fillText(s.wer, x + 24, y + 30);
  }
  ctx.font = (s.wer === "" ? "italic " : "") + "19px Georgia, serif";
  ctx.fillStyle = s.wer === "" ? "#d8cfa8" : "#ece6d2";
  var zeilen = umbruch(ctx, s.text, w - 48);
  for (i = 0; i < zeilen.length && rest > 0; i++) {
    ctx.fillText(zeilen[i].substr(0, rest), x + 24, ty + i * 27);
    rest -= zeilen[i].length + 1;
  }
  if (s.wahl && d.n >= s.text.length) {
    ctx.font = "17px Georgia, serif"; ctx.textAlign = "left";
    var oy = ty + zeilen.length * 27 + 10;
    for (var o = 0; o < s.wahl.length; o++) {
      ctx.fillStyle = "#a89a70"; ctx.fillText((o + 1) + "", x + 28, oy + o * 26);
      ctx.fillStyle = "#f0e6b8"; ctx.fillText(s.wahl[o].text, x + 52, oy + o * 26);
    }
  } else if (d.n >= s.text.length && Math.floor(performance.now() / 500) % 2 === 0) {
    ctx.fillStyle = "#a89a70"; ctx.font = "13px Georgia, serif"; ctx.textAlign = "right";
    ctx.fillText((d.i + 1) + " / " + d.seiten.length + "     Enter  ▼", x + w - 20, y + h - 12);
  }
  ctx.restore();
}

function zeichneKulisse(ctx, b, h, d) {
  if (d.kulisse === "kammer") {
    var fig = d.i >= 2 ? Math.min(1, (performance.now() / 1000 - (d.figT = d.figT || performance.now() / 1000)) / 2) : 0;
    zeichneKammer(ctx, b, h, fig);
  } else zeichneNachtbild(ctx, b, h, 0.25);
  var wa = d.seiten[d.i].wahl, bh = wa ? 190 + wa.length * 26 : 190;
  zeichneTextBlock(ctx, d, 130, 630 - bh, 700, bh, true);
}

function zeichneTitel(ctx, b, h) {
  zeichneNachtbild(ctx, b, h, 0);
  var vg = ctx.createRadialGradient(b / 2, h / 2, h * 0.3, b / 2, h / 2, b * 0.7);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = vg; ctx.fillRect(0, 0, b, h);
  ctx.save(); ctx.textAlign = "center";
  ctx.shadowColor = "rgba(255,70,40,0.7)"; ctx.shadowBlur = 24;
  ctx.fillStyle = "#e8d9a4"; ctx.font = "84px Georgia, serif";
  ctx.fillText(SPIELTITEL.split("").join(" "), b / 2, 140);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#a89a78"; ctx.font = "italic 22px Georgia, serif";
  ctx.fillText(UNTERTITEL, b / 2, 182);
  var plaetze = spielstandPlaetze(), letzte = spielstandInfo(), n = plaetze.filter(Boolean).length, zl = 0;
  if (n) {                                                        // je Held ein Platz: Zifferntaste, C = zuletzt gespielt
    ctx.fillStyle = "#a89a78"; ctx.font = "italic 16px Georgia, serif"; ctx.fillText("Spielstände", b / 2, h - 188);
    for (var i = 0; i < plaetze.length; i++) {
      var p = plaetze[i]; if (!p) continue;
      ctx.fillStyle = "#f0e6b8"; ctx.font = "20px Georgia, serif";
      ctx.fillText((i + 1) + "  —  " + p.name + "  ·  Stufe " + p.stufe + (p.tode ? "  ·  " + p.tode + (p.tode === 1 ? " Tod" : " Tode") : "") +
                   (p.held === letzte.held ? "   (C, zuletzt)" : ""), b / 2, h - 158 + zl * 28);
      zl++;
    }
  }
  if (Math.floor(performance.now() / 600) % 2 === 0) {
    ctx.fillStyle = "#f0e6b8"; ctx.font = "20px Georgia, serif";
    ctx.fillText(n ? "Enter  —  Neues Spiel (Heldenwahl)" : "Enter  —  Beginnen", b / 2, h - 52);
  }
  ctx.fillStyle = "#6a6450"; ctx.font = "14px Georgia, serif"; ctx.textAlign = "right";
  ctx.fillText("Q  —  Spiel beenden", b - 20, h - 18);
  ctx.restore();
}

function zeichneHeldenwahl(ctx, b, h) {
  zeichneNachtbild(ctx, b, h, 0.72);
  ctx.save(); ctx.textAlign = "center";
  ctx.fillStyle = "#e8d9a4"; ctx.font = "34px Georgia, serif"; ctx.fillText("Wer geht hinunter?", b / 2, 70);
  ctx.fillStyle = "#8a8368"; ctx.font = "italic 16px Georgia, serif";
  ctx.fillText("Jeder der drei sucht einen anderen Menschen. Der Weg ist derselbe.", b / 2, 98);
  for (var i = 0; i < HELDEN.length; i++) {
    var H = HELDEN[i], k = HELD_KARTEN[i], sel = i === HELD_AUSWAHL, cx = k.x + k.w / 2;
    ctx.globalAlpha = sel ? 1 : 0.7;
    metallBox(ctx, k.x, k.y - (sel ? 8 : 0), k.w, k.h);
    if (sel) { ctx.strokeStyle = "#f0d98a"; ctx.lineWidth = 2; ctx.strokeRect(k.x + 1, k.y - 7, k.w - 2, k.h - 2); ctx.lineWidth = 1; }
    var py = k.y + 170 - (sel ? 8 : 0);
    glut(ctx, cx, py - 50, 110, "255,190,110", sel ? 0.28 : 0.1);
    ctx.save(); ctx.translate(cx, py); ctx.scale(3.4, 3.4);
    heldZeichnen(ctx, 0, 0, { blick: Math.PI / 2 - 0.3, geht: false, gehT: 0, schlagAktiv: 0, kombo: 0, dodgeT: 0 }, H);
    ctx.restore();
    ctx.fillStyle = "#f0e6b8"; ctx.font = "bold 24px Georgia, serif"; ctx.fillText(H.name, cx, k.y + 214);
    ctx.fillStyle = "#a89a70"; ctx.font = "italic 15px Georgia, serif"; ctx.fillText(H.klasse + (zustand.fortschritt[i].stufe > 1 ? "  ·  Stufe " + zustand.fortschritt[i].stufe : ""), cx, k.y + 236);
    var werte = [["Leben", H.leben / 8], ["Tempo", (H.tempo - 110) / 80], ["Ausdauer", H.ausdauer / 140], ["Sicht", (H.licht + 160) / 240]];
    for (var s = 0; s < werte.length; s++) {
      var by = k.y + 258 + s * 17;
      ctx.textAlign = "left"; ctx.fillStyle = "#8a8368"; ctx.font = "12px Georgia, serif"; ctx.fillText(werte[s][0], k.x + 24, by + 9);
      rc(ctx, k.x + 100, by, 130, 8, "rgba(255,255,255,0.1)"); rc(ctx, k.x + 100, by, 130 * Math.min(1, werte[s][1]), 8, "#c8a860");
    }
    ctx.textAlign = "center"; ctx.fillStyle = "#cfc8b0"; ctx.font = "13px Georgia, serif";
    var z = umbruch(ctx, H.kurz, k.w - 40);
    for (var q = 0; q < z.length; q++) ctx.fillText(z[q], cx, k.y + 346 + q * 17);
    if (zustand.fortschritt && spielstandLesen(i)) { ctx.fillStyle = "#8ac88a"; ctx.font = "italic 13px Georgia, serif"; ctx.fillText("● Spielstand vorhanden", cx, k.y + 24); }
    ctx.fillStyle = "#d9665e"; ctx.font = "italic 14px Georgia, serif";
    var z2 = umbruch(ctx, "Sucht " + H.sucht + ".", k.w - 40);
    for (q = 0; q < z2.length; q++) ctx.fillText(z2[q], cx, k.y + 384 + q * 17);
  }
  ctx.globalAlpha = 1; ctx.fillStyle = "#a89a70"; ctx.font = "15px Georgia, serif";
  var hat = !!spielstandLesen(HELD_AUSWAHL);
  if (zustand.neuBestaetigt) { ctx.fillStyle = "#e08a7a"; ctx.fillText("Der Spielstand von " + HELDEN[HELD_AUSWAHL].name + " wird überschrieben. Enter noch einmal, Esc bricht ab.", b / 2, h - 36); }
  else ctx.fillText("A / D oder Pfeile wählen  ·  Enter " + (hat ? "Neues Spiel (überschreibt)  ·  C Weiterspielen" : "bestätigen") + "  ·  Esc zurück", b / 2, h - 36);
  ctx.restore();
}

// Bildschirm "GESTORBEN": Position und Farbe des Titels unveraendert (Tests).
function zeichneTod(ctx, breite, hoehe, z) {
  ctx.save();
  ctx.fillStyle = "rgba(20,0,0,0.72)";
  ctx.fillRect(0, 0, breite, hoehe);
  ctx.textAlign = "center";
  ctx.fillStyle = "#d84a3a";
  ctx.font = "44px Georgia, serif";
  ctx.fillText("GESTORBEN", breite / 2, hoehe / 2 - 50);
  ctx.fillStyle = "#d8c98a";
  ctx.font = "20px Georgia, serif";
  ctx.fillText("Ebene " + z.ebenenNr + "  ·  Tötungen: " + z.toetungen, breite / 2, hoehe / 2);
  ctx.fillStyle = "#b9b196"; ctx.font = "italic 18px Georgia, serif";
  ctx.fillText("Die Kerze von " + z.spieler.held.person + " ist ein Stück kürzer geworden.", breite / 2, hoehe / 2 + 40);
  ctx.fillStyle = "#9a937f"; ctx.font = "18px Georgia, serif";
  ctx.fillText("Enter / R  —  zurück ins Dorf", breite / 2, hoehe / 2 + 80);
  ctx.restore();
}

function zeichneBlende(ctx, b, h, z) {
  if (z.blendeT > 0) { ctx.fillStyle = "rgba(0,0,0," + Math.min(1, z.blendeT / 0.7) + ")"; ctx.fillRect(0, 0, b, h); }
}
