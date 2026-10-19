// dorf.js — Hollenfurt: Karte, Bewohner, Ansprechen. Zeichnen: dorfgrafik.js, gebaeude.js.
// Das Dorf ist wie ein Dungeon aufgebaut (feld, begehbar()), damit Kollision und
// Treppe (= Tor der Abtei) dieselbe Logik nutzen.
// feld: 0 Wald/Fels, 1 Boden, 2 Abteitor (Treppe), 3 Haus, 4 Brunnen, 5 Baum.

var DORF = null;
var DORF_GEBAEUDE = [
  { art: "schmiede", x: 8,  y: 11, w: 6, h: 4, tuer: 3 },
  { art: "kapelle",  x: 34, y: 9,  w: 7, h: 6, tuer: 3 },
  { art: "haus",     x: 8,  y: 31, w: 5, h: 4, tuer: 2 },
  { art: "haus",     x: 35, y: 30, w: 5, h: 4, tuer: 2 }
];
// Gespraechspartner und Gegenstaende (Kachelmitte x/y). dialog(h) liefert die Seiten.
var DORF_DINGE = [
  { id: "kirche", art: "tuer", name: "Kirchentür", x: 37.5, y: 15.4, hinweis: "In die Kirche gehen", weg: function () { return !zustand.verfolgung; },
    dialog: function (h) { return [
      S("", "Die Tür der Kirche steht offen. Drinnen ist es kalt und still. Auf dem Boden liegt sein Hirtenstab, mitten im Gang, als hätte er ihn im Laufen fallen lassen."),
      S("", "Hinter dem Altar klafft die Falltür. Von unten kommt der Geruch von Kerzenwachs und Seife. Er ist dort hinabgestiegen, und er wartet.")]; } },
  { id: "ambros", art: "ambros", name: "Pfarrer Ambros", x: 22.1, y: 10.5, hinweis: "Hochwürden Ambros ansprechen", weg: function () { return zustand.verfolgung; },
    dialog: function (h) { return ambrosDorf(h); } },
  { id: "berta", art: "berta", name: "Berta", x: 28.5, y: 12.5, hinweis: "Berta, die Haushälterin, ansprechen",
    dialog: function (h) { return bertaGespraech(h); } },
  { id: "agnes", art: "agnes", name: "Mutter Agnes", x: 21.5, y: 24.5, hinweis: "Mutter Agnes ansprechen",
    dialog: function (h) { return dorfSeiten("agnes", h); } },
  { id: "schmied", art: "schmied", name: "Brandt", x: 12.5, y: 17.5, hinweis: "Brandt ansprechen",
    dialog: function (h) { return dorfSeiten("schmied", h); } },
  { id: "ilse", art: "ilse", name: "Schwester Ilse", x: 36.5, y: 17.5, hinweis: "Schwester Ilse ansprechen",
    dialog: function (h) { return dorfSeiten("ilse", h); } },
  { id: "tilda", art: "tilda", name: "Tilda", x: 28.5, y: 31.5, hinweis: "Tilda ansprechen",
    dialog: function (h) { return dorfSeiten("tilda", h); } },
  { id: "schrein", art: "schrein", name: "Kerze", x: 40.5, y: 17.5, hinweis: "Die Kerze ansehen",
    dialog: function (h) { return kerzenText(h, zustand.tode || 0); } },
  { id: "haus", art: "tuer", name: "Dein Haus", x: 10.5, y: 36.5, hinweis: "Zum eigenen Haus gehen",
    dialog: function (h) { return HAUS_TEXTE[h]; } }
];

function baueDorf() {
  var feld = [], weg = [], x, y;
  for (y = 0; y < RASTER; y++) {
    feld.push([]); weg.push([]);
    for (x = 0; x < RASTER; x++) { feld[y].push(0); weg[y].push(false); }
  }
  for (y = 7; y <= 43; y++) for (x = 5; x <= 44; x++) feld[y][x] = 1;
  function wegRect(x0, y0, w, h) { for (var yy = y0; yy < y0 + h; yy++) for (var xx = x0; xx < x0 + w; xx++) weg[yy][xx] = true; }
  wegRect(23, 7, 4, 37);                                   // Hauptweg zum Abteitor
  for (y = 18; y <= 28; y++) for (x = 18; x <= 32; x++) {   // Platz um den Brunnen
    var ex = (x - 25) / 7, ey = (y - 23) / 5;
    if (ex * ex + ey * ey <= 1) weg[y][x] = true;
  }
  wegRect(10, 15, 2, 3); wegRect(10, 16, 14, 2);            // Schmiede
  wegRect(36, 15, 2, 3); wegRect(26, 16, 12, 2);            // Kapelle
  wegRect(9, 35, 2, 3);  wegRect(9, 36, 15, 2);             // eigenes Haus
  wegRect(36, 34, 2, 3); wegRect(26, 35, 12, 2);            // Nachbarhaus
  for (x = 23; x <= 26; x++) feld[7][x] = 2;                // Tor der Abtei
  feld[22][24] = feld[22][25] = feld[23][24] = feld[23][25] = 4;   // Brunnen
  for (var i = 0; i < DORF_GEBAEUDE.length; i++) {
    var b = DORF_GEBAEUDE[i];
    for (y = b.y; y < b.y + b.h; y++) for (x = b.x; x < b.x + b.w; x++) feld[y][x] = 3;
  }
  var baeume = [];                                          // einzelne Baeume im Dorf, nie auf Wegen/Hoefen
  for (y = 8; y <= 43; y++) for (x = 5; x <= 44; x++) {
    if (feld[y][x] !== 1 || rausch(x, y, 5) < 0.915) continue;
    var frei = true;
    for (var dy = -2; dy <= 2 && frei; dy++) for (var dx = -2; dx <= 2; dx++) {
      var xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= RASTER || yy >= RASTER) continue;
      if (weg[yy][xx] || feld[yy][xx] === 3 || feld[yy][xx] === 2) { frei = false; break; }
    }
    for (var n = 0; n < DORF_DINGE.length && frei; n++)
      if (Math.abs(DORF_DINGE[n].x - x - 0.5) < 2.5 && Math.abs(DORF_DINGE[n].y - y - 0.5) < 2.5) frei = false;
    if (frei && !(y >= 34 && x >= 22 && x <= 27)) { feld[y][x] = 5; baeume.push({ x: x, y: y }); }
  }
  return { feld: feld, weg: weg, baeume: baeume, raeume: [], start: { x: 24, y: 39 },
           treppe: { x: 24, y: 7 }, ebenenNr: 0, gebaeude: DORF_GEBAEUDE };
}

// Naechstes ansprechbares Ding in Reichweite (Pixel), sonst null.
function naechstesDing(sp) {
  var best = null, bd = 50 * 50;
  for (var i = 0; i < DORF_DINGE.length; i++) {
    var d = DORF_DINGE[i], dx = d.x * KACHEL - sp.x, dy = d.y * KACHEL - sp.y;
    if (d.weg && d.weg()) continue;                           // z.B. Ambros nach seiner Flucht
    if (dx * dx + dy * dy < bd) { bd = dx * dx + dy * dy; best = d; }
  }
  return best;
}

// Ein Simulationsschritt im Dorf. fl = Tastenflanken. Gibt true zurueck,
// wenn das Tor betreten wird (spiel.js startet dann den Dungeon).
function dorfSchritt(z, dt, fl) {
  var sp = z.spieler, cam = kamera(BILD_B, BILD_H, sp);
  sp.blick = Math.atan2(MAUS.y / ZOOM + cam.y - sp.y, MAUS.x / ZOOM + cam.x - sp.x);
  spielerSchritt(sp, z.ebene, dt);
  for (var i = 0; i < DORF_DINGE.length; i++) {              // Bewohner sind nicht durchlaessig
    var d = DORF_DINGE[i];
    if (d.art === "schrein" || d.art === "tuer" || (d.weg && d.weg())) continue;
    var dx = sp.x - d.x * KACHEL, dy = sp.y - d.y * KACHEL, dd = Math.sqrt(dx * dx + dy * dy);
    if (dd < 16 && dd > 0.01 && !stoesstAn(z.ebene, sp.x + dx / dd * (16 - dd), sp.y + dy / dd * (16 - dd), sp.radius)) {
      sp.x += dx / dd * (16 - dd); sp.y += dy / dd * (16 - dd);
    }
  }
  var nah = naechstesDing(sp);
  z.hinweis = nah ? "E  —  " + nah.hinweis : (sp.aufTreppe ? "E  —  Hinab ins Archiv" : "");
  if (fl.e) {
    if (nah) dialogStart(nah.dialog(HELD), null, null);
    else if (sp.aufTreppe) return true;
  }
  return false;
}
