// sound.js — kleine Klaenge, direkt im Browser erzeugt (WebAudio, keine Dateien). SOUND.start() beim ersten Antippen aufrufen.
// SOUND.ereignis(e) bekommt dieselben Ereignisse wie FX (tetris.js s.ev). Kein Modul; globales Objekt SOUND.

var SOUND = {
  ac: null, an: true, master: null,
  start: function () {
    if (this.ac) { if (this.ac.state === "suspended") this.ac.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ac = new AC(); this.master = this.ac.createGain(); this.master.gain.value = 0.5; this.master.connect(this.ac.destination);
  },
  ton: function (f, d, typ, v, bis, verz) {         // Frequenz, Dauer, Wellenform, Lautstaerke, Gleitton-Ziel, Verzoegerung
    if (!this.ac || !this.an) return;
    var t0 = this.ac.currentTime + (verz || 0), o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = typ || "sine"; o.frequency.setValueAtTime(f, t0);
    if (bis) o.frequency.exponentialRampToValueAtTime(bis, t0 + d);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v || 0.2, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    o.connect(g); g.connect(this.master); o.start(t0); o.stop(t0 + d + 0.02);
  },
  rausch: function (d, v, filter, verz) {            // kurzes Rauschen (Platschen, Eier)
    if (!this.ac || !this.an) return;
    var n = Math.floor(this.ac.sampleRate * d), buf = this.ac.createBuffer(1, n, this.ac.sampleRate), da = buf.getChannelData(0);
    for (var i = 0; i < n; i++) da[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = this.ac.createBufferSource(), f = this.ac.createBiquadFilter(), g = this.ac.createGain(), t0 = this.ac.currentTime + (verz || 0);
    s.buffer = buf; f.type = "lowpass"; f.frequency.value = filter || 800; g.gain.value = v || 0.3;
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t0);
  },
  ereignis: function (e) {
    if (!this.ac) return;
    if (e.art === "schieb") this.ton(520, 0.04, "square", 0.04);
    else if (e.art === "dreh") this.ton(760, 0.06, "triangle", 0.09, 1000);
    else if (e.art === "hart") { this.ton(160, 0.14, "sine", 0.35, 55); this.rausch(0.08, 0.25, 600); }
    else if (e.art === "sperre") this.ton(300, 0.06, "triangle", 0.12, 200);
    else if (e.art === "halten") this.ton(420, 0.1, "sine", 0.12, 640);
    else if (e.art === "zeilen") {
      var basis = [0, 523, 587, 659, 784][e.n], i;
      for (i = 0; i < e.n + 1; i++) this.ton(basis * Math.pow(1.26, i), 0.18, "triangle", 0.18, undefined, i * 0.07);
      if (e.n >= 4) { this.ton(1046, 0.5, "sawtooth", 0.1, undefined, 0.3); this.ton(1318, 0.5, "sine", 0.15, undefined, 0.3); }
      if (e.kombo >= 1) this.ton(880 + e.kombo * 90, 0.12, "square", 0.07, undefined, 0.35);
    } else if (e.art === "angriff") { this.ton(700, 0.15, "sine", 0.12, 1200); }
    else if (e.art === "eier") { this.rausch(0.18, 0.5, 500); this.ton(120, 0.2, "sine", 0.3, 50); this.ton(90, 0.25, "sine", 0.2, 40, 0.06); }
    else if (e.art === "warnung") { this.ton(330, 0.1, "square", 0.08); this.ton(330, 0.1, "square", 0.08, undefined, 0.14); }
    else if (e.art === "tot") { [392, 330, 262, 196].forEach(function (f, i) { SOUND.ton(f, 0.3, "sawtooth", 0.12, f * 0.9, i * 0.18); }); }
    else if (e.art === "sieg") { [523, 659, 784, 1046].forEach(function (f, i) { SOUND.ton(f, 0.28, "triangle", 0.2, undefined, i * 0.12); }); this.ton(1318, 0.7, "sine", 0.2, undefined, 0.5); }
    else if (e.art === "wurf") { this.ton(300, 0.25, "sawtooth", 0.12, 900); this.ton(1200, 0.2, "triangle", 0.1, 600, 0.12); }
    else if (e.art === "stein") { this.ton(900, 0.2, "square", 0.09, 300); this.ton(240, 0.2, "sawtooth", 0.1, 120, 0.2); }
    else if (e.art === "tor" && e.offen) { this.ton(660, 0.1, "sine", 0.1); this.ton(990, 0.14, "sine", 0.1, undefined, 0.08); }
    else if (e.art === "verpufft") { this.rausch(0.15, 0.3, 1200); }
    else if (e.art === "zahl") this.ton(e.letzte ? 880 : 520, 0.18, "square", 0.1);
  }
};
