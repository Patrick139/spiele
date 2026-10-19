// items.js — Gegenstaende: fuenf Plaetze (Waffe, Kopf, Koerper, Ring, Amulett), Seltenheit, Werte, Beute, Beutel.
// Ausruestung und Beutel gehoeren dem HELDEN (fortschritt.js: fp().ausruestung / fp().beutel) und werden mit
// dem Fortschritt gespeichert. Wirkung: klassen.js klassenAnwenden ruft itemSumme. Anzeige: inventar.js, itemgrafik.js.
// Kein Modul; globale Funktionen. Nutzt karte.js (zufall), held.js (HELDEN).

// ---- Konstanten zum Nachjustieren -------------------------------------
var BEUTEL_MAX = 12;                       // Plaetze im Beutel
var DROP_CHANCE_NORMAL = 0.07;             // Chance je erschlagenem Standardgegner
var SELTENHEIT = [
  { id: 0, name: "Gewöhnlich", farbe: "#cfc8b0", zusatz: 0 },
  { id: 1, name: "Gut",        farbe: "#7ab0ff", zusatz: 1 },
  { id: 2, name: "Selten",     farbe: "#ffd75a", zusatz: 2 }
];
var BEUTE_GEWICHT = { truhe: [50, 40, 10], elite: [30, 50, 20], normal: [80, 18, 2] };   // Seltenheit gewuerfelt je Quelle
// -----------------------------------------------------------------------

var SLOTS = ["waffe", "kopf", "koerper", "ring", "amulett"];
var SLOT_NAMEN = { waffe: "Waffe", kopf: "Kopf", koerper: "Körper", ring: "Ring", amulett: "Amulett" };
var STAT_NAMEN = { schaden: "Schaden", leben: "Leben", mana: "Mana", manaReg: "Mana-Regeneration", ausdauer: "Ausdauer", tempo: "Lauftempo", vert: "Verteidigung", licht: "Lichtradius", reich: "Reichweite" };
var STAT_EINHEIT = { manaReg: " /s", tempo: " %", licht: " px", reich: " px" };
var STAT_MAX = { schaden: 12, leben: 12, mana: 80, manaReg: 8, ausdauer: 80, tempo: 20, vert: 5, licht: 200, reich: 40 };   // Obergrenzen (Pruefung beim Laden)
var AFFIX_NAME = { leben: "der Standhaftigkeit", mana: "der Weisheit", manaReg: "des Flusses", ausdauer: "der Ausdauer", tempo: "der Eile", vert: "des Schutzes", licht: "der Helle", schaden: "der Schärfe", reich: "der Weite" };

// Grundtypen: art = Zeichnung (figuren.js, itemgrafik.js); grund = Werte auf Ebene 1 (wachsen mit der Ebene); klassen = bevorzugt.
var ITEM_BASEN = {
  waffe: [
    { art: "schwert",  name: "Schwert",       farbe: "#c4cbd8", klassen: ["krieger"],  grund: { schaden: 1.5, reich: 6 } },
    { art: "axt",      name: "Streitaxt",     farbe: "#aab0bc", klassen: ["krieger"],  grund: { schaden: 2, reich: 2 } },
    { art: "keule",    name: "Eichenkeule",   farbe: "#7a5a34", klassen: ["druide"],   grund: { schaden: 1.5, leben: 1 } },
    { art: "sichel",   name: "Mondsichel",    farbe: "#c8d4b8", klassen: ["druide"],   grund: { schaden: 1, tempo: 3 } },
    { art: "stab",     name: "Wanderstab",    farbe: "#8a6a3c", klassen: ["zauberer"], grund: { schaden: 0.5, mana: 15 } },
    { art: "kristall", name: "Kristallstab",  farbe: "#9ec4ff", klassen: ["zauberer"], grund: { schaden: 1, manaReg: 1 } }
  ],
  kopf: [
    { art: "kappe",  name: "Lederkappe",  farbe: "#7a5a38", klassen: ["druide"],   grund: { leben: 1, tempo: 2 } },
    { art: "helm",   name: "Eisenhelm",   farbe: "#8a909c", klassen: ["krieger"],  grund: { vert: 1 } },
    { art: "kapuze", name: "Kapuze",      farbe: "#4a3a62", klassen: ["zauberer"], grund: { mana: 10, licht: 20 } },
    { art: "reif",   name: "Stirnreif",   farbe: "#e0c060", klassen: ["zauberer", "druide"], grund: { manaReg: 1 } }
  ],
  koerper: [
    { art: "leder",  name: "Lederwams",     farbe: "#7a5a38", klassen: ["druide"],   grund: { leben: 1, tempo: 3 } },
    { art: "kette",  name: "Kettenhemd",    farbe: "#8a909c", klassen: ["krieger"],  grund: { vert: 1, leben: 1 } },
    { art: "robe",   name: "Gewebte Robe",  farbe: "#5a4a88", klassen: ["zauberer"], grund: { mana: 15, ausdauer: 10 } },
    { art: "platte", name: "Plattenpanzer", farbe: "#aab0bc", klassen: ["krieger"],  grund: { vert: 2, tempo: -3 } }
  ],
  ring: [
    { art: "ring", name: "Ring", farbe: "#d8b84a", klassen: ["krieger", "druide", "zauberer"], grund: { ausdauer: 10 } }
  ],
  amulett: [
    { art: "amulett", name: "Amulett", farbe: "#c05a4a", klassen: ["krieger", "druide", "zauberer"], grund: { leben: 1 } }
  ]
};
var AFFIX_POOL = {
  waffe: ["schaden", "reich", "tempo", "mana"], kopf: ["leben", "mana", "licht", "vert", "manaReg"], koerper: ["leben", "vert", "ausdauer", "mana", "tempo"],
  ring: ["schaden", "manaReg", "ausdauer", "tempo", "mana", "leben"], amulett: ["leben", "mana", "tempo", "licht", "manaReg", "vert"]
};
var AFFIX_WERT = { schaden: 0.5, leben: 1, mana: 10, manaReg: 1, ausdauer: 10, tempo: 3, vert: 1, licht: 30, reich: 5 };   // eine Stufe je Ebene

var ITEM_ZAEHLER = 0;

function leereAusruestung() { var a = {}; SLOTS.forEach(function (s) { a[s] = null; }); return a; }
function stufenFaktor(stufe) { return 1 + 0.5 * (stufe - 1); }
function statRunden(stat, v) {
  if (stat === "schaden") return Math.round(v * 2) / 2;
  if (stat === "manaReg") return Math.round(v * 2) / 2;
  return Math.round(v);
}
function zufallAus(liste) { return liste[Math.floor(Math.random() * liste.length)]; }

// Seltenheit wuerfeln nach Quelle (truhe | elite | normal).
function seltenheitWuerfeln(quelle) {
  var g = BEUTE_GEWICHT[quelle] || BEUTE_GEWICHT.normal, sum = g[0] + g[1] + g[2], r = Math.random() * sum;
  return r < g[0] ? 0 : (r < g[0] + g[1] ? 1 : 2);
}

// Neuer Gegenstand. klasseId bevorzugt passende Grundtypen (3:1), slot/seltenheit optional.
function itemNeu(stufe, klasseId, slot, seltenheit) {
  stufe = Math.max(1, Math.min(5, Math.floor(stufe || 1)));
  var w = [SLOTS[0], SLOTS[0], SLOTS[1], SLOTS[2], SLOTS[2], SLOTS[3], SLOTS[4]];                  // Waffe und Koerper haeufiger
  slot = slot || zufallAus(w);
  var basen = ITEM_BASEN[slot], gewichtet = [];
  basen.forEach(function (b) { var n = b.klassen.indexOf(klasseId) >= 0 ? 3 : 1; for (var i = 0; i < n; i++) gewichtet.push(b); });
  var b = zufallAus(gewichtet), sel = seltenheit === undefined ? 0 : seltenheit, werte = {}, fk = stufenFaktor(stufe), st;
  for (st in b.grund) werte[st] = statRunden(st, b.grund[st] * (st === "tempo" && b.grund[st] < 0 ? 1 : fk));
  var pool = AFFIX_POOL[slot].filter(function (s) { return !(s in werte); }), affixe = [];
  for (var i = 0; i < SELTENHEIT[sel].zusatz && pool.length; i++) {
    var s = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
    var v = AFFIX_WERT[s] * (0.8 + Math.random() * 0.8) * fk;
    werte[s] = statRunden(s, Math.max(AFFIX_WERT[s] * 0.5, v)); affixe.push(s);
  }
  for (st in werte) werte[st] = Math.max(-STAT_MAX[st], Math.min(STAT_MAX[st], werte[st]));
  var name = b.name + (affixe.length ? " " + AFFIX_NAME[affixe[0]] : "");
  return { id: "i" + (++ITEM_ZAEHLER) + "_" + Math.floor(Math.random() * 1e6), slot: slot, art: b.art, name: name, farbe: b.farbe, stufe: stufe, seltenheit: sel, werte: werte };
}

// Beute einer Quelle: null = nichts. Truhe und Elite geben immer etwas, Standardgegner selten.
function beuteWuerfeln(stufe, quelle, klasseId) {
  if (quelle === "normal" && Math.random() >= DROP_CHANCE_NORMAL) return null;
  return itemNeu(stufe, klasseId, undefined, seltenheitWuerfeln(quelle));
}

// Summe der Werte aller getragenen Gegenstaende.
function itemSumme(ausr) {
  var s = { schaden: 0, leben: 0, mana: 0, manaReg: 0, ausdauer: 0, tempo: 0, vert: 0, licht: 0, reich: 0 };
  SLOTS.forEach(function (sl) { var it = ausr && ausr[sl]; if (it) for (var k in it.werte) s[k] += it.werte[k]; });
  return s;
}

// Textzeilen eines Gegenstands ("+1,5 Schaden").
function itemZeilen(it) {
  var z = [];
  for (var k in it.werte) { var v = it.werte[k]; z.push((v > 0 ? "+" : "") + zahlText(v) + (STAT_EINHEIT[k] || "") + " " + STAT_NAMEN[k]); }
  return z;
}

// ---- Beutel und Anlegen -----------------------------------------------------------------
function beutelPlatz(f) { return f.beutel.length < BEUTEL_MAX; }
function beutelAufnehmen(z, it) {
  var f = fp();
  if (!beutelPlatz(f)) return false;
  f.beutel.push(it); fortschrittSpeichern();
  return true;
}
// Gegenstand aus dem Beutel (Index) anlegen; das bisherige Teil wandert an dessen Stelle in den Beutel.
function itemAnlegen(z, idx) {
  var f = fp(), it = f.beutel[idx];
  if (!it) return false;
  var alt = f.ausruestung[it.slot];
  f.ausruestung[it.slot] = it;
  if (alt) f.beutel[idx] = alt; else f.beutel.splice(idx, 1);
  itemWirkungNeu(z.spieler); fortschrittSpeichern(); sfx("buch");
  return true;
}
// Getragenes Teil in den Beutel legen (nur wenn Platz ist).
function itemAblegen(z, slot) {
  var f = fp(), it = f.ausruestung[slot];
  if (!it || !beutelPlatz(f)) return false;
  f.ausruestung[slot] = null; f.beutel.push(it);
  itemWirkungNeu(z.spieler); fortschrittSpeichern();
  return true;
}
function itemWegwerfen(z, idx) {
  var f = fp();
  if (!f.beutel[idx]) return false;
  f.beutel.splice(idx, 1); fortschrittSpeichern();
  return true;
}
function itemWirkungNeu(sp) { fertigkeitenAnwenden(sp, false); sp.klassenBonus = null; var l = sp.leben, a = sp.ausdauer, m = sp.mana;   // Basiswerte neu, dann Klassen + Items
  var lm = sp.lebenMax, am = sp.ausdauerMax, mm = sp.manaMax; klassenAnwenden(sp);
  sp.leben = Math.min(sp.lebenMax, l + Math.max(0, sp.lebenMax - lm)); sp.ausdauer = Math.min(sp.ausdauerMax, a + Math.max(0, sp.ausdauerMax - am)); sp.mana = Math.min(sp.manaMax, m + Math.max(0, sp.manaMax - mm)); }

// Pruefung beim Laden (fortschritt.js): bereinigter Gegenstand oder null.
function itemPruefen(roh) {
  if (!roh || typeof roh !== "object" || SLOTS.indexOf(roh.slot) < 0 || typeof roh.name !== "string" || typeof roh.art !== "string") return null;
  var ok = ITEM_BASEN[roh.slot].some(function (b) { return b.art === roh.art; });
  if (!ok || !roh.werte || typeof roh.werte !== "object") return null;
  var werte = {};
  for (var k in roh.werte) {
    if (!(k in STAT_MAX) || typeof roh.werte[k] !== "number" || !isFinite(roh.werte[k])) return null;
    werte[k] = Math.max(-STAT_MAX[k], Math.min(STAT_MAX[k], roh.werte[k]));
  }
  var sel = Math.max(0, Math.min(2, Math.floor(roh.seltenheit) || 0));
  return { id: String(roh.id || "i0").slice(0, 40), slot: roh.slot, art: roh.art, name: roh.name.slice(0, 60), farbe: /^#[0-9a-f]{6}$/i.test(roh.farbe) ? roh.farbe : "#cfc8b0",
           stufe: Math.max(1, Math.min(5, Math.floor(roh.stufe) || 1)), seltenheit: sel, werte: werte };
}
