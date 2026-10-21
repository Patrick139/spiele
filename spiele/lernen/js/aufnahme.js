// aufnahme.js — Aufnahmeseite fuer die eigene Stimme (Eltern-Bereich). Zeigt Satzteil fuer Satzteil, nimmt auf, schneidet Stille ab,
// bringt alles auf gleiche Lautstaerke und speichert es in STIMMBANK (nur auf diesem Geraet). "Durchsprechen": startet die naechste Aufnahme
// von selbst und stoppt, sobald nach dem Sprechen kurz Stille ist — so geht ein ganzer Stapel ohne Tippen. Kein Modul; globales Objekt AUFNAHME.

var AUFNAHME = {
  RATE: 22050,
  strom: null, quelle: null, analyser: null, daten: null, rec: null, laeuft: false, stoppGrund: "",
  spr: "de", liste: [], i: 0, auto: false, nurFehlend: true, gen: 0,

  el: function (id) { return document.getElementById(id); },
  oeffnen: function () {
    TOENE.tipp(); LERNEN.zeige("stimme");
    this.spr = LERNEN.sprache; this.auto = false; this.el("stAuto").checked = false;
    this.neuLaden(); this.zeigeTeil(); this.listeZeichnen(); this.speicherInfo();
  },
  init: function () {
    var self = this;
    var tabs = document.querySelectorAll("#stimme [data-st]");
    for (var i = 0; i < tabs.length; i++) (function (b) { b.onclick = function () { self.stopp("wechsel"); self.spr = b.getAttribute("data-st"); self.neuLaden(); self.zeigeTeil(); self.listeZeichnen(); }; })(tabs[i]);
    this.el("stRec").onclick = function () {
      if (self.laeuft) { if (self.auto) { self.auto = false; self.el("stAuto").checked = false; } self.stopp("hand"); }
      else self.einzeln();
    };
    this.el("stVor").onclick = function () { self.schritt(1); };
    this.el("stZurueckTeil").onclick = function () { self.schritt(-1); };
    this.el("stAnhoeren").onclick = function () { var t = self.liste[self.i]; if (t && STIMMBANK.hat(t.k)) STIMMBANK.spieleEins(t.k); };
    this.el("stLoeschen").onclick = function () { var t = self.liste[self.i]; if (t && STIMMBANK.hat(t.k)) STIMMBANK.loeschen(t.k).then(function () { self.zeigeTeil(); }); };
    this.el("stAuto").onchange = function () { self.auto = this.checked; if (self.auto) { self.nurFehlend = true; self.el("stNurFehlend").checked = true; self.neuLaden(); self.weiterAuto(); } else { self.gen++; self.stopp("weg"); self.status("Durchsprechen angehalten."); } };
    this.el("stNurFehlend").onchange = function () { self.nurFehlend = this.checked; self.neuLaden(); self.zeigeTeil(); };
    this.el("stZurueck").onclick = function () { self.stopp("weg"); LERNEN.einstellungen(); };
    this.el("stExport").onclick = function () {
      self.status("Sicherung wird erstellt …");
      STIMMBANK.exportieren().then(function (n) { self.status(n + " Aufnahmen gesichert. Die Datei liegt bei den Downloads."); }, function (e) { self.status("Sichern ging nicht: " + e.message); });
    };
    this.el("stImport").onchange = function () {
      var f = this.files && this.files[0]; if (!f) return;
      self.status("Wird eingelesen …");
      STIMMBANK.importieren(f).then(function (n) { self.status(n + " Aufnahmen eingelesen."); self.neuLaden(); self.zeigeTeil(); self.listeZeichnen(); }, function (e) { self.status("Einlesen ging nicht: " + e.message); });
      this.value = "";
    };
    var weg = this.el("stAllesWeg");
    weg.onclick = function () {
      if (!weg.classList.contains("sicher")) { weg.classList.add("sicher"); weg.textContent = "Wirklich alle löschen?"; setTimeout(function () { weg.classList.remove("sicher"); weg.textContent = "Alle löschen"; }, 4000); return; }
      weg.classList.remove("sicher"); weg.textContent = "Alle löschen";
      STIMMBANK.allesLoeschen().then(function () { self.neuLaden(); self.zeigeTeil(); self.listeZeichnen(); self.status("Alle Aufnahmen gelöscht."); });
    };
    STIMMBANK.aufGeaendert = function () { if (!self.el("stimme").classList.contains("weg")) { self.zahlen(); self.listeZeichnen(); } };
    document.addEventListener("keydown", function (e) {                 // am PC: Leertaste = Aufnahme an/aus, Pfeile = blaettern
      if (self.el("stimme").classList.contains("weg") || /input|select|textarea/i.test(e.target.tagName)) return;
      if (e.key === " ") { e.preventDefault(); self.el("stRec").click(); }
      else if (e.key === "ArrowRight") self.schritt(1);
      else if (e.key === "ArrowLeft") self.schritt(-1);
    });
  },

  // ---- Liste der Teile ----
  neuLaden: function () {
    var alt = this.liste[this.i] ? this.liste[this.i].k : null, self = this;
    var alle = ANSAGE.katalog(this.spr);
    this.alle = alle;
    this.liste = this.nurFehlend ? alle.filter(function (t) { return !STIMMBANK.hat(t.k); }) : alle;
    if (!this.liste.length) this.liste = alle;
    var j = alt ? this.liste.findIndex(function (t) { return t.k === alt; }) : -1;
    this.i = j >= 0 ? j : 0;
    this.zahlen();
    var tabs = document.querySelectorAll("#stimme [data-st]");
    for (var k = 0; k < tabs.length; k++) tabs[k].classList.toggle("an", tabs[k].getAttribute("data-st") === self.spr);
  },
  zahlen: function () {
    ["de", "en"].forEach(function (s) {
      var l = ANSAGE.katalog(s), n = l.filter(function (t) { return STIMMBANK.hat(t.k); }).length;
      var e = document.getElementById(s === "de" ? "stZahlDe" : "stZahlEn"); if (e) e.textContent = n + "/" + l.length;
    });
  },
  schritt: function (d) {
    if (this.laeuft) return;
    this.i = Math.max(0, Math.min(this.liste.length - 1, this.i + d));
    this.zeigeTeil();
  },
  zeigeTeil: function () {
    var t = this.liste[this.i];
    if (!t) { this.el("stText").textContent = "–"; return; }
    var da = STIMMBANK.hat(t.k);
    this.el("stGruppe").textContent = t.gruppe + "  ·  Teil " + (this.alle.indexOf(t) + 1) + " von " + this.alle.length + (da ? "  ·  ✓ aufgenommen" : "");
    this.el("stText").textContent = t.t;
    this.el("stHinweis").textContent = t.hinweis || (this.spr === "en" ? "Englisch sprechen" : "");
    this.el("stAnhoeren").disabled = !da; this.el("stLoeschen").disabled = !da;
    this.el("stText").classList.toggle("da", da);
  },
  listeZeichnen: function () {
    var box = this.el("stListe"), self = this, gruppen = {}, reihe = [];
    if (!box || !this.alle) return;
    this.alle.forEach(function (t) { if (!gruppen[t.gruppe]) { gruppen[t.gruppe] = []; reihe.push(t.gruppe); } gruppen[t.gruppe].push(t); });
    box.innerHTML = "";
    reihe.forEach(function (g) {
      var l = gruppen[g], n = l.filter(function (t) { return STIMMBANK.hat(t.k); }).length, h = document.createElement("h4");
      h.textContent = g + "  (" + n + "/" + l.length + ")"; box.appendChild(h);
      l.forEach(function (t) {
        var z = document.createElement("div"), da = STIMMBANK.hat(t.k);
        z.className = "st-zeile" + (da ? " da" : "");
        z.innerHTML = '<span class="st-haken">' + (da ? "✓" : "○") + '</span><span class="st-t"></span>' + (da ? '<button class="st-play" aria-label="Anhören">▶</button>' : "");
        z.querySelector(".st-t").textContent = t.t;
        z.onclick = function (e) {
          if (e.target.classList.contains("st-play")) { STIMMBANK.spieleEins(t.k); return; }
          self.nurFehlend = false; self.el("stNurFehlend").checked = false; self.liste = self.alle;
          self.i = self.alle.indexOf(t); self.zeigeTeil(); window.scrollTo(0, 0); self.el("stimme").scrollTop = 0;
        };
        box.appendChild(z);
      });
    });
  },
  status: function (t) { this.el("stStatus").textContent = t; },
  speicherInfo: function () {
    var self = this, e = this.el("stSpeicher");
    STIMMBANK.dauerhaft().then(function (ja) {
      e.textContent = ja === true ? "Der Browser hebt die Aufnahmen dauerhaft auf." : ja === false ? "Der Browser kann die Aufnahmen bei Platzmangel löschen. Deshalb nach dem Aufnehmen exportieren." : "";
    });
    if (!STIMMBANK.db) e.textContent = "Dieser Browser erlaubt keinen Speicher für Aufnahmen (privates Fenster?).";
  },

  // ---- Mikrofon und Aufnahme ----
  mikro: function () {
    var self = this;
    if (this.strom && this.strom.active) return Promise.resolve(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) return Promise.reject(new Error("Dieser Browser kann nicht aufnehmen."));
    TOENE.start();
    return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }).then(function (s) {
      self.strom = s;
      var c = TOENE.ctx;
      self.quelle = c.createMediaStreamSource(s); self.analyser = c.createAnalyser(); self.analyser.fftSize = 1024;
      self.daten = new Float32Array(self.analyser.fftSize); self.quelle.connect(self.analyser);
      return true;
    });
  },
  pegel: function () {
    this.analyser.getFloatTimeDomainData(this.daten);
    var s = 0; for (var i = 0; i < this.daten.length; i++) s += this.daten[i] * this.daten[i];
    return Math.sqrt(s / this.daten.length);
  },
  // Nimmt auf, bis nach dem Sprechen 0,7 s Stille sind (oder Stopp gedrueckt wird). Ergebnis: Blob oder null (nichts gehoert)
  aufnehmen: function () {
    var self = this;
    return this.mikro().then(function () {
      return new Promise(function (ok) {
        var stuecke = [], t0 = performance.now(), rausch = 0, nRausch = 0, ueber = 0, sprach = false, stilleSeit = 0;
        self.rec = new MediaRecorder(self.strom); self.laeuft = true; self.stoppGrund = "";
        self.rec.ondataavailable = function (e) { if (e.data && e.data.size) stuecke.push(e.data); };
        self.rec.onstop = function () {
          clearInterval(uhr); self.laeuft = false; self.knopf();
          self.el("stPegel").style.width = "0%";
          if (self.stoppGrund === "weg" || self.stoppGrund === "wechsel" || (!sprach && self.stoppGrund !== "hand")) { ok(null); return; }
          ok(new Blob(stuecke, { type: self.rec.mimeType || "audio/webm" }));
        };
        self.rec.start(); self.knopf(); self.status("Ich höre zu …");
        var uhr = setInterval(function () {
          var r = self.pegel(), t = performance.now() - t0;
          self.el("stPegel").style.width = Math.min(100, r * 400) + "%";
          if (t < 300) { rausch += r; nRausch++; return; }
          var schwelle = Math.max(0.012, (rausch / Math.max(1, nRausch)) * 2.5);
          if (!sprach) { ueber = r > schwelle * 1.4 ? ueber + 1 : 0; if (ueber >= 3) sprach = true; }
          else if (r < schwelle) { if (!stilleSeit) stilleSeit = t; else if (t - stilleSeit > 700) self.stopp("stille"); }
          else stilleSeit = 0;
          if ((!sprach && t > 6000) || t > 9000) self.stopp("zeit");
        }, 30);
      });
    });
  },
  stopp: function (grund) { if (this.rec && this.laeuft) { this.stoppGrund = grund || "hand"; try { this.rec.stop(); } catch (e) {} } if (grund !== "stille" && grund !== "zeit" && grund !== "hand") this.auto = false; },
  knopf: function () { var b = this.el("stRec"); b.textContent = this.laeuft ? "■ Stopp" : "● Aufnehmen"; b.classList.toggle("laeuft", this.laeuft); },

  // Zuschneiden, auf 22050 Hz mono umrechnen, Lautstaerke angleichen, als WAV verpacken
  verarbeiten: function (blob) {
    var self = this, c = TOENE.ctx;
    return blob.arrayBuffer().then(function (ab) { return new Promise(function (ok, f) { c.decodeAudioData(ab, ok, f); }); }).then(function (buf) {
      var sr = buf.sampleRate, n = buf.length, d = new Float32Array(n), k, i;
      for (k = 0; k < buf.numberOfChannels; k++) { var ch = buf.getChannelData(k); for (i = 0; i < n; i++) d[i] += ch[i] / buf.numberOfChannels; }
      var fr = Math.max(1, Math.round(sr * 0.01)), m = Math.floor(n / fr), rms = new Float32Array(m), max = 0;
      for (k = 0; k < m; k++) { var s = 0; for (i = k * fr; i < (k + 1) * fr; i++) s += d[i] * d[i]; rms[k] = Math.sqrt(s / fr); if (rms[k] > max) max = rms[k]; }
      if (max < 0.008) return null;
      var schwelle = Math.max(max * 0.1, 0.005), a = 0, e = m - 1;
      while (a < m && rms[a] < schwelle) a++;
      while (e > a && rms[e] < schwelle) e--;
      var s0 = Math.max(0, Math.floor(a * fr - 0.07 * sr)), s1 = Math.min(n, Math.ceil((e + 1) * fr + 0.15 * sr)), stueck = d.subarray(s0, s1);
      var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext, len = Math.max(1, Math.ceil(stueck.length * self.RATE / sr)), off = new OAC(1, len, self.RATE);
      var b2 = off.createBuffer(1, stueck.length, sr); b2.getChannelData(0).set(stueck);
      var q = off.createBufferSource(); q.buffer = b2; q.connect(off.destination); q.start();
      return off.startRendering();
    }).then(function (r) {
      if (!r) return null;
      var x = r.getChannelData(0), spitze = 0, i, rand = Math.round(self.RATE * 0.006);
      for (i = 0; i < x.length; i++) spitze = Math.max(spitze, Math.abs(x[i]));
      var g = Math.min(6, 0.89 / Math.max(spitze, 1e-4));
      for (i = 0; i < x.length; i++) { var f = Math.min(1, i / rand, (x.length - 1 - i) / rand); x[i] *= g * f; }
      return { blob: self.wav(x, self.RATE), dauer: x.length / self.RATE };
    });
  },
  wav: function (x, rate) {
    var n = x.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf), i;
    var str = function (o, s) { for (var j = 0; j < s.length; j++) v.setUint8(o + j, s.charCodeAt(j)); };
    str(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); str(8, "WAVE"); str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, "data"); v.setUint32(40, n * 2, true);
    for (i = 0; i < n; i++) { var s = Math.max(-1, Math.min(1, x[i])); v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); }
    return new Blob([buf], { type: "audio/wav" });
  },
  // Einen Teil aufnehmen und speichern; Rueckgabe true = gespeichert
  teilAufnehmen: function () {
    var self = this, t = this.liste[this.i];
    if (!t) return Promise.resolve(false);
    return this.aufnehmen().then(function (blob) {
      if (!blob) { if (self.stoppGrund !== "weg" && self.stoppGrund !== "wechsel") self.status("Nichts gehört. Nochmal mit ● Aufnehmen."); return false; }
      self.status("Wird zugeschnitten …");
      return self.verarbeiten(blob).then(function (e) {
        if (!e) { self.status("Zu leise. Bitte näher ans Mikrofon."); return false; }
        return STIMMBANK.speichern(t.k, e.blob, e.dauer).then(function () { self.status("Gespeichert ✓ (" + e.dauer.toFixed(1) + " s)"); return true; });
      });
    }).catch(function (e) { self.status("Aufnahme ging nicht: " + (e && e.message ? e.message : e)); self.auto = false; self.el("stAuto").checked = false; return false; });
  },
  einzeln: function () {
    var self = this;
    this.teilAufnehmen().then(function (ok) { self.zeigeTeil(); if (ok) STIMMBANK.spieleEins(self.liste[self.i].k); });
  },
  // Durchsprechen: naechster fehlender Teil, kurze Pause zum Lesen, dann aufnehmen
  weiterAuto: function () {
    var self = this, g = ++this.gen;
    if (!this.auto) return;
    var j = this.i; while (j < this.liste.length && STIMMBANK.hat(this.liste[j].k)) j++;
    if (j >= this.liste.length) { this.auto = false; this.el("stAuto").checked = false; this.status("Alles aufgenommen! 🎉 Jetzt am besten exportieren."); this.neuLaden(); this.zeigeTeil(); return; }
    this.i = j; this.zeigeTeil(); this.status("Gleich geht's los …");
    setTimeout(function () {
      if (g !== self.gen || !self.auto || self.el("stimme").classList.contains("weg")) return;
      self.teilAufnehmen().then(function (ok) {
        if (g !== self.gen) return;
        if (!ok) { self.auto = false; self.el("stAuto").checked = false; return; }
        TOENE.pling(3); self.i++; self.weiterAuto();
      });
    }, 900);
  }
};
