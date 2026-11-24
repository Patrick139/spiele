// browser.mjs — startet jede Seite im Browser (PC- und Handygröße) und spielt die Lernprogramme kurz an.
// Braucht das Paket playwright:  cd tests && npm install --no-save --no-package-lock playwright && npx playwright install chromium
// Aufruf im Hauptverzeichnis:    node tests/browser.mjs      (eigener Chrome: CHROME=/usr/bin/google-chrome node tests/browser.mjs)
// Es zählt als Fehler: Meldung in der Konsole, Fehler im Skript, nicht ladbare Datei, Seite breiter als der Bildschirm.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ART = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".mp3": "audio/mpeg" };
const server = http.createServer((anfrage, antwort) => {
  let p = decodeURIComponent(anfrage.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  const datei = path.join(WURZEL, path.normalize(p));
  if (!datei.startsWith(WURZEL) || !fs.existsSync(datei) || fs.statSync(datei).isDirectory()) { antwort.writeHead(404); antwort.end(); return; }
  antwort.writeHead(200, { "Content-Type": ART[path.extname(datei)] || "application/octet-stream" }); fs.createReadStream(datei).pipe(antwort);
});
await new Promise(fertig => server.listen(0, "127.0.0.1", fertig));
const BASIS = "http://127.0.0.1:" + server.address().port + "/";

const SEITEN = ["index.html", "spiele/snake/index.html", "spiele/asteroids/index.html", "spiele/dungeon/index.html", "spiele/schiessbude/index.html",
  "spiele/lernen/index.html", "spiele/lernen/noten/index.html", "spiele/lernen/koreanisch/index.html", "spiele/gitarre/index.html"];
const fehler = [];
const pruefe = (bedingung, text) => { if (!bedingung) fehler.push(text); };

// ---------- Anspielen der Lernprogramme über ihre Test-Zugänge ----------
const ANSPIELEN = {
  "spiele/gitarre/index.html": async (seite, wo) => {
    for (const modus of ["griff", "noten", "akk", "theo"]) {
      await seite.click('#modi [data-modus="' + modus + '"]');
      const ok = await seite.evaluate(() => {
        const G = window.GITARRE; let gut = 0;
        for (let i = 0; i < 12; i++) {
          const A = G.Z.aufg;
          if (G.Z.modus === "griff") { if (A.typ === "wo") G.wo(G.STIMMUNG[A.s] + A.f, A.s, A.f); else G.name(A.pc, null); }
          else if (G.Z.modus === "noten") { const l = G.lagen(A.e.m, G.Z.brettBis)[0]; G.note(A.e.m, l.s, l.f); }
          else if (G.Z.modus === "akk") G.akk(A.ziel, null);
          else if (A.typ === "nah") G.nah(G.STIMMUNG[A.s] + A.f2, A.s, A.f2);
          else G.theo(A.typ === "hg" ? A.schritt : A.ziel, null);
          if (document.getElementById("rueck").className === "gut") gut++;
          G.Z.wiederhole = null; G.neu();
        }
        return gut;
      });
      pruefe(ok === 12, wo + ": Gitarre " + modus + " wertet richtige Antworten nicht als richtig (" + ok + " von 12)");
    }
    await seite.click('#modi [data-modus="lied"]');
    const lieder = await seite.evaluate(() => document.getElementById("liedWahl").options.length);
    for (let i = 0; i < lieder; i++) {
      await seite.selectOption("#liedWahl", { index: i });
      const r = await seite.evaluate(() => { const L = window.GITARRE.Z.lied; let n = 0; while (L.pos < L.t.length && n++ < 500) { const t = L.t[L.pos]; window.GITARRE.lied(t.m, t.lage.s, t.lage.f); } return L.pos === L.t.length && L.fehler === 0 && L.t.every(t => t.lage && t.lage.f <= 5); });
      pruefe(r, wo + ": Gitarre, Lied " + (i + 1) + " lässt sich nicht fehlerfrei durchspielen");
    }
    for (let i = 0; i < 3; i++) await seite.click("#ansichtKnopf");
  },
  "spiele/lernen/noten/index.html": async (seite, wo) => {
    await seite.click("#startBtn");
    const falsch = await seite.evaluate(() => {
      const G = window.GAME; let falsch = 0;
      for (const d of ["einsteiger", "normal", "expert"]) for (const c of ["violin", "bass"]) for (const m of ["lesen", "hoeren"]) {
        G.diff = d; G.clef = c; G.mode = m;
        for (let l = 1; l <= 4; l++) { G.level = l; for (let i = 0; i < 4; i++) { G.newQuestion(); const z = G.current(); if (G.answer(i % 2 ? z.m : z.m + 1) !== (i % 2 === 1)) falsch++; } }
      }
      G.diff = "normal"; G.clef = "violin"; return falsch;
    });
    pruefe(falsch === 0, wo + ": Notenrally wertet " + falsch + " Antworten falsch");
    await seite.click('#modeSeg [data-mode="lieder"]');
    const lieder = await seite.evaluate(() => document.getElementById("liedWahl").options.length);
    for (let i = 0; i < lieder; i++) {
      await seite.selectOption("#liedWahl", { index: i });
      const r = await seite.evaluate(() => { const L = window.GAME.lied; let n = 0; while (L.pos < L.t.length && n++ < 500) { const m = L.t[L.pos].m; if (!document.querySelector('#kb [data-midi="' + m + '"]')) return false; window.GAME.submit(m); } return L.pos === L.t.length && L.fehler === 0; });
      pruefe(r, wo + ": Notenrally, Lied " + (i + 1) + " lässt sich nicht fehlerfrei durchspielen");
    }
    await seite.click('#modeSeg [data-mode="lesen"]');
  },
  "spiele/lernen/koreanisch/index.html": async (seite, wo) => {
    // eine Lerneinheit anklicken
    await seite.click('[data-akt="einheit"]');
    for (let i = 0; i < 30; i++) await seite.evaluate(() => { const b = document.querySelector("#v-einheit .knoepfe .haupt") || document.querySelector('#v-einheit [data-g="3"]') || document.querySelector("#v-einheit .wahl button") || document.querySelector("#v-einheit [data-akt=stein]:not([disabled])"); if (b) b.click(); });
    pruefe(await seite.evaluate(() => window.KO.tag().neu > 0), wo + ": Koreanisch, Lerneinheit zählt keine neuen Karten");
    await seite.evaluate(() => { if (window.UI.einheit) window.UI.akt.abbruch.call(window.UI); });
    const karten = await seite.evaluate(() => JSON.stringify(window.KO.stand.karten));
    // Themenübungen: drei Themen, jede Übungsart, per Klick; jede vierte Antwort falsch
    for (const thema of ["a1-03", "b1-05", "grund"]) {
      await seite.evaluate(t => window.UI.akt.thema.call(window.UI, { getAttribute: () => t }), thema);
      const arten = await seite.evaluate(() => [...document.querySelectorAll("#v-thema [data-akt=uebStart]")].map(b => b.dataset.art));
      pruefe(arten.length > 0, wo + ": Koreanisch, Thema " + thema + " bietet keine Übung");
      for (const art of arten) {
        await seite.evaluate(t => window.UI.akt.thema.call(window.UI, { getAttribute: () => t }), thema);
        await seite.click('#v-thema [data-art="' + art + '"]');
        const r = await seite.evaluate(() => {
          const UI = window.UI, box = document.getElementById("v-uebung");
          for (let n = 1; n < 300; n++) {
            const U = UI.ueb; if (!U || !U.jetzt) return "ende";
            const a = U.jetzt, falsch = n % 4 === 0 && !a.wdh;
            if (a.art === "karte") { box.querySelector("[data-akt=uebAuf]").click(); box.querySelector('[data-ok="' + (falsch ? 0 : 1) + '"]').click(); continue; }
            if (a.art === "bau") {
              const ziel = falsch ? a.B.richtig.slice().reverse() : a.B.richtig, benutzt = {};
              ziel.forEach(w => { const nr = a.B.steine.findIndex((s, i) => s === w && !benutzt[i]); benutzt[nr] = 1; box.querySelector('[data-akt=uebStein][data-nr="' + nr + '"]').click(); });
            } else {
              if (a.wahl.length !== 4 || new Set(a.wahl).size !== 4 || !a.wahl.includes(a.richtig)) return "Antworten unbrauchbar: " + JSON.stringify(a.wahl);
              box.querySelectorAll(".wahl button")[falsch ? a.wahl.findIndex(w => w !== a.richtig) : a.wahl.indexOf(a.richtig)].click();
            }
            if (!UI.ueb.jetzt.geloest) return "Aufgabe nicht gelöst: " + a.art;
            box.querySelector("[data-akt=uebWeiter]").click();
          }
          return "kein Ende";
        });
        pruefe(r === "ende", wo + ": Koreanisch, " + thema + " / " + art + ": " + r);
        pruefe(await seite.evaluate(() => !!document.querySelector("#v-uebung .zahlen")), wo + ": Koreanisch, " + thema + " / " + art + ": Auswertung fehlt");
      }
    }
    pruefe(karten === await seite.evaluate(() => JSON.stringify(window.KO.stand.karten)), wo + ": Koreanisch, Themenübungen haben die Lernkarten verändert");
    // Sicherungsdatei teilen (das Teilen-Menü wird nachgestellt) und wieder einlesen
    await seite.click('#v-uebung [data-ziel="ueben"]');                  // die Auswertung hat keine Fußleiste; über ihren Knopf zurück
    await seite.evaluate(() => { navigator.canShare = () => true; navigator.share = d => { window.geteilt = d.files[0]; return Promise.resolve(); }; });
    await seite.click('nav [data-ziel="mehr"]');
    await seite.evaluate(() => document.querySelectorAll("#v-mehr details").forEach(d => { d.open = true; }));
    await seite.click('#v-mehr [data-akt="teilen"]');
    const geteilt = await seite.evaluate(async () => { const f = window.geteilt; if (!f) return "nichts geteilt"; const s = window.KO.pruefeStand(JSON.parse(await f.text())); return s && Object.keys(s.karten).length === Object.keys(window.KO.stand.karten).length && /\.txt$/.test(f.name) ? "gut" : "Inhalt stimmt nicht"; });
    pruefe(geteilt === "gut", wo + ": Koreanisch, Sicherungsdatei teilen: " + geteilt);
    // Zurücksetzen und Kopie wiederherstellen
    const vorher = await seite.evaluate(() => Object.keys(window.KO.stand.karten).length);
    await seite.click('nav [data-ziel="mehr"]');
    await seite.evaluate(() => document.querySelectorAll("#v-mehr details").forEach(d => { d.open = true; }));
    await seite.click("#rKnopf"); await seite.click("#rKnopf");
    pruefe(await seite.evaluate(() => Object.keys(window.KO.stand.karten).length) === 0, wo + ": Koreanisch, Zurücksetzen löscht nicht");
    await seite.click('#v-heute [data-akt="kopieLaden"]');
    pruefe(await seite.evaluate(() => Object.keys(window.KO.stand.karten).length) === vorher && vorher > 0, wo + ": Koreanisch, Kopie stellt den Lernstand nicht wieder her");
    for (const ziel of ["ueben", "lektionen", "grammatik", "karten", "mehr", "heute"]) await seite.click('nav [data-ziel="' + ziel + '"]');
  }
};

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined, args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
for (const [breite, hoehe] of [[1280, 800], [390, 780]]) {
  const fenster = await browser.newContext({ viewport: { width: breite, height: hoehe }, hasTouch: breite < 500, serviceWorkers: "block" });
  for (const s of SEITEN) {
    const seite = await fenster.newPage(), wo = s + " (" + breite + " px)";
    seite.on("console", m => { if ((m.type() === "error" || m.type() === "warning") && !/Service Worker registration blocked/.test(m.text())) fehler.push(wo + ": Konsole: " + m.text()); });
    seite.on("pageerror", e => fehler.push(wo + ": Fehler im Skript: " + e.message));
    seite.on("requestfailed", r => { if (!/\/ton\/.*\.mp3/.test(r.url())) fehler.push(wo + ": nicht geladen: " + r.url()); });   // abgebrochene Tondateien sind normal, wenn schnell weitergeklickt wird
    seite.on("response", r => { if (r.status() >= 400) fehler.push(wo + ": Antwort " + r.status() + ": " + r.url()); });
    await seite.goto(BASIS + s); await seite.waitForTimeout(700);
    try { if (ANSPIELEN[s]) await ANSPIELEN[s](seite, wo); } catch (e) { fehler.push(wo + ": Anspielen abgebrochen: " + e.message.split("\n")[0]); }
    await seite.waitForTimeout(300);
    const zuBreit = await seite.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    pruefe(zuBreit <= 0, wo + ": Seite ist " + zuBreit + " px breiter als der Bildschirm");
    await seite.close();
  }
  await fenster.close();
}
await browser.close(); server.close();
if (fehler.length) { console.error(fehler.length + " Fehler:\n- " + fehler.join("\n- ")); process.exit(1); }
console.log("Alles in Ordnung: " + SEITEN.length + " Seiten in zwei Größen gestartet, Gitarre, Notenrally und Koreanisch angespielt.");
