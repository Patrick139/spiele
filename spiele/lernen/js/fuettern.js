// fuettern.js — Mampfi fuettern: Rechengeschichten mit Zehnerfeldern. Mampfi frisst sichtbar weg (Minus), Helfer bringen dazu (Plus).
// Beim Plus ueber den Zehner fuellt sich zuerst das Zehnerfeld, dann geht es im naechsten weiter. Beim Minus ueber den Zehner frisst Mampfi
// zuerst das angebrochene Zehnerfeld leer, haelt kurz an (der volle Zehner leuchtet) und frisst dann weiter: 15 − 7 = 15 − 5 − 2.
// Ab Stufe 3 manchmal umgekehrt gefragt: "Jetzt sind noch 8 da. Wie viele hat er gefressen?" (15 − ? = 8).
// Stufen siehe STUFEN; jede Stufe mischt leichtere Aufgaben bei. Stufenwechsel ueber LERNEN.fortschritt. Kein Modul; globales Objekt FUETTERN.

var FUETTERN = {
  // [Bild, deutsch Mehrzahl, englisch Mehrzahl]
  ESSEN: [["🍪", "Kekse", "cookies"], ["🍎", "Äpfel", "apples"], ["🍓", "Erdbeeren", "strawberries"], ["🧁", "Muffins", "muffins"], ["🍩", "Donuts", "donuts"],
    ["🥕", "Karotten", "carrots"], ["🍌", "Bananen", "bananas"], ["🍬", "Zuckerl", "sweets"], ["🌭", "Würstel", "sausages"]],
  // [Bild, deutsch, englisch]
  HELFER: [["👵", "Oma", "Grandma"], ["👨", "Papa", "Dad"], ["🦔", "Der Igel", "The hedgehog"], ["🐿️", "Das Eichhörnchen", "The squirrel"], ["🧒", "Du", "You"]],
  STUFEN: ["Minus bis 10", "Minus und Plus bis 20 ohne Zehnerübergang (17 − 4)", "Minus über den Zehner bis 20 (15 − 7)",
    "Plus und Minus über den Zehner bis 20 (8 + 6, 14 − 9)", "Minus bis 30, auch über den Zehner (23 − 6)", "Plus und Minus bis 30 gemischt"],
  RUNDE: 5, MAX: 6, nr: 0, gut: 0, a: null, erster: true, frei: false, zaehler: 0, letzte: "",

  schluessel: function () { return "fuettern"; },
  stand: function () { return LERNEN.lies("fuettern", { stufe: 1 }); },
  z: function (lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); },
  // Aufgabenarten
  ARTEN: {
    minus10: function (z) { var a = z(3, 10); return { a: a, b: z(1, a - 1), op: "-" }; },
    minusOhne20: function (z) { var a = z(13, 19); return { a: a, b: z(1, a % 10), op: "-" }; },                       // 17 − 4, 16 − 6
    plusOhne20: function (z) { var a = z(10, 17); return { a: a, b: z(1, 9 - a % 10), op: "+" }; },                     // 13 + 4
    minusUeber20: function (z) {                                                                                     // 15 − 7, 20 − 6
      if (Math.random() < 0.12) return { a: 20, b: z(2, 9), op: "-" };
      var a = z(11, 18); return { a: a, b: z(a % 10 + 1, 9), op: "-" };
    },
    plusUeber20: function (z) { var a = z(5, 9); return { a: a, b: z(11 - a, 9), op: "+" }; },                          // 8 + 6
    minus30: function (z) {                                                                                          // 23 − 6, 30 − 4, 27 − 5, 26 − 10
      var r = Math.random(), a, u;
      if (r < 0.15) return { a: z(20, 30), b: 10, op: "-" };                                                          // einen Zehner weg
      if (r < 0.75) { a = LERNEN.zufall([21, 22, 23, 24, 25, 26, 27, 28, 30]); u = a % 10; return { a: a, b: z(u + 1, 9), op: "-" }; }   // ueber den Zehner
      a = z(23, 29); return { a: a, b: z(2, a % 10), op: "-" };                                                       // ohne Uebergang
    },
    plus30: function (z) { var a = z(11, 24); return { a: a, b: z(2, Math.min(9, 30 - a)), op: "+" }; }             // 18 + 7
  },
  // Je Stufe: [Art, Anteil]
  MIX: [null,
    [["minus10", 1]],
    [["minusOhne20", 0.55], ["plusOhne20", 0.25], ["minus10", 0.2]],
    [["minusUeber20", 0.7], ["minusOhne20", 0.15], ["minus10", 0.15]],
    [["minusUeber20", 0.45], ["plusUeber20", 0.4], ["minusOhne20", 0.15]],
    [["minus30", 0.65], ["minusUeber20", 0.2], ["plusUeber20", 0.15]],
    [["minus30", 0.4], ["plus30", 0.35], ["minusUeber20", 0.15], ["plusUeber20", 0.1]]],
  aufgabe: function (stufe) {
    var mix = this.MIX[Math.min(this.MAX, Math.max(1, stufe))], r = Math.random(), art = mix[mix.length - 1][0];
    for (var i = 0; i < mix.length; i++) { if (r < mix[i][1]) { art = mix[i][0]; break; } r -= mix[i][1]; }
    var t = this.ARTEN[art](this.z);
    t.c = t.op === "+" ? t.a + t.b : t.a - t.b;
    t.gefragt = (stufe >= 3 && t.op === "-" && t.b < 10 && Math.random() < 0.18) ? "b" : "c";   // umgekehrt: wie viele gefressen?
    return t;
  },

  start: function () {
    this.nr = 0; this.gut = 0;
    LERNEN.zeige("fuettern"); LERNEN.punkte(0);
    var m = LERNEN.el("fuMampfi");
    if (!m.querySelector("svg")) { MAMPFI.einsetzen(m); m.onclick = function () { MAMPFI.kitzeln(m); }; }
    this.neu();
  },
  neu: function () {
    var W = LERNEN.W(), spr = LERNEN.sprache, stufe = Math.min(this.MAX, Math.max(1, this.stand().stufe)), t, n = 0, self = this;
    LERNEN.zeigeStufe(stufe);
    do { t = this.aufgabe(stufe); } while (t.a + t.op + t.b === this.letzte && ++n < 10);
    this.letzte = t.a + t.op + t.b;
    t.essen = LERNEN.zufall(this.ESSEN); t.helfer = LERNEN.zufall(this.HELFER);
    this.a = t; this.erster = true; this.frei = false; this.zaehler = 0;
    var m = LERNEN.el("fuMampfi");
    MAMPFI.ruhe(m, null);

    var name = spr === "en" ? t.essen[2] : t.essen[1];
    var hName = spr === "en" ? t.helfer[2] : t.helfer[1], du = t.helfer[1] === "Du", satz, anzeige;
    if (t.op === "+") { satz = W.saetze.fuetternPlus(t.a, name, hName, t.b, du); anzeige = W.saetze.fuetternPlus(t.a, t.essen[0], t.helfer[0] + " " + hName, t.b, du); }
    else if (t.gefragt === "b") { satz = W.saetze.fuetternMinusEtwas(t.a, name); anzeige = W.saetze.fuetternMinusEtwas(t.a, t.essen[0]); }
    else { satz = W.saetze.fuetternMinus(t.a, name, t.b); anzeige = W.saetze.fuetternMinus(t.a, t.essen[0], t.b); }
    LERNEN.el("fuText").textContent = anzeige;
    LERNEN.el("fuAufgabe").innerHTML = "&nbsp;";
    LERNEN.el("fuOpt").innerHTML = "";

    // Zehnerfelder: so viele, wie die groesste Zahl braucht
    var gross = Math.max(t.a, t.c), felder = Math.max(1, Math.ceil(gross / 10)), box = LERNEN.el("fuFelder");
    box.innerHTML = ""; box.style.setProperty("--zf", felder);
    for (var f = 0; f < felder; f++) {
      var zf = document.createElement("div"); zf.className = "zehner";
      for (var i = 0; i < 10; i++) { var c = document.createElement("div"); c.className = "zelle"; zf.appendChild(c); }
      box.appendChild(zf);
    }
    var zellen = box.querySelectorAll(".zelle"), zehner = box.querySelectorAll(".zehner");
    var setze = function (i) {
      var d = document.createElement("button");
      d.className = "ding"; d.textContent = t.essen[0];
      d.onclick = function () { self.zaehle(d); };
      zellen[i].innerHTML = ""; zellen[i].appendChild(d);
      return d;
    };
    for (var k = 0; k < t.a; k++) setze(k);

    var p = LERNEN.sag(satz);
    var g = LERNEN.gen;
    var los = function () {                                        // nach der Ansage: Geschichte vorspielen, dann Frage
      if (g !== LERNEN.gen) return;
      if (t.op === "+") {
        var i = 0;
        var dazu = function () {
          if (g !== LERNEN.gen) return;
          if (i >= t.b) { self.frage(); return; }
          var d = setze(t.a + i); d.classList.add("neu"); TOENE.pling(i % 9); i++;
          setTimeout(dazu, 380);
        };
        dazu();
      } else {
        MAMPFI.setze(m, "offen");
        var j = 0;
        var weg = function () {
          if (g !== LERNEN.gen) return;
          if (j >= t.b) { MAMPFI.setze(m, "kaut", 700); setTimeout(function () { if (g === LERNEN.gen) self.frage(); }, 500); return; }
          var zelle = zellen[t.a - 1 - j], d = zelle.querySelector(".ding");
          j++;
          if (d) { LERNEN.fliege(d, m, 420, function () { TOENE.mampf(); }); d.classList.add("gefressen"); zelle.classList.add("kruemel"); }
          var rest = t.a - j;
          if (j < t.b && rest > 0 && rest % 10 === 0 && t.b < 10) {     // Zehner erreicht: kurz anhalten, der volle Zehner leuchtet
            setTimeout(function () {
              if (g !== LERNEN.gen) return;
              var zf = zehner[rest / 10 - 1];
              zf.setAttribute("data-z", rest); zf.classList.add("zehn-blitz"); TOENE.pling(8);
              setTimeout(function () { zf.classList.remove("zehn-blitz"); }, 1100);
              setTimeout(weg, 1000);
            }, 450);
          } else setTimeout(weg, 520);
        };
        setTimeout(weg, 300);
      }
    };
    p.then(function () { setTimeout(los, 250); });
  },
  frage: function () {
    var t = this.a, self = this, W = LERNEN.W(), loesung = t.gefragt === "b" ? t.b : t.c;
    this.frei = true;
    LERNEN.el("fuAufgabe").innerHTML = t.gefragt === "b" ? t.a + ' − <span class="frage">?</span> = ' + t.c : t.a + (t.op === "+" ? " + " : " − ") + t.b + ' = <span class="frage">?</span>';
    var opt = [loesung], kand = [loesung + 1, loesung - 1, loesung + 2, loesung - 2], typisch = [];
    if (t.gefragt === "b") typisch.push(t.c);                                        // Rest statt Gefressenes
    else {
      if (t.c >= 10) kand.push(t.c + 10, t.c - 10);
      var u = t.a % 10;
      if (t.op === "-" && t.b < 10 && t.b > u) typisch.push(t.a - u + (t.b - u));      // 15 − 7 → 12 (Einer verkehrt herum abgezogen)
      if (t.op === "+" && t.a % 10 + t.b >= 10) typisch.push(t.c - 10);                // Zehner vergessen
    }
    var gut = function (x) { return x >= 0 && x <= 30 && x !== loesung && opt.indexOf(x) < 0; };
    typisch = typisch.filter(gut);
    if (typisch.length && Math.random() < 0.7) opt.push(typisch[0]);
    kand = LERNEN.mische(kand.filter(gut));
    for (var k = 0; k < kand.length && opt.length < 3; k++) if (opt.indexOf(kand[k]) < 0) opt.push(kand[k]);
    LERNEN.mische(opt);
    var ob = LERNEN.el("fuOpt");
    ob.className = "optionen zahlen"; ob.innerHTML = "";
    opt.forEach(function (o) {
      var b = document.createElement("button");
      b.className = "opt"; b.textContent = o; b.setAttribute("data-z", o);
      b.onclick = function () { self.tipp(o, b); };
      ob.appendChild(b);
    });
    if (t.gefragt === "b") LERNEN.sag(W.saetze.fuetternFrageGefressen(t.c));
    else LERNEN.sag(t.op === "+" ? W.saetze.fuetternFragePlus : W.saetze.fuetternFrageMinus);
  },
  zaehle: function (d) {
    if (d.classList.contains("gefressen") || d.classList.contains("gezaehlt")) return;
    this.zaehler++;
    d.classList.add("gezaehlt"); d.setAttribute("data-n", this.zaehler);
    TOENE.tipp(); LERNEN.sagNur(String(this.zaehler));
  },
  tipp: function (o, k) {
    if (!this.frei || k.disabled) return;
    var W = LERNEN.W(), t = this.a, m = LERNEN.el("fuMampfi"), loesung = t.gefragt === "b" ? t.b : t.c;
    if (o === loesung) {
      this.frei = false;
      k.classList.add("richtig"); TOENE.richtig(); LERNEN.konfetti(16, k);
      if (this.erster) this.gut++;
      this.nr++; LERNEN.punkte(this.nr);
      var hoch = LERNEN.fortschritt(this, this.erster) > 0;
      LERNEN.el("fuAufgabe").innerHTML = t.gefragt === "b" ? t.a + ' − <span class="loesung">' + t.b + "</span> = " + t.c
        : t.a + (t.op === "+" ? " + " : " − ") + t.b + ' = <span class="loesung">' + t.c + "</span>";
      var satz = W.saetze.rechnenRichtig(t.a, t.op, t.b, t.c);
      if (hoch) { MAMPFI.begeistert(m); LERNEN.zeigeStufe(this.stand().stufe, true); LERNEN.konfetti(30); satz += " " + W.saetze.stufeHoch; }
      else if (Math.random() < 0.3) { MAMPFI.setze(m, "ruelpst", 900); TOENE.ruelps(); MAMPFI.blase(m, MAMPFI.spruch("ruelps"), 1500); }
      else MAMPFI.jubelt(m);
      var p = LERNEN.sagNur(LERNEN.lob() + " " + satz);
      LERNEN.nachAnsage(p, function () { FUETTERN.weiter(); }, 500);
    } else {
      var hilfe = this.erster ? " " + W.saetze.zaehlTipp : "";
      this.erster = false;
      k.disabled = true; k.classList.add("falsch"); MAMPFI.wundert(m);
      LERNEN.sagNur(W.saetze.nochmal + hilfe);
    }
  },
  weiter: function () { if (this.nr >= this.RUNDE) this.ende(); else this.neu(); },
  ende: function () { LERNEN.belohnung("fuettern", function () { FUETTERN.start(); }); }
};
