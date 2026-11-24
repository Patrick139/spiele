// lieder.js — einfache Lieder zum Nachspielen, gemeinsam fuer Gitarre (spiele/gitarre) und Klavier (spiele/lernen/noten).
// Kein Modul; globales Objekt LIEDER. Alle Melodien sind alte Volks- und Kinderlieder bzw. Beethoven (gemeinfrei), alle in C-Dur, 4/4-Takt.
//
// Schreibweise einer Melodie: Toene durch Leerzeichen getrennt, Takte durch "|".
//   c d e f g a h   Stammtoene (deutsch: h, nicht b), von c aufwaerts
//   ,g              Komma davor: eine Oktave tiefer (das g unter dem c)
//   c'              Strich dahinter: eine Oktave hoeher
//   g2  g4  g1.5    Zahl dahinter: Dauer in Schlaegen (ohne Zahl 1 = Viertelnote)
//   g/              Schraegstrich: halber Schlag (Achtelnote)
// LIEDER.toene(lied, c) liefert die Toene als Liste {m, dauer, takt, name}; c = MIDI-Nummer, auf der das "c" liegen soll
// (Klavier 60 = c′, Gitarre 48 = klingendes c, A-Saite 3. Bund).
var LIEDER = {
  liste: [
    { id: "entchen", titel: "Alle meine Entchen", tempo: 100,
      noten: "c d e f | g2 g2 | a a a a | g4 | a a a a | g4 | f f f f | e2 e2 | d d d d | c4" },
    { id: "haenschen", titel: "Hänschen klein", tempo: 108,
      noten: "g e e2 | f d d2 | c d e f | g g g2 | g e e2 | f d d2 | c e g g | c4 | " +
             "d d d d | d e f2 | e e e e | e f g2 | g e e2 | f d d2 | c e g g | c4" },
    { id: "jakob", titel: "Bruder Jakob", tempo: 104,
      noten: "c d e c | c d e c | e f g2 | e f g2 | g/ a/ g/ f/ e c | g/ a/ g/ f/ e c | c ,g c2 | c ,g c2" },
    { id: "freude", titel: "Freude schöner Götterfunken", tempo: 112,
      noten: "e e f g | g f e d | c c d e | e1.5 d/ d2 | e e f g | g f e d | c c d e | d1.5 c/ c2 | " +
             "d d e c | d e/ f/ e c | d e/ f/ e d | c d ,g2 | e e f g | g f e d | c c d e | d1.5 c/ c2" },
    { id: "weihnachtsmann", titel: "Morgen kommt der Weihnachtsmann", tempo: 104,
      noten: "c c g g | a a g2 | f f e e | d d c2 | g g f f | e e d2 | g g f f | e e d2 | c c g g | a a g2 | f f e e | d d c2" }
  ],
  STUFE: { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, h: 11 },
  finde: function (id) { for (var i = 0; i < this.liste.length; i++) if (this.liste[i].id === id) return this.liste[i]; return null; },
  toene: function (lied, c) {
    var aus = [], self = this;
    lied.noten.split("|").forEach(function (takt, nr) {
      takt.trim().split(/\s+/).forEach(function (z) {
        var m = /^(,*)([cdefgah])('*)(\/|[0-9.]+)?$/.exec(z);
        if (!m) return;
        aus.push({ m: c + self.STUFE[m[2]] + 12 * (m[3].length - m[1].length), dauer: m[4] === "/" ? 0.5 : m[4] ? parseFloat(m[4]) : 1, takt: nr, name: m[2].toUpperCase() });
      });
    });
    return aus;
  }
};
