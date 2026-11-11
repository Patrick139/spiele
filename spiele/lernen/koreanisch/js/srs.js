// srs.js — Wiederholung nach Intervall (FSRS 4.5 mit Standardgewichten, dasselbe Verfahren wie in Anki).
// Jede Karte hat eine Stabilität s (Tage, nach denen man sie noch zu 90 % weiß) und eine Schwierigkeit d (1 leicht … 10 schwer).
// Bewertungen: 1 = nicht gewusst, 3 = gewusst, 4 = leicht. Zeit wird in ganzen Lerntagen gerechnet (Tageswechsel um 4 Uhr früh).
// Kein Modul; globales Objekt SRS.
var SRS = {
  W: [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755],
  ZERFALL: -0.5, FAKTOR: 19 / 81, MAX_TAGE: 365,

  // Lerntag als fortlaufende Nummer; der Tag wechselt um 4 Uhr, damit spätes Lernen noch zum selben Tag zählt.
  tagNr: function (ms) {
    var d = new Date(ms - 4 * 3600000);
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  },
  grenze: function (x, lo, hi) { return Math.min(hi, Math.max(lo, x)); },
  // Wahrscheinlichkeit, die Karte nach t Tagen noch zu wissen
  abruf: function (t, s) { return Math.pow(1 + this.FAKTOR * t / s, this.ZERFALL); },
  d0: function (g) { return this.grenze(this.W[4] - (g - 3) * this.W[5], 1, 10); },

  // Erste Bewertung einer neuen Karte
  neu: function (g, heute) {
    var k = { s: this.W[g - 1], d: this.d0(g), l: heute, n: 1, x: 0 };
    k.f = heute + this.abstand(k.s, "");
    return k;
  },
  // Bewertung einer schon gelernten Karte; liefert die neue Fassung, ändert k nicht
  bewerte: function (k, g, heute, kennung) {
    var W = this.W, t = Math.max(0, heute - k.l), r = this.abruf(t, k.s), neu = { n: k.n, x: k.x, l: heute };
    neu.d = this.grenze(W[7] * this.d0(3) + (1 - W[7]) * (k.d - W[6] * (g - 3)), 1, 10);
    if (g === 1) {
      neu.s = Math.min(k.s, W[11] * Math.pow(k.d, -W[12]) * (Math.pow(k.s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));
      neu.s = Math.max(0.1, neu.s); neu.x = k.x + 1;
      neu.f = heute + 1;
    } else {
      var bonus = g === 4 ? W[16] : 1;
      neu.s = k.s * (1 + Math.exp(W[8]) * (11 - k.d) * Math.pow(k.s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * bonus);
      neu.n = k.n + 1;
      neu.f = heute + this.abstand(neu.s, kennung || "");
    }
    return neu;
  },
  // Stabilität → Abstand in Tagen (bei 90 % Behaltensziel gleich der Stabilität), ab einer Woche um bis zu 5 % gestreut,
  // damit Karten, die am selben Tag gelernt wurden, nicht für immer am selben Tag fällig werden.
  abstand: function (s, kennung) {
    var tage = Math.max(1, Math.round(s));
    if (tage >= 7 && kennung) {
      var h = 0; for (var i = 0; i < kennung.length; i++) h = (h * 31 + kennung.charCodeAt(i)) % 1000;
      tage = Math.round(tage * (0.95 + 0.1 * h / 999));
    }
    return Math.min(this.MAX_TAGE, tage);
  },
  // Für die Anzeige unter den Knöpfen: Abstand in Tagen, wenn jetzt so bewertet würde
  vorschau: function (k, g, heute, kennung) {
    var n = k ? this.bewerte(k, g, heute, kennung) : this.neu(g, heute);
    return n.f - heute;
  },
  // Karte, die bei der Einstufung als bekannt abgehakt wurde: wird in 1 bis 3 Wochen zum ersten Mal geprüft
  bekannt: function (heute, kennung) {
    var h = 0; for (var i = 0; i < kennung.length; i++) h = (h * 31 + kennung.charCodeAt(i)) % 1000;
    return { s: 20, d: 5, l: heute, n: 1, x: 0, f: heute + 7 + (h % 15) };
  }
};
