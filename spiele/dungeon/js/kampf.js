// kampf.js — Kampf: Zielen mit der Maus, Kombo (3 Schlaege), Wurfaxt,
// Ausweichschritt, Trefferpause, Bildwackeln, Schadenszahlen.
// Kein Modul; globale Funktionen. Setzt karte.js und spieler.js voraus,
// nutzt kamera() und SPRITES aus grafik.js (zur Laufzeit, Reihenfolge egal).

// ---- Mausaufnahme --------------------------------------------------------
var MAUS = { x: 480, y: 320, links: false, rechts: false,
             linksVorher: false, rechtsVorher: false };
var CANVAS = document.getElementById("spiel");
// Logische Bildgroesse: CANVAS.width ist der Pufferwert (mal devicePixelRatio) und taugt
// weder fuer Maus noch Kamera — auf HiDPI-Schirmen waren Zielen und Menueklicks verdoppelt.
var BILD_B = 960, BILD_H = 640;

function setzeMausPosition(e) {
  var r = CANVAS.getBoundingClientRect();
  MAUS.x = (e.clientX - r.left) * (BILD_B / r.width);
  MAUS.y = (e.clientY - r.top) * (BILD_H / r.height);
}
CANVAS.addEventListener("mousemove", setzeMausPosition);
CANVAS.addEventListener("mousedown", function (e) {
  setzeMausPosition(e);
  if (e.button === 0) MAUS.links = true;
  if (e.button === 2) MAUS.rechts = true;
  MAUS.klickZeit = null;               // eigener Klick loescht Test-Klickreste
});
window.addEventListener("mouseup", function (e) {
  if (e.button === 0) MAUS.links = false;
  if (e.button === 2) MAUS.rechts = false;
});
CANVAS.addEventListener("contextmenu", function (e) { e.preventDefault(); });

// Klicksignal fuer Tests: Taste kurz druecken, nach 60 ms automatisch loslassen.
// Der Timer gilt nur innerhalb derselben Partie (SPIEL.neu() verwirft ihn).
function mausklickTest(knopf) {
  var f = knopf === 2 ? "rechts" : "links";
  MAUS[f] = true;
  clearTimeout(MAUS.klickZeit);
  MAUS.klickZeit = setTimeout(function () { MAUS[f] = false; }, 60);
}

// ---- Konstanten zum Nachjustieren ---------------------------------------
var KOMBO_REICHWEITE = 58;    // Schlagreichweite in Pixeln (ab Spielermitte)
var KOMBO_BOGEN = 1.1;        // halber Oeffnungswinkel des Trefferbogens (rad)
var KOMBO_SCHLAGDAUER = 0.12; // Schwung so lange sichtbar
var KOMBO_PAUSE = 0.2;        // Abstand zwischen den Schlaegen
var AXT_TEMPO = 430;          // Wurfaxt in Pixel pro Sekunde
var AXT_FLUG = 0.6;           // Hinflug, dann Rueckkehr zum Werfer
var AXT_ABKLING = 1.5;        // Wurfabklingzeit
var DODGE_TEMPO = 430, DODGE_DAUER = 0.18;
var DODGE_UNVERW = 0.2;       // Unverwundbarkeit nach dem Ausweichen
var DODGE_ABKLING = 0.5, DODGE_KRAFT = 25;
var AUSDAUER_REGEN = 20;      // Ausdauer pro Sekunde (nach kurzer Pause)
var HITSTOP_MS = 40;          // Trefferpause: Simulation kurz einfrieren
var SCHUETTEL_MS = 90;        // Bildwackeln nach einem Treffer
// -------------------------------------------------------------------------

// Kampffelder am Spieler zuruecksetzen (bei Neustart und Ebenenwechsel).
function kampfZuruecksetzen(sp) {
  sp.blick = 0; sp.kombo = 0; sp.komboT = 0; sp.schlagAktiv = 0;
  sp.manaMax = (sp.held && sp.held.mana) || MANA_MAX; sp.mana = sp.manaMax; sp.novaCd = 0;   // zauber.js
  sp.sprung = null; sp.sprungH = 0; sp.axtT = 0; sp.dodgeT = 0; sp.dodgeCd = 0; sp.dodgeVx = 0; sp.dodgeVy = 0;
  sp.unverw = 0; sp.ausdauerT = 0;
}

function trefferFeedback(z) { z.hitstopMs = HITSTOP_MS; z.schuettelMs = SCHUETTEL_MS; }

function popup(z, x, y, txt, farbe) {
  z.popups.push({ x: x, y: y, txt: txt, farbe: farbe, t: 0.9 });
}

// Liegt Gegner g im Bogen des aktuellen Schwungs vor dem Spieler?
// bogen optional: breiterer Bogen fuer klassen.js (Wuchtschlag).
function imSchlagbogen(sp, g, bogen) {
  var offnung = bogen || KOMBO_BOGEN;
  var dx = g.x - sp.x, dy = g.y - sp.y;
  var d = Math.sqrt(dx * dx + dy * dy);
  if (d > (sp.reichweite || KOMBO_REICHWEITE) + g.radius) return false;
  if (d < 6) return true;
  var w = Math.atan2(dy, dx) - sp.blick;
  while (w > Math.PI) w -= TAU;
  while (w < -Math.PI) w += TAU;
  return Math.abs(w) <= offnung;
}

// Schlag ausfuehren: nr 1..3; der dritte Schlag wirft Gegner zurueck.
// Klassen-Boni (klassen.js): Baerengestalt (baer.js), Letzter Wille (niedriges Leben).
function schlageZu(sp, z, nr) {
  var schaden = (nr === 3 ? 2 : 1) + (sp.schadenPlus || 0);
  schaden += baerSchaden(sp);                            // Baerengestalt (baer.js)
  if (sp.leben < sp.lebenMax * 0.5) schaden += sp.skills.stufen.letzterwille || 0;
  var traf = false;
  for (var i = 0; i < z.gegner.length; i++) {
    var g = z.gegner[i];
    if (g.tot || !imSchlagbogen(sp, g)) continue;
    traf = true;
    schadenGegner(g, schaden, z, { bricht: nr === 3 });             // 3. Schlag zerbricht Schilde (gegner2.js)
    if (nr === 3) {
      var w = Math.atan2(g.y - sp.y, g.x - sp.x);
      g.kvx += Math.cos(w) * 300;
      g.kvy += Math.sin(w) * 300;
    }
  }
  if (traf) trefferFeedback(z);
}

// Wurfaxt: Hinflug, dann Rueckkehr; trifft jeden Gegner auf dem Hinweg UND auf dem Rueckweg einmal.
function axtSchritt(z, sp, ebene, dt) {
  var a = z.axt;
  if (!a) return;
  a.t += dt;
  if (a.t >= AXT_FLUG && !a.rueck) { a.rueck = true; a.getroffen = {}; }   // Rueckweg trifft jeden Gegner erneut
  var vx, vy;
  if (a.t < AXT_FLUG) {
    vx = a.vx; vy = a.vy;
  } else {
    var dx = sp.x - a.x, dy = sp.y - a.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    vx = dx / d * AXT_TEMPO; vy = dy / d * AXT_TEMPO;
    if (d < 14) { z.axt = null; return; }
  }
  a.x += vx * dt; a.y += vy * dt;
  if (!begehbar(ebene, Math.floor(a.x / KACHEL), Math.floor(a.y / KACHEL)))
    a.t = Math.max(a.t, AXT_FLUG);   // gegen Wand: sofort umkehren
  for (var i = 0; i < z.gegner.length; i++) {
    var g = z.gegner[i];
    if (g.tot || a.getroffen[g.id]) continue;      // pro Weg (hin / zurueck) einmal je Gegner
    var ex = g.x - a.x, ey = g.y - a.y;
    if (ex * ex + ey * ey < (g.radius + 9) * (g.radius + 9)) {
      a.getroffen[g.id] = true;
      schadenGegner(g, 2 + (sp.schadenPlus || 0), z);
      trefferFeedback(z);
    }
  }
}

// Pfeile fliegen, verpuffen an Waenden. Skelett-Pfeile treffen den Spieler;
// Spieler-Projektile (Blaetter, Blitz) treffen Gegner.
function pfeileSchritt(z, sp, ebene, dt) {
  for (var i = z.pfeile.length - 1; i >= 0; i--) {
    var p = z.pfeile[i];
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (!begehbar(ebene, Math.floor(p.x / KACHEL), Math.floor(p.y / KACHEL))) {
      z.pfeile.splice(i, 1);
      continue;
    }
    if (p.vonSpieler) {                                  // Blaetterwurf / Blitzstrahl (klassen.js)
      for (var q = 0; q < z.gegner.length; q++) {
        var g = z.gegner[q];
        if (g.tot) continue;
        var ex = g.x - p.x, ey = g.y - p.y;
        if (p.passed && p.passed[g.id]) continue;
        if (ex * ex + ey * ey < (g.radius + 5) * (g.radius + 5)) {
          schadenGegner(g, p.schaden || 1, z);
          trefferFeedback(z);
          if (p.blitz) { p.passed = p.passed || {}; p.passed[g.id] = true; continue; }   // Blitz durchschlaegt die Linie
          z.pfeile.splice(i, 1);                         // Blatt: ein Treffer, dann weg
          break;
        }
      }
      continue;
    }
    var dx = p.x - sp.x, dy = p.y - sp.y;
    if (!p.passed && dx * dx + dy * dy < (sp.radius + 3) * (sp.radius + 3)) {
      // Ausweichen (unverwundbar) laesst den Pfeil durchfliegen — er trifft
      // danach nicht erneut.
      if (playerTreffer(sp, p.schaden, z)) z.pfeile.splice(i, 1);
      else p.passed = true;
    }
  }
}

// Ein Simulationsschritt des Kampfes.
function kampfSchritt(sp, ebene, z, dt) {
  // Zielen: in 2D zur Maus; in 3D ist die Maus eine Schwenkgeschwindigkeit
  // (Maus rechts/links der Bildmitte dreht), Pfeiltasten drehen ebenfalls.
  if (DREI_D) {
    var mitte = BILD_B / 2, dm = MAUS.x - mitte;
    if (Math.abs(dm) > BILD_B * 0.06) sp.blick += (dm / mitte) * D3_SCHWENK * dt;
    if (TASTEN["arrowleft"]) sp.blick -= D3_SCHWENK * dt;
    if (TASTEN["arrowright"]) sp.blick += D3_SCHWENK * dt;
  } else {
    var cam = kamera(BILD_B, BILD_H, sp);
    var mx = MAUS.x / ZOOM + cam.x, my = MAUS.y / ZOOM + cam.y;   // Bild -> Welt
    sp.blick = Math.atan2(my - sp.y, mx - sp.x);
  }
  var adx = Math.cos(sp.blick), ady = Math.sin(sp.blick);
  sp.richtung = (Math.abs(adx) > Math.abs(ady)) ? (adx > 0 ? 2 : 1) : (ady > 0 ? 0 : 3);

  if (sp.komboT > 0) sp.komboT -= dt;
  if (sp.schlagAktiv > 0) sp.schlagAktiv -= dt;
  if (sp.axtT > 0) sp.axtT -= dt;
  if (sp.dodgeCd > 0) sp.dodgeCd -= dt;
  if (sp.unverw > 0) sp.unverw -= dt;

  // Kombo: Klick startet, gedrueckt halten haengt die naechsten Schlaege an.
  if (!MAUS.links) sp.kombo = 0;
  if (MAUS.links && sp.komboT <= 0 && sp.kombo < 3) {
    sp.kombo++;
    sp.komboT = KOMBO_PAUSE;
    sp.schlagAktiv = KOMBO_SCHLAGDAUER;
    schlageZu(sp, z, sp.kombo);
  }

  // Wurfaxt oder gewaehlte Faehigkeit per Rechtsklick (klassen.js leitet um)
  if (MAUS.rechts && !MAUS.rechtsVorher && !skillRechtsklick(sp, z) && sp.axtT <= 0 && !z.axt) {
    z.axt = { x: sp.x, y: sp.y, vx: adx * AXT_TEMPO, vy: ady * AXT_TEMPO,
              t: 0, getroffen: {} };
    sp.axtT = sp.axtAb || AXT_ABKLING;
  }
  klassenSchritt(sp, z, dt);                             // Abklingzeiten, Buffs, Erstarren
  fxSchritt(z, dt);                                      // Faehigkeitseffekte, Runenkreise (effekte.js)
  axtSchritt(z, sp, ebene, dt);

  // Ausweichschritt (Leertaste) in Bewegungsrichtung, sonst Blickrichtung
  if (TASTEN[" "] && sp.dodgeCd <= 0 && sp.dodgeT <= 0 && !sp.sprung && sp.ausdauer >= DODGE_KRAFT) {
    var vx = 0, vy = 0;
    if (TASTEN["w"]) vy -= 1;
    if (TASTEN["s"]) vy += 1;
    if (TASTEN["a"]) vx -= 1;
    if (TASTEN["d"]) vx += 1;
    if (DREI_D) { var dv = dreiDBewegung(sp, vx, vy); vx = dv[0]; vy = dv[1]; }   // Kamera-relativ (dreid.js)
    if (vx === 0 && vy === 0) { vx = adx; vy = ady; }
    var d = Math.sqrt(vx * vx + vy * vy);
    sp.dodgeVx = vx / d * DODGE_TEMPO;
    sp.dodgeVy = vy / d * DODGE_TEMPO;
    sp.dodgeT = DODGE_DAUER;
    sp.dodgeCd = DODGE_ABKLING;
    sp.unverw = Math.max(sp.unverw, DODGE_UNVERW);
    sp.ausdauer -= DODGE_KRAFT;
    sp.ausdauerT = 0.4;   // Regeneration setzt kurz aus
  }
  if (sp.dodgeT > 0) {
    bewegeSpieler(sp, ebene, sp.dodgeVx * dt, sp.dodgeVy * dt);
    sp.dodgeT -= dt;
  }
  sprungSchritt(sp, z, ebene, dt);                       // Wolfsprung im Flug (faehigkeiten.js)

  // Ausdauer regeneriert nach 0,4 s Pause
  if (sp.ausdauerT > 0) sp.ausdauerT -= dt;
  else if (sp.ausdauer < sp.ausdauerMax)
    sp.ausdauer = Math.min(sp.ausdauerMax, sp.ausdauer + AUSDAUER_REGEN * dt);

  pfeileSchritt(z, sp, ebene, dt);

  // Schadenszahlen steigen und verblassen
  for (var i = z.popups.length - 1; i >= 0; i--) {
    var p = z.popups[i];
    p.t -= dt; p.y -= 34 * dt;
    if (p.t <= 0) z.popups.splice(i, 1);
  }

  MAUS.linksVorher = MAUS.links;
  MAUS.rechtsVorher = MAUS.rechts;
}

// Kampf-Dynamik zeichnen: Schwungbogen, Axt, Pfeile, Traenke, Schadenszahlen.
function zeichneKampf(ctx, camX, camY, z) {
  var sp = z.spieler;
  zeichneNova(ctx, camX, camY, z);
  fxZeichnen(ctx, camX, camY, z);                        // Strahl, Druckwelle, Runenkreis ... (effekte.js)
  if (sp.schlagAktiv > 0) {
    ctx.save();
    ctx.globalAlpha = 0.5;                             // waehrend des ganzen Schwungs sichtbar
    ctx.fillStyle = sp.kombo === 3 ? "#ffd75a" : "#cfd6e6";
    ctx.beginPath();
    ctx.moveTo(sp.x - camX, sp.y - camY);
    ctx.arc(sp.x - camX, sp.y - camY, sp.reichweite || KOMBO_REICHWEITE,
            sp.blick - KOMBO_BOGEN, sp.blick + KOMBO_BOGEN);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  for (var i = 0; i < z.pfeile.length; i++) {
    var p = z.pfeile[i];
    if (p.orb) orbZeichnen(ctx, p.x - camX, p.y - camY);
    else if (p.blitz || p.blatt) {                     // Klassen-Geschosse (klassen.js)
      var w = Math.atan2(p.vy, p.vx), px = p.x - camX, py = p.y - camY;
      ctx.save(); ctx.translate(px, py); ctx.rotate(w);
      if (p.blitz) { glut(ctx, 0, 0, 26, "200,220,255", 0.5); lin(ctx, -16, 0, 10, 0, "#f2f6ff", 2.4); lin(ctx, -10, -3, 2, 3, "#9ec4ff", 1.4); }
      else { poly(ctx, [-7, 0, 0, -4, 8, 0, 0, 4], "#7ab04a"); lin(ctx, -6, 0, 7, 0, "#c8e89a", 1); }
      ctx.restore();
    }
    else SPRITES.pfeil.zeichnen(ctx, p.x - camX, p.y - camY, { winkel: Math.atan2(p.vy, p.vx) });
  }
  if (z.axt) SPRITES.axt.zeichnen(ctx, z.axt.x - camX, z.axt.y - camY, { zeit: z.axt.t });
  for (var kb = 0; z.beute && kb < z.beute.length; kb++) beuteZeichnen(ctx, z.beute[kb].x - camX, z.beute[kb].y - camY, z.beute[kb]);
  for (var k = 0; k < z.traenke.length; k++)
    SPRITES.traenk.zeichnen(ctx, z.traenke[k].x - camX, z.traenke[k].y - camY, null);
  ctx.save();
  ctx.font = "bold 15px Georgia, serif";
  ctx.textAlign = "center";
  for (var j = 0; j < z.popups.length; j++) {
    var q = z.popups[j];
    ctx.globalAlpha = Math.max(0, Math.min(1, q.t / 0.4));
    ctx.fillStyle = q.farbe;
    ctx.fillText(q.txt, q.x - camX, q.y - camY);
  }
  ctx.restore();
}
