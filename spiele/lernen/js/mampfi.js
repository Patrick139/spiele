// mampfi.js — Mampfi, das Monster der Kinderecke: eigene Zeichnung (SVG), Gesichter und Bewegungen, Sprechblase, Quatsch-Sprueche.
// Zustaende (Klasse am Rahmen): offen (Mund auf, wartet aufs Essen), kaut, freut, verwirrt, tanzt, ruelpst. Kein Modul; globales Objekt MAMPFI.

var MAMPFI = {
  SVG: '<svg viewBox="0 0 200 212" aria-hidden="true">' +
    '<ellipse cx="100" cy="203" rx="62" ry="8" fill="rgba(80,50,10,.13)"/>' +
    '<g class="m-koerper">' +
      '<ellipse cx="70" cy="190" rx="22" ry="12" fill="#3aa884"/><ellipse cx="130" cy="190" rx="22" ry="12" fill="#3aa884"/>' +
      '<g class="m-arm m-arm-l"><ellipse cx="33" cy="128" rx="13" ry="25" fill="#49bf98" transform="rotate(28 33 128)"/></g>' +
      '<g class="m-arm m-arm-r"><ellipse cx="167" cy="128" rx="13" ry="25" fill="#49bf98" transform="rotate(-28 167 128)"/></g>' +
      '<path d="M66 54 L56 20 L86 45 Z" fill="#ffb347"/><path d="M134 54 L144 20 L114 45 Z" fill="#ffb347"/>' +
      '<path d="M100 38 C150 38 173 80 173 123 C173 170 140 194 100 194 C60 194 27 170 27 123 C27 80 50 38 100 38 Z" fill="#5ccfa8"/>' +
      '<circle cx="58" cy="78" r="6" fill="#4cbf98"/><circle cx="146" cy="88" r="8" fill="#4cbf98"/><circle cx="150" cy="150" r="5" fill="#4cbf98"/><circle cx="48" cy="152" r="7" fill="#4cbf98"/>' +
      '<ellipse cx="100" cy="155" rx="42" ry="31" fill="#cbf6e6"/>' +
      '<g class="m-augen"><circle cx="78" cy="92" r="19" fill="#fff"/><circle cx="122" cy="92" r="19" fill="#fff"/>' +
        '<g class="m-pupillen"><circle cx="80" cy="95" r="8.5" fill="#2b2233"/><circle cx="124" cy="95" r="8.5" fill="#2b2233"/>' +
        '<circle cx="83" cy="91" r="3" fill="#fff"/><circle cx="127" cy="91" r="3" fill="#fff"/></g></g>' +
      '<g class="m-brauen"><path d="M60 68 L94 76" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/><path d="M140 68 L108 74" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/></g>' +
      '<ellipse cx="57" cy="121" rx="10" ry="6" fill="#ff9bb5" opacity=".75"/><ellipse cx="143" cy="121" rx="10" ry="6" fill="#ff9bb5" opacity=".75"/>' +
      '<path class="m-mund-zu" d="M76 122 Q100 143 124 122" fill="none" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/>' +
      '<g class="m-mund-auf"><path d="M68 117 Q100 110 132 117 Q130 156 100 158 Q70 156 68 117 Z" fill="#7a1f3d"/>' +
        '<ellipse cx="100" cy="147" rx="17" ry="8" fill="#ff7a9a"/><rect x="83" y="115" width="11" height="10" rx="2" fill="#fff"/><rect x="106" y="115" width="11" height="10" rx="2" fill="#fff"/></g>' +
      '<path class="m-mund-schief" d="M80 136 Q92 126 104 132 T124 128" fill="none" stroke="#2b2233" stroke-width="6" stroke-linecap="round"/>' +
      '<g class="m-backen"><circle cx="64" cy="128" r="14" fill="#6fe0b9"/><circle cx="136" cy="128" r="14" fill="#6fe0b9"/></g>' +
    '</g></svg>',

  SPRUECHE: {
    de: {
      hallo: ["Hallo! Ich bin Mampfi!", "Hast du was zu essen für mich?", "Kitzel mich nicht! Hihi!", "Ich hab so einen Hunger!", "Spielen wir was?"],
      lecker: ["Mampf, mampf!", "Lecker!", "Hmmm, köstlich!", "Mehr davon!", "Njam njam!"],
      ruelps: ["Rülps! Oh, Entschuldigung!", "Hupps! Pardon!", "Bäärp! Hihi!"],
      jubel: ["Juhu!", "Hurra!", "Du bist super!", "Wahnsinn!", "Yippie!"],
      ups: ["Hä?", "Hmm, komisch.", "Ups!", "Das schmeckt seltsam.", "Nochmal!"]
    },
    en: {
      hallo: ["Hello! I'm Mampfi!", "Do you have some food for me?", "Don't tickle me! Hee hee!", "I'm so hungry!", "Shall we play?"],
      lecker: ["Yum yum!", "Delicious!", "Mmm, tasty!", "More, please!", "Nom nom!"],
      ruelps: ["Burp! Oops, excuse me!", "Whoops! Pardon me!", "Buuurp! Hee hee!"],
      jubel: ["Hooray!", "Yippee!", "You're super!", "Amazing!", "Woohoo!"],
      ups: ["Huh?", "Hmm, funny.", "Oops!", "That tastes strange.", "Try again!"]
    }
  },
  spruch: function (art) { var l = (this.SPRUECHE[LERNEN.sprache] || this.SPRUECHE.de)[art] || [""]; return l[Math.floor(Math.random() * l.length)]; },

  // Mampfi in ein Element setzen (leert es)
  einsetzen: function (el) {
    el.classList.add("mampfi"); el.innerHTML = this.SVG + '<div class="m-blase weg"></div>';
    return el;
  },
  ZUSTAENDE: ["offen", "kaut", "freut", "verwirrt", "tanzt", "ruelpst"],
  setze: function (el, zustand, ms) {
    if (!el) return;
    this.ZUSTAENDE.forEach(function (z) { el.classList.remove("m-" + z); });
    void el.offsetWidth;                                     // Animation neu starten
    if (zustand) el.classList.add("m-" + zustand);
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
  // Kleine Vorstellungen, die die Spiele benutzen
  frisst: function (el, mitRuelpser) {
    this.setze(el, "kaut", 900); TOENE.mampf();
    var self = this;
    setTimeout(function () {
      if (mitRuelpser) { self.setze(el, "ruelpst", 900); TOENE.ruelps(); self.blase(el, self.spruch("ruelps"), 1600); }
      else self.blase(el, self.spruch("lecker"), 1300);
    }, 950);
  },
  jubelt: function (el) { this.setze(el, Math.random() < 0.5 ? "freut" : "tanzt", 1400); this.blase(el, this.spruch("jubel"), 1400); },
  wundert: function (el) { this.setze(el, "verwirrt", 1100); TOENE.hae(); this.blase(el, this.spruch("ups"), 1200); },
  // Antippen: kichern und etwas sagen
  kitzeln: function (el) {
    var t = this.spruch("hallo");
    this.setze(el, "freut", 900); this.blase(el, t, 1800); LERNEN.sagNur(t);
  }
};
