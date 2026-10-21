// uhr.js — Uhrzeit lernen mit einer analogen Uhr. Zwei Aufgabenarten: "Stell die Uhr" (Zeiger ziehen) und "Wie spaet ist es?" (ablesen).
// Die Zeiger sind gekoppelt wie bei einer echten Uhr: dreht man den grossen Zeiger einmal ganz herum, geht der kleine eine Stunde weiter.
// Stufen: 1 volle Stunden · 2 halbe · 3 Viertel · 4 Fuenf-Minuten-Schritte (mit Minutenzahlen aussen). Rauf bei >= 4 von 5, runter bei <= 2.
// Sprechweise einstellbar: Standard ("Viertel nach 3") oder wienerisch ("viertel 4", "dreiviertel 4"). Kein Modul; globales Objekt UHR.

var UHR = {
  RUNDE: 5, MAX: 4, nr: 0, gut: 0, a: null, erster: true, frei: false, T: 0, zieht: null, svg: null,
  RASTER: [0, 60, 30, 15, 5],                                     // so fein laesst sich der Minutenzeiger je Stufe stellen
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
  stand: function () { return LERNEN.lies("uhr", { stufe: 1 }); },
  stil: function () { return LERNEN.lies("einstellung", { uhrstil: "standard" }).uhrstil; },

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
  // Uhrzeit als Ansage-Teile (fuer eigene Aufnahmen): Zahlen und kurze Satzteile wie "halb", "Viertel nach"
  teile: function (T, spr) {
    var A = ANSAGE, h = Math.floor(T / 60) % 12, m = T % 60, h1 = (h + 1) % 12, wien = this.stil() === "wien";
    var Z = function (x) { return A.z(x === 0 ? 12 : x, spr); }, S = function (k) { return A.s(k, null, spr); };
    if (spr === "en") {
      if (m === 0) return [Z(h), S("uhUhr")];
      if (m === 30) return [S("uhHalb"), Z(h)];
      if (m === 15) return [S("uhViertelNach"), Z(h)];
      if (m === 45) return [S("uhViertelVor"), Z(h1)];
      return m < 30 ? [A.z(m, spr), S("uhNach"), Z(h)] : [A.z(60 - m, spr), S("uhVor"), Z(h1)];
    }
    if (m === 0) return h === 1 ? [S("uhEinUhr")] : [Z(h), S("uhUhr")];
    if (m === 30) return [S("uhHalb"), Z(h1)];
    if (m === 15) return wien ? [S("uhViertel"), Z(h1)] : [S("uhViertelNach"), Z(h)];
    if (m === 45) return wien ? [S("uhDreiviertel"), Z(h1)] : [S("uhViertelVor"), Z(h1)];
    if (m === 5 || m === 10) return [A.z(m, spr), S("uhNach"), Z(h)];
    if (m === 20) return wien ? [A.z(10, spr), S("uhVorHalb"), Z(h1)] : [A.z(20, spr), S("uhNach"), Z(h)];
    if (m === 25) return [A.z(5, spr), S("uhVorHalb"), Z(h1)];
    if (m === 35) return [A.z(5, spr), S("uhNachHalb"), Z(h1)];
    if (m === 40) return wien ? [A.z(10, spr), S("uhNachHalb"), Z(h1)] : [A.z(20, spr), S("uhVor"), Z(h1)];
    return [A.z(60 - m, spr), S("uhVor"), Z(h1)];
  },
  digital: function (T) { var h = Math.floor(T / 60) % 12, m = T % 60; return (h === 0 ? 12 : h) + ":" + (m < 10 ? "0" : "") + m; },
  zufallsZeit: function (stufe) {
    var h = Math.floor(Math.random() * 12), m = 0, r = Math.random();
    if (stufe === 2) m = r < 0.7 ? 30 : 0;
    else if (stufe === 3) m = r < 0.35 ? 15 : r < 0.7 ? 45 : r < 0.85 ? 30 : 0;
    else if (stufe >= 4) m = [5, 10, 20, 25, 35, 40, 50, 55, 15, 45][Math.floor(Math.random() * 10)];
    return h * 60 + m;
  },

  // ---- Zifferblatt ----
  bauen: function () {
    var box = LERNEN.el("uhUhr"), s = '<svg id="uhSvg" viewBox="-128 -128 256 256">';
    s += '<circle r="104" fill="#fffdf7" stroke="#3b2f22" stroke-width="6"/>';
    for (var i = 0; i < 60; i++) {
      var w = i * 6 * Math.PI / 180, lang = i % 5 === 0, r1 = lang ? 86 : 93, r2 = 99;
      s += '<line x1="' + (Math.sin(w) * r1).toFixed(1) + '" y1="' + (-Math.cos(w) * r1).toFixed(1) + '" x2="' + (Math.sin(w) * r2).toFixed(1) + '" y2="' + (-Math.cos(w) * r2).toFixed(1) +
        '" stroke="#3b2f22" stroke-width="' + (lang ? 3.5 : 1.5) + '" stroke-linecap="round"/>';
    }
    for (var z = 1; z <= 12; z++) {
      var wz = z * 30 * Math.PI / 180;
      s += '<text x="' + (Math.sin(wz) * 70).toFixed(1) + '" y="' + (-Math.cos(wz) * 70 + 8).toFixed(1) + '" text-anchor="middle" font-size="24" font-weight="900" fill="#3b2f22">' + z + '</text>';
      var minuten = (z * 5) % 60;
      s += '<text class="uh-minuten" x="' + (Math.sin(wz) * 117).toFixed(1) + '" y="' + (-Math.cos(wz) * 117 + 5).toFixed(1) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#3fa9d6">' + (minuten < 10 ? "0" : "") + minuten + '</text>';
    }
    s += '<g id="uhStd" class="zeiger"><line x1="0" y1="14" x2="0" y2="-52" stroke="#e5484d" stroke-width="11" stroke-linecap="round"/></g>';
    s += '<g id="uhMin" class="zeiger"><line x1="0" y1="18" x2="0" y2="-86" stroke="#3fa9d6" stroke-width="7" stroke-linecap="round"/></g>';
    s += '<circle r="8" fill="#3b2f22"/></svg>';
    box.innerHTML = s;
    this.svg = LERNEN.el("uhSvg");
    var self = this;
    this.svg.addEventListener("pointerdown", function (e) { self.runter(e); });
    this.svg.addEventListener("pointermove", function (e) { self.bewegt(e); });
    this.svg.addEventListener("pointerup", function () { self.hoch(); });
    this.svg.addEventListener("pointercancel", function () { self.hoch(); });
  },
  zeige: function (T) {
    this.T = ((T % 720) + 720) % 720;
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
  runter: function (e) {
    if (!this.frei || !this.a || this.a.modus !== "stellen") return;
    e.preventDefault();
    try { this.svg.setPointerCapture(e.pointerId); } catch (x) {}
    var p = this.punkt(e), dStd = this.abstand(p, this.T * 0.5, 52), dMin = this.abstand(p, (this.T % 60) * 6, 86);
    this.zieht = (Math.min(dStd, dMin) < 26) ? (dMin <= dStd ? "m" : "h") : (p.r > 60 ? "m" : "h");
    LERNEN.el(this.zieht === "m" ? "uhMin" : "uhStd").classList.add("aktiv");
    this.bewegt(e);
  },
  bewegt: function (e) {
    if (!this.zieht) return;
    var p = this.punkt(e), raster = this.RASTER[Math.min(this.MAX, this.stufe)] || 5, alt = this.T, neu;
    if (this.zieht === "m") {
      var mAlt = alt % 60, mNeu = Math.round(p.w / 6 / raster) * raster % 60, d = mNeu - mAlt;
      if (d > 30) d -= 60; else if (d < -30) d += 60;
      neu = alt + d;
    } else {
      var ziel = Math.round(p.w * 2 / raster) * raster, k = Math.round((alt - ziel) / 720);
      neu = ziel + k * 720;                                       // die Stellung, die der bisherigen am naechsten ist
    }
    if (((neu % 720) + 720) % 720 !== alt) { this.zeige(neu); TOENE.tick(); }
  },
  hoch: function () {
    this.zieht = null;
    ["uhMin", "uhStd"].forEach(function (id) { var z = LERNEN.el(id); if (z) z.classList.remove("aktiv"); });
  },

  // ---- Ablauf ----
  start: function () {
    this.nr = 0; this.gut = 0;
    LERNEN.zeige("uhr"); LERNEN.punkte(0);
    if (!this.svg) this.bauen();
    var m = LERNEN.el("uhMampfi");
    if (!m.querySelector("svg")) { MAMPFI.einsetzen(m); m.onclick = function () { MAMPFI.kitzeln(m); }; }
    this.neu();
  },
  neu: function () {
    var W = LERNEN.W(), spr = LERNEN.sprache, stufe = Math.min(this.MAX, Math.max(1, this.stand().stufe)), self = this;
    this.stufe = stufe;
    var ziel, n = 0;
    do { ziel = this.zufallsZeit(stufe); } while (this.a && ziel === this.a.ziel && ++n < 10);
    var modus = (this.nr % 2 === 0) ? "stellen" : "lesen", tagNr = Math.floor(Math.random() * this.TAG[spr].length), tag = this.TAG[spr][tagNr];
    this.a = { ziel: ziel, modus: modus, tag: tag, tagNr: tagNr }; this.erster = true; this.frei = true;
    LERNEN.el("uhUhr").classList.toggle("mit-minuten", stufe >= 4);
    LERNEN.el("uhDigital").innerHTML = "&nbsp;";
    MAMPFI.ruhe(LERNEN.el("uhMampfi"), null);
    var opt = LERNEN.el("uhOpt");
    opt.innerHTML = "";
    if (modus === "stellen") {
      var start, raster = this.RASTER[stufe];
      do { start = Math.floor(Math.random() * (720 / raster)) * raster; } while (start % 720 === ziel % 720);
      this.zeige(start);
      LERNEN.el("uhUhr").classList.add("stellbar");
      var satz = ANSAGE.SAETZE.uhrStellen(this.teile(ziel, spr), tagNr);
      LERNEN.el("uhText").textContent = tag[0] + " " + ANSAGE.text(satz);
      var ok = document.createElement("button");
      ok.className = "opt fertig-knopf"; ok.textContent = "✓"; ok.onclick = function () { self.pruefe(ok); };
      opt.className = "optionen n1"; opt.appendChild(ok);
      LERNEN.sag(satz);
    } else {
      this.zeige(ziel);
      LERNEN.el("uhUhr").classList.remove("stellbar");
      LERNEN.el("uhText").textContent = "🤔 " + ANSAGE.text(ANSAGE.SAETZE.uhrLesen());
      var antworten = this.antworten(ziel, stufe);
      opt.className = "optionen n3 uhr-text";
      antworten.forEach(function (t) {
        var b = document.createElement("button");
        b.className = "opt"; b.textContent = self.text(t, spr, false); b.setAttribute("data-t", t);
        b.onclick = function () { self.waehle(t, b); };
        opt.appendChild(b);
      });
      LERNEN.sag(ANSAGE.SAETZE.uhrLesen());
    }
  },
  // Antworten zum Ablesen: richtig, eine Stunde daneben, vertauschte Zeiger, sonst eine andere Zeit der Stufe
  antworten: function (ziel, stufe) {
    var h = Math.floor(ziel / 60), m = ziel % 60, l = [ziel];
    var dazu = function (t) { t = ((t % 720) + 720) % 720; if (l.indexOf(t) < 0 && l.length < 3) l.push(t); };
    dazu(ziel + (Math.random() < 0.5 ? 60 : -60));
    var hVert = Math.round(m / 5) % 12, mVert = (h * 5) % 60;            // kleiner Zeiger als Minuten gelesen, grosser als Stunde
    if (stufe >= 3 || mVert % 30 === 0) dazu(hVert * 60 + mVert);
    var n = 0; while (l.length < 3 && n++ < 20) dazu(this.zufallsZeit(stufe));
    return LERNEN.mische(l);
  },
  pruefe: function (k) {
    if (!this.frei) return;
    var W = LERNEN.W(), a = this.a, T = this.T, m = LERNEN.el("uhMampfi");
    if (T === a.ziel % 720) { this.richtig(k); return; }
    this.erster = false;
    var stdFalsch = Math.floor(T / 60) !== Math.floor(a.ziel / 60), minFalsch = T % 60 !== a.ziel % 60;
    var zeiger = minFalsch ? LERNEN.el("uhMin") : LERNEN.el("uhStd");
    zeiger.classList.remove("blinkt"); void zeiger.getBoundingClientRect(); zeiger.classList.add("blinkt");
    setTimeout(function () { zeiger.classList.remove("blinkt"); }, 1600);
    k.classList.remove("wackelt"); void k.offsetWidth; k.classList.add("wackelt");
    MAMPFI.wundert(m); TOENE.falsch();
    LERNEN.sagNur(ANSAGE.SAETZE.uhrHinweis(minFalsch, !minFalsch && stdFalsch && a.ziel % 60 === 30));
  },
  waehle: function (t, b) {
    if (!this.frei || b.disabled) return;
    if (t === this.a.ziel) { this.richtig(b); return; }
    this.erster = false; b.disabled = true; b.classList.add("falsch");
    MAMPFI.wundert(LERNEN.el("uhMampfi")); TOENE.falsch();
    LERNEN.sagNur(ANSAGE.SAETZE.nochmal());
  },
  richtig: function (k) {
    var W = LERNEN.W(), a = this.a, spr = LERNEN.sprache;
    this.frei = false;
    k.classList.add("richtig"); TOENE.richtig(); LERNEN.konfetti(16, k);
    if (this.erster) this.gut++;
    this.nr++; LERNEN.punkte(this.nr);
    LERNEN.el("uhUhr").classList.remove("stellbar");
    LERNEN.el("uhDigital").textContent = this.digital(a.ziel) + "  ·  " + this.text(a.ziel, spr, false);
    MAMPFI.jubelt(LERNEN.el("uhMampfi"));
    var p = LERNEN.sagNur(ANSAGE.SAETZE.uhrRichtig(this.teile(a.ziel, spr)));
    LERNEN.nachAnsage(p, function () { UHR.weiter(); }, 700);
  },
  weiter: function () { if (this.nr >= this.RUNDE) this.ende(); else this.neu(); },
  ende: function () {
    var st = this.stand();
    if (this.gut >= 4 && st.stufe < this.MAX) st.stufe++;
    else if (this.gut <= 2 && st.stufe > 1) st.stufe--;
    LERNEN.schreib("uhr", st);
    LERNEN.belohnung("uhr", function () { UHR.start(); });
  }
};
