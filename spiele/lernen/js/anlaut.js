// anlaut.js — Anlaute: Bild ansehen, Wort hoeren, Anfangsbuchstaben antippen. Kein Modul; globales Objekt ANLAUT.
// Anpassung: Es beginnt mit 4 Buchstaben (3 zur Auswahl). Nach jeder Runde mit mindestens 4 von 5 auf Anhieb richtig kommt ein Buchstabe dazu;
// ab 8 Buchstaben stehen 4 zur Auswahl. Der neueste Buchstabe kommt oefter dran. Stand je Sprache: lernen_anlaut_de / _en.

var ANLAUT = {
  START: 4, nr: 0, gut: 0, a: null, erster: true, frei: false, letzter: null, letztesWort: null,
  schluessel: function () { return "anlaut_" + LERNEN.sprache; },
  stand: function () { return LERNEN.lies(this.schluessel(), { pool: this.START }); },

  start: function () {
    this.nr = 0; this.gut = 0;
    LERNEN.zeige("anlaut"); LERNEN.punkte(0);
    LERNEN.el("anBild").onclick = function () { TOENE.tipp(); if (ANLAUT.a) LERNEN.sagNur(ANLAUT.a.wort); };
    this.neu();
  },
  neu: function () {
    var W = LERNEN.W(), reihe = W.reihe.split(""), pool = reihe.slice(0, Math.max(3, Math.min(reihe.length, this.stand().pool)));
    var kand = pool.concat(pool.slice(-1), pool.slice(-1)), b, versuch = 0;
    do { b = LERNEN.zufall(kand); } while (b === this.letzter && ++versuch < 12);
    this.letzter = b;
    var liste = W.woerter[b], w;
    versuch = 0; do { w = LERNEN.zufall(liste); } while (liste.length > 1 && w[0] === this.letztesWort && ++versuch < 8);
    this.letztesWort = w[0];
    var anzahl = pool.length >= 8 ? 4 : 3;
    var andere = LERNEN.mische(pool.filter(function (x) { return x !== b; }));
    if (andere.length < anzahl - 1) andere = andere.concat(LERNEN.mische(reihe.slice(pool.length)));
    var opt = LERNEN.mische([b].concat(andere.slice(0, anzahl - 1)));
    this.a = { b: b, wort: w[0], bild: w[1], opt: opt };
    this.erster = true; this.frei = true;

    LERNEN.el("anBild").textContent = w[1];
    LERNEN.el("anWort").innerHTML = "&nbsp;";
    var box = LERNEN.el("anOpt");
    box.className = "optionen n" + anzahl; box.innerHTML = "";
    opt.forEach(function (o) {
      var k = document.createElement("button");
      k.className = "opt"; k.setAttribute("data-b", o); k.innerHTML = SCHRIFT.svgPaar(o);
      k.onclick = function () { ANLAUT.tipp(o, k); };
      box.appendChild(k);
    });
    LERNEN.sag(W.saetze.anlautFrage(w[0]));
  },
  tipp: function (o, k) {
    if (!this.frei || k.disabled) return;
    var W = LERNEN.W(), a = this.a;
    if (o === a.b) {
      this.frei = false;
      k.classList.add("richtig"); TOENE.richtig(); LERNEN.konfetti(16, k);
      if (this.erster) this.gut++;
      this.nr++; LERNEN.punkte(this.nr);
      LERNEN.el("anWort").innerHTML = '<span class="erster">' + a.wort.charAt(0) + "</span>" + a.wort.slice(1);
      var p = LERNEN.sagNur(LERNEN.lob() + " " + W.saetze.anlautRichtig(a.wort, W.namen[a.b]));
      LERNEN.nachAnsage(p, function () { ANLAUT.weiter(); }, 350);
    } else {
      this.erster = false;
      k.disabled = true; k.classList.add("falsch"); TOENE.falsch();
      LERNEN.sagNur(W.saetze.nochmal + " " + a.wort);
    }
  },
  weiter: function () { if (this.nr >= LERNEN.RUNDE) this.ende(); else this.neu(); },
  ende: function () {
    var st = this.stand(), max = LERNEN.W().reihe.length;
    if (this.gut >= 4 && st.pool < max) st.pool++;
    LERNEN.schreib(this.schluessel(), st);
    LERNEN.belohnung("anlaut", function () { ANLAUT.start(); });
  }
};
