// ansage.js — Alles, was die Kinderecke sagt, als Liste von Teilen. Jeder Teil hat einen Schluessel (fuer eigene Aufnahmen) und einen Text
// (fuer die Handystimme). Sind alle Teile eines Satzes aufgenommen, spielt STIMMBANK sie hintereinander ab, sonst spricht die Handystimme den ganzen Satz.
// Schluessel: "de|s|baBau" Satzteil, "de|w|Pizza" Wort, "de|z|7" Zahl, "de|b|M" Buchstabenname, "name" Name des Kindes (in beiden Sprachen gleich).
// Hier steht nichts Persoenliches: der Name kommt aus den Einstellungen auf dem Geraet. Kein Modul; globales Objekt ANSAGE.

var ANSAGE = {
  // Satzteile je Sprache, nach Gruppen (Reihenfolge = Reihenfolge auf der Aufnahmeseite). Listen werden als Schluessel.0, .1, ... aufgenommen.
  TEILE: {
    de: {
      "Allgemein": { lob: ["Super!", "Toll!", "Prima!", "Richtig!", "Sehr gut!"], nochmal: "Probier's nochmal.", zaehlTipp: "Tipp die Bilder an und zähl mit.",
        rundeA: "Super gemacht!", rundeB: "Du hast einen Stern bekommen.", hallo: "Hallo", wasSpielen: "Was spielen wir heute?", sprache: "Deutsch" },
      "Mampfi": { mHallo: ["Hallo! Ich bin Mampfi!", "Hast du was zu essen für mich?", "Kitzel mich nicht! Hihi!", "Ich hab so einen Hunger!", "Spielen wir was?"],
        mLecker: ["Mampf, mampf!", "Lecker!", "Hmmm, köstlich!", "Mehr davon!", "Njam njam!"], mRuelps: ["Rülps! Oh, Entschuldigung!", "Hupps! Pardon!", "Bäärp! Hihi!"],
        mJubel: ["Juhu!", "Hurra!", "Du bist super!", "Wahnsinn!", "Yippie!"], mUps: ["Hä?", "Hmm, komisch.", "Ups!", "Das schmeckt seltsam.", "Nochmal!"] },
      "Wörter bauen": { baHunger: "Mampfi hat Hunger auf", baWunsch: "Mampfi wünscht sich:", baSucht: "Mampfi sucht:", baBau: "Bau das Wort!", baName: "Bau deinen Namen!" },
      "Rechnen": { reFrage: "Wie viel ist", plus: "plus", minus: "minus", ist: "ist",
        fuHat: "Mampfi hat", fuFrisst: "Er frisst", fuBringt: "bringt noch", fuDu: "Du gibst ihm noch", fuDazu: "dazu.",
        fuFragePlus: "Wie viele hat Mampfi jetzt?", fuFrageMinus: "Wie viele bleiben übrig?", helfer: ["Oma", "Papa", "Der Igel", "Das Eichhörnchen"] },
      "Uhr": { uhUm: "Um", uhStell: "Stell die Uhr auf", uhLesen: "Mampfi fragt: Wie spät ist es?", uhEsIst: "Es ist",
        uhMinuten: "Schau auf den großen Zeiger. Er zeigt die Minuten.", uhStunde: "Schau auf den kleinen Zeiger. Er zeigt die Stunde.",
        uhHalbTipp: "Bei halb steht der kleine Zeiger zwischen zwei Zahlen.", uhUhr: "Uhr", uhEinUhr: "ein Uhr", uhHalb: "halb",
        uhViertelNach: "Viertel nach", uhViertelVor: "Viertel vor", uhViertel: "viertel", uhDreiviertel: "dreiviertel", uhNach: "nach", uhVor: "vor",
        uhVorHalb: "vor halb", uhNachHalb: "nach halb",
        tag: ["geht Mampfi schwimmen.", "geht Mampfi in den Kindergarten.", "geht Mampfi auf den Spielplatz.", "isst Mampfi ein Eis.", "geht Mampfi schlafen.",
          "spielt Mampfi Fußball.", "besucht Mampfi die Oma.", "geht Mampfi einkaufen.", "badet Mampfi.", "isst Mampfi Pizza."] },
      "Anlaute und Spuren": { anFrageA: "Mit welchem Buchstaben fängt", anFrageB: "an?", anRichtigA: "fängt mit", anRichtigB: "an.",
        spGross: "Fahr das große", spKlein: "Fahr das kleine", spNach: "nach.", spWie: "wie" }
    },
    en: {
      "Allgemein": { lob: ["Great!", "Well done!", "Super!", "Yes!", "Brilliant!"], nochmal: "Try again.", zaehlTipp: "Tap the pictures and count.",
        rundeA: "Well done!", rundeB: "You got a star.", hallo: "Hello", wasSpielen: "What shall we play today?", sprache: "English" },
      "Mampfi": { mHallo: ["Hello! I'm Mampfi!", "Do you have some food for me?", "Don't tickle me! Hee hee!", "I'm so hungry!", "Shall we play?"],
        mLecker: ["Yum yum!", "Delicious!", "Mmm, tasty!", "More, please!", "Nom nom!"], mRuelps: ["Burp! Oops, excuse me!", "Whoops! Pardon me!", "Buuurp! Hee hee!"],
        mJubel: ["Hooray!", "Yippee!", "You're super!", "Amazing!", "Woohoo!"], mUps: ["Huh?", "Hmm, funny.", "Oops!", "That tastes strange.", "Try again!"] },
      "Wörter bauen": { baHunger: "Mampfi wants to eat:", baWunsch: "Mampfi wants:", baSucht: "Mampfi is looking for:", baBau: "Build the word!", baName: "Build your name!" },
      "Rechnen": { reFrage: "What is", plus: "plus", minus: "minus", ist: "is",
        fuHat: "Mampfi has", fuFrisst: "He eats", fuBringt: "brings him", fuDu: "You give him", fuDazu: "more.",
        fuFragePlus: "How many does Mampfi have now?", fuFrageMinus: "How many are left?", helfer: ["Grandma", "Dad", "The hedgehog", "The squirrel"] },
      "Uhr": { uhUm: "At", uhStell: "Set the clock to", uhLesen: "Mampfi asks: What time is it?", uhEsIst: "It's",
        uhMinuten: "Look at the long hand. It shows the minutes.", uhStunde: "Look at the short hand. It shows the hour.",
        uhHalbTipp: "At half past, the short hand is between two numbers.", uhUhr: "o'clock", uhEinUhr: "", uhHalb: "half past",
        uhViertelNach: "quarter past", uhViertelVor: "quarter to", uhViertel: "", uhDreiviertel: "", uhNach: "past", uhVor: "to",
        uhVorHalb: "", uhNachHalb: "",
        tag: ["Mampfi goes swimming.", "Mampfi goes to kindergarten.", "Mampfi goes to the playground.", "Mampfi eats an ice cream.", "Mampfi goes to bed.",
          "Mampfi plays football.", "Mampfi visits Grandma.", "Mampfi goes shopping.", "Mampfi has a bath.", "Mampfi eats pizza."] },
      "Anlaute und Spuren": { anFrageA: "Which letter does", anFrageB: "start with?", anRichtigA: "starts with", anRichtigB: "",
        spGross: "Trace the big letter", spKlein: "Trace the small letter", spNach: "", spWie: "is for" }
    }
  },
  flach: {},                                        // "de|s|lob.0" -> { t, gruppe }

  init: function () {
    var self = this;
    ["de", "en"].forEach(function (spr) {
      var g = self.TEILE[spr];
      Object.keys(g).forEach(function (gruppe) {
        Object.keys(g[gruppe]).forEach(function (k) {
          var v = g[gruppe][k];
          if (Array.isArray(v)) v.forEach(function (t, i) { self.flach[spr + "|s|" + k + "." + i] = { t: t, gruppe: gruppe }; });
          else self.flach[spr + "|s|" + k] = { t: v, gruppe: gruppe };
        });
      });
    });
  },
  spr: function (s) { return s || LERNEN.sprache; },

  // ---- Bausteine ----
  s: function (k, i, spr) {
    spr = this.spr(spr);
    var key = spr + "|s|" + k + (i === undefined || i === null ? "" : "." + i), e = this.flach[key];
    if (!e || !e.t) return null;                    // leere Teile (z. B. englisch ohne "nach.") fallen weg
    return { k: key, t: e.t };
  },
  zufall: function (k, spr) {
    spr = this.spr(spr);
    var n = 0; while (this.flach[spr + "|s|" + k + "." + n]) n++;
    return this.s(k, Math.floor(Math.random() * Math.max(1, n)), spr);
  },
  w: function (wort, spr) { return { k: this.spr(spr) + "|w|" + wort, t: wort }; },
  z: function (n, spr) { return { k: this.spr(spr) + "|z|" + n, t: String(n) }; },
  b: function (L, spr) { spr = this.spr(spr); return { k: spr + "|b|" + L, t: WOERTER[spr].namen[L] }; },
  name: function () { var n = LERNEN.einstellung().name; return n ? { k: "name", t: n } : null; },
  // Satzzeichen nur fuer Anzeige und Handystimme anhaengen (die Aufnahme bleibt dieselbe)
  mit: function (teil, zeichen) { return teil ? { k: teil.k, t: teil.t, z: zeichen } : null; },
  ende: function (liste, zeichen) { var l = liste.slice(); if (l.length) l[l.length - 1] = this.mit(l[l.length - 1], zeichen); return l; },
  // Teile zusammensetzen: verschachtelte Listen flach machen, leere Teile weglassen
  satz: function () {
    var aus = [];
    var dazu = function (x) { if (!x) return; if (Array.isArray(x)) x.forEach(dazu); else aus.push(x); };
    for (var i = 0; i < arguments.length; i++) dazu(arguments[i]);
    return aus;
  },
  text: function (teile) {
    if (typeof teile === "string") return teile;
    return teile.map(function (p, i) {
      if (typeof p === "string") return p;
      if (p.z) return p.t + p.z;
      if (p.k === "name" && i < teile.length - 1 && !/[.!?,:]$/.test(p.t)) return p.t + "!";   // nach dem Namen eine kleine Pause
      return p.t;
    }).join(" ").replace(/\s+([.,!?:])/g, "$1").replace(/\s+/g, " ").trim();
  },
  lob: function () { var n = this.name(); return this.satz(this.zufall("lob"), n && Math.random() < 0.35 ? n : null); },

  // ---- Alle Saetze der Spiele (gleich aufgebaut in beiden Sprachen) ----
  SAETZE: {
    anlautFrage: function (w) { var A = ANSAGE; return A.satz(A.s("anFrageA"), A.w(w), A.s("anFrageB")); },
    anlautRichtig: function (w, L) { var A = ANSAGE, e = A.s("anRichtigB"); return A.satz(A.w(w), A.s("anRichtigA"), e ? A.b(L) : A.mit(A.b(L), "."), e); },
    nochmal: function () { return [ANSAGE.s("nochmal")]; },
    nochmalWort: function (w) { var A = ANSAGE; return A.satz(A.s("nochmal"), A.mit(A.w(w), ".")); },
    zaehlTipp: function () { return [ANSAGE.s("zaehlTipp")]; },
    spurenStart: function (L, klein) { var A = ANSAGE, e = A.s("spNach"); return A.satz(A.s(klein ? "spKlein" : "spGross"), e ? A.b(L) : A.mit(A.b(L), "."), e); },
    spurenFertig: function (L, w) { var A = ANSAGE; return A.ende(A.satz(A.lob(), A.b(L), w ? [A.s("spWie"), A.w(w)] : null), "."); },
    rechnenFrage: function (a, op, b) { var A = ANSAGE; return A.satz(A.s("reFrage"), A.z(a), A.s(op === "+" ? "plus" : "minus"), A.mit(A.z(b), "?")); },
    rechnenRichtig: function (a, op, b, c) { var A = ANSAGE; return A.satz(A.z(a), A.s(op === "+" ? "plus" : "minus"), A.z(b), A.s("ist"), A.mit(A.z(c), ".")); },
    bauen: function (art, w) { var A = ANSAGE; return A.satz(A.s(art === "e" ? "baHunger" : art === "t" ? "baWunsch" : "baSucht"), A.mit(A.w(w), art === "t" ? "!" : "."), A.s("baBau")); },
    bauenName: function () { return [ANSAGE.s("baName")]; },
    fuetternMinus: function (a, essen, b) { var A = ANSAGE; return A.satz(A.s("fuHat"), A.z(a), A.mit(A.w(essen), "."), A.s("fuFrisst"), A.mit(A.z(b), ".")); },
    fuetternPlus: function (a, essen, helferNr, b) {           // helferNr -1 = "Du"
      var A = ANSAGE;
      return A.satz(A.s("fuHat"), A.z(a), A.mit(A.w(essen), "."), helferNr < 0 ? A.s("fuDu") : [A.s("helfer", helferNr), A.s("fuBringt")], A.z(b), A.s("fuDazu"));
    },
    fuetternFrage: function (op) { return [ANSAGE.s(op === "+" ? "fuFragePlus" : "fuFrageMinus")]; },
    uhrStellen: function (zeit, tagNr) { var A = ANSAGE; return A.satz(A.s("uhUm"), zeit, A.s("tag", tagNr), A.s("uhStell"), A.ende(zeit, "!")); },
    uhrLesen: function () { return [ANSAGE.s("uhLesen")]; },
    uhrRichtig: function (zeit) { var A = ANSAGE; return A.satz(A.lob(), A.s("uhEsIst"), A.ende(zeit, ".")); },
    uhrHinweis: function (minuten, halb) { var A = ANSAGE; return A.satz(A.s(minuten ? "uhMinuten" : "uhStunde"), halb ? A.s("uhHalbTipp") : null); },
    runde: function () { var A = ANSAGE; return A.satz(A.s("rundeA"), A.name(), A.s("rundeB")); },
    hallo: function () { var A = ANSAGE, n = A.name(); return n ? A.satz(A.s("hallo"), n, A.s("wasSpielen")) : null; },
    sprache: function () { return [ANSAGE.s("sprache")]; }
  },

  // ---- Alles, was aufgenommen werden kann (fuer die Aufnahmeseite) ----
  katalog: function (spr) {
    var self = this, l = [], gesehen = {};
    var dazu = function (k, t, gruppe, hinweis) { if (!t || gesehen[k]) return; gesehen[k] = 1; l.push({ k: k, t: t, gruppe: gruppe, hinweis: hinweis || "" }); };
    var n = this.name();
    if (n) dazu("name", n.t, "Name");
    Object.keys(this.flach).forEach(function (k) { if (k.indexOf(spr + "|s|") === 0) dazu(k, self.flach[k].t, self.flach[k].gruppe); });
    var woerter = [];
    Object.keys(WOERTER[spr].woerter).forEach(function (B) { WOERTER[spr].woerter[B].forEach(function (w) { woerter.push(w[0]); }); });
    BAUEN.KONZEPTE.forEach(function (k) { var w = k[spr === "en" ? 2 : 1]; if (w) woerter.push(w); });
    FUETTERN.ESSEN.forEach(function (e) { woerter.push(spr === "en" ? e[2] : e[1]); });
    woerter.sort(function (a, b) { return a.localeCompare(b, spr); }).forEach(function (w) { dazu(spr + "|w|" + w, w, "Wörter"); });
    for (var z = 0; z <= 30; z++) dazu(spr + "|z|" + z, String(z), "Zahlen", spr === "de" && z === 1 ? "als „eins“ sprechen" : "");
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (B) { dazu(spr + "|b|" + B, WOERTER[spr].namen[B], "Buchstaben", "Buchstabe " + B); });
    return l;
  }
};
ANSAGE.init();
