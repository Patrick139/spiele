// klang.js — Effekte (SFX) und Anbindung ans Spiel. Das Spiel selbst bleibt unberuehrt:
// klangUpdate(zustand) wird einmal pro Bild aus spiel.js gerufen und vergleicht den Zustand
// mit dem letzten Bild. Aenderung (Leben weniger, Nova da, Kill, ...) -> passender Effekt.
// Setzt audio.js und musik.js voraus.

var KL = { sp: null, leben: 0, toet: 0, schlag: 0, axt: false, nova: false, zauber: false, banner: null,
           stufe: 0, tot: false, szene: null, stufeAuf: 0 };

function sfx(name) {
  AUDIO.zaehler[name] = (AUDIO.zaehler[name] || 0) + 1;              // Tests lesen mit
  if (!AUDIO.g || !AUDIO.an) return;
  var o = AUDIO.g.sfxAus, t = AUDIO.g.ctx.currentTime + 0.005;
  try { EFFEKTE[name](o, t); } catch (e) { AUDIO.fehler = (AUDIO.fehler || 0) + 1; AUDIO.letzterFehler = name + ": " + e.message; }
}

var EFFEKTE = {
  hurt: function (o, t) { kick(o, t, 70, 0.55, 0.35); geraeusch(o, t, 0.18, 0.3, 600, 150, 0.7); },
  schwung: function (o, t) { geraeusch(o, t, 0.13, 0.22, 700, 2600, 1.2, 0.04); },
  schwung3: function (o, t) { geraeusch(o, t, 0.2, 0.35, 500, 2200, 1.0, 0.05); kick(o, t + 0.05, 90, 0.2, 0.2); },
  treffer: function (o, t) { geraeusch(o, t, 0.1, 0.35, 2500, 500, 0.9); kick(o, t, 110, 0.3, 0.2); },
  axt: function (o, t) { geraeusch(o, t, 0.35, 0.25, 500, 1800, 1.4, 0.1); },
  nova: function (o, t) {
    kick(o, t, 38, 0.8, 1.1);
    var c = o.ctx, s = osz(c, "sine", 180, t, t + 0.6), e = huelle(c, t, 0.05, 0.25, 0.35, 0.3);
    s.frequency.setValueAtTime(180, t); s.frequency.exponentialRampToValueAtTime(1100, t + 0.4);
    s.connect(e); ausgang(o, e, 0.5);
    geraeusch(o, t, 0.7, 0.35, 400, 5000, 0.8, 0.1);
    [84, 91, 96].forEach(function (m, k) { glocke(o, t + 0.05 + k * 0.06, m, 3, 0.07); });
  },
  buch: function (o, t) { [69, 72, 76, 81, 88].forEach(function (m, k) { glocke(o, t + k * 0.11, m, 4, 0.08); }); },
  banner: function (o, t) { glocke(o, t, 57, 7, 0.16); glocke(o, t + 0.02, 45, 9, 0.12); },
  wandlung: function (o, t) { kick(o, t, 34, 0.9, 1.4); geraeusch(o, t, 1.4, 0.4, 150, 3000, 0.7, 0.3);
                              [45, 52, 58, 63].forEach(function (m) { chor(o, t, m, 2.2, 0.09); }); },
  stufe: function (o, t) { [72, 76, 79, 84, 88].forEach(function (m, k) { glocke(o, t + k * 0.09, m, 4, 0.09); }); chor(o, t, 60, 2.2, 0.07); },
  skill: function (o, t) { glocke(o, t, 88, 2.5, 0.08); glocke(o, t + 0.07, 95, 2, 0.05); },
  tod: function (o, t) { kick(o, t, 40, 0.8, 1.2); glocke(o, t + 0.1, 45, 8, 0.15); glocke(o, t + 0.15, 51, 8, 0.1); }
};

// Welche Musik passt zum Zustand? (reine Auswahl, keine Seiteneffekte)
function szeneFuer(z) {
  if (z.phase === "titel" || z.phase === "held" || z.phase === "ende") return "titel";
  if (z.phase === "text") return z.dialog && z.dialog.kulisse === "kammer" ? "kammer" : "titel";
  if (z.phase === "dorf") return "dorf";
  if (z.tot) return "tod";
  if (z.ziel) return "ende";
  if (z.ebene && z.ebene.kammer) {
    var b = bossVon(z);
    return b && b.aktiv && !b.tot ? "boss" + b.stufe : "ende";
  }
  var vb = bossVon(z);                                  // Verfolger (Ambros auf Ebene 1-3): Kampfmusik seiner Stufe
  if (vb && vb.flucht && vb.aktiv && !vb.tot) return "boss" + vb.stufe;
  var w = waechterVon(z);
  if (w && !w.tot && w.zustand !== "idle") return "waechter";
  if (z.ebene && z.ebene.geheim && imGeheim(z.ebene, z.spieler)) return "gemach2";   // Geheimraum hinter der Tuer
  if (imGemach(z)) return "gemach";                    // Privatkammer des Ambros: ruhig und fremd (kammer.js)
  return "ebene" + z.ebenenNr;
}

// Einmal pro Bild: Musikwechsel, Pause leiser, Effekte bei Aenderungen.
// Ton darf das Spiel nie zum Absturz bringen: Fehler werden gezaehlt und gemerkt (AUDIO.fehler), nicht geworfen.
function klangUpdate(z) {
  try { klangInnen(z); } catch (e) { AUDIO.fehler = (AUDIO.fehler || 0) + 1; AUDIO.letzterFehler = e.message + " | " + String(e.stack).split("\n")[1]; }
}
function klangInnen(z) {
  if (!AUDIO.g || !z.spieler) return;
  var sp = z.spieler, szene = szeneFuer(z), dungeon = z.phase === "dungeon";
  if (szene !== KL.szene) { KL.szene = szene; szeneStart(szene); }
  if (AUDIO.pause !== !!z.pause) { AUDIO.pause = !!z.pause; audioPegel(); }

  if (dungeon && KL.sp === sp) {
    if (sp.leben < KL.leben) sfx("hurt");
    if (z.toetungen > KL.toet) sfx("treffer");
    if (sp.schlagAktiv > 0 && KL.schlag <= 0) sfx(sp.kombo === 3 ? "schwung3" : "schwung");
    if (z.axt && !KL.axt) sfx("axt");
    if (z.nova && !KL.nova) sfx("nova");
    if (z.zauber.nova && !KL.zauber) sfx("buch");
    var b = z.ebene && z.ebene.kammer ? bossVon(z) : null;
    if (b && b.stufe > KL.stufe && KL.stufe > 0) sfx("wandlung");
    if (z.tot && !KL.tot) sfx("tod");
  }
  if (z.banner && z.banner !== KL.banner && z.banner.t > 0) sfx("banner");
  if (z.stufeAuf > KL.stufeAuf) sfx("stufe");
  KL.stufeAuf = z.stufeAuf;
  var bb = z.ebene && z.ebene.kammer ? bossVon(z) : null;
  KL.sp = sp; KL.leben = sp.leben; KL.toet = z.toetungen; KL.schlag = sp.schlagAktiv;
  KL.axt = !!z.axt; KL.nova = !!z.nova; KL.zauber = !!z.zauber.nova; KL.banner = z.banner;
  KL.stufe = bb ? bb.stufe : 0; KL.tot = !!z.tot;
}

// ---- Fuer Tests: ein Musikstueck ohne Lautsprecher berechnen und messen --------------------
// Gibt { rms, spitze, fenster: [rms je Sekunde], nan } zurueck (Promise).
function musikRendern(name, sek) {
  var sr = 22050, oc = new OfflineAudioContext(2, sr * sek, sr), g = audioBauen(oc), bus = busBauen(g);
  bus.t.gain.value = SZENEN_PEGEL[name] || 1; bus.n.gain.value = bus.t.gain.value;
  var sz = SZENEN[name], d = 240 / sz.bpm, t = 0, i = 0;
  while (t < sek) { sz.takt(bus, t, i, d, zuf(textHash(name) + i * 7919)); t += d; i++; }
  return oc.startRendering().then(function (buf) {
    var L = buf.getChannelData(0), R = buf.getChannelData(1), sum = 0, spitze = 0, nan = false, fenster = [];
    for (var s = 0; s < sek; s++) {
      var w = 0;
      for (var k = s * sr; k < (s + 1) * sr; k++) {
        var x = (L[k] + R[k]) / 2;
        if (x !== x) nan = true;
        w += x * x; sum += x * x; if (Math.abs(x) > spitze) spitze = Math.abs(x);
      }
      fenster.push(Math.sqrt(w / sr));
    }
    return { rms: Math.sqrt(sum / (sr * sek)), spitze: spitze, fenster: fenster, nan: nan };
  });
}
