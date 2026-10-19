// grafik.js — Dungeon zeichnen: Kamera mit Zoom, Licht, Nebel, Fackeln,
// Figuren nach Tiefe sortiert. Nur Canvas-Formen. Sprites: sprites.js, figuren.js.
// Weltkoordinaten sind Pixel (Kachel = 32); alles wird mit ZOOM vergroessert.

// ---- Konstanten zum Nachjustieren -------------------------------------
var ZOOM_DUNGEON = 2;        // Vergroesserung der Welt im Dungeon
var ZOOM_DORF = 1.6;         // im Dorf etwas weiter weg, damit Haeuser ins Bild passen
var ZOOM_KAMMER = 1.3;       // im Bosssaal weiter weg: der ganze Saal muss ins Bild (Angriffe lesbar)
var ZOOM = ZOOM_DUNGEON;     // aktueller Wert (spiel.js stellt beim Phasenwechsel um)
var LICHT_RADIUS = 220;      // Weltpixel um den Spieler herum
var NEBEL_ALPHA = 0.35;      // Helligkeit besuchter, aber nicht beleuchteter Felder
// -----------------------------------------------------------------------

function lichtRadius(sp) { return LICHT_RADIUS + (sp && sp.licht ? sp.licht : 0) + (sp && sp.lichtBonus ? sp.lichtBonus : 0); }   // lichtBonus: Fackelschein + Gegenstaende (fehlte zuvor)

function neuerNebel() {
  var f = [];
  for (var y = 0; y < RASTER; y++) {
    var z = [];
    for (var x = 0; x < RASTER; x++) z.push(false);
    f.push(z);
  }
  return f;
}

// Alle Kacheln innerhalb des Lichtradius als besucht markieren.
function nebelAktualisieren(nebel, sp) {
  var gx = Math.floor(sp.x / KACHEL), gy = Math.floor(sp.y / KACHEL);
  var lr = lichtRadius(sp), r = Math.ceil(lr / KACHEL);
  for (var y = gy - r; y <= gy + r; y++) {
    for (var x = gx - r; x <= gx + r; x++) {
      if (x < 0 || y < 0 || x >= RASTER || y >= RASTER) continue;
      var mx = (x + 0.5) * KACHEL - sp.x, my = (y + 0.5) * KACHEL - sp.y;
      if (mx * mx + my * my <= lr * lr) nebel[y][x] = true;
    }
  }
}

// Kameraposition in Weltpixeln (ohne Wackeln). Sichtfeld = Bild / ZOOM.
// Auch fuer die Maus-Zielrechnung in kampf.js: Welt = Bild / ZOOM + kamera.
function kamera(breite, hoehe, sp) {
  var welt = RASTER * KACHEL, sb = breite / ZOOM, sh = hoehe / ZOOM;
  function einrasten(v) { return Math.round(v * ZOOM) / ZOOM; }   // Bildpixel-genau: keine Nahtlinien
  return { x: einrasten(Math.max(0, Math.min(sp.x - sb / 2, welt - sb))),
           y: einrasten(Math.max(0, Math.min(sp.y - sh / 2, welt - sh))) };
}

// Ankuendigungen der Gegner: roter Hiebbogen (Zombie), rote Ziellinie (Skelett).
function zeichneAnkkuendigung(ctx, camX, camY, g) {
  if (NEUE_ARTEN[g.art]) { zeichneAnkNeu(ctx, camX, camY, g); return; }   // gegner2.js / gegnerbilder.js
  if (g.zustand !== "ank") return;
  var sx = g.x - camX, sy = g.y - camY;
  var f = Math.max(0, Math.min(1, g.t / (g.art === "zombie" ? (g.ankZeit || ZOMBIE_ANK) : SKELETT_ANK)));
  ctx.save();
  ctx.globalAlpha = 0.45 + 0.35 * (1 - f);             // wird zum Schlag hin staerker
  if (g.art === "zombie") {
    ctx.fillStyle = "#d94438";                         // Hiebbogen: hell genug auf dunklem Boden
    ctx.beginPath(); ctx.moveTo(sx, sy - 12);
    ctx.arc(sx, sy - 12, g.reich || ZOMBIE_REICH, g.blick - 0.8, g.blick + 0.8);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#ff7a60";                       // Aussenkante: Grenze des Gefahrenbereichs
    ctx.beginPath(); ctx.arc(sx, sy - 12, g.reich || ZOMBIE_REICH, g.blick - 0.8, g.blick + 0.8); ctx.stroke();
  } else {
    ctx.strokeStyle = "#d94438"; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
    ctx.beginPath(); ctx.moveTo(sx, sy - 12);
    ctx.lineTo(sx + Math.cos(g.zielW) * SKELETT_ABST_OBEN,
               sy - 12 + Math.sin(g.zielW) * SKELETT_ABST_OBEN);
    ctx.stroke();
    ctx.setLineDash([]); ctx.lineWidth = 1;
  }
  ctx.restore();
}

// Fackel an einer Mauerkachel, die einen Boden unter sich hat (deterministisch).
function fackelAn(ebene, gx, gy) {
  return kachelAn(ebene, gx, gy) === 0 && begehbar(ebene, gx, gy + 1) &&
         rausch(gx, gy, 9) > 0.8 && (gx % 3 !== 0);
}

function kachelZeichnen(ctx, ebene, gx, gy, camX, camY, alpha) {
  var k = ebene.feld[gy][gx];
  if (ebene.geheim && !ebene.geheim.innen) {                       // Geheimraum: von aussen unsichtbar (kammer.js)
    var gr = ebene.geheim.rahmen;
    if ((gx + 1) * KACHEL > gr.x0 && gx * KACHEL < gr.x1 && (gy + 1) * KACHEL > gr.y0 && gy * KACHEL < gr.y1) return;
  }
  var info = { gx: gx, gy: gy, ebene: ebene.ebenenNr, flaeche: k === 0 && begehbar(ebene, gx, gy + 1), typ: raumTypAn(ebene, gx, gy), gesperrt: k === 2 && treppeGesperrt(ebene) };
  var sx = gx * KACHEL - camX, sy = gy * KACHEL - camY;
  ctx.save();
  ctx.globalAlpha = alpha;
  if (k === TUER) {                                                 // Tuer: Durchgang N-S oder O-W, Pfosten an der Wandseite
    info.nordSued = begehbar(ebene, gx, gy - 1) && begehbar(ebene, gx, gy + 1);
    info.wandL = !begehbar(ebene, gx - 1, gy); info.wandR = !begehbar(ebene, gx + 1, gy);
    info.wandO = !begehbar(ebene, gx, gy - 1); info.wandU = !begehbar(ebene, gx, gy + 1);
    SPRITES.boden.zeichnen(ctx, sx, sy, info); SPRITES.tuer.zeichnen(ctx, sx, sy, info);
  }
  else if (k === 0) SPRITES.wand.zeichnen(ctx, sx, sy, info);
  else if (k === 2) SPRITES.treppe.zeichnen(ctx, sx, sy, info);
  else SPRITES.boden.zeichnen(ctx, sx, sy, info);
  ctx.restore();
}

// Hauptzeichenfunktion: Kamera folgt dem Spieler, alles draussen schwarz.
// z (Spielzustand mit gegner/axt/pfeile/traenke/popups/funde) ist optional.
function zeichne(ctx, breite, hoehe, ebene, sp, nebel, z) {
  ANIM = performance.now() / 1000;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, breite, hoehe);

  if (ebene.geheim) imGeheim(ebene, sp);
  var cam = kamera(breite, hoehe, sp);
  if (z && z.schuettelMs > 0) {                        // Bildwackeln nach Treffern
    cam.x += (Math.random() - 0.5) * 3;
    cam.y += (Math.random() - 0.5) * 3;
  }
  var camX = cam.x, camY = cam.y, sb = breite / ZOOM, sh = hoehe / ZOOM;
  var gx0 = Math.floor(camX / KACHEL), gy0 = Math.floor(camY / KACHEL);
  var gx1 = Math.ceil((camX + sb) / KACHEL), gy1 = Math.ceil((camY + sh) / KACHEL);
  var gx, gy;
  var LR = lichtRadius(sp) * (1 + Math.sin(ANIM * 8) * 0.012 + Math.sin(ANIM * 19) * 0.008);

  ctx.save();
  ctx.scale(ZOOM, ZOOM);

  // 1) Nebel-Pass: besuchte Kacheln schemenhaft — auch ausserhalb des Lichts.
  for (gy = gy0; gy <= gy1; gy++) {
    for (gx = gx0; gx <= gx1; gx++) {
      if (gx < 0 || gy < 0 || gx >= RASTER || gy >= RASTER || !nebel[gy][gx]) continue;
      var mx = (gx + 0.5) * KACHEL - sp.x, my = (gy + 0.5) * KACHEL - sp.y;
      if (mx * mx + my * my <= LR * LR) continue;      // uebernimmt Pass 2
      kachelZeichnen(ctx, ebene, gx, gy, camX, camY, NEBEL_ALPHA);
    }
  }

  // 2) Licht-Pass: alles im Lichtradius, durch einen runden Ausschnitt begrenzt.
  var px = sp.x - camX, py = sp.y - camY;
  ctx.save();
  ctx.beginPath(); ctx.arc(px, py, LR, 0, TAU); ctx.clip();
  for (gy = gy0; gy <= gy1; gy++)
    for (gx = gx0; gx <= gx1; gx++)
      if (gx >= 0 && gy >= 0 && gx < RASTER && gy < RASTER) kachelZeichnen(ctx, ebene, gx, gy, camX, camY, 1);

  var ents = [];                                       // alles mit Tiefe: nach y sortiert zeichnen
  if (z) {
    for (var i = 0; i < z.gegner.length; i++) {
      var g = z.gegner[i];
      if (g.tot && g.art === "ambros") { bossLeiche(ctx, g.x - camX, g.y - camY); continue; }
      if (g.tot) {                                     // Leiche bleibt als dunkler Fleck liegen
        ell(ctx, g.x - camX, g.y - camY + 2, 12, 5, "rgba(70,10,12,0.55)");
        if (g.art === "skelett") lin(ctx, g.x - camX - 6, g.y - camY, g.x - camX + 7, g.y - camY + 3, "#bdb7a2", 2);
        continue;
      }
      zeichneAnkkuendigung(ctx, camX, camY, g);
      ents.push({ y: g.y, f: gegnerZeichnen, a: g });
    }
    var geheimInnen = ebene.geheim && imGeheim(ebene, sp);
    for (var q = 0; z.funde && q < z.funde.length; q++) if (!z.funde[q].geheim || geheimInnen) ents.push({ y: z.funde[q].y, f: fundZeichnen, a: z.funde[q] });
    for (var kk = 0; z.kerzen && kk < z.kerzen.length; kk++) ents.push({ y: z.kerzen[kk].y, f: kerzeZeichnen, a: z.kerzen[kk] });
    zeichneGefahren(ctx, camX, camY, z);
  }
  ents.push({ y: sp.y, f: spielerZeichnen, a: sp });
  ents.sort(function (a, b) { return a.y - b.y; });
  for (var e = 0; e < ents.length; e++) ents[e].f(ctx, ents[e].a, camX, camY);

  for (var m = 0; m < 26; m++) {                       // Staub im Licht
    var dx = ((rausch(m, 1, 5) * sb * 1.4 + ANIM * (5 + m % 5 * 3)) % (sb * 1.4)) - sb * 0.2;
    var dy = (rausch(m, 2, 5) * sh + Math.sin(ANIM * 0.6 + m) * 6 + ANIM * 3) % sh;
    ctx.fillStyle = "rgba(255,235,190," + (0.1 + rausch(m, 3, 5) * 0.18) + ")";
    ctx.fillRect(dx, dy, 1, 1);
  }
  // Licht faellt zum Rand auf die Helligkeit des Nebels ab -> nahtloser Uebergang
  var gd = ctx.createRadialGradient(px, py - 10, LR * 0.12, px, py - 10, LR);
  gd.addColorStop(0, "rgba(0,0,0,0)"); gd.addColorStop(0.55, "rgba(0,0,0,0.2)");
  gd.addColorStop(1, "rgba(4,3,8," + (1 - NEBEL_ALPHA) + ")");
  ctx.fillStyle = gd; ctx.fillRect(0, 0, sb, sh);
  var wg = ctx.createRadialGradient(px, py - 10, 4, px, py - 10, LR * 0.8);   // warmer Schimmer
  wg.addColorStop(0, "rgba(255,200,130,0.12)"); wg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = wg; ctx.fillRect(0, 0, sb, sh);
  ctx.restore();

  // 3) Fackeln leuchten auch aus dem Nebel heraus (nur bereits gesehene Kacheln).
  var pal = palette(ebene.ebenenNr);
  for (gy = gy0; gy <= gy1; gy++) {
    for (gx = gx0; gx <= gx1; gx++) {
      if (gx < 0 || gy < 0 || gx >= RASTER || gy >= RASTER || !nebel[gy][gx] || !fackelAn(ebene, gx, gy)) continue;
      var fx = gx * KACHEL + 16 - camX, fy = gy * KACHEL + 22 - camY;
      rc(ctx, fx - 1.5, fy - 2, 3, 9, "#4a3220"); rc(ctx, fx - 3, fy - 4, 6, 3, "#2a1c12");
      flamme(ctx, fx, fy - 4, 3.2, gx * 7 + gy);
      glut(ctx, fx, fy, 78 + Math.sin(ANIM * 10 + gx) * 5, pal.glut, 0.34);
    }
  }
  ctx.restore();
}

// ---- Zeichenfunktionen fuer die Tiefensortierung ----------------------------
function gegnerZeichnen(ctx, g, camX, camY) {
  if (g.art === "ambros") { bossZeichnen(ctx, g, camX, camY); return; }
  if (g.boss) { waechterZeichnen(ctx, g, camX, camY); return; }
  var spr = SPRITES[g.art] || SPRITES.skelett;            // zombie, spinne, skelett, schildtraeger, brecher, beschwoerer
  if (g.elite) {                                       // Elite (raeume.js): groesser, rotes Leuchten
    var ex = g.x - camX, ey = g.y - camY;
    glut(ctx, ex, ey - 14, 46, "255,70,50", 0.35 + Math.sin(ANIM * 5) * 0.08);
    ctx.save(); ctx.translate(ex, ey); ctx.scale(1.22, 1.22); spr.zeichnen(ctx, 0, 0, g); ctx.restore();
  } else spr.zeichnen(ctx, g.x - camX, g.y - camY, g);
  if (g.leben < g.lebenMax) {                          // Lebensbalken nur nach Treffern
    var bx = g.x - camX - 11, by = g.y - camY - 44;
    rc(ctx, bx - 1, by - 1, 24, 5, "rgba(0,0,0,0.7)");
    rc(ctx, bx, by, 22 * Math.max(0, g.leben / g.lebenMax), 3, "#c0392b");
  }
}
function fundZeichnen(ctx, f, camX, camY) {
  if (raumFundZeichnen(ctx, f, camX, camY)) return;     // Schluessel, Truhe, Altar (raeume.js)
  if (f.art === "ambros" && f.flucht) bossZeichnen(ctx, { x: f.x, y: f.y, stufe: f.stufe, verfall: f.stufe, flucht: true, pause: 0, trefferBlink: 0, verwandelT: 0 }, camX, camY);
  else if (f.art === "ambros") begegnungZeichnen(ctx, f, camX, camY);
  else if (f.art === "zauber") zauberBuchZeichnen(ctx, f, camX, camY);
  else if (f.art === "kammer" || f.art === "teppich") kammerZeichnen(ctx, f, camX, camY);
  else SPRITES.buch.zeichnen(ctx, f.x - camX, f.y - camY, f);
}
function spielerZeichnen(ctx, sp, camX, camY) {
  var px = sp.x - camX, py = sp.y - camY;
  figurZeichnen(ctx, px, py, sp);                      // Mensch, Baer oder Verwandlung (baer.js)
  if (sp.unverw > 0) {                                 // Ausweichen: kurzer Schimmer
    ctx.strokeStyle = "rgba(160,200,255,0.6)";
    ctx.beginPath(); ctx.arc(px, py - 14, 16, 0, TAU); ctx.stroke();
  }
}
