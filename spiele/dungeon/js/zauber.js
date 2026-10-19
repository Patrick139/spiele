// zauber.js — Archivwaechter (Boss-Zombie auf Ebene 1), Zauberbuch "Nova", Mana, Wechsel
// des Zaubers auf der rechten Maustaste (Mausrad oder Tasten 1/2).
// Kein Modul; globale Funktionen. Nutzt gegner.js (gegnerBasis, schadenGegner, sichtbar),
// boss.js (gefahr), kampf.js (popup, trefferFeedback), sprites.js (Zeichenhelfer).

// ---- Konstanten zum Nachjustieren -------------------------------------
var MANA_MAX = 100;          // Standard-Mana (Helden setzen eigene Werte, held.js)
var MANA_REGEN = 5;          // Mana pro Sekunde
var NOVA_KOSTEN = 50;        // Mana pro Wurf der Nova
var NOVA_RADIUS = 240;       // Reichweite der Welle (px)
var NOVA_TEMPO = 420;        // so schnell breitet sich der Ring aus (px/s)
var NOVA_ABKLING = 1.0;      // Sperrzeit nach einem Wurf (s)
var NOVA_BOSS_SCHADEN = 6;   // Ambros ueberlebt die Nova (seine Stufen laufen ueber Leben)
var WAECHTER_LEBEN = 10;     // Archivwaechter (Boss-Zombie); Testphase: bewusst mild
var WAECHTER_SCHADEN = 1;    // pro Hieb und pro Stampfen
var WAECHTER_TEMPO = 44;     // Zombie normal: 52
var WAECHTER_REICH = 54;     // Hiebreichweite (Zombie normal: 44)
var WAECHTER_ANK = 1.0;      // Vorwarnung Hieb in s (Zombie normal: 0,5)
var WAECHTER_STAMPF_CD = 7;  // Abstand der Stampfer in s
var WAECHTER_STAMPF_R = 70;  // Radius des Stampfkreises
var WAECHTER_STAMPF_ANK = 1.2; // Vorwarnung Stampfen in s
// -----------------------------------------------------------------------

// ---- Archivwaechter: grosser Zombie bewacht die Treppe der Ebene 1 ---------
function erzeugeWaechter(ebene) {
  var t = ebene.treppe, ab = [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, 0], [1, 0], [0, -1], [0, 1]];
  for (var i = 0; i < ab.length; i++) {
    var gx = t.x + ab[i][0], gy = t.y + ab[i][1];
    if (!begehbar(ebene, gx, gy)) continue;
    var g = gegnerBasis((gx + 0.5) * KACHEL, (gy + 0.5) * KACHEL, "zombie", 1);
    g.boss = true; g.leben = g.lebenMax = WAECHTER_LEBEN; g.radius = 15;   // passt durch die zwei Kacheln breiten Gaenge (Wegfindung laeuft ueber Kachelmitten: 16 px Wandabstand)
    g.schaden = WAECHTER_SCHADEN;
    g.tempo = WAECHTER_TEMPO; g.reich = WAECHTER_REICH; g.ankZeit = WAECHTER_ANK; g.stampfCd = WAECHTER_STAMPF_CD;
    return g;
  }
  return null;
}

function waechterVon(z) {
  for (var i = 0; i < z.gegner.length; i++) if (z.gegner[i].boss) return z.gegner[i];
  return null;
}

// Zusatz zum Zombie-Verhalten: Stampfen (Kreis um ihn, vorher angekuendigt).
function waechterSchritt(g, z, d, dt) {
  if (g.zustand === "stampf") {
    g.t -= dt;
    if (g.t <= 0) g.zustand = "jagd";
    return;
  }
  if (g.zustand !== "jagd") return;
  g.stampfCd -= dt;
  if (g.stampfCd <= 0 && d < 150) {
    gefahr(z, { typ: "kreis", x: g.x, y: g.y, r: WAECHTER_STAMPF_R, dauer: WAECHTER_STAMPF_ANK, schaden: WAECHTER_SCHADEN });
    g.zustand = "stampf"; g.t = WAECHTER_STAMPF_ANK; g.stampfCd = WAECHTER_STAMPF_CD;
  }
}

// Tod des Waechters: ein Buch bleibt liegen.
function waechterTod(g, z) {
  z.funde.push({ x: g.x, y: g.y, art: "zauber", text: ZAUBERBUCH, gelesen: false });
}

function zauberLernen(z, fund) {
  z.zauber.nova = true; z.zauber.gewaehlt = "nova";
  z.spieler.skills.gewaehlt = "nova";
  fp().wahl = "nova";                                    // Auswahl bleibt ueber Tod hinweg
  spielSpeichern();
  var i = z.funde.indexOf(fund);
  if (i >= 0) z.funde.splice(i, 1);
}

// ---- Zauber waehlen: Mausrad (entprellt) und Tasten 1 / 2 -------------------
var LETZTES_RAD = 0;
function zauberWaehle(z, name) {
  if (z.phase !== "dungeon" || z.dialog || z.pause || !z.zauber.nova) return;
  if (z.zauber.gewaehlt === name) return;
  z.zauber.gewaehlt = name;
  if (z.spieler && z.spieler.skills) z.spieler.skills.gewaehlt = name;   // Auswahl synchron halten
  fp().wahl = name;
  popup(z, z.spieler.x, z.spieler.y - 40, name === "nova" ? "Nova" : "Wurf", "#9ec4ff");
}
function zauberWechseln(z) { zauberWaehle(z, z.zauber.gewaehlt === "nova" ? "axt" : "nova"); }

CANVAS.addEventListener("wheel", function (e) {
  e.preventDefault();
  var jetzt = performance.now();
  if (jetzt - LETZTES_RAD < 120) return;       // Trackpads schicken viele Ereignisse
  LETZTES_RAD = jetzt;
  // Scroll-Wheel waehlt die Faehigkeit: hoch = zurueck, runter = weiter
  skillZyklus(zustand, e.deltaY > 0 ? 1 : -1);
}, { passive: false });

// ---- Nova -------------------------------------------------------------------
// Rechtsklick: true = der Klick gehoert dem Zauber (Wurfaxt bleibt in der Hand).
function zauberRechtsklick(sp, z) {
  if (!(z.zauber.nova && z.zauber.gewaehlt === "nova")) return false;
  if (sp.novaCd > 0) return true;
  if (sp.mana < NOVA_KOSTEN) {
    popup(z, sp.x, sp.y - 40, "Zu wenig Mana", "#8a8fb8");
    sp.novaCd = 0.4;
    return true;
  }
  sp.mana -= NOVA_KOSTEN; sp.novaCd = NOVA_ABKLING;
  z.nova = { x: sp.x, y: sp.y - 8, r: 0, getroffen: {} };
  z.schuettelMs = 160;
  return true;
}

// Mana laden, Ring wachsen lassen: alles, was der Ring erreicht (und sieht), stirbt.
function novaSchritt(z, sp, ebene, dt) {
  if (sp.novaCd > 0) sp.novaCd -= dt;
  if (sp.mana < sp.manaMax) sp.mana = Math.min(sp.manaMax, sp.mana + (MANA_REGEN + (sp.itemManaReg || 0)) * dt);
  var n = z.nova;
  if (!n) return;
  n.r += NOVA_TEMPO * dt;
  var traf = false, i;
  for (i = 0; i < z.gegner.length; i++) {
    var g = z.gegner[i];
    if (g.tot || n.getroffen[g.id]) continue;
    var dx = g.x - n.x, dy = g.y - n.y, d = Math.sqrt(dx * dx + dy * dy);
    if (d - g.radius > n.r || d > NOVA_RADIUS + g.radius) continue;
    if (!sichtbar(ebene, n.x, n.y, g.x, g.y)) continue;          // Fels haelt die Welle auf
    n.getroffen[g.id] = true;
    schadenGegner(g, g.art === "ambros" ? NOVA_BOSS_SCHADEN : g.leben, z, { durch: true });   // Zauber geht am Schild vorbei
    traf = true;
  }
  for (i = z.pfeile.length - 1; i >= 0; i--) {                   // Pfeile und Lichtkugeln verglühen
    var px = z.pfeile[i].x - n.x, py = z.pfeile[i].y - n.y;
    if (Math.sqrt(px * px + py * py) <= n.r) z.pfeile.splice(i, 1);
  }
  if (traf) trefferFeedback(z);
  if (n.r >= NOVA_RADIUS) z.nova = null;
}

// ---- Zeichnen ----------------------------------------------------------------
// Ring der Nova (in Weltkoordinaten, additiv: leuchtet auch im Dunkeln).
function zeichneNova(ctx, camX, camY, z) {
  var n = z.nova;
  if (!n) return;
  var x = n.x - camX, y = n.y - camY, p = n.r / NOVA_RADIUS, a = Math.max(0, 1 - p * p);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  var g = ctx.createRadialGradient(x, y, Math.max(0, n.r - 30), x, y, n.r + 4);
  g.addColorStop(0, "rgba(80,140,255,0)");
  g.addColorStop(0.7, "rgba(120,180,255," + (0.5 * a) + ")");
  g.addColorStop(0.95, "rgba(235,245,255," + (0.95 * a) + ")");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, n.r + 4, 0, TAU); ctx.fill();
  ctx.restore();
  glut(ctx, x, y, n.r + 24, "100,160,255", 0.2 * a);
  glut(ctx, x, y, 70, "200,225,255", 0.55 * a);
}

function waechterZeichnen(ctx, g, camX, camY) {
  var x = g.x - camX, y = g.y - camY;
  ctx.save();
  ctx.translate(x, y); ctx.scale(1.7, 1.7);
  ctx.filter = "hue-rotate(245deg) saturate(0.85) brightness(0.62)";     // dunkles Blauviolett statt faulgruen
  SPRITES.zombie.zeichnen(ctx, 0, 0, g);
  ctx.filter = "none";
  ctx.restore();
  var lx = x + (Math.cos(g.blick || 0) >= 0 ? -13 : 13);                 // das Buch am Guertel
  rc(ctx, lx - 5, y - 28, 10, 13, "#14101c"); rc(ctx, lx - 1, y - 28, 1.4, 13, "#4a3a6a");
  glut(ctx, lx, y - 22, 30, "120,160,255", 0.45 + Math.sin(ANIM * 3) * 0.1);
  for (var e = -1; e <= 1; e += 2) {                                      // rote Augen
    kr(ctx, x + e * 5, y - 56, 2.4, "#ff4a3a"); glut(ctx, x + e * 5, y - 56, 16, "255,60,40", 0.5);
  }
}

// Das Buch am Boden (Fundstueck, E zum Aufheben).
function zauberBuchZeichnen(ctx, f, camX, camY) {
  var x = f.x - camX, y = f.y - camY + 6, hb = Math.sin(ANIM * 2) * 2;
  schatten(ctx, x, y, 11);
  glut(ctx, x, y - 12, 60 + Math.sin(ANIM * 3) * 6, "110,160,255", 0.4);
  poly(ctx, [x - 12, y - 6 + hb, x, y - 10 + hb, x + 12, y - 6 + hb, x + 12, y - 15 + hb, x, y - 19 + hb, x - 12, y - 15 + hb], "#1a1426");
  poly(ctx, [x - 10, y - 8 + hb, x - 1, y - 11 + hb, x - 1, y - 17 + hb, x - 10, y - 14 + hb], "#d8cfe8");
  poly(ctx, [x + 10, y - 8 + hb, x + 1, y - 11 + hb, x + 1, y - 17 + hb, x + 10, y - 14 + hb], "#d8cfe8");
  ctx.strokeStyle = "#5a8aff"; ctx.beginPath(); ctx.arc(x - 5.5, y - 12.5 + hb, 2.6, 0, TAU); ctx.stroke();   // Nova-Zeichen
  ctx.beginPath(); ctx.arc(x - 5.5, y - 12.5 + hb, 1, 0, TAU); ctx.stroke();
}

// Slot der Leiste, wenn Nova gewaehlt ist (ersetzt den Wurf-Slot). Mana-Anzeige: rechte Kugel (hud.js).
function novaSlot(ctx, sp) {
  var keinMana = sp.mana < NOVA_KOSTEN;
  return { taste: "RMB", name: "Nova",
    cd: sp.novaCd > 0 ? sp.novaCd / NOVA_ABKLING : 0,      // echte Abklingzeit; kein Mana wird unten markiert
    keinMana: keinMana,
    kosten: NOVA_KOSTEN + " Mana",
    hinweis: keinMana ? "Zu wenig Mana (" + NOVA_KOSTEN + ")" : null,
    icon: function (x, y) {
      ctx.strokeStyle = keinMana ? "#5a5a7a" : "#9ec4ff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.stroke(); ctx.lineWidth = 1;
      var farbe = keinMana ? "#5a5a7a" : "#9ec4ff";
      for (var i = 0; i < 8; i++) lin(ctx, x + Math.cos(i * 0.785) * 12, y + Math.sin(i * 0.785) * 12, x + Math.cos(i * 0.785) * 16, y + Math.sin(i * 0.785) * 16, farbe, 1.4);
    } };
}
