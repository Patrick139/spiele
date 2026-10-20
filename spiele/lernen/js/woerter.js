// woerter.js — Woerter mit Bild, Buchstabennamen und Saetze fuer die Handystimme, je Sprache. Kein Modul; globales Objekt WOERTER.
// reihe: Reihenfolge, in der neue Buchstaben dazukommen (zuerst gut hoerbare, deutlich verschiedene). Nur Woerter, deren Anfangsbuchstabe
// klar zu hoeren ist: kein V (klingt wie F oder W), kein "Sch", kein "Au"/"Ei" am Anfang, keine Bilder mit zweitem naheliegendem Namen.

var WOERTER = {
  de: {
    name: "Deutsch",
    reihe: "MALOESRUNTHDFWBKPGZJI",
    namen: { A: "A", B: "Beh", C: "Zeh", D: "Deh", E: "E", F: "Eff", G: "Geh", H: "Ha", I: "I", J: "Jott", K: "Ka", L: "Ell", M: "Emm", N: "Enn", O: "O",
      P: "Peh", Q: "Ku", R: "Err", S: "Ess", T: "Teh", U: "U", V: "Vau", W: "Weh", X: "Ix", Y: "Ypsilon", Z: "Zett" },
    woerter: {
      A: [["Apfel", "🍎"], ["Ananas", "🍍"], ["Affe", "🐒"]],
      B: [["Banane", "🍌"], ["Bär", "🐻"], ["Biene", "🐝"], ["Baum", "🌳"], ["Buch", "📖"]],
      D: [["Delfin", "🐬"], ["Drache", "🐉"], ["Dino", "🦕"]],
      E: [["Ente", "🦆"], ["Elefant", "🐘"], ["Erdbeere", "🍓"]],
      F: [["Fisch", "🐟"], ["Frosch", "🐸"], ["Fuchs", "🦊"], ["Feuer", "🔥"]],
      G: [["Gitarre", "🎸"], ["Geschenk", "🎁"], ["Gurke", "🥒"]],
      H: [["Hund", "🐶"], ["Haus", "🏠"], ["Hase", "🐰"], ["Herz", "❤️"], ["Hut", "🎩"]],
      I: [["Igel", "🦔"], ["Insel", "🏝️"]],
      J: [["Jacke", "🧥"], ["Jojo", "🪀"]],
      K: [["Katze", "🐱"], ["Kuh", "🐮"], ["Käse", "🧀"], ["Krone", "👑"], ["Koala", "🐨"]],
      L: [["Löwe", "🦁"], ["Löffel", "🥄"], ["Lama", "🦙"]],
      M: [["Maus", "🐭"], ["Mond", "🌙"], ["Muschel", "🐚"], ["Milch", "🥛"]],
      N: [["Nase", "👃"], ["Nashorn", "🦏"]],
      O: [["Ohr", "👂"], ["Oktopus", "🐙"], ["Orange", "🍊"]],
      P: [["Pinguin", "🐧"], ["Pizza", "🍕"], ["Pilz", "🍄"], ["Panda", "🐼"]],
      R: [["Rakete", "🚀"], ["Rose", "🌹"], ["Regenbogen", "🌈"], ["Ring", "💍"], ["Raupe", "🐛"]],
      S: [["Sonne", "☀️"], ["Socke", "🧦"], ["Salat", "🥗"]],
      T: [["Tiger", "🐯"], ["Tomate", "🍅"], ["Tasse", "☕"], ["Traktor", "🚜"], ["Teddy", "🧸"]],
      U: [["Uhr", "⌚"], ["Ufo", "🛸"]],
      W: [["Wal", "🐳"], ["Wolke", "☁️"], ["Wolf", "🐺"]],
      Z: [["Zebra", "🦓"], ["Zug", "🚂"], ["Zitrone", "🍋"], ["Zahn", "🦷"]]
    },
    saetze: {
      anlautFrage: function (w) { return "Mit welchem Buchstaben fängt " + w + " an?"; },
      anlautRichtig: function (w, n) { return w + " fängt mit " + n + " an."; },
      lob: ["Super!", "Toll!", "Prima!", "Richtig!", "Sehr gut!"],
      nochmal: "Probier's nochmal.",
      spurenStart: function (n, klein) { return "Fahr das " + (klein ? "kleine " : "große ") + n + " nach."; },
      spurenFertig: function (n, w) { return "Super! " + n + (w ? " wie " + w : "") + "."; },
      plus: function (a, b) { return "Wie viel ist " + a + " plus " + b + "?"; },
      minus: function (a, b) { return "Wie viel ist " + a + " minus " + b + "?"; },
      rechnenRichtig: function (a, op, b, c) { return a + (op === "+" ? " plus " : " minus ") + b + " ist " + c + "."; },
      zaehlTipp: "Tipp die Bilder an und zähl mit.",
      runde: "Super gemacht! Du hast einen Stern bekommen."
    }
  },
  en: {
    name: "English",
    reihe: "SATPMCDGOKEURHBFLNJVWZYQ",
    namen: { A: "ay", B: "bee", C: "see", D: "dee", E: "ee", F: "eff", G: "gee", H: "aitch", I: "eye", J: "jay", K: "kay", L: "el", M: "em", N: "en", O: "oh",
      P: "pee", Q: "cue", R: "ar", S: "ess", T: "tee", U: "you", V: "vee", W: "double you", X: "ex", Y: "why", Z: "zed" },
    woerter: {
      A: [["apple", "🍎"], ["ant", "🐜"]],
      B: [["banana", "🍌"], ["bear", "🐻"], ["bee", "🐝"], ["bus", "🚌"], ["book", "📖"]],
      C: [["cat", "🐱"], ["car", "🚗"], ["cake", "🎂"], ["cow", "🐮"]],
      D: [["dog", "🐶"], ["duck", "🦆"], ["drum", "🥁"], ["dolphin", "🐬"]],
      E: [["egg", "🥚"], ["elephant", "🐘"]],
      F: [["fish", "🐟"], ["frog", "🐸"], ["fox", "🦊"], ["fire", "🔥"]],
      G: [["goat", "🐐"], ["grapes", "🍇"], ["gift", "🎁"], ["guitar", "🎸"]],
      H: [["hat", "🎩"], ["house", "🏠"], ["horse", "🐴"], ["heart", "❤️"]],
      J: [["juice", "🧃"], ["jeans", "👖"]],
      K: [["kite", "🪁"], ["key", "🔑"], ["kangaroo", "🦘"], ["king", "🤴"]],
      L: [["lion", "🦁"], ["lemon", "🍋"], ["leaf", "🍃"]],
      M: [["moon", "🌙"], ["mouse", "🐭"], ["monkey", "🐒"]],
      N: [["nose", "👃"], ["nut", "🥜"]],
      O: [["octopus", "🐙"], ["orange", "🍊"]],
      P: [["pig", "🐷"], ["pizza", "🍕"], ["penguin", "🐧"], ["panda", "🐼"]],
      Q: [["queen", "👸"]],
      R: [["rabbit", "🐰"], ["rocket", "🚀"], ["rainbow", "🌈"], ["ring", "💍"]],
      S: [["sun", "☀️"], ["snake", "🐍"], ["sock", "🧦"], ["star", "⭐"]],
      T: [["tiger", "🐯"], ["tomato", "🍅"], ["train", "🚂"], ["tree", "🌳"]],
      U: [["umbrella", "☂️"]],
      V: [["van", "🚐"], ["violin", "🎻"], ["volcano", "🌋"]],
      W: [["whale", "🐳"], ["watch", "⌚"], ["wolf", "🐺"]],
      Y: [["yo-yo", "🪀"]],
      Z: [["zebra", "🦓"]]
    },
    saetze: {
      anlautFrage: function (w) { return "Which letter does " + w + " start with?"; },
      anlautRichtig: function (w, n) { return w.charAt(0).toUpperCase() + w.slice(1) + " starts with " + n + "."; },
      lob: ["Great!", "Well done!", "Super!", "Yes!", "Brilliant!"],
      nochmal: "Try again.",
      spurenStart: function (n, klein) { return "Trace the " + (klein ? "small" : "big") + " letter " + n + "."; },
      spurenFertig: function (n, w) { return "Great! " + n + (w ? " is for " + w : "") + "."; },
      plus: function (a, b) { return "What is " + a + " plus " + b + "?"; },
      minus: function (a, b) { return "What is " + a + " minus " + b + "?"; },
      rechnenRichtig: function (a, op, b, c) { return a + (op === "+" ? " plus " : " minus ") + b + " is " + c + "."; },
      zaehlTipp: "Tap the pictures and count.",
      runde: "Well done! You got a star."
    }
  }
};
