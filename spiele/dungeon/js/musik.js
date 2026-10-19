// musik.js — die Musikstuecke (alle selbst komponiert, nichts aus dem Original).
// SZENEN[name] = { bpm, takt: function (o, t, i, dauer, zufall) } plant EINEN Takt (4 Schlaege)
// ab Zeit t. i = Taktnummer (zaehlt hoch), dauer = Taktlaenge in s, zufall() = 0..1 (reproduzierbar).
// Stimmen: audio.js. Welche Szene wann laeuft: klang.js (szeneFuer).
//
// Stimmung nach Szene:
//   titel     Pads, Glocken, einsame Melodie in a-Moll (langsam)
//   dorf      Gitarrenzupfen ueber a-Moll / G / F / E (andalusisch), Wind, leise Fl.
//   ebene1-3  Drohnen, Wind, vereinzelte Glocken; tiefer und dissonanter mit jeder Ebene
//   waechter  Trommeln und pulsierender Bass (der Boss-Zombie)
//   boss1-3   Trommeln, Chor, Bass; Stufe 2 mit Schlaegen, Stufe 3 mit Tritonus und hohem Geschrei
//   kammer    leiser Chor ueber Drohne (vor dem Kampf), ende  Trost in Dur-Naehe, tod  fast Stille

var SZENEN = {};

// Pegel je Szene (Bus-Verstaerkung), nach Messung (test_audio.py / musikRendern) abgeglichen:
// Deutliche Kontrast-Staffel: ambient <= uebergang < kampf, Tod am leisesten, Bosse steigen.
var SZENEN_PEGEL = { titel: 0.5, dorf: 2.6, ebene1: 0.3, ebene2: 0.3, ebene3: 0.3, waechter: 1.25,
                     boss1: 1.1, boss2: 1.35, boss3: 1.75, kammer: 0.31, ende: 0.55, tod: 0.12, gemach: 0.36, gemach2: 0.34 };

function zupfLauf(o, t, dauer, wurzel, terz, v, muster) {            // Arpeggio aus Grundton, Quinte, Oktave, Terz
  var teil = dauer / 8, ton8 = [wurzel, wurzel + 7, wurzel + 12, wurzel + 12 + terz, wurzel + 19, wurzel + 24];
  for (var k = 0; k < 8; k++) zupf(o, t + k * teil, ton8[muster[k]], teil * 3.2, v * (k === 0 ? 1.25 : (k % 2 ? 0.75 : 1)));
}
function wind(o, t, dauer, v, zufall) {
  var f = 300 + zufall() * 500;
  geraeusch(o, t, dauer * 1.1, v, f, f * (0.6 + zufall() * 1.1), 0.9, dauer * 0.4);
}

// ---- Titel / Heldenwahl / Prolog -------------------------------------------------------
var TITEL_AKKORD = [[45, 3], [41, 4], [38, 3], [40, 4]];             // a, F, d, E (Grundton, Terz)
var TITEL_MELODIE = [
  [[0, 76, 2], [2, 72, 1], [3, 71, 1]], [[0, 69, 3], [3, 72, 1]], [[0, 74, 2], [2, 72, 1], [3, 69, 1]], [[0, 68, 2], [2, 71, 2]],
  [[0, 76, 2], [2, 79, 1], [3, 77, 1]], [[0, 76, 2], [2, 72, 2]], [[0, 74, 1], [1, 72, 1], [2, 69, 2]], [[0, 68, 4]]
];
SZENEN.titel = { bpm: 54, takt: function (o, t, i, d, z) {
  var a = TITEL_AKKORD[i % 4], r = a[0], b = d / 4;
  pad(o, t, r + 12, d + 0.4, 0.07, 650); pad(o, t, r + 19, d + 0.4, 0.05, 650); pad(o, t, r + 12 + a[1], d + 0.4, 0.05, 650);
  bass(o, t, r - 12, d + 0.2, 0.2, 160, 0.6);
  TITEL_MELODIE[i % 8].forEach(function (n) { zupf(o, t + n[0] * b, n[1], n[2] * b * 1.3, 0.2); glocke(o, t + n[0] * b, n[1] + 12, n[2] * b * 1.6, 0.05); });
  if (i % 8 === 7) chor(o, t, 56, d + 1, 0.05);
  if (i % 4 === 3) wind(o, t, d, 0.025, z);
} };

// ---- Dorf ------------------------------------------------------------------------------
var DORF_AKKORD = [[45, 3], [43, 4], [41, 4], [40, 4]];              // a, G, F, E
var DORF_PENTA = [72, 74, 76, 79, 81];
SZENEN.dorf = { bpm: 76, takt: function (o, t, i, d, z) {
  var a = DORF_AKKORD[i % 4], b = d / 4;
  zupfLauf(o, t, d, a[0], a[1], 0.17, [0, 1, 2, 3, 4, 3, 2, 1]);
  zupf(o, t, a[0] - 12, b * 3, 0.22);
  pad(o, t, a[0] + 12, d, 0.035, 500);
  if (i % 2 === 0) { var m = DORF_PENTA[Math.floor(z() * 5)], m2 = DORF_PENTA[Math.floor(z() * 5)];
                     zupf(o, t + b * 2, m, b * 3, 0.15); if (z() < 0.6) zupf(o, t + b * 3.5, m2, b * 2.5, 0.12); }
  if (i % 8 === 7) glocke(o, t + b, 93, 6, 0.04);
  wind(o, t, d, 0.02, z);
} };

// ---- Dungeon-Ebenen -------------------------------------------------------------------
function ebeneBauen(bpm, wurzel, cluster, bellWk, puls) {
  return { bpm: bpm, takt: function (o, t, i, d, z) {
    bass(o, t, wurzel, d + 1.2, 0.3, 190, 1.6);
    pad(o, t, wurzel + 24, d + 0.8, 0.03, 420); pad(o, t, wurzel + 31, d + 0.8, 0.025, 420);
    if (i % 2 === 0) pad(o, t + d * 0.25, wurzel + 24 + cluster, d * 0.8, 0.022, 380);   // reibender Halbton/Tritonus
    wind(o, t, d, 0.035, z);
    var skala = [0, 1, 7, 8, 10, 12, 15];
    for (var s = 0; s < 4; s++) if (z() < bellWk) glocke(o, t + (s + z() * 0.8) * d / 4, wurzel + 36 + skala[Math.floor(z() * skala.length)], 5, 0.06);
    if (puls) for (var k = 0; k < 4; k++) { kick(o, t + k * d / 4 + 0.02, 48, 0.16, 0.35); kick(o, t + k * d / 4 + 0.3, 46, 0.1, 0.3); }
  } };
}
SZENEN.ebene1 = ebeneBauen(40, 33, 1, 0.28, false);                  // A, Halbton darueber
SZENEN.ebene2 = ebeneBauen(36, 29, 1, 0.34, false);                  // F
SZENEN.ebene3 = ebeneBauen(34, 26, 6, 0.38, true);                   // D, Tritonus, Herzschlag

// ---- Kampf: Waechter und Bosse -----------------------------------------------------------
function trommeln(o, t, d, stufe, i) {
  var b = d / 4;
  kick(o, t, 52, 0.4); kick(o, t + 2 * b, 52, 0.34);
  kick(o, t + 1.5 * b, 80, 0.2, 0.3); kick(o, t + 3.5 * b, 74, 0.22, 0.3);
  if (stufe >= 2) { geraeusch(o, t + b, 0.22, 0.2, 2200, 900, 0.8); geraeusch(o, t + 3 * b, 0.22, 0.2, 2200, 900, 0.8); kick(o, t + b, 60, 0.2, 0.25); }
  if (stufe >= 3) {
    kick(o, t + b, 52, 0.3); kick(o, t + 3 * b, 52, 0.3);
    for (var k = 0; k < 8; k++) geraeusch(o, t + k * b / 2, 0.06, 0.08, 7000, 5000, 1.5);
    if (i % 2 === 1) for (var r = 0; r < 4; r++) kick(o, t + 3 * b + r * b / 4, 90 - r * 8, 0.2, 0.2);
  }
}
function kampfBauen(bpm, stufe, wurzel) {
  return { bpm: bpm, takt: function (o, t, i, d, z) {
    var b = d / 4, n = stufe === 3 ? 16 : 8, halb = (i % 2 === 1 ? 1 : 0);
    trommeln(o, t, d, stufe, i);
    for (var k = 0; k < n; k++) bass(o, t + k * d / n, wurzel + (k % 4 === 3 ? halb : 0), d / n * 0.7, 0.2, 300 + stufe * 120, 0.01);
    if (stufe >= 1) { chor(o, t, 57 + halb, d + 0.3, 0.05 + stufe * 0.012); chor(o, t, 64, d + 0.3, 0.035); }
    if (stufe >= 2) { pad(o, t, 69 + halb, d, 0.06, 1400); pad(o, t, 75, d, 0.04, 1400); }       // Stab; 75 gegen 69/64 = Spannung
    if (stufe >= 3) { chor(o, t, 63, d + 0.3, 0.05); pad(o, t + b * 2, 93, b * 1.5, 0.04, 3200); }      // hoher Schrei, Tritonus zu A
  } };
}
SZENEN.waechter = { bpm: 96, takt: function (o, t, i, d, z) {
  var b = d / 4;
  kick(o, t, 52, 0.36); kick(o, t + 2 * b, 52, 0.3); kick(o, t + 3 * b, 70, 0.2, 0.3);
  for (var k = 0; k < 8; k++) bass(o, t + k * d / 8, 33 + (i % 2 && k === 7 ? 1 : 0), d / 8 * 0.7, 0.2, 280, 0.01);
  if (i % 4 === 0) pad(o, t, 57, d * 2, 0.06, 900);
} };
SZENEN.boss1 = kampfBauen(108, 1, 33);
SZENEN.boss2 = kampfBauen(120, 2, 33);
SZENEN.boss3 = kampfBauen(132, 3, 31);

// ---- Kammer (Gespraech vor dem Kampf), Ende, Tod -----------------------------------------
SZENEN.kammer = { bpm: 34, takt: function (o, t, i, d, z) {
  bass(o, t, 26, d + 1.5, 0.3, 170, 1.8);
  [50, 53, 57, 62].forEach(function (m) { chor(o, t, m, d, 0.04); });
  if (z() < 0.5) glocke(o, t + z() * d * 0.7, 81 + (z() < 0.5 ? 0 : 6), 6, 0.05);
  kick(o, t + 0.1, 46, 0.1, 0.5); kick(o, t + 0.45, 44, 0.07, 0.4);
} };
// ---- Das Gemach des Ambros (Ebene 1): ruhig, geheimnisvoll, ein falsch gewordenes Wiegenlied -------
// Spieluhr (Glocken) ueber dunklem Orgelton in d-Moll (dorisch). Ein Ton der Melodie ist jedes zweite Mal
// einen Halbton daneben: man hoert es nicht gleich, aber es stoert. Kein Puls, kein Bass-Schlag.
var GEMACH_WIEGE = [74, 77, 76, 74, 72, 74, 69, 0,  74, 77, 79, 77, 76, 74, 72, 0];     // 0 = Pause
SZENEN.gemach = { bpm: 30, takt: function (o, t, i, d, z) {
  var b = d / 4, n;
  pad(o, t, 38, d + 1.2, 0.05, 330); pad(o, t, 45, d + 1.2, 0.035, 330);                  // d + a, tief und weich
  if (i % 4 >= 2) pad(o, t, 53, d + 1, 0.025, 380);                                        // f: Moll-Farbe
  bass(o, t, 26, d + 1.5, 0.18, 150, 1.8);
  for (var k = 0; k < 4; k++) {
    n = GEMACH_WIEGE[(i * 4 + k) % 16];
    if (!n) continue;
    if (n === 72 && i % 2 === 1) n = 73;                                                    // der falsche Ton
    glocke(o, t + k * b, n, b * 2.4, 0.075);
    if (k === 0) glocke(o, t + k * b + 0.01, n + 12, b * 1.2, 0.02);
  }
  if (i % 4 === 3) chor(o, t, 62, d + 1.5, 0.03);                                          // ferne Stimme
  wind(o, t, d, 0.022, z);
} };

// Geheimraum: dasselbe Wiegenlied, aber tiefer, langsamer und ohne die Spieluhr-Heiterkeit. Ein Tritonus
// haelt unter allem, der Herzschlag ist kaum zu hoeren. Ruhig, aber nichts daran beruhigt.
SZENEN.gemach2 = { bpm: 24, takt: function (o, t, i, d, z) {
  var b = d / 4, n;
  pad(o, t, 33, d + 1.5, 0.05, 280); pad(o, t, 39, d + 1.5, 0.03, 280);                    // a + es: Tritonus
  bass(o, t, 21, d + 1.5, 0.2, 130, 2);
  for (var k = 0; k < 4; k++) {
    n = GEMACH_WIEGE[(i * 4 + k) % 16];
    if (!n || (k % 2 === 1 && z() < 0.5)) continue;
    glocke(o, t + k * b + z() * 0.15, n - 12 + (z() < 0.12 ? 1 : 0), b * 2.8, 0.05);       // eine Oktave tiefer, selten ein Ton daneben
  }
  if (i % 2 === 0) chor(o, t, 51, d + 2, 0.028);
  kick(o, t + 0.05, 42, 0.07, 0.6); kick(o, t + 0.55, 40, 0.05, 0.5);                       // Herzschlag, fast unhoerbar
  wind(o, t, d, 0.02, z);
} };

var ENDE_AKKORD = [[45, 3], [41, 4], [48, 4], [43, 4]];              // a, F, C, G: trostvoll, nicht froh
SZENEN.ende = { bpm: 50, takt: function (o, t, i, d, z) {
  var a = ENDE_AKKORD[i % 4], b = d / 4;
  pad(o, t, a[0] + 12, d + 0.5, 0.07, 600); pad(o, t, a[0] + 19, d + 0.5, 0.05, 600); pad(o, t, a[0] + 12 + a[1], d + 0.5, 0.05, 600);
  bass(o, t, a[0] - 12, d, 0.18, 150, 0.6);
  zupfLauf(o, t, d, a[0] + 12, a[1], 0.08, [0, 2, 1, 3, 2, 4, 3, 5]);
  if (i % 2 === 1) glocke(o, t + b, 84 + (i % 4 === 1 ? 0 : -2), 6, 0.05);
  if (i % 8 === 7) chor(o, t, 69, d + 1, 0.04);
} };
SZENEN.tod = { bpm: 36, takt: function (o, t, i, d, z) {
  bass(o, t, 28, d + 1.5, 0.25, 140, 1.4);
  if (i % 2 === 0) glocke(o, t + d * 0.1, 69 + (z() < 0.5 ? 0 : 6), 8, 0.06);
  wind(o, t, d, 0.025, z);
} };
