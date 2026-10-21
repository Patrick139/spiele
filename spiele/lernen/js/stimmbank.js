// stimmbank.js — Eigene Aufnahmen: speichern, abspielen, sichern. Alles bleibt in diesem Browser auf diesem Geraet (IndexedDB "lernen-stimme");
// nichts davon wird hochgeladen. Gespeichert wird je Teil eine WAV-Datei (mono, 22050 Hz, schon zugeschnitten und auf gleiche Lautstaerke gebracht).
// Export/Import: eine JSON-Datei mit allen Aufnahmen (Base64), zum Sichern oder um sie auf ein anderes Geraet zu bringen. Kein Modul; globales Objekt STIMMBANK.

var STIMMBANK = {
  db: null, vorhanden: {}, bereitGeladen: false, puffer: {}, reihe: [], MAX_PUFFER: 80, quellen: [], aufGeaendert: null,

  an: function () { return LERNEN.einstellung().eigeneStimme !== false; },
  init: function () {
    var self = this;
    return new Promise(function (ok) {
      if (!window.indexedDB) { ok(); return; }
      var req;
      try { req = indexedDB.open("lernen-stimme", 1); } catch (e) { ok(); return; }
      req.onupgradeneeded = function () { req.result.createObjectStore("teile", { keyPath: "k" }); };
      req.onerror = function () { ok(); };
      req.onsuccess = function () {
        self.db = req.result;
        var tx = self.db.transaction("teile", "readonly"), st = tx.objectStore("teile"), r = st.getAllKeys ? st.getAllKeys() : null;
        if (!r) { ok(); return; }
        r.onsuccess = function () { (r.result || []).forEach(function (k) { self.vorhanden[k] = 1; }); self.bereitGeladen = true; ok(); };
        r.onerror = function () { ok(); };
      };
    });
  },
  anzahl: function (praefix) { var n = 0; for (var k in this.vorhanden) if (!praefix || k.indexOf(praefix) === 0) n++; return n; },
  hat: function (k) { return !!this.vorhanden[k]; },
  // Alle Teile eines Satzes aufgenommen? (Text-Teile ohne Schluessel gehen nur mit der Handystimme)
  bereit: function (teile) {
    if (!this.db || !this.an() || !teile || !teile.length) return false;
    for (var i = 0; i < teile.length; i++) if (!teile[i] || !teile[i].k || !this.vorhanden[teile[i].k]) return false;
    return true;
  },
  _tx: function (modus, fn) {
    var self = this;
    return new Promise(function (ok, fehler) {
      if (!self.db) { fehler(new Error("Kein Speicher")); return; }
      var tx = self.db.transaction("teile", modus), st = tx.objectStore("teile"), erg = fn(st);
      tx.oncomplete = function () { ok(erg && erg.result !== undefined ? erg.result : undefined); };
      tx.onerror = function () { fehler(tx.error); }; tx.onabort = function () { fehler(tx.error); };
    });
  },
  speichern: function (k, blob, dauer) {
    var self = this;
    delete this.puffer[k];
    return this._tx("readwrite", function (st) { return st.put({ k: k, blob: blob, dauer: dauer, zeit: Date.now() }); })
      .then(function () { self.vorhanden[k] = 1; if (self.aufGeaendert) self.aufGeaendert(k); });
  },
  loeschen: function (k) {
    var self = this;
    delete this.puffer[k];
    return this._tx("readwrite", function (st) { return st.delete(k); }).then(function () { delete self.vorhanden[k]; if (self.aufGeaendert) self.aufGeaendert(k); });
  },
  allesLoeschen: function () {
    var self = this;
    this.puffer = {};
    return this._tx("readwrite", function (st) { return st.clear(); }).then(function () { self.vorhanden = {}; if (self.aufGeaendert) self.aufGeaendert(null); });
  },
  holen: function (k) {
    var self = this;
    return new Promise(function (ok) {
      if (!self.db) { ok(null); return; }
      var r = self.db.transaction("teile", "readonly").objectStore("teile").get(k);
      r.onsuccess = function () { ok(r.result || null); }; r.onerror = function () { ok(null); };
    });
  },
  // Aufnahme als AudioBuffer (mit kleinem Zwischenspeicher)
  laden: function (k) {
    var self = this;
    if (this.puffer[k]) return Promise.resolve(this.puffer[k]);
    TOENE.start();
    var c = TOENE.ctx;
    if (!c) return Promise.resolve(null);
    return this.holen(k).then(function (e) {
      if (!e || !e.blob) return null;
      return e.blob.arrayBuffer().then(function (ab) {
        return new Promise(function (ok) { c.decodeAudioData(ab, ok, function () { ok(null); }); });
      });
    }).then(function (buf) {
      if (buf) {
        self.puffer[k] = buf; self.reihe.push(k);
        while (self.reihe.length > self.MAX_PUFFER) delete self.puffer[self.reihe.shift()];
      }
      return buf;
    });
  },
  // Teile hintereinander abspielen; Pause nach Satzzeichen etwas laenger
  spiele: function (teile) {
    var self = this;
    this.still();
    return Promise.all(teile.map(function (p) { return self.laden(p.k); })).then(function (bufs) {
      var c = TOENE.ctx;
      if (!c || bufs.some(function (b) { return !b; })) return STIMME.sag(ANSAGE.text(teile), LERNEN.sprache);
      var t = c.currentTime + 0.03;
      bufs.forEach(function (b, i) {
        var q = c.createBufferSource(); q.buffer = b; q.connect(c.destination); q.start(t);
        self.quellen.push(q);
        t += b.duration + (/[.!?:]$/.test(teile[i].t + (teile[i].z || "")) || teile[i].k === "name" ? 0.22 : 0.05);
      });
      var ende = (t - c.currentTime) * 1000;
      return new Promise(function (ok) { setTimeout(ok, ende); });
    });
  },
  spieleEins: function (k) { var self = this; return this.laden(k).then(function (b) { if (b) return self.spiele([{ k: k, t: "" }]); }); },
  still: function () { this.quellen.forEach(function (q) { try { q.stop(); } catch (e) {} }); this.quellen = []; },

  // ---- Sichern und Einlesen ----
  exportieren: function () {
    var self = this;
    return new Promise(function (ok, fehler) {
      if (!self.db) { fehler(new Error("Kein Speicher")); return; }
      var r = self.db.transaction("teile", "readonly").objectStore("teile").getAll();
      r.onerror = function () { fehler(r.error); };
      r.onsuccess = function () {
        var alle = r.result || [];
        Promise.all(alle.map(function (e) {
          return new Promise(function (fertig) {
            var fr = new FileReader();
            fr.onload = function () { fertig({ k: e.k, dauer: e.dauer, zeit: e.zeit, typ: e.blob.type, daten: String(fr.result).split(",")[1] }); };
            fr.readAsDataURL(e.blob);
          });
        })).then(function (liste) {
          var json = JSON.stringify({ art: "lernen-stimme", version: 1, erstellt: new Date().toISOString(), name: LERNEN.einstellung().name || "", teile: liste });
          var blob = new Blob([json], { type: "application/json" }), a = document.createElement("a"), d = new Date();
          a.href = URL.createObjectURL(blob);
          a.download = "mampfi-stimme-" + d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + ".json";
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 5000);
          ok(liste.length);
        });
      };
    });
  },
  importieren: function (datei) {
    var self = this;
    return datei.text().then(function (txt) {
      var o = JSON.parse(txt);
      if (!o || o.art !== "lernen-stimme" || !Array.isArray(o.teile)) throw new Error("Das ist keine Stimmen-Datei.");
      if (o.name && !LERNEN.einstellung().name) LERNEN.setzeEinstellung("name", String(o.name).slice(0, 20));   // Name mitnehmen, falls hier noch keiner steht
      var n = 0;
      return o.teile.reduce(function (p, e) {
        return p.then(function () {
          var bin = atob(e.daten), arr = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
          n++;
          return self.speichern(e.k, new Blob([arr], { type: e.typ || "audio/wav" }), e.dauer);
        });
      }, Promise.resolve()).then(function () { return n; });
    });
  },
  // Den Browser bitten, die Aufnahmen nicht von selbst zu loeschen
  dauerhaft: function () {
    if (!navigator.storage || !navigator.storage.persist) return Promise.resolve(null);
    return navigator.storage.persisted().then(function (ja) { return ja || navigator.storage.persist(); }).catch(function () { return null; });
  }
};
