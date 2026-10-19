// audio.js — Klangerzeugung mit Web Audio. Nichts wird geladen, alles wird synthetisiert.
// Enthaelt: Mischpult (audioBauen), Stimmen (zupf, pad, glocke, bass, chor, kick, rausch),
// Taktgeber fuer die Musik (szeneStart/musikPumpe), Stumm (M), Browser-Freigabe (erste Eingabe).
// Szenen und Noten: musik.js. Effekte und Anbindung ans Spiel: klang.js.
// Kein Modul; globale Funktionen. Die Stimmen kennen nur ein "Ausgang"-Objekt o:
//   o = { ctx, t: Gain (trocken), n: Gain (Hall-Zuspielung), g: Mischpult }  -> auch fuer Offline-Tests.

// ---- Konstanten zum Nachjustieren -------------------------------------
var LAUTSTAERKE = 0.55;      // Gesamtlautstaerke 0..1
var MUSIK_PEGEL = 0.7;       // Musik relativ zu den Effekten
var SFX_PEGEL = 0.9;
var BLENDE_S = 2.0;          // Ueberblendung zwischen zwei Musikstuecken (s)
var VORLAUF_S = 0.8;         // so weit plant der Taktgeber Noten voraus
// -----------------------------------------------------------------------

var AUDIO = { g: null, an: true, aktiv: null, pause: false, zaehler: {} };

function ton(m) { return 440 * Math.pow(2, (m - 69) / 12); }          // MIDI-Nummer -> Hz
function zuf(seed) {                                                  // kleiner Zufall mit Startwert (mulberry32)
  return function () {
    seed = (seed + 0x6D2B79F5) | 0;
    var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function textHash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }

// Mischpult: Master -> Kompressor -> Ausgabe; Musik- und Effektbus; Hall (Faltung mit Rauschen).
function audioBauen(ctx) {
  var g = { ctx: ctx };
  g.master = ctx.createGain(); g.master.gain.value = LAUTSTAERKE;
  var komp = ctx.createDynamicsCompressor();
  komp.threshold.value = -20; komp.ratio.value = 4; komp.attack.value = 0.01; komp.release.value = 0.3;
  g.master.connect(komp); komp.connect(ctx.destination);
  g.analyse = ctx.createAnalyser(); g.analyse.fftSize = 2048; komp.connect(g.analyse);
  g.musik = ctx.createGain(); g.musik.gain.value = MUSIK_PEGEL; g.musik.connect(g.master);
  g.sfx = ctx.createGain(); g.sfx.gain.value = SFX_PEGEL; g.sfx.connect(g.master);
  g.hall = ctx.createConvolver();
  var n = Math.floor(ctx.sampleRate * 3.4), ir = ctx.createBuffer(2, n, ctx.sampleRate);
  for (var c = 0; c < 2; c++) {
    var d = ir.getChannelData(c), lt = 0, vor = c === 0 ? 0 : 17;   // Kanalversatz: breiterer Raum
    for (var i = 0; i < n; i++) {
      var j = i - vor;
      if (j < 0) { d[i] = 0; continue; }
      var x = Math.random() * 2 - 1;
      lt += (x - lt) * 0.26;                            // Einpolfilter: dunkler, glatter Nachhall
      d[i] = lt * Math.pow(1 - j / n, 2.4);
    }
    var taps = [0.011, 0.023, 0.037, 0.053, 0.071, 0.089, 0.113];   // fruehe Reflexionen
    for (var k = 0; k < taps.length; k++) {
      var idx = Math.floor(taps[k] * ctx.sampleRate) + vor;
      if (idx < n) d[idx] += (0.55 - k * 0.07) * (c === 0 ? 1 : -1);
    }
  }
  g.hall.buffer = ir;
  var wet = ctx.createGain(); wet.gain.value = 0.55; g.hall.connect(wet); wet.connect(g.master);
  var rb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), rd = rb.getChannelData(0);
  for (var k = 0; k < rd.length; k++) rd[k] = Math.random() * 2 - 1;
  g.rauschen = rb;
  g.sfxAus = { ctx: ctx, t: g.sfx, n: g.hall, g: g };               // Ausgang fuer Effekte
  return g;
}

// Ausgang fuer ein Musikstueck: eigener Pegel, damit man es ausblenden kann.
function busBauen(g) {
  var t = g.ctx.createGain(), n = g.ctx.createGain();
  t.connect(g.musik); n.connect(g.hall);
  return { ctx: g.ctx, t: t, n: n, g: g };
}

// ---- Stimmen -----------------------------------------------------------------
function huelle(c, t, a, hold, v, r) {          // Anstieg a, auf Pegel v bis hold, Ausklang r
  var e = c.createGain(), p = e.gain, h = t + Math.max(a, hold);
  p.setValueAtTime(0.0001, t); p.linearRampToValueAtTime(v, t + a);
  p.setValueAtTime(v, h); p.exponentialRampToValueAtTime(0.0001, h + r);
  return e;
}
function ausgang(o, e, nass) {
  e.connect(o.t);
  if (nass > 0) { var s = o.ctx.createGain(); s.gain.value = nass; e.connect(s); s.connect(o.n); }
}
function osz(c, typ, f, t, ende, cents) {
  var s = c.createOscillator(); s.type = typ; s.frequency.value = f;
  if (cents) s.detune.value = cents;
  s.start(t); s.stop(ende); return s;
}
function tiefpass(c, f, q) { var x = c.createBiquadFilter(); x.type = "lowpass"; x.frequency.value = f; x.Q.value = q || 0.7; return x; }

// Gezupfte Saite (Gitarre/Laute): Saege + Dreieck, Filter schliesst sich.
function zupf(o, t, m, dur, v) {
  var c = o.ctx, f = ton(m), e = huelle(c, t, 0.006, 0.006, v, dur), fl = tiefpass(c, 1, 1.5), end = t + dur + 0.1;
  fl.frequency.setValueAtTime(Math.min(f * 8, 5000), t);
  fl.frequency.exponentialRampToValueAtTime(Math.max(f * 1.4, 200), t + dur * 0.7);
  osz(c, "sawtooth", f, t, end).connect(fl);
  var b = c.createGain(); b.gain.value = 0.35; osz(c, "triangle", f * 2, t, end).connect(b); b.connect(fl);
  fl.connect(e); ausgang(o, e, 0.35);
}
// Flaechenklang: drei leicht verstimmte Saegen, weicher Einsatz.
function pad(o, t, m, dur, v, hell) {
  var c = o.ctx, f = ton(m), fl = tiefpass(c, hell || 700, 0.6), e = huelle(c, t, Math.min(1.4, dur * 0.4), dur, v, 1.8), end = t + dur + 2.2;
  [-8, 0, 8].forEach(function (cents) { osz(c, "sawtooth", f, t, end, cents).connect(fl); });
  fl.connect(e); ausgang(o, e, 0.6);
}
// Glocke: unharmonische Teiltoene, lang ausklingend.
function glocke(o, t, m, dur, v) {
  var c = o.ctx, f = ton(m);
  [[1, 1, 1], [2.76, 0.5, 0.6], [5.4, 0.25, 0.35], [8.93, 0.12, 0.2]].forEach(function (p) {
    var d = dur * p[2], e = huelle(c, t, 0.004, 0.004, v * p[1], d);
    osz(c, "sine", f * p[0], t, t + d + 0.1).connect(e); ausgang(o, e, 0.7);
  });
}
// Tiefer Grundton (Drohnen und Puls): Saege + Sinus durch Tiefpass.
function bass(o, t, m, dur, v, hell, a) {
  var c = o.ctx, f = ton(m), fl = tiefpass(c, hell || 220), e = huelle(c, t, a || 0.05, dur, v, Math.min(1.4, dur * 0.5 + 0.3)), end = t + dur + 1.8;
  osz(c, "sawtooth", f, t, end).connect(fl); osz(c, "sine", f, t, end).connect(fl);
  fl.connect(e); ausgang(o, e, 0.25);
}
// Chorklang: Saegen durch zwei Formantfilter ("a"); langsam ein- und ausblenden.
function chor(o, t, m, dur, v) {
  var c = o.ctx, f = ton(m), e = huelle(c, t, Math.min(1.6, dur * 0.4), dur, v, 1.8), end = t + dur + 2.2;
  [650, 1080].forEach(function (fm, i) {
    var bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = fm; bp.Q.value = 5;
    var gi = c.createGain(); gi.gain.value = i ? 0.6 : 1;
    osz(c, "sawtooth", f, t, end, -7).connect(bp); osz(c, "sawtooth", f, t, end, 7).connect(bp);
    bp.connect(gi); gi.connect(e);
  });
  ausgang(o, e, 0.7);
}
// Pauke: Sinus mit fallender Tonhoehe.
function kick(o, t, f, v, dauer) {
  var c = o.ctx, s = osz(c, "sine", f * 2.4, t, t + (dauer || 0.5) + 0.1), e = huelle(c, t, 0.002, 0.002, v, dauer || 0.45);
  s.frequency.setValueAtTime(f * 2.4, t); s.frequency.exponentialRampToValueAtTime(f, t + 0.12);
  s.connect(e); ausgang(o, e, 0.18);
}
// Rauschen mit gleitendem Bandpass: Wind, Schlag, Zischen.
function geraeusch(o, t, dur, v, f1, f2, q, anstieg) {
  var c = o.ctx, s = c.createBufferSource(); s.buffer = o.g.rauschen; s.loop = true;
  var bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = q || 1;
  bp.frequency.setValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t + dur);
  var e = huelle(c, t, anstieg || 0.005, anstieg || 0.005, v, dur);
  s.connect(bp); bp.connect(e); s.start(t, Math.random()); s.stop(t + dur + (anstieg || 0) + 0.3); ausgang(o, e, 0.2);
}

// ---- Taktgeber: plant ein Musikstueck Takt fuer Takt voraus -----------------------
// Szenen stehen in SZENEN (musik.js): { bpm, takt: function (o, t, i, dauer, zufall) }.
var PUMPE = null;
function szeneStart(name) {
  var g = AUDIO.g, c = g.ctx, jetzt = c.currentTime, alt = AUDIO.aktiv;
  if (alt) {
    [alt.bus.t, alt.bus.n].forEach(function (x) {
      x.gain.cancelScheduledValues(jetzt); x.gain.setValueAtTime(x.gain.value, jetzt);
      x.gain.linearRampToValueAtTime(0, jetzt + BLENDE_S);
    });
    setTimeout(function () { try { alt.bus.t.disconnect(); alt.bus.n.disconnect(); } catch (e) {} }, (BLENDE_S + 6) * 1000);
  }
  var bus = busBauen(g);
  var pegel = SZENEN_PEGEL[name] || 1;
  [bus.t, bus.n].forEach(function (x) { x.gain.setValueAtTime(0, jetzt); x.gain.linearRampToValueAtTime(pegel, jetzt + BLENDE_S * 0.75); });
  AUDIO.aktiv = { name: name, bus: bus, takt: 0, naechster: jetzt + 0.1 };
  musikPumpe();
}
function musikPumpe() {
  try { pumpeInnen(); } catch (e) {
    AUDIO.fehler = (AUDIO.fehler || 0) + 1; AUDIO.letzterFehler = "pumpe: " + e.message + " | " + String(e.stack).split("\n")[1];
    if (AUDIO.aktiv) AUDIO.aktiv.naechster += 240 / SZENEN[AUDIO.aktiv.name].bpm;     // diesen Takt auslassen, nicht festhaengen
  }
}
function pumpeInnen() {
  var A = AUDIO.aktiv, c = AUDIO.g && AUDIO.g.ctx;
  if (!A || !c || !AUDIO.an) return;
  var sz = SZENEN[A.name], dauer = 240 / sz.bpm;
  while (A.naechster < c.currentTime + VORLAUF_S) {
    sz.takt(A.bus, A.naechster, A.takt, dauer, zuf(textHash(A.name) + A.takt * 7919));
    A.naechster += dauer; A.takt++;
  }
}

// ---- Freigabe durch den Browser, Stumm, Pause -----------------------------------------
function audioInit() {
  if (AUDIO.g) { if (AUDIO.g.ctx.state === "suspended") AUDIO.g.ctx.resume(); return; }
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  AUDIO.g = audioBauen(new AC());
  try { AUDIO.an = localStorage.getItem("zehnte_musik") !== "aus"; } catch (e) {}
  audioPegel();
  if (AUDIO.g.ctx.state === "suspended") AUDIO.g.ctx.resume();
  setInterval(musikPumpe, 200);
}
function audioPegel() {                          // Master: stumm = 0, Pause = leiser
  if (!AUDIO.g) return;
  var ziel = !AUDIO.an ? 0 : LAUTSTAERKE * (AUDIO.pause ? 0.3 : 1), c = AUDIO.g.ctx;
  AUDIO.g.master.gain.cancelScheduledValues(c.currentTime);
  AUDIO.g.master.gain.setTargetAtTime(ziel, c.currentTime, 0.12);
}
function audioStumm() {
  AUDIO.an = !AUDIO.an;
  try { localStorage.setItem("zehnte_musik", AUDIO.an ? "an" : "aus"); } catch (e) {}
  if (AUDIO.an && AUDIO.aktiv) AUDIO.aktiv.naechster = Math.max(AUDIO.aktiv.naechster, AUDIO.g.ctx.currentTime + 0.1);
  audioPegel();
}
["keydown", "mousedown"].forEach(function (ev) {
  window.addEventListener(ev, function (e) {
    audioInit();
    if (ev === "keydown" && (e.key === "m" || e.key === "M") && !e.repeat) audioStumm();
  });
});
document.addEventListener("visibilitychange", function () {
  if (!AUDIO.g) return;
  if (document.hidden) AUDIO.g.ctx.suspend(); else AUDIO.g.ctx.resume();
});
