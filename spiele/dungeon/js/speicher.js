// speicher.js — Spielstand speichern und laden (ein Platz im Browserspeicher, localStorage).
//
// Gespeichert wird der GESCHICHTLICHE Stand, nicht der Ort im Dungeon: gewaehlter Held, Zauberbuch,
// Ersatzschluessel, in Ambros' Raeumen Gesehenes, Konfrontationen, Antworten, Tode.
// (Stufe und Fertigkeiten je Held speichert fortschritt.js ohnehin laufend.)
// Der Dungeon wuerfelt sich bei jedem Abstieg neu und ein Tod fuehrt ins Dorf; Laden beginnt daher im Dorf.
//
// Automatisch gespeichert wird bei: Ankunft im Dorf, jedem Abstieg, Zauberbuch, Schluessel, Gesehenem,
// Konfrontation. Auf dem Titelbild: C = Weiterspielen, Enter = Neues Spiel (mit Rueckfrage).
// Pro Held ein eigener Platz: Schluessel SPEICHER_STAND + "_" + Heldennummer (seit 18.10.).
// Ein aelterer Einzelstand (Schluessel SPEICHER_STAND) wird beim ersten Lesen in den Platz seines Helden verschoben.
// Kein Modul; globale Funktionen. Setzt spiel.js (zustand), held.js (HELD) voraus.

var SPEICHER_STAND = "zehnte_spielstand";
var LETZTE_ZEIT = 0;                                      // streng steigend: "zuletzt gespeichert" auch bei Speichern im selben Millisekunden-Takt
function platzSchluessel(h) { return SPEICHER_STAND + "_" + h; }
function altstandVerschieben() {                         // einmalig: Einzelstand -> Platz seines Helden
  try {
    var alt = localStorage.getItem(SPEICHER_STAND);
    if (!alt) return;
    var r = JSON.parse(alt);
    if (r && typeof r.held === "number" && r.held >= 0 && r.held < HELDEN.length && !localStorage.getItem(platzSchluessel(r.held)))
      localStorage.setItem(platzSchluessel(r.held), alt);
    localStorage.removeItem(SPEICHER_STAND);
  } catch (e) {}
}
var SPEICHER_VERSION = 1;
var GUELTIGE_FLAGS = ["drohen", "fragen", "schweigen", "konfrontieren"];

function spielSpeichern() {
  var z = zustand;
  if (!z || !z.gestartet) return false;                    // erst nach dem Prolog; Test-Aufbauten speichern nichts
  var daten = {
    v: SPEICHER_VERSION, zeit: (LETZTE_ZEIT = Math.max(Date.now(), LETZTE_ZEIT + 1)), held: HELD, tode: z.tode || 0,
    wahlen: (z.wahlen || []).slice(), ambrosGesprochen: !!z.ambrosGesprochen,
    zauber: { nova: !!z.zauber.nova, gewaehlt: z.zauber.gewaehlt },
    schluessel: !!z.schluessel, bertaVersuche: z.bertaVersuche || 0,
    beweise: Object.assign({}, z.beweise || {}), konfrontiert: z.konfrontiert || 0, verfolgung: !!z.verfolgung
  };
  try { localStorage.setItem(platzSchluessel(HELD), JSON.stringify(daten)); }
  catch (e) { z.speicherFehler = true; return false; }     // Speicher voll oder gesperrt: Spiel laeuft weiter
  z.speicherFehler = false; z.gespeichertAm = performance.now();
  return true;
}

// Liest und prueft den Stand EINES Helden (h) oder, ohne Angabe, den zuletzt gespeicherten.
// Gibt ein bereinigtes Objekt zurueck oder null (fehlt, kaputt, falsche Version).
function spielstandLesen(h) {
  if (h === undefined) {
    var neu = null;
    for (var i = 0; i < HELDEN.length; i++) { var s = spielstandLesen(i); if (s && (!neu || s.zeit > neu.zeit)) neu = s; }
    return neu;
  }
  altstandVerschieben();
  var roh;
  try { roh = JSON.parse(localStorage.getItem(platzSchluessel(h))); } catch (e) { return null; }
  if (!roh || typeof roh !== "object" || roh.v !== SPEICHER_VERSION) return null;
  if (roh.held !== h) return null;
  var erlaubt = KAMMER_DINGE_OBEN.concat(KAMMER_DINGE_GEHEIM), beweise = {};
  if (roh.beweise && typeof roh.beweise === "object") erlaubt.forEach(function (k) { if (roh.beweise[k] === true) beweise[k] = true; });
  var zb = roh.zauber && typeof roh.zauber === "object" ? roh.zauber : {};
  function zahl(x, max) { return typeof x === "number" && isFinite(x) ? Math.max(0, Math.min(max, Math.floor(x))) : 0; }
  return {
    held: roh.held, zeit: typeof roh.zeit === "number" ? roh.zeit : 0, tode: zahl(roh.tode, 9999),
    wahlen: Array.isArray(roh.wahlen) ? roh.wahlen.filter(function (w) { return GUELTIGE_FLAGS.indexOf(w) >= 0; }).slice(0, 50) : [],
    ambrosGesprochen: roh.ambrosGesprochen === true,
    zauber: { nova: zb.nova === true, gewaehlt: zb.nova === true && zb.gewaehlt === "nova" ? "nova" : "axt" },
    schluessel: roh.schluessel === true, bertaVersuche: zahl(roh.bertaVersuche, 999),
    beweise: beweise, konfrontiert: zahl(roh.konfrontiert, 999), verfolgung: roh.verfolgung === true
  };
}

// Kurzinfo { held, name, stufe, tode, zeit } zu einem Stand (oder zum zuletzt gespeicherten) oder null.
function spielstandInfo(h) {
  var s = spielstandLesen(h);
  if (!s) return null;
  var f = zustand.fortschritt && zustand.fortschritt[s.held];
  return { held: s.held, name: HELDEN[s.held].name, stufe: f ? f.stufe : 1, tode: s.tode, zeit: s.zeit };
}
function spielstandPlaetze() { return HELDEN.map(function (H, i) { return spielstandInfo(i); }); }

// Stand eines Helden laden (h) oder den zuletzt gespeicherten; weiter im Dorf. true, wenn es geklappt hat.
function spielLaden(h) {
  var s = spielstandLesen(h);
  if (!s) return false;
  var z = zustand;
  HELD = s.held; HELD_AUSWAHL = s.held;
  z.tode = s.tode; z.wahlen = s.wahlen; z.ambrosGesprochen = s.ambrosGesprochen; z.zauber = s.zauber;
  z.schluessel = s.schluessel; z.bertaVersuche = s.bertaVersuche; z.beweise = s.beweise; z.konfrontiert = s.konfrontiert; z.verfolgung = s.verfolgung;
  z.neuBestaetigt = false; z.gestartet = true; z.dialog = null; z.skillOffen = false; z.invOffen = false;
  insDorf();
  return true;
}

function spielstandLoeschen(h) {
  try { if (h === undefined) { for (var i = 0; i < HELDEN.length; i++) localStorage.removeItem(platzSchluessel(i)); localStorage.removeItem(SPEICHER_STAND); } else localStorage.removeItem(platzSchluessel(h)); } catch (e) {}
}

// Titelbild: C = zuletzt gespielten Held weiterspielen, 1-3 = Platz dieses Helden, Enter = Neues Spiel (Heldenwahl).
// Die Rueckfrage "ueberschreiben?" kommt erst in der Heldenwahl, wenn dieser Held schon einen Stand hat. true: Heldenwahl.
function titelSchritt(z, fl, weiter) {
  if (fl.c && spielstandInfo()) { spielLaden(); return false; }
  for (var i = 0; i < HELDEN.length; i++) if (fl[String(i + 1)] && spielstandInfo(i)) { spielLaden(i); return false; }
  z.neuBestaetigt = false;
  return !!weiter;
}

// Kleine Einblendung "Gespeichert" (hud.js ruft sie).
function zeichneGespeichert(ctx, b, z) {
  var dt = performance.now() - (z.gespeichertAm || -1e9);
  if (dt > 2200) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, (2200 - dt) / 600) * 0.85; ctx.textAlign = "right";
  ctx.fillStyle = "#b9a8ff"; ctx.font = "italic 14px Georgia, serif"; ctx.fillText("Gespeichert", b - 24, 32);
  ctx.restore();
}
