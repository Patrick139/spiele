// kammer.js — Die Privatkammer des Ambros auf Ebene 1.
// Ein Raum, der zu gut eingerichtet ist fuer einen Keller: roter Samt, Kerzen, Zuckerwerk.
// Nichts wird gezeigt oder ausgesprochen. Der Spieler sieht Dinge und versteht, was sie bedeuten.
// Kein Modul; globale Funktionen. Setzt geschichte.js (S), held.js (HELDEN), sprites.js (Zeichenhilfen) voraus.

function kammerTexte(h) {
  var person = HELDEN[h].person;
  return {
    sessel: [
      S("", "Ein Sessel aus rotem Samt, viel zu gut für einen Keller. Die Armlehnen sind blank gescheuert. Davor steht ein zweiter Stuhl, ein kleiner, auf dem ein Kind gerade so die Füße baumeln lassen könnte."),
      S("", "Die Stühle stehen einander zugewandt. In jeder Kirche, die du kennst, schauen alle Stühle zum Altar.")
    ],
    tisch: [
      S("", "Ein Tischchen mit einer Schale Zuckerwerk, frisch, nicht älter als ein, zwei Tage. Daneben ein Krug Wein und ein einziger Becher."),
      S("", "Auf dem Deckel der Schale steht in schöner Schrift: „Für die Braven.“ Jemand erneuert den Zucker regelmäßig. Das ist die Art Sorgfalt, die man nicht für sich selbst aufbringt.")
    ],
    schrank: [
      S("", "Ein Glasschrank, von innen mit dunklem Stoff verhängt. Der Schlüssel steckt. Er hat nie jemanden gefürchtet, der hier hereinkommen könnte."),
      S("", "Darin, auf Samt gebettet: Haarschleifen. Ein Holzpferd, ein Schnitzmesser, ein einzelner Kinderschuh. An jedem Stück hängt ein Zettel mit Namen und Datum."),
      S("", "Ganz hinten ein leerer Haken, daran ein Zettel: „" + person + "“. Noch nichts darunter. Du nimmst den Zettel ab und steckst ihn ein. Dir ist, als würdest du etwas aufhalten.")
    ],
    pult: [
      S("Hausbuch", "Ein Schreibpult mit einem dicken Buch. Spalten: Name, Datum, Vermerk. Seine Schrift, ordentlich und klein. Die Vermerke sind kurz."),
      S("Hausbuch", "„ist brav.“ — „weint nachts, redet noch nicht.“ — „hat der Mutter etwas gesagt. Mutter besucht, Acker am Fluss.“ — „spricht nicht mehr mit mir. Hat ein anderes Kind mitgebracht.“"),
      S("", "Die Einträge reichen dreißig Jahre zurück. Einige der Namen kennst du von Grabsteinen.")
    ],
    werktisch: [
      S("", "Auf einem sauberen Tuch, ordentlich nebeneinander: ein Maßband mit Kerben. Eine kleine Waage. Eine Sanduhr. Ein Glasröhrchen mit getrockneten Kräutern. Ein Stück Kreide."),
      S("", "Zu jedem Gegenstand ein Kärtchen mit seinem Namen und einer Zahl. Er hat gezählt und gemessen, wie ein Gelehrter, der etwas herausfinden will. Du liest kein Kärtchen zu Ende."),
      S("", "Auf dem Tuch liegt ein Zettel in anderer Schrift, grob und schief: „Wie weit geht ein guter Mann, wenn ihn niemand aufhält?“ Darunter, in seiner Schrift: „Noch nicht am Ende.“")
    ],
    riemen: [
      S("", "An der Wand, auf Kniehöhe, drei Eisenringe, in den Stein getrieben. Daran hängen Lederriemen mit Schnallen. Sie sind kurz. Viel zu kurz für einen Erwachsenen."),
      S("", "Das Leder ist glatt gerieben und an einer Stelle heller als sonst. Die Schnallen sind alle im innersten Loch ausgeleiert, dort, wo nur die allerdünnsten Handgelenke hineinpassen."),
      S("", "Darunter liegt ein Kissen. Weich und sauber, frisch aufgeschüttelt. Jemand hat darauf geachtet, dass es nicht unbequem ist. Das ist das Schlimmste daran."),
      S("", "Du versuchst dir vorzustellen, wer hier gesessen hat. Dann hörst du auf, es dir vorzustellen.")
    ],
    wand: [
      S("", "Die Wand ist mit Filz gepolstert, die Fenster zugemauert, die Tür dick wie in einem Tresor. Hier drin hört man nichts, und hier draußen hört man nichts."),
      S("", "Der Riegel an der Tür sitzt auf der Außenseite."),
      S("", "Das Kruzifix an der Wand hängt mit dem Gesicht zur Wand. Man hat es mit einem Tuch verhängt, ordentlich, wie man einen Spiegel verhängt, wenn jemand gestorben ist.")
    ]
  };
}

// Texte der Tuer im Gemach: je nachdem, ob man Bertas Ersatzschluessel hat.
function kammerTuerSeiten(z) {
  if (z.schluessel) return [
    S("", "Der Ersatzschlüssel passt. Das Schloss dreht sich ohne ein Geräusch, so gut ist es geölt."),
    S("", "Dahinter ist es kalt, und es riecht stark nach Seife.")
  ];
  return [
    S("", "Eine schmale Tür mit Eisenbeschlag, viel besser gepflegt als alles andere hier. Das Schloss ist neu. Der Riegel liegt außen davor, und er ist offen. Das Schloss nicht."),
    S("", "Du rüttelst daran. Dahinter ist kein Laut. Die Tür ist so gebaut, dass man dahinter nichts hört. Ohne Schlüssel kommst du nicht weiter. Wer außer ihm hat Schlüssel zu seinen Räumen? Jemand, der sein Haus führt.")
  ];
}

// Texte des Geheimraums hinter der Tuer. Alles angedeutet, nichts ausgesprochen.
function geheimTexte(h) {
  var person = HELDEN[h].person;
  return {
    bank: [
      S("", "Eine schmale Bank aus dunklem Holz, mit weißem Leinen bezogen. An Kopf- und Fußende sitzen Lederriemen, für Arme und für Beine. Sie sind kurz, und die Löcher in den Riemen reichen bis ganz nach innen."),
      S("", "Das Leinen ist frisch gewechselt. Am Rand der Bank sind kleine Striche ins Holz geritzt, einer neben dem anderen. Hunderte. Jemand hat gezählt. Du zählst nicht mit."),
      S("", "Die Wände sind mit Filz gepolstert, die Decke ist niedrig. Hier kann man schreien, so laut man will. Er hat an alles gedacht.")
    ],
    wanne: [
      S("", "In der Ecke steht eine Badewanne aus Zinn, groß genug für einen Erwachsenen. Daneben ein Eimer, eine Bürste, Seife, Tücher. Alles in einer geraden Reihe."),
      S("", "Im Boden davor ein Abflussgitter. Der ganze Raum hat ein leichtes Gefälle dorthin. Er hat den Boden eigens abschleifen lassen."),
      S("", "Am Wannenrand ein rostbrauner Schatten, den keine Bürste mehr wegbekommt. Am Abfluss hängt ein Faden, der einmal rot gewesen sein muss. Es riecht nach Seife, so stark, dass es wehtut."),
      S("", "Danach wurde immer alles gewaschen. Das war ihm wichtig. Sauberkeit ist der Anfang von Anstand.")
    ],
    schrank: [
      S("", "Ein Glasschrank, größer und ordentlicher als der oben. Dahinter weiße Ministrantengewänder in Kindergröße, sorgfältig gefaltet, eins neben dem anderen. An jedem hängt ein Zettel mit Name und Jahr. Manche sind neu. Manche so alt, dass das Weiß vergilbt ist."),
      S("", "In der Schublade darunter: Tücher, eine Schüssel, ein Kamm, Haarbänder. Alles, was man braucht, um ein Kind danach wieder so herzurichten, dass niemand etwas bemerkt. Du gehst nicht weiter durch die Schublade."),
      S("", "Das letzte Gewand in der Reihe hat genau die Größe von " + person + ". Der Zettel daran ist leer. Noch.")
    ],
    kratzer: [
      S("", "In die Wand neben der Bank sind Striche gekratzt, in Fünfergruppen, tief genug, dass jemand lange daran gearbeitet haben muss. Dazwischen einzelne Buchstaben, kindlich, schief."),
      S("", "Ein Name, mit etwas Hartem eingeritzt: MARGIT. Unter dem Namen ein Strich, und ganz klein darüber: „Ich hab es meiner Mutter gesagt.“")
    ],
    tuerzu: [
      S("", "Die Tür zurück. Sie ist schwer. Du willst hier nicht länger sein, als du musst.")
    ]
  };
}

// ---- Seiten, Hinweis und Wirkung je Gegenstand (spiel.js ruft das) ----------------------
function kammerSeiten(z, f) { return typeof f.text === "function" ? f.text(z) : f.text; }
// Gesehenes merken (Grundlage der Konfrontation mit Ambros) und sichern.
function kammerGesehen(z, f) {
  if (!z.beweise) z.beweise = {};
  var key = (f.geheim ? "g_" : "") + (f.sorte === "tuerzu" ? "tuer" : f.sorte);
  z.beweise[key] = true;
  if (z.beweiseAlt) delete z.beweiseAlt[key];                  // in diesem Abstieg (erneut) gesehen: zaehlt wieder
  spielSpeichern();
}
function kammerHinweis(z, f) {
  if (f.sorte === "tuer") return z.schluessel ? "E  —  Tür aufschließen" : "E  —  Ansehen";
  if (f.sorte === "tuerzu") return "E  —  Zurückgehen";
  return "E  —  Ansehen";
}
// Wird nach dem Gespraech gerufen: Tuer auf = in den Geheimraum und zurueck.
function kammerFertig(z, f) {
  var g = z.ebene.geheim;
  if (!g) return null;
  if (f.sorte === "tuer" && z.schluessel) return function () { kammerWechsel(z, g.einX, g.einY); };
  if (f.sorte === "tuerzu") return function () { kammerWechsel(z, g.ausX, g.ausY); };
  return null;
}
function kammerWechsel(z, x, y) {
  z.spieler.x = x; z.spieler.y = y; z.blendeT = 0.7; z.hitstopMs = 0;
}

// Ein freies, ringsum 1 Kachel Fels umgebenes Rechteck suchen (nicht an Raeume oder Gaenge angeschlossen).
function geheimPlatz(ebene) {
  var groessen = [[8, 7], [7, 7], [7, 6], [6, 6]], gi, x, y, xx, yy;
  for (gi = 0; gi < groessen.length; gi++) {
    var w = groessen[gi][0], h = groessen[gi][1], treffer = [];
    for (y = 1; y + h + 1 < RASTER; y++) for (x = 1; x + w + 1 < RASTER; x++) {
      var frei = true;
      for (yy = y - 1; yy <= y + h && frei; yy++) for (xx = x - 1; xx <= x + w; xx++) if (ebene.feld[yy][xx] !== 0) { frei = false; break; }
      if (frei) treffer.push({ x: x, y: y, w: w, h: h });
    }
    if (treffer.length) return treffer[zufall(0, treffer.length - 1)];
  }
  return null;
}
function geheimErzeugen(ebene, h, tuerPos) {
  var p = geheimPlatz(ebene);
  if (!p) return [];
  var ix0 = p.x + 1, iy0 = p.y + 1, nx = p.w - 2, ny = p.h - 2, xx, yy, liste = [];
  for (yy = iy0; yy < iy0 + ny; yy++) for (xx = ix0; xx < ix0 + nx; xx++) ebene.feld[yy][xx] = 1;
  var tx = GEHEIM_PLAETZE;
  var texte = geheimTexte(h), i;
  var tuerTile = { x: ix0 + Math.round(0.5 * (nx - 1)), y: iy0 + ny - 1 };
  ebene.geheim = {
    rahmen: { x0: (p.x - 1) * KACHEL, y0: (p.y - 1) * KACHEL, x1: (p.x + p.w + 1) * KACHEL, y1: (p.y + p.h + 1) * KACHEL },
    einX: (tuerTile.x + 0.5) * KACHEL, einY: (tuerTile.y - 0.5) * KACHEL,
    ausX: tuerPos.x, ausY: tuerPos.y + 18, innen: false
  };
  for (i = 0; i < tx.length; i++) {
    var q = tx[i], gx = ix0 + Math.round(q[1] * (nx - 1)), gy = iy0 + Math.round(q[2] * (ny - 1));
    liste.push({ x: (gx + 0.5) * KACHEL, y: (gy + 0.5) * KACHEL, art: "kammer", sorte: q[0], text: texte[q[0]], gelesen: false, geheim: true });
  }
  return liste;
}
var GEHEIM_PLAETZE = [["wanne", 0, 0], ["schrank", 1, 0], ["bank", 0.5, 0.5], ["kratzer", 1, 0.75], ["tuerzu", 0.5, 1]];

// Steht der Spieler im Geheimraum? Setzt ebene.geheim.innen (grafik.js und klang.js lesen es).
function imGeheim(ebene, sp) {
  var g = ebene && ebene.geheim;
  if (!g || !sp) return false;
  var r = g.rahmen;
  g.innen = sp.x > r.x0 && sp.x < r.x1 && sp.y > r.y0 && sp.y < r.y1;
  return g.innen;
}

// Platzbelegung in Bruchteilen der Rauminnenflaeche (x, y), je Gegenstand.
var KAMMER_PLAETZE = [
  ["tuer", 0.85, 0.55], ["sessel", 0.15, 0.25], ["tisch", 0.85, 0.25], ["schrank", 0.15, 0.85],
  ["pult", 0.85, 0.85], ["werktisch", 0.5, 0.85], ["wand", 0.5, 0.2], ["riemen", 0.15, 0.55]
];

// Waehlt den groessten freien Raum und stellt die Dinge hinein. Gibt die Liste der Fundstuecke zurueck.
function kammerErzeugen(ebene, freieRaeume, h) {
  if (!freieRaeume.length) return [];
  var raum = freieRaeume[0], i;
  for (i = 1; i < freieRaeume.length; i++) if (freieRaeume[i].w * freieRaeume[i].h > raum.w * raum.h) raum = freieRaeume[i];
  var ix0 = raum.x + 1, iy0 = raum.y + 1, nx = raum.w - 2, ny = raum.h - 2;
  var texte = kammerTexte(h), liste = [], belegt = {};
  liste.push({ x: (ix0 + nx / 2) * KACHEL, y: (iy0 + ny / 2) * KACHEL - 4000, art: "teppich", nx: nx, ny: ny, text: null, gelesen: true });
  for (i = 0; i < KAMMER_PLAETZE.length; i++) {
    var p = KAMMER_PLAETZE[i], tx = ix0 + Math.round(p[1] * (nx - 1)), ty = iy0 + Math.round(p[2] * (ny - 1));
    var frei = false;                                                // Platz belegt? dann ein freies Nachbarfeld im Raum nehmen
    for (var v = 0; v < 9 && !frei; v++) {
      var ordnung = [4, 1, 3, 5, 7, 0, 2, 6, 8][v];
      var ax = tx + (ordnung % 3) - 1, ay = ty + Math.floor(ordnung / 3) - 1;
      if (ax < ix0 || ay < iy0 || ax >= ix0 + nx || ay >= iy0 + ny) continue;
      if (!belegt[ax + "," + ay] && begehbar(ebene, ax, ay)) { tx = ax; ty = ay; frei = true; }
    }
    if (!frei) continue;
    belegt[tx + "," + ty] = true;
    liste.push({ x: (tx + 0.5) * KACHEL, y: (ty + 0.5) * KACHEL, art: "kammer", sorte: p[0], gelesen: false,
                 text: p[0] === "tuer" ? kammerTuerSeiten : texte[p[0]] });
  }
  var tuerFund = null;
  for (i = 0; i < liste.length; i++) if (liste[i].sorte === "tuer") tuerFund = liste[i];
  if (tuerFund) liste = liste.concat(geheimErzeugen(ebene, h, tuerFund));
  zustand.imGemach = false;
  zustand.gemach = { x0: ix0 * KACHEL, y0: iy0 * KACHEL, x1: (ix0 + nx) * KACHEL, y1: (iy0 + ny) * KACHEL };   // Bereich fuer die Musik
  return liste;
}

// Steht der Spieler im Gemach? Mit Spielraum, damit die Musik an der Tuer nicht hin- und herspringt.
function imGemach(z) {
  var g = z.gemach, sp = z.spieler;
  if (!g || z.ebenenNr !== 1 || !sp) return false;
  var rand = z.imGemach ? KACHEL * 1.2 : -KACHEL * 0.3;                 // Betreten: ein Stueck hinein. Verlassen: erst gut draussen.
  z.imGemach = sp.x > g.x0 - rand && sp.x < g.x1 + rand && sp.y > g.y0 - rand && sp.y < g.y1 + rand;
  return z.imGemach;
}

// ---- Zeichnen ---------------------------------------------------------------------
function kammerTeppich(ctx, f, camX, camY) {
  var sx = f.x - camX, sy = f.y + 4000 - camY, bw = f.nx * KACHEL / 2, bh = f.ny * KACHEL / 2;
  ctx.save(); ctx.globalAlpha = 0.85;
  function rr(x, y, w, h, r, f) { ctx.fillStyle = f; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }
  rr(sx - bw + 4, sy - bh + 4, 2 * bw - 8, 2 * bh - 8, 10, "#4a1218"); rr(sx - bw + 9, sy - bh + 9, 2 * bw - 18, 2 * bh - 18, 7, "#5e1a22");
  ctx.strokeStyle = "#a8873c"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(sx - bw + 7, sy - bh + 7, 2 * bw - 14, 2 * bh - 14, 8); ctx.stroke();
  ctx.restore();
  glut(ctx, sx, sy, Math.max(bw, bh) + 18, "200,60,60", 0.10 + Math.sin(ANIM * 2.3) * 0.02);   // schwaches, warmes Rot
}
function kammerKerze(ctx, sx, sy, s) {
  rc(ctx, sx - 1.5, sy - 8, 3, 8, "#e8dcc0");
  glut(ctx, sx, sy - 10, 14, "255,190,100", 0.32 + Math.sin(ANIM * 9 + s) * 0.08);
  kr(ctx, sx, sy - 10, 1.8, "#ffd37a");
}
function kammerZeichnen(ctx, f, camX, camY) {
  var sx = f.x - camX, sy = f.y - camY, g = f.gelesen;
  if (f.art === "teppich") { kammerTeppich(ctx, f, camX, camY); return; }
  schatten(ctx, sx, sy, 13);
  if (!g) glut(ctx, sx, sy - 10, 26, "255,220,140", 0.22 + Math.sin(ANIM * 3) * 0.06);
  switch (f.sorte) {
    case "sessel":                                                   // roter Samt, Goldkante; kleiner Stuhl davor
      rc(ctx, sx - 9, sy - 18, 18, 14, "#7a1a26"); rc(ctx, sx - 11, sy - 12, 4, 10, "#5e1220"); rc(ctx, sx + 7, sy - 12, 4, 10, "#5e1220");
      rc(ctx, sx - 9, sy - 18, 18, 2, "#c9a24a"); rc(ctx, sx - 8, sy - 4, 16, 3, "#3a0c14");
      rc(ctx, sx + 13, sy - 9, 7, 2, "#8a6b3a"); rc(ctx, sx + 14, sy - 9, 1.5, 9, "#8a6b3a"); rc(ctx, sx + 18, sy - 9, 1.5, 9, "#8a6b3a");
      break;
    case "tisch":                                                    // Tischchen, Schale Zucker, Becher, Kerze
      rc(ctx, sx - 10, sy - 14, 20, 3, "#6b4a2a"); rc(ctx, sx - 8, sy - 11, 2, 11, "#4a3220"); rc(ctx, sx + 6, sy - 11, 2, 11, "#4a3220");
      ell(ctx, sx - 3, sy - 17, 6, 3, "#e8d8c0"); kr(ctx, sx - 5, sy - 18, 1.4, "#e86a8a"); kr(ctx, sx - 2, sy - 18.5, 1.4, "#f0d060"); kr(ctx, sx - 1, sy - 17, 1.4, "#8ac86a");
      rc(ctx, sx + 4, sy - 19, 3, 5, "#b8b0a0"); kammerKerze(ctx, sx + 9, sy - 14, 1);
      break;
    case "schrank":                                                  // verhaengter Glasschrank, Schluessel steckt
      if (f.geheim) {                                                // Geheimraum: groesser, weisse Gewaender in Reihe
        rc(ctx, sx - 12, sy - 34, 24, 32, "#3a2a1c"); rc(ctx, sx - 10, sy - 32, 20, 28, "#1c1a20");
        for (var gk = 0; gk < 4; gk++) { rc(ctx, sx - 8 + gk * 5, sy - 28, 4, 12, "#e8e2d2"); rc(ctx, sx - 8 + gk * 5, sy - 28, 4, 2, "#c8c0a8"); }
        rc(ctx, sx - 10, sy - 14, 20, 1.5, "rgba(200,160,100,0.5)"); rc(ctx, sx - 8, sy - 12, 16, 7, "#4a3626");
        break;
      }
      rc(ctx, sx - 10, sy - 30, 20, 28, "#3a2a1c"); rc(ctx, sx - 8, sy - 28, 16, 24, "#1c1218");
      rc(ctx, sx - 8, sy - 28, 16, 9, "#4a2230"); rc(ctx, sx - 8, sy - 19, 16, 1, "rgba(200,160,100,0.5)");
      rc(ctx, sx - 6, sy - 17, 3, 3, "#d8c9a0"); rc(ctx, sx - 1, sy - 17, 3, 3, "#b84a6a"); rc(ctx, sx + 4, sy - 17, 3, 3, "#d8c9a0");
      kr(ctx, sx + 7, sy - 15, 1.4, "#c9a24a");
      break;
    case "pult":                                                     // Schreibpult mit offenem Buch
      rc(ctx, sx - 10, sy - 6, 20, 6, "#4a3220"); poly(ctx, [sx - 10, sy - 6, sx + 10, sy - 6, sx + 7, sy - 18, sx - 7, sy - 18], "#6b4a2a");
      poly(ctx, [sx - 7, sy - 15, sx, sy - 13, sx + 7, sy - 15, sx + 6, sy - 11, sx, sy - 9, sx - 6, sy - 11], "#d8c9a0");
      for (var q = 0; q < 3; q++) { lin(ctx, sx - 5, sy - 13.6 + q * 1.4, sx - 1, sy - 12.2 + q * 1.4, "rgba(60,40,20,0.6)", 0.7); lin(ctx, sx + 1, sy - 12.2 + q * 1.4, sx + 5, sy - 13.6 + q * 1.4, "rgba(60,40,20,0.6)", 0.7); }
      kammerKerze(ctx, sx - 12, sy - 6, 2);
      break;
    case "werktisch":                                                // Tuch mit Messband, Waage, Sanduhr, Glasroehrchen
      rc(ctx, sx - 13, sy - 12, 26, 4, "#5a4026"); rc(ctx, sx - 11, sy - 8, 2, 8, "#3a2a1c"); rc(ctx, sx + 9, sy - 8, 2, 8, "#3a2a1c");
      rc(ctx, sx - 12, sy - 13, 24, 1.6, "#e8e2d0");
      lin(ctx, sx - 11, sy - 15, sx - 4, sy - 15, "#d8c9a0", 1.4);
      lin(ctx, sx - 1, sy - 21, sx - 1, sy - 14, "#a89a70", 1); lin(ctx, sx - 5, sy - 19, sx + 3, sy - 19, "#a89a70", 1);
      poly(ctx, [sx + 4, sy - 14, sx + 9, sy - 14, sx + 6.5, sy - 18, sx + 9, sy - 22, sx + 4, sy - 22, sx + 6.5, sy - 18], "rgba(230,220,200,0.6)");
      break;
    case "riemen":                                                   // Eisenringe in Kniehoehe, kurze Lederriemen, Kissen
      rc(ctx, sx - 12, sy - 24, 24, 22, "#2e2a28");
      for (var m = 0; m < 3; m++) {
        var rx = sx - 8 + m * 8;
        ctx.strokeStyle = "#7a7a82"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(rx, sy - 16, 2.2, 0, TAU); ctx.stroke(); ctx.lineWidth = 1;
        lin(ctx, rx, sy - 14, rx + (m - 1) * 1.2, sy - 7, "#6a4428", 2); rc(ctx, rx - 1.6 + (m - 1) * 1.2, sy - 8, 3.2, 2, "#b8a060");
      }
      ell(ctx, sx, sy - 3, 10, 3.6, "#c8bca4"); ell(ctx, sx, sy - 4, 7.5, 2.4, "#ddd2ba");
      break;
    case "tuer":                                                     // schmale, gepflegte Tuer mit Eisenbeschlag und neuem Schloss
      rc(ctx, sx - 9, sy - 34, 18, 32, "#2a2018"); rc(ctx, sx - 7, sy - 32, 14, 30, "#4a3624");
      rc(ctx, sx - 7, sy - 26, 14, 2, "#2a2a30"); rc(ctx, sx - 7, sy - 14, 14, 2, "#2a2a30");
      rc(ctx, sx + 2, sy - 20, 4, 6, "#7a7a82"); kr(ctx, sx + 4, sy - 17, 1.2, "#111");
      break;
    case "tuerzu":                                                   // Tuer im Geheimraum
      rc(ctx, sx - 9, sy - 34, 18, 32, "#2a2018"); rc(ctx, sx - 7, sy - 32, 14, 30, "#3e2e20"); kr(ctx, sx + 4, sy - 17, 1.4, "#c9a24a");
      break;
    case "wanne":                                                    // Zinnwanne in der Ecke, Abflussgitter davor, rostbrauner Rand
      ell(ctx, sx + 2, sy - 8, 17, 8, "#9a9a9a"); ell(ctx, sx + 2, sy - 9, 14, 5.6, "#5a5a60");
      rc(ctx, sx - 14, sy - 10, 6, 4, "rgba(100,30,20,0.55)");
      ell(ctx, sx - 6, sy + 2, 5, 2.4, "#222"); lin(ctx, sx - 9, sy + 2, sx - 3, sy + 2, "#555", 0.8); lin(ctx, sx - 6, sy + 0.5, sx - 6, sy + 3.5, "#555", 0.8);
      kr(ctx, sx - 6, sy + 3.4, 1.2, "rgba(140,30,24,0.8)");
      rc(ctx, sx + 14, sy - 6, 5, 6, "#6a5a4a");
      break;
    case "bank":                                                     // schmale Bank, weisses Leinen, Riemen an Kopf- und Fussende
      rc(ctx, sx - 18, sy - 12, 36, 7, "#4a3626"); rc(ctx, sx - 17, sy - 14, 34, 4, "#e8e2d2");
      rc(ctx, sx - 16, sy - 5, 3, 5, "#2e2418"); rc(ctx, sx + 13, sy - 5, 3, 5, "#2e2418");
      for (var bq = 0; bq < 4; bq++) { var bx = [-14, -9, 9, 14][bq]; rc(ctx, sx + bx - 1, sy - 14, 2, 8, "#6a4428"); rc(ctx, sx + bx - 1.5, sy - 12, 3, 1.6, "#b8a060"); }
      break;
    case "kratzer":                                                  // Wand mit eingekratzten Strichen
      rc(ctx, sx - 12, sy - 32, 24, 30, "#2e2a28");
      for (var kq = 0; kq < 12; kq++) lin(ctx, sx - 9 + (kq % 6) * 3.4, sy - 28 + Math.floor(kq / 6) * 5, sx - 9 + (kq % 6) * 3.4, sy - 24 + Math.floor(kq / 6) * 5, "rgba(190,180,160,0.55)", 0.8);
      lin(ctx, sx - 8, sy - 14, sx + 6, sy - 15, "rgba(200,190,170,0.5)", 0.9);
      break;
    default:                                                         // wand: Filz, Riegel aussen, verhaengtes Kruzifix
      rc(ctx, sx - 12, sy - 32, 24, 30, "#3a3430"); for (var k = 0; k < 4; k++) rc(ctx, sx - 12, sy - 30 + k * 7, 24, 1, "rgba(0,0,0,0.25)");
      rc(ctx, sx - 2, sy - 28, 4, 16, "#2a2a2e"); rc(ctx, sx - 6, sy - 24, 12, 4, "#2a2a2e");
      rc(ctx, sx - 12, sy - 12, 24, 4, "#6a6a72"); kr(ctx, sx + 10, sy - 10, 1.6, "#c9a24a");
  }
}
