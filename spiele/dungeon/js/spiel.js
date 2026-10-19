// spiel.js — Hauptschleife und Ablauf: Titel -> Heldenwahl -> Prolog -> Dorf -> Dungeon -> Ende.
// requestAnimationFrame mit festem Zeitschritt; P Pause, R zurueck ins Dorf.
// Setzt alle anderen js-Dateien voraus (Reihenfolge siehe index.html).

var SCHRITT_BASIS_MS = 1000 / 60;   // Grundtakt (Tests, SPIEL.step)
var SCHRITT_MS = SCHRITT_BASIS_MS;   // Dauer des laufenden Schritts; rahmen() passt sie der Bilddauer an
var SCHRITT = 1 / 60;         // derselbe Schritt in Sekunden

var canvas = document.getElementById("spiel");
// Canvas-High-DPI: Physischer Puffer wird mit devicePixelRatio hochskaliert (scharfe
// Vektorformen auf Retina), das Spiel bleibt in logischen 960x640 Koordinaten.
var LOG_BREITE = 960, LOG_HOEHE = 640;
// Aufloesung des Puffers: bis zu devicePixelRatio (hoechstens 2), aber QUAL_STUFEN[QUAL.i] begrenzt sie. Die Kosten wachsen mit
// der Pixelzahl (Puffer 2x = 4-mal so viel wie 1x); qualitaetSchritt senkt die Stufe automatisch, wenn das Bild zu langsam kommt.
var QUAL_STUFEN = [2, 1.5, 1.25, 1, 0.85, 0.7];
var QUAL = { i: 0, summe: 0, zeit: 0, n: 0, zSumme: 0, letzte: 0, vorher: 0, geprueft: false, decke: 0, aus: false, hochT: 0 };
function qualWirksam(i) { return Math.min(window.devicePixelRatio || 1, 2, QUAL_STUFEN[i]); }
function canvasSchaerfstellen() {
  var dpr = qualWirksam(QUAL.i), w = Math.round(LOG_BREITE * dpr), hh = Math.round(LOG_HOEHE * dpr);
  if (canvas.width !== w) {
    canvas.width = w;
    canvas.height = hh;
    ctx.setTransform(w / LOG_BREITE, 0, 0, hh / LOG_HOEHE, 0, 0);
    return true;
  }
  return false;
}
// Automatische Aufloesung: misst alle ~0,7 s die Bilddauer. Zu langsam (unter ~47 Bilder/s): eine Stufe runter (bei ganz langsam zwei).
// Bringt der Schritt keine 15 % Gewinn, liegt es nicht an der Pixelzahl -> zurueck und nicht mehr anfassen.
// Hochschalten nur, wenn die gemessene Zeichenzeit hochgerechnet unter 9 ms bleibt; faellt es danach wieder, bleibt die Decke.
function qualitaetSchritt(vergangen, zeichenMs) {
  if (QUAL.aus || zustand.eingefroren || vergangen > 250 || document.hidden) return;
  QUAL.summe += vergangen; QUAL.zSumme += zeichenMs; QUAL.n++; QUAL.zeit += vergangen;
  if (QUAL.zeit < 700 || QUAL.n < 20) return;
  var avg = QUAL.summe / QUAL.n, avgZ = QUAL.zSumme / QUAL.n, jetzt = performance.now();
  QUAL.summe = QUAL.zSumme = QUAL.n = QUAL.zeit = 0;
  if (QUAL.geprueft === false && QUAL.vorher > 0 && jetzt - QUAL.letzte < 4000) {          // Wirkung des letzten Schritts pruefen
    QUAL.geprueft = true;
    if (avg > QUAL.vorher * 0.85) { QUAL.i = Math.max(0, QUAL.i - QUAL.schritte); QUAL.aus = true; QUAL.vorher = 0; return; }
  }
  var cur = qualWirksam(QUAL.i);
  if (avg > 21 && QUAL.i < QUAL_STUFEN.length - 1 && jetzt - QUAL.letzte > 900) {
    var i = QUAL.i + 1;
    while (i < QUAL_STUFEN.length - 1 && qualWirksam(i) >= cur) i++;                        // naechste Stufe, die wirklich kleiner ist
    if (avg > 45 && i < QUAL_STUFEN.length - 1) { var j = i + 1; while (j < QUAL_STUFEN.length - 1 && qualWirksam(j) >= qualWirksam(i)) j++; i = j; }
    if (qualWirksam(i) >= cur) return;
    if (jetzt - QUAL.hochT < 10000) QUAL.decke = i;                                         // gerade erst hoch und wieder zu langsam
    QUAL.schritte = i - QUAL.i; QUAL.vorher = avg; QUAL.geprueft = false; QUAL.i = i; QUAL.letzte = jetzt;
  } else if (avg < 19 && QUAL.i > QUAL.decke && jetzt - QUAL.letzte > 8000) {
    var k = QUAL.i - 1;
    while (k > QUAL.decke && qualWirksam(k) <= cur) k--;
    if (qualWirksam(k) > cur && avgZ * Math.pow(qualWirksam(k) / cur, 2) < 9) { QUAL.i = k; QUAL.letzte = jetzt; QUAL.hochT = jetzt; QUAL.vorher = 0; }
  }
}
var ctx = canvas.getContext("2d");

var zustand = {
  phase: "titel",   // titel | held | text | dorf | dungeon
  ebene: null,
  spieler: null,
  nebel: null,
  ebenenNr: 1,
  pause: false,
  ziel: false,      // Treppe auf Ebene 3 benutzt: Ende der Geschichte laeuft
  tot: false,       // Bildschirm "Gestorben"
  tode: 0,          // wie oft gestorben (die Kerze im Dorf brennt herunter)
  toetungen: 0,
  gegner: [],       // Gegner der aktuellen Ebene
  funde: [],        // Pfarrbuchseiten der Ebene
  axt: null,        // fliegende Wurfaxt (oder null)
  pfeile: [],       // Pfeile der Skelette
  traenke: [],      // Heiltranke am Boden
  popups: [],       // Schadens-/Heilzahlen
  fx: [],           // Faehigkeitseffekte (effekte.js)
  fortschritt: fortschrittLaden(),   // Stufe, Erfahrung, Fertigkeiten je Held (fortschritt.js)
  skillOffen: false, // Fertigkeitenfenster (Taste K)
  invOffen: false,  // Ausruestungsfenster (Taste I)
  beute: [],        // Gegenstaende am Boden (items.js)
  stufeAuf: 0,      // zaehlt Stufenaufstiege (Ton)
  zauber: { nova: false, gewaehlt: "axt" },   // Zauberbuch der Ebene 1 gefunden? Was liegt auf der rechten Maustaste?
  nova: null,       // laufende Nova-Welle (zauber.js)
  gefahren: [],     // angekuendigte Angriffe des Bosses (boss.js)
  kerzen: [],       // die neun Kerzen der Kammer
  wahlen: [],       // Antworten in den Gespraechen mit Ambros (drohen/fragen/schweigen)
  ambrosGesprochen: false,
  beweise: {},             // in Ambros' Raeumen Gesehenes (kammer.js)
  konfrontiert: 0,         // wie oft Ambros damit konfrontiert wurde
  verfolgung: false,       // Ambros wurde angegriffen und flieht von Ebene zu Ebene (boss.js)
  gestartet: false,        // Prolog gesehen: erst dann wird gespeichert (speicher.js)
  neuBestaetigt: false,    // Titelbild: 'Neues Spiel' wurde einmal angefragt
  schluessel: false,       // Ersatzschluessel von Berta (kammer.js, geschichte.js)
  bertaVersuche: 0,        // falsche Gespraechsenden mit Berta
  dialog: null,     // laufender Erzaehltext (bildschirme.js)
  banner: null,     // Ortsname beim Betreten
  hinweis: "",      // Zeile "E — ..." unten
  blendeT: 0,       // Einblenden aus Schwarz (Sekunden)
  blutMs: 0,        // roter Rand nach Treffer
  hitstopMs: 0,     // Trefferpause: Simulation kurz einfrieren
  schuettelMs: 0,   // Bildwackeln nach Treffern
  eingefroren: false // Tests: rAF-Simulation pausieren (Schritt nur per SPIEL.step)
};

// ---- Tastenflanken: true nur im Schritt, in dem die Taste gedrueckt wurde ----
var FL = {}, TVORHER = {}, KLICK_VORHER = false;
var FLANKEN_TASTEN = ["e", "p", "r", "q", "k", "c", "i", "x", "a", "d", "v", "f", " ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "w", "s", "enter", "arrowleft", "arrowright", "arrowup", "arrowdown", "escape"];
function flankenAktualisieren() {
  for (var i = 0; i < FLANKEN_TASTEN.length; i++) {
    var t = FLANKEN_TASTEN[i], jetzt = !!TASTEN[t];
    FL[t] = jetzt && !TVORHER[t];
    TVORHER[t] = jetzt;
  }
  FL.klick = MAUS.links && !KLICK_VORHER;
  KLICK_VORHER = MAUS.links;
}

// Gegner, Wurfaxt, Pfeile, Traenke und Effekte fuer eine neue Ebene leeren.
function kampfZuruecksetzenEbene(ebeneNr) {
  zustand.gegner = erzeugeGegner(zustand.ebene, ebeneNr, zustand.ebene.start);
  zustand.axt = null;
  zustand.pfeile = [];
  zustand.traenke = []; zustand.beute = [];
  zustand.popups = [];
  zustand.fx = [];
  zustand.gefahren = [];
  zustand.kerzen = [];
  zustand.nova = null;
  zustand.hitstopMs = 0;
  zustand.schuettelMs = 0;
  zustand.gemach = null;
  zustand.funde = erzeugeFunde(zustand.ebene, ebeneNr);
  if (ebeneNr === 1 && !zustand.zauber.nova) {           // Archivwaechter, bis das Buch geborgen ist
    var wt = erzeugeWaechter(zustand.ebene);
    if (wt) zustand.gegner.push(wt);
  }
  zustand.banner = { titel: EBENEN_NAMEN[ebeneNr - 1][0], sub: EBENEN_NAMEN[ebeneNr - 1][1], t: 4.2, dauer: 4.2,
                     ziel: zustand.ebene.schloss ? "Die Treppe ist verschlossen. Such den Schlüssel." : null };
  zustand.blendeT = 0.7;
}

// Zwei Pfarrbuchseiten je Ebene, in verschiedenen Raeumen (weder Start noch Treppe).
function erzeugeFunde(ebene, ebeneNr) {
  var kandidaten = [];
  for (var i = 0; i < ebene.raeume.length; i++) {
    var r = ebene.raeume[i], cx = r.cx, cy = r.cy;
    if ((cx === ebene.start.x && cy === ebene.start.y) || (Math.abs(cx - ebene.treppe.x) < 3 && Math.abs(cy - ebene.treppe.y) < 3)) continue;
    if (begehbar(ebene, cx, cy) && (!r.typ || r.typ === "normal")) kandidaten.push(r);   // Sonderraeume (raeume.js) bleiben frei
  }
  var funde = [], seiten = FUNDE[ebeneNr - 1];
  for (var k = 0; k < seiten.length && kandidaten.length; k++) {
    var raum = kandidaten.splice(zufall(0, kandidaten.length - 1), 1)[0];
    funde.push({ x: (raum.cx + 0.5) * KACHEL, y: (raum.cy + 0.5) * KACHEL, text: seiten[k], gelesen: false });
  }
  funde = funde.concat(raumFunde(ebene));                // Schluessel, Truhe, Altar (raeume.js)
  if (ebeneNr === 1) funde = funde.concat(kammerErzeugen(ebene, kandidaten, HELD));   // seine Privatkammer (kammer.js)
  if (ebeneNr <= 2 || zustand.verfolgung) {              // Ambros steht neben der Treppe (Begegnung oder, nach dem Angriff, Kampf)
    var t = ebene.treppe, cand = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (var c = 0; c < cand.length; c++) {
      if (!begehbar(ebene, t.x + cand[c][0], t.y + cand[c][1])) continue;
      var af = { x: (t.x + 0.5 + cand[c][0]) * KACHEL, y: (t.y + 0.5 + cand[c][1]) * KACHEL, art: "ambros",
                 stufe: ebeneNr, gelesen: false };
      if (zustand.verfolgung) { af.flucht = true; af.text = verfolgerVor(ebeneNr, HELD); }
      else af.text = begegnungSeiten(ebeneNr);
      funde.push(af);
      break;
    }
  }
  return funde;
}

// ---- Uebergaenge ------------------------------------------------------------
function insTitel() {
  zustand.phase = "titel"; zustand.dialog = null; zustand.hinweis = "";
}

function insDorf() {
  if (!DORF) DORF = baueDorf();
  ZOOM = ZOOM_DORF;
  DREI_D = false;                     // Dorf ist immer 2D: Steuerung nach Tod/Respawn korrekt (Bugfix)
  zustand.phase = "dorf"; zustand.ebene = DORF; zustand.ebenenNr = 1;
  zustand.spieler = neuerSpieler(DORF.start);
  zustand.gegner = []; zustand.funde = []; zustand.axt = null; zustand.pfeile = [];
  zustand.traenke = []; zustand.beute = []; zustand.popups = []; zustand.fx = []; zustand.gefahren = []; zustand.kerzen = [];
  zustand.pause = false; zustand.ziel = false; zustand.tot = false;
  zustand.dialog = null; zustand.hinweis = ""; zustand.blutMs = 0;
  zustand.banner = { titel: "HOLLENFURT", sub: "Eine Woche nach dem Martinstag", t: 4.2, dauer: 4.2 };
  zustand.blendeT = 0.7;
  zustand.gestartet = true;
  spielSpeichern();                                     // Ankunft im Dorf: Checkpoint (speicher.js)
}

// Neue Partie im Dungeon, Ebene 1 (Tests und Tor der Abtei).
function neuesSpiel() {
  ZOOM = ZOOM_DUNGEON;
  zustand.phase = "dungeon";
  zustand.ebenenNr = 1;
  zustand.ebene = neueEbene(1);
  zustand.spieler = neuerSpieler(zustand.ebene.start);
  zustand.nebel = neuerNebel();
  zustand.pause = false;
  zustand.ziel = false;
  zustand.tot = false;
  zustand.dialog = null;
  zustand.toetungen = 0;
  zustand.blutMs = 0;
  zustand.beweiseAlt = Object.assign({}, zustand.beweise || {});   // was frueher gesehen wurde, zaehlt in diesem Abstieg nicht (geschichte.js)
  kampfZuruecksetzenEbene(1);
}

function neueHeldenwahl() {
  zustand.phase = "held"; zustand.tode = 0; HELD_AUSWAHL = HELD;
  zustand.wahlen = []; zustand.ambrosGesprochen = false; zustand.schluessel = false; zustand.bertaVersuche = 0;
  zustand.beweise = {}; zustand.konfrontiert = 0; zustand.verfolgung = false; zustand.gestartet = false; zustand.neuBestaetigt = false;
  zustand.zauber = { nova: false, gewaehlt: "axt" };
}

// Die Kammer der Kerzen: runder Saal, Ambros wartet, neun Kerzen im Ring. Kampf beginnt sofort.
function betreteKammer() {
  var z = zustand;
  z.phase = "dungeon"; ZOOM = ZOOM_KAMMER; z.ziel = false; z.tot = false; z.pause = false;
  z.ebene = baueKammer();
  z.spieler = neuerSpieler(z.ebene.start); z.spieler.licht += 140;
  z.nebel = neuerNebel();
  for (var y = 0; y < RASTER; y++) for (var x = 0; x < RASTER; x++) if (z.ebene.feld[y][x] === 1) z.nebel[y][x] = true;
  z.gegner = [erzeugeBoss(25.5 * KACHEL, 22.5 * KACHEL)];
  z.funde = []; z.axt = null; z.pfeile = []; z.traenke = []; z.beute = []; z.popups = []; z.fx = []; z.gefahren = [];
  z.kerzen = [];
  for (var i = 0; i < 9; i++) {
    var a = i / 9 * 6.2832 + 1.5708;
    z.kerzen.push({ x: (25 + Math.cos(a) * 8.9) * KACHEL, y: (25 + Math.sin(a) * 8.9) * KACHEL, nr: i, mein: i === 0, stufe: 1 });
  }
  z.banner = { titel: KAMMER_NAME[0], sub: KAMMER_NAME[1], t: 4.2, dauer: 4.2 };
  z.blendeT = 0.7;
  if (z.verfolgung) {                                  // er kommt schon gezeichnet an: Stufe 2, 40 Leben
    var bz = bossVon(z); bz.stufe = 2; bz.mindest = 20; bz.leben = 40;
    for (var kk = 0; kk < z.kerzen.length; kk++) z.kerzen[kk].stufe = 2;
  }
  bossStart(z);
}

// E auf der Treppe: eine Ebene hinab. Unten der Saal mit Ambros: erst Gespraech, dann Kampf.
function treppeBenutzen() {
  if (zustand.ziel) return;
  if (zustand.ebenenNr >= EBENEN_MAX) {
    zustand.phase = "text";
    dialogStart(zustand.verfolgung ? kammerVorVerfolgt(HELD) : kammerVor(HELD), "kammer", betreteKammer);
    return;
  }
  zustand.ebenenNr++;
  zustand.ebene = neueEbene(zustand.ebenenNr);
  zustand.spieler = neuerSpieler(zustand.ebene.start);
  zustand.nebel = neuerNebel();
  kampfZuruecksetzenEbene(zustand.ebenenNr);
  spielSpeichern();                                     // jeder Abstieg ist ein Checkpoint
}

// ---- Ein Simulationsschritt (fixe Zeitspanne SCHRITT Sekunden) ---------------
function dungeonSchritt() {
  var z = zustand, sp = z.spieler;
  if (FL.r && (z.tot || !z.pause)) { insDorf(); return; }
  if (z.tot && FL.enter) { insDorf(); return; }
  if (z.pause || z.ziel || z.tot) return;

  // Fundstueck in Reichweite?
  var fund = null, fundAbstand = 40 * 40;                 // der naechste in Reichweite gewinnt
  for (var i = 0; i < z.funde.length; i++) {
    if (z.funde[i].art === "ambros" && z.funde[i].gelesen) continue;   // gesprochen: Treppe wieder frei
    if (z.funde[i].art === "teppich") continue;                        // Schmuck, nicht ansprechbar
    if (z.funde[i].verbraucht) continue;                               // Schluessel genommen, Truhe offen, Altar benutzt (raeume.js)
    var dx = z.funde[i].x - sp.x, dy = z.funde[i].y - sp.y;
    if (dx * dx + dy * dy < fundAbstand) { fundAbstand = dx * dx + dy * dy; fund = z.funde[i]; }
  }
  if (fund && (fund.art === "schluessel" || fund.art === "truhe" || fund.art === "altar")) z.hinweis = raumHinweis(z, fund);
  else if (fund) z.hinweis = fund.art === "ambros" ? (fund.flucht ? "E  —  Ihm entgegentreten" : "E  —  Hochwürden ansprechen") : (fund.art === "zauber" ? "E  —  Zauberbuch aufheben" : (fund.art === "kammer" ? kammerHinweis(z, fund) : "E  —  Pfarrbuch lesen"));
  else if (sp.aufTreppe && treppeGesperrt(z.ebene)) z.hinweis = "Die Treppe ist verschlossen — such den Schlüssel dieser Ebene";
  else if (sp.aufTreppe) z.hinweis = z.ebenenNr >= EBENEN_MAX ? "E  —  Die Kammer betreten" : "E  —  Hinab";
  else z.hinweis = "";
  if (FL.e) {
    if (fund && (fund.art === "schluessel" || fund.art === "truhe" || fund.art === "altar")) { raumNutzen(z, fund); return; }
    if (fund) {
      fund.gelesen = true;
      if (fund.art === "kammer") kammerGesehen(z, fund);
      if (fund.art === "ambros" && fund.flucht) {                       // Verfolgung: erst ein kurzes Wort, dann der Kampf (boss.js)
        dialogStart(verfolgerVor(fund.stufe, HELD), null, function () { verfolgerStart(z, fund); });
        return;
      }
      dialogStart(fund.art === "kammer" ? kammerSeiten(z, fund) : (fund.art === "ambros" ? begegnungSeiten(fund.stufe) : fund.text), null,
                  fund.art === "zauber" ? function () { zauberLernen(z, fund); } : (fund.art === "kammer" ? kammerFertig(z, fund) : null));
      return;
    }
    if (sp.aufTreppe && treppeGesperrt(z.ebene)) { popup(z, sp.x, sp.y - 40, "Verschlossen", "#c88a8a"); sfx("hurt"); return; }
    if (sp.aufTreppe) treppeBenutzen();
  }
  if (FL.q) trinkFall(sp, z);
  if (FL.v && !z.dialog) dreiDUmschalten();            // 2D <-> 3D (dreid.js)
  if (!z.skillOffen) {                                 // im Fertigkeitenfenster gehoeren 1-9 dem Kauf
    for (var nr = 1; nr <= 9; nr++) if (FL[String(nr)]) skillWaehlePerTaste(z, nr);   // Ziffer = Platz in skillRoster (Wurf, Nova, Klassenfaehigkeiten)
  }

  spielerSchritt(sp, z.ebene, SCHRITT);
  kampfSchritt(sp, z.ebene, z, SCHRITT);
  novaSchritt(z, sp, z.ebene, SCHRITT);
  gegnerSchritt(z, z.ebene, SCHRITT);
  beuteSchritt(z, sp);                                   // Gegenstaende aufheben (itemgrafik.js)
  nebelAktualisieren(z.nebel, sp);
  bossWeltSchritt(z, SCHRITT);
}

function schritt() {
  var z = zustand;
  // Trefferpause: 40 ms lang gefriert die Welt.
  if (z.hitstopMs > 0) {
    z.hitstopMs -= SCHRITT_MS;
    if (z.schuettelMs > 0) z.schuettelMs -= SCHRITT_MS;
    return;
  }
  if (z.schuettelMs > 0) z.schuettelMs -= SCHRITT_MS;
  if (z.blutMs > 0) z.blutMs -= SCHRITT_MS;
  flankenAktualisieren();
  var weiter = FL.e || FL.enter || FL[" "] || FL.klick;
  if (FL.f) LEISTUNG.an = !LEISTUNG.an;                      // F: Bildraten-Anzeige (leistung.js)

  if (z.skillOffen) { skillSchritt(z, FL, MAUS.x, MAUS.y, FL.klick); return; }       // Fenster offen: Welt steht
  if (z.invOffen) { invSchritt(z, FL, MAUS.x, MAUS.y, FL.klick); return; }
  if (FL.i && !z.dialog && (z.phase === "dorf" || (z.phase === "dungeon" && !z.tot && !z.ziel && !z.pause))) { z.invOffen = true; return; }
  if (FL.k && !z.dialog && (z.phase === "dorf" || (z.phase === "dungeon" && !z.tot && !z.ziel && !z.pause))) { z.skillOffen = true; return; }

  if (z.phase === "ende") { if (FL.enter) insTitel(); return; }                            // nach "Spiel beenden"
  if ((FL.p || FL.escape) && !z.dialog && (z.phase === "dorf" || (z.phase === "dungeon" && !z.tot && !z.ziel))) {
    z.pause = !z.pause; z.pauseWahl = 0; return;                                           // P oder Esc: Pausemenue (pause.js)
  }
  if (z.pause && (z.phase === "dorf" || z.phase === "dungeon")) { pauseSchritt(z, FL, MAUS.x, MAUS.y, FL.klick); return; }
  if (z.phase === "titel" && FL.q && !z.dialog) { spielBeenden(z); return; }              // Titelbild: Q beendet

  if (z.dialog) { dialogSchritt(z.dialog, SCHRITT, weiter); return; }   // Erzaehltext haelt die Welt an
  if (z.phase === "titel") { if (titelSchritt(z, FL, weiter)) neueHeldenwahl(); }
  else if (z.phase === "held") {
    var vorher = HELD_AUSWAHL;
    if (FL.c && spielstandLesen(HELD_AUSWAHL)) { spielLaden(HELD_AUSWAHL); return; }      // C: Spielstand dieses Helden fortsetzen
    if (FL.escape) { if (z.neuBestaetigt) z.neuBestaetigt = false; else insTitel(); return; }
    var gewaehlt = heldAuswahlSchritt(FL, MAUS.x, MAUS.y, FL.klick);
    if (HELD_AUSWAHL !== vorher) z.neuBestaetigt = false;                                 // anderer Held: Rueckfrage verfaellt
    if (gewaehlt) {
      if (spielstandLesen(HELD) && !z.neuBestaetigt) { z.neuBestaetigt = true; return; }  // Platz belegt: erst nachfragen
      z.neuBestaetigt = false;
      z.phase = "text";
      dialogStart(prologSeiten(HELD), "prolog", insDorf);
    }
  }
  else if (z.phase === "dorf") { if (dorfSchritt(z, SCHRITT, FL)) neuesSpiel(); }
  else if (z.phase === "dungeon") dungeonSchritt();
}

function zeichnen() {
  var b = LOG_BREITE, h = LOG_HOEHE, z = zustand, d = z.dialog;
  ANIM = performance.now() / 1000;
  if (z.phase === "ende") zeichneEnde(ctx, b, h);
  else if (z.phase === "titel") zeichneTitel(ctx, b, h);
  else if (z.phase === "held") zeichneHeldenwahl(ctx, b, h);
  else if (d && d.kulisse) zeichneKulisse(ctx, b, h, d);
  else if (z.phase === "dorf" || z.phase === "dungeon") {
    var cam = kamera(b, h, z.spieler);
    if (z.phase === "dorf") { zeichneDorf(ctx, b, h, z); DREI_D = false; }   // Dorf ist immer 2D (Fix: Steuerung nach Tod)
    else if (z.phase === "dungeon" && DREI_D) zeichne3D(ctx, b, h, z.ebene, z.spieler, z.nebel, z);
    else {
      zeichne(ctx, b, h, z.ebene, z.spieler, z.nebel, z);
      ctx.save(); ctx.scale(ZOOM, ZOOM);
      zeichneKampf(ctx, cam.x, cam.y, z);
      ctx.restore();
    }
    zeichneVignette(ctx, b, h, z);
    if (z.phase === "dungeon" && DREI_D) zeichne3DWaffe(ctx, b, h, z);   // Waffe NACH der Vignette: nicht mehr abgedunkelt
    zeichneKugeln(ctx, b, h, z.spieler);
    if (z.phase === "dungeon") { zeichneAusdauer(ctx, b, h, z.spieler); zeichneLeiste(ctx, b, h, z.spieler); }
    zeichneHud(ctx, b, h, z);
    zeichneGespeichert(ctx, b, z);
    raumHud(ctx, b, h, z);                                // Schluesselanzeige, Pfeil zur Treppe (raeume.js)
    if (z.phase === "dungeon") zeichneBossBalken(ctx, b, z);
    if (d) {
      var wa = d.seiten[d.i].wahl, bh = wa ? 140 + wa.length * 28 : 150;
      zeichneTextBlock(ctx, d, 130, 522 - bh, 700, bh, false);
    }
    if (z.skillOffen) zeichneSkills(ctx, b, h, z);
    if (z.invOffen) zeichneInventar(ctx, b, h, z);
    if (z.tot) zeichneTod(ctx, b, h, z);
  }
  zeichneBlende(ctx, b, h, z);
}

// Hauptschleife: Akkumulator + fester Zeitschritt, Rendering pro Frame.
var letzterZeitpunkt = 0;
var akkumulator = 0;
var BILD_MIN_MS = 12;          // hoechstens ~80 Bilder/s: auf 144/165-Hz-Monitoren nicht doppelt so oft zeichnen wie noetig
function rahmen(zeitpunkt) {
  if (!letzterZeitpunkt) letzterZeitpunkt = zeitpunkt;
  if (zeitpunkt - letzterZeitpunkt < BILD_MIN_MS && !zustand.eingefroren) { requestAnimationFrame(rahmen); return; }
  var vergangen = zeitpunkt - letzterZeitpunkt;
  letzterZeitpunkt = zeitpunkt;
  if (vergangen > 250) vergangen = 250;   // Tab-Wechsler nicht nachholen
  // Einblendung und Banner laufen in Echtzeit (auch bei eingefrorener Simulation in Tests)
  if (zustand.blendeT > 0) zustand.blendeT -= vergangen / 1000;
  if (zustand.banner && zustand.banner.t > 0) zustand.banner.t -= vergangen / 1000;
  // Schritte folgen der ECHTEN Bilddauer: bei 60 Hz ein Schritt je Bild, bei 144 Hz ein kurzer Schritt je Bild,
  // bei Einbruechen mehrere. Mit festem 60-Hz-Takt wechselten auf 75/120/144/165-Hz-Schirmen Bilder mit 0 und 1 Schritt
  // (die Figur ruckelte, obwohl die Bildrate stimmte). Tests schalten per SPIEL.step mit dem festen Takt.
  var schritte = 0;
  if (!zustand.eingefroren) {
    var dtMs = Math.min(vergangen, 100);
    schritte = Math.max(1, Math.ceil(dtMs / (SCHRITT_BASIS_MS * 1.05)));
    SCHRITT_MS = dtMs / schritte; SCHRITT = SCHRITT_MS / 1000;
    for (var si = 0; si < schritte; si++) schritt();
    SCHRITT_MS = SCHRITT_BASIS_MS; SCHRITT = SCHRITT_BASIS_MS / 1000;
  }
  canvasSchaerfstellen();                     // HiDPI-Puffer aktuell halten (auch nach Displaywechsel)
  var zt0 = performance.now();
  zeichnen();
  if (LEISTUNG.an) zeichneLeistung(ctx, LOG_BREITE);
  leistungMessen(vergangen, performance.now() - zt0, schritte);
  qualitaetSchritt(vergangen, performance.now() - zt0);
  if (window.klangUpdate) klangUpdate(zustand);   // Musik und Effekte (klang.js)
  requestAnimationFrame(rahmen);
}

// ---- Debug-Schnittstelle fuer Tests (Schritt fuer Schritt steuerbar) ----
window.SPIEL = {
  get zustand() { return zustand; },
  step: function (n) { for (var i = 0; i < (n || 1); i++) schritt(); },
  tasten: function (t) { return TASTEN[t]; },
  setTaste: function (t, an) { if (an) TASTEN[t] = true; else delete TASTEN[t]; },
  setMaus: function (x, y) { MAUS.x = x; MAUS.y = y; },
  mausklick: function (knopf) {          // kurzes Klicksignal: down + up
    var f = knopf === 2 ? "rechts" : "links";
    MAUS[f] = true;
    setTimeout(function () { MAUS[f] = false; }, 60);
  },
  gegnerAnzahl: function () { return zustand.gegner.length; },
  neu: function () { neuesSpiel(); },    // direkt in den Dungeon, Ebene 1
  dorf: function () { insDorf(); },
  held: function (i) { HELD = i; },
  rad: function () { zauberWechseln(zustand); },
  xp: function (n) { xpGeben(zustand, n, undefined, undefined); },          // Tests: Erfahrung vergeben
  fortschrittLoeschen: function () { zustand.fortschritt = [fortschrittNeu(), fortschrittNeu(), fortschrittNeu()]; fortschrittSpeichern(); },
  nova: function () { zustand.zauber.nova = true; zustand.zauber.gewaehlt = "nova"; if (zustand.spieler && zustand.spieler.skills) zustand.spieler.skills.gewaehlt = "nova"; },   // Tests: Zauber freischalten
  treppe: function () { treppeBenutzen(); },
  d3: function () { dreiDUmschalten(); },          // 2D <-> 3D fuer Tests
  ist3D: function () { return !!DREI_D; }
};

neuesSpiel();          // Objekte anlegen (Tests und Titelbild brauchen einen Spieler)
insTitel();
requestAnimationFrame(rahmen);
