// held.js — die drei Helden: Werte, Farben, Auswahl-Logik (Zeichnen: bildschirme.js).
// Alle Werte hier zum Nachjustieren. Kein Modul; globale Variablen.

var HELDEN = [
  { id: "garrick", name: "Garrick", klasse: "Krieger", klasseId: "krieger", person: "Elsa", sucht: "seine Tochter Elsa, 7 Jahre",
    leben: 8, tempo: 140, ausdauer: 100, mana: 80, reichweite: 62, axtAb: 1.5, licht: 0, trank: 3,
    waffe: "schwert", kurz: "Hält viel aus, ist etwas langsam und schlägt weit. Wenig Mana.",
    farben: { haut: "#d1a47c", haar: "#4a3a2c", rock: "#5d6470", umhang: "#3b2a2e", guertel: "#2c2118", beine: "#3c3a3e" } },
  { id: "mara", name: "Mara", klasse: "Druide", klasseId: "druide", person: "Jonas", sucht: "ihren Bruder Jonas, 11 Jahre",
    leben: 5, tempo: 176, ausdauer: 130, mana: 100, reichweite: 54, axtAb: 0.9, licht: 0, trank: 3,
    waffe: "beil", kurz: "Schnell, wenig Leben. Das Wurfbeil kehrt rasch zurück.",
    farben: { haut: "#e0b998", haar: "#6a3a22", rock: "#46603f", umhang: "#2f4a34", guertel: "#3a2a1c", beine: "#4a3a2c" } },
  { id: "anselm", name: "Bruder Anselm", klasse: "Zauberer", klasseId: "zauberer", person: "Lene", sucht: "Lene, 9 Jahre, seine Ziehtochter",
    leben: 6, tempo: 150, ausdauer: 100, mana: 130, reichweite: 58, axtAb: 1.3, licht: 70, trank: 5,
    waffe: "stab", kurz: "Trägt eine Laterne, sieht weiter, hat am meisten Mana. Tränke heilen mehr.",
    farben: { haut: "#d9b595", haar: "#8a8478", rock: "#6a5038", umhang: "#6a5038", guertel: "#d8cfa8", beine: "#4a3a2c" } }
];

var HELD = 0;            // gewaehlter Held (Index in HELDEN)
var HELD_AUSWAHL = 0;    // Markierung im Auswahlbildschirm

// Kartenrechtecke im Auswahlbildschirm (Canvas 960x640) — auch fuer Mausklicks.
var HELD_KARTEN = [0, 1, 2].map(function (i) {
  return { x: 60 + i * 288, y: 120, w: 264, h: 420 };
});

function heldKarteAn(mx, my) {
  for (var i = 0; i < HELD_KARTEN.length; i++) {
    var k = HELD_KARTEN[i];
    if (mx >= k.x && mx <= k.x + k.w && my >= k.y && my <= k.y + k.h) return i;
  }
  return -1;
}

// Ein Schritt im Auswahlbildschirm. fl = Tastenflanken aus spiel.js.
// Gibt true zurueck, wenn der Held bestaetigt wurde.
function heldAuswahlSchritt(fl, mx, my, klick) {
  var n = HELDEN.length;
  if (fl.a || fl.arrowleft) HELD_AUSWAHL = (HELD_AUSWAHL + n - 1) % n;
  if (fl.d || fl.arrowright) HELD_AUSWAHL = (HELD_AUSWAHL + 1) % n;
  if (fl["1"]) HELD_AUSWAHL = 0;
  if (fl["2"]) HELD_AUSWAHL = 1;
  if (fl["3"]) HELD_AUSWAHL = 2;
  var k = heldKarteAn(mx, my);
  if (klick && k >= 0) {
    if (k === HELD_AUSWAHL) { HELD = k; return true; }
    HELD_AUSWAHL = k;
  }
  if (fl.enter || fl[" "] || fl.e) { HELD = HELD_AUSWAHL; return true; }
  return false;
}
