// daten_als_json.js — gibt alle Wörter, Sätze und Grammatik-Beispiele der Datendateien als JSON aus: [{id, ko}, …]. Aufruf: node werkzeug/daten_als_json.js
var fs = require("fs"), path = require("path"), aus = [];
global.KO = { block: function (b) {
  b.lektionen.forEach(function (l) {
    (l.w || []).forEach(function (e, i) { if (e) aus.push({ id: l.id + "w" + (i + 1), ko: e[0], de: e[1], art: "w" }); });
    (l.s || []).forEach(function (e, i) { if (e) aus.push({ id: l.id + "s" + (i + 1), ko: e[0], de: e[1], art: "s" }); });
  });
}, grammatik: function (g) {
  var ohne = function (t) { return t.replace(/[\[\]]/g, ""); };
  var nimm = function (id, liste) { (liste || []).forEach(function (b, i) { if (b) aus.push({ id: id + "b" + (i + 1), ko: ohne(b[0]), de: b[1], art: "g" }); }); };
  (g.grund || []).forEach(function (r) { nimm(r.id, r.bsp); });
  Object.keys(g.regeln || {}).forEach(function (id) { nimm(id, g.regeln[id].bsp); });
} };
var ordner = path.join(__dirname, "..", "daten");
fs.readdirSync(ordner).filter(function (f) { return /\.js$/.test(f); }).sort().forEach(function (f) { require(path.join(ordner, f)); });
process.stdout.write(JSON.stringify(aus));
