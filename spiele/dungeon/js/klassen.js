// klassen.js — Klassen-Skillbäume nach Diablo 1: je Held ein Baum mit 3 Zweigen,
// 3 Stufen. Aktive Faehigkeiten (RMB) waehlt man mit Mausrad oder Tasten 1 bis 9;
// Passives wirken dauerhaft. Kein Modul; globale Funktionen.
// Nutzt held.js (HELD, klasseId), zauber.js (zauberRechtsklick), kampf.js (popup,
// imSchlagbogen, trefferFeedback), gegner.js (schadenGegner, playerTreffer, sichtbar),
// sprites.js (Zeichenhelfer).

// ---- Konstanten zum Nachjustieren -------------------------------------
var SKILL_TEMPO_ZUWACHS = 0.03;   // % Lauftempo je Rang eines Tempopassivs
var SKILL_LICHT_ZUWACHS = 35;     // Lichtradius je Rang Fackelschein
var SKILL_ARMOR = 1;              // Schaden weniger je Rang Bannhueller/Panzerhaut
var STUN_DAUER = 2.0;             // s: Gegner verhaelt ein (Bruellen/Heiligenlicht)
var ZWEIG_FARBEN = ["#c8a860", "#7a9a6a", "#8a7ab8"];  // je Klasse eigene Farben je Zweig
// -----------------------------------------------------------------------

// ---- Die drei Baeume --------------------------------------------------
// zweig: 0/1/2 (Spalte), tier: 0/1/2 (Reihe), max: Raege, aktiv: RMB-Faehigkeit.
var KLASSEN_BAUM = {
  krieger: {
    name: "Krieger", zweige: ["Klinge", "Eisenherz", "Kriegsschrei"], farben: ["#c8a860", "#9a8a6a", "#c86a4a"],
    skills: [
      { id: "wuchtschlag",   name: "Wuchtschlag",   zweig: 0, tier: 0, max: 3, aktiv: true, kosten: 25, abkling: 2.0, text: "Schwerer Schlag: 3 Schaden +1 je Rang, wirft weit zurueck (Ausdauer)." },
      { id: "wirbelklinge",  name: "Wirbelklinge",  zweig: 0, tier: 1, max: 3, aktiv: true, kosten: 30, abkling: 3.5, text: "Klingenschwung um dich herum: trifft ALLE Gegner in Reichweite (Ausdauer)." },
      { id: "letzterwille",  name: "Letzter Wille", zweig: 0, tier: 2, max: 3, aktiv: false, text: "Passiv: +1 Schaden je Rang, solange du weniger als die Haelfte Leben hast." },
      { id: "panzerfell",    name: "Panzerfell",    zweig: 1, tier: 0, max: 3, aktiv: false, text: "Passiv: +2 hoechstes Leben je Rang." },
      { id: "eisenhaut",     name: "Eisenhaut",     zweig: 1, tier: 1, max: 3, aktiv: false, text: "Passiv: -1 Schaden je Rang, den du empfaengst." },
      { id: "unaufhaltsam",  name: "Unaufhaltsam",  zweig: 1, tier: 2, max: 3, aktiv: false, text: "Passiv: +3 % Lauftempo und Ausdauer je Rang." },
      { id: "bruellen",      name: "Bruellen",      zweig: 2, tier: 0, max: 3, aktiv: true, kosten: 20, abkling: 6.0, text: "Schrei: Gegner im Umkreis erstarren fuer 2 s je Rang laenger." },
      { id: "kriegsdorn",    name: "Kriegsdorn",    zweig: 2, tier: 1, max: 3, aktiv: false, text: "Passiv: wer dich schlaegt, nimmt 1 Schaden je Rang." },
      { id: "todesstoss",    name: "Todesstoss",    zweig: 2, tier: 2, max: 3, aktiv: true, kosten: 40, abkling: 8.0, text: "Vernichtungsschlag: 6 Schaden +1 je Rang an allen Gegnern vor dir." }
    ]
  },
  druide: {
    name: "Druide", zweige: ["Wurzeln", "Kraeuter", "Gestalt"], farben: ["#6a8a4a", "#8ab06a", "#b08a4a"],
    skills: [
      { id: "dornenwerk",    name: "Dornenwerk",    zweig: 0, tier: 0, max: 3, aktiv: false, text: "Passiv: wer dich schlaegt, sticht sich an Dornen: 1 Schaden je Rang." },
      { id: "wurzelklinge",  name: "Wurzelklinge",  zweig: 0, tier: 1, max: 3, aktiv: true, kosten: 22, abkling: 3.0, text: "Wurzeln dringen aus dem Boden: Schaden 2 +1 je Rang, wirft zurueck." },
      { id: "eichenherz",    name: "Eichenherz",    zweig: 0, tier: 2, max: 3, aktiv: false, text: "Passiv: +2 hoechstes Leben je Rang." },
      { id: "heilkraut",     name: "Heilkraut",     zweig: 1, tier: 0, max: 3, aktiv: true, kosten: 25, abkling: 5.0, text: "Kraeuterheilkunde: heilt 2 Leben +1 je Rang (Mana)." },
      { id: "blaetterwurf",  name: "Blaetterwurf",  zweig: 1, tier: 1, max: 3, aktiv: true, kosten: 20, abkling: 1.5, text: "Fegt drei scharfe Blaetter nach vorne: je 1 +1 je 2 Rang Schaden." },
      { id: "waldgeist",     name: "Waldgeist",     zweig: 1, tier: 2, max: 3, aktiv: false, text: "Passiv: +3 % Lauftempo je Rang, Ausdauer +10 je Rang." },
      { id: "baerenschlag",  name: "Baerengestalt", zweig: 2, tier: 0, max: 3, aktiv: true, kosten: 30, abkling: 14.0, text: "Du wirst zum Baeren (8 s +1 je Rang): +3 Schaden +1 je Rang im Nahkampf, laengerer Arm, -1 Schaden pro Treffer +1 je Rang, etwas schneller. Zaubern geht in der Gestalt nicht." },
      { id: "mossfell",      name: "Moosfell",      zweig: 2, tier: 1, max: 3, aktiv: false, text: "Passiv: -1 empfangener Schaden je Rang." },
      { id: "wolfsprung",    name: "Wolfsprung",    zweig: 2, tier: 2, max: 3, aktiv: true, kosten: 20, abkling: 3.0, text: "Satz zum Zielpunkt (140 px +30 je Rang): unverwundbar, Hieb auf alles im Flug, Landung erschüttert (3 Schaden +1 je Rang, Gegner erstarren)." }
    ]
  },
  zauberer: {
    name: "Zauberer", zweige: ["Arkan", "Licht", "Beschwoerung"], farben: ["#8a7ab8", "#e8d080", "#6aa8b8"],
    skills: [
      { id: "blitzstrahl",   name: "Blitzstrahl",   zweig: 0, tier: 0, max: 3, aktiv: true, kosten: 18, abkling: 0.8, text: "Ein Strahl in Zielrichtung (300 px +30 je Rang): 2 Schaden +1 je Rang an allem auf der Linie, bis zur Wand." },
      { id: "arkanwell",     name: "Arkanwelle",    zweig: 0, tier: 1, max: 3, aktiv: true, kosten: 35, abkling: 4.0, text: "Druckwelle im Kegel nach vorn: Schaden 3 +1 je Rang, wirft Gegner zurueck." },
      { id: "bannhueller",   name: "Bannhueller",   zweig: 0, tier: 2, max: 3, aktiv: false, text: "Passiv: -1 empfangener Schaden je Rang." },
      { id: "fackelschein",  name: "Fackelschein",  zweig: 1, tier: 0, max: 3, aktiv: false, text: "Passiv: +35 Lichtradius je Rang — du siehst weiter in die Tiefe." },
      { id: "lambertsegen",  name: "Lambertsegen",  zweig: 1, tier: 1, max: 3, aktiv: true, kosten: 30, abkling: 6.0, text: "Segenswort: heilt 1 Leben +1 je Rang (Mana)." },
      { id: "geistkontakt",  name: "Geistkontakt",  zweig: 1, tier: 2, max: 3, aktiv: false, text: "Passiv: +15 hoechstes Mana je Rang." },
      { id: "heiligenlicht", name: "Heiligenlicht", zweig: 2, tier: 0, max: 3, aktiv: true, kosten: 28, abkling: 5.0, text: "Lichtkranz um dich: 2 Schaden je Rang an allem Nahen, Gegner erstarren (Spinnen nicht)." },
      { id: "sperrkreis",    name: "Sperrkreis",    zweig: 2, tier: 1, max: 3, aktiv: true, kosten: 25, abkling: 3.5, text: "Runenkreis am Zielpunkt (3,5 s): Gegner darin erleiden alle 0,5 s Schaden je Rang und werden hinausgedraengt." },
      { id: "sturmkontakt",  name: "Sturmkontakt",  zweig: 2, tier: 2, max: 3, aktiv: true, kosten: 40, abkling: 7.0, text: "Sturmruf: Blitze aus dem Dunkel treffen alle Gegner in Sicht (4 Schaden +1 je Rang) und halten sie kurz auf." }
    ]
  }
};

function klasseVon(sp) { return KLASSEN_BAUM[sp.held.klasseId] || KLASSEN_BAUM.krieger; }
function skillDefVon(sp, id) {
  var baum = klasseVon(sp).skills;
  for (var i = 0; i < baum.length; i++) if (baum[i].id === id) return baum[i];
  return null;
}

// ---- Faehigkeiten des Spielers (neuerSpieler ruft das) ----------------
function skillsNeu(sp) {
  var stufen = {};
  var baum = klasseVon(sp).skills;
  for (var i = 0; i < baum.length; i++) stufen[baum[i].id] = 0;
  // Gelernte Rang und Auswahl aus dem Held-Fortschritt laden (bleibt nach Tod erhalten).
  var f = fp();
  if (f && f.klasse) {
    for (var k in f.klasse) {
      var d = skillDefVon(sp, k);
      if (d && typeof f.klasse[k] === "number") stufen[k] = Math.max(0, Math.min(d.max, Math.floor(f.klasse[k])));
    }
  }
  var wahl = (f && f.wahl) || "axt";
  if (wahl !== "axt") {                                  // nur erlaubte Faehigkeiten uebernehmen
    if (wahl === "nova") { if (!zustand.zauber || !zustand.zauber.nova) wahl = "axt"; }
    else if (!stufen[wahl]) wahl = "axt";
  }
  sp.skills = { stufen: stufen, gewaehlt: wahl, dauer: {} };   // dauer: laufende Wirkungen (Buff, Schutz)
  sp.skillCd = {};   // Abklingzeiten je Faehigkeit. Fehlte bisher: jede aktive Klassenfaehigkeit warf TypeError (RMB und HUD)
}

// ---- Passives anwenden (nach jedem Punkte-Kauf / Heldenneu) -----------
// Idempotent: Bonus wird als Delta gegen den letzten Stand gerechnet.
function klassenAnwenden(sp) {
  var r = sp.skills.stufen, baum = klasseVon(sp).skills, i, d;
  var neu = { leben: 0, ausdauer: 0, mana: 0, tempoProzent: 0 };
  sp.lichtBonus = 0; sp.armor = 0; sp.dornen = 0; sp.dmgBonus = 0;
  for (i = 0; i < baum.length; i++) {
    d = baum[i];
    var rang = r[d.id] || 0;
    if (!rang) continue;
    if (d.id === "panzerfell" || d.id === "eichenherz") neu.leben += 2 * rang;
    if (d.id === "unaufhaltsam") neu.ausdauer += 15 * rang;
    if (d.id === "waldgeist") neu.ausdauer += 10 * rang;
    if (d.id === "unaufhaltsam" || d.id === "waldgeist") neu.tempoProzent += SKILL_TEMPO_ZUWACHS * rang;
    if (d.id === "eisenhaut" || d.id === "bannhueller" || d.id === "mossfell") sp.armor += SKILL_ARMOR * rang;
    if (d.id === "fackelschein") sp.lichtBonus += SKILL_LICHT_ZUWACHS * rang;
    if (d.id === "kriegsdorn" || d.id === "dornenwerk") sp.dornen += rang;
    if (d.id === "geistkontakt") neu.mana += 15 * rang;
  }
  var is = itemSumme(fp().ausruestung);                    // getragene Gegenstaende (items.js)
  neu.leben += is.leben; neu.ausdauer += is.ausdauer; neu.mana += is.mana; neu.tempoProzent += is.tempo / 100;
  sp.armor += is.vert; sp.lichtBonus += is.licht; sp.itemManaReg = is.manaReg; sp.itemReich = is.reich;
  sp.schadenPlus = 0.5 * (fp().raenge.kraft || 0) + is.schaden;
  sp.ausr = fp().ausruestung;                              // fuer die Zeichnung (figuren.js)
  sp.reichweite = sp.held.reichweite + is.reich + (typeof baerAktiv === "function" && baerAktiv(sp) ? BAER_REICHWEITE : 0);
  var alt = sp.klassenBonus || { leben: 0, ausdauer: 0, mana: 0 };
  sp.lebenMax += neu.leben - alt.leben;
  sp.leben = Math.min(sp.lebenMax, sp.leben + Math.max(0, neu.leben - alt.leben));
  sp.ausdauerMax += neu.ausdauer - alt.ausdauer;
  sp.ausdauer = Math.min(sp.ausdauerMax, sp.ausdauer + Math.max(0, neu.ausdauer - alt.ausdauer));
  sp.manaMax += neu.mana - alt.mana;
  sp.mana = Math.min(sp.manaMax, sp.mana + Math.max(0, neu.mana - alt.mana));
  sp.klassenBonus = neu;
  // Tempo: Heldengrundwert + Flinke Fueße (fortschritt.js) + Tempopassivs
  sp.tempo = Math.max(60, Math.round(sp.held.tempo * (1 + 0.04 * (fp().raenge.fuss || 0)) * (1 + neu.tempoProzent)));
}

// ---- Auswahl: Liste der einstellbaren Faehigkeiten ---------------------
// Axt immer, Nova wenn gelernt (zauber.js), dann die aktiven Baumfaehigkeiten.
function skillRoster(z) {
  var sp = z.spieler, liste = ["axt"], baum = klasseVon(sp).skills;
  if (z.zauber.nova) liste.push("nova");
  for (var i = 0; i < baum.length; i++) {
    var d = baum[i];
    if (d.aktiv && sp.skills.stufen[d.id] > 0) liste.push(d.id);
  }
  return liste;
}
function skillName(id) {
  if (id === "axt") return "Wurf";
  if (id === "nova") return "Nova";
  var h = HELDEN[HELD], baum = klasseVon({ held: h }).skills;
  for (var i = 0; i < baum.length; i++) if (baum[i].id === id) return baum[i].name;
  return id;
}
function skillWaehle(z, id) {
  if (z.phase !== "dungeon" || z.dialog || z.pause) return false;
  var rost = skillRoster(z);
  if (rost.indexOf(id) < 0) return false;
  if (z.spieler.skills.gewaehlt === id) return false;
  z.spieler.skills.gewaehlt = id;
  var f = fp();
  if (f) f.wahl = id;                                    // Auswahl bleibt ueber Tod hinweg
  if (id === "axt" || id === "nova") z.zauber.gewaehlt = id;   // alte Auswahl synchron halten
  popup(z, z.spieler.x, z.spieler.y - 40, skillName(id), "#9ec4ff");
  return true;
}
function skillZyklus(z, richtung) {                     // Mausrad
  var rost = skillRoster(z), sp = z.spieler;
  var i = rost.indexOf(sp.skills.gewaehlt);
  var n = rost[(i + rost.length + richtung) % rost.length];
  if (n !== sp.skills.gewaehlt) skillWaehle(z, n);
}
function skillWaehlePerTaste(z, nr) {                   // Tasten 1 bis 9: Roster-Reihenfolge
  var rost = skillRoster(z);
  if (nr >= 1 && nr <= rost.length) skillWaehle(z, rost[nr - 1]);
}

// HUD-Platz fuer die gewaehlte Faehigkeit (hud.js ruft; gleiche Form wie novaSlot).
function skillSlot(ctx, sp) {
  var id = sp.skills.gewaehlt, d = skillDefVon(sp, id);
  var farbe = klasseVon(sp).farben[d ? d.zweig : 0], res = skillRes(d);
  var knapp = d && d.kosten && sp[res] < d.kosten;
  return {
    taste: "RMB", name: d ? d.name : "Faehigkeit",
    kosten: d && d.kosten ? d.kosten + (res === "mana" ? " Mana" : " Ausdauer") : null,
    hinweis: knapp ? (res === "mana" ? "Zu wenig Mana (" : "Zu wenig Ausdauer (") + d.kosten + ")" : null,
    cd: d && d.abkling ? (sp.skillCd[id] || 0) / d.abkling : 0,
    icon: function (x, y) {                             // Rune: Raute in der Zweig-Farbe
      poly(ctx, [x, y - 10, x + 9, y, x, y + 10, x - 9, y], knapp ? "#5a5a7a" : farbe);
      kr(ctx, x, y, 2.4, "#f0e6b8");
    }
  };
}

// ---- Ausfuehren (RMB): true = Klick gehoert der Faehigkeit -------------
function skillRechtsklick(sp, z) {
  // z.zauber.gewaehlt hat Vorrang (aeltere API/Test setzt es direkt): Nova gilt als gewaehlt,
  // sobald sie dort steht — sonst entscheidet die Klassen-Auswahl.
  var id = (z.zauber && z.zauber.gewaehlt === "nova") ? "nova" : sp.skills.gewaehlt;
  if (id === "nova") return zauberRechtsklick(sp, z);    // zauber.js (Mana, Ring)
  if (id === "axt") return false;                        // Normaler Wurf bleibt in kampf.js
  var d = skillDefVon(sp, id);
  if (!d || !d.aktiv || sp.skills.stufen[id] < 1) return false;
  if ((sp.skillCd[id] || 0) > 0) return true;
  if (baerAktiv(sp) && (id === "heilkraut" || id === "blaetterwurf")) {   // Baeren zaubern nicht
    popup(z, sp.x, sp.y - 40, "Als Bär kein Zauber", "#8a8fb8"); sp.skillCd[id] = 0.4; return true;
  }
  // Kosten pruefen: Kampfschlaege kosten Ausdauer, Zauber/Heilung Mana
  var res = skillRes(d);
  if ((id === "heilkraut" || id === "lambertsegen") && sp.leben >= sp.lebenMax) {   // nichts zu heilen: nichts verbrauchen
    popup(z, sp.x, sp.y - 40, "Leben voll", "#8a8fb8");
    sp.skillCd[id] = 0.4;
    return true;
  }
  if (sp[res] < d.kosten) {
    popup(z, sp.x, sp.y - 40, res === "mana" ? "Zu wenig Mana" : "Zu wenig Ausdauer", "#8a8fb8");
    sp.skillCd[id] = 0.4;
    return true;
  }
  sp[res] -= d.kosten;
  if (res === "ausdauer") sp.ausdauerT = 0.4;            // Regeneration setzt kurz aus
  sp.skillCd[id] = d.abkling;
  skillAusfuehren(sp, z, id);
  return true;
}

// Welche Ressource zahlt die Faehigkeit? Kampfschlaege Ausdauer (gelb), der Rest Mana (blau).
var SKILL_AUSDAUER = { wuchtschlag: 1, wirbelklinge: 1, todesstoss: 1, bruellen: 1 };
function skillRes(d) { return d && SKILL_AUSDAUER[d.id] ? "ausdauer" : "mana"; }

// Schritt: Abklingzeiten und laufende Wirkungen aktualisieren.
function klassenSchritt(sp, z, dt) {
  var d = sp.skillCd;
  for (var k in d) if (d[k] > 0) d[k] = Math.max(0, d[k] - dt);
  var dau = sp.skills.dauer;
  for (var k in dau) if (dau[k] > 0) dau[k] -= dt;
  for (var i = 0; i < z.gegner.length; i++) {
    var g = z.gegner[i];
    if (g.gebRem > 0) { g.gebRem -= dt; g.pause = Math.max(g.pause, 0.05); }   // erstarrt
  }
  baerSchritt(sp, z, dt);                                // Gestaltwechsel (baer.js)
  if (z.blitzMs > 0) z.blitzMs -= dt;                    // Sekunden (frueher 220 s statt 0,22 s)
}
