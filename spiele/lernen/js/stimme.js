// stimme.js — Sprachausgabe mit der Handystimme (speechSynthesis) und kleine Toene (WebAudio). Kein Modul; globale Objekte STIMME und TOENE.
// Die Handystimme liest Woerter gut vor; einzelne Laute ("mmm") kann sie nicht, deshalb sagen die Spiele Buchstabennamen ("Emm").

var STIMME = {
  an: typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined",
  stimmen: [],
  geladen: false,
  aufGeladen: null,                                   // Rueckruf, sobald die Liste der Stimmen da ist
  TEMPO: 0.88, HOEHE: 1.08,                           // etwas langsamer und heller als normal
  wahl: { de: "", en: "" },                           // in den Einstellungen gewaehlte Stimme je Sprache (voiceURI); leer = automatisch

  init: function () {
    if (!this.an) return;
    var self = this;
    var laden = function () {
      var v = speechSynthesis.getVoices() || [];
      if (v.length) { self.stimmen = v; self.geladen = true; if (self.aufGeladen) self.aufGeladen(); }
    };
    laden();
    try { speechSynthesis.addEventListener("voiceschanged", laden); } catch (e) { speechSynthesis.onvoiceschanged = laden; }
  },
  // Alle Stimmen einer Sprache (fuer die Auswahl in den Einstellungen)
  liste: function (spr) {
    return this.stimmen.filter(function (v) { return String(v.lang || "").replace("_", "-").toLowerCase().indexOf(spr) === 0; });
  },
  // Stimme fuer "de" oder "en": die gewaehlte, sonst zuerst oesterreichisch bzw. britisch, dann deutsch bzw. amerikanisch, dann irgendeine passende
  waehle: function (spr) {
    var wunsch = spr === "en" ? ["en-gb", "en-us", "en"] : ["de-at", "de-de", "de"], v = this.stimmen, gew = this.wahl[spr];
    if (gew) for (var g = 0; g < v.length; g++) if (v[g].voiceURI === gew) return v[g];
    for (var w = 0; w < wunsch.length; w++) {
      for (var i = 0; i < v.length; i++) {
        var l = String(v[i].lang || "").replace("_", "-").toLowerCase();
        if (wunsch[w].length === 2 ? l.indexOf(wunsch[w]) === 0 : l === wunsch[w]) return v[i];
      }
    }
    return null;
  },
  hatStimme: function (spr) { return this.an && (!this.geladen || !!this.waehle(spr)); },

  // Sagt den Text; das Versprechen erfuellt sich am Ende der Ansage oder spaetestens nach einer geschaetzten Sprechdauer.
  sag: function (text, spr) {
    var self = this;
    return new Promise(function (ok) {
      var fertig = false, t;
      var ende = function () { if (fertig) return; fertig = true; clearTimeout(t); ok(); };
      t = setTimeout(ende, 1200 + String(text).length * 95);
      if (!self.an) return;
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(String(text)), v = self.waehle(spr);
        u.lang = v ? v.lang : (spr === "en" ? "en-GB" : "de-DE");
        if (v) u.voice = v;
        u.rate = self.TEMPO; u.pitch = self.HOEHE;
        u.onend = ende; u.onerror = ende;
        setTimeout(function () { try { speechSynthesis.speak(u); } catch (e) { ende(); } }, 40);   // Android verschluckt sonst manchmal die Ansage direkt nach cancel()
      } catch (e) { ende(); }
    });
  },
  still: function () { try { if (this.an) speechSynthesis.cancel(); } catch (e) {} }
};

var TOENE = {
  ctx: null,
  start: function () {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; } }
    if (this.ctx && this.ctx.state === "suspended") { try { this.ctx.resume(); } catch (e) {} }
  },
  ton: function (f, dauer, typ, laut, fEnde, verz) {
    var c = this.ctx;
    if (!c) return;
    try {
      var t = c.currentTime + (verz || 0), o = c.createOscillator(), g = c.createGain();
      o.type = typ || "sine"; o.frequency.setValueAtTime(f, t);
      if (fEnde) o.frequency.exponentialRampToValueAtTime(fEnde, t + dauer);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(laut || 0.15, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dauer + 0.05);
    } catch (e) {}
  },
  tipp: function () { this.ton(880, 0.06, "sine", 0.07); },
  richtig: function () { this.ton(660, 0.14, "sine", 0.16); this.ton(990, 0.22, "sine", 0.16, null, 0.11); },
  falsch: function () { this.ton(260, 0.2, "triangle", 0.12, 190); },
  weg: function () { this.ton(330, 0.1, "triangle", 0.06, 280); },
  strich: function () { this.ton(740, 0.08, "triangle", 0.1, 1100); },
  tick: function () { this.ton(2400, 0.018, "square", 0.025); },
  pling: function (i) { var f = [523, 587, 659, 784, 880, 1046, 1175, 1318, 1568][Math.min(8, i || 0)]; this.ton(f, 0.16, "sine", 0.14); this.ton(f * 2, 0.1, "sine", 0.04, null, 0.02); },
  rauschen: function (dauer, laut, filterF, verz, q) {            // gefiltertes Rauschen (fuer Mampfen)
    var c = this.ctx;
    if (!c) return;
    try {
      var n = Math.ceil(c.sampleRate * dauer), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime + (verz || 0);
      src.buffer = buf; f.type = "bandpass"; f.frequency.value = filterF || 900; f.Q.value = q || 1.2;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(laut || 0.3, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
      src.connect(f); f.connect(g); g.connect(c.destination); src.start(t); src.stop(t + dauer + 0.02);
    } catch (e) {}
  },
  mampf: function () { for (var i = 0; i < 3; i++) this.rauschen(0.07, 0.35, 700 + i * 150, i * 0.13, 1.5); },
  ruelps: function () {                                            // tiefer, wackelnder Ton durch einen Tiefpass
    var c = this.ctx;
    if (!c) return;
    try {
      var t = c.currentTime, o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), f = c.createBiquadFilter(), g = c.createGain();
      o.type = "sawtooth"; o.frequency.setValueAtTime(105, t); o.frequency.linearRampToValueAtTime(70, t + 0.55);
      lfo.frequency.value = 23; lg.gain.value = 28; lfo.connect(lg); lg.connect(o.frequency);
      f.type = "lowpass"; f.frequency.value = 650;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t + 0.04); g.gain.setValueAtTime(0.3, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(f); f.connect(g); g.connect(c.destination); o.start(t); lfo.start(t); o.stop(t + 0.65); lfo.stop(t + 0.65);
    } catch (e) {}
  },
  hae: function () { this.ton(300, 0.12, "triangle", 0.12, 420); this.ton(420, 0.18, "triangle", 0.1, 300, 0.13); },
  geschafft: function () { var self = this; [523, 659, 784, 1046].forEach(function (f, i) { self.ton(f, 0.26, "triangle", 0.16, null, i * 0.12); }); this.ton(1318, 0.6, "sine", 0.12, null, 0.5); }
};
