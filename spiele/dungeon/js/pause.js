// pause.js — Pausemenue (P oder Esc) und Spielende. Im Dorf und im Dungeon:
// Weiter, Fertigkeiten, Zurueck ins Dorf (nur im Dungeon), Zum Titelbild, Spiel beenden.
// Bedienung: W/S oder Pfeile + Enter, oder Mausklick. Kein Modul; globale Funktionen.
// Ein Browser-Tab laesst sich nur schliessen, wenn das Skript ihn geoeffnet hat — darum
// versucht "Spiel beenden" window.close() und zeigt sonst einen Abschiedsbildschirm (phase "ende").

function pauseListe(z) {
  var l = [{ id: "weiter", txt: "Weiter" }, { id: "skills", txt: "Fertigkeiten  (K)" }];
  if (z.phase === "dungeon") l.push({ id: "dorf", txt: "Zurück ins Dorf  (R)" });
  l.push({ id: "titel", txt: "Zum Titelbild" }, { id: "ende", txt: "Spiel beenden" });
  return l;
}
function pauseRect(i) { return { x: 330, y: 238 + i * 52, w: 300, h: 42 }; }

function pauseAktion(z, id) {
  z.pause = false;
  if (id === "skills") z.skillOffen = true;
  else if (id === "dorf") insDorf();
  else if (id === "titel") { fortschrittSpeichern(); insTitel(); }
  else if (id === "ende") spielBeenden(z);
}

// Ein Schritt bei offenem Menue (nach P/Esc-Umschalten in spiel.js).
function pauseSchritt(z, fl, mx, my, klick) {
  var l = pauseListe(z), n = l.length, i;
  z.pauseWahl = Math.max(0, Math.min(n - 1, z.pauseWahl || 0));
  if (fl.w || fl.arrowup) z.pauseWahl = (z.pauseWahl + n - 1) % n;
  if (fl.s || fl.arrowdown) z.pauseWahl = (z.pauseWahl + 1) % n;
  if (klick) for (i = 0; i < n; i++) {
    var r = pauseRect(i);
    if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) { pauseAktion(z, l[i].id); return; }
  }
  if (fl.enter || fl[" "] || fl.e) pauseAktion(z, l[z.pauseWahl].id);
}

function spielBeenden(z) {
  fortschrittSpeichern();                                // Fortschritt liegt im Browser; Spielstand setzt das Dorf (speicher.js)
  z.phase = "ende"; z.dialog = null; z.hinweis = ""; z.skillOffen = false; z.invOffen = false; z.pause = false;
  try { window.close(); } catch (e) {}                   // klappt nur bei Skript-geoeffnetem Tab; sonst bleibt der Abschiedsbildschirm
}

function zeichnePause(ctx, b, h, z) {
  var l = pauseListe(z), i, mausDrin = -1;
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.62)"; ctx.fillRect(0, 0, b, h);
  ctx.textAlign = "center";
  ctx.fillStyle = "#e8e0c0"; ctx.font = "44px Georgia, serif"; ctx.fillText("PAUSE", b / 2, 190);
  for (i = 0; i < l.length; i++) {
    var r = pauseRect(i), sel = i === (z.pauseWahl || 0);
    if (MAUS.x >= r.x && MAUS.x <= r.x + r.w && MAUS.y >= r.y && MAUS.y <= r.y + r.h) mausDrin = i;
    metallBox(ctx, r.x, r.y, r.w, r.h);
    if (sel || mausDrin === i) { ctx.fillStyle = "rgba(200,168,96,0.22)"; ctx.fillRect(r.x + 3, r.y + 3, r.w - 6, r.h - 6); }
    ctx.fillStyle = sel ? "#ffe08a" : (l[i].id === "ende" ? "#d89a8a" : "#cfc8b0"); ctx.font = "20px Georgia, serif";
    ctx.fillText(l[i].txt, b / 2, r.y + 28);
  }
  ctx.fillStyle = "#7d7660"; ctx.font = "13px Georgia, serif";
  ctx.fillText("W / S oder Maus  ·  Enter wählt  ·  P oder Esc geht weiter", b / 2, 238 + l.length * 52 + 18);
  ctx.restore();
}

// Abschiedsbildschirm nach "Spiel beenden".
function zeichneEnde(ctx, b, h) {
  ctx.fillStyle = "#050507"; ctx.fillRect(0, 0, b, h);
  ctx.save(); ctx.textAlign = "center";
  ctx.fillStyle = "#e8d9a4"; ctx.font = "54px Georgia, serif"; ctx.fillText(SPIELTITEL.split("").join(" "), b / 2, 250);
  ctx.fillStyle = "#a89a78"; ctx.font = "italic 22px Georgia, serif"; ctx.fillText("Bis zum nächsten Mal. Dein Fortschritt ist gespeichert.", b / 2, 305);
  ctx.fillStyle = "#7d7660"; ctx.font = "16px Georgia, serif";
  ctx.fillText("Du kannst diesen Tab jetzt schließen.", b / 2, 360);
  ctx.fillStyle = "#cfc8b0"; ctx.fillText("Enter  —  zurück zum Titelbild", b / 2, 410);
  ctx.restore();
}
