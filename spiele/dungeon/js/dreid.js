// dreid.js — 3D-Ansicht des Dungeons: First-Person-Raycasting, Taste V schaltet um.
// Die Welt bleibt unveraendert (Kollision, Kampf, Nebel wie in 2D); nur das Zeichnen
// ersetzt die Draufsicht durch eine Perspektive: ein Strahl je Bildspalte (DDA durch
// das Kachelraster), Boden/Decke als entfernungsabhaengige Zeilen, Figuren als
// Billboard-Sprites mit Tiefenpuffer (nichts schaut durch Waende). Nur Canvas-Formen.
// Setzt sprites.js (palette, rausch, ell), karte.js (kachelAn), grafik.js (lichtRadius)
// und die Figuren-Zeichner (figuren.js, bossgrafik.js, zauber.js) voraus.

var DREI_D = false;              // 3D-Ansicht an? (spiel.js schaltet per Taste V)
var D3_SCHWEITE = Math.PI / 3;   // Bildwinkel (FOV)
var D3_SCHWENK = 2.6;            // Drehgeschwindigkeit (rad/s): Pfeiltasten / Maus
var D3_COL = 2;                  // ein Strahl je 2 Bildpixel (Leistung)
var D3_TIEFE = 120;              // hoechste Strahlschritte (Kacheln)

function dreiDUmschalten() { DREI_D = !DREI_D; }

// WASD-Eingabe in Weltkoordinaten drehen: W laeuft in Blickrichtung, D seitwaerts.
function dreiDBewegung(sp, vx, vy) {
  var c = Math.cos(sp.blick), s = Math.sin(sp.blick);
  var vor = -vy, seit = vx;                       // w vorwaerts, d rechts
  return [vor * c - seit * s, vor * s + seit * c];
}

// Helligkeit 0..1 nach Entfernung (Fackel des Spielers), weicher Abfall.
function d3Licht(d, LR) {
  if (d >= LR) return 0.05;
  var f = 1 - d / LR;
  return 0.05 + 0.95 * f * f * (3 - 2 * f);
}

// Kachelfarbe mal Licht (0..1) plus kleine Variantenschiebung v.
function d3Farbe(c, f, v) {
  return "rgb(" + Math.max(0, Math.round(c[0] * f + v)) + "," +
                  Math.max(0, Math.round(c[1] * f + v)) + "," +
                  Math.max(0, Math.round(c[2] * f + v)) + ")";
}

// Mauerkachel? (Boden und Treppe nicht; Geheimraum von aussen durchsichtig)
function d3Wand(ebene, gx, gy, geheimInnen) {
  var k = kachelAn(ebene, gx, gy);
  if (k === 1 || k === 2 || k === TUER) return false;
  if (ebene.geheim && !geheimInnen) {
    var gr = ebene.geheim.rahmen;
    if ((gx + 1) * KACHEL > gr.x0 && gx * KACHEL < gr.x1 && (gy + 1) * KACHEL > gr.y0 && gy * KACHEL < gr.y1) return false;
  }
  return true;
}

// Alles, was als Billboard in die 3D-Ansicht gehoert (Position + Zeichner + Breite).
function d3Ents(z, ebene, sp, geheimInnen) {
  var list = [], i;
  if (!z) return list;
  for (i = 0; i < z.gegner.length; i++) if (!z.gegner[i].tot) list.push({ x: z.gegner[i].x, y: z.gegner[i].y, art: "gegner", a: z.gegner[i], w: 30 });
  var innen = ebene.geheim ? geheimInnen : true;
  for (i = 0; z.funde && i < z.funde.length; i++) {
    var fu = z.funde[i];
    if (fu.geheim && !innen) continue;
    if (fu.art === "ambros" && fu.gelesen) continue;      // Gespraech vorbei: er steht nicht mehr da
    if (fu.art === "schluessel" && fu.verbraucht) continue;
    list.push({ x: fu.x, y: fu.y, art: "fund", a: fu, w: 24 });
  }
  for (i = 0; z.kerzen && i < z.kerzen.length; i++) list.push({ x: z.kerzen[i].x, y: z.kerzen[i].y, art: "kerze", a: z.kerzen[i], w: 12 });
  for (i = 0; z.beute && i < z.beute.length; i++) list.push({ x: z.beute[i].x, y: z.beute[i].y, art: "beute", a: z.beute[i], w: 20 });
  for (i = 0; z.traenke && i < z.traenke.length; i++) list.push({ x: z.traenke[i].x, y: z.traenke[i].y, art: "trank", a: z.traenke[i], w: 16 });
  if (z.axt) list.push({ x: z.axt.x, y: z.axt.y, art: "axt", a: z.axt, w: 22 });
  for (i = 0; z.pfeile && i < z.pfeile.length; i++) list.push({ x: z.pfeile[i].x, y: z.pfeile[i].y, art: "pfeil", a: z.pfeile[i], w: 18 });
  return list;
}

// Der eigentliche Billboard-Zeichner: die 2D-Zeichner bekommen (0,0) als Anker,
// weil die Kamera-Transformation bereits auf das Sprite gerechnet ist.
function d3Sprich(ctx, e) {
  // Die Billboard-Transformation hat (0,0) bereits auf die Bildschirmposition des
  // Sprites gesetzt. Die 2D-Zeichner rechnen aber intern (x - camX): damit die
  // Subtraktion 0 ergibt, uebergeben wir die Eigenposition als Kamera-Offset.
  switch (e.art) {
    case "gegner": gegnerZeichnen(ctx, e.a, e.a.x, e.a.y); break;
    case "fund": fundZeichnen(ctx, e.a, e.a.x, e.a.y); break;
    case "kerze": kerzeZeichnen(ctx, e.a, e.a.x, e.a.y); break;
    case "axt": SPRITES.axt.zeichnen(ctx, 0, 0, { zeit: e.a.t }); break;
    case "pfeil": if (e.a.orb) orbZeichnen(ctx, 0, 0);
                  else SPRITES.pfeil.zeichnen(ctx, 0, 0, { winkel: Math.atan2(e.a.vy, e.a.vx) }); break;
    case "beute": beuteZeichnen(ctx, 0, 0, e.a); break;
    case "trank": SPRITES.traenk.zeichnen(ctx, 0, 0, null); break;
  }
}

function zeichne3D(ctx, breite, hoehe, ebene, sp, nebel, z) {
  ANIM = performance.now() / 1000;
  var pal = palette(ebene.ebenenNr);
  var horizont = hoehe / 2;
  var LR = lichtRadius(sp) * (1 + Math.sin(ANIM * 8) * 0.012 + Math.sin(ANIM * 19) * 0.008);
  ctx.fillStyle = "#000"; ctx.fillRect(0, 0, breite, hoehe);
  ctx.save();
  if (z && z.schuettelMs > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6);

  var dirX = Math.cos(sp.blick), dirY = Math.sin(sp.blick);
  var F = Math.tan(D3_SCHWEITE / 2);
  var planeX = -dirY * F, planeY = dirX * F;
  var geheimInnen = ebene.geheim ? imGeheim(ebene, sp) : true;
  var zbuf = zeichne3D.zbuf && zeichne3D.zbuf.length === breite ? zeichne3D.zbuf : (zeichne3D.zbuf = []);
  var col, i, s, e;

  // Decke: dunkel, nur ein schwacher warmer Schein von der Fackel des Spielers.
  var dg = ctx.createRadialGradient(breite / 2, horizont, 10, breite / 2, horizont, hoehe * 0.9);
  dg.addColorStop(0, "rgba(255,185,115,0.06)"); dg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = pal.oben; ctx.fillRect(0, 0, breite, horizont + 1);   // Horizontzeile mitdecken
  ctx.fillStyle = dg; ctx.fillRect(0, 0, breite, horizont + 1);

  // Boden: Zeilen von nah (unten, hell) nach fern (horizontnah, dunkel).
  for (var y = hoehe - 1; y > horizont; y--) {
    var p = y - horizont;
    var dist = (0.5 * hoehe / p) * KACHEL;
    var f = d3Licht(dist, LR);
    if (f <= 0.06) break;                            // weiter hinten bleibt schwarz
    var v = (rausch(3, y, 7) - 0.5) * 12 * f;
    ctx.fillStyle = d3Farbe(pal.boden, f, v);
    ctx.fillRect(0, y, breite, 1);
  }

  // Waende: ein Strahl je D3_COL Bildpixel (DDA), Fugen und Seitenschattierung.
  for (col = 0; col < breite; col += D3_COL) {
    var camC = 2 * col / breite - 1;
    var rayX = dirX + planeX * camC, rayY = dirY + planeY * camC;
    var ddx = Math.abs(1 / rayX), ddy = Math.abs(1 / rayY);
    var mapX = Math.floor(sp.x / KACHEL), mapY = Math.floor(sp.y / KACHEL);
    var stepX = rayX < 0 ? -1 : 1, stepY = rayY < 0 ? -1 : 1;
    var sdX = (rayX < 0 ? (sp.x / KACHEL - mapX) : (mapX + 1 - sp.x / KACHEL)) * ddx;
    var sdY = (rayY < 0 ? (sp.y / KACHEL - mapY) : (mapY + 1 - sp.y / KACHEL)) * ddy;
    var side = 0, dist = 0, hit = false;
    for (var st = 0; st < D3_TIEFE; st++) {
      if (sdX < sdY) { dist = sdX; sdX += ddx; mapX += stepX; side = 0; }
      else { dist = sdY; sdY += ddy; mapY += stepY; side = 1; }
      if (d3Wand(ebene, mapX, mapY, geheimInnen)) { hit = true; break; }
    }
    if (!hit) dist = D3_TIEFE;
    var linH = hoehe / Math.max(0.05, dist);
    var oben = horizont - linH / 2;
    var fw = d3Licht(dist * KACHEL, LR);
    if (side === 1) fw *= 0.74;                      // Nord/Sued-Waende etwas dunkler
    if (fw > 1) fw = 1;
    // Quader-Mauerwerk: Fuge und Block-Nuance aus der Trefferposition je Strahl.
    var wx = side === 0 ? sp.y / KACHEL + dist * rayY : sp.x / KACHEL + dist * rayX;
    wx -= Math.floor(wx);
    var bl = (rausch(Math.floor(wx * 4), mapY * 7 + mapX, 9) - 0.5) * 0.12;
    var v = (rausch(mapX, mapY, 4) - 0.5) * 20 * fw;
    ctx.fillStyle = d3Farbe(pal.wand, fw * (1 + bl), v);
    ctx.fillRect(col, oben, D3_COL, linH);
    var fug = (wx < 0.05 || wx > 0.95) ? 0.42 : (wx < 0.1 || wx > 0.9) ? 0.18 : 0;
    if (fug && linH > 6) {                            // senkrechte Fugen zwischen Quadern
      ctx.fillStyle = "rgba(0,0,0," + fug.toFixed(2) + ")";
      ctx.fillRect(col, oben, D3_COL, linH);
    }
    if (linH > 10) {                                 // Quaderfugen und eine Lichtkante
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(col, oben, D3_COL, 1);
      ctx.fillRect(col, oben + linH * 0.5, D3_COL, 1);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(col, oben + 1.5, D3_COL, 1);
    }
    for (var zz = col; zz < col + D3_COL; zz++) if (zz < breite) zbuf[zz] = dist;
  }

  // Sprites: entfernungsrichtig projiziert, Clipping an der Tiefenpuffer-Wand.
  var ents = d3Ents(z, ebene, sp, geheimInnen);
  var invDet = 1 / (planeX * dirY - dirX * planeY);
  for (i = 0; i < ents.length; i++) {
    e = ents[i];
    var wx = (e.x - sp.x) / KACHEL, wy = (e.y - sp.y) / KACHEL;   // KACHEL-Einheiten: ty bleibt in Kacheln
    var tx = invDet * (dirY * wx - dirX * wy);
    var ty = invDet * (-planeY * wx + planeX * wy);
    if (ty < 0.12) continue;                         // hinter der Kamera
    e.ty = ty;
    e.sx = (breite / 2) * (1 + tx / ty);
    e.sk = hoehe / (ty * KACHEL);
    e.d = Math.sqrt(wx * wx + wy * wy);
    e.al = Math.min(1, d3Licht(e.d * KACHEL, LR) * 1.3 + 0.04);
  }
  ents.sort(function (a, b) { return b.ty - a.ty; });
  for (i = 0; i < ents.length; i++) {
    e = ents[i];
    if (e.al <= 0.05) continue;
    s = e.sk;
    var wPx = e.w * s, x0 = Math.floor(e.sx - wPx / 2), x1 = Math.ceil(e.sx + wPx / 2);
    ctx.save();
    ctx.beginPath();
    for (var cx = x0; cx < x1; cx += D3_COL)
      if (cx >= 0 && cx < breite && zbuf[cx] > e.ty) ctx.rect(cx, 0, D3_COL, hoehe);
    ctx.clip();
    ctx.globalAlpha = e.al;
    ctx.translate(e.sx, horizont + hoehe / (2 * e.ty));   // Fuesse auf dem Boden
    ctx.scale(s, s);
    ell(ctx, 0, 0, 10, 4, "rgba(0,0,0,0.4)");
    d3Sprich(ctx, e);
    ctx.restore();
  }

  // Nova-Ring: Kreis am Boden, perspektivisch gestaucht.
  if (z && z.nova) {
    var nx = (z.nova.x - sp.x) / KACHEL, ny = (z.nova.y - sp.y) / KACHEL;   // in Kacheln (Bugfix: wie Sprites)
    var ntx = invDet * (dirY * nx - dirX * ny), nty = invDet * (-planeY * nx + planeX * ny);
    if (nty > 0.1) {
      var nsx = (breite / 2) * (1 + ntx / nty), nsy = horizont + hoehe / (2 * nty);
      var nr = z.nova.r * hoehe / (nty * KACHEL);
      var nd = Math.sqrt(nx * nx + ny * ny) * KACHEL;
      ctx.globalAlpha = Math.max(0.15, d3Licht(nd, LR));
      ctx.strokeStyle = "rgba(255,210,130,0.85)";
      ctx.lineWidth = Math.max(1, 3 * hoehe / (nty * KACHEL));
      ctx.beginPath(); ctx.ellipse(nsx, nsy, nr, nr * 0.35, 0, 0, TAU); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  // Schadenszahlen: Billboard-Text ueber dem Bodenpunkt.
  if (z && z.popups && z.popups.length) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "bold 15px Georgia, serif";
    for (i = 0; i < z.popups.length; i++) {
      var pu = z.popups[i];
      var px = (pu.x - sp.x) / KACHEL, py = (pu.y - sp.y) / KACHEL;   // in Kacheln (Bugfix: wie Sprites)
      var ptx = invDet * (dirY * px - dirX * py), pty = invDet * (-planeY * px + planeX * py);
      if (pty < 0.15) continue;
      var psx = (breite / 2) * (1 + ptx / pty), psk = hoehe / (pty * KACHEL);
      var psy = horizont + hoehe / (2 * pty) - 30 * psk;
      ctx.globalAlpha = Math.max(0, Math.min(1, pu.t / 0.4));
      ctx.font = "bold " + Math.max(9, Math.min(34, 15 * psk)).toFixed(0) + "px Georgia, serif";
      ctx.fillStyle = pu.farbe;
      ctx.fillText(pu.txt, psx, psy);
    }
    ctx.restore();
  }
  ctx.restore();                                     // Bildwackeln zuruecknehmen

  // Kennzeichnung: 3D-Ansicht aktiv (V schaltet zurueck in die Draufsicht).
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "11px Georgia, serif";
  ctx.textAlign = "right";
  ctx.fillText("3D  (V: Draufsicht)", breite - 10, 18);
  ctx.textAlign = "left";
}

// Waffe des Spielers: wird von spiel.js NACH der Vignette aufgerufen, damit die
// Abdunkelung am Bildrand das Schwert nicht unsichtbar macht (POV-Bugfix).
function zeichne3DWaffe(ctx, breite, hoehe, z) {
  var sp = z.spieler;
  var wob = sp.geht ? Math.sin(sp.gehT * 10) * 5 : Math.sin(ANIM * 2) * 1.5;
  var sw = sp.schlagAktiv > 0 ? 1 - sp.schlagAktiv / KOMBO_SCHLAGDAUER : 0;
  var bx = breite * 0.78, by = hoehe * 0.92 + wob;
  var wa = -1.35 + sw * 1.9;                         // Arm-Schwung
  var ax = bx + Math.cos(wa) * 230, ay = by + Math.sin(wa) * 230;
  lin(ctx, bx, by, bx + Math.cos(wa) * 95, by + Math.sin(wa) * 95, "#b0895a", 13);   // Arm
  lin(ctx, bx + Math.cos(wa) * 82, by + Math.sin(wa) * 82, ax, ay, "#c9d1de", 15);   // Klinge
  lin(ctx, bx + Math.cos(wa) * 95, by + Math.sin(wa) * 95, ax, ay, "#eef2f8", 4);    // Klingenhochlicht
  lin(ctx, bx + Math.cos(wa) * 76, by + Math.sin(wa) * 76, bx + Math.cos(wa) * 90, by + Math.sin(wa) * 90, "#8a6b3a", 20);
}
