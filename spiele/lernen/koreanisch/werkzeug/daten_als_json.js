// daten_als_json.js — gibt alle Wörter und Sätze der Datendateien als JSON aus: [{id, ko}, …]. Aufruf: node werkzeug/daten_als_json.js
var fs = require("fs"), path = require("path"), aus = [];
global.KO = { block: function (b) {
  b.lektionen.forEach(function (l) {
    (l.w || []).forEach(function (e, i) { if (e) aus.push({ id: l.id + "w" + (i + 1), ko: e[0], de: e[1], art: "w" }); });
    (l.s || []).forEach(function (e, i) { if (e) aus.push({ id: l.id + "s" + (i + 1), ko: e[0], de: e[1], art: "s" }); });
  });
} };
var ordner = path.join(__dirname, "..", "daten");
fs.readdirSync(ordner).filter(function (f) { return /\.js$/.test(f); }).sort().forEach(function (f) { require(path.join(ordner, f)); });
process.stdout.write(JSON.stringify(aus));
