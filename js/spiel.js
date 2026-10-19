// spiel.js — Ablauf: Menues, Verbinden, Runde (Zaehler, Spiel, Ende), Nachrichten zwischen den Handys, Hauptschleife.
// Nachrichten (JSON): h = Hallo mit Namen, s = Start mit Zufallswert, b = Abbild des Felds (alle 0,1 s), e = Eier senden,
// d = ich bin raus, r = noch eine Runde, x = ich gehe. Kein Modul; nutzt tetris.js, render.js, sound.js, input.js, verbindung.js.

var ZAEHLER_DUELL = 3.0, ZAEHLER_ALLEIN = 1.5;      // s Vorlauf vor der Runde
var SENDE_TAKT = 0.066;                               // s zwischen zwei Feld-Abbildern

var S = {
  s: null, g: null, modus: null, phase: "aus", zahl: 0, zahlLetzte: 99, sendT: 0, totZeit: 0, ende: null,
  name: "Du", variante: "eier", wahl: "eier", hintStart: 0, gegnerName: "Freund", fpsZ: 0, fpsAn: false, fpsMittel: 16, nochmalIch: false, nochmalEr: false, gestartet: false, eingefroren: false, test: /[?&]test/.test(location.search)
};

function el(id) { return document.getElementById(id); }
function zeige(id) {
  var alle = document.querySelectorAll(".schirm");
  for (var i = 0; i < alle.length; i++) alle[i].classList.add("weg");
  if (id) el(id).classList.remove("weg");
  var imSpiel = !id;
  el("steuer").classList.toggle("weg", !imSpiel);
  el("kopf").classList.toggle("weg", !imSpiel);
}
function nameLesen() {
  var n = (el("name").value || "").trim().slice(0, 12) || "Du";
  S.name = n; try { localStorage.setItem("sammlung_name", n); } catch (e) {}
  return n;
}
function schlafen(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }

// ---- Runde ------------------------------------------------------------------------------------
function neueRunde(seed, modus, variante) {
  S.variante = modus === "duell" && variante === "wurf" ? "wurf" : "eier";
  S.modus = modus; S.s = tNeu(seed); S.ende = null; S.nochmalIch = S.nochmalEr = false; S.totZeit = 0; S.sendT = 0;
  S.g = modus === "duell" ? { abbild: new Array(T_B * T_H + 1).join("0"), eier: 0, tot: false, name: S.gegnerName } : null;
  if (S.variante === "wurf") tTorStart(S.s);
  ZEICH.setWurf(S.variante === "wurf"); S.hintStart = ZEICH.zeit;
  FX.reset(); INPUT.stopp(); INPUT.start(S.s); INPUT.aktiv = false;
  S.zahl = modus === "duell" ? ZAEHLER_DUELL : ZAEHLER_ALLEIN; S.zahlLetzte = 99; S.phase = "zahl";
  S.gestartet = true;
  zeige(null);
  el("endeKnopf").classList.remove("weg");
}

function ereignisseAbarbeiten() {
  var s = S.s, i;
  for (i = 0; i < s.ev.length; i++) { FX.ereignis(s.ev[i], s); SOUND.ereignis(s.ev[i]); }
  s.ev.length = 0;
  while (s.ausgehend.length) {                                          // Eier an den Freund
    var n = s.ausgehend.shift();
    if (S.modus === "duell") VERB.senden({ t: "e", n: n, l: Math.floor(Math.random() * T_B) });
  }
  while (s.ausgehendSteine.length) {                                    // Steine fuer den Freund (Ruebergeben)
    var w = s.ausgehendSteine.shift();
    if (S.modus === "duell") VERB.senden({ t: "w", ty: w.typ, r: w.rot });
  }
}

function runde_ende(art) {                    // art: "verloren" | "gewonnen" | "remis" | "abbruch"
  if (S.ende) return;
  S.ende = { art: art, t: 0 }; S.phase = "ende"; INPUT.stopp();
  if (art === "gewonnen") { SOUND.ereignis({ art: "sieg" }); S.s.gewonnen = true; }
  if (S.modus === "allein") {
    var hs = 0; try { hs = parseInt(localStorage.getItem("tetris_hs") || "0", 10) || 0; } catch (e) {}
    S.ende.neuerRekord = S.s.punkte > hs; if (S.ende.neuerRekord) { try { localStorage.setItem("tetris_hs", String(S.s.punkte)); } catch (e) {} }
    S.ende.rekord = Math.max(hs, S.s.punkte);
  }
  S.ende.verzoegerung = art === "verloren" ? 1.1 : 0.9;
}
function endeZeigen() {
  var s = S.s, e = S.ende, t = el("endeTitel"), z = el("endeZahlen");
  t.className = e.art === "gewonnen" ? "sieg" : (e.art === "verloren" ? "nieder" : "");
  t.textContent = { gewonnen: "GEWONNEN!", verloren: S.modus === "allein" ? "Geschafft!" : "Verloren", remis: "Unentschieden", abbruch: "Verbindung weg" }[e.art];
  var zeilen = [["Punkte", s.punkte], ["Zeilen", s.linien], ["Stufe", s.level]];
  if (S.modus === "duell") zeilen.push(["Eier gelegt", s.eierGelegt], ["Eier bekommen", s.eierErhalten]);
  if (S.variante === "wurf") zeilen.push(["Steine geworfen", s.gewuerfe], ["Steine bekommen", s.steineErhalten]);
  else zeilen.push(["Rekord", e.rekord + (e.neuerRekord ? "  (neu!)" : "")]);
  z.innerHTML = zeilen.map(function (q) { return "<span>" + q[0] + "</span><b>" + q[1] + "</b>"; }).join("");
  el("endeStatus").textContent = "";
  el("bNochmal").classList.toggle("weg", e.art === "abbruch");
  zeige("ende");
}

// ---- Nachrichten ----------------------------------------------------------------------------------
VERB.aufStatus = function (st) {
  if (st === "offen") {
    VERB.senden({ t: "h", n: S.name });
  } else if (st === "zu" || st === "fehler") {
    if (S.modus === "duell" && S.phase !== "ende" && S.phase !== "aus") { runde_ende("abbruch"); }
    else if (S.modus === "duell" && S.phase === "ende") { el("endeStatus").textContent = "Der Freund ist weg."; }
    else if (!S.gestartet) { el("zeigStatus").textContent = st === "fehler" ? "Verbindung fehlgeschlagen — sind beide im selben WLAN?" : ""; }
  }
};
VERB.aufNachricht = function (m) {
  if (m.t === "h") {
    S.gegnerName = String(m.n || "Freund").slice(0, 12);
    if (S.gegnerName === S.name) S.gegnerName = "Freund";            // zwei gleiche Namen sind verwirrend
    if (VERB.rolle === "host" && S.phase === "aus") startDuell();
  } else if (m.t === "s") {
    if (VERB.rolle === "gast") neueRunde(m.seed >>> 0, "duell", m.v);
  } else if (m.t === "b") {
    if (S.g) { S.g.abbild = String(m.a || S.g.abbild); S.g.eier = m.e | 0; }
  } else if (m.t === "w") {
    if (S.s && S.phase === "lauf") tSteinKommt(S.s, String(m.ty), m.r);
  } else if (m.t === "e") {
    if (S.s && S.phase === "lauf") tEierKommen(S.s, Math.max(1, Math.min(20, m.n | 0)), Math.max(0, Math.min(T_B - 1, m.l | 0)));
  } else if (m.t === "d") {
    if (S.g) S.g.tot = true;
    if (S.phase === "lauf" || S.phase === "zahl") runde_ende("gewonnen");
    else if (S.ende && S.ende.art === "verloren" && performance.now() - S.totZeit < 800) S.ende.art = "remis";
  } else if (m.t === "r") {
    S.nochmalEr = true; pruefeNochmal();
    if (S.phase === "ende") el("endeStatus").textContent = S.gegnerName + " will noch eine Runde.";
  } else if (m.t === "x") {
    if (S.phase !== "ende") runde_ende("abbruch"); else el("endeStatus").textContent = S.gegnerName + " ist gegangen.";
  }
};
function startDuell() {                            // nur der Gastgeber
  var seed = (Math.random() * 4294967296) >>> 0;
  VERB.senden({ t: "s", seed: seed, v: S.wahl });
  neueRunde(seed, "duell", S.wahl);
}
function pruefeNochmal() {
  if (VERB.rolle === "host" && S.nochmalIch && S.nochmalEr) { S.nochmalIch = S.nochmalEr = false; startDuell(); }
}

// ---- Menues ----------------------------------------------------------------------------------------
async function hostEroeffnen() {
  nameLesen(); S.gestartet = false; S.phase = "aus"; S.modus = "duell";
  el("zeigTitel").textContent = "Dein Spielcode";
  el("zeigHinweis").textContent = "Der Freund scannt diesen Code (mit „Beitreten“ im Spiel oder einfach mit der Handy-Kamera). Danach zeigt sein Handy einen Code — den scannst du.";
  el("zeigText").value = ""; el("qrWarte").classList.remove("weg"); el("qrWarte").textContent = "Wird vorbereitet …";
  el("bWeiter").classList.add("weg"); el("zeigStatus").textContent = "";
  zeige("zeigen");
  try {
    if (!S.test) await Promise.race([VERB.kameraFreischalten(), schlafen(7000)]);
    var code = await VERB.hostStart();
    el("zeigText").value = code; VERB.qrZeichnen(el("qr"), VERB.alsLink(code), 300);
    el("qrWarte").classList.add("weg"); el("bWeiter").classList.remove("weg");
    el("zeigStatus").textContent = "Code: " + code.length + " Zeichen";
  } catch (e) { el("qrWarte").textContent = "Fehler: " + e.message; }
}
function einlesenZeigen(titel, hinweis, aufCode) {
  el("einTitel").textContent = titel; el("einHinweis").textContent = hinweis; el("einText").value = ""; el("einStatus").textContent = "";
  S.einAuf = aufCode; el("videoBox").classList.add("weg"); el("bUebernehmen").classList.remove("weg");
  el("bKamera").classList.toggle("weg", !VERB.scannerMoeglich());
  zeige("einlesen");
  if (VERB.scannerMoeglich() && !S.test && !S.ohneKamera) kameraStarten();
}
async function kameraStarten() {
  el("einStatus").textContent = "Kamera wird gestartet …";
  try {
    el("videoBox").classList.remove("weg"); el("bKamera").classList.add("weg");
    await VERB.scannen(el("video"), function (text) { VERB.scanStopp(); el("einText").value = text; einUebernehmen(); });
    el("einStatus").textContent = "Halte die Kamera auf den Code des anderen Handys.";
  } catch (e) { el("videoBox").classList.add("weg"); el("bKamera").classList.remove("weg"); el("einStatus").textContent = "Kamera nicht verfügbar — Code einfügen geht auch."; }
}
async function einUebernehmen() {
  var text = el("einText").value.trim();
  if (!text) { el("einStatus").textContent = "Noch kein Code."; return; }
  el("einStatus").textContent = "Wird geprüft …";
  try { VERB.scanStopp(); await S.einAuf(text); } catch (e) { el("einStatus").textContent = e.message || String(e); }
}
function hostWeiter() {
  einlesenZeigen("Code vom Freund einlesen", "Scanne den Code auf dem Handy deines Freundes.", async function (text) {
    await VERB.hostAntwort(text);
    el("einStatus").textContent = "Verbinde …";
    // Weiter geht es, sobald der Kanal offen ist (aufStatus) -> "h" -> startDuell
  });
}
function gastBeitreten() {
  nameLesen(); S.gestartet = false; S.phase = "aus"; S.modus = "duell";
  einlesenZeigen("Beitreten", "Scanne den Code vom Handy des Gastgebers.", async function (text) {
    var antwort = await VERB.gastAnnehmen(text);
    el("zeigTitel").textContent = "Dein Antwortcode";
    el("zeigHinweis").textContent = "Zeig diesen Code dem Gastgeber — er scannt ihn jetzt.";
    el("zeigText").value = antwort; VERB.qrZeichnen(el("qr"), VERB.alsLink(antwort), 300); el("qrWarte").classList.add("weg");
    el("bWeiter").classList.add("weg"); el("zeigStatus").textContent = "Warte auf den Gastgeber …";
    zeige("zeigen");
  });
}
function wurfVersuch() {                          // ▶ an der Wand: Stein ueber das Tor zum Freund
  var s = S.s;
  if (!s || !s.tor || S.phase !== "lauf" || !tWurfMoeglich(s)) return;
  if (S.g && !S.g.tot && /[^0]/.test(S.g.abbild.slice(0, 2 * T_B))) {   // sein Feld reicht bis oben: dort ist kein Platz fuer den Stein
    FX.text("Sein Feld ist zu voll", ZEICH.lay.bx + 5 * ZEICH.lay.c, ZEICH.lay.by + 5 * ZEICH.lay.c, "#ff9aa8", 24); return;
  }
  tWurf(s);
}
function insMenue() {
  ZEICH.setWurf(false);
  if (S.modus === "duell" && VERB.offen) VERB.senden({ t: "x" });
  VERB.scanStopp(); VERB.schliessen(); INPUT.stopp();
  S.phase = "aus"; S.modus = null; S.gestartet = false; S.s = null; S.g = null; S.ende = null;
  zeige("menu");
}

function einrichten() {
  try { var n = localStorage.getItem("sammlung_name"); if (n) el("name").value = n; } catch (e) {}
  el("kTetris").onclick = function () { SOUND.start(); zeige("tmenu"); };
  el("bZurueck1").onclick = function () { zeige("menu"); };
  el("bAllein").onclick = function () { SOUND.start(); nameLesen(); neueRunde((Math.random() * 4294967296) >>> 0, "allein"); };
  var modus = function (v) { S.wahl = v; el("mEier").classList.toggle("an", v === "eier"); el("mWurf").classList.toggle("an", v === "wurf");
    el("modiText").textContent = v === "wurf" ? "Beide Felder nebeneinander. Ein Tor in der Wand öffnet sich: Stein dagegen schieben, und er kommt beim Freund als nächster Stein." : "Zeilen räumen legt dem Freund Eier ins Feld."; };
  el("mEier").onclick = function () { modus("eier"); }; el("mWurf").onclick = function () { modus("wurf"); };
  INPUT.aufWurf = wurfVersuch;
  el("bHost").onclick = function () { SOUND.start(); hostEroeffnen(); };
  el("bGast").onclick = function () { SOUND.start(); gastBeitreten(); };
  el("bWeiter").onclick = hostWeiter;
  el("bZurueck2").onclick = function () { VERB.schliessen(); zeige("tmenu"); };
  el("bZurueck3").onclick = function () { VERB.scanStopp(); VERB.schliessen(); zeige("tmenu"); };
  el("bUebernehmen").onclick = einUebernehmen;
  el("bKamera").onclick = kameraStarten;
  el("bKopieren").onclick = function () { var t = el("zeigText"); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand("copy"); } el("zeigStatus").textContent = "Kopiert."; };
  el("bTeilen").onclick = function () { var t = el("zeigText").value; if (navigator.share) navigator.share({ text: t }).catch(function () {}); else el("bKopieren").onclick(); };
  el("bNochmal").onclick = function () {
    if (S.modus === "allein") { neueRunde((Math.random() * 4294967296) >>> 0, "allein"); return; }
    S.nochmalIch = true; VERB.senden({ t: "r" });
    el("endeStatus").textContent = S.nochmalEr ? "Los geht's …" : "Warte auf " + S.gegnerName + " …";
    pruefeNochmal();
  };
  el("bMenue").onclick = insMenue;
  el("endeKnopf").onclick = function () { if (S.phase === "lauf" && S.modus === "duell" && !confirm("Runde verlassen? Das zählt als verloren.")) return; if (S.phase === "lauf" && S.modus === "duell") { VERB.senden({ t: "d" }); } insMenue(); };
  el("tonKnopf").onclick = function () { SOUND.an = !SOUND.an; el("tonKnopf").style.opacity = SOUND.an ? 1 : 0.4; SOUND.start(); };
  INPUT.aufAktion = function (a) {
    if (a === "fps") { S.fpsAn = !S.fpsAn; el("fps").classList.toggle("weg", !S.fpsAn); return; }                         // Esc / P: allein pausieren, im Duell nichts (die Runde laeuft weiter)
    if (a === "pause" && S.modus === "allein" && (S.phase === "lauf" || S.phase === "pause")) {
      if (S.phase === "lauf") { S.phase = "pause"; INPUT.stopp(); } else { S.phase = "lauf"; INPUT.start(S.s); }
    }
  };
  INPUT.einrichten(el("cv"));
  el("cv").addEventListener("pointerdown", function () { if (S.phase === "pause") INPUT.aufAktion("pause"); });
  document.addEventListener("visibilitychange", function () { if (document.hidden && S.modus === "allein" && S.phase === "lauf") INPUT.aufAktion("pause"); });   // allein: beim Wegwischen pausieren
  ZEICH.init(el("cv"));
  zeige("menu");
}

// ---- Hauptschleife ----------------------------------------------------------------------------------
function aktualisieren(dt) {
  var s = S.s;
  if (!s) return;
  if (S.phase === "zahl") {
    S.zahl -= dt;
    var ganz = Math.ceil(S.zahl);
    if (ganz < S.zahlLetzte && ganz >= 1) { SOUND.ereignis({ art: "zahl", letzte: ganz === 1 }); S.zahlLetzte = ganz; }
    if (S.zahl <= 0) { S.phase = "lauf"; INPUT.start(s); }
  } else if (S.phase === "lauf") {
    INPUT.schritt(dt, s); tSchritt(s, dt);
    if (s.tor) tTorSchritt(s, dt);
    ereignisseAbarbeiten();
    if (S.modus === "duell") {
      S.sendT += dt;
      if (S.sendT >= SENDE_TAKT) { S.sendT = 0; VERB.senden({ t: "b", a: tAbbild(s), e: tEierAnzahl(s) }); }
    }
    if (s.tot) {
      S.totZeit = performance.now();
      if (S.modus === "duell") { VERB.senden({ t: "b", a: tAbbild(s), e: 0 }); VERB.senden({ t: "d" }); }
      runde_ende("verloren");
    }
  } else if (S.phase === "ende" && S.ende) {
    ereignisseAbarbeiten();
    S.ende.t += dt;
    if (!S.ende.gezeigt && S.ende.t >= S.ende.verzoegerung) { S.ende.gezeigt = true; endeZeigen(); }
  }
}
var letzteZeit = 0, letztesBild = 0, BILD_MIN_MS = 15;      // hoechstens ~60 Bilder/s zeichnen, auch auf 144-Hz-Monitoren
function schleife(t) {
  var dt = Math.min(0.05, (t - letzteZeit) / 1000 || 0.016); letzteZeit = t;
  if (!S.eingefroren) aktualisieren(dt);
  if (t - letztesBild < BILD_MIN_MS) { requestAnimationFrame(schleife); return; }
  var bdt = Math.min(0.05, (t - letztesBild) / 1000); letztesBild = t; dt = bdt;
  S.fpsMittel = (S.fpsMittel || 16) * 0.95 + bdt * 1000 * 0.05;                    // F: Bildrate anzeigen (Taste oder Menue-Taste)
  if (S.fpsAn && (++S.fpsZ || 0) % 20 === 0) el("fps").textContent = Math.round(1000 / S.fpsMittel) + " Bilder/s  ·  " + ZEICH.cv.width + "×" + ZEICH.cv.height + " px";
  if (S.s && S.phase !== "aus") ZEICH.frame(dt, S.s, S.g, { countdown: S.phase === "zahl" ? S.zahl : 0, pause: S.phase === "pause", start: S.hintStart });
  else ZEICH.frame(dt, null, null, null);
  requestAnimationFrame(schleife);
}
// ---- Beitritt ueber Link (QR mit der normalen Handy-Kamera gescannt) -------------------------------------
var KANAL = (typeof BroadcastChannel !== "undefined") ? new BroadcastChannel("sammlung-verbindung") : null;
if (KANAL) KANAL.onmessage = function (ev) {         // offenes Spiel im Gastgeber-Handy bekommt den Antwortcode aus einem anderen Tab
  var m = ev.data || {};
  if (m.t !== "antwort" || VERB.rolle !== "host" || !VERB.pc || VERB.offen) return;
  VERB.hostAntwort(m.code).then(function () {
    el("zeigStatus").textContent = "Verbinde …"; KANAL.postMessage({ t: "ack" });
  }).catch(function (e) { el("zeigStatus").textContent = e.message || String(e); KANAL.postMessage({ t: "fehler", text: e.message || String(e) }); });
};
async function linkBeitritt(code) {
  try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
  var o;
  try { o = JSON.parse(await VERB.dekodieren(code)); } catch (e) { return; }
  if (o.t === "o") {                                  // Code des Gastgebers: direkt beitreten
    nameLesen(); S.gestartet = false; S.phase = "aus"; S.modus = "duell";
    S.ohneKamera = true; gastBeitreten(); S.ohneKamera = false; el("einText").value = code; einUebernehmen();
  } else if (o.t === "a") {                           // Antwortcode: an das offene Spiel im anderen Tab geben
    zeige("einlesen"); el("einTitel").textContent = "Antwortcode"; el("einHinweis").textContent = "";
    el("videoBox").classList.add("weg"); el("bKamera").classList.add("weg"); el("einText").value = ""; el("bUebernehmen").classList.add("weg");
    el("einStatus").textContent = "Wird an dein Spiel übergeben …";
    var fertig = false;
    if (KANAL) {
      KANAL.addEventListener("message", function (ev) {
        var m = ev.data || {};
        if (m.t === "ack") { fertig = true; el("einStatus").textContent = "Übergeben. Wechsle zurück zu deinem Spiel (dieses Fenster kannst du schließen)."; }
        else if (m.t === "fehler") { fertig = true; el("einStatus").textContent = m.text; }
      });
      KANAL.postMessage({ t: "antwort", code: code });
    }
    setTimeout(function () { if (!fertig) el("einStatus").textContent = "Dein Spiel hat den Code nicht angenommen. Wechsle zu deinem Spiel (Spiel eröffnet?) und scanne den Code dort mit „Weiter“, oder füge ihn ein:"; el("einText").value = code; el("bUebernehmen").classList.add("weg"); }, 2500);
  }
}
window.addEventListener("load", function () {
  einrichten(); requestAnimationFrame(schleife);
  var lc = VERB.codeAusLink(location.hash); if (lc) linkBeitritt(lc);
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !S.test) navigator.serviceWorker.register("sw.js").catch(function () {});   // offline nach dem ersten Besuch
});
window.addEventListener("pagehide", function () { if (VERB.offen) VERB.senden({ t: "x" }); });

// Schnittstelle fuer Tests
window.SPIELE = {
  get S() { return S; }, step: function (dt, n) { for (var i = 0; i < (n || 1); i++) { aktualisieren(dt); if (S.s) ZEICH.frame(dt, S.s, S.g, { countdown: S.phase === "zahl" ? S.zahl : 0 }); } },
  set eingefroren(v) { S.eingefroren = !!v; }, get eingefroren() { return S.eingefroren; },
  neueRunde: neueRunde, hostEroeffnen: hostEroeffnen, startDuell: startDuell, insMenue: insMenue
};
