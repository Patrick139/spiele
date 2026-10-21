// spuren.js — Buchstaben mit dem Finger nachspuren, Strich fuer Strich in Schreibreihenfolge, im Vierliniensystem.
// Ablauf: gruener Punkt mit Nummer = hier anfangen, Pfeil = Richtung. Der Finger muss nahe am Strich bleiben (TOL in Zeilenabstaenden);
// Absetzen ist erlaubt, es geht dort weiter, wo der Finger aufgehoert hat. Eine Runde = 4 Zeichen (Gross, klein, naechster Gross, klein).
// Ueber die ABC-Leiste kann das Kind jeden Buchstaben selbst waehlen. Kein Modul; globales Objekt SPUREN.

function spAbstand(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }

var SPUREN = {
  RUNDE: 4, TOL: 0.45, START_TOL: 0.62, FENSTER: 25, REST: 0.32,     // REST: so viel Strich darf am Ende fehlen (Zeilenabstaende)
  ALPHABET: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  nr: 0, schlange: [], idx: 0, zuletzt: -1, z: null, f: null, strich: 0, fort: 0, aktiv: false, fertig: false, unten: false, letzt: null,
  U: 40, ox: 0, oy: 0, W: 0, H: 0, dpr: 1, cv: null, ctx: null, hinweisT: 0, laeuft: false, tAlt: 0,

  reihe: function () { var r = LERNEN.W().reihe; this.ALPHABET.split("").forEach(function (b) { if (r.indexOf(b) < 0) r += b; }); return r; },
  schluessel: function () { return "spuren_" + LERNEN.sprache; },
  stand: function () { return LERNEN.lies(this.schluessel(), { i: 0 }); },
  sichtbar: function () { return !LERNEN.el("spuren").classList.contains("weg"); },

  init: function () {
    var self = this, leiste = LERNEN.el("spLeiste");
    this.cv = LERNEN.el("spCv"); this.ctx = this.cv.getContext("2d");
    this.cv.addEventListener("pointerdown", function (e) { self.runter(e); });
    this.cv.addEventListener("pointermove", function (e) { self.bewegt(e); });
    this.cv.addEventListener("pointerup", function () { self.hoch(); });
    this.cv.addEventListener("pointercancel", function () { self.hoch(); });
    window.addEventListener("resize", function () { if (self.sichtbar()) self.groesse(); });
    LERNEN.el("spNeu").onclick = function () { TOENE.tipp(); self.vonVorne(); };
    this.ALPHABET.split("").forEach(function (b) {
      var k = document.createElement("button");
      k.textContent = b; k.setAttribute("data-b", b);
      k.onclick = function () { TOENE.tipp(); self.waehle(b); };
      leiste.appendChild(k);
    });
  },
  start: function () {
    this.nr = 0; this.zuletzt = -1;
    LERNEN.zeige("spuren"); LERNEN.punkte(0, this.RUNDE);
    this.schlangeAb(this.stand().i % this.reihe().length);
    this.neu();
    if (!this.laeuft) { this.laeuft = true; this.tAlt = 0; requestAnimationFrame(SPUREN.schleife); }
  },
  schlangeAb: function (i) {
    var r = this.reihe(), b1 = r[i % r.length], b2 = r[(i + 1) % r.length];
    this.idx = i; this.schlange = [b1, b1.toLowerCase(), b2, b2.toLowerCase()].slice(0, Math.max(1, this.RUNDE - this.nr));
  },
  waehle: function (b) { if (this.fertig) return; this.schlangeAb(this.reihe().indexOf(b)); this.neu(); },
  neu: function () {
    var W = LERNEN.W();
    this.z = this.schlange.shift(); this.f = SCHRIFT.form(this.z);
    this.strich = 0; this.fort = 0; this.aktiv = false; this.fertig = false; this.hinweisT = 0;
    this.groesse();
    var gross = this.z.toUpperCase(), knoepfe = document.querySelectorAll("#spLeiste button");
    for (var i = 0; i < knoepfe.length; i++) {
      var an = knoepfe[i].getAttribute("data-b") === gross;
      knoepfe[i].classList.toggle("an", an);
      if (an && knoepfe[i].scrollIntoView) knoepfe[i].scrollIntoView({ block: "nearest", inline: "center" });
    }
    LERNEN.el("spWort").innerHTML = "&nbsp;";
    LERNEN.sag(ANSAGE.SAETZE.spurenStart(gross, this.z !== gross));
  },
  vonVorne: function () { if (this.fertig) return; this.strich = 0; this.fort = 0; this.aktiv = false; },

  groesse: function () {
    var r = LERNEN.el("spFlaeche").getBoundingClientRect();
    this.W = Math.max(1, r.width); this.H = Math.max(1, r.height); this.dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.cv.width = Math.round(this.W * this.dpr); this.cv.height = Math.round(this.H * this.dpr);
    if (!this.f) return;
    var bw = Math.max(this.f.breite, 0.6);
    this.U = Math.max(10, Math.min(this.H / 3.8, this.W / (bw + 1.2)));
    this.ox = (this.W - bw * this.U) / 2 - this.f.x0 * this.U;
    this.oy = (this.H - 3 * this.U) / 2;
  },

  // ---- Finger ----
  punkt: function (e) { var r = this.cv.getBoundingClientRect(); return [(e.clientX - r.left - this.ox) / this.U, (e.clientY - r.top - this.oy) / this.U]; },
  runter: function (e) {
    e.preventDefault();
    if (this.fertig || !this.f) return;
    try { this.cv.setPointerCapture(e.pointerId); } catch (x) {}
    this.unten = true;
    var q = this.punkt(e), p = this.f.striche[this.strich];
    this.letzt = q;
    if (p.length === 1) { if (spAbstand(p[0], q) < this.START_TOL * 1.25) this.strichFertig(); else this.verfehlt(); return; }
    if (spAbstand(p[this.fort], q) < this.START_TOL) { this.aktiv = true; this.zieh(q); } else this.verfehlt();
  },
  bewegt: function (e) {
    if (!this.unten || this.fertig || !this.f) return;
    var liste = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    if (!liste || !liste.length) liste = [e];
    for (var i = 0; i < liste.length && !this.fertig; i++) {
      var q = this.punkt(liste[i]);
      this.letzt = q;
      if (this.aktiv) this.zieh(q);
      else {                                                    // Finger noch unten: am Anfang des naechsten Strichs gleich weitermachen
        var p = this.f.striche[this.strich];
        if (p && p.length > 1 && spAbstand(p[this.fort], q) < this.START_TOL * 0.7) this.aktiv = true;
      }
    }
  },
  hoch: function () {
    this.unten = false;
    if (this.aktiv && this.f && !this.fertig && this.rest() <= this.REST + 0.05) this.strichFertig();   // knapp vor dem Ende abgesetzt
    this.aktiv = false;
  },
  rest: function () { var p = this.f.striche[this.strich]; return p ? (p.length - 1 - this.fort) * SCHRIFT.SCHRITT : 0; },
  zieh: function (q) {
    var p = this.f.striche[this.strich], bis = Math.min(p.length - 1, this.fort + this.FENSTER), best = -1, bd = 1e9, j;
    for (j = this.fort; j <= bis; j++) { var d = spAbstand(p[j], q); if (d < bd) { bd = d; best = j; } }
    if (bd < this.TOL) {
      if (best > this.fort) this.fort = best;
      if (this.rest() <= this.REST && spAbstand(p[p.length - 1], q) < this.TOL) this.strichFertig();
      return;
    }
    var nah = bd;                                               // auch knapp dahinter suchen, bevor es als "daneben" zaehlt
    for (j = Math.max(0, this.fort - this.FENSTER); j < this.fort; j++) nah = Math.min(nah, spAbstand(p[j], q));
    if (nah > this.TOL * 1.7) { this.aktiv = false; this.verfehlt(); }
  },
  verfehlt: function () { this.hinweisT = 0.9; TOENE.weg(); },
  strichFertig: function () {
    this.strich++; this.fort = 0; this.aktiv = false;
    if (this.strich >= this.f.striche.length) { this.zeichenFertig(); return; }
    TOENE.strich();
    var p = this.f.striche[this.strich];
    if (this.unten && this.letzt && p.length > 1 && spAbstand(p[0], this.letzt) < this.START_TOL) this.aktiv = true;
  },
  zeichenFertig: function () {
    var W = LERNEN.W(), gross = this.z.toUpperCase(), w = W.woerter[gross] ? LERNEN.zufall(W.woerter[gross]) : null;
    this.fertig = true; this.aktiv = false; this.zuletzt = this.reihe().indexOf(gross);
    TOENE.richtig(); LERNEN.konfetti(22, LERNEN.el("spFlaeche"));
    this.nr++; LERNEN.punkte(this.nr, this.RUNDE);
    LERNEN.el("spWort").innerHTML = w ? '<span class="emo">' + w[1] + '</span><span><span class="erster">' + w[0].charAt(0) + "</span>" + w[0].slice(1) + "</span>" : "&nbsp;";
    var p = LERNEN.sagNur(ANSAGE.SAETZE.spurenFertig(gross, w ? w[0] : ""));
    LERNEN.nachAnsage(p, function () { SPUREN.weiter(); }, 450);
  },
  weiter: function () {
    if (this.nr >= this.RUNDE) { this.ende(); return; }
    if (!this.schlange.length) this.schlangeAb(this.zuletzt + 1);
    this.neu();
  },
  ende: function () {
    LERNEN.schreib(this.schluessel(), { i: (this.zuletzt + 1) % this.reihe().length });
    LERNEN.belohnung("spuren", function () { SPUREN.start(); });
  },

  // ---- Zeichnen ----
  schleife: function (t) {
    var s = SPUREN;
    if (!s.sichtbar()) { s.laeuft = false; return; }
    var dt = s.tAlt ? Math.min(0.05, (t - s.tAlt) / 1000) : 0.016; s.tAlt = t;
    if (s.hinweisT > 0) s.hinweisT = Math.max(0, s.hinweisT - dt);
    s.zeichne(t);
    requestAnimationFrame(SPUREN.schleife);
  },
  zeichne: function (t) {
    var c = this.ctx, d = this.dpr, U = this.U, ox = this.ox, oy = this.oy, Wd = this.W, i;
    c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, this.W, this.H);
    c.fillStyle = "rgba(255,210,92,0.17)"; c.fillRect(0, oy + U, Wd, U);                    // Mittelband
    c.strokeStyle = "#e6d6b6"; c.lineWidth = 2;
    for (i = 0; i <= 3; i++) { c.beginPath(); c.moveTo(0, oy + i * U); c.lineTo(Wd, oy + i * U); c.stroke(); }
    if (!this.f) return;
    var X = function (q) { return ox + q[0] * U; }, Y = function (q) { return oy + q[1] * U; };
    var linie = function (p, bis) {
      c.beginPath(); c.moveTo(X(p[0]), Y(p[0]));
      if (p.length === 1) c.lineTo(X(p[0]) + 0.01, Y(p[0]));
      for (var k = 1; k <= bis; k++) c.lineTo(X(p[k]), Y(p[k]));
      c.stroke();
    };
    var st = this.f.striche;
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = "#efe3cc"; c.lineWidth = 0.48 * U;                                       // Vorlage
    st.forEach(function (p) { linie(p, p.length - 1); });
    c.strokeStyle = "#ff8f3d"; c.lineWidth = 0.34 * U;                                       // fertige Striche
    for (i = 0; i < Math.min(this.strich, st.length); i++) linie(st[i], st[i].length - 1);
    if (this.fertig) return;
    var p = st[this.strich];
    c.save(); c.setLineDash([0.1 * U, 0.17 * U]); c.strokeStyle = "#bfa97f"; c.lineWidth = 0.07 * U; linie(p, p.length - 1); c.restore();
    if (this.fort > 0) { c.strokeStyle = "#ff8f3d"; c.lineWidth = 0.34 * U; linie(p, this.fort); }
    var q = p[this.fort], puls = 1 + 0.1 * Math.sin(t / 170) + 0.5 * this.hinweisT;
    if (p.length > 1) {                                                                     // Pfeil in Schreibrichtung
      var k = Math.min(p.length - 1, this.fort + Math.round(0.62 / SCHRIFT.SCHRITT)), q2 = p[k], k0 = Math.max(this.fort, k - 3), q1 = p[k0];
      var w = Math.atan2(Y(q2) - Y(q1), X(q2) - X(q1)), r = 0.17 * U;
      if (k > this.fort + 4) {
        c.save(); c.translate(X(q2), Y(q2)); c.rotate(w); c.fillStyle = "#34c759"; c.globalAlpha = 0.9;
        c.beginPath(); c.moveTo(r, 0); c.lineTo(-r * 0.8, -r * 0.85); c.lineTo(-r * 0.35, 0); c.lineTo(-r * 0.8, r * 0.85); c.closePath(); c.fill(); c.restore();
      }
    }
    c.fillStyle = "#34c759"; c.beginPath(); c.arc(X(q), Y(q), 0.21 * U * puls, 0, 6.2832); c.fill();
    c.fillStyle = "#fff"; c.font = "900 " + Math.round(0.24 * U) + "px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(String(this.strich + 1), X(q), Y(q) + 1);
  }
};
