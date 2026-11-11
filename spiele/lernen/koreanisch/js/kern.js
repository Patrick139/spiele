// kern.js — Daten, Lernstand, Ton und Zusammenstellen der Lerneinheit. Kein Modul; globales Objekt KO.
// Reihenfolge der Skripte: srs.js, kern.js, daten/*.js (rufen KO.block auf), ansicht.js.
//
// Kennungen: Wort a1-03w5, Satz a1-03s2, eigene Karte e<Zeitstempel>.
// Lernkarten: <Wort>:r = Koreanisch → Deutsch, <Wort>:p = Deutsch → Koreanisch, <Satz>:s = Satz.
// Lernstand (localStorage "koreanisch_v1"): karten {Kennung: {s, d, f fällig am Lerntag, l zuletzt, n richtige Wiederholungen, x Fehler}},
// eigene [], gemerkt {}, pruef {} (Durchsicht), einst {neu, auto, deko, pin}, tage {Lerntag: {neu, wdh}}.
var KO = {
  SCHLUESSEL: "koreanisch_v1", FASSUNG: 1,
  bloecke: [], dinge: {}, lektionen: {}, zeitVersatz: 0, stand: null, reihenCache: {},

  jetzt: function () { return Date.now() + this.zeitVersatz; },
  heute: function () { return SRS.tagNr(this.jetzt()); },

  // ---------- Daten ----------
  block: function (b) {
    var self = this;
    this.bloecke.push(b);
    b.lektionen.forEach(function (l) {
      l.block = b.id; l.dinge = [];
      self.lektionen[l.id] = l;
      (l.w || []).forEach(function (e, i) {
        if (!e) return;
        var d = { id: l.id + "w" + (i + 1), typ: "w", ko: e[0], de: e[1], form: e[2] || "", zusatz: e[3] || "", lek: l.id };
        self.dinge[d.id] = d; l.dinge.push(d);
      });
      (l.s || []).forEach(function (e, i) {
        if (!e) return;
        var d = { id: l.id + "s" + (i + 1), typ: "s", ko: e[0], de: e[1], wl: e[2] || "", lek: l.id };
        self.dinge[d.id] = d; l.dinge.push(d);
      });
    });
  },
  ding: function (id) {
    if (this.dinge[id]) return this.dinge[id];
    var e = this.stand.eigene;
    for (var i = 0; i < e.length; i++) if (e[i].id === id) return { id: e[i].id, typ: "w", ko: e[i].ko, de: e[i].de, form: "", zusatz: "", notiz: e[i].notiz || "", eigen: true };
    return null;
  },
  dingVon: function (kennung) { return this.ding(kennung.split(":")[0]); },
  kartenVon: function (d) { return d.typ === "s" ? [d.id + ":s"] : [d.id + ":r", d.id + ":p"]; },
  ersteKarte: function (d) { return d.typ === "s" ? d.id + ":s" : d.id + ":r"; },
  gelernt: function (d) { return !!this.stand.karten[this.ersteKarte(d)]; },

  // ---------- Lernstand ----------
  leer: function () {
    return { v: this.FASSUNG, karten: {}, eigene: [], gemerkt: {}, pruef: {}, tage: {}, einst: { neu: 10, auto: true, deko: true, pin: "" } };
  },
  lade: function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(this.SCHLUESSEL) || "null"); } catch (e) { s = null; }
    this.stand = this.pruefeStand(s) || this.leer();
  },
  pruefeStand: function (s) {
    if (!s || typeof s !== "object" || s.v !== this.FASSUNG || typeof s.karten !== "object") return null;
    var l = this.leer();
    ["eigene", "gemerkt", "pruef", "tage"].forEach(function (k) { if (!s[k] || typeof s[k] !== "object") s[k] = l[k]; });
    if (!Array.isArray(s.eigene)) s.eigene = [];
    s.einst = Object.assign(l.einst, s.einst || {});
    return s;
  },
  speichere: function () {
    try { localStorage.setItem(this.SCHLUESSEL, JSON.stringify(this.stand)); return true; } catch (e) { return false; }
  },
  tag: function () {
    var h = this.heute(), t = this.stand.tage;
    if (!t[h]) t[h] = { neu: 0, wdh: 0 };
    return t[h];
  },

  // ---------- Reihenfolge der neuen Karten ----------
  // In einer Lektion kommt ein Satz erst, nachdem die Wörter der Lektion, die in ihm vorkommen, eingeführt sind.
  reihe: function (lekId) {
    if (this.reihenCache[lekId]) return this.reihenCache[lekId];
    var l = this.lektionen[lekId], w = l.dinge.filter(function (d) { return d.typ === "w"; }), s = l.dinge.filter(function (d) { return d.typ === "s"; });
    var platz = s.map(function (satz, nr) {
      var p = -1;
      w.forEach(function (wort, i) {
        var stamm = wort.form && wort.form.length > 2 ? wort.form.slice(0, -1) : "";
        if (wort.ko.length > 1 && satz.ko.indexOf(wort.ko) >= 0 || (wort.form && satz.ko.indexOf(wort.form) >= 0) || (stamm && satz.ko.indexOf(stamm) >= 0)) p = Math.max(p, i);
      });
      // Sätze ohne erkanntes Wort gleichmäßig verteilen
      if (p < 0) p = Math.min(w.length - 1, Math.round((nr + 1) * w.length / (s.length + 1)));
      return { satz: satz, p: p, nr: nr };
    });
    var aus = [];
    w.forEach(function (wort, i) {
      aus.push(wort);
      platz.filter(function (x) { return x.p === i; }).forEach(function (x) { aus.push(x.satz); });
    });
    this.reihenCache[lekId] = aus;
    return aus;
  },
  lektionsFolge: function () {
    var ids = [], pin = this.stand.einst.pin;
    this.bloecke.forEach(function (b) { b.lektionen.forEach(function (l) { ids.push(l.id); }); });
    if (pin && this.lektionen[pin]) ids = [pin].concat(ids.filter(function (x) { return x !== pin; }));
    return ids;
  },
  // die nächsten n noch nicht gelernten Dinge: eigene Karten zuerst, dann die Lektionen der Reihe nach
  naechsteNeue: function (n) {
    var self = this, aus = [];
    this.stand.eigene.forEach(function (e) { var d = self.ding(e.id); if (aus.length < n && !self.gelernt(d)) aus.push(d); });
    this.lektionsFolge().some(function (id) {
      self.reihe(id).forEach(function (d) { if (aus.length < n && !self.gelernt(d)) aus.push(d); });
      return aus.length >= n;
    });
    return aus;
  },
  // Kennungen aller Karten, die heute oder früher fällig sind, älteste zuerst
  faellige: function () {
    var h = this.heute(), k = this.stand.karten, self = this;
    return Object.keys(k).filter(function (id) { return k[id].f <= h && self.dingVon(id) && (self.stand.einst.deko || id.slice(-2) !== ":p"); })
      .sort(function (a, b) { return k[a].f - k[b].f || (a < b ? -1 : 1); });
  },
  // Wörter, die in der Richtung Koreanisch → Deutsch schon zweimal richtig waren und die Gegenrichtung noch nicht haben
  gegenrichtung: function (n) {
    if (!this.stand.einst.deko) return [];
    var k = this.stand.karten, self = this, aus = [];
    Object.keys(k).some(function (id) {
      if (id.slice(-2) !== ":r" || k[id].n < 2) return false;
      var p = id.slice(0, -2) + ":p";
      if (!k[p] && self.dingVon(id)) aus.push(p);
      return aus.length >= n;
    });
    return aus;
  },
  // Vorschau: wie viele Karten an den nächsten Tagen fällig werden (Index 0 = heute einschließlich Rückstand)
  vorschau: function (tage) {
    var h = this.heute(), k = this.stand.karten, aus = [];
    for (var i = 0; i < tage; i++) aus.push(0);
    Object.keys(k).forEach(function (id) { var t = Math.max(0, k[id].f - h); if (t < tage) aus[t]++; });
    return aus;
  },
  zahlen: function () {
    var self = this, k = this.stand.karten, w = 0, s = 0, fest = 0;
    Object.keys(k).forEach(function (id) {
      var e = id.slice(-2);
      if (e === ":r") w++; else if (e === ":s") s++;
      if (e !== ":p" && k[id].s >= 21) fest++;
    });
    var t = this.tag(), neuRest = Math.max(0, this.stand.einst.neu - t.neu);
    return { woerter: w, saetze: s, fest: fest, faellig: this.faellige().length, neuHeute: t.neu, neuRest: Math.min(neuRest, this.naechsteNeue(neuRest).length), wdhHeute: t.wdh };
  },
  lektionStand: function (lekId) {
    var self = this, d = this.lektionen[lekId].dinge, g = 0;
    d.forEach(function (x) { if (self.gelernt(x)) g++; });
    return { gesamt: d.length, gelernt: g };
  },

  // ---------- Lerneinheit ----------
  // Liefert die Warteschlange: fällige Wiederholungen (höchstens 30), dazwischen neue Karten und neue Gegenrichtungen.
  // zusatzNeu: so viele neue Karten zusätzlich zum Tagesrahmen (Knopf "weitere neue Karten")
  baueEinheit: function (zusatzNeu) {
    var t = this.tag(), wdh = this.faellige().slice(0, 30), schlange = [];
    var neuAnz = Math.max(0, this.stand.einst.neu - t.neu) + (zusatzNeu || 0);
    var neue = this.naechsteNeue(Math.min(neuAnz, 30)), gegen = this.gegenrichtung(Math.max(0, 5 - Math.floor(wdh.length / 6)));
    wdh = this.mische(wdh);
    wdh.forEach(function (id) { schlange.push({ art: "wdh", karte: id }); });
    gegen.forEach(function (id) { schlange.push({ art: "gegen", karte: id }); });
    // neue Karten gleichmäßig einstreuen (nach je drei anderen Karten eine), der Rest ans Ende
    var aus = [], i = 0, self = this;
    schlange.forEach(function (e, nr) {
      aus.push(e);
      if ((nr + 1) % 3 === 0 && i < neue.length) aus.push({ art: "neu", ding: neue[i++].id });
    });
    while (i < neue.length) aus.push({ art: "neu", ding: neue[i++].id });
    return aus;
  },
  mische: function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  },
  // Bewertung eintragen. g: 1 nicht gewusst, 3 gewusst, 4 leicht. Liefert den Abstand in Tagen bis zur nächsten Wiederholung.
  werte: function (kennung, g) {
    var k = this.stand.karten, h = this.heute(), t = this.tag(), alt = k[kennung];
    if (alt) { k[kennung] = SRS.bewerte(alt, g, h, kennung); t.wdh++; }
    else {
      k[kennung] = SRS.neu(g, h);
      if (kennung.slice(-2) !== ":p") t.neu++;
    }
    this.speichere();
    return k[kennung].f - h;
  },
  // Einstufung: Dinge als bekannt eintragen (werden in 1 bis 3 Wochen zum ersten Mal geprüft)
  hakeAb: function (ids) {
    var self = this, h = this.heute(), n = 0;
    ids.forEach(function (id) {
      var d = self.ding(id); if (!d) return;
      self.kartenVon(d).forEach(function (kn) { if (!self.stand.karten[kn]) { self.stand.karten[kn] = SRS.bekannt(h, kn); n++; } });
    });
    this.speichere();
    return n;
  },

  // ---------- Sätze zerlegen (Lücke, Satzbau) ----------
  ohneZeichen: function (t) { return t.replace(/[.,!?]/g, ""); },
  teile: function (ko) { return ko.split(/\s+/).filter(function (x) { return x; }); },
  // Welche Übung passt zu diesem Satz beim n-ten Mal: lesen, luecke oder bau
  satzArt: function (d, n) {
    var t = this.teile(d.ko).length, art = ["lesen", "luecke", "bau"][n % 3];
    if (art === "bau" && t < 3) art = "luecke";
    if (art === "luecke" && t < 2) art = "lesen";
    return art;
  },
  luecke: function (d, n) {
    var self = this, t = this.teile(d.ko), kand = [];
    t.forEach(function (x, i) { if (self.ohneZeichen(x).length >= 2) kand.push(i); });
    if (!kand.length) kand = [0];
    var nr = kand[n % kand.length], richtig = this.ohneZeichen(t[nr]), topf = {}, lek = this.lektionen[d.lek];
    // falsche Antworten: andere Satzteile derselben Lektion, sonst aller Lektionen
    var sammle = function (dinge) {
      dinge.forEach(function (x) { if (x.typ === "s" && x.id !== d.id) self.teile(x.ko).forEach(function (y) { y = self.ohneZeichen(y); if (y && y !== richtig && d.ko.indexOf(y) < 0) topf[y] = 1; }); });
    };
    if (lek) sammle(lek.dinge);
    if (Object.keys(topf).length < 3) Object.keys(this.dinge).forEach(function (id) { sammle([self.dinge[id]]); });
    var falsch = this.mische(Object.keys(topf)).slice(0, 3);
    return { teile: t, nr: nr, richtig: richtig, wahl: this.mische([richtig].concat(falsch)) };
  },
  bau: function (d) {
    var self = this, t = this.teile(d.ko).map(function (x) { return self.ohneZeichen(x); }).filter(function (x) { return x; }), m = t, versuch = 0;
    do { m = this.mische(t); } while (m.join(" ") === t.join(" ") && ++versuch < 8);
    return { richtig: t, steine: m };
  },

  // ---------- Ton ----------
  ton: {
    el: null, stimme: undefined,
    spiele: function (d, langsam) {
      if (!d) return;
      if (d.eigen) { this.sprich(d.ko, langsam); return; }
      var self = this;
      if (!this.el) this.el = new Audio();
      var a = this.el;
      a.onerror = function () { self.sprich(d.ko, langsam); };          // Datei fehlt oder kein Netz: Stimme des Geräts
      a.src = "ton/" + d.id + ".mp3";
      a.playbackRate = langsam ? 0.7 : 1;
      try { a.preservesPitch = true; } catch (e) {}
      var p = a.play(); if (p && p.catch) p.catch(function () {});
    },
    koreanischeStimme: function () {
      if (!("speechSynthesis" in window)) return null;
      var v = speechSynthesis.getVoices().filter(function (x) { return /^ko/i.test(x.lang); });
      return v.length ? v[0] : null;
    },
    sprich: function (text, langsam) {
      if (!("speechSynthesis" in window)) return false;
      var u = new SpeechSynthesisUtterance(text), v = this.koreanischeStimme();
      u.lang = "ko-KR"; if (v) u.voice = v;
      u.rate = langsam ? 0.6 : 0.9;
      try { speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { return false; }
      return !!v;
    },
    // alle Tondateien eines Blocks aufs Gerät legen (für unterwegs ohne Netz)
    ladeAlle: function (fortschritt) {
      if (!("caches" in window)) return Promise.reject(new Error("Dieser Browser kann keine Dateien ablegen."));
      var ids = Object.keys(KO.dinge), fertig = 0, fehler = 0;
      return caches.open("ko-ton-v1").then(function (c) {
        var naechste = function () {
          if (!ids.length) return Promise.resolve();
          var teil = ids.splice(0, 8);
          return Promise.all(teil.map(function (id) {
            var url = "ton/" + id + ".mp3";
            return c.match(url).then(function (r) { return r || fetch(url).then(function (a) { if (!a.ok) throw new Error(); return c.put(url, a); }); })
              .then(function () { fertig++; }, function () { fehler++; });
          })).then(function () { if (fortschritt) fortschritt(fertig, fehler, fertig + fehler + ids.length); return naechste(); });
        };
        return naechste();
      }).then(function () { return { fertig: fertig, fehler: fehler }; });
    }
  }
};
