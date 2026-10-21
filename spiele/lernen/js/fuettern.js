// fuettern.js — Mampfi fuettern: Rechengeschichten mit Zehnerfeldern. Mampfi frisst sichtbar weg (Minus), Helfer bringen dazu (Plus);
// beim Plus ueber 10 fuellt sich zuerst das Zehnerfeld, dann geht es im naechsten weiter (Zehnerueberschreitung sichtbar).
// Stufen: 1 Minus bis 10 · 2 Plus 11-20 ohne Ueberschreitung + Minus bis 10 · 3 Plus mit Ueberschreitung bis 20 · 4 Minus bis 20 (auch ueber die 10)
// · 5 gemischt bis 20 · 6 Plus und Minus bis 30. Rauf bei >= 4 von 5 auf Anhieb, runter bei <= 2. Kein Modul; globales Objekt FUETTERN.

var FUETTERN = {
  // [Bild, deutsch Mehrzahl, englisch Mehrzahl]
  ESSEN: [["🍪", "Kekse", "cookies"], ["🍎", "Äpfel", "apples"], ["🍓", "Erdbeeren", "strawberries"], ["🧁", "Muffins", "muffins"], ["🍩", "Donuts", "donuts"],
    ["🥕", "Karotten", "carrots"], ["🍌", "Bananen", "bananas"], ["🍬", "Zuckerl", "sweets"], ["🌭", "Würstel", "sausages"]],
  // [Bild, deutsch, englisch]
  HELFER: [["👵", "Oma", "Grandma"], ["👨", "Papa", "Dad"], ["🦔", "Der Igel", "The hedgehog"], ["🐿️", "Das Eichhörnchen", "The squirrel"], ["🧒", "Du", "You"]],
  RUNDE: 5, MAX: 6, nr: 0, gut: 0, a: null, erster: true, frei: false, zaehler: 0, letzte: "",

  stand: function () { return LERNEN.lies("fuettern", { stufe: 1 }); },
  z: function (lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); },
  aufgabe: function (stufe) {
    var z = this.z, a, b, plus;
    var minus10 = function () { a = z(3, 10); b = z(1, a - 1); return { a: a, b: b, op: "-" }; };
    var plusOhne = function () { a = z(10, 16); b = z(1, 9 - a % 10 || 1); if (a % 10 + b > 9) b = 9 - a % 10; if (b < 1) { a = 12; b = 3; } return { a: a, b: b, op: "+" }; };
    var plusUeber = function () { a = z(5, 9); b = z(11 - a, 9); return { a: a, b: b, op: "+" }; };
    var minus20 = function () { a = z(11, 18); b = Math.random() < 0.65 ? z(a % 10 + 1, Math.min(9, a - 1)) : z(1, a % 10 || 1); return { a: a, b: b, op: "-" }; };
    var t;
    if (stufe <= 1) t = minus10();
    else if (stufe === 2) t = Math.random() < 0.5 ? plusOhne() : minus10();
    else if (stufe === 3) t = Math.random() < 0.75 ? plusUeber() : minus10();
    else if (stufe === 4) t = Math.random() < 0.75 ? minus20() : plusUeber();
    else if (stufe === 5) t = Math.random() < 0.5 ? plusUeber() : minus20();
    else {
      plus = Math.random() < 0.5;
      if (plus) { a = z(11, 24); b = z(3, Math.min(9, 30 - a)); t = { a: a, b: b, op: "+" }; }
      else { a = z(15, 30); b = z(3, 12); t = { a: a, b: b, op: "-" }; }
    }
    t.c = t.op === "+" ? t.a + t.b : t.a - t.b;
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
    do { t = this.aufgabe(stufe); } while (t.a + t.op + t.b === this.letzte && ++n < 10);
    this.letzte = t.a + t.op + t.b;
    t.essen = LERNEN.zufall(this.ESSEN); t.helfer = LERNEN.zufall(this.HELFER);
    this.a = t; this.erster = true; this.frei = false; this.zaehler = 0;
    var m = LERNEN.el("fuMampfi");
    MAMPFI.ruhe(m, null);

    var name = spr === "en" ? t.essen[2] : t.essen[1];
    var hNr = this.HELFER.indexOf(t.helfer); if (t.helfer[1] === "Du") hNr = -1;
    var satz = t.op === "+" ? ANSAGE.SAETZE.fuetternPlus(t.a, name, hNr, t.b) : ANSAGE.SAETZE.fuetternMinus(t.a, name, t.b);
    var essenKey = ANSAGE.w(name).k;                              // in der Anzeige steht statt des Worts das Bild, vor dem Helfer sein Bild
    LERNEN.el("fuText").textContent = ANSAGE.text(satz.map(function (p) {
      if (p.k === essenKey) return t.essen[0] + (p.z || "");
      if (/\|s\|(helfer\.\d|fuDu)$/.test(p.k)) return t.helfer[0] + " " + p.t;
      return p;
    }));
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
    var zellen = box.querySelectorAll(".zelle");
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
          setTimeout(weg, 520);
        };
        setTimeout(weg, 300);
      }
    };
    p.then(function () { setTimeout(los, 250); });
  },
  frage: function () {
    var t = this.a, self = this, W = LERNEN.W();
    this.frei = true;
    LERNEN.el("fuAufgabe").innerHTML = t.a + (t.op === "+" ? " + " : " − ") + t.b + ' = <span class="frage">?</span>';
    var opt = [t.c], kand = [t.c + 1, t.c - 1, t.c + 2, t.c - 2];
    if (t.c >= 10) kand.push(t.c + 10, t.c - 10);
    kand = LERNEN.mische(kand.filter(function (x) { return x >= 0 && x <= 30 && x !== t.c; }));
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
    LERNEN.sag(ANSAGE.SAETZE.fuetternFrage(t.op));
  },
  zaehle: function (d) {
    if (d.classList.contains("gefressen") || d.classList.contains("gezaehlt")) return;
    this.zaehler++;
    d.classList.add("gezaehlt"); d.setAttribute("data-n", this.zaehler);
    TOENE.tipp(); LERNEN.sagNur([ANSAGE.z(this.zaehler)]);
  },
  tipp: function (o, k) {
    if (!this.frei || k.disabled) return;
    var W = LERNEN.W(), t = this.a, m = LERNEN.el("fuMampfi");
    if (o === t.c) {
      this.frei = false;
      k.classList.add("richtig"); TOENE.richtig(); LERNEN.konfetti(16, k);
      if (this.erster) this.gut++;
      this.nr++; LERNEN.punkte(this.nr);
      LERNEN.el("fuAufgabe").innerHTML = t.a + (t.op === "+" ? " + " : " − ") + t.b + ' = <span class="loesung">' + t.c + "</span>";
      if (Math.random() < 0.3) { MAMPFI.setze(m, "ruelpst", 900); TOENE.ruelps(); MAMPFI.blase(m, MAMPFI.spruch("ruelps").t, 1500); } else MAMPFI.jubelt(m);
      var p = LERNEN.sagNur([LERNEN.lob(), ANSAGE.SAETZE.rechnenRichtig(t.a, t.op, t.b, t.c)]);
      LERNEN.nachAnsage(p, function () { FUETTERN.weiter(); }, 500);
    } else {
      var hilfe = this.erster ? ANSAGE.SAETZE.zaehlTipp() : null;
      this.erster = false;
      k.disabled = true; k.classList.add("falsch"); MAMPFI.wundert(m);
      LERNEN.sagNur([ANSAGE.SAETZE.nochmal(), hilfe]);
    }
  },
  weiter: function () { if (this.nr >= this.RUNDE) this.ende(); else this.neu(); },
  ende: function () {
    var st = this.stand();
    if (this.gut >= 4 && st.stufe < this.MAX) st.stufe++;
    else if (this.gut <= 2 && st.stufe > 1) st.stufe--;
    LERNEN.schreib("fuettern", st);
    LERNEN.belohnung("fuettern", function () { FUETTERN.start(); });
  }
};
