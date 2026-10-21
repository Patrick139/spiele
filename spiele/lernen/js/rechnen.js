// rechnen.js — Plus und Minus bis 10 mit Bildern. Kein Modul; globales Objekt RECHNEN.
// Stufen: 1 Plus bis 5, 2 Plus bis 10, 3 Minus bis 5, 4 Minus bis 10, 5 gemischt bis 10; jede Stufe mischt leichtere bei.
// Stufenwechsel ueber LERNEN.fortschritt. Bilder stehen in Fuenferreihen; Antippen zaehlt laut mit.

var RECHNEN = {
  DINGE: ["🍎", "🍓", "🐞", "⭐", "🐟", "🍪", "🎈", "🚗", "🐥", "🌸", "🍌", "🐢"],
  STUFEN: ["Plus bis 5", "Plus bis 10", "Minus bis 5", "Minus bis 10", "Plus und Minus bis 10"],
  MAX: 5, nr: 0, gut: 0, a: null, erster: true, frei: false, zaehler: 0, letzte: "",
  schluessel: function () { return "rechnen"; },
  stand: function () { return LERNEN.lies("rechnen", { stufe: 1 }); },

  start: function () { this.nr = 0; this.gut = 0; LERNEN.zeige("rechnen"); LERNEN.punkte(0); this.neu(); },
  aufgabe: function (stufe) {
    var z = function (lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); };
    var plus = stufe <= 2 || (stufe === 5 && Math.random() < 0.5), max = (stufe === 1 || stufe === 3) ? 5 : 10, a, b, s;
    if (plus) {
      s = (stufe === 2 && Math.random() < 0.6) ? z(6, 10) : z(2, max);
      a = z(1, s - 1); b = s - a;
      return { a: a, b: b, op: "+", c: s };
    }
    a = z(2, max); b = z(1, a - 1);
    if (Math.random() < 0.08) b = a;                                     // selten: alles weg, Ergebnis 0
    return { a: a, b: b, op: "-", c: a - b };
  },
  neu: function () {
    var W = LERNEN.W(), stufe = Math.min(this.MAX, Math.max(1, this.stand().stufe)), t, n = 0;
    LERNEN.zeigeStufe(stufe);
    do { t = this.aufgabe(stufe > 1 && Math.random() < 0.2 ? 1 + Math.floor(Math.random() * (stufe - 1)) : stufe); } while (t.a + t.op + t.b === this.letzte && ++n < 10);
    this.letzte = t.a + t.op + t.b;
    t.ding = LERNEN.zufall(this.DINGE);
    this.a = t; this.erster = true; this.frei = true; this.zaehler = 0;

    var box = LERNEN.el("reBilder"), gesamt = t.op === "+" ? t.a + t.b : t.a;
    box.innerHTML = "";
    box.style.setProperty("--g", (gesamt <= 6 ? "clamp(38px, 10vw, 56px)" : "clamp(32px, 8.2vw, 50px)"));
    var self = this;
    var gruppe = function (anzahl, start) {
      var g = document.createElement("div");
      g.className = "gruppe"; g.style.gridTemplateColumns = "repeat(" + Math.min(5, Math.max(1, anzahl)) + ", auto)";
      for (var i = 0; i < anzahl; i++) {
        var d = document.createElement("button");
        d.className = "ding"; d.textContent = t.ding; d.setAttribute("data-i", start + i);
        d.onclick = (function (el) { return function () { self.zaehle(el); }; })(d);
        g.appendChild(d);
      }
      return g;
    };
    if (t.op === "+") {
      box.appendChild(gruppe(t.a, 0));
      var plus = document.createElement("span"); plus.className = "zeichen"; plus.textContent = "+"; box.appendChild(plus);
      box.appendChild(gruppe(t.b, t.a));
    } else {
      box.appendChild(gruppe(t.a, 0));
      LERNEN.spaeter(function () {                                     // die abgezogenen Dinge werden durchgestrichen
        var d = box.querySelectorAll(".ding");
        for (var i = t.a - t.b; i < t.a; i++) if (d[i]) d[i].classList.add("fort");
      }, 700);
    }
    var zeichen = t.op === "+" ? " + " : " − ";
    LERNEN.el("reAufgabe").innerHTML = t.a + zeichen + t.b + ' = <span class="frage">?</span>';

    var opt = [t.c], kand = LERNEN.mische([t.c - 1, t.c + 1, t.c - 2, t.c + 2, t.c + 3].filter(function (x) { return x >= 0 && x <= 10; }));
    for (var k = 0; k < kand.length && opt.length < 3; k++) if (opt.indexOf(kand[k]) < 0) opt.push(kand[k]);
    LERNEN.mische(opt);
    var ob = LERNEN.el("reOpt");
    ob.className = "optionen zahlen"; ob.innerHTML = "";
    opt.forEach(function (o) {
      var b = document.createElement("button");
      b.className = "opt"; b.textContent = o; b.setAttribute("data-z", o);
      b.onclick = function () { self.tipp(o, b); };
      ob.appendChild(b);
    });
    LERNEN.sag(t.op === "+" ? W.saetze.plus(t.a, t.b) : W.saetze.minus(t.a, t.b));
  },
  zaehle: function (d) {
    if (d.classList.contains("fort")) { TOENE.weg(); return; }
    if (d.classList.contains("gezaehlt")) return;
    this.zaehler++;
    d.classList.add("gezaehlt"); d.setAttribute("data-n", this.zaehler);
    TOENE.tipp(); LERNEN.sagNur(String(this.zaehler));
  },
  tipp: function (o, k) {
    if (!this.frei || k.disabled) return;
    var W = LERNEN.W(), t = this.a;
    if (o === t.c) {
      this.frei = false;
      k.classList.add("richtig"); TOENE.richtig(); LERNEN.konfetti(16, k);
      if (this.erster) this.gut++;
      this.nr++; LERNEN.punkte(this.nr);
      var hoch = LERNEN.fortschritt(this, this.erster) > 0, satz = W.saetze.rechnenRichtig(t.a, t.op, t.b, t.c);
      if (hoch) { LERNEN.zeigeStufe(this.stand().stufe, true); LERNEN.konfetti(30); TOENE.stufe(); satz += " " + W.saetze.stufeHoch; }
      LERNEN.el("reAufgabe").innerHTML = t.a + (t.op === "+" ? " + " : " − ") + t.b + ' = <span class="loesung">' + t.c + "</span>";
      var p = LERNEN.sagNur(LERNEN.lob() + " " + satz);
      LERNEN.nachAnsage(p, function () { RECHNEN.weiter(); }, 350);
    } else {
      var hilfe = this.erster ? " " + W.saetze.zaehlTipp : "";
      this.erster = false;
      k.disabled = true; k.classList.add("falsch"); TOENE.falsch();
      LERNEN.sagNur(W.saetze.nochmal + hilfe);
    }
  },
  weiter: function () { if (this.nr >= LERNEN.RUNDE) this.ende(); else this.neu(); },
  ende: function () { LERNEN.belohnung("rechnen", function () { RECHNEN.start(); }); }
};
