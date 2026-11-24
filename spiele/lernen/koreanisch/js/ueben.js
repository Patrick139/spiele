// ueben.js — Themenübungen: ein Thema (eine Lektion, eine Grammatikregel, die gemerkten oder die schwierigen Karten) gezielt üben.
// Kein Modul; globales Objekt UE (Aufgaben zusammenstellen) und Ergänzungen an UI (Ansichten ueben, thema, uebung) und UI.akt.
// Wird nach ansicht.js geladen.
//
// Die Übungen sind vom Lernstand der Lernkarten unabhängig: Sie lesen ihn nicht (außer für „Schwierige Karten“) und ändern
// keine Wiederholungsabstände. Gemerkt wird nur je Thema das letzte Ergebnis (stand.ueb), damit die Liste zeigt, was schon geübt wurde.
//
// Aufgabenarten: wort (Koreanisch → Bedeutung wählen), wortUm (Deutsch → Koreanisch wählen), hoer (anhören → Bedeutung wählen),
// luecke (fehlendes Wort im Satz), bau (Satz aus Teilen), gram (markierte Stelle eines Grammatikbeispiels einsetzen), karte (aufdecken, selbst einschätzen).
var UE = {
  ARTEN: [
    ["misch", "Gemischt", "quer durch Wörter, Sätze und Grammatik"],
    ["wort", "Wörter", "Koreanisch lesen, Bedeutung wählen"],
    ["wortUm", "Wörter umgekehrt", "Deutsch lesen, Koreanisch wählen"],
    ["hoer", "Hören", "anhören, Bedeutung wählen"],
    ["luecke", "Lückensätze", "das fehlende Wort einsetzen"],
    ["bau", "Sätze bauen", "Teile in die richtige Reihenfolge bringen"],
    ["gram", "Grammatik", "die fehlende Form einsetzen"],
    ["karte", "Karten durchgehen", "aufdecken und selbst einschätzen"]
  ],
  LAENGEN: [[10, "Kurz · 10"], [20, "Normal · 20"], [0, "Alles"]],
  KLAMMER: /\[([^\]]+)\]/,

  // ---------- Thema ----------
  // Liefert { id, titel, w: Wörter, s: Sätze, g: Grammatikbeispiele mit markierter Stelle, lek: Lektion oder null }
  thema: function (id) {
    var w = [], s = [], g = [], titel = "", lek = null, self = this;
    var nimm = function (d) { if (d && d.typ === "s") s.push(d); else if (d && d.typ === "w") w.push(d); };
    var beispiele = function (r) { r.bsp.forEach(function (b) { if (self.KLAMMER.test(b.roh)) g.push(b); }); };
    if (KO.lektionen[id]) {
      lek = KO.lektionen[id]; titel = lek.titel; lek.dinge.forEach(nimm);
      KO.regeln.forEach(function (r) { if (r.lek === id) beispiele(r); });
    } else if (id === "gemerkt") {
      titel = "Gemerkt ★"; Object.keys(KO.stand.gemerkt).forEach(function (x) { nimm(KO.ding(x)); });
    } else if (id === "schwer") {
      titel = "Schwierige Karten"; var da = {};
      Object.keys(KO.stand.karten).forEach(function (k) { var x = k.split(":")[0]; if (KO.stand.karten[k].x >= 2 && !da[x]) { da[x] = 1; nimm(KO.ding(x)); } });
    } else if (id === "grund") {
      titel = "Grammatik: Grundlagen"; KO.regeln.forEach(function (r) { if (r.art === "grund") beispiele(r); });
    } else if (id.slice(0, 2) === "r:" && KO.regel[id.slice(2)]) {
      var r = KO.regel[id.slice(2)]; titel = r.titel; beispiele(r); lek = r.lek ? KO.lektionen[r.lek] : null;
    } else return null;
    return { id: id, titel: titel, w: w, s: s, g: g, lek: lek, regel: id.slice(0, 2) === "r:" ? id.slice(2) : "" };
  },
  // Welche Übungsarten ein Thema hergibt
  moeglich: function (T, art) {
    var lang = function (min) { return T.s.filter(function (d) { return KO.teile(d.ko).length >= min; }).length; };
    if (art === "wort" || art === "wortUm") return T.w.length > 0;
    if (art === "hoer" || art === "karte") return T.w.length + T.s.length > 0;
    if (art === "luecke") return lang(2) > 0;
    if (art === "bau") return lang(3) > 0;
    if (art === "gram") return T.g.length > 0;
    return T.w.length + T.s.length + T.g.length > 0;     // misch
  },

  // ---------- falsche Antworten ----------
  // n verschiedene Werte des Felds (ko oder de) aus anderen Einträgen; zuerst aus dem Thema, dann aus der Lektion, dann aus allem.
  // Bei Wörtern bevorzugt dieselbe Art (Verb zu Verb), damit die Auswahl nicht schon an der Form zu erraten ist.
  andere: function (d, feld, T, n) {
    var self = this, aus = [], da = {}; da[d[feld]] = 1;
    var gleicheArt = function (x) { return x.typ === d.typ && x.id !== d.id && (d.typ !== "w" || !!x.form === !!d.form); };
    var nimm = function (liste, streng) {
      KO.mische(liste).forEach(function (x) {
        if (aus.length >= n || !x || x.typ !== d.typ || x.id === d.id || da[x[feld]] || x.ko === d.ko || x.de === d.de) return;
        if (streng && !gleicheArt(x)) return;
        da[x[feld]] = 1; aus.push(x[feld]);
      });
    };
    var thema = d.typ === "s" ? T.s : T.w, lek = d.lek && KO.lektionen[d.lek] ? KO.lektionen[d.lek].dinge : [];
    var alle = function () { return Object.keys(KO.dinge).map(function (id) { return KO.dinge[id]; }); };
    nimm(thema, true); if (aus.length < n) nimm(lek, true);
    if (aus.length < n) nimm(thema, false); if (aus.length < n) nimm(lek, false);
    if (aus.length < n) nimm(alle(), true); if (aus.length < n) nimm(alle(), false);
    return aus;
  },
  // Grammatik: andere markierte Stellen, zuerst aus derselben Regel (das ist der Gegensatz, um den es geht), dann aus der Lektion, dann aus allem
  andereFormen: function (b, richtig, n) {
    var self = this, aus = [], da = {}; da[richtig] = 1;
    var regelId = b.id.replace(/b\d+$/, ""), regel = KO.regel[regelId];
    var nimm = function (regeln, hoechstens) {
      var topf = [];
      regeln.forEach(function (r) { r.bsp.forEach(function (x) { var re = /\[([^\]]+)\]/g, t; while ((t = re.exec(x.roh))) if (!da[t[1]]) { da[t[1]] = 1; topf.push(t[1]); } }); });
      KO.mische(topf).slice(0, hoechstens).forEach(function (x) { if (aus.length < n) aus.push(x); });
    };
    if (regel) nimm([regel], 2);
    if (aus.length < n && regel && regel.lek) nimm(KO.regeln.filter(function (r) { return r.lek === regel.lek && r !== regel; }), n - aus.length);
    if (aus.length < n) nimm(KO.regeln, n - aus.length);
    return aus;
  },

  // ---------- Aufgaben ----------
  aufgabe: function (art, d, T) {
    var a = { art: art, d: d };
    if (art === "wort" || art === "hoer") { a.richtig = d.de; a.wahl = KO.mische([d.de].concat(this.andere(d, "de", T, 3))); }
    else if (art === "wortUm") { a.richtig = d.ko; a.wahl = KO.mische([d.ko].concat(this.andere(d, "ko", T, 3))); }
    else if (art === "luecke") { a.L = KO.luecke(d, Math.floor(Math.random() * 6)); a.richtig = a.L.richtig; a.wahl = a.L.wahl; }
    else if (art === "bau") { a.B = KO.bau(d); a.gelegt = []; }
    else if (art === "gram") {
      var m = this.KLAMMER.exec(d.roh);
      a.richtig = m[1]; a.vor = KO.ohneKlammern(d.roh.slice(0, m.index)); a.nach = KO.ohneKlammern(d.roh.slice(m.index + m[0].length));
      a.wahl = KO.mische([a.richtig].concat(this.andereFormen(d, a.richtig, 3)));
    }
    return a;
  },
  // Stellt die Aufgaben einer Übung zusammen. n = 0 heißt alles.
  baue: function (T, art, n) {
    var self = this, aus = [], m = KO.mische.bind(KO);
    var lang = function (min) { return T.s.filter(function (d) { return KO.teile(d.ko).length >= min; }); };
    var nimm = function (a, liste, anzahl) { m(liste).slice(0, anzahl).forEach(function (d) { aus.push(self.aufgabe(a, d, T)); }); };
    if (art === "wort" || art === "wortUm") nimm(art, T.w, n || T.w.length);
    else if (art === "hoer" || art === "karte") nimm(art, T.w.concat(T.s), n || 999);
    else if (art === "luecke") nimm(art, lang(2), n || 999);
    else if (art === "bau") nimm(art, lang(3), n || 999);
    else if (art === "gram") nimm(art, T.g, n || 999);
    else {
      // Gemischt: jeder Eintrag höchstens einmal, die Art je Eintrag gelost; Anteile ungefähr Wörter 45 %, Sätze 35 %, Grammatik 20 %
      var w = m(T.w), s = m(T.s), g = m(T.g), gesamt = n || (w.length + s.length + g.length);
      var nw = Math.round(gesamt * 0.45), ng = Math.round(gesamt * 0.2), ns = gesamt - nw - ng;
      if (!n) { nw = w.length; ns = s.length; ng = g.length; }
      // was eine Gruppe nicht hergibt, bekommen die anderen
      var fehlt = Math.max(0, nw - w.length) + Math.max(0, ns - s.length) + Math.max(0, ng - g.length);
      nw = Math.min(nw, w.length); ns = Math.min(ns, s.length); ng = Math.min(ng, g.length);
      while (fehlt > 0 && (nw < w.length || ns < s.length || ng < g.length)) {
        if (nw < w.length) { nw++; fehlt--; } if (fehlt > 0 && ns < s.length) { ns++; fehlt--; } if (fehlt > 0 && ng < g.length) { ng++; fehlt--; }
      }
      w.slice(0, nw).forEach(function (d, i) { aus.push(self.aufgabe(["wort", "wortUm", "wort", "hoer"][i % 4], d, T)); });
      s.slice(0, ns).forEach(function (d, i) {
        var t = KO.teile(d.ko).length, a = ["luecke", "bau", "hoer"][i % 3];
        if (a === "bau" && t < 3) a = "luecke"; if (a === "luecke" && t < 2) a = "hoer";
        aus.push(self.aufgabe(a, d, T));
      });
      g.slice(0, ng).forEach(function (d) { aus.push(self.aufgabe("gram", d, T)); });
      aus = m(aus);
    }
    return aus;
  },
  // letztes Ergebnis je Thema
  ergebnis: function (id) { return (KO.stand.ueb || {})[id] || null; },
  vorTagen: function (tag) { var n = KO.heute() - tag; return n <= 0 ? "heute" : n === 1 ? "gestern" : "vor " + n + " Tagen"; }
};

// ================= Ansicht: Themenliste =================
UI.uebStufe = ""; UI.uebSuche = ""; UI.themaId = ""; UI.ueb = null;

UI.themaZeile = function (id, nr, titel, unter) {
  var e = this.esc, r = UE.ergebnis(id);
  return '<button class="zeile lek" data-akt="thema" data-id="' + e(id) + '"><span class="nr">' + nr + '</span><span class="mitte"><b>' + e(titel) + '</b><span class="d kurz">' + e(unter) + '</span></span>' +
    '<span class="rechts"' + (r ? ' title="zuletzt geübt ' + UE.vorTagen(r.t) + '"' : "") + '>' + (r ? r.r + " / " + r.g : "›") + '</span></button>';
};
UI.themenListe = function () {
  var q = this.uebSuche.trim().toLowerCase(), stufe = this.uebStufe, self = this, e = this.esc, h = "";
  if (!q && !stufe) {
    var gem = UE.thema("gemerkt"), schwer = UE.thema("schwer"), z = "";
    if (gem.w.length + gem.s.length) z += this.themaZeile("gemerkt", "★", "Gemerkt", (gem.w.length + gem.s.length) + " Wörter und Sätze mit Stern");
    if (schwer.w.length + schwer.s.length) z += this.themaZeile("schwer", "!", "Schwierige Karten", (schwer.w.length + schwer.s.length) + " Wörter und Sätze, die du öfter nicht gewusst hast");
    z += this.themaZeile("grund", "G", "Grammatik: Grundlagen", "Partikeln, Gegenwart, Sprechstufen, Bindeformen …");
    h += '<h2>Quer durch</h2><div class="liste">' + z + '</div>';
  }
  KO.bloecke.forEach(function (b) {
    if (stufe && b.stufe !== stufe) return;
    var z = b.lektionen.filter(function (l) {
      if (!q) return true;
      var text = l.titel + " " + (l.notiz || []).map(function (n) { return n[0] + " " + n[1]; }).join(" ") + " " + l.dinge.map(function (d) { return d.ko + " " + d.de; }).join(" ");
      return text.toLowerCase().indexOf(q) >= 0;
    }).map(function (l) { return self.themaZeile(l.id, l.nr, l.titel, (l.notiz || []).map(function (n) { return n[0]; }).join(" · ")); }).join("");
    if (z) h += '<h2>' + e(b.titel) + '</h2><div class="liste">' + z + '</div>';
  });
  return h || '<p class="klein">Kein Thema gefunden.</p>';
};
UI.male_ueben = function () {
  var e = this.esc, self = this, stufen = [""];
  KO.bloecke.forEach(function (b) { if (stufen.indexOf(b.stufe) < 0) stufen.push(b.stufe); });
  this.el("v-ueben").innerHTML = '<h1>Üben</h1><p class="klein">Ein Thema gezielt üben, so oft du willst: Wörter, Hören, Lückensätze, Satzbau, Grammatik. ' +
    'Die Lernkarten und ihre Abstände bleiben davon unberührt. Rechts steht dein letztes Ergebnis.</p>' +
    '<div class="reiter" id="uStufen">' + stufen.map(function (s) { return '<button data-akt="uebStufe" data-s="' + s + '"' + (self.uebStufe === s ? ' class="an"' : "") + '>' + (s || "Alle") + '</button>'; }).join("") + '</div>' +
    '<input id="uSuch" type="search" placeholder="Thema suchen, z. B. Arzt, Büro, 병원, weil" value="' + e(this.uebSuche) + '" autocomplete="off"><div id="uListe" style="margin-top:12px">' + this.themenListe() + '</div>';
  var s = this.el("uSuch");
  s.oninput = function () { self.uebSuche = s.value; self.el("uListe").innerHTML = self.themenListe(); };
};

// ================= Ansicht: ein Thema =================
UI.male_thema = function () {
  var T = UE.thema(this.themaId), e = this.esc, E = KO.stand.einst;
  if (!T) { this.zeig("ueben"); return; }
  var r = UE.ergebnis(T.id), teile = [];
  if (T.w.length) teile.push(T.w.length + (T.w.length === 1 ? " Wort" : " Wörter"));
  if (T.s.length) teile.push(T.s.length + (T.s.length === 1 ? " Satz" : " Sätze"));
  if (T.g.length) teile.push(T.g.length + " Grammatikbeispiele");
  var h = '<button class="link" data-akt="nav" data-ziel="ueben">‹ Üben</button>' + (T.lek ? '<div class="etikett">Lektion ' + T.lek.nr + (T.regel ? ' · ' + e(T.lek.titel) : "") + '</div>' : "") + '<h1 class="regeltitel">' + e(T.titel) + '</h1>' +
    '<p class="klein">' + (teile.join(" · ") || "Hier gibt es noch nichts zu üben.") + (r ? '<br>Zuletzt geübt: ' + UE.vorTagen(r.t) + ', ' + r.r + ' von ' + r.g + ' auf Anhieb richtig.' : "") + '</p>';
  h += '<div class="reiter">' + UE.LAENGEN.map(function (l) { return '<button data-akt="uebLaenge" data-n="' + l[0] + '"' + (E.ul === l[0] ? ' class="an"' : "") + '>' + l[1] + '</button>'; }).join("") + '</div>';
  h += '<div class="liste">' + UE.ARTEN.filter(function (a) { return UE.moeglich(T, a[0]); }).map(function (a) {
    return '<button class="zeile lek" data-akt="uebStart" data-art="' + a[0] + '"><span class="mitte"><b>' + a[1] + '</b><span class="d">' + a[2] + '</span></span><span class="pfeil">›</span></button>';
  }).join("") + '</div>';
  if (T.lek) h += '<div class="knopfzeile"><button class="neben" data-akt="lektion" data-id="' + T.lek.id + '">Wörter und Sätze ansehen</button>' +
    (T.regel ? '<button class="neben" data-akt="regel" data-id="' + e(T.regel) + '">Erklärung der Regel</button>' : "") + '</div>';
  this.el("v-thema").innerHTML = h;
};

// ================= Übung =================
UI.starteUebung = function (themaId, art, liste) {
  var T = UE.thema(themaId), nach = !!liste;                 // nach: Nachübung nur der Fehler, zählt nicht als Ergebnis des Themas
  if (!T) return;
  liste = liste || UE.baue(T, art, KO.stand.einst.ul);
  if (!liste.length) return;
  this.themaId = themaId;
  this.ueb = { thema: T, art: art, nach: nach, schlange: liste, gesamt: liste.length, fertig: 0, anhieb: 0, fehler: [], gewusst: [], jetzt: null };
  this.zeig("uebung");
  this.uebNaechste();
};
UI.uebNaechste = function () {
  var U = this.ueb, a = U.schlange.shift();
  if (!a) { this.uebEnde(); return; }
  U.jetzt = a; a.geloest = false; a.offen = false;
  this.maleUebung();
};
UI.uebEtikett = function (a) {
  var name = { wort: "Bedeutung wählen", wortUm: "Deutsch → Koreanisch", hoer: "Hören", luecke: "Lücke füllen", bau: "Satz bauen", gram: "Grammatik", karte: a.d.typ === "s" ? "Satz verstehen" : "Koreanisch → Deutsch" }[a.art];
  return (a.wdh ? "Noch einmal · " : "") + name;
};
UI.maleUebung = function () {
  var U = this.ueb, a = U.jetzt, d = a.d, x = this.esc, gesamt = U.fertig + U.schlange.length + 1, m = KO.stand.gemerkt[d.id];
  var h = '<div class="ekopf"><button class="link" data-akt="uebAbbruch">Beenden</button><div class="fort"><i style="width:' + Math.round(100 * U.fertig / gesamt) + '%"></i></div>' +
    (d.typ === "g" ? "" : '<button class="stern' + (m ? " an" : "") + '" data-akt="merken" data-id="' + d.id + '" aria-label="Merken">' + (m ? "★" : "☆") + '</button>') + '</div>' +
    '<div class="etikett">' + x(this.uebEtikett(a)) + ' <span class="thema">· ' + x(U.thema.titel) + '</span></div><div class="flaeche">';
  var koGross = '<div class="ko' + (d.typ === "w" ? "" : " satz") + '" lang="ko">' + x(d.ko) + '</div>' + (d.form ? '<div class="form">höflich: <span lang="ko">' + x(d.form) + '</span></div>' : "");
  var wahl = function (klasse, sprache) {
    return '<div class="wahl ' + klasse + '">' + a.wahl.map(function (w, i) {
      var k = !a.geloest ? "" : w === a.richtig ? " gut" : i === a.gewaehlt ? " schlecht" : " blass";
      return '<button' + (sprache ? ' lang="ko"' : "") + ' class="' + k + '" data-akt="uebWahl" data-nr="' + i + '"' + (a.geloest ? " disabled" : "") + '><kbd>' + (i + 1) + '</kbd>' + x(w) + '</button>';
    }).join("") + '</div>';
  };
  var loesung = (d.wl ? '<div class="wl">wörtlich: ' + x(d.wl) + '</div>' : "") + (d.hin ? '<div class="wl">' + x(d.hin) + '</div>' : "") + this.tonKnoepfe(d);
  if (a.art === "wort") h += koGross + (d.zusatz ? '<div class="zusatz">' + x(d.zusatz) + '</div>' : "") + this.tonKnoepfe(d) + wahl("de");
  else if (a.art === "hoer") h += (a.geloest ? koGross : '<div class="frage">Was hörst du?</div>') + this.tonKnoepfe(d) + wahl("de");
  else if (a.art === "wortUm") h += '<div class="de gross">' + x(d.de) + '</div>' + (d.zusatz ? '<div class="zusatz">' + x(d.zusatz) + '</div>' : "") + wahl(d.typ === "s" ? "de" : "", true) + (a.geloest ? this.tonKnoepfe(d) : "");
  else if (a.art === "luecke") {
    h += '<div class="de">' + x(d.de) + '</div><div class="ko satz" lang="ko">' + a.L.teile.map(function (t, i) {
      if (i !== a.L.nr) return x(t);
      return (a.geloest ? '<b class="' + (a.ok ? "gut" : "schlecht") + '">' + x(a.L.richtig) + '</b>' : '<span class="leer"></span>') + x(t.slice(KO.ohneZeichen(t).length));
    }).join(" ") + '</div>' + wahl("", true) + (a.geloest ? loesung : "");
  } else if (a.art === "gram") {
    h += '<div class="de">' + x(d.de) + '</div><div class="ko satz" lang="ko">' + x(a.vor) + (a.geloest ? '<b class="' + (a.ok ? "gut" : "schlecht") + '">' + x(a.richtig) + '</b>' : '<span class="leer"></span>') + x(a.nach) + '</div>' +
      wahl("", true) + (a.geloest ? loesung : "");
  } else if (a.art === "bau") {
    h += '<div class="de">' + x(d.de) + '</div>';
    if (!a.geloest) {
      h += '<div class="reihe ziel">' + (a.gelegt.length ? a.gelegt.map(function (nr) { return '<button lang="ko" data-akt="uebZurueck" data-nr="' + nr + '">' + x(a.B.steine[nr]) + '</button>'; }).join("") : '<span class="klein">Tippe die Teile in der richtigen Reihenfolge an.</span>') + '</div>' +
        '<div class="reihe">' + a.B.steine.map(function (s, nr) { return '<button lang="ko" data-akt="uebStein" data-nr="' + nr + '"' + (a.gelegt.indexOf(nr) >= 0 ? ' disabled' : "") + '>' + x(s) + '</button>'; }).join("") + '</div>';
    } else {
      h += '<div class="ko satz ' + (a.ok ? "gut" : "schlecht") + '" lang="ko">' + x(a.gelegt.map(function (nr) { return a.B.steine[nr]; }).join(" ")) + '</div>' +
        (a.ok ? "" : '<div class="klein">Richtig:</div><div class="ko satz" lang="ko">' + x(d.ko) + '</div>') + loesung;
    }
  } else {                                                   // karte
    h += koGross + (d.zusatz ? '<div class="zusatz">' + x(d.zusatz) + '</div>' : "") + (a.offen ? '<hr><div class="de">' + x(d.de) + '</div>' + (d.wl ? '<div class="wl">wörtlich: ' + x(d.wl) + '</div>' : "") : "") + this.tonKnoepfe(d);
  }
  h += '</div><div class="knoepfe">';
  if (a.art === "karte") h += a.offen ? '<button class="schlecht" data-akt="uebSelbst" data-ok="0">Nicht gewusst</button><button class="gut" data-akt="uebSelbst" data-ok="1">Gewusst</button>' : '<button class="haupt" data-akt="uebAuf">Aufdecken</button>';
  else if (a.geloest) {
    if (!a.ok && (a.art === "bau" || a.art === "gram")) h += '<button data-akt="uebDoch">Meine Antwort<small>stimmt auch</small></button>';
    h += '<button class="haupt" data-akt="uebWeiter">Weiter</button>';
  }
  h += '</div>';
  this.el("v-uebung").innerHTML = h;
  // Ton: beim Hören sofort; beim Lesen eines koreanischen Worts, wenn "Ton automatisch" an ist; sonst nach der Antwort
  var sofort = !a.geloest && (a.art === "hoer" || ((a.art === "wort" || a.art === "karte") && !a.offen && KO.stand.einst.auto));
  var danach = a.geloest && a.art !== "wort" && a.art !== "hoer" && KO.stand.einst.auto;
  if (sofort || danach) KO.ton.spiele(d);
};
UI.uebGeloest = function (ok) {
  var U = this.ueb, a = U.jetzt;
  a.geloest = true; a.ok = ok;
  this.maleUebung();
};
UI.uebWeiter = function () {
  var U = this.ueb, a = U.jetzt;
  if (!a.wdh) {
    if (a.ok) { U.anhieb++; U.gewusst.push(a.d); } else U.fehler.push(a.d);
  }
  if (a.ok) U.fertig++;
  else {                                                     // Falsches kommt nach ein paar anderen Aufgaben noch einmal, neu gemischt
    var neu = UE.aufgabe(a.art, a.d, U.thema); neu.wdh = true;
    U.schlange.splice(Math.min(4, U.schlange.length), 0, neu);
  }
  this.uebNaechste();
};
UI.uebEnde = function () {
  var U = this.ueb, T = U.thema, e = this.esc, self = this;
  if (!KO.stand.ueb) KO.stand.ueb = {};
  if (!U.nach) { KO.stand.ueb[T.id] = { t: KO.heute(), r: U.anhieb, g: U.gesamt }; KO.speichere(); }
  var h = '<h1>Übung fertig</h1><div class="karte"><div class="etikett" style="margin-top:0">' + e(T.titel) + '</div><div class="zahlen"><div><b>' + U.anhieb + ' / ' + U.gesamt + '</b><span>auf Anhieb richtig</span></div><div><b>' + U.fehler.length + '</b><span>noch einmal gebraucht</span></div></div>';
  if (U.fehler.length) h += '<button class="haupt" data-akt="uebFehler">Die ' + U.fehler.length + ' Fehler noch einmal üben</button>';
  h += '<button class="' + (U.fehler.length ? "neben" : "haupt") + '" data-akt="uebNochmal">Nochmal, neu gemischt</button><button class="neben" data-akt="thema" data-id="' + e(T.id) + '">Andere Übung zu diesem Thema</button>';
  var folge = KO.lektionsFolge().sort(), i = T.lek && !T.regel ? folge.indexOf(T.lek.id) : -1;
  if (i >= 0 && folge[i + 1]) h += '<button class="neben" data-akt="thema" data-id="' + folge[i + 1] + '">Nächstes Thema: ' + e(KO.lektionen[folge[i + 1]].titel) + '</button>';
  h += '<button class="neben" data-akt="nav" data-ziel="ueben">Zur Themenliste</button></div>';
  // Was auf Anhieb gewusst wurde und noch keine Lernkarte ist, lässt sich als bekannt eintragen (dann kommt es nicht mehr als neue Karte)
  var neuBekannt = U.gewusst.filter(function (d) { return d.typ !== "g" && !d.eigen && !KO.gelernt(d); });
  if (neuBekannt.length) {
    U.neuBekannt = neuBekannt.map(function (d) { return d.id; });
    h += '<div class="karte hinweis"><b>' + neuBekannt.length + (neuBekannt.length === 1 ? " Eintrag, den" : " Einträge, die") + ' du auf Anhieb wusstest, ' + (neuBekannt.length === 1 ? "ist" : "sind") + ' noch nicht in deinen Lernkarten.</b>' +
      '<p class="klein">Als bekannt eingetragen kommen sie in der Lerneinheit nicht mehr als neue Karten, sondern werden in ein bis drei Wochen einmal nachgeprüft. Wer das nicht will, lässt es einfach.</p>' +
      '<button class="neben" data-akt="uebBekannt">Als bekannt eintragen</button></div>';
  }
  if (U.fehler.length) h += '<h2>Noch einmal ansehen</h2><div class="liste">' + U.fehler.map(function (d) {
    return d.typ === "g" ? '<div class="zeile ding"><button class="spiel" data-akt="ton" data-id="' + d.id + '" aria-label="Anhören">▶</button><span class="mitte"><span class="k" lang="ko">' + self.markiere(d.roh) + '</span><span class="d">' + e(d.de) + '</span></span></div>' : self.dingZeile(d);
  }).join("") + '</div>';
  U.jetzt = null;
  this.el("v-uebung").innerHTML = h;
  window.scrollTo(0, 0);
};
UI.uebTaste = function (ev) {
  var U = this.ueb;
  if (!U || !U.jetzt || this.el("v-uebung").hidden || /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
  var k = ev.key, box = this.el("v-uebung"), haupt = box.querySelector(".knoepfe .haupt");
  if (k === " " || k === "Enter") { ev.preventDefault(); if (haupt) haupt.click(); else { var g = box.querySelector('.knoepfe [data-ok="1"]'); if (g) g.click(); } }
  else if (k >= "1" && k <= "4") {
    var b = box.querySelectorAll(".wahl button")[+k - 1] || (U.jetzt.art === "karte" ? box.querySelector('.knoepfe [data-ok="' + (k === "1" ? 0 : 1) + '"]') : null);
    if (b && !b.disabled) b.click();
  } else if (k === "a" || k === "A") KO.ton.spiele(U.jetzt.d);
};
document.addEventListener("keydown", function (ev) { UI.uebTaste(ev); });

// ================= Aktionen =================
(function (A) {
  A.thema = function (e) { this.ueb = null; this.themaId = e.getAttribute("data-id"); this.zeig("thema"); };
  A.uebStufe = function (e) { this.uebStufe = e.getAttribute("data-s"); this.male_ueben(); };
  A.uebLaenge = function (e) { KO.stand.einst.ul = parseInt(e.getAttribute("data-n"), 10) || 0; KO.speichere(); this.male_thema(); };
  A.uebStart = function (e) { this.starteUebung(this.themaId, e.getAttribute("data-art")); };
  A.regelUeben = function (e) { this.starteUebung("r:" + e.getAttribute("data-id"), "gram"); };
  A.uebAbbruch = function () { var id = this.ueb ? this.ueb.thema.id : this.themaId; this.ueb = null; this.themaId = id; this.zeig("thema"); };
  A.uebWahl = function (e) { var a = this.ueb.jetzt; if (a.geloest) return; a.gewaehlt = parseInt(e.getAttribute("data-nr"), 10); this.uebGeloest(a.wahl[a.gewaehlt] === a.richtig); };
  A.uebStein = function (e) {
    var a = this.ueb.jetzt; a.gelegt.push(parseInt(e.getAttribute("data-nr"), 10));
    if (a.gelegt.length === a.B.steine.length) this.uebGeloest(a.gelegt.map(function (nr) { return a.B.steine[nr]; }).join(" ") === a.B.richtig.join(" "));
    else this.maleUebung();
  };
  A.uebZurueck = function (e) { var a = this.ueb.jetzt, nr = parseInt(e.getAttribute("data-nr"), 10); a.gelegt = a.gelegt.filter(function (x) { return x !== nr; }); this.maleUebung(); };
  A.uebAuf = function () { this.ueb.jetzt.offen = true; this.maleUebung(); };
  A.uebSelbst = function (e) { var a = this.ueb.jetzt; a.geloest = true; a.ok = e.getAttribute("data-ok") === "1"; this.uebWeiter(); };
  A.uebWeiter = function () { this.uebWeiter(); };
  A.uebDoch = function () { this.ueb.jetzt.ok = true; this.uebWeiter(); };
  A.uebNochmal = function () { this.starteUebung(this.ueb.thema.id, this.ueb.art); };
  A.uebFehler = function () {
    var U = this.ueb, T = U.thema, art = U.art;
    var liste = KO.mische(U.fehler).map(function (d) {
      var a = art !== "misch" ? art : d.typ === "g" ? "gram" : d.typ === "w" ? "wort" : KO.teile(d.ko).length >= 2 ? "luecke" : "hoer";
      return UE.aufgabe(a, d, T);
    });
    this.starteUebung(T.id, art, liste);
  };
  A.uebBekannt = function (e) {
    var n = KO.hakeAb(this.ueb.neuBekannt || []);
    e.disabled = true; e.textContent = "Eingetragen (" + n + " Lernkarten)";
  };
})(UI.akt);
