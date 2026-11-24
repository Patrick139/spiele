// pruefe.mjs — Prüfungen ohne Browser und ohne fremde Pakete. Aufruf im Hauptverzeichnis: node tests/pruefe.mjs
//   1. Syntax aller Skripte (Dateien und Skripte in den HTML-Seiten)
//   2. Verweise in den HTML-Seiten (src, href) zeigen auf vorhandene Dateien
//   3. Liste DATEIEN in sw.js stimmt mit den vorhandenen Dateien überein
//   4. Lieder: jeder Takt hat vier Schläge, jeder Ton ist auf Gitarre (erste Lage) und Klavier spielbar
//   5. Koreanisch: Kennungen eindeutig, zu jedem Eintrag eine Tondatei, Grammatikseiten passen zu den Lektionen
// Mit --sw wird die Liste in sw.js neu geschrieben und VERSION um eins erhöht (nach dem Anlegen oder Löschen von Dateien).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lies = p => fs.readFileSync(path.join(WURZEL, p), "utf8");
const gibt = p => fs.existsSync(path.join(WURZEL, p));
const fehler = [];
const melde = (wo, was) => fehler.push(wo + ": " + was);

// Dateien, die nicht ausgeliefert werden müssen oder nicht vorab in die Offline-Ablage gehören
const NICHT_IN_ABLAGE = [/^\.git/, /^\.nojekyll$/, /^tests\//, /\.md$/, /^sw\.js$/, /\/ton\//, /\/werkzeug\//, /\/\.gitignore$/, /node_modules\//, /__pycache__/];
function alleDateien(ordner = "") {
  let aus = [];
  for (const e of fs.readdirSync(path.join(WURZEL, ordner), { withFileTypes: true })) {
    const p = ordner ? ordner + "/" + e.name : e.name;
    if (e.name === ".git" || e.name === "node_modules") continue;
    if (e.isDirectory()) aus = aus.concat(alleDateien(p)); else aus.push(p);
  }
  return aus;
}
const dateien = alleDateien();

// ---------- 1. Syntax ----------
function syntax(code, name) { try { new vm.Script(code, { filename: name }); } catch (e) { melde(name, "Syntaxfehler: " + e.message); } }
dateien.filter(d => d.endsWith(".js") && !d.startsWith("tests/")).forEach(d => syntax(lies(d), d));
const seiten = dateien.filter(d => d.endsWith(".html"));
seiten.forEach(s => {
  const t = lies(s); let m; const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = re.exec(t))) syntax("\n".repeat(t.slice(0, m.index).split("\n").length - 1) + m[1], s);
});

// ---------- 2. Verweise ----------
seiten.forEach(s => {
  const t = lies(s).replace(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/g, ""); let m; const re = /<(?:script|link|a|img|audio|source)\b[^>]*?\b(?:src|href)="([^"#?]+)[^"]*"/g;
  while ((m = re.exec(t))) {
    if (/^(https?:|data:|mailto:|blob:|javascript:)/.test(m[1])) continue;
    const ziel = path.posix.normalize(path.posix.join(path.posix.dirname(s), m[1]));
    if (!gibt(ziel)) melde(s, "Verweis auf fehlende Datei " + m[1]);
  }
});

// ---------- 3. Offline-Ablage ----------
{
  let sw = lies("sw.js");
  const m = /var DATEIEN = \[([\s\S]*?)\];/.exec(sw), v = /var VERSION = "sammlung-v(\d+)";/.exec(sw);
  if (!m || !v) melde("sw.js", "Liste DATEIEN oder VERSION nicht gefunden");
  else {
    const liste = [...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]);
    const soll = dateien.filter(d => !NICHT_IN_ABLAGE.some(r => r.test(d))).sort();
    const fehlt = soll.filter(d => !liste.includes(d)), zuviel = liste.filter(d => d !== "./" && !gibt(d)), doppelt = liste.filter((d, i) => liste.indexOf(d) !== i);
    if (process.argv.includes("--sw")) {
      if (fehlt.length || zuviel.length || doppelt.length) {
        const zeilen = ["./"].concat(soll).reduce((z, d) => { const ordner = d.includes("/") ? d.slice(0, d.lastIndexOf("/")) : ""; (z[ordner] = z[ordner] || []).push('"' + d + '"'); return z; }, {});
        const neu = "var DATEIEN = [" + Object.keys(zeilen).sort().map(o => zeilen[o].join(", ")).join(",\n  ") + "];";
        sw = sw.replace(m[0], neu).replace(v[0], 'var VERSION = "sammlung-v' + (+v[1] + 1) + '";');
        fs.writeFileSync(path.join(WURZEL, "sw.js"), sw);
        console.log("sw.js neu geschrieben: " + (soll.length + 1) + " Dateien, Version " + (+v[1] + 1) + (fehlt.length ? "; neu: " + fehlt.join(", ") : "") + (zuviel.length ? "; entfernt: " + zuviel.join(", ") : ""));
      } else console.log("sw.js stimmt schon, nichts geändert.");
    } else {
      fehlt.forEach(d => melde("sw.js", "Datei fehlt in der Liste DATEIEN (ohne Netz nicht da): " + d));
      zuviel.forEach(d => melde("sw.js", "steht in DATEIEN, gibt es aber nicht (die Ablage lässt sich dann gar nicht einrichten): " + d));
      doppelt.forEach(d => melde("sw.js", "steht doppelt in DATEIEN: " + d));
      if (fehlt.length || zuviel.length) console.log("Abhilfe: node tests/pruefe.mjs --sw");
    }
  }
}

// ---------- 4. Lieder ----------
{
  const k = { window: {} }; vm.createContext(k); vm.runInContext(lies("spiele/lieder.js") + "\n;this.LIEDER = LIEDER;", k);
  const ids = {};
  k.LIEDER.liste.forEach(l => {
    if (ids[l.id]) melde("lieder.js", "Kennung doppelt: " + l.id); ids[l.id] = 1;
    const t = k.LIEDER.toene(l, 60), zeichen = l.noten.split(/[\s|]+/).filter(x => x).length, takte = {};
    if (t.length !== zeichen) melde("lieder.js", l.titel + ": " + (zeichen - t.length) + " Zeichen nicht lesbar");
    t.forEach(n => { takte[n.takt] = (takte[n.takt] || 0) + n.dauer; });
    Object.keys(takte).forEach(nr => { if (takte[nr] !== 4) melde("lieder.js", l.titel + ": Takt " + (+nr + 1) + " hat " + takte[nr] + " statt 4 Schläge"); });
    t.forEach(n => {
      if (n.m < 55 || n.m > 72) melde("lieder.js", l.titel + ": Ton außerhalb der Klaviatur (g bis c″)");
      if (![0, 2, 4, 5, 7, 9, 11].includes(n.m % 12)) melde("lieder.js", l.titel + ": nur Stammtöne (weiße Tasten) möglich");
    });
    if (!(l.tempo >= 40 && l.tempo <= 200)) melde("lieder.js", l.titel + ": Tempo fehlt oder ist unplausibel");
  });
}

// ---------- 5. Koreanisch ----------
{
  const ko = "spiele/lernen/koreanisch/", k = { window: {}, localStorage: { getItem: () => null, setItem: () => {} } }; vm.createContext(k);
  vm.runInContext(lies(ko + "js/srs.js") + "\n" + lies(ko + "js/kern.js") + "\n;this.KO = KO;", k);
  const seite = lies(ko + "index.html"), daten = fs.readdirSync(path.join(WURZEL, ko, "daten")).filter(d => d.endsWith(".js"));
  // in der Reihenfolge der Seite laden; jede Datendatei muss dort auch eingetragen sein
  const folge = [...seite.matchAll(/<script src="daten\/([^"]+)"/g)].map(x => x[1]);
  daten.forEach(d => { if (!folge.includes(d)) melde(ko + "index.html", "Datendatei nicht eingebunden: " + d); });
  const vorher = {};
  folge.forEach(d => {
    const lekVor = Object.keys(k.KO.lektionen).length;
    vm.runInContext(lies(ko + "daten/" + d), k, { filename: d });
    Object.keys(k.KO.lektionen).slice(lekVor).forEach(id => { if (vorher[id]) melde(d, "Lektionskennung doppelt: " + id); vorher[id] = d; });
  });
  k.KO.stand = k.KO.leer(); k.KO.baueGrammatik();
  const KO = k.KO, dinge = Object.values(KO.dinge), bsp = Object.values(KO.gbsp);
  const anzahl = Object.values(KO.lektionen).reduce((n, l) => n + l.dinge.length, 0);
  if (anzahl !== dinge.length) melde(ko, "Kennungen von Wörtern oder Sätzen sind nicht eindeutig (" + anzahl + " Einträge, " + dinge.length + " Kennungen)");
  dinge.concat(bsp).forEach(d => {
    if (!d.ko || !d.de) melde(ko, d.id + ": Koreanisch oder Deutsch fehlt");
    if (!gibt(ko + "ton/" + d.id + ".mp3")) melde(ko, d.id + ": Tondatei fehlt (werkzeug/ton_erzeugen.py laufen lassen)");
  });
  bsp.forEach(b => { if ((b.roh.match(/\[/g) || []).length !== (b.roh.match(/\]/g) || []).length) melde(ko, b.id + ": eckige Klammern nicht paarig"); });
  Object.keys((KO.gramRoh || {}).regeln || {}).forEach(id => { if (!KO.regel[id]) melde(ko, "Grammatikseite " + id + " gehört zu keiner Notiz einer Lektion"); });
  KO.regeln.forEach(r => (r.siehe || []).concat(r.verweis ? [r.verweis] : []).forEach(id => { if (!KO.regel[id]) melde(ko, r.id + ": verweist auf unbekannte Seite " + id); }));
  console.log("Koreanisch: " + Object.keys(KO.lektionen).length + " Lektionen, " + dinge.length + " Wörter und Sätze, " + bsp.length + " Grammatikbeispiele");
}

if (fehler.length) { console.error("\n" + fehler.length + " Fehler:\n- " + fehler.join("\n- ")); process.exit(1); }
console.log("Alles in Ordnung: " + dateien.filter(d => d.endsWith(".js")).length + " Skripte, " + seiten.length + " Seiten.");
