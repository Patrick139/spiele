// uhr.js — Uhrzeit lernen mit einer analogen Uhr. Fuenf Aufgabenarten, je Runde jede einmal in zufaelliger Reihenfolge:
//   stellen  "Um halb 4 geht Mampfi schwimmen. Stell die Uhr!" (Zeiger ziehen)
//   lesen    "Wie spaet ist es?" (drei Uhrzeiten als Text zur Wahl)
//   welche   "Welche Uhr zeigt halb 4?" (drei kleine Uhren zur Wahl)
//   digital  Digitalzeit 3:30 steht da, Zeiger stellen
//   spaeter  "Jetzt ist es 3 Uhr. In einer halben Stunde ..." bzw. "Wie spaet war es vor ...?" (Zeiger von der jetzigen Zeit aus stellen)
// Die Zeiger sind gekoppelt wie bei einer echten Uhr. Der kleine Zeiger liegt oben; wo beide uebereinander liegen, greift ein Tipp innen
// den kleinen und aussen den grossen Zeiger. Der grosse laeuft beim Ziehen in 5-Minuten-Schritten und rastet beim Loslassen auf die Stufe ein. Stufen: 1 volle Stunden · 2 halbe · 3 Viertel · 4 Fuenf-Minuten-Schritte (Minutenzahlen aussen);
// jede Stufe mischt die leichteren mit. Stufenwechsel ueber LERNEN.fortschritt. Sprechweise: Standard oder wienerisch. Kein Modul; globales Objekt UHR.

var UHR = {
  RUNDE: 5, MAX: 4, nr: 0, gut: 0, a: null, erster: true, frei: false, T: 0, zieht: null, svg: null, modi: [], stufe: 1,
  STUFEN: ["volle Stunden", "halbe Stunden", "Viertelstunden", "5-Minuten-Schritte"],
  RASTER: [0, 60, 30, 15, 5],                                     // so fein laesst sich der Minutenzeiger je Stufe stellen
  SPANNEN: [null, [60, 120, -60, 60], [30, 60, -30, -60, 30], [15, 30, 45, -15, -30, 15], [5, 10, 15, 20, 30, -10, -15, 10]],
  LANG_STD: 52, LANG_MIN: 90,
  TAG: {
    de: [["🏊", "geht Mampfi schwimmen"], ["🏫", "geht Mampfi in den Kindergarten"], ["🛝", "geht Mampfi auf den Spielplatz"], ["🍦", "isst Mampfi ein Eis"],
      ["😴", "geht Mampfi schlafen"], ["⚽", "spielt Mampfi Fußball"], ["👵", "besucht Mampfi die Oma"], ["🛒", "geht Mampfi einkaufen"], ["🛁", "badet Mampfi"], ["🍕", "isst Mampfi Pizza"]],
    en: [["🏊", "Mampfi goes swimming"], ["🏫", "Mampfi goes to kindergarten"], ["🛝", "Mampfi goes to the playground"], ["🍦", "Mampfi eats an ice cream"],
      ["😴", "Mampfi goes to bed"], ["⚽", "Mampfi plays football"], ["👵", "Mampfi visits Grandma"], ["🛒", "Mampfi goes shopping"], ["🛁", "Mampfi has a bath"], ["🍕", "Mampfi eats pizza"]]
  },
  WORT: {
    de: ["zwölf", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"],
    en: ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]
  },
  MINWORT: {
    de: { 5: "fünf", 10: "zehn", 15: "fünfzehn", 20: "zwanzig", 25: "fünfundzwanzig", 30: "dreißig", 35: "fünfunddreißig", 40: "vierzig", 45: "fünfundvierzig", 50: "fünfzig", 55: "fünfundfünfzig" },
    en: { 5: "five", 10: "ten", 15: "fifteen", 20: "twenty", 25: "twenty-five", 30: "thirty", 35: "thirty-five", 40: "forty", 45: "forty-five", 50: "fifty", 55: "fifty-five" }
  },
  schluessel: function () { return "uhr"; },
  stand: function () { return LERNEN.lies("uhr", { stufe: 1 }); },
  stil: function () { return LERNEN.lies("einstellung", { uhrstil: "standard" }).uhrstil; },
  norm: function (T) { return ((T % 720) + 720) % 720; },

  // Uhrzeit als Text. T = Minuten seit 12 Uhr (0..719). gesprochen: Zahlwoerter statt Ziffern (fuer die Handystimme)
  text: function (T, spr, gesprochen) {
    var h = Math.floor(T / 60) % 12, m = T % 60, h1 = (h + 1) % 12, wien = this.stil() === "wien", W = this.WORT[spr] || this.WORT.de;
    var H = function (x) { var s = x === 0 ? 12 : x; return gesprochen ? W[s] : String(s); };
    var M = function (x) { return gesprochen ? ({ 5: spr === "en" ? "five" : "fünf", 10: spr === "en" ? "ten" : "zehn", 20: spr === "en" ? "twenty" : "zwanzig", 25: "twenty-five" })[x] : String(x); };
    if (spr === "en") {
      if (m === 0) return H(h) + " o'clock";
      if (m === 30) return "half past " + H(h);
      if (m === 15) return "quarter past " + H(h);
      if (m === 45) return "quarter to " + H(h1);
      return m < 30 ? M(m) + " past " + H(h) : M(60 - m) + " to " + H(h1);
    }
    var stunde = function (x) { return gesprochen && (x === 1) ? "ein" : H(x); };
    if (m === 0) return stunde(h) + " Uhr";
    if (m === 30) return "halb " + H(h1);
    if (m === 15) return wien ? "viertel " + H(h1) : "Viertel nach " + H(h);
    if (m === 45) return wien ? "dreiviertel " + H(h1) : "Viertel vor " + H(h1);
    if (m === 5 || m === 10) return M(m) + " nach " + H(h);
    if (m === 20) return wien ? M(10) + " vor halb " + H(h1) : M(20) + " nach " + H(h);
    if (m === 25) return M(5) + " vor halb " + H(h1);
    if (m === 35) return M(5) + " nach halb " + H(h1);
    if (m === 40) return wien ? M(10) + " nach halb " + H(h1) : M(20) + " vor " + H(h1);
    return M(60 - m) + " vor " + H(h1);                             // 50, 55
  },
  digital: function (T) { var h = Math.floor(T / 60) % 12, m = T % 60; return (h === 0 ? 12 : h) + ":" + (m < 10 ? "0" : "") + m; },
  // Digitalzeit vorgelesen: "drei Uhr dreißig" / "three thirty"
  digitalGesprochen: function (T, spr) {
    var h = Math.floor(T / 60) % 12, m = T % 60, W = this.WORT[spr] || this.WORT.de, H = W[h === 0 ? 12 : h], MW = this.MINWORT[spr] || this.MINWORT.de;
    if (spr === "en") return m === 0 ? H + " o'clock" : H + (m < 10 ? " oh " : " ") + MW[m];
    return (h === 1 ? "ein" : H) + " Uhr" + (m ? " " + MW[m] : "");
  },
  zufallsZeit: function (stufe) {
    var h = Math.floor(Math.random() * 12), m = 0, r = Math.random();
    if (stufe === 2) m = r < 0.6 ? 30 : 0;
    else if (stufe === 3) m = r < 0.3 ? 15 : r < 0.6 ? 45 : r < 0.8 ? 30 : 0;
    else if (stufe >= 4) m = r < 0.55 ? LERNEN.zufall([5, 10, 20, 25, 35, 40, 50, 55]) : r < 0.8 ? LERNEN.zufall([15, 45]) : r < 0.92 ? 30 : 0;
    return h * 60 + m;
  },

  // ---- Zifferblatt (gross zum Stellen, klein fuer "Welche Uhr zeigt ...?") ----
  blatt: function (klein) {
    var s = '<circle r="104" fill="#fffdf7" stroke="#3b2f22" stroke-width="' + (klein ? 8 : 6) + '"/>';
    for (var i = 0; i < 60; i++) {
      var lang = i % 5 === 0;
      if (klein && !lang) continue;
      var w = i * 6 * Math.PI / 180, r1 = lang ? 86 : 93, r2 = 99;
      s += '<line x1="' + (Math.sin(w) * r1).toFixed(1) + '" y1="' + (-Math.cos(w) * r1).toFixed(1) + '" x2="' + (Math.sin(w) * r2).toFixed(1) + '" y2="' + (-Math.cos(w) * r2).toFixed(1) +
        '" stroke="#3b2f22" stroke-width="' + (lang ? 3.5 : 1.5) + '" stroke-linecap="round"/>';
    }
    for (var z = 1; z <= 12; z++) {
      var wz = z * 30 * Math.PI / 180, rz = klein ? 66 : 70;
      s += '<text x="' + (Math.sin(wz) * rz).toFixed(1) + '" y="' + (-Math.cos(wz) * rz + (klein ? 9 : 8)).toFixed(1) + '" text-anchor="middle" font-size="' + (klein ? 27 : 24) + '" font-weight="900" fill="#3b2f22">' + z + '</text>';
      if (!klein) {
        var minuten = (z * 5) % 60;
        s += '<text class="uh-minuten" x="' + (Math.sin(wz) * 117).toFixed(1) + '" y="' + (-Math.cos(wz) * 117 + 5).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#3fa9d6">' + (minuten < 10 ? "0" : "") + minuten + '</text>';
      }
    }
    return s;
  },
  // Zeiger: grosser (blau) zuerst, kleiner (rot) obendrauf, damit er nie verdeckt ist. Kugeln an den Spitzen zum Anfassen.
  zeigerSvg: function (T, mitIds) {
    var wS = this.norm(T) * 0.5, wM = (T % 60) * 6, dS = mitIds ? 11 : 16, dM = mitIds ? 7 : 10;   // kleine Uhren: dickere Zeiger
    return '<g ' + (mitIds ? 'id="uhMin" ' : '') + 'class="zeiger z-min" transform="rotate(' + wM + ')"><line x1="0" y1="18" x2="0" y2="-' + this.LANG_MIN + '" stroke="#3fa9d6" stroke-width="' + dM + '" stroke-linecap="round"/>' +
        (mitIds ? '<circle cy="-' + this.LANG_MIN + '" r="7.5" fill="#3fa9d6" stroke="#fff" stroke-width="2.5"/>' : '') + '</g>' +
      '<g ' + (mitIds ? 'id="uhStd" ' : '') + 'class="zeiger z-std" transform="rotate(' + wS.toFixed(2) + ')"><line x1="0" y1="14" x2="0" y2="-' + this.LANG_STD + '" stroke="#e5484d" stroke-width="' + dS + '" stroke-linecap="round"/>' +
        (mitIds ? '<circle cy="-' + (this.LANG_STD - 6) + '" r="10" fill="#e5484d" stroke="#fff" stroke-width="2.5"/>' : '') + '</g>' +
      '<circle r="8" fill="#3b2f22"/>';
  },
  bauen: function () {
    var box = LERNEN.el("uhUhr");
    box.innerHTML = '<svg id="uhSvg" viewBox="-128 -128 256 256">' + this.blatt(false) + this.zeigerSvg(0, true) + '</svg>';
    this.svg = LERNEN.el("uhSvg");
    var self = this;
    this.svg.addEventListener("pointerdown", function (e) { self.runter(e); });
    this.svg.addEventListener("pointermove", function (e) { self.bewegt(e); });
    this.svg.addEventListener("pointerup", function () { self.hoch(); });
    this.svg.addEventListener("pointercancel", function () { self.hoch(); });
  },
  kleineUhr: function (T) { return '<svg viewBox="-112 -112 224 224" class="mini-uhr">' + this.blatt(true) + this.zeigerSvg(T, false) + '</svg>'; },
  zeige: function (T) {
    this.T = this.norm(T);
    LERNEN.el("uhStd").setAttribute("transform", "rotate(" + (this.T * 0.5).toFixed(2) + ")");
    LERNEN.el("uhMin").setAttribute("transform", "rotate(" + ((this.T % 60) * 6) + ")");
  },
  punkt: function (e) {
    var p = this.svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    var q = p.matrixTransform(this.svg.getScreenCTM().inverse());
    return { x: q.x, y: q.y, r: Math.hypot(q.x, q.y), w: (Math.atan2(q.x, -q.y) * 180 / Math.PI + 360) % 360 };
  },
  // Abstand eines Punkts zu einem Zeiger (Strecke von der Mitte bis zur Spitze)
  abstand: function (p, winkel, laenge) {
    var w = winkel * Math.PI / 180, sx = Math.sin(w) * laenge, sy = -Math.cos(w) * laenge, t = Math.max(0, Math.min(1, (p.x * sx + p.y * sy) / (laenge * laenge)));
    return Math.hypot(p.x - sx * t, p.y - sy * t);
  },
  // Welcher Zeiger wird gegriffen? Liegt der Finger nur an einem, dann dieser. Liegen beide nah (uebereinander oder nahe der Mitte),
  // entscheidet der Abstand zur Mitte: bis knapp ueber die Spitze des kleinen Zeigers der kleine, weiter aussen der grosse.
  welcherZeiger: function (p) {
    var dStd = this.abstand(p, this.T * 0.5, this.LANG_STD), dMin = this.abstand(p, (this.T % 60) * 6, this.LANG_MIN), NAH = 24, GRENZE = this.LANG_STD + 10;
    var nahS = dStd < NAH, nahM = dMin < NAH;
    if (nahS && nahM) return p.r <= GRENZE ? "h" : "m";
    if (nahS) return "h";
    if (nahM) return "m";
    return p.r > 62 ? "m" : "h";
  },
  stellbar: function () { return this.frei && this.a && (this.a.modus === "stellen" || this.a.modus === "digital" || this.a.modus === "spaeter"); },
  runter: function (e) {
    if (!this.stellbar()) return;
    e.preventDefault();
    try { this.svg.setPointerCapture(e.pointerId); } catch (x) {}
    this.zieht = this.welcherZeiger(this.punkt(e));
    LERNEN.el(this.zieht === "m" ? "uhMin" : "uhStd").classList.add("aktiv");
    this.bewegt(e);
  },
  bewegt: function (e) {
    if (!this.zieht) return;
    var p = this.punkt(e), raster = this.RASTER[Math.min(this.MAX, this.stufe)] || 5, alt = this.T, neu;
    if (p.r < 6) return;                                            // genau in der Mitte ist die Richtung unklar
    if (this.zieht === "m") {                                       // der grosse Zeiger laeuft beim Ziehen immer in 5-Minuten-Schritten
      var mAlt = alt % 60, mNeu = Math.round(p.w / 30) * 5 % 60, d = mNeu - mAlt;
      if (d > 30) d -= 60; else if (d < -30) d += 60;
      neu = alt + d;
    } else {
      var ziel = Math.round(p.w * 2 / raster) * raster, k = Math.round((alt - ziel) / 720);
      neu = ziel + k * 720;                                       // die Stellung, die der bisherigen am naechsten ist
    }
    if (this.norm(neu) !== alt) { this.zeige(neu); TOENE.tick(); }
  },
  hoch: function () {
    var raster = this.RASTER[Math.min(this.MAX, this.stufe)] || 5;
    if (this.zieht === "m" && this.T % raster) { this.zeige(Math.round(this.T / raster) * raster); TOENE.tick(); }   // beim Loslassen auf die Stufe einrasten (Stufe 1: zurueck auf die 12)
    this.zieht = null;
    ["uhMin", "uhStd"].forEach(function (id) { var z = LERNEN.el(id); if (z) z.classList.remove("aktiv"); });
  },

  // ---- Ablauf ----
  start: function () {
    this.nr = 0; this.gut = 0; this.modi = [];
    LERNEN.zeige("uhr"); LERNEN.punkte(0);
    if (!this.svg) this.bauen();
    var m = LERNEN.el("uhMampfi");
    if (!m.querySelector("svg")) { MAMPFI.einsetzen(m); m.onclick = function () { MAMPFI.kitzeln(m); }; }
    this.neu();
  },
  neu: function () {
    var W = LERNEN.W(), spr = LERNEN.sprache, stufe = Math.min(this.MAX, Math.max(1, this.stand().stufe)), self = this;
    this.stufe = stufe; LERNEN.zeigeStufe(stufe);
    if (!this.modi.length) this.modi = LERNEN.mische(["stellen", "lesen", "welche", "digital", "spaeter"]);
    var modus = this.modi.shift(), tag = LERNEN.zufall(this.TAG[spr]), ziel, start = null, spanne = 0, n = 0;
    if (modus === "spaeter") {
      spanne = LERNEN.zufall(this.SPANNEN[stufe]);
      do { start = this.zufallsZeit(stufe); ziel = this.norm(start + spanne); } while (this.a && ziel === this.a.ziel && ++n < 10);
    } else {
      do { ziel = this.zufallsZeit(stufe); } while (this.a && ziel === this.a.ziel && ++n < 10);
    }
    this.a = { ziel: ziel, modus: modus, tag: tag, spanne: spanne, start: start, hinweise: 0 }; this.erster = true; this.frei = true;
    var uhr = LERNEN.el("uhUhr"), szene = uhr.parentNode, text = LERNEN.el("uhText"), opt = LERNEN.el("uhOpt");
    uhr.classList.toggle("mit-minuten", stufe >= 4);
    szene.classList.toggle("ohne", modus === "welche");
    LERNEN.el("uhDigital").innerHTML = "&nbsp;";
    MAMPFI.ruhe(LERNEN.el("uhMampfi"), null);
    opt.innerHTML = ""; opt.className = "optionen";
    var zeitT = this.text(ziel, spr, false), zeitG = this.text(ziel, spr, true);

    if (modus === "stellen" || modus === "digital" || modus === "spaeter") {
      if (start === null) { var raster = this.RASTER[stufe]; do { start = Math.floor(Math.random() * (720 / raster)) * raster; } while (start === ziel); }
      this.zeige(start);
      uhr.classList.add("stellbar");
      var ok = document.createElement("button");
      ok.className = "opt fertig-knopf"; ok.textContent = "✓"; ok.onclick = function () { self.pruefe(ok); };
      opt.className = "optionen n1"; opt.appendChild(ok);
      if (modus === "stellen") {
        text.textContent = tag[0] + " " + W.saetze.uhrStellen(zeitT, tag[1]);
        LERNEN.sag(W.saetze.uhrStellen(zeitG, tag[1]));
      } else if (modus === "digital") {
        text.innerHTML = '<span class="digi">' + this.digital(ziel) + "</span><span>" + W.saetze.uhrDigital + "</span>";
        LERNEN.sag(W.saetze.uhrDigital);
      } else {
        var jT = this.text(start, spr, false), jG = this.text(start, spr, true), dauer = W.saetze.uhrDauer[Math.abs(spanne)];
        text.textContent = (spanne > 0 ? tag[0] + " " + W.saetze.uhrSpaeter(jT, dauer, tag[1]) : "⏪ " + W.saetze.uhrFrueher(jT, dauer));
        LERNEN.sag(spanne > 0 ? W.saetze.uhrSpaeter(jG, dauer, tag[1]) : W.saetze.uhrFrueher(jG, dauer));
      }
    } else if (modus === "lesen") {
      this.zeige(ziel);
      uhr.classList.remove("stellbar");
      text.textContent = "🤔 " + W.saetze.uhrLesen;
      opt.className = "optionen n3 uhr-text";
      this.antworten(ziel, stufe, false).forEach(function (t) {
        var b = document.createElement("button");
        b.className = "opt"; b.textContent = self.text(t, spr, false); b.setAttribute("data-t", t);
        b.onclick = function () { self.waehle(t, b); };
        opt.appendChild(b);
      });
      LERNEN.sag(W.saetze.uhrLesen);
    } else {                                                          // welche
      uhr.classList.remove("stellbar");
      text.textContent = "🤔 " + W.saetze.uhrWelche(zeitT);
      opt.className = "optionen uhr-bilder";
      this.antworten(ziel, stufe, true).forEach(function (t) {
        var b = document.createElement("button");
        b.className = "opt"; b.innerHTML = self.kleineUhr(t); b.setAttribute("data-t", t); b.setAttribute("aria-label", self.digital(t));
        b.onclick = function () { self.waehle(t, b); };
        opt.appendChild(b);
      });
      LERNEN.sag(W.saetze.uhrWelche(zeitG));
    }
  },
  // Antworten zur Wahl: richtig, eine Stunde daneben, vertauschte Zeiger, sonst eine andere Zeit der Stufe
  antworten: function (ziel, stufe, bilder) {
    var h = Math.floor(ziel / 60), m = ziel % 60, l = [ziel], self = this;
    var dazu = function (t) { t = self.norm(t); if (l.indexOf(t) < 0 && l.length < 3) l.push(t); };
    var hVert = Math.round(m / 5) % 12, mVert = (h * 5) % 60;            // kleiner Zeiger als Minuten gelesen, grosser als Stunde
    if (bilder && Math.random() < 0.5) { dazu(hVert * 60 + mVert); dazu(ziel + (Math.random() < 0.5 ? 60 : -60)); }
    else { dazu(ziel + (Math.random() < 0.5 ? 60 : -60)); if (bilder || stufe >= 3 || mVert % 30 === 0) dazu(hVert * 60 + mVert); }
    var n = 0; while (l.length < 3 && n++ < 30) dazu(this.zufallsZeit(stufe));
    return LERNEN.mische(l);
  },
  blinke: function (id) {
    var z = LERNEN.el(id);
    z.classList.remove("blinkt"); void z.getBoundingClientRect(); z.classList.add("blinkt");
    setTimeout(function () { z.classList.remove("blinkt"); }, 1600);
  },
  pruefe: function (k) {
    if (!this.frei) return;
    var W = LERNEN.W(), a = this.a, T = this.T, m = LERNEN.el("uhMampfi");
    if (T === a.ziel) { this.richtig(k); return; }
    this.erster = false;
    var stdFalsch = Math.floor(T / 60) !== Math.floor(a.ziel / 60), minFalsch = T % 60 !== a.ziel % 60;
    this.blinke(minFalsch ? "uhMin" : "uhStd");
    k.classList.remove("wackelt"); void k.offsetWidth; k.classList.add("wackelt");
    MAMPFI.wundert(m); TOENE.falsch();
    var hinweis;
    if (a.modus === "spaeter" && a.hinweise === 0) hinweis = W.saetze.uhrSpanne[Math.abs(a.spanne)];   // erster Fehler: wie weit wandern die Zeiger?
    else {
      hinweis = minFalsch ? W.saetze.uhrMinuten : W.saetze.uhrStunde;
      if (!minFalsch && stdFalsch && a.ziel % 60 === 30) hinweis += " " + W.saetze.uhrHalb;
    }
    a.hinweise++;
    LERNEN.sagNur(hinweis);
  },
  waehle: function (t, b) {
    if (!this.frei || b.disabled) return;
    if (t === this.a.ziel) { this.richtig(b); return; }
    this.erster = false; b.disabled = true; b.classList.add("falsch");
    MAMPFI.wundert(LERNEN.el("uhMampfi")); TOENE.falsch();
    var W = LERNEN.W();
    LERNEN.sagNur(t % 60 !== this.a.ziel % 60 ? W.saetze.uhrMinuten : W.saetze.uhrStunde);
  },
  richtig: function (k) {
    var W = LERNEN.W(), a = this.a, spr = LERNEN.sprache, m = LERNEN.el("uhMampfi");
    this.frei = false;
    k.classList.add("richtig"); TOENE.richtig(); LERNEN.konfetti(16, k);
    if (this.erster) this.gut++;
    this.nr++; LERNEN.punkte(this.nr);
    var hoch = LERNEN.fortschritt(this, this.erster) > 0;
    LERNEN.el("uhUhr").classList.remove("stellbar");
    if (a.modus === "welche") { LERNEN.el("uhUhr").parentNode.classList.remove("ohne"); this.zeige(a.ziel); }
    LERNEN.el("uhDigital").textContent = this.digital(a.ziel) + "  ·  " + this.text(a.ziel, spr, false);
    var satz = a.modus === "digital" && a.ziel % 60 ? W.saetze.uhrDigitalRichtig(this.digitalGesprochen(a.ziel, spr), this.text(a.ziel, spr, true)) : W.saetze.uhrRichtig(this.text(a.ziel, spr, true));
    if (hoch) { MAMPFI.begeistert(m); LERNEN.zeigeStufe(this.stand().stufe, true); LERNEN.konfetti(30); satz += " " + W.saetze.stufeHoch; }
    else MAMPFI.jubelt(m);
    var p = LERNEN.sagNur(LERNEN.lob() + " " + satz);
    LERNEN.nachAnsage(p, function () { UHR.weiter(); }, 700);
  },
  weiter: function () { if (this.nr >= this.RUNDE) this.ende(); else this.neu(); },
  ende: function () { LERNEN.belohnung("uhr", function () { UHR.start(); }); }
};
