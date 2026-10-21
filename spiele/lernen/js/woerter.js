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
    }
  }
};
