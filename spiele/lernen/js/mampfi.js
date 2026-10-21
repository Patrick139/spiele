// mampfi.js — Mampfi, das Monster der Kinderecke: eigene Zeichnung (SVG), Gesichter und Bewegungen, Sprechblase, Quatsch-Sprueche.
// Zustaende (Klasse am Rahmen, CSS in index.html): offen (Mund auf, wartet aufs Essen), kaut, freut, tanzt, verwirrt, ruelpst, lacht, zwinkert,
// verliebt (Herzaugen), begeistert (Sternaugen), staunt, erschrickt, frech (Zunge raus), schielt, gaehnt, schlaeft, niest, denkt.
// Dazu: Die Augen schauen dorthin, wo getippt wird. Wird eine Weile nicht getippt, gaehnt Mampfi und schlaeft dann ein; Antippen weckt ihn.
// Kein Modul; globales Objekt MAMPFI.

var MAMPFI = {
  SVG: (function () {
    var herz = function (x, y) {
      return "M" + x + " " + (y + 14) + " C" + (x - 18) + " " + (y + 2) + " " + (x - 20) + " " + (y - 11) + " " + (x - 11) + " " + (y - 15) +
        " C" + (x - 6) + " " + (y - 17) + " " + (x - 1) + " " + (y - 13) + " " + x + " " + (y - 8) +
        " C" + (x + 1) + " " + (y - 13) + " " + (x + 6) + " " + (y - 17) + " " + (x + 11) + " " + (y - 15) +
        " C" + (x + 20) + " " + (y - 11) + " " + (x + 18) + " " + (y + 2) + " " + x + " " + (y + 14) + " Z";
    };
    var stern = function (x, y) {
      var p = [];
      for (var i = 0; i < 10; i++) { var r = i % 2 ? 7.5 : 18, w = (i * 36 - 90) * Math.PI / 180; p.push((x + r * Math.cos(w)).toFixed(1) + " " + (y + r * Math.sin(w)).toFixed(1)); }
      return "M" + p.join(" L") + " Z";
    };
    var strich = ' fill="none" stroke="#2b2233" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"';
    return '<svg viewBox="0 0 200 212" aria-hidden="true">' +
      '<ellipse cx="100" cy="203" rx="62" ry="8" fill="rgba(80,50,10,.13)"/>' +
      '<g class="m-koerper">' +
        '<ellipse cx="70" cy="190" rx="22" ry="12" fill="#3aa884"/><ellipse cx="130" cy="190" rx="22" ry="12" fill="#3aa884"/>' +
        '<g class="m-arm m-arm-l"><ellipse cx="33" cy="128" rx="13" ry="25" fill="#49bf98" transform="rotate(28 33 128)"/></g>' +
        '<g class="m-arm m-arm-r"><ellipse cx="167" cy="128" rx="13" ry="25" fill="#49bf98" transform="rotate(-28 167 128)"/></g>' +
        '<path d="M66 54 L56 20 L86 45 Z" fill="#ffb347"/><path d="M134 54 L144 20 L114 45 Z" fill="#ffb347"/>' +
        '<path d="M100 38 C150 38 173 80 173 123 C173 170 140 194 100 194 C60 194 27 170 27 123 C27 80 50 38 100 38 Z" fill="#5ccfa8"/>' +
        '<circle cx="58" cy="78" r="6" fill="#4cbf98"/><circle cx="146" cy="88" r="8" fill="#4cbf98"/><circle cx="150" cy="150" r="5" fill="#4cbf98"/><circle cx="48" cy="152" r="7" fill="#4cbf98"/>' +
        '<ellipse cx="100" cy="155" rx="42" ry="31" fill="#cbf6e6"/>' +
        // Augen: je Auge eine Gruppe, Pupillen einzeln (fuer Blick, Schielen, Zwinkern)
        '<g class="m-augen">' +
          '<g class="m-auge m-auge-l"><circle cx="78" cy="92" r="19" fill="#fff"/><g class="m-pup m-pup-l"><circle cx="80" cy="95" r="8.5" fill="#2b2233"/><circle cx="83" cy="91" r="3" fill="#fff"/></g></g>' +
          '<g class="m-auge m-auge-r"><circle cx="122" cy="92" r="19" fill="#fff"/><g class="m-pup m-pup-r"><circle cx="124" cy="95" r="8.5" fill="#2b2233"/><circle cx="127" cy="91" r="3" fill="#fff"/></g></g>' +
        '</g>' +
        '<g class="m-lider"><path d="M57 93 A21 21 0 0 1 99 93 Z" fill="#5ccfa8"/><path d="M101 93 A21 21 0 0 1 143 93 Z" fill="#5ccfa8"/>' +
          '<path d="M59 93 L97 93 M103 93 L141 93" fill="none" stroke="#2b2233" stroke-width="4.5" stroke-linecap="round"/></g>' +
        '<path class="m-froh-l" d="M62 98 Q78 78 94 98"' + strich + '/>' +
        '<path class="m-froh-r" d="M106 98 Q122 78 138 98"' + strich + '/>' +
        '<path class="m-zu" d="M62 91 Q78 104 94 91 M106 91 Q122 104 138 91"' + strich + '/>' +
        '<path class="m-kneif" d="M67 82 L90 93 L67 104 M133 82 L110 93 L133 104"' + strich + '/>' +
        '<g class="m-herzen"><path class="m-herz" d="' + herz(78, 92) + '" fill="#ff4f7b" stroke="#c9244f" stroke-width="2"/><path class="m-herz" d="' + herz(122, 92) + '" fill="#ff4f7b" stroke="#c9244f" stroke-width="2"/></g>' +
        '<g class="m-sterne"><path class="m-stern" d="' + stern(78, 92) + '" fill="#ffcf3d" stroke="#e0a91f" stroke-width="2.5" stroke-linejoin="round"/>' +
          '<path class="m-stern" d="' + stern(122, 92) + '" fill="#ffcf3d" stroke="#e0a91f" stroke-width="2.5" stroke-linejoin="round"/></g>' +
        '<g class="m-brauen"><path d="M60 68 L94 76" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/><path d="M140 68 L108 74" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/></g>' +
        '<path class="m-brauen-hoch" d="M60 64 Q78 52 95 61 M105 61 Q122 52 140 64" fill="none" stroke="#2b2233" stroke-width="5.5" stroke-linecap="round"/>' +
        '<g class="m-rot"><ellipse cx="57" cy="121" rx="10" ry="6" fill="#ff9bb5" opacity=".75"/><ellipse cx="143" cy="121" rx="10" ry="6" fill="#ff9bb5" opacity=".75"/></g>' +
        // Muender
        '<g class="m-zunge"><path d="M90 129 Q89 152 100 153 Q111 152 110 129 Z" fill="#ff7a9a" stroke="#2b2233" stroke-width="3"/><path d="M100 134 L100 145" stroke="#e0567a" stroke-width="2.5" stroke-linecap="round"/></g>' +
        '<path class="m-mund-zu" d="M76 122 Q100 143 124 122" fill="none" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/>' +
        '<g class="m-mund-auf"><path d="M68 117 Q100 110 132 117 Q130 156 100 158 Q70 156 68 117 Z" fill="#7a1f3d"/>' +
          '<ellipse cx="100" cy="147" rx="17" ry="8" fill="#ff7a9a"/><rect x="83" y="115" width="11" height="10" rx="2" fill="#fff"/><rect x="106" y="115" width="11" height="10" rx="2" fill="#fff"/></g>' +
        '<path class="m-mund-schief" d="M80 136 Q92 126 104 132 T124 128" fill="none" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/>' +
        '<g class="m-mund-o"><ellipse cx="100" cy="134" rx="10" ry="13" fill="#7a1f3d" stroke="#2b2233" stroke-width="2"/><ellipse cx="100" cy="141" rx="6" ry="4" fill="#ff7a9a"/></g>' +
        '<g class="m-mund-gaehn"><ellipse cx="100" cy="135" rx="17" ry="22" fill="#7a1f3d" stroke="#2b2233" stroke-width="2"/><ellipse cx="100" cy="148" rx="11" ry="7" fill="#ff7a9a"/></g>' +
        '<g class="m-backen"><circle cx="64" cy="128" r="14" fill="#6fe0b9"/><circle cx="136" cy="128" r="14" fill="#6fe0b9"/></g>' +
        '<path class="m-tropfen" d="M156 52 Q165 68 156 74 Q147 68 156 52 Z" fill="#bfeeff" stroke="#3fa9d6" stroke-width="2.5"/>' +
      '</g>' +
      '<g class="m-zzz" fill="#3fa9d6" font-weight="900"><text x="148" y="46" font-size="20">z</text><text x="162" y="30" font-size="26">Z</text><text x="178" y="12" font-size="32">Z</text></g>' +
      '</svg>';
  })(),

  SPRUECHE: {
    de: {
      hallo: ["Hallo! Ich bin Mampfi!", "Hast du was zu essen für mich?", "Ich hab so einen Hunger!", "Spielen wir was?"],
      lecker: ["Mampf, mampf!", "Lecker!", "Hmmm, köstlich!", "Mehr davon!", "Njam njam!"],
      ruelps: ["Rülps! Oh, Entschuldigung!", "Hupps! Pardon!", "Bäärp! Hihi!"],
      jubel: ["Juhu!", "Hurra!", "Du bist super!", "Wahnsinn!", "Yippie!", "Toll gemacht!"],
      ups: ["Hä?", "Hmm, komisch.", "Ups!", "Hmmm …", "Nochmal!"],
      lacht: ["Hihi, das kitzelt!", "Hahaha!", "Nicht kitzeln! Hihi!"],
      frech: ["Bäääh!", "Ätsch!"],
      niest: ["Hatschi!", "Ha… Hatschi!"],
      zwinkert: ["Psst! Ich hab Hunger.", "Hallo, du!"],
      schielt: ["Huiii, mir ist schwindlig!", "Wo bin ich?"],
      verliebt: ["Ich hab dich gern!", "Du bist mein Lieblingsmensch!"],
      staunt: ["Oh! Hallo!", "Wow!"],
      tanzt: ["Tanz mit mir!", "Lalala!"],
      genug: ["Hör auf! Hihihi!", "Hilfe, das kitzelt so!"],
      gaehnt: ["Uaaah …", "Mir ist langweilig …"],
      wach: ["Huch! Ich bin wach!", "Was? Ich hab nicht geschlafen!"],
      stufe: ["Juhu! Jetzt wird's spannend!", "Stufe geschafft!"]
    },
    en: {
      hallo: ["Hello! I'm Mampfi!", "Do you have some food for me?", "I'm so hungry!", "Shall we play?"],
      lecker: ["Yum yum!", "Delicious!", "Mmm, tasty!", "More, please!", "Nom nom!"],
      ruelps: ["Burp! Oops, excuse me!", "Whoops! Pardon me!", "Buuurp! Hee hee!"],
      jubel: ["Hooray!", "Yippee!", "You're super!", "Amazing!", "Woohoo!", "Well done!"],
      ups: ["Huh?", "Hmm, funny.", "Oops!", "Hmmm …", "Try again!"],
      lacht: ["Hee hee, that tickles!", "Ha ha ha!", "Don't tickle me! Hee hee!"],
      frech: ["Bleeeh!", "Nah nah!"],
      niest: ["Achoo!", "Ah… Achoo!"],
      zwinkert: ["Psst! I'm hungry.", "Hello, you!"],
      schielt: ["Whee, I'm dizzy!", "Where am I?"],
      verliebt: ["I like you!", "You're my favourite!"],
      staunt: ["Oh! Hello!", "Wow!"],
      tanzt: ["Dance with me!", "La la la!"],
      genug: ["Stop it! Hee hee hee!", "Help, that tickles so much!"],
      gaehnt: ["Yaaawn …", "I'm bored …"],
      wach: ["Whoa! I'm awake!", "What? I wasn't sleeping!"],
      stufe: ["Woohoo! Now it gets exciting!", "Level done!"]
    }
  },
  spruch: function (art) { var l = (this.SPRUECHE[LERNEN.sprache] || this.SPRUECHE.de)[art] || [""]; return l[Math.floor(Math.random() * l.length)]; },

  // Mampfi in ein Element setzen (leert es)
  einsetzen: function (el) {
    el.classList.add("mampfi"); el.innerHTML = this.SVG + '<div class="m-blase weg"></div>';
    return el;
  },
  ZUSTAENDE: ["offen", "kaut", "freut", "verwirrt", "tanzt", "ruelpst", "lacht", "zwinkert", "verliebt", "begeistert", "staunt", "erschrickt",
    "frech", "schielt", "gaehnt", "schlaeft", "niest", "denkt"],
  setze: function (el, zustand, ms) {
    if (!el) return;
    this.ZUSTAENDE.forEach(function (z) { el.classList.remove("m-" + z); });
    void el.offsetWidth;                                     // Animation neu starten
    if (zustand) el.classList.add("m-" + zustand);
    if (zustand !== "schlaeft") el._schlaeft = false;
    clearTimeout(el._mT);
    if (ms) el._mT = setTimeout(function () { MAMPFI.setze(el, el._mRuhe || null); }, ms);
  },
  ruhe: function (el, zustand) { el._mRuhe = zustand || null; this.setze(el, el._mRuhe); },   // Zustand, zu dem er nach jeder Reaktion zurueckkehrt
  blase: function (el, text, ms) {
    var b = el && el.querySelector(".m-blase");
    if (!b) return;
    b.textContent = text; b.classList.remove("weg");
    clearTimeout(b._t); b._t = setTimeout(function () { b.classList.add("weg"); }, ms || 1800);
  },
  // Zufaellig aus einer Liste, aber nicht zweimal hintereinander dasselbe
  wahl: function (el, liste) {
    var l = liste.filter(function (x) { return x !== el._letzte; }), a = l[Math.floor(Math.random() * l.length)] || liste[0];
    el._letzte = a; return a;
  },

  // Kleine Vorstellungen, die die Spiele benutzen
  frisst: function (el, mitRuelpser) {
    this.setze(el, "kaut", 900); TOENE.mampf();
    var self = this;
    setTimeout(function () {
      if (mitRuelpser) { self.setze(el, "ruelpst", 900); TOENE.ruelps(); self.blase(el, self.spruch("ruelps"), 1600); }
      else { self.setze(el, self.wahl(el, ["freut", "lacht", "verliebt", "zwinkert"]), 1100); self.blase(el, self.spruch("lecker"), 1300); }
    }, 950);
  },
  jubelt: function (el) {
    var art = this.wahl(el, ["freut", "tanzt", "lacht", "zwinkert", "verliebt", "freut", "tanzt"]);
    this.setze(el, art, 1500); this.blase(el, this.spruch("jubel"), 1400);
  },
  wundert: function (el) {
    var art = this.wahl(el, ["verwirrt", "staunt", "schielt", "denkt"]);
    this.setze(el, art, 1300); TOENE.hae(); this.blase(el, this.spruch("ups"), 1200);
  },
  begeistert: function (el) {
    if (!el) return;
    this.setze(el, "begeistert", 2000); TOENE.stufe(); this.blase(el, this.spruch("stufe"), 1900);
  },
  // Antippen: jedes Mal ein anderes Gesicht; wer ganz oft kitzelt, bringt ihn zum Lachen
  kitzeln: function (el) {
    if (el._geweckt && Date.now() - el._geweckt < 400) return;                // wurde gerade aufgeweckt
    var jetzt = Date.now();
    el._kitzel = (el._kitzel || []).filter(function (t) { return jetzt - t < 4000; }); el._kitzel.push(jetzt);
    var art, t;
    if (el._kitzel.length >= 5) { art = "lacht"; t = this.spruch("genug"); el._kitzel = []; }
    else {
      art = this.wahl(el, ["hallo", "lacht", "frech", "niest", "zwinkert", "schielt", "verliebt", "staunt", "tanzt"]);
      t = this.spruch(art);
      if (art === "hallo") art = "freut";
    }
    this.setze(el, art, art === "lacht" ? 1500 : 1300); this.blase(el, t, 1900);
    if (art === "lacht") TOENE.kichern(); else if (art === "niest") TOENE.hatschi();
    LERNEN.sagNur(t);
  },

  // ---- Augen folgen dem Finger; gaehnen und einschlafen, wenn lange niemand tippt ----
  GAEHNEN: 25000, SCHLAFEN: 45000,
  letzte: 0, gegaehnt: false,
  sichtbar: function () {
    return Array.prototype.filter.call(document.querySelectorAll(".schirm:not(.weg) .mampfi"), function (m) { return m.getBoundingClientRect().width > 30; });
  },
  schau: function (x, y) {
    this.sichtbar().forEach(function (m) {
      var r = m.getBoundingClientRect(), ax = r.left + r.width * 0.5, ay = r.top + r.width * 92 / 200;
      var dx = x - ax, dy = y - ay, d = Math.hypot(dx, dy), k = d < 2 ? 0 : Math.min(1, d / 140) * 6 / d;
      m.style.setProperty("--bx", (dx * k).toFixed(1) + "px"); m.style.setProperty("--by", (dy * k).toFixed(1) + "px");
      clearTimeout(m._bT); m._bT = setTimeout(function () { m.style.setProperty("--bx", "0px"); m.style.setProperty("--by", "0px"); }, 2500);
    });
  },
  wecken: function () {
    var self = this;
    this.letzte = Date.now(); this.gegaehnt = false;
    this.sichtbar().forEach(function (m) {
      if (!m._schlaeft) return;
      m._schlaeft = false; m._geweckt = Date.now();
      self.setze(m, "erschrickt", 1000); TOENE.schreck(); self.blase(m, self.spruch("wach"), 1600);
    });
  },
  pruefeRuhe: function () {
    var still = Date.now() - this.letzte, self = this;
    if (window.speechSynthesis && speechSynthesis.speaking) { this.letzte = Date.now(); return; }
    if (still > this.SCHLAFEN) {
      this.sichtbar().forEach(function (m) { if (!m._schlaeft && !m.classList.contains("mini-m")) { self.setze(m, "schlaeft"); m._schlaeft = true; } });
    } else if (still > this.GAEHNEN && !this.gegaehnt) {
      this.gegaehnt = true;
      var l = this.sichtbar().filter(function (m) { return !m.classList.contains("mini-m"); });
      l.forEach(function (m) { self.setze(m, "gaehnt", 2300); self.blase(m, self.spruch("gaehnt"), 2000); });
      if (l.length) TOENE.gaehn();
    }
  },
  init: function () {
    var self = this;
    this.letzte = Date.now();
    document.addEventListener("pointerdown", function (e) { self.wecken(); self.schau(e.clientX, e.clientY); }, true);
    document.addEventListener("pointermove", function (e) {
      if (!e.buttons) return;
      var j = Date.now(); if (j - (self._mv || 0) < 60) return; self._mv = j;
      self.letzte = j; self.schau(e.clientX, e.clientY);
    }, true);
    setInterval(function () { self.pruefeRuhe(); }, 1000);
  }
};
