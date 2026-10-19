// tetris.js — reine Spiellogik (kein Zeichnen, kein Netz). Ein Spielstand = ein Feld, ein Stein, eine Warteschlange.
// Alle Zahlen zum Nachjustieren stehen oben. Kein Modul; globale Funktionen. Zeichnen: render.js, Netz: verbindung.js.

// ---- Konstanten zum Nachjustieren -------------------------------------
var T_B = 10, T_H = 20, T_VERDECKT = 2;     // Breite, sichtbare Hoehe, verdeckte Zeilen oben
var T_SPERRZEIT = 0.5;                      // s, die ein Stein am Boden noch verschoben werden darf
var T_SPERR_RESETS = 15;                    // so oft setzt Verschieben die Sperrzeit zurueck
var T_SOFT = 20;                            // Fallgeschwindigkeit beim Weichfall (Faktor)
var T_VORSCHAU = 4;                         // sichtbare naechste Steine
var T_EIER_MAX = 8;                         // so viele Eier-Zeilen kommen hoechstens auf einmal an
var T_ANGRIFF = [0, 0, 1, 2, 4];            // Eier fuer 0..4 geraeumte Zeilen
var T_KOMBO = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5];   // Zusatz-Eier je Kombo-Stufe
var T_PC_BONUS = 6;                         // Eier fuer ein leeres Feld
var T_TOR_H = 5;                            // Rueberwerfen: Hoehe des Tors in Zeilen
var T_TOR_OFFEN = 3.0, T_TOR_ZU = 6.0;      // s offen / s zu
var T_TOR_VOR = 1.2;                        // s Vorwarnung vor dem Oeffnen (Tor blinkt an der neuen Stelle)
var T_GEWORFEN_MAX = 3;                     // so viele Steine vom Freund warten hoechstens auf ihren Einsatz
// -----------------------------------------------------------------------

var T_TYPEN = ["I", "O", "T", "S", "Z", "J", "L"];
var T_ZAHL = { I: 1, O: 2, T: 3, S: 4, Z: 5, J: 6, L: 7 };   // Farbnummer im Feld; 8 = Ei
var T_EI = 8;
var T_BASIS = {
  I: { n: 4, z: [[0, 1], [1, 1], [2, 1], [3, 1]] },
  O: { n: 4, z: [[1, 0], [2, 0], [1, 1], [2, 1]] },
  T: { n: 3, z: [[1, 0], [0, 1], [1, 1], [2, 1]] },
  S: { n: 3, z: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  Z: { n: 3, z: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  J: { n: 3, z: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  L: { n: 3, z: [[2, 0], [0, 1], [1, 1], [2, 1]] }
};
var T_FORM = {};                            // T_FORM[typ][drehung] = vier Zellen [x, y]
(function () {
  T_TYPEN.forEach(function (t) {
    var b = T_BASIS[t], r = [b.z];
    for (var k = 1; k < 4; k++) {
      r.push(r[k - 1].map(function (c) { return [b.n - 1 - c[1], c[0]]; }));      // 90 Grad im Uhrzeigersinn
    }
    T_FORM[t] = t === "O" ? [b.z, b.z, b.z, b.z] : r;
  });
})();
var T_KICKS = [[0, 0], [-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1], [-2, 0], [2, 0], [0, -2]];

function tRng(seed) {                       // mulberry32: gleicher Startwert = gleiche Folge
  var a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tNeu(seed) {
  var s = {
    feld: [], akt: null, rng: tRng(seed), beutel: [], schlange: [], halten: null, halteOk: true,
    punkte: 0, linien: 0, level: 1, kombo: -1, b2b: false, tot: false, gewonnen: false,
    fallT: 0, sperrT: 0, sperrResets: 0, weich: false, eingehend: [], ausgehend: [], ev: [],
    gesetzt: 0, eierGelegt: 0, eierErhalten: 0, zeit: 0,
    tor: null, geworfen: [], ausgehendSteine: [], gewuerfe: 0, steineErhalten: 0,
    fremd: null, draussen: null              // Modus Einbauen: Stein des Freundes in deinem Feld / dein Stein gerade beim Freund
  };
  for (var y = 0; y < T_H + T_VERDECKT; y++) s.feld.push(tLeereZeile());
  while (s.schlange.length < T_VORSCHAU + 2) s.schlange.push(tNaechsterTyp(s));
  tSpawn(s);
  return s;
}
function tLeereZeile() { var r = []; for (var x = 0; x < T_B; x++) r.push(0); return r; }

function tNaechsterTyp(s) {                  // 7er-Beutel: jede Form kommt in jedem Satz genau einmal
  if (!s.beutel.length) {
    s.beutel = T_TYPEN.slice();
    for (var i = s.beutel.length - 1; i > 0; i--) { var j = Math.floor(s.rng() * (i + 1)), t = s.beutel[i]; s.beutel[i] = s.beutel[j]; s.beutel[j] = t; }
  }
  return s.beutel.pop();
}

function tZellen(typ, rot, x, y) {
  return T_FORM[typ][rot].map(function (c) { return [x + c[0], y + c[1]]; });
}
function tKollidiert(s, typ, rot, x, y) {
  var z = T_FORM[typ][rot];
  for (var i = 0; i < 4; i++) {
    var cx = x + z[i][0], cy = y + z[i][1];
    if (cx < 0 || cx >= T_B || cy >= T_H + T_VERDECKT) return true;
    if (cy >= 0 && s.feld[cy][cx]) return true;
  }
  return false;
}

function tSpawn(s, typ, rot) {
  var vomFreund = false;
  if (!typ && s.geworfen.length) { var g = s.geworfen.shift(); typ = g.typ; rot = g.rot; vomFreund = true; }   // geworfener Stein kommt zuerst
  typ = typ || s.schlange.shift();
  rot = rot || 0;
  while (s.schlange.length < T_VORSCHAU + 2) s.schlange.push(tNaechsterTyp(s));
  s.fallT = 0; s.sperrT = 0; s.sperrResets = 0;
  if (s.fremd && (tUeberlappt(s.fremd, typ, rot, 3, 0) || tUeberlappt(s.fremd, typ, rot, 3, -1))) tFremdWeg(s);   // fremder Stein steht im Einstieg: er verpufft
  if (tKollidiert(s, typ, rot, 3, 0)) {
    if (vomFreund && !tKollidiert(s, typ, rot, 3, -1)) { s.akt = { typ: typ, rot: rot, x: 3, y: -1 }; return; }
    if (vomFreund) { s.ev.push({ art: "verpufft", typ: typ }); tSpawn(s); return; }      // kein Platz: der geworfene Stein verpufft, du stirbst nicht daran
    s.akt = { typ: typ, rot: rot, x: 3, y: -1 };
    if (tKollidiert(s, typ, rot, 3, -1)) tSterben(s);
    return;
  }
  s.akt = { typ: typ, rot: rot, x: 3, y: 0 };
}
function tSterben(s) { if (!s.tot) { s.tot = true; s.ev.push({ art: "tot" }); } }

function tAmBoden(s) { return tKollidiert(s, s.akt.typ, s.akt.rot, s.akt.x, s.akt.y + 1); }
function tSperrReset(s) { if (tAmBoden(s) && s.sperrResets < T_SPERR_RESETS) { s.sperrT = 0; s.sperrResets++; } }

function tBewege(s, dx) {
  if (s.tot || !s.akt) return false;
  var a = s.akt;
  if (!tFrei(s, a, a.rot, a.x + dx, a.y)) return false;
  a.x += dx; tSperrReset(s); s.ev.push({ art: "schieb" });
  return true;
}
function tDrehe(s, richtung) {               // richtung +1 = rechts herum, -1 = links herum
  if (s.tot || !s.akt || s.akt.typ === "O") return false;
  var a = s.akt, nr = (a.rot + richtung + 4) % 4;
  for (var i = 0; i < T_KICKS.length; i++) {
    var kx = T_KICKS[i][0], ky = T_KICKS[i][1];
    if (tFrei(s, a, nr, a.x + kx, a.y + ky)) {
      a.rot = nr; a.x += kx; a.y += ky; tSperrReset(s); s.ev.push({ art: "dreh" });
      return true;
    }
  }
  return false;
}
function tWeichSchritt(s) {                  // eine Zeile tiefer, 1 Punkt
  if (s.tot || !s.akt) return false;
  var a = s.akt;
  if (!tFrei(s, a, a.rot, a.x, a.y + 1)) return false;
  a.y++; s.punkte += 1; s.fallT = 0;
  return true;
}
function tGeisterY(s) {                      // Zeile, auf der der Stein landen wuerde
  var a = s.akt, y = a.y;
  while (!tKollidiert(s, a.typ, a.rot, a.x, y + 1)) y++;
  return y;
}
function tHart(s) {                          // fallen lassen und sofort festsetzen
  if (s.tot || !s.akt) return 0;
  var a = s.akt, y0 = a.y;
  while (tFrei(s, a, a.rot, a.x, a.y + 1)) a.y++;
  var d = a.y - y0;
  s.punkte += 2 * d;
  s.ev.push({ art: "hart", typ: a.typ, rot: a.rot, x: a.x, y0: y0, y1: a.y });
  if (tAmBoden(s)) tFestsetzen(s);           // liegt er nur auf dem anderen fallenden Stein, faellt er weiter, sobald Platz ist
  return d;
}
function tHalten(s) {
  if (s.tot || !s.akt || !s.halteOk) return false;
  var alt = s.halten;
  s.halten = s.akt.typ; s.halteOk = false;
  tSpawn(s, alt || undefined);
  s.ev.push({ art: "halten" });
  return true;
}

function tFallZeit(level) {                  // Sekunden je Zeile, wie im Standard-Tetris
  var l = Math.min(level, 15) - 1;
  return Math.max(0.03, Math.pow(0.8 - l * 0.007, l));
}

// Ein Zeitschritt: Schwerkraft und Sperrzeit. dt in Sekunden.
function tSchritt(s, dt) {
  if (s.tot || !s.akt) return;
  s.zeit += dt;
  var iv = tFallZeit(s.level) / (s.weich ? T_SOFT : 1);
  s.fallT += dt;
  var guard = 0;
  while (s.fallT >= iv && guard++ < 40) {
    s.fallT -= iv;
    if (!tFrei(s, s.akt, s.akt.rot, s.akt.x, s.akt.y + 1)) break;     // Boden, Feld oder der andere fallende Stein
    s.akt.y++; if (s.weich) s.punkte += 1;
  }
  if (tAmBoden(s)) {
    s.sperrT += dt;
    if (s.sperrT >= T_SPERRZEIT) tFestsetzen(s);
  } else s.sperrT = 0;
}

function tFestsetzen(s) {
  var a = s.akt, zellen = tZellen(a.typ, a.rot, a.x, a.y), i, hoch = true;
  for (i = 0; i < 4; i++) if (zellen[i][1] >= T_VERDECKT) hoch = false;
  s.akt = null;
  tEinbauen(s, a.typ, zellen);
  s.halteOk = true;
  if (hoch) tSterben(s);
  if (!s.tot) tSpawn(s);
}

// Stein ins Feld schreiben, volle Zeilen raeumen, Punkte und Eier: gilt fuer den eigenen und den fremden Stein (Zeilen zaehlen fuer den Feldbesitzer).
function tEinbauen(s, typ, zellen) {
  var i;
  for (i = 0; i < 4; i++) { var cx = zellen[i][0], cy = zellen[i][1]; if (cy >= 0) s.feld[cy][cx] = T_ZAHL[typ]; }
  s.gesetzt++;
  s.ev.push({ art: "sperre", typ: typ, zellen: zellen });
  // volle Zeilen
  var voll = [];
  for (var y = 0; y < T_H + T_VERDECKT; y++) {
    var ganz = true;
    for (var x = 0; x < T_B; x++) if (!s.feld[y][x]) { ganz = false; break; }
    if (ganz) voll.push(y);
  }
  if (voll.length) {
    var kopie = voll.map(function (y) { return s.feld[y].slice(); });
    s.feld = s.feld.filter(function (r, yy) { return voll.indexOf(yy) < 0; });         // volle Zeilen raus ...
    for (i = 0; i < voll.length; i++) s.feld.unshift(tLeereZeile());                    // ... leere oben nach
    var n = voll.length;
    s.kombo++;
    var tetris = n === 4, b2bBonus = tetris && s.b2b ? 1 : 0;
    var leer = true;
    for (y = 0; y < s.feld.length && leer; y++) for (x = 0; x < T_B; x++) if (s.feld[y][x]) { leer = false; break; }
    var angriff = T_ANGRIFF[n] + T_KOMBO[Math.min(s.kombo, T_KOMBO.length - 1)] + b2bBonus + (leer ? T_PC_BONUS : 0);
    s.b2b = tetris;
    s.punkte += [0, 100, 300, 500, 800][n] * s.level + (s.kombo > 0 ? 50 * s.kombo * s.level : 0);
    s.linien += n;
    s.level = Math.min(15, 1 + Math.floor(s.linien / 10));
    s.ev.push({ art: "zeilen", reihen: voll, farben: kopie, n: n, kombo: s.kombo, b2b: b2bBonus > 0, leer: leer, angriff: angriff });
    // Angriff verrechnet zuerst mit Eiern, die gerade ankommen wollten
    while (angriff > 0 && s.eingehend.length) {
      var e = s.eingehend[0], ab = Math.min(angriff, e.n);
      e.n -= ab; angriff -= ab;
      if (e.n <= 0) s.eingehend.shift();
    }
    if (angriff > 0) { s.ausgehend.push(angriff); s.eierGelegt += angriff; s.ev.push({ art: "angriff", n: angriff }); }
  } else {
    s.kombo = -1;
    tEierEinfuegen(s);
  }
  tPlatzMachen(s);
}

// Ankommende Eier: jede Gruppe eine Zeile mit einer Luecke; hoechstens T_EIER_MAX Zeilen je Stein.
function tEierEinfuegen(s) {
  var rest = T_EIER_MAX;
  while (s.eingehend.length && rest > 0) {
    var e = s.eingehend[0], n = Math.min(e.n, rest);
    for (var k = 0; k < n; k++) {
      var top = s.feld.shift();
      for (var x = 0; x < T_B; x++) if (top[x]) tSterben(s);
      var z = [];
      for (x = 0; x < T_B; x++) z.push(x === e.loch ? 0 : T_EI);
      s.feld.push(z);
    }
    s.ev.push({ art: "eier", n: n, loch: e.loch });
    e.n -= n; rest -= n;
    if (e.n <= 0) s.eingehend.shift();
  }
}
function tEierKommen(s, n, loch) {           // von draussen: der Gegner hat Eier geschickt
  if (n > 0) { s.eingehend.push({ n: n, loch: loch }); s.eierErhalten += n; s.ev.push({ art: "warnung", n: n }); }
}
function tEierAnzahl(s) { var n = 0; for (var i = 0; i < s.eingehend.length; i++) n += s.eingehend[i].n; return n; }

// Feld als Text fuer den Mitspieler (200 Zeichen, '0'..'8') inklusive fallendem Stein.
function tAbbild(s) {
  var rows = [], y, x;
  for (y = T_VERDECKT; y < T_H + T_VERDECKT; y++) rows.push(s.feld[y].slice());
  [s.akt, s.fremd].forEach(function (st) {
    if (st) tZellen(st.typ, st.rot, st.x, st.y).forEach(function (c) {
      var yy = c[1] - T_VERDECKT; if (yy >= 0 && yy < T_H) rows[yy][c[0]] = T_ZAHL[st.typ];
    });
  });
  return rows.map(function (r) { return r.join(""); }).join("");
}

// ---- Ruebergeben: Tor in der Wand zum Freund ---------------------------------------------------------
// Der Stein springt ganz hinueber (kein Zwischenzustand) und wird beim Freund der naechste Stein.
function tTorStart(s) {
  s.tor = { offen: false, y: 6, h: T_TOR_H, t: T_TOR_ZU * 0.6, vor: false };
  tTorNeueHoehe(s);
}
function tTorNeueHoehe(s) { s.tor.y = 3 + Math.floor(Math.random() * (T_H - T_TOR_H - 6)); }     // Zeilen 3 bis 11 (sichtbar)
function tTorSchritt(s, dt) {
  var t = s.tor;
  if (!t || s.tot) return;
  t.t -= dt;
  if (t.offen) {
    if (t.t <= 0) { t.offen = false; t.t = T_TOR_ZU; t.vor = false; tTorNeueHoehe(s); s.ev.push({ art: "tor", offen: false }); }
  } else {
    if (t.t <= T_TOR_VOR) t.vor = true;
    if (t.t <= 0) { t.offen = true; t.vor = false; t.t = T_TOR_OFFEN; s.ev.push({ art: "tor", offen: true }); }
  }
}
function tWurfMoeglich(s) {              // Tor offen, alle Zellen des Steins auf Tor-Hoehe, Stein liegt an der rechten Wand
  if (!s.tor || !s.tor.offen || !s.akt || s.tot) return false;
  var z = tZellen(s.akt.typ, s.akt.rot, s.akt.x, s.akt.y), maxx = 0;
  for (var i = 0; i < 4; i++) {
    var r = z[i][1] - T_VERDECKT;
    if (r < s.tor.y || r > s.tor.y + s.tor.h - 1) return false;
    if (z[i][0] > maxx) maxx = z[i][0];
  }
  return maxx === T_B - 1;
}
function tWurf(s) {                      // Rueckgabe {typ, rot} oder null
  if (!tWurfMoeglich(s)) return null;
  var a = s.akt, z = tZellen(a.typ, a.rot, a.x, a.y), w = { typ: a.typ, rot: a.rot };
  s.gewuerfe++; s.ausgehendSteine.push(w);
  s.ev.push({ art: "wurf", typ: a.typ, rot: a.rot, zellen: z });
  s.akt = null; s.halteOk = true;
  tSpawn(s);
  return w;
}
function tSteinKommt(s, typ, rot) {      // der Freund hat einen Stein geworfen
  if (T_TYPEN.indexOf(typ) < 0 || s.geworfen.length >= T_GEWORFEN_MAX) return false;
  s.geworfen.push({ typ: typ, rot: ((rot | 0) % 4 + 4) % 4 }); s.steineErhalten++;
  s.ev.push({ art: "stein", typ: typ });
  return true;
}

// Oberste zwei sichtbare Zeilen belegt? Nur das Feld, ohne fallende Steine (fuer "Sein Feld ist zu voll" beim Ruebergeben).
function tObenBelegt(s) {
  for (var y = T_VERDECKT; y < T_VERDECKT + 2; y++) for (var x = 0; x < T_B; x++) if (s.feld[y][x]) return true;
  return false;
}

// ---- Einbauen: dein Stein geht durchs Tor ins Feld des Freundes, du steuerst ihn dort -----------------------------------
// Das Feld gehoert dem Freund, sein Handy rechnet den fremden Stein (s.fremd). Beide fallenden Steine blockieren sich
// gegenseitig, festgesetzt wird aber nur auf Feld oder Boden: liegt einer auf dem anderen, wartet er und faellt dann weiter.
function tUeberlappt(st, typ, rot, x, y) {
  if (!st) return false;
  var a = tZellen(typ, rot, x, y), b = tZellen(st.typ, st.rot, st.x, st.y);
  for (var i = 0; i < 4; i++) for (var k = 0; k < 4; k++) if (a[i][0] === b[k][0] && a[i][1] === b[k][1]) return true;
  return false;
}
function tFrei(s, st, rot, x, y) {           // Platz im Feld und nicht vom anderen fallenden Stein belegt
  if (tKollidiert(s, st.typ, rot, x, y)) return false;
  return !tUeberlappt(st === s.akt ? s.fremd : s.akt, st.typ, rot, x, y);
}
function tPlatzMachen(s) {                   // nach Zeilen oder Eiern: fallende Steine, die jetzt im Feld stecken, nach oben schieben
  [s.akt, s.fremd].forEach(function (st) {
    if (!st || !tKollidiert(s, st.typ, st.rot, st.x, st.y)) return;
    for (var k = 1; k <= 4; k++) if (tFrei(s, st, st.rot, st.x, st.y - k)) { st.y -= k; return; }
    if (st === s.fremd) tFremdWeg(s); else tSterben(s);
  });
}

// Werfer: Stein verlaesst dein Feld. Dein naechster Stein kommt erst, wenn er beim Freund eingebaut ist (tDraussenFertig).
function tWurfRaus(s) {
  if (!tWurfMoeglich(s)) return null;
  var a = s.akt, z = tZellen(a.typ, a.rot, a.x, a.y), w = { typ: a.typ, rot: a.rot, y: a.y };
  s.gewuerfe++; s.ausgehendSteine.push(w); s.draussen = w;
  s.ev.push({ art: "wurf", typ: a.typ, rot: a.rot, zellen: z, ein: true });
  s.akt = null; s.halteOk = true;
  return w;
}
function tDraussenFertig(s) { if (!s.draussen) return; s.draussen = null; if (!s.tot && !s.akt) tSpawn(s); }
function tFremdStart(typ, rot, y) {          // Lage im Feld des Freundes: gleiche Zeilen, ganz am linken Rand
  rot = ((rot | 0) % 4 + 4) % 4;
  var minx = 9; T_FORM[typ][rot].forEach(function (c) { if (c[0] < minx) minx = c[0]; });
  return { typ: typ, rot: rot, x: -minx, y: y | 0, fallT: 0, sperrT: 0, sperrResets: 0 };
}

// Feldbesitzer: der Stein des Freundes kommt durchs Tor
function tFremdKommt(s, typ, rot, y) {
  if (s.tot || T_TYPEN.indexOf(typ) < 0) return false;
  var st = tFremdStart(typ, rot, y);
  if (s.fremd || !tFrei(s, st, st.rot, st.x, st.y)) {               // kein Platz am Tor: der Stein verpufft
    s.ev.push({ art: "verpufft", typ: typ }); s.ev.push({ art: "fremdFertig", verpufft: true });
    return false;
  }
  s.fremd = st; s.steineErhalten++;
  s.ev.push({ art: "stein", typ: typ, ein: true });
  return true;
}
function tFremdAmBoden(s) { var f = s.fremd; return tKollidiert(s, f.typ, f.rot, f.x, f.y + 1); }
function tFremdSperrReset(s) { var f = s.fremd; if (tFremdAmBoden(s) && f.sperrResets < T_SPERR_RESETS) { f.sperrT = 0; f.sperrResets++; } }
function tFremdBefehl(s, a) {                // Befehl vom Freund: links, rechts, runter, dreh, drehL, hart
  var f = s.fremd, i;
  if (!f || s.tot) return false;
  if (a === "links" || a === "rechts") {
    var dx = a === "links" ? -1 : 1;
    if (!tFrei(s, f, f.rot, f.x + dx, f.y)) return false;
    f.x += dx; tFremdSperrReset(s); return true;
  }
  if (a === "dreh" || a === "drehL") {
    if (f.typ === "O") return false;
    var nr = (f.rot + (a === "dreh" ? 1 : -1) + 4) % 4;
    for (i = 0; i < T_KICKS.length; i++) if (tFrei(s, f, nr, f.x + T_KICKS[i][0], f.y + T_KICKS[i][1])) { f.rot = nr; f.x += T_KICKS[i][0]; f.y += T_KICKS[i][1]; tFremdSperrReset(s); return true; }
    return false;
  }
  if (a === "runter") { if (!tFrei(s, f, f.rot, f.x, f.y + 1)) return false; f.y++; f.fallT = 0; return true; }
  if (a === "hart") {
    var y0 = f.y;
    while (tFrei(s, f, f.rot, f.x, f.y + 1)) f.y++;
    s.ev.push({ art: "hart", typ: f.typ, rot: f.rot, x: f.x, y0: y0, y1: f.y });
    if (tFremdAmBoden(s)) tFremdEinbauen(s);
    return true;
  }
  return false;
}
function tFremdSchritt(s, dt) {              // Schwerkraft und Sperrzeit fuer den fremden Stein (Tempo deiner Stufe)
  var f = s.fremd;
  if (!f || s.tot) return;
  var iv = tFallZeit(s.level), guard = 0;
  f.fallT += dt;
  while (f.fallT >= iv && guard++ < 40) { f.fallT -= iv; if (!tFrei(s, f, f.rot, f.x, f.y + 1)) break; f.y++; }
  if (tFremdAmBoden(s)) { f.sperrT += dt; if (f.sperrT >= T_SPERRZEIT) tFremdEinbauen(s); } else f.sperrT = 0;
}
function tFremdEinbauen(s) {
  var f = s.fremd; s.fremd = null;
  tEinbauen(s, f.typ, tZellen(f.typ, f.rot, f.x, f.y));
  s.ev.push({ art: "fremdFertig", verpufft: false });
}
function tFremdWeg(s) {
  if (!s.fremd) return;
  var f = s.fremd; s.fremd = null;
  s.ev.push({ art: "verpufft", typ: f.typ }); s.ev.push({ art: "fremdFertig", verpufft: true });
}
