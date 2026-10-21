// schrift.js — alle 52 Buchstaben (gross und klein) als Striche in Schreibreihenfolge, fuer Nachspuren und fuer die Buchstaben auf den Knoepfen.
// Vierliniensystem wie im Schulheft: y 0 = Oberlinie, 1 = Mittellinie, 2 = Grundlinie, 3 = Unterlinie. x nach rechts, alles in Zeilenabstaenden.
// Segmente: ["Z", x1,y1, x2,y2, ...] Linienzug; ["B", cx,cy, rx,ry, w1,w2] Bogen in Grad (0 = rechts, 90 = unten; w2 > w1 = im Uhrzeigersinn);
// ["P", x,y] Punkt (i, j). Jeder Strich ist eine Liste von Segmenten, die aneinander anschliessen. Kein Modul; globales Objekt SCHRIFT.

var SCHRIFT = {
  SCHRITT: 0.04,                                   // Abstand der Pruefpunkte entlang eines Strichs
  Z: {
    // ---- Grossbuchstaben (Grundlinie bis Oberlinie) ----
    A: [[["Z", .8, 0, 0, 2]], [["Z", .8, 0, 1.6, 2]], [["Z", .33, 1.35, 1.27, 1.35]]],
    B: [[["Z", 0, 0, 0, 2]], [["Z", 0, 0, .55, 0], ["B", .55, .5, .48, .5, -90, 90], ["Z", .55, 1, 0, 1]], [["Z", 0, 1, .65, 1], ["B", .65, 1.5, .52, .5, -90, 90], ["Z", .65, 2, 0, 2]]],
    C: [[["B", .95, 1, .95, 1, -45, -315]]],
    D: [[["Z", 0, 0, 0, 2]], [["Z", 0, 0, .45, 0], ["B", .45, 1, .9, 1, -90, 90], ["Z", .45, 2, 0, 2]]],
    E: [[["Z", 0, 0, 0, 2]], [["Z", 0, 0, 1.1, 0]], [["Z", 0, 1, .9, 1]], [["Z", 0, 2, 1.1, 2]]],
    F: [[["Z", 0, 0, 0, 2]], [["Z", 0, 0, 1.1, 0]], [["Z", 0, 1, .9, 1]]],
    G: [[["B", .95, 1, .95, 1, -40, -360], ["Z", 1.9, 1, 1.15, 1]]],
    H: [[["Z", 0, 0, 0, 2]], [["Z", 1.3, 0, 1.3, 2]], [["Z", 0, 1, 1.3, 1]]],
    I: [[["Z", 0, 0, 0, 2]]],
    J: [[["Z", .9, 0, .9, 1.5], ["B", .45, 1.5, .45, .5, 0, 180]]],
    K: [[["Z", 0, 0, 0, 2]], [["Z", 1.1, 0, .05, 1.05, 1.2, 2]]],
    L: [[["Z", 0, 0, 0, 2, 1, 2]]],
    M: [[["Z", 0, 0, 0, 2]], [["Z", 0, 0, .8, 1.4, 1.6, 0, 1.6, 2]]],
    N: [[["Z", 0, 0, 0, 2]], [["Z", 0, 0, 1.3, 2, 1.3, 0]]],
    O: [[["B", 1, 1, 1, 1, -90, -450]]],
    P: [[["Z", 0, 0, 0, 2]], [["Z", 0, 0, .55, 0], ["B", .55, .5, .48, .5, -90, 90], ["Z", .55, 1, 0, 1]]],
    Q: [[["B", 1, 1, 1, 1, -90, -450]], [["Z", 1.15, 1.45, 1.95, 2.15]]],
    R: [[["Z", 0, 0, 0, 2]], [["Z", 0, 0, .55, 0], ["B", .55, .5, .48, .5, -90, 90], ["Z", .55, 1, 0, 1]], [["Z", .5, 1, 1.2, 2]]],
    S: [[["B", .65, .5, .6, .5, -30, -270], ["B", .65, 1.5, .65, .5, -90, 150]]],
    T: [[["Z", .7, 0, .7, 2]], [["Z", 0, 0, 1.4, 0]]],
    U: [[["Z", 0, 0, 0, 1.4], ["B", .65, 1.4, .65, .6, 180, 0], ["Z", 1.3, 1.4, 1.3, 0]]],
    V: [[["Z", 0, 0, .7, 2, 1.4, 0]]],
    W: [[["Z", 0, 0, .5, 2, 1, .4, 1.5, 2, 2, 0]]],
    X: [[["Z", 0, 0, 1.3, 2]], [["Z", 1.3, 0, 0, 2]]],
    Y: [[["Z", 0, 0, .7, 1]], [["Z", 1.4, 0, .7, 1, .7, 2]]],
    Z: [[["Z", 0, 0, 1.3, 0, 0, 2, 1.3, 2]]],
    // ---- Kleinbuchstaben (Mittelband 1..2, Oberlaengen bis 0, Unterlaengen bis 3) ----
    a: [[["B", .5, 1.5, .5, .5, -10, -370]], [["Z", 1, 1, 1, 2]]],
    b: [[["Z", 0, 0, 0, 2]], [["B", .5, 1.5, .5, .5, 180, 540]]],
    c: [[["B", .5, 1.5, .5, .5, -40, -320]]],
    d: [[["B", .5, 1.5, .5, .5, -10, -370]], [["Z", 1, 0, 1, 2]]],
    e: [[["Z", .02, 1.5, 1, 1.5], ["B", .5, 1.5, .5, .5, 0, -320]]],
    f: [[["B", .68, .45, .32, .3, -20, -180], ["Z", .36, .45, .36, 2]], [["Z", .02, 1, .8, 1]]],
    g: [[["B", .5, 1.5, .5, .5, -10, -370]], [["Z", 1, 1, 1, 2.55], ["B", .55, 2.55, .45, .4, 0, 160]]],
    h: [[["Z", 0, 0, 0, 2]], [["B", .5, 1.45, .5, .45, 180, 360], ["Z", 1, 1.45, 1, 2]]],
    i: [[["Z", 0, 1, 0, 2]], [["P", 0, .5]]],
    j: [[["Z", .45, 1, .45, 2.55], ["B", .05, 2.55, .4, .4, 0, 160]], [["P", .45, .5]]],
    k: [[["Z", 0, 0, 0, 2]], [["Z", .85, 1, .05, 1.55, .9, 2]]],
    l: [[["Z", 0, 0, 0, 2]]],
    m: [[["Z", 0, 1, 0, 2]], [["B", .4, 1.45, .4, .45, 180, 360], ["Z", .8, 1.45, .8, 2]], [["B", 1.2, 1.45, .4, .45, 180, 360], ["Z", 1.6, 1.45, 1.6, 2]]],
    n: [[["Z", 0, 1, 0, 2]], [["B", .5, 1.45, .5, .45, 180, 360], ["Z", 1, 1.45, 1, 2]]],
    o: [[["B", .5, 1.5, .5, .5, -90, -450]]],
    p: [[["Z", 0, 1, 0, 3]], [["B", .5, 1.5, .5, .5, 180, 540]]],
    q: [[["B", .5, 1.5, .5, .5, -10, -370]], [["Z", 1, 1, 1, 3]]],
    r: [[["Z", 0, 1, 0, 2]], [["B", .45, 1.45, .45, .45, 180, 300]]],
    s: [[["B", .42, 1.25, .36, .25, -30, -270], ["B", .42, 1.75, .4, .25, -90, 150]]],
    t: [[["Z", .3, .35, .3, 1.8], ["B", .6, 1.8, .3, .2, 180, 20]], [["Z", 0, 1, .75, 1]]],
    u: [[["Z", 0, 1, 0, 1.55], ["B", .5, 1.55, .5, .45, 180, 0], ["Z", 1, 1.55, 1, 1]], [["Z", 1, 1, 1, 2]]],
    v: [[["Z", 0, 1, .5, 2, 1, 1]]],
    w: [[["Z", 0, 1, .35, 2, .7, 1.25, 1.05, 2, 1.4, 1]]],
    x: [[["Z", 0, 1, .9, 2]], [["Z", .9, 1, 0, 2]]],
    y: [[["Z", 0, 1, .7, 2]], [["Z", 1.2, 1, .2, 3]]],
    z: [[["Z", 0, 1, .9, 1, 0, 2, .9, 2]]],
    // ---- Umlaute (nur klein, fuer Woerter bauen) ----
    "ä": [[["B", .5, 1.5, .5, .5, -10, -370]], [["Z", 1, 1, 1, 2]], [["P", .3, .6]], [["P", .72, .6]]],
    "ö": [[["B", .5, 1.5, .5, .5, -90, -450]], [["P", .28, .6]], [["P", .72, .6]]],
    "ü": [[["Z", 0, 1, 0, 1.55], ["B", .5, 1.55, .5, .45, 180, 0], ["Z", 1, 1.55, 1, 1]], [["Z", 1, 1, 1, 2]], [["P", .25, .6]], [["P", .75, .6]]]
  },
  cache: {},

  // Ein Strich als Liste gleichmaessig verteilter Punkte [x, y]
  abtasten: function (strich) {
    var pts = [], h = this.SCHRITT;
    var dazu = function (x, y) { var l = pts[pts.length - 1]; if (!l || Math.abs(l[0] - x) > 1e-6 || Math.abs(l[1] - y) > 1e-6) pts.push([x, y]); };
    strich.forEach(function (s) {
      if (s[0] === "P") { dazu(s[1], s[2]); return; }
      if (s[0] === "Z") {
        for (var i = 1; i + 3 < s.length; i += 2) {
          var x1 = s[i], y1 = s[i + 1], x2 = s[i + 2], y2 = s[i + 3], n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / h));
          for (var k = 0; k <= n; k++) dazu(x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n);
        }
        return;
      }
      if (s[0] === "B") {
        var cx = s[1], cy = s[2], rx = s[3], ry = s[4], w1 = s[5] * Math.PI / 180, w2 = s[6] * Math.PI / 180;
        var m = Math.max(2, Math.ceil(Math.abs(w2 - w1) * Math.max(rx, ry) / h));
        for (var j = 0; j <= m; j++) { var w = w1 + (w2 - w1) * j / m; dazu(cx + rx * Math.cos(w), cy + ry * Math.sin(w)); }
      }
    });
    return pts;
  },
  // Form eines Zeichens: Punktlisten der Striche und Ausdehnung in x
  form: function (z) {
    if (this.cache[z]) return this.cache[z];
    var def = this.Z[z];
    if (!def) return null;
    var self = this, striche = def.map(function (st) { return self.abtasten(st); }), x0 = 1e9, x1 = -1e9;
    striche.forEach(function (p) { p.forEach(function (q) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; }); });
    return (this.cache[z] = { z: z, striche: striche, x0: x0, x1: x1, breite: x1 - x0 });
  },
  // SVG-Pfad (d) einer Form, um dx verschoben
  pfad: function (f, dx) {
    return f.striche.map(function (p) {
      if (p.length === 1) return "M" + (p[0][0] + dx).toFixed(3) + " " + p[0][1].toFixed(3) + "h0.001";
      return p.map(function (q, i) { return (i ? "L" : "M") + (q[0] + dx).toFixed(3) + " " + q[1].toFixed(3); }).join("");
    }).join("");
  },
  // Gross- und Kleinbuchstabe nebeneinander als SVG (Hoehe ueber die Klasse im CSS)
  svgPaar: function (gross, farbe) {
    var G = this.form(gross), k = this.form(gross.toLowerCase()), luecke = 0.6;
    var breite = G.breite + luecke + k.breite, rand = 0.3;
    var d = this.pfad(G, -G.x0) + this.pfad(k, G.breite + luecke - k.x0);
    return '<svg class="buchst-svg" viewBox="' + (-rand) + ' ' + (-rand) + ' ' + (breite + 2 * rand) + ' ' + (3 + 2 * rand) + '" aria-label="' + gross + ' ' + gross.toLowerCase() + '">' +
      '<path d="' + d + '" fill="none" stroke="' + (farbe || "currentColor") + '" stroke-width="0.26" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },
  // Ein ganzes Wort als SVG, Zeichen nebeneinander (unbekannte Zeichen wie "-" werden als kurzer Strich gezeichnet)
  svgWort: function (wort, farbe) {
    var d = "", x = 0, rand = 0.3, self = this;
    String(wort).split("").forEach(function (z, i) {
      var f = self.form(z);
      if (i) x += 0.38;
      if (!f) { d += "M" + x.toFixed(3) + " 1.5h0.5"; x += 0.5; return; }
      d += self.pfad(f, x - f.x0); x += f.breite;
    });
    return '<svg class="buchst-svg" viewBox="' + (-rand) + ' ' + (-rand) + ' ' + (x + 2 * rand) + ' ' + (3 + 2 * rand) + '" aria-label="' + wort + '">' +
      '<path d="' + d + '" fill="none" stroke="' + (farbe || "currentColor") + '" stroke-width="0.26" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },
  // Einzelnes Zeichen als SVG
  svgEins: function (z, farbe) {
    var f = this.form(z), rand = 0.3;
    return '<svg class="buchst-svg" viewBox="' + (-rand) + ' ' + (-rand) + ' ' + (f.breite + 2 * rand) + ' ' + (3 + 2 * rand) + '" aria-label="' + z + '">' +
      '<path d="' + this.pfad(f, -f.x0) + '" fill="none" stroke="' + (farbe || "currentColor") + '" stroke-width="0.26" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
};
