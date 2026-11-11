// ansicht.js — Oberfläche: Heute, Lerneinheit, Lektionen, Karten, Mehr. Kein Modul; globales Objekt UI.
// Bedienung über data-akt="name" an Knöpfen; ein Klick ruft UI.akt.name(element) auf.
var UI = {
  einheit: null, jetzt: null, lektion: "", kartenReiter: "eigene", suche: "",

  el: function (id) { return document.getElementById(id); },
  esc: function (t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); },
  tage: function (n) { return n <= 1 ? "morgen" : n < 30 ? "in " + n + " Tagen" : n < 335 ? "in " + Math.round(n / 30) + " Monaten" : "in 1 Jahr"; },

  start: function () {
    KO.lade(); KO.baueGrammatik();
    var self = this;
    document.addEventListener("click", function (ev) {
      var e = ev.target.closest ? ev.target.closest("[data-akt]") : null;
      if (e && self.akt[e.getAttribute("data-akt")]) self.akt[e.getAttribute("data-akt")].call(self, e, ev);
    });
    document.addEventListener("keydown", function (ev) { self.taste(ev); });
    if ("speechSynthesis" in window) { try { speechSynthesis.getVoices(); } catch (e) {} }
    this.zeig("heute");
  },
  zeig: function (name) {
    ["heute", "einheit", "lektionen", "lektion", "abhaken", "grammatik", "regel", "karten", "mehr"].forEach(function (v) { UI.el("v-" + v).hidden = v !== name; });
    var haupt = { lektion: "lektionen", abhaken: "lektionen", einheit: "heute", regel: "grammatik" }[name] || name;
    Array.prototype.forEach.call(document.querySelectorAll("nav button"), function (b) { b.classList.toggle("an", b.getAttribute("data-ziel") === haupt); });
    document.body.classList.toggle("lernt", name === "einheit");
    if (this["male_" + name]) this["male_" + name]();
    window.scrollTo(0, 0);
  },

  // ================= Heute =================
  male_heute: function () {
    var z = KO.zahlen(), v = KO.vorschau(7), max = Math.max.apply(null, v.concat([1])), e = this.esc, h = "";
    var naechste = KO.naechsteNeue(1)[0], lek = naechste && naechste.lek ? KO.lektionen[naechste.lek] : null;
    h += '<h1>Heute</h1>';
    if (z.faellig + z.neuRest > 0) {
      h += '<div class="karte"><div class="zahlen"><div><b>' + z.faellig + '</b><span>Wiederholungen fällig</span></div><div><b>' + z.neuRest + '</b><span>neue Karten</span></div></div>' +
        '<button class="haupt" data-akt="einheit">Lerneinheit starten</button>' +
        (lek ? '<p class="klein">Neue Karten aus: ' + e(lek.titel) + '</p>' : "") + '</div>';
    } else {
      h += '<div class="karte"><p><b>Für heute erledigt.</b> ' + (v[1] ? "Morgen sind " + v[1] + " Wiederholungen fällig." : "Morgen ist nichts fällig.") + '</p>' +
        (naechste ? '<button class="neben" data-akt="mehrNeue">5 weitere neue Karten lernen</button>' : '<p class="klein">Alle vorhandenen Karten sind gelernt.</p>') + '</div>';
    }
    var gr = KO.grammatikVorschlag();
    if (gr) h += '<div class="karte"><h2>Grammatik wiederholen</h2><button class="regelknopf" data-akt="regel" data-id="' + gr.id + '"><b>' + e(gr.titel) + '</b>' + (gr.kurzBsp ? '<span class="bsp" lang="ko">' + e(gr.kurzBsp) + '</span>' : "") +
      '<span class="weiter">Erklärung und Beispiele ›</span></button><button class="link" data-akt="nav" data-ziel="grammatik">Alle ' + KO.regeln.length + ' Grammatikseiten</button></div>';
    if (!z.woerter && !z.saetze) {
      h += '<div class="karte hinweis"><b>Du kannst schon etwas Koreanisch?</b><p>Unter „Lektionen“ hakst du mit „Einstufung“ ganze Lektionen ab, die du schon kannst, oder in einer Lektion einzelne Wörter. Abgehaktes wird später nur kurz nachgeprüft.</p>' +
        '<button class="neben" data-akt="nav" data-ziel="lektionen">Zu den Lektionen</button></div>';
    }
    h += '<div class="karte"><h2>Stand</h2><div class="zahlen drei"><div><b>' + z.woerter + '</b><span>Wörter gelernt</span></div><div><b>' + z.saetze + '</b><span>Sätze gelernt</span></div><div><b>' + z.fest + '</b><span>davon gefestigt</span></div></div>' +
      '<p class="klein">Heute: ' + z.wdhHeute + ' Wiederholungen, ' + z.neuHeute + ' neue Karten. Gefestigt heißt: Abstand von drei Wochen oder mehr.</p></div>';
    h += '<div class="karte"><h2>Fällig in den nächsten Tagen</h2><div class="balken">';
    var namen = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], d0 = new Date(KO.jetzt() - 4 * 3600000);
    v.forEach(function (n, i) {
      var d = new Date(d0.getTime() + i * 86400000);
      h += '<div><span class="wert">' + n + '</span><i style="height:' + Math.round(4 + 56 * n / max) + 'px"></i><span>' + (i === 0 ? "heute" : namen[d.getDay()]) + '</span></div>';
    });
    h += '</div></div>';
    this.el("v-heute").innerHTML = h;
  },

  // ================= Lerneinheit =================
  starteEinheit: function (zusatzNeu) {
    var s = KO.baueEinheit(zusatzNeu);
    if (!s.length) { this.zeig("heute"); return; }
    this.einheit = { schlange: s, fertig: 0, wdh: 0, neu: 0, falsch: 0 };
    this.zeig("einheit");
    this.naechste();
  },
  wieder: function (eintrag) { var s = this.einheit.schlange; s.splice(Math.min(3, s.length), 0, eintrag); },
  naechste: function () {
    var E = this.einheit, e = E.schlange.shift();
    if (!e) { this.ende(); return; }
    this.jetzt = e; e.offen = false; e.geloest = false;
    if (e.art === "neu") { this.maleNeu(KO.ding(e.ding)); return; }
    var d = KO.dingVon(e.karte), k = KO.stand.karten[e.karte], n = k ? k.n : 0, rest = e.karte.slice(-2);
    if (!d) { this.naechste(); return; }
    if (rest === ":s") e.modus = (e.art === "wdh") ? KO.satzArt(d, n) : "lesen";
    else if (rest === ":r") e.modus = (e.art === "wdh" && n % 3 === 2 && !d.eigen) ? "hoeren" : "lesen";
    else e.modus = "schreiben";
    this.maleKarte();
  },
  kopf: function (d, etikett) {
    var E = this.einheit, gesamt = E.fertig + E.schlange.length + 1, m = KO.stand.gemerkt[d.id];
    return '<div class="ekopf"><button class="link" data-akt="abbruch">Beenden</button><div class="fort"><i style="width:' + Math.round(100 * E.fertig / gesamt) + '%"></i></div>' +
      '<button class="stern' + (m ? " an" : "") + '" data-akt="merken" data-id="' + d.id + '" aria-label="Merken">' + (m ? "★" : "☆") + '</button></div>' +
      '<div class="etikett">' + this.esc(etikett) + '</div>';
  },
  tonKnoepfe: function (d) {
    return '<div class="ton"><button data-akt="ton" data-id="' + d.id + '">▶ Anhören</button><button data-akt="ton" data-langsam="1" data-id="' + d.id + '">langsam</button></div>';
  },
  maleNeu: function (d) {
    var e = this.esc, h = this.kopf(d, d.typ === "s" ? "Neuer Satz" : d.eigen ? "Neue eigene Karte" : "Neues Wort");
    h += '<div class="flaeche"><div class="ko' + (d.typ === "s" ? " satz" : "") + '">' + e(d.ko) + '</div>' +
      (d.zusatz ? '<div class="zusatz">' + e(d.zusatz) + '</div>' : "") +
      (d.form ? '<div class="form">höflich: <span lang="ko">' + e(d.form) + '</span></div>' : "") +
      '<div class="de">' + e(d.de) + '</div>' + (d.wl ? '<div class="wl">wörtlich: ' + e(d.wl) + '</div>' : "") + (d.notiz ? '<div class="wl">' + e(d.notiz) + '</div>' : "") +
      this.tonKnoepfe(d) + '</div><div class="knoepfe"><button class="haupt" data-akt="weiterNeu">Weiter</button></div>';
    this.el("v-einheit").innerHTML = h;
    if (KO.stand.einst.auto) KO.ton.spiele(d);
  },
  etikett: function (e, d) {
    if (e.art === "nochmal") return "Noch einmal";
    if (e.modus === "hoeren") return "Hören";
    if (e.modus === "luecke") return "Lücke füllen";
    if (e.modus === "bau") return "Satz bauen";
    if (e.modus === "schreiben") return "Deutsch → Koreanisch";
    return d.typ === "s" ? "Satz verstehen" : "Koreanisch → Deutsch";
  },
  maleKarte: function () {
    var e = this.jetzt, d = KO.dingVon(e.karte), x = this.esc, h = this.kopf(d, this.etikett(e, d)), offen = e.offen;
    var antwort = '<div class="ko' + (d.typ === "s" ? " satz" : "") + '">' + x(d.ko) + '</div>' + (d.form ? '<div class="form">höflich: <span lang="ko">' + x(d.form) + '</span></div>' : "");
    var deutsch = '<div class="de">' + x(d.de) + '</div>' + (d.wl ? '<div class="wl">wörtlich: ' + x(d.wl) + '</div>' : "") + (d.notiz ? '<div class="wl">' + x(d.notiz) + '</div>' : "");
    h += '<div class="flaeche">';
    if (e.modus === "lesen") {
      h += antwort.replace('</div>', '</div>' + (d.zusatz ? '<div class="zusatz">' + x(d.zusatz) + '</div>' : "")) + (offen ? '<hr>' + deutsch : "") + this.tonKnoepfe(d);
    } else if (e.modus === "hoeren") {
      h += (offen ? antwort + '<hr>' + deutsch : '<div class="frage">Was hörst du?</div>') + this.tonKnoepfe(d);
    } else if (e.modus === "schreiben") {
      h += '<div class="de gross">' + x(d.de) + '</div>' + (offen ? '<hr>' + antwort + this.tonKnoepfe(d) : '<div class="frage">Wie heißt das auf Koreanisch?</div>');
    } else if (e.modus === "luecke") {
      var L = e.luecke || (e.luecke = KO.luecke(d, (KO.stand.karten[e.karte] || { n: 0 }).n));
      h += '<div class="de">' + x(d.de) + '</div><div class="ko satz">' + L.teile.map(function (t, i) {
        if (i !== L.nr) return x(t);
        var rest = t.slice(KO.ohneZeichen(t).length);
        return (e.geloest ? '<b class="' + (e.richtig ? "gut" : "schlecht") + '">' + x(L.richtig) + '</b>' : '<span class="leer"></span>') + x(rest);
      }).join(" ") + '</div>';
      if (!e.geloest) h += '<div class="wahl">' + L.wahl.map(function (w) { return '<button lang="ko" data-akt="wahl" data-w="' + x(w) + '">' + x(w) + '</button>'; }).join("") + '</div>';
      else h += (d.wl ? '<div class="wl">wörtlich: ' + x(d.wl) + '</div>' : "") + this.tonKnoepfe(d);
    } else if (e.modus === "bau") {
      var B = e.bau || (e.bau = KO.bau(d)); if (!e.gelegt) e.gelegt = [];
      h += '<div class="de">' + x(d.de) + '</div>';
      if (!e.geloest) {
        h += '<div class="reihe ziel">' + (e.gelegt.length ? e.gelegt.map(function (nr) { return '<button lang="ko" data-akt="zurueck" data-nr="' + nr + '">' + x(B.steine[nr]) + '</button>'; }).join("") : '<span class="klein">Tippe die Teile in der richtigen Reihenfolge an.</span>') + '</div>' +
          '<div class="reihe">' + B.steine.map(function (s, nr) { return '<button lang="ko" data-akt="stein" data-nr="' + nr + '"' + (e.gelegt.indexOf(nr) >= 0 ? ' disabled' : "") + '>' + x(s) + '</button>'; }).join("") + '</div>';
      } else {
        h += '<div class="ko satz ' + (e.richtig ? "gut" : "schlecht") + '">' + x(e.gelegt.map(function (nr) { return B.steine[nr]; }).join(" ")) + '</div>' +
          (e.richtig ? "" : '<div class="klein">Richtig:</div><div class="ko satz">' + x(d.ko) + '</div>') + (d.wl ? '<div class="wl">wörtlich: ' + x(d.wl) + '</div>' : "") + this.tonKnoepfe(d);
      }
    }
    h += '</div><div class="knoepfe">';
    var selbst = e.modus === "lesen" || e.modus === "hoeren" || e.modus === "schreiben";
    if (selbst && !offen) h += '<button class="haupt" data-akt="auf">Aufdecken</button>';
    else if (selbst) {
      var k = KO.stand.karten[e.karte], heute = KO.heute(), v = function (g) { return UI.tage(SRS.vorschau(k, g, heute, e.karte)); };
      if (e.art === "nochmal") h += '<button class="schlecht" data-akt="note" data-g="1">Nicht gewusst</button><button class="gut" data-akt="note" data-g="3">Gewusst</button>';
      else if (e.art === "wdh") h += '<button class="schlecht" data-akt="note" data-g="1">Nicht gewusst<small>morgen</small></button><button class="gut" data-akt="note" data-g="3">Gewusst<small>' + v(3) + '</small></button><button class="leicht" data-akt="note" data-g="4">Leicht<small>' + v(4) + '</small></button>';
      else h += '<button class="schlecht" data-akt="note" data-g="1">Nicht gewusst<small>gleich nochmal</small></button><button class="gut" data-akt="note" data-g="3">Gewusst<small>' + (e.fehl ? "morgen" : UI.tage(SRS.vorschau(null, 3, heute, e.karte))) + '</small></button>' +
        (e.fehl ? "" : '<button class="leicht" data-akt="note" data-g="4">Leicht<small>' + UI.tage(SRS.vorschau(null, 4, heute, e.karte)) + '</small></button>');
    } else if (e.geloest) {
      // Koreanisch erlaubt oft mehrere Reihenfolgen; wer eine andere richtige gelegt hat, kann das selbst bestätigen
      if (e.modus === "bau" && !e.richtig) h += '<button data-akt="dochRichtig">Meine Reihenfolge<small>stimmt auch</small></button>';
      h += '<button class="haupt" data-akt="weiterAuto">Weiter</button>';
    }
    h += '</div>';
    this.el("v-einheit").innerHTML = h;
    var zeigtKo = (e.modus === "lesen" && !offen) || (e.modus === "hoeren" && !offen) || (e.modus === "schreiben" && offen) || ((e.modus === "luecke" || e.modus === "bau") && e.geloest);
    if (zeigtKo && KO.stand.einst.auto || (e.modus === "hoeren" && !offen)) KO.ton.spiele(d);
  },
  // Bewertung verarbeiten: g 1 nicht gewusst, 3 gewusst, 4 leicht
  note: function (g) {
    var e = this.jetzt, E = this.einheit;
    if (e.art === "wdh") {
      KO.werte(e.karte, g); E.wdh++;
      if (g === 1) { E.falsch++; this.wieder({ art: "nochmal", karte: e.karte }); } else E.fertig++;
    } else if (e.art === "nochmal") {
      if (g === 1) this.wieder({ art: "nochmal", karte: e.karte }); else E.fertig++;
    } else {                                   // erste Prüfung einer neuen Karte oder neuen Richtung
      if (g === 1) { E.falsch++; this.wieder({ art: e.art, karte: e.karte, fehl: true }); }
      else { KO.werte(e.karte, e.fehl ? 1 : g); E.fertig++; if (e.art === "erst") E.neu++; }
    }
    this.naechste();
  },
  ende: function () {
    var E = this.einheit, z = KO.zahlen(), h = '<h1>Einheit fertig</h1><div class="karte"><div class="zahlen drei"><div><b>' + E.wdh + '</b><span>wiederholt</span></div><div><b>' + E.neu + '</b><span>neu gelernt</span></div><div><b>' + E.falsch + '</b><span>nicht gewusst</span></div></div>';
    if (z.faellig + z.neuRest > 0) h += '<p>Noch offen: ' + z.faellig + ' Wiederholungen, ' + z.neuRest + ' neue Karten.</p><button class="haupt" data-akt="einheit">Noch eine Einheit</button>';
    else h += '<p>Für heute ist alles erledigt.</p>' + (KO.naechsteNeue(1).length ? '<button class="neben" data-akt="mehrNeue">5 weitere neue Karten lernen</button>' : "");
    h += '<button class="neben" data-akt="nav" data-ziel="heute">Zur Übersicht</button></div>';
    this.einheit = null; this.jetzt = null;
    this.el("v-einheit").innerHTML = h;
  },
  taste: function (ev) {
    if (!this.jetzt || this.el("v-einheit").hidden || /INPUT|TEXTAREA|SELECT/.test(ev.target.tagName)) return;
    var k = ev.key, haupt = this.el("v-einheit").querySelector(".knoepfe .haupt");
    if (k === " " || k === "Enter") {
      ev.preventDefault();
      if (haupt) haupt.click(); else { var g = this.el("v-einheit").querySelector('.knoepfe [data-g="3"]'); if (g) g.click(); }
    } else if (k === "1" || k === "2" || k === "3") {
      var b = this.el("v-einheit").querySelector('.knoepfe [data-g="' + { 1: 1, 2: 3, 3: 4 }[k] + '"]'); if (b) b.click();
    } else if (k === "a" || k === "A") { KO.ton.spiele(KO.ding(this.jetzt.ding || this.jetzt.karte.split(":")[0])); }
  },

  // ================= Lektionen =================
  male_lektionen: function () {
    var e = this.esc, h = '<h1>Lektionen</h1><button class="neben" data-akt="einstufung">Einstufung: ganze Lektionen abhaken</button>', pin = KO.stand.einst.pin;
    KO.bloecke.forEach(function (b) {
      h += '<h2>' + e(b.titel) + '</h2><div class="liste">';
      b.lektionen.forEach(function (l, i) {
        var s = KO.lektionStand(l.id);
        h += '<button class="zeile lek" data-akt="lektion" data-id="' + l.id + '"><span class="nr">' + l.nr + '</span><span class="mitte"><b>' + e(l.titel) + '</b>' + (pin === l.id ? '<em>als Nächstes</em>' : "") +
          '<span class="fort"><i style="width:' + Math.round(100 * s.gelernt / s.gesamt) + '%"></i></span></span><span class="rechts">' + s.gelernt + ' / ' + s.gesamt + '</span></button>';
      });
      h += '</div>';
    });
    h += '<p class="klein">A2 und B1 folgen als weitere Blöcke.</p>';
    this.el("v-lektionen").innerHTML = h;
  },
  dingZeile: function (d) {
    var e = this.esc, g = KO.gelernt(d), m = KO.stand.gemerkt[d.id];
    return '<div class="zeile ding"><button class="spiel" data-akt="ton" data-id="' + d.id + '" aria-label="Anhören">▶</button><span class="mitte"><span class="k" lang="ko">' + e(d.ko) + (d.form ? ' <small>' + e(d.form) + '</small>' : "") + '</span><span class="d">' + e(d.de) + '</span></span>' +
      '<span class="punkt' + (g ? " an" : "") + '" title="' + (g ? "gelernt" : "noch neu") + '"></span><button class="stern' + (m ? " an" : "") + '" data-akt="merken" data-id="' + d.id + '" aria-label="Merken">' + (m ? "★" : "☆") + '</button></div>';
  },
  male_lektion: function () {
    var l = KO.lektionen[this.lektion], e = this.esc, self = this, s = KO.lektionStand(l.id), pin = KO.stand.einst.pin === l.id;
    var h = '<button class="link" data-akt="nav" data-ziel="lektionen">‹ Lektionen</button><h1>' + e(l.titel) + '</h1><p class="klein">' + s.gelernt + ' von ' + s.gesamt + ' gelernt</p>' +
      '<div class="knopfzeile"><button class="neben" data-akt="pin">' + (pin ? "Nicht mehr als Nächstes" : "Als Nächstes lernen") + '</button>' + (s.gelernt < s.gesamt ? '<button class="neben" data-akt="abhaken">Bekanntes abhaken</button>' : "") + '</div>';
    if (l.notiz && l.notiz.length) h += '<h2>Grammatik</h2>' + l.notiz.map(function (n, i) {
      return '<button class="karte regelknopf" data-akt="regel" data-id="' + l.id + 'n' + (i + 1) + '"><b>' + e(n[0]) + '</b><span>' + e(n[1]) + '</span>' + (n[2] ? '<span class="bsp" lang="ko">' + e(n[2]) + '</span>' : "") + '<span class="weiter">Mehr Beispiele ›</span></button>';
    }).join("");
    h += '<h2>Wörter</h2><div class="liste">' + l.dinge.filter(function (d) { return d.typ === "w"; }).map(function (d) { return self.dingZeile(d); }).join("") + '</div>';
    h += '<h2>Sätze</h2><div class="liste">' + l.dinge.filter(function (d) { return d.typ === "s"; }).map(function (d) { return self.dingZeile(d); }).join("") + '</div>';
    this.el("v-lektion").innerHTML = h;
  },
  male_abhaken: function () {
    if (this.abhakModus === "lektionen") { this.maleEinstufung(); return; }
    var l = KO.lektionen[this.lektion], e = this.esc, offen = l.dinge.filter(function (d) { return d.typ === "w" && !KO.gelernt(d); });
    var h = '<button class="link" data-akt="lektion" data-id="' + l.id + '">‹ ' + e(l.titel) + '</button><h1>Bekanntes abhaken</h1><p>Hake nur an, was du sofort lesen und übersetzen kannst. Abgehakte Wörter gelten als gelernt und werden in ein bis drei Wochen einmal nachgeprüft.</p>';
    if (!offen.length) h += '<p>In dieser Lektion sind alle Wörter schon gelernt.</p>';
    else h += '<div class="knopfzeile"><button class="neben" data-akt="alleAn">Alle auswählen</button><button class="neben" data-akt="alleAus">Keine</button></div><div class="liste">' +
      offen.map(function (d) { return '<label class="zeile ding"><input type="checkbox" value="' + d.id + '"><span class="mitte"><span class="k" lang="ko">' + e(d.ko) + '</span><span class="d">' + e(d.de) + '</span></span></label>'; }).join("") +
      '</div><div class="knoepfe fest"><button class="haupt" data-akt="abhakenFertig">Auswahl übernehmen</button></div>';
    this.el("v-abhaken").innerHTML = h;
  },

  // Einstufung: ganze Lektionen als bekannt abhaken (für alle, die nicht bei null anfangen)
  maleEinstufung: function () {
    var e = this.esc, h = '<button class="link" data-akt="nav" data-ziel="lektionen">‹ Lektionen</button><h1>Einstufung</h1>' +
      '<p>Hake die Lektionen an, deren Wörter und Sätze du schon sicher kannst. Alles darin gilt dann als gelernt und wird in ein bis drei Wochen einmal nachgeprüft. Neue Karten kommen danach aus der ersten Lektion, die du nicht angehakt hast.</p>' +
      '<p class="klein">Bei einer Lektion unsicher? Dann nicht anhaken, sondern die Lektion öffnen und dort mit „Bekanntes abhaken“ nur einzelne Wörter wählen.</p>';
    KO.bloecke.forEach(function (b) {
      var z = b.lektionen.map(function (l) {
        var s = KO.lektionStand(l.id);
        return s.gelernt >= s.gesamt ? "" : '<label class="zeile ding"><input type="checkbox" value="' + l.id + '"><span class="mitte"><b>' + l.nr + ' · ' + e(l.titel) + '</b><span class="d">' + s.gelernt + ' von ' + s.gesamt + ' gelernt</span></span></label>';
      }).join("");
      if (z) h += '<h2>' + e(b.titel) + '</h2><div class="liste">' + z + '</div>';
    });
    h += '<div class="knoepfe fest"><button class="haupt" data-akt="abhakenFertig">Auswahl übernehmen</button></div>';
    this.el("v-abhaken").innerHTML = h;
  },

  // ================= Grammatik =================
  markiere: function (roh) { return this.esc(roh).replace(/\[([^\]]*)\]/g, '<b class="m">$1</b>'); },
  lektionsNr: function (lekId) { return KO.lektionen[lekId].nr; },
  regelZeile: function (r) {
    var e = this.esc;
    return '<button class="zeile regelz" data-akt="regel" data-id="' + r.id + '"><span class="mitte"><b>' + e(r.titel) + '</b><span class="d"' + (r.art === "regel" ? ' lang="ko"' : "") + '>' + e(r.art === "regel" ? r.kurzBsp : r.kurz) + '</span></span>' +
      '<span class="punkt' + (KO.stand.gram[r.id] ? " an" : "") + '" title="' + (KO.stand.gram[r.id] ? "angesehen" : "noch nicht angesehen") + '"></span><span class="pfeil">›</span></button>';
  },
  grammatikListe: function () {
    var q = (this.gSuche || "").trim().toLowerCase(), self = this, e = this.esc, h = "";
    var passt = function (r) {
      if (!q) return true;
      return (r.titel + " " + r.kurz + " " + (r.kurzBsp || "") + " " + (r.mehr || "") + " " + r.bsp.map(function (b) { return b.ko + " " + b.de; }).join(" ")).toLowerCase().indexOf(q) >= 0;
    };
    var grund = KO.regeln.filter(function (r) { return r.art === "grund" && passt(r); });
    if (grund.length) h += '<h2>Grundlagen</h2><div class="liste">' + grund.map(function (r) { return self.regelZeile(r); }).join("") + '</div>';
    KO.bloecke.forEach(function (b) {
      b.lektionen.forEach(function (l) {
        var rr = KO.regeln.filter(function (r) { return r.lek === l.id && passt(r); });
        if (rr.length) h += '<h2>' + self.lektionsNr(l.id) + ' · ' + e(l.titel) + '</h2><div class="liste">' + rr.map(function (r) { return self.regelZeile(r); }).join("") + '</div>';
      });
    });
    return h || '<p class="klein">Nichts gefunden.</p>';
  },
  male_grammatik: function () {
    var e = this.esc, self = this;
    this.el("v-grammatik").innerHTML = '<h1>Grammatik</h1><p class="klein">Jede Regel hat eine eigene Seite mit Erklärung und Beispielen zum Anhören. Der grüne Punkt zeigt, was du schon angesehen hast.</p>' +
      '<input id="gSuch" type="search" placeholder="Suchen, z. B. 은, müssen, Vergangenheit" value="' + e(this.gSuche || "") + '" autocomplete="off"><div id="gListe">' + this.grammatikListe() + '</div>';
    var s = this.el("gSuch");
    s.oninput = function () { self.gSuche = s.value; self.el("gListe").innerHTML = self.grammatikListe(); };
  },
  male_regel: function () {
    var r = KO.regel[this.regelId], e = this.esc, self = this;
    if (!r) { this.zeig("grammatik"); return; }
    KO.stand.gram[r.id] = KO.heute(); KO.speichere();
    var nr = KO.regeln.indexOf(r), vor = KO.regeln[nr - 1], nach = KO.regeln[nr + 1], lek = r.lek ? KO.lektionen[r.lek] : null;
    var h = '<button class="link" data-akt="nav" data-ziel="grammatik">‹ Grammatik</button><div class="etikett">' + (lek ? 'Lektion ' + this.lektionsNr(r.lek) + ' · ' + e(lek.titel) : 'Grundlagen') + '</div><h1 class="regeltitel">' + e(r.titel) + '</h1>';
    h += '<div class="karte"><p>' + e(r.kurz) + '</p>' + (r.kurzBsp ? '<p class="bsp" lang="ko">' + e(r.kurzBsp) + '</p>' : "") + '</div>';
    if (r.mehr) h += '<h2>Genauer</h2><p>' + e(r.mehr) + '</p>';
    (r.text || []).forEach(function (t) { h += '<p>' + e(t) + '</p>'; });
    if (r.tabelle) h += '<div class="tabwrap"><table class="gt">' + r.tabelle.map(function (z, i) {
      return '<tr>' + z.map(function (c) { return (i === 0 ? '<th>' : '<td>') + e(c) + (i === 0 ? '</th>' : '</td>'); }).join("") + '</tr>';
    }).join("") + '</table></div>';
    (r.danach || []).forEach(function (t) { h += '<p>' + e(t) + '</p>'; });
    if (r.kv) h += '<button class="karte hinweis regelknopf" data-akt="regel" data-id="g-kv"><b>Konsonant oder Vokal?</b><span>Sieh dir die letzte Silbe davor an. Steht unten noch ein Zeichen, endet das Wort auf Konsonant (책, 물, 빵). Steht dort nichts, endet es auf Vokal (사과, 친구, 저).</span><span class="weiter">Ganze Erklärung ›</span></button>';
    if (r.verweis && KO.regel[r.verweis]) h += '<button class="karte hinweis regelknopf" data-akt="regel" data-id="' + r.verweis + '"><b>' + e(KO.regel[r.verweis].titel) + '</b><span>' + e(KO.regel[r.verweis].kurz) + '</span><span class="weiter">Zur Übersicht ›</span></button>';
    if (r.bsp.length) h += '<h2>Beispiele</h2><div class="liste">' + r.bsp.map(function (b) {
      return '<div class="zeile ding"><button class="spiel" data-akt="ton" data-id="' + b.id + '" aria-label="Anhören">▶</button><span class="mitte"><span class="k" lang="ko">' + self.markiere(b.roh) + '</span><span class="d">' + e(b.de) + '</span>' +
        (b.hin ? '<span class="h">' + e(b.hin) + '</span>' : "") + '</span><button class="lang" data-akt="ton" data-langsam="1" data-id="' + b.id + '">langsam</button></div>';
    }).join("") + '</div>';
    if (r.siehe && r.siehe.length) h += '<h2>Dazu gehören</h2><div class="liste">' + r.siehe.map(function (id) { return KO.regel[id] ? self.regelZeile(KO.regel[id]) : ""; }).join("") + '</div>';
    if (lek) h += '<button class="neben" data-akt="lektion" data-id="' + lek.id + '">Zur Lektion ' + this.lektionsNr(lek.id) + ': ' + e(lek.titel) + '</button>';
    h += '<div class="blaettern">' + (vor ? '<button class="neben" data-akt="regel" data-id="' + vor.id + '">‹ ' + e(vor.titel) + '</button>' : "") + (nach ? '<button class="neben" data-akt="regel" data-id="' + nach.id + '">' + e(nach.titel) + ' ›</button>' : "") + '</div>';
    this.el("v-regel").innerHTML = h;
  },

  // ================= Karten =================
  male_karten: function () {
    var e = this.esc, self = this, r = this.kartenReiter, h = '<h1>Karten</h1><div class="reiter">' +
      [["eigene", "Eigene"], ["gemerkt", "Gemerkt"], ["suche", "Suche"]].map(function (x) { return '<button data-akt="reiter" data-r="' + x[0] + '"' + (r === x[0] ? ' class="an"' : "") + '>' + x[1] + '</button>'; }).join("") + '</div>';
    if (r === "eigene") {
      h += '<div class="karte"><h2>Neue eigene Karte</h2><label>Koreanisch<input id="eKo" lang="ko" autocomplete="off" placeholder="예: 수고하셨습니다"></label><label>Deutsch<input id="eDe" autocomplete="off" placeholder="z. B.: Gut gemacht, danke für die Mühe"></label>' +
        '<label>Notiz (optional)<input id="eNotiz" autocomplete="off" placeholder="z. B.: sagt man nach getaner Arbeit"></label><button class="haupt" data-akt="eigeneNeu">Karte speichern</button><p class="klein" id="eMeldung">Eigene Karten kommen in der nächsten Lerneinheit als Erstes dran. Vorgelesen werden sie mit der Stimme deines Geräts, falls es eine koreanische hat.</p></div>';
      var eig = KO.stand.eigene.slice().reverse();
      h += '<h2>Deine Karten (' + eig.length + ')</h2>' + (eig.length ? '<div class="liste">' + eig.map(function (x) {
        return '<div class="zeile ding"><button class="spiel" data-akt="ton" data-id="' + x.id + '" aria-label="Anhören">▶</button><span class="mitte"><span class="k" lang="ko">' + e(x.ko) + '</span><span class="d">' + e(x.de) + (x.notiz ? ' · ' + e(x.notiz) : "") + '</span></span><button class="link" data-akt="eigeneWeg" data-id="' + x.id + '">löschen</button></div>';
      }).join("") + '</div>' : '<p class="klein">Noch keine.</p>');
    } else if (r === "gemerkt") {
      var ids = Object.keys(KO.stand.gemerkt).filter(function (id) { return KO.ding(id); });
      h += ids.length ? '<div class="liste">' + ids.map(function (id) { return self.dingZeile(KO.ding(id)); }).join("") + '</div>' : '<p class="klein">Mit dem Stern ☆ merkst du dir Wörter und Sätze. Sie stehen dann hier.</p>';
    } else {
      h += '<input id="such" type="search" placeholder="Koreanisch oder Deutsch" value="' + e(this.suche) + '" autocomplete="off"><div id="treffer">' + this.treffer() + '</div>';
    }
    this.el("v-karten").innerHTML = h;
    var s = this.el("such");
    if (s) s.oninput = function () { self.suche = s.value; self.el("treffer").innerHTML = self.treffer(); };
  },
  treffer: function () {
    var q = this.suche.trim().toLowerCase(), self = this;
    if (q.length < 1) return '<p class="klein">Suchbegriff eingeben.</p>';
    var t = Object.keys(KO.dinge).map(function (id) { return KO.dinge[id]; }).filter(function (d) { return d.ko.indexOf(q) >= 0 || d.de.toLowerCase().indexOf(q) >= 0 || (d.form && d.form.indexOf(q) >= 0); }).slice(0, 60);
    return t.length ? '<div class="liste">' + t.map(function (d) { return self.dingZeile(d); }).join("") + '</div>' : '<p class="klein">Nichts gefunden.</p>';
  },

  // ================= Mehr =================
  male_mehr: function () {
    var e = this.esc, E = KO.stand.einst, h = '<h1>Mehr</h1>';
    var offen = Array.prototype.map.call(this.el("v-mehr").querySelectorAll("details"), function (d) { return d.open; });   // aufgeklappte Abschnitte merken
    h += '<details class="karte" open><summary>Einstellungen</summary>' +
      '<label>Neue Karten pro Tag<select id="sNeu">' + [0, 5, 10, 15, 20, 30].map(function (n) { return '<option' + (E.neu === n ? " selected" : "") + '>' + n + '</option>'; }).join("") + '</select></label>' +
      '<label class="haken"><input type="checkbox" id="sAuto"' + (E.auto ? " checked" : "") + '> Ton automatisch abspielen</label>' +
      '<label class="haken"><input type="checkbox" id="sDeko"' + (E.deko ? " checked" : "") + '> Auch Deutsch → Koreanisch abfragen</label>' +
      '<p class="klein">Tasten am PC: Leertaste aufdecken und „Gewusst“, 1 nicht gewusst, 2 gewusst, 3 leicht, A anhören.</p></details>';
    h += '<details class="karte"><summary>Sichern und Laden</summary><p>Der Lernstand liegt nur in diesem Browser auf diesem Gerät. Mit einer Sicherungsdatei überträgst du ihn auf ein anderes Gerät oder hebst ihn auf.</p>' +
      '<div class="knopfzeile"><button class="neben" data-akt="sichern">Sicherungsdatei speichern</button><label class="neben dateiwahl">Sicherungsdatei laden<input type="file" id="ladeDatei" accept=".json,application/json"></label></div><p class="klein" id="sichMeldung"></p></details>';
    h += '<details class="karte"><summary>Ton für unterwegs</summary><p>Lädt alle Tondateien aufs Gerät, damit sie auch ohne Internet abgespielt werden (' + (Object.keys(KO.dinge).length + Object.keys(KO.gbsp).length) + ' kleine Dateien).</p><button class="neben" data-akt="tonLaden">Alle Tondateien laden</button><p class="klein" id="tonMeldung"></p></details>';
    h += '<details class="karte"><summary>Durchsicht für Muttersprachler</summary><p>Hier kann jemand, der Koreanisch als Muttersprache spricht, Fehler im Text oder im Ton markieren. Der Bericht lässt sich kopieren und weitergeben.</p>' +
      '<label>Lektion<select id="pLek">' + KO.lektionsFolge().sort().map(function (id) { return '<option value="' + id + '"' + (UI.pruefLek === id ? " selected" : "") + '>' + e(KO.lektionen[id].titel) + '</option>'; }).join("") + '</select></label><div id="pListe"></div>' +
      '<button class="neben" data-akt="bericht">Bericht anzeigen</button><textarea id="pBericht" readonly hidden rows="8"></textarea></details>';
    h += '<details class="karte"><summary>Lernstand zurücksetzen</summary><p>Löscht alle Lernstände, eigenen Karten und Markierungen auf diesem Gerät.</p><button class="neben schlecht" data-akt="zurueckSetzen" id="rKnopf">Alles löschen</button></details>';
    h += '<p class="klein">Stimme: Supertonic (Supertone, Seoul), einmalig erzeugt. Wiederholung nach dem FSRS-Verfahren. Inhalte ohne Gewähr – Fehler bitte über die Durchsicht melden.</p>';
    this.el("v-mehr").innerHTML = h;
    if (offen.length) Array.prototype.forEach.call(this.el("v-mehr").querySelectorAll("details"), function (d, i) { d.open = !!offen[i]; });
    var self = this;
    this.el("sNeu").onchange = function () { E.neu = parseInt(this.value, 10) || 0; KO.speichere(); };
    this.el("sAuto").onchange = function () { E.auto = this.checked; KO.speichere(); };
    this.el("sDeko").onchange = function () { E.deko = this.checked; KO.speichere(); };
    this.el("pLek").onchange = function () { self.pruefLek = this.value; self.malePruef(); };
    this.el("ladeDatei").onchange = function () { self.ladeDatei(this.files[0]); this.value = ""; };
    if (!this.pruefLek) this.pruefLek = this.el("pLek").value;
    this.malePruef();
  },
  malePruef: function () {
    var l = KO.lektionen[this.pruefLek], e = this.esc, P = KO.stand.pruef, box = this.el("pListe");
    var zeilen = l.dinge.slice();                      // Wörter und Sätze der Lektion, danach die Beispiele ihrer Grammatikregeln
    KO.regeln.forEach(function (r) { if (r.lek === l.id) zeilen = zeilen.concat(r.bsp); });
    box.innerHTML = zeilen.map(function (d) {
      var p = P[d.id] || {};
      return '<div class="pruef" data-id="' + d.id + '"><div class="zeile ding"><button class="spiel" data-akt="ton" data-id="' + d.id + '" aria-label="Anhören">▶</button><span class="mitte"><span class="k" lang="ko">' + e(d.ko) + '</span><span class="d">' + e(d.de) + '</span></span></div>' +
        '<div class="pzeile"><label class="haken"><input type="checkbox" data-f="text"' + (p.text ? " checked" : "") + '> Text falsch</label><label class="haken"><input type="checkbox" data-f="ton"' + (p.ton ? " checked" : "") + '> Ton falsch</label><input type="text" data-f="k" placeholder="Besser wäre …" value="' + e(p.k || "") + '"></div></div>';
    }).join("");
    box.onchange = function (ev) {
      var z = ev.target.closest(".pruef"); if (!z) return;
      var id = z.getAttribute("data-id"), p = P[id] || (P[id] = {}), f = ev.target.getAttribute("data-f");
      if (f === "k") p.k = ev.target.value.trim(); else p[f] = ev.target.checked;
      if (!p.text && !p.ton && !p.k) delete P[id];
      KO.speichere();
    };
  },
  ladeDatei: function (datei) {
    var m = this.el("sichMeldung"), self = this;
    if (!datei) return;
    var r = new FileReader();
    r.onload = function () {
      var s = null; try { s = KO.pruefeStand(JSON.parse(r.result)); } catch (e) { s = null; }
      if (!s) { m.textContent = "Das ist keine gültige Sicherungsdatei dieser App."; return; }
      KO.stand = s; KO.speichere();
      self.male_mehr(); self.el("sichMeldung").textContent = "Geladen: " + Object.keys(s.karten).length + " Lernkarten, " + s.eigene.length + " eigene Karten.";
    };
    r.readAsText(datei);
  },

  // ================= Aktionen =================
  akt: {
    nav: function (e) { if (this.einheit && e.getAttribute("data-ziel") !== "heute") { this.einheit = null; this.jetzt = null; } this.zeig(e.getAttribute("data-ziel")); },
    einheit: function () { this.starteEinheit(0); },
    mehrNeue: function () { this.starteEinheit(5); },
    abbruch: function () { this.einheit = null; this.jetzt = null; this.zeig("heute"); },
    ton: function (e) { KO.ton.spiele(KO.ding(e.getAttribute("data-id")), !!e.getAttribute("data-langsam")); },
    merken: function (e) {
      var id = e.getAttribute("data-id"), g = KO.stand.gemerkt;
      if (g[id]) delete g[id]; else g[id] = 1;
      KO.speichere();
      e.classList.toggle("an", !!g[id]); e.textContent = g[id] ? "★" : "☆";
    },
    weiterNeu: function () { var d = KO.ding(this.jetzt.ding); this.wieder({ art: "erst", karte: KO.ersteKarte(d) }); this.naechste(); },
    auf: function () { this.jetzt.offen = true; this.maleKarte(); },
    note: function (e) { this.note(parseInt(e.getAttribute("data-g"), 10)); },
    wahl: function (e) { var j = this.jetzt; j.geloest = true; j.richtig = e.getAttribute("data-w") === j.luecke.richtig; this.maleKarte(); },
    stein: function (e) {
      var j = this.jetzt; j.gelegt.push(parseInt(e.getAttribute("data-nr"), 10));
      if (j.gelegt.length === j.bau.steine.length) { j.geloest = true; j.richtig = j.gelegt.map(function (nr) { return j.bau.steine[nr]; }).join(" ") === j.bau.richtig.join(" "); }
      this.maleKarte();
    },
    zurueck: function (e) { var j = this.jetzt, nr = parseInt(e.getAttribute("data-nr"), 10); j.gelegt = j.gelegt.filter(function (x) { return x !== nr; }); this.maleKarte(); },
    weiterAuto: function () { this.note(this.jetzt.richtig ? 3 : 1); },
    dochRichtig: function () { this.jetzt.richtig = true; this.note(3); },
    lektion: function (e) { this.lektion = e.getAttribute("data-id"); this.zeig("lektion"); },
    pin: function () { var E = KO.stand.einst; E.pin = E.pin === this.lektion ? "" : this.lektion; KO.speichere(); this.male_lektion(); },
    abhaken: function () { this.abhakModus = "woerter"; this.zeig("abhaken"); },
    einstufung: function () { this.abhakModus = "lektionen"; this.zeig("abhaken"); },
    regel: function (e) { this.regelId = e.getAttribute("data-id"); this.zeig("regel"); },
    alleAn: function () { Array.prototype.forEach.call(this.el("v-abhaken").querySelectorAll("input[type=checkbox]"), function (c) { c.checked = true; }); },
    alleAus: function () { Array.prototype.forEach.call(this.el("v-abhaken").querySelectorAll("input[type=checkbox]"), function (c) { c.checked = false; }); },
    abhakenFertig: function () {
      var ids = Array.prototype.map.call(this.el("v-abhaken").querySelectorAll("input[type=checkbox]:checked"), function (c) { return c.value; });
      if (this.abhakModus === "lektionen") {
        var alle = [];
        ids.forEach(function (lek) { KO.lektionen[lek].dinge.forEach(function (d) { alle.push(d.id); }); });
        KO.hakeAb(alle); this.zeig("lektionen");
      } else { KO.hakeAb(ids); this.zeig("lektion"); }
    },
    reiter: function (e) { this.kartenReiter = e.getAttribute("data-r"); this.male_karten(); },
    eigeneNeu: function () {
      var ko = this.el("eKo").value.trim(), de = this.el("eDe").value.trim(), n = this.el("eNotiz").value.trim();
      if (!ko || !de) { this.el("eMeldung").textContent = "Bitte Koreanisch und Deutsch ausfüllen."; return; }
      KO.stand.eigene.push({ id: "e" + KO.jetzt().toString(36), ko: ko, de: de, notiz: n });
      KO.speichere(); this.male_karten();
    },
    eigeneWeg: function (e) {
      var id = e.getAttribute("data-id"), s = KO.stand;
      if (e.getAttribute("data-sicher") !== "1") { e.setAttribute("data-sicher", "1"); e.textContent = "wirklich löschen?"; return; }
      s.eigene = s.eigene.filter(function (x) { return x.id !== id; });
      delete s.karten[id + ":r"]; delete s.karten[id + ":p"]; delete s.gemerkt[id];
      KO.speichere(); this.male_karten();
    },
    sichern: function () {
      var d = new Date(KO.jetzt()), name = "koreanisch-lernstand-" + d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + ".json";
      var a = document.createElement("a"), url = URL.createObjectURL(new Blob([JSON.stringify(KO.stand)], { type: "application/json" }));
      a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
      this.el("sichMeldung").textContent = "Gespeichert als " + name + " (im Download-Ordner).";
    },
    tonLaden: function (e) {
      var m = this.el("tonMeldung"); e.disabled = true; m.textContent = "Lade …";
      KO.ton.ladeAlle(function (f, x, g) { m.textContent = (f + x) + " von " + g + " …"; }).then(function (r) {
        m.textContent = r.fehler ? r.fertig + " Dateien geladen, " + r.fehler + " nicht erreichbar. Später noch einmal versuchen." : "Alle " + r.fertig + " Tondateien liegen auf dem Gerät.";
        e.disabled = false;
      }, function (err) { m.textContent = err.message; e.disabled = false; });
    },
    bericht: function () {
      var P = KO.stand.pruef, ids = Object.keys(P).sort(), t = this.el("pBericht");
      var text = ids.length ? ids.map(function (id) { var d = KO.ding(id), p = P[id]; return id + " | " + (d ? d.ko + " | " + d.de : "?") + " | " + [p.text ? "Text falsch" : "", p.ton ? "Ton falsch" : "", p.k || ""].filter(function (x) { return x; }).join(" · "); }).join("\n") : "Nichts markiert.";
      t.hidden = false; t.value = text; t.focus(); t.select();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(function () {});
    },
    zurueckSetzen: function (e) {
      if (e.getAttribute("data-sicher") !== "1") { e.setAttribute("data-sicher", "1"); e.textContent = "Wirklich alles löschen? Nochmal tippen."; return; }
      KO.stand = KO.leer(); KO.speichere(); this.zeig("heute");
    }
  }
};
document.addEventListener("DOMContentLoaded", function () { UI.start(); });
