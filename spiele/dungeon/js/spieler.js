// spieler.js — der Held: Position, Bewegung (WASD), Kollision mit Waenden,
// Treppennutzung mit E, Leben und Ausdauer. Kein Modul; globale Funktionen.

// ---- Konstanten zum Nachjustieren -------------------------------------
var SPIELER_RADIUS = 10;   // Trefferradius in Pixeln (Fußpunkt-Kreis)
var SPIELER_TEMPO = 150;   // Bewegung in Pixel pro Sekunde
var SPIELER_LEBEN = 6;     // Trefferpunkte (Herzen im HUD)
var SPIELER_AUSDAUER = 100; // Ausdauer: Ausweichen kostet (siehe kampf.js)
// -----------------------------------------------------------------------

function neuerSpieler(startPunkt, held) {
  held = held || HELDEN[HELD];   // Werte des gewaehlten Helden (held.js)
  var sp = {
    held: held, tempo: held.tempo, reichweite: held.reichweite, axtAb: held.axtAb,
    licht: held.licht, trank: held.trank, gehT: 0, geht: false,
    x: (startPunkt.x + 0.5) * KACHEL, // Pixelmittelpunkt des Startfelds
    y: (startPunkt.y + 0.5) * KACHEL,
    radius: SPIELER_RADIUS,
    richtung: 0,   // 0 = unten, 1 = links, 2 = rechts, 3 = oben (nur Optik)
    aufTreppe: false,
    leben: held.leben, lebenMax: held.leben,
    ausdauer: held.ausdauer, ausdauerMax: held.ausdauer
  };
  kampfZuruecksetzen(sp);  // Kampffelder (blick, kombo, dodge, ...)
  fertigkeitenAnwenden(sp, true);   // Werte aus den Fertigkeiten des Helden (fortschritt.js)
  skillsNeu(sp);           // Klassen-Baum initialisieren (klassen.js)
  klassenAnwenden(sp);     // Passives wirken (klassen.js)
  return sp;
}

// Prueft, ob der Kreis des Spielers an einer (gx,gy)-Kachel anstoesst:
// naechster Punkt der Kachelquadrats zum Kreiszentrum bestimmen.
function stoesstAn(ebene, px, py, radius) {
  var gx0 = Math.floor((px - radius) / KACHEL);
  var gx1 = Math.floor((px + radius) / KACHEL);
  var gy0 = Math.floor((py - radius) / KACHEL);
  var gy1 = Math.floor((py + radius) / KACHEL);
  for (var gy = gy0; gy <= gy1; gy++) {
    for (var gx = gx0; gx <= gx1; gx++) {
      if (begehbar(ebene, gx, gy)) continue;
      // naechster Punkt des Kachelrechtecks [gx*K, (gx+1)*K] x [gy*K, (gy+1)*K]
      var cx = Math.max(gx * KACHEL, Math.min(px, (gx + 1) * KACHEL));
      var cy = Math.max(gy * KACHEL, Math.min(py, (gy + 1) * KACHEL));
      var dx = px - cx, dy = py - cy;
      if (dx * dx + dy * dy < radius * radius) return true;
    }
  }
  return false;
}

// Bewegung in zwei Achsen getrennt — erlaubt sauberes Entlanggleiten an Waenden.
function bewegeSpieler(sp, ebene, dx, dy) {
  if (dx !== 0) {
    if (!stoesstAn(ebene, sp.x + dx, sp.y, sp.radius)) sp.x += dx;
  }
  if (dy !== 0) {
    if (!stoesstAn(ebene, sp.x, sp.y + dy, sp.radius)) sp.y += dy;
  }
}

// Eingabegeraet: gedrückte Tasten werden gesammelt, spiel.js holt sie ab.
var TASTEN = {};
window.addEventListener("keydown", function (e) {
  var t = e.key.toLowerCase();       // Leertaste = " " (Ausweichschritt, Weiter)
  if ("wasdepqrkcvf 123456789".indexOf(t) >= 0 && t.length === 1 ||
      t === "enter" || t === "arrowleft" || t === "arrowright" || t === "arrowup" || t === "arrowdown" || t === "escape") {
    TASTEN[t] = true;
    e.preventDefault();
  }
});
window.addEventListener("keyup", function (e) {
  delete TASTEN[e.key.toLowerCase()];
});

// Ein Simulationsschritt: WASD in Geschwindigkeit umrechnen, bewegen,
// Treppe feststellen. Das E selbst loest spiel.js aus (Einmalkommando).
// Ausweichschritt und Ausdauer gehoeren zu kampf.js (kampfSchritt).
function spielerSchritt(sp, ebene, dt) {
  var vx = 0, vy = 0;
  var tempo = (sp.tempo || SPIELER_TEMPO) * (sp.formTempo || 1);   // formTempo: Baerengestalt (baer.js)
  if (TASTEN["w"]) { vy -= tempo; sp.richtung = 1; }
  if (TASTEN["s"]) { vy += tempo; sp.richtung = 3; }
  if (TASTEN["a"]) { vx -= tempo; sp.richtung = 0; }
  if (TASTEN["d"]) { vx += tempo; sp.richtung = 2; }
  sp.geht = (vx !== 0 || vy !== 0);          // fuer die Laufanimation
  if (sp.geht) sp.gehT += dt;
  // Diagonal nicht schneller als geradeaus — VOR der Drehung (3D): sonst
  // fuehrt ein Rundungs-eps in cos/sin (z.B. cos(PI/2) = 6e-17) zur falschen Abbremsung.
  if (vx !== 0 && vy !== 0) { vx *= 0.7071; vy *= 0.7071; }
  if (DREI_D) { var mv = dreiDBewegung(sp, vx, vy); vx = mv[0]; vy = mv[1]; }   // Kamera-relativ (dreid.js)
  bewegeSpieler(sp, ebene, vx * dt, vy * dt);

  // Auf welcher Kachel steht der Spieler, und ist es die Treppe?
  var gx = Math.floor(sp.x / KACHEL), gy = Math.floor(sp.y / KACHEL);
  sp.aufTreppe = (kachelAn(ebene, gx, gy) === 2);
}
