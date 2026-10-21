// lernen.js — Kinderecke: Startseite, Wechsel der Bildschirme, Sprache, Fortschritt, Sterne, Belohnung und Konfetti.
// Kein Modul; globales Objekt LERNEN. Die Spiele (anlaut.js, spuren.js, rechnen.js) rufen LERNEN.zeige, .sag, .punkte und .belohnung.
// Gespeichert wird nur auf diesem Geraet (localStorage): Sprache, Sterne und wie weit jedes Spiel schon ist.

var TIERE = ["🐻", "🐼", "🦁", "🐯", "🐸", "🐵", "🦊", "🐰", "🐨", "🐷", "🦄", "🐙", "🦒", "🐧", "🐢", "🦉"];

var LERNEN = {
  sprache: "de", gen: 0, ansage: "", RUNDE: 5,
  el: function (id) { return document.getElementById(id); },
  lies: function (k, std) {
    var o = {}, x;
    for (x in std) o[x] = std[x];
    try { var v = JSON.parse(localStorage.getItem("lernen_" + k) || "null"); if (v && typeof v === "object") for (x in v) o[x] = v[x]; } catch (e) {}
    return o;
  },
  schreib: function (k, v) { try { localStorage.setItem("lernen_" + k, JSON.stringify(v)); } catch (e) {} },
  W: function () { return WOERTER[this.sprache]; },
  zufall: function (a) { return a[Math.floor(Math.random() * a.length)]; },
  mische: function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; },
  lob: function () { return this.zufall(this.W().saetze.lob); },

  // Zeitversetzt ausfuehren, aber nur, solange derselbe Bildschirm offen ist (sonst laufen alte Aufgaben weiter)
  spaeter: function (fn, ms) { var g = this.gen; setTimeout(function () { if (g === LERNEN.gen) fn(); }, ms || 0); },
  nachAnsage: function (p, fn, pause) { var g = this.gen; p.then(function () { setTimeout(function () { if (g === LERNEN.gen) fn(); }, pause || 300); }); },
  sag: function (text) { this.ansage = text; return STIMME.sag(text, this.sprache); },      // Aufgabe: wird mit 🔊 wiederholt
  sagNur: function (text) { return STIMME.sag(text, this.sprache); },                     // Lob, Hinweis

  zeige: function (id) {
    this.gen++; STIMME.still();
    var s = document.querySelectorAll(".schirm");
    for (var i = 0; i < s.length; i++) s[i].classList.toggle("weg", s[i].id !== id);
    window.scrollTo(0, 0);
  },
  punkte: function (fertig, gesamt) {
    var p = document.querySelectorAll(".schirm:not(.weg) .punkte"), n = gesamt || this.RUNDE, h = "";
    for (var i = 0; i < n; i++) h += '<span class="' + (i < fertig ? "voll" : "") + '"></span>';
    for (var k = 0; k < p.length; k++) p[k].innerHTML = h;
  },
  sterne: function () { return this.lies("sterne", { anlaut: 0, spuren: 0, rechnen: 0, bauen: 0, fuettern: 0, uhr: 0 }); },
  einstellung: function () { return this.lies("einstellung", { sprache: "de", uhrstil: "standard" }); },

  // ---- Stufen: 3 Aufgaben hintereinander auf Anhieb richtig -> eine Stufe hinauf; 2 Aufgaben hintereinander mit Fehlern -> eine hinunter.
  // In den Einstellungen laesst sich die Stufe je Spiel setzen und festhalten (dann aendert sie sich nicht von selbst).
  // spiel braucht schluessel(), stand() und MAX. Rueckgabe: 1 hinauf, -1 hinunter, 0 gleich.
  HOCH: 3, RUNTER: 2,
  fortschritt: function (spiel, aufAnhieb) {
    var st = spiel.stand(), erg = 0;
    if (st.fest) return 0;
    if (aufAnhieb) { st.serie = (st.serie || 0) + 1; st.fehler = 0; if (st.serie >= this.HOCH && st.stufe < spiel.MAX) { st.stufe++; st.serie = 0; erg = 1; } }
    else { st.fehler = (st.fehler || 0) + 1; st.serie = 0; if (st.fehler >= this.RUNTER && st.stufe > 1) { st.stufe--; st.fehler = 0; erg = -1; } }
    this.schreib(spiel.schluessel(), st);
    return erg;
  },
  setzeStufe: function (spiel, n, fest) {
    var k = spiel === BAUEN ? ["bauen_de", "bauen_en"] : [spiel.schluessel()], self = this;
    k.forEach(function (x) { self.schreib(x, { stufe: n, fest: !!fest, serie: 0, fehler: 0 }); });
  },
  zeigeStufe: function (n, hoch) {
    var c = document.querySelector(".schirm:not(.weg) .stufe-chip");
    if (!c) return;
    c.textContent = (this.sprache === "en" ? "Level " : "Stufe ") + n;
    c.classList.remove("hoch");
    if (hoch) { void c.offsetWidth; c.classList.add("hoch"); }
  },
  setzeEinstellung: function (k, v) { var e = this.einstellung(); e[k] = v; this.schreib("einstellung", e); },
  belohnung: function (spiel, nochmal) {
    var st = this.sterne(); st[spiel] = (st[spiel] || 0) + 1; this.schreib("sterne", st);
    this.zeige("belohnung");
    this.el("beTier").textContent = this.zufall(TIERE);
    this.el("beZahl").textContent = "⭐ " + st[spiel];
    this.el("beNochmal").onclick = function () { TOENE.tipp(); nochmal(); };
    TOENE.geschafft(); this.konfetti(46);
    this.sag(this.W().saetze.runde);
  },
  heim: function () { TOENE.tipp(); this.zeige("hub"); this.hubAuffrischen(); },
  hubAuffrischen: function () {
    var st = this.sterne(), s = document.querySelectorAll("#hub .sterne");
    for (var i = 0; i < s.length; i++) { var n = st[s[i].getAttribute("data-spiel")] || 0; s[i].textContent = n ? "⭐ " + n : ""; }
    var b = document.querySelectorAll("#hub .spr");
    for (var k = 0; k < b.length; k++) b[k].classList.toggle("an", b[k].getAttribute("data-spr") === this.sprache);
    var h = this.el("stimmeHinweis");
    if (!STIMME.an) h.textContent = "Dieses Gerät hat keine Sprachausgabe. Die Spiele gehen, aber ohne Vorlesen.";
    else if (!STIMME.hatStimme(this.sprache)) h.textContent = "Für " + this.W().name + " ist auf diesem Gerät keine Stimme installiert. In den Handy-Einstellungen unter Sprachausgabe lässt sie sich nachladen.";
    else h.textContent = "";
  },
  setzeSprache: function (s) {
    if (!WOERTER[s]) return;
    this.sprache = s; this.setzeEinstellung("sprache", s);
    TOENE.tipp(); this.hubAuffrischen(); this.sagNur(this.W().name);
  },

  // Ein Bild (Emoji) fliegt von einem Element zu einem anderen, z. B. in Mampfis Mund
  fliege: function (von, zu, ms, fertig) {
    var a = von.getBoundingClientRect(), b = zu.getBoundingClientRect(), k = document.createElement("div");
    k.className = "flieger"; k.textContent = von.textContent;
    k.style.left = a.left + "px"; k.style.top = a.top + "px"; k.style.width = a.width + "px"; k.style.height = a.height + "px";
    k.style.fontSize = window.getComputedStyle(von).fontSize;
    document.body.appendChild(k);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height * 0.62 - (a.top + a.height / 2);
    void k.offsetWidth;
    k.style.transition = "transform " + ms + "ms cubic-bezier(.45,-0.35,.7,1), opacity " + ms + "ms ease-in";
    k.style.transform = "translate(" + dx + "px," + dy + "px) scale(.3) rotate(25deg)"; k.style.opacity = "0.15";
    setTimeout(function () { if (k.parentNode) k.parentNode.removeChild(k); if (fertig) fertig(); }, ms + 20);
  },

  // ---- Einstellungen fuer Eltern: Stimme je Sprache, Sprechtempo, Sprechweise der Uhrzeit ----
  stimmeLaden: function () {
    var st = this.lies("stimme", { de: "", en: "", tempo: 0.88 });
    STIMME.wahl.de = st.de || ""; STIMME.wahl.en = st.en || ""; STIMME.TEMPO = Math.max(0.6, Math.min(1.2, +st.tempo || 0.88));
  },
  stimmeSpeichern: function () { this.schreib("stimme", { de: STIMME.wahl.de, en: STIMME.wahl.en, tempo: STIMME.TEMPO }); },
  einstellungen: function () {
    TOENE.tipp(); this.zeige("einstellungen");
    var self = this, box = this.el("einStimmen"), e = this.einstellung();
    box.innerHTML = "";
    ["de", "en"].forEach(function (spr) {
      var l = STIMME.liste(spr), zeile = document.createElement("div");
      zeile.className = "ein-zeile";
      var titel = document.createElement("b"); titel.textContent = spr === "de" ? "🇩🇪 Deutsch" : "🇬🇧 English";
      var sel = document.createElement("select");
      sel.innerHTML = '<option value="">automatisch</option>' + l.map(function (v) { return '<option value="' + String(v.voiceURI).replace(/"/g, "&quot;") + '">' + v.name + " (" + v.lang + ")" + (v.localService ? "" : " · online") + "</option>"; }).join("");
      sel.value = STIMME.wahl[spr] || "";
      sel.onchange = function () { STIMME.wahl[spr] = sel.value; self.stimmeSpeichern(); STIMME.sag(spr === "de" ? "Hallo, ich bin Mampfi!" : "Hello, I'm Mampfi!", spr); };
      var probe = document.createElement("button");
      probe.className = "spr"; probe.textContent = "▶ Probe";
      probe.onclick = function () { STIMME.sag(spr === "de" ? "Hallo, ich bin Mampfi! Wie spät ist es? Halb drei." : "Hello, I'm Mampfi! What time is it? Half past two.", spr); };
      zeile.appendChild(titel); zeile.appendChild(sel); zeile.appendChild(probe);
      if (!l.length) { var h = document.createElement("small"); h.textContent = STIMME.an ? "Keine Stimme für diese Sprache auf dem Gerät." : "Keine Sprachausgabe auf dem Gerät."; zeile.appendChild(h); }
      box.appendChild(zeile);
    });
    var tempo = this.el("einTempo");
    tempo.value = STIMME.TEMPO;
    tempo.oninput = function () { STIMME.TEMPO = +tempo.value; self.stimmeSpeichern(); };
    tempo.onchange = function () { self.sagNur(self.sprache === "en" ? "This is how fast I talk." : "So schnell spreche ich."); };
    this.stufenZeichnen();
    var stile = document.querySelectorAll("#einstellungen [name=uhrstil]");
    for (var i = 0; i < stile.length; i++) {
      stile[i].checked = stile[i].value === e.uhrstil;
      stile[i].onchange = function () { self.setzeEinstellung("uhrstil", this.value); };
    }
  },

  // Je Spiel: Stufe waehlen (Knoepfe 1..MAX), Beschreibung, festhalten
  stufenZeichnen: function () {
    var self = this, box = this.el("einStufen");
    box.innerHTML = "";
    [["🍪 Mampfi füttern", FUETTERN], ["🕒 Uhr", UHR], ["🧩 Wörter bauen", BAUEN], ["🍎 Rechnen", RECHNEN]].forEach(function (x) {
      var spiel = x[1], z = document.createElement("div"), chips = document.createElement("div"), text = document.createElement("small"), fest = document.createElement("label");
      z.className = "stufen-zeile"; chips.className = "chips";
      z.innerHTML = "<b>" + x[0] + "</b>";
      fest.className = "fest"; fest.innerHTML = '<input type="checkbox"><span>festhalten</span>';
      var cb = fest.querySelector("input");
      var mal = function () {
        var st = spiel.stand(), n = Math.min(spiel.MAX, Math.max(1, st.stufe));
        Array.prototype.forEach.call(chips.children, function (b) { b.classList.toggle("an", +b.getAttribute("data-s") === n); });
        text.textContent = "Stufe " + n + ": " + spiel.STUFEN[n - 1];
        cb.checked = !!st.fest;
      };
      for (var i = 1; i <= spiel.MAX; i++) {
        var b = document.createElement("button");
        b.textContent = i; b.setAttribute("data-s", i); b.setAttribute("aria-label", "Stufe " + i + ": " + spiel.STUFEN[i - 1]);
        b.onclick = function () { TOENE.tipp(); self.setzeStufe(spiel, +this.getAttribute("data-s"), cb.checked); mal(); };
        chips.appendChild(b);
      }
      cb.onchange = function () { self.setzeStufe(spiel, Math.min(spiel.MAX, Math.max(1, spiel.stand().stufe)), cb.checked); mal(); };
      z.appendChild(chips); z.appendChild(text); z.appendChild(fest);
      box.appendChild(z);
      mal();
    });
  },

  // Konfetti aus bunten Schnipseln und Sternen; um ein Element herum oder ueber den ganzen Schirm
  konfetti: function (n, um) {
    var box = this.el("konfetti"), r = um ? um.getBoundingClientRect() : null, farben = ["#ff6b6b", "#ffcf4d", "#4cc9f0", "#7bd17b", "#b388ff", "#ff9f43"];
    for (var i = 0; i < n; i++) {
      var d = document.createElement("i"), stern = Math.random() < 0.25;
      var x = r ? r.left + r.width / 2 : Math.random() * window.innerWidth, y = r ? r.top + r.height / 2 : -20;
      d.className = stern ? "kf stern" : "kf";
      if (stern) d.textContent = "⭐"; else d.style.background = farben[i % farben.length];
      var dx = (Math.random() - 0.5) * (r ? 260 : 120), dy = r ? -(80 + Math.random() * 160) : window.innerHeight * (0.6 + Math.random() * 0.5);
      d.style.left = x + "px"; d.style.top = y + "px";
      d.style.setProperty("--dx", dx + "px"); d.style.setProperty("--dy", dy + "px"); d.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      d.style.animationDuration = (r ? 0.9 : 1.6 + Math.random() * 0.9) + "s"; d.style.animationName = r ? "platzen" : "fallen";
      box.appendChild(d);
      (function (e) { setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, 2700); })(d);
    }
  },

  init: function () {
    this.sprache = this.lies("einstellung", { sprache: "de" }).sprache === "en" ? "en" : "de";
    this.stimmeLaden();
    STIMME.aufGeladen = function () { LERNEN.hubAuffrischen(); if (!LERNEN.el("einstellungen").classList.contains("weg")) LERNEN.einstellungen(); };
    STIMME.init();
    document.addEventListener("pointerdown", function () { TOENE.start(); }, true);
    MAMPFI.init();
    var self = this, spr = document.querySelectorAll("#hub .spr");
    for (var i = 0; i < spr.length; i++) (function (b) { b.onclick = function () { self.setzeSprache(b.getAttribute("data-spr")); }; })(spr[i]);
    this.el("kAnlautSvg").innerHTML = SCHRIFT.svgPaar("M");
    this.el("kAnlaut").onclick = function () { TOENE.tipp(); ANLAUT.start(); };
    this.el("kSpuren").onclick = function () { TOENE.tipp(); SPUREN.start(); };
    this.el("kRechnen").onclick = function () { TOENE.tipp(); RECHNEN.start(); };
    this.el("kBauenSvg").innerHTML = SCHRIFT.svgWort("Hund");
    this.el("kBauen").onclick = function () { TOENE.tipp(); BAUEN.start(); };
    this.el("kFuettern").onclick = function () { TOENE.tipp(); FUETTERN.start(); };
    this.el("kUhr").onclick = function () { TOENE.tipp(); UHR.start(); };
    this.el("kEinst").onclick = function () { self.einstellungen(); };
    var hm = MAMPFI.einsetzen(this.el("hubMampfi"));
    hm.onclick = function () { MAMPFI.kitzeln(hm); };
    MAMPFI.einsetzen(this.el("fuMini"));
    var heim = document.querySelectorAll(".heim");
    for (var h = 0; h < heim.length; h++) heim[h].onclick = function () { self.heim(); };
    var ohr = document.querySelectorAll(".hoeren");
    for (var o = 0; o < ohr.length; o++) ohr[o].onclick = function () { TOENE.tipp(); if (self.ansage) self.sag(self.ansage); };
    this.el("beHeim").onclick = function () { self.heim(); };
    SPUREN.init();
    this.zeige("hub"); this.hubAuffrischen();
  }
};

window.addEventListener("load", function () { LERNEN.init(); });
