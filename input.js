// input.js — Eingabe: Tastatur, Tasten auf dem Bildschirm (Handy) und Wischen auf dem Spielfeld.
// INPUT.schritt(dt, s) wendet gehaltene Tasten mit Wiederholung an (DAS/ARR). Kein Modul; globales Objekt INPUT.

var INPUT = {
  DAS: 0.16, ARR: 0.045, WEICH_ARR: 0.03,                // Wartezeit, bis die Wiederholung beginnt, und Takt danach (s)
  aktiv: false, letzterStein: null, runterAus: false, gehalten: { links: false, rechts: false, runter: false }, t: { links: 0, rechts: 0, runter: 0 }, pause: false,
  aufAktion: null,                                       // Rueckruf fuer Ausloeser, die nicht das Feld betreffen (pause)
  s: null,
  setze: function (name, an) {
    if (name === "fps" && an && this.aufAktion) { this.aufAktion("fps"); return; }
    if (!this.aktiv || !this.s) return;
    var s = this.s;
    if (name === "links" || name === "rechts" || name === "runter") {
      if (an && !this.gehalten[name]) {
        this.t[name] = 0;
        if (name === "links") { this.gehalten.rechts = false; tBewege(s, -1); }
        else if (name === "rechts") { this.gehalten.links = false; if (!tBewege(s, 1) && s.tor && this.aufWurf) this.aufWurf(); }   // an der Wand + Tor: Stein werfen
        else s.weich = true;
      }
      this.gehalten[name] = an;
      if (name === "runter") { this.runterAus = false; if (!an) s.weich = false; }
      return;
    }
    if (!an) return;
    if (name === "dreh") tDrehe(s, 1);
    else if (name === "drehL") tDrehe(s, -1);
    else if (name === "hart") tHart(s);
    else if (name === "halten") tHalten(s);
    else if (name === "pause" && this.aufAktion) this.aufAktion("pause");
  },
  schritt: function (dt, s) {
    this.s = s;
    if (!this.aktiv || s.tot) return;
    var self = this;
    ["links", "rechts"].forEach(function (n) {
      if (!self.gehalten[n]) return;
      self.t[n] += dt;
      while (self.t[n] >= self.DAS + self.ARR) { self.t[n] -= self.ARR; tBewege(s, n === "links" ? -1 : 1); }
    });
    if (this.letzterStein !== s.akt) { this.letzterStein = s.akt; if (this.gehalten.runter) this.runterAus = true; }   // gehaltenes ▼ gilt nicht fuer den naechsten Stein
    s.weich = this.gehalten.runter && !this.runterAus;
  },
  alleLoslassen: function () { this.gehalten.links = this.gehalten.rechts = this.gehalten.runter = false; if (this.s) this.s.weich = false; this.runterAus = false; },
  start: function (s) { this.s = s; this.aktiv = true; this.alleLoslassen(); },
  stopp: function () { this.aktiv = false; this.alleLoslassen(); },

  einrichten: function (cv) {
    var KARTE = { arrowleft: "links", a: "links", arrowright: "rechts", d: "rechts", arrowdown: "runter", s: "runter", arrowup: "dreh", w: "dreh", x: "dreh", z: "drehL", " ": "hart", c: "halten", shift: "halten", p: "pause", escape: "pause", f: "fps" };
    window.addEventListener("keydown", function (e) {
      var n = KARTE[e.key.toLowerCase()];
      if (!n) return;
      if (e.target && /input|textarea/i.test(e.target.tagName)) return;
      e.preventDefault(); if (e.repeat) return; SOUND.start(); INPUT.setze(n, true);
    });
    window.addEventListener("keyup", function (e) {
      var n = KARTE[e.key.toLowerCase()];
      if (n === "links" || n === "rechts" || n === "runter") INPUT.setze(n, false);
    });
    // Tasten auf dem Bildschirm
    var tasten = document.querySelectorAll("#steuer [data-t]");
    for (var i = 0; i < tasten.length; i++) (function (el) {
      var n = el.getAttribute("data-t");
      el.addEventListener("pointerdown", function (e) { e.preventDefault(); SOUND.start(); try { el.setPointerCapture(e.pointerId); } catch (x) {} el.classList.add("an"); INPUT.setze(n, true); if (navigator.vibrate && n !== "runter") navigator.vibrate(8); });
      var los = function (e) { el.classList.remove("an"); INPUT.setze(n, false); };
      el.addEventListener("pointerup", los); el.addEventListener("pointercancel", los); el.addEventListener("lostpointercapture", los);
      el.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    })(tasten[i]);
    // Wischen auf dem Feld: Antippen = drehen, seitlich ziehen = schieben, schnell nach unten = fallen lassen
    var g = null;
    cv.addEventListener("pointerdown", function (e) {
      SOUND.start();
      g = { x: e.clientX, y: e.clientY, x0: e.clientX, t0: performance.now(), bewegt: false, id: e.pointerId };
    });
    cv.addEventListener("pointermove", function (e) {
      if (!g || e.pointerId !== g.id || !INPUT.aktiv) return;
      var zelle = Math.max(16, ZEICH.lay.c * 0.9), dx = e.clientX - g.x;
      while (Math.abs(dx) >= zelle) { INPUT.setze(dx > 0 ? "rechts" : "links", true); INPUT.setze(dx > 0 ? "rechts" : "links", false); g.x += dx > 0 ? zelle : -zelle; dx = e.clientX - g.x; g.bewegt = true; }
      if (Math.abs(e.clientY - g.y) > 24 || Math.abs(e.clientX - g.x0) > 12) g.bewegt = true;
    });
    var ende = function (e) {
      if (!g || e.pointerId !== g.id) return;
      var dt = performance.now() - g.t0, dy = e.clientY - g.y, dx = e.clientX - g.x0;
      if (INPUT.aktiv && !g.bewegt && dt < 300) INPUT.setze("dreh", true);
      else if (INPUT.aktiv && dy > 140 && dt < 300 && Math.abs(dx) < dy) INPUT.setze("hart", true);
      g = null;
    };
    cv.addEventListener("pointerup", ende); cv.addEventListener("pointercancel", function () { g = null; });
  }
};
