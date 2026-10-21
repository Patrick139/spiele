// bauen.js — Woerter bauen: Bild sehen, Wort hoeren, Buchstaben-Kaertchen in der richtigen Reihenfolge antippen. Deutsch und Englisch.
// Stufen 1-5: Woerter nach Schwierigkeit (Laenge plus Stolpersteine wie sch, ie, Doppelbuchstaben, Dehnungs-h; englisch sh, ee, stummes e),
// ab Stufe 3 kommen falsche Kaertchen dazu (1, 2, 3). Stufe 6: ganze Tastatur. Nach >= 4 von 5 auf Anhieb richtig eine Stufe hinauf,
// bei <= 2 von 5 hinunter. Stand je Sprache: lernen_bauen_de / _en. Kein Modul; globales Objekt BAUEN.

var BAUEN = {
  // [Bild, Deutsch, Englisch, Art] — Art: e = Essen (Mampfi frisst es), t = Tier, d = Ding. null = in dieser Sprache nicht dabei
  KONZEPTE: [
    ["🐱", "Katze", "cat", "t"], ["🐶", "Hund", "dog", "t"], ["🐭", "Maus", "mouse", "t"], ["🐷", "Schwein", "pig", "t"], ["🐮", "Kuh", "cow", "t"],
    ["🐻", "Bär", "bear", "t"], ["🦊", "Fuchs", "fox", "t"], ["🐸", "Frosch", "frog", "t"], ["🐟", "Fisch", "fish", "t"], ["🦆", "Ente", "duck", "t"],
    ["🐝", "Biene", "bee", "t"], ["🐰", "Hase", "rabbit", "t"], ["🦁", "Löwe", "lion", "t"], ["🐯", "Tiger", "tiger", "t"], ["🦓", "Zebra", "zebra", "t"],
    ["🐒", "Affe", "monkey", "t"], ["🐍", "Schlange", "snake", "t"], ["🐑", "Schaf", "sheep", "t"], ["🐴", "Pferd", "horse", "t"], ["🦉", "Eule", "owl", "t"],
    ["🐳", "Wal", "whale", "t"], ["🐺", "Wolf", "wolf", "t"], ["🐧", "Pinguin", "penguin", "t"], ["🦒", "Giraffe", "giraffe", "t"], ["🐔", "Huhn", "hen", "t"],
    ["🐬", "Delfin", "dolphin", "t"], ["🦀", "Krabbe", "crab", "t"], ["🐘", "Elefant", "elephant", "t"], ["🦄", "Einhorn", "unicorn", "t"], ["🐉", "Drache", "dragon", "t"],
    ["🏠", "Haus", "house", "d"], ["🚗", "Auto", "car", "d"], ["🚌", "Bus", "bus", "d"], ["🚂", "Zug", "train", "d"], ["🚲", "Rad", "bike", "d"],
    ["⛵", "Boot", "boat", "d"], ["🚀", "Rakete", "rocket", "d"], ["⚽", "Ball", "ball", "d"], ["🎩", "Hut", "hat", "d"], ["👟", "Schuh", "shoe", "d"],
    ["🧦", "Socke", "sock", "d"], ["🛏️", "Bett", "bed", "d"], ["📖", "Buch", "book", "d"], ["☕", "Tasse", "cup", "d"], ["🌙", "Mond", "moon", "d"],
    ["⭐", "Stern", "star", "d"], ["☀️", "Sonne", "sun", "d"], ["🌳", "Baum", "tree", "d"], ["🌸", "Blume", "flower", "d"], ["👃", "Nase", "nose", "d"],
    ["👂", "Ohr", "ear", "d"], ["✋", "Hand", "hand", "d"], ["🦷", "Zahn", "tooth", "d"], ["❤️", "Herz", "heart", "d"], ["🔑", "Schlüssel", "key", "d"],
    ["⏰", "Uhr", "clock", "d"], ["🎁", "Geschenk", "gift", "d"], ["🔥", "Feuer", "fire", "d"], ["🌈", "Regenbogen", "rainbow", "d"], ["☂️", "Schirm", "umbrella", "d"],
    ["👑", "Krone", "crown", "d"], ["🎈", "Ballon", "balloon", "d"], ["🧸", "Teddy", "teddy", "d"], ["🏰", "Burg", "castle", "d"], ["🪑", "Stuhl", "chair", "d"],
    ["🚪", "Tür", "door", "d"], ["🍄", "Pilz", "mushroom", "d"],
    ["🍎", "Apfel", "apple", "e"], ["🍌", "Banane", "banana", "e"], ["🍓", "Erdbeere", "strawberry", "e"], ["🍕", "Pizza", "pizza", "e"], ["🍦", "Eis", null, "e"],
    ["🥚", "Ei", "egg", "e"], ["🧀", "Käse", "cheese", "e"], ["🍞", "Brot", "bread", "e"], ["🥛", "Milch", "milk", "e"], ["🍪", "Keks", "cookie", "e"],
    ["🎂", "Kuchen", "cake", "e"], ["🍅", "Tomate", "tomato", "e"], ["🥕", "Karotte", "carrot", "e"], ["🍋", "Zitrone", "lemon", "e"], ["🍇", "Trauben", "grapes", "e"],
    ["🧁", "Muffin", "muffin", "e"], ["🍯", "Honig", "honey", "e"], ["🍉", "Melone", "melon", "e"], ["🍩", "Donut", "donut", "e"]
  ],
  STOLPER: {
    de: ["sch", "ch", "ck", "ie", "ei", "eu", "äu", "au", "pf", "tz", "ng", "qu", "ä", "ö", "ü", "ah", "eh", "ih", "oh", "uh"],
    en: ["sh", "ch", "th", "ck", "ee", "oo", "ea", "ai", "ay", "ow", "ou", "ir", "er", "ar", "or", "wh", "igh", "oe", "ey"]
  },
  RUNDE: 5, MAX: 6, nr: 0, gut: 0, a: null, pos: 0, fehler: 0, erster: true, frei: false, zuletzt: [], stufenCache: {},

  schluessel: function () { return "bauen_" + LERNEN.sprache; },
  stand: function () { return LERNEN.lies(this.schluessel(), { stufe: 2 }); },
  schwierigkeit: function (w, spr) {
    var s = w.toLowerCase(), n = s.length, extra = 0;
    this.STOLPER[spr].forEach(function (m) { var i = s.indexOf(m); while (i >= 0) { extra++; i = s.indexOf(m, i + m.length); } });
    for (var i = 1; i < n; i++) if (s[i] === s[i - 1]) extra++;                       // Doppelbuchstaben
    if (spr === "en" && /[^aeiou]e$/.test(s) && n > 3) extra++;                         // stummes e (cake, snake)
    return n + 1.5 * extra;
  },
  // Woerter der Sprache in 5 gleich grosse Gruppen nach Schwierigkeit
  stufen: function (spr) {
    if (this.stufenCache[spr]) return this.stufenCache[spr];
    var self = this, idx = spr === "en" ? 2 : 1;
    var l = this.KONZEPTE.filter(function (k) { return k[idx]; }).map(function (k) { return { bild: k[0], wort: k[idx], de: k[1], en: k[2], art: k[3], s: self.schwierigkeit(k[idx], spr) }; });
    l.sort(function (x, y) { return x.s - y.s; });
    var g = [[], [], [], [], []];
    l.forEach(function (k, i) { g[Math.min(4, Math.floor(i * 5 / l.length))].push(k); });
    return (this.stufenCache[spr] = g);
  },

  start: function () {
    this.nr = 0; this.gut = 0;
    LERNEN.zeige("bauen"); LERNEN.punkte(0);
    var m = LERNEN.el("baMampfi");
    if (!m.querySelector("svg")) { MAMPFI.einsetzen(m); m.onclick = function () { MAMPFI.kitzeln(m); }; }
    LERNEN.el("baBild").onclick = function () { TOENE.tipp(); if (BAUEN.a) LERNEN.sagNur(BAUEN.wortTeil()); };
    this.neu();
  },
  neu: function () {
    var spr = LERNEN.sprache, W = LERNEN.W(), stufe = Math.min(this.MAX, Math.max(1, this.stand().stufe)), g = this.stufen(spr);
    var gruppe = stufe >= 6 ? g[2].concat(g[3], g[4]) : (Math.random() < 0.7 || stufe === 1 ? g[stufe - 1] : g[Math.floor(Math.random() * (stufe - 1))]);
    var self = this, kand = gruppe.filter(function (k) { return self.zuletzt.indexOf(k.wort) < 0; });
    if (!kand.length) kand = gruppe;
    var k = LERNEN.zufall(kand), nm = LERNEN.einstellung().name;
    if (nm && stufe >= 2 && Math.random() < 0.15 && this.zuletzt.indexOf(nm) < 0 && this.nameGeht(nm)) k = { bild: "🧒", wort: nm, art: "n", name: true };
    this.zuletzt.push(k.wort); if (this.zuletzt.length > 10) this.zuletzt.shift();
    this.a = k; this.pos = 0; this.fehler = 0; this.erster = true; this.frei = true; this.tastatur = stufe >= 6;

    LERNEN.el("baBild").textContent = k.bild;
    LERNEN.el("baBild").classList.remove("weg-geflogen");
    var text = k.name ? ANSAGE.SAETZE.bauenName() : ANSAGE.SAETZE.bauen(k.art, k.wort), wk = ANSAGE.w(k.wort).k;
    LERNEN.el("baText").textContent = (k.name ? "🧒 " : "") + ANSAGE.text(text.map(function (p) { return p.k === wk ? k.bild + (p.z || "") : p; }));
    LERNEN.el("baUebers").innerHTML = "&nbsp;";
    // Felder
    var felder = LERNEN.el("baFelder"), n = k.wort.length;
    felder.innerHTML = ""; felder.style.setProperty("--n", n);
    for (var i = 0; i < n; i++) { var f = document.createElement("div"); f.className = "feld"; felder.appendChild(f); }
    // Kaertchen oder Tastatur
    var box = LERNEN.el("baKarten");
    box.innerHTML = ""; box.className = this.tastatur ? "karten-box tastatur" : "karten-box";
    if (this.tastatur) {
      var abc = "abcdefghijklmnopqrstuvwxyz" + (spr === "de" ? "äöü" : "");
      abc.split("").forEach(function (b) { box.appendChild(self.karte(b)); });
    } else {
      var falsch = stufe >= 3 ? stufe - 2 : 0, zeichen = k.wort.split(""), pool = "abcdefghiklmnoprstuwz".split("").filter(function (b) { return k.wort.toLowerCase().indexOf(b) < 0; });
      LERNEN.mische(pool);
      zeichen = zeichen.concat(pool.slice(0, falsch));
      var versuch = 0;
      do { LERNEN.mische(zeichen); } while (zeichen.join("") === k.wort && ++versuch < 10);
      zeichen.forEach(function (b) { box.appendChild(self.karte(b)); });
    }
    MAMPFI.ruhe(LERNEN.el("baMampfi"), k.art === "e" ? "offen" : null);
    LERNEN.sag(text);
  },
  karte: function (b) {
    var self = this, el = document.createElement("button");
    el.className = "karte-b"; el.setAttribute("data-z", b); el.innerHTML = SCHRIFT.svgEins(b);
    el.onclick = function () { self.tipp(b, el); };
    return el;
  },
  tipp: function (b, el) {
    if (!this.frei || el.classList.contains("benutzt")) return;
    var soll = this.a.wort[this.pos];
    var passt = this.tastatur ? b === soll.toLowerCase() : b === soll;
    if (passt) {
      var felder = LERNEN.el("baFelder").children, f = felder[this.pos];
      f.innerHTML = SCHRIFT.svgEins(soll); f.classList.add("voll");
      if (!this.tastatur) el.classList.add("benutzt");
      else { el.classList.add("gedrueckt"); setTimeout(function () { el.classList.remove("gedrueckt"); }, 200); }
      LERNEN.el("baKarten").querySelectorAll(".tipp").forEach(function (t) { t.classList.remove("tipp"); });
      TOENE.pling(this.pos); this.pos++; this.fehler = 0;
      if (this.pos >= this.a.wort.length) this.fertig();
    } else {
      this.erster = false; this.fehler++;
      el.classList.remove("wackelt"); void el.offsetWidth; el.classList.add("wackelt");
      TOENE.falsch();
      if (this.fehler === 1) MAMPFI.wundert(LERNEN.el("baMampfi"));
      if (this.fehler >= 2) {                                        // Hilfe: das passende Kaertchen leuchtet
        var ziel = this.tastatur ? soll.toLowerCase() : soll, k = LERNEN.el("baKarten").querySelectorAll(".karte-b");
        for (var i = 0; i < k.length; i++) if (k[i].getAttribute("data-z") === ziel && !k[i].classList.contains("benutzt")) { k[i].classList.add("tipp"); break; }
        LERNEN.sagNur(this.wortTeil());
      }
    }
  },
  fertig: function () {
    var a = this.a, W = LERNEN.W(), m = LERNEN.el("baMampfi"), bild = LERNEN.el("baBild"), andereSpr = LERNEN.sprache === "de" ? "en" : "de";
    this.frei = false; if (this.erster) this.gut++;
    this.nr++; LERNEN.punkte(this.nr);
    LERNEN.el("baFelder").classList.add("geschafft");
    setTimeout(function () { LERNEN.el("baFelder").classList.remove("geschafft"); }, 900);
    TOENE.richtig();
    var anders = a.name ? null : a[andereSpr];
    LERNEN.el("baUebers").innerHTML = anders ? '<button class="uebers" data-spr="' + andereSpr + '">' + (andereSpr === "en" ? "🇬🇧 " : "🇩🇪 ") + anders + " 🔊</button>" : "&nbsp;";
    var ub = LERNEN.el("baUebers").querySelector(".uebers");
    if (ub) ub.onclick = function () { TOENE.tipp(); LERNEN.sprich([ANSAGE.w(anders, andereSpr)], andereSpr); };
    if (a.art === "e") {
      LERNEN.fliege(bild, m, 650, function () { bild.classList.add("weg-geflogen"); MAMPFI.frisst(m, Math.random() < 0.35); });
    } else { MAMPFI.jubelt(m); LERNEN.konfetti(18, bild); }
    var p = LERNEN.sagNur([LERNEN.lob(), ANSAGE.ende(this.wortTeil(), ".")]);
    LERNEN.nachAnsage(p, function () { BAUEN.weiter(); }, 1300);
  },
  weiter: function () { if (this.nr >= this.RUNDE) this.ende(); else this.neu(); },
  wortTeil: function () { return this.a.name ? [ANSAGE.name()] : [ANSAGE.w(this.a.wort)]; },
  nameGeht: function (nm) { return nm.length >= 2 && nm.length <= 10 && nm.split("").every(function (z) { return !!SCHRIFT.Z[z]; }); },
  ende: function () {
    var st = this.stand();
    if (this.gut >= 4 && st.stufe < this.MAX) st.stufe++;
    else if (this.gut <= 2 && st.stufe > 1) st.stufe--;
    LERNEN.schreib(this.schluessel(), st);
    LERNEN.belohnung("bauen", function () { BAUEN.start(); });
  }
};
