// verbindung.js — Handy-zu-Handy ohne Server: WebRTC-Datenkanal, die beiden Verbindungscodes laufen als QR-Code (oder Text).
// Ablauf: Gastgeber VERB.hostStart() -> Code A (QR). Gast VERB.gastAnnehmen(A) -> Code B (QR). Gastgeber VERB.hostAntwort(B).
// Danach VERB.senden(obj) / VERB.aufNachricht = function (obj) {}. Im selben WLAN oder Hotspot; Internet wird nicht gebraucht.
// Kein Modul; globales Objekt VERB. QR-Zeichnen: qrcode.js (MIT, kazuhikoarase/qrcode-generator).

var VERB = {
  pc: null, dc: null, rolle: null, offen: false, fehler: "",
  aufNachricht: null, aufStatus: null,            // aufStatus("offen" | "zu" | "fehler")
  ICE_WARTEN: 3000,                               // ms, so lange wird auf Adressen des eigenen Geraets gewartet

  // ---- Codes: deflate + base64url, Kennung "T1." ---------------------------------------------------
  kodieren: async function (text) {
    var cs = new CompressionStream("deflate-raw"), w = cs.writable.getWriter();
    w.write(new TextEncoder().encode(text)); w.close();
    var buf = new Uint8Array(await new Response(cs.readable).arrayBuffer()), bin = "";
    for (var i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
    return "T1." + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  },
  dekodieren: async function (code) {
    code = String(code || "").trim().replace(/\s+/g, "");
    var m = code.match(/T1\.[A-Za-z0-9_\-]+/);           // auch aus einem Link (…#c=T1.…) oder umgebendem Text
    if (m) code = m[0];
    if (code.indexOf("T1.") !== 0) throw new Error("Das ist kein Spielcode.");
    var b = code.slice(3).replace(/-/g, "+").replace(/_/g, "/"); while (b.length % 4) b += "=";
    var bin = atob(b), arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    var ds = new DecompressionStream("deflate-raw"), w = ds.writable.getWriter();
    w.write(arr); w.close();
    return new TextDecoder().decode(await new Response(ds.readable).arrayBuffer());
  },

  // ---- Verbindung ------------------------------------------------------------------------------
  neuePC: function () {
    this.schliessen();
    var pc = new RTCPeerConnection({ iceServers: [] });    // keine fremden Server: nur Adressen im eigenen Netz
    this.pc = pc; this.offen = false; this.fehler = "";
    pc.onconnectionstatechange = function () {
      if (pc !== VERB.pc) return;
      if (pc.connectionState === "failed") { VERB.fehler = "Verbindung fehlgeschlagen"; if (VERB.aufStatus) VERB.aufStatus("fehler"); }
      if (pc.connectionState === "disconnected" || pc.connectionState === "closed") { if (VERB.offen) { VERB.offen = false; if (VERB.aufStatus) VERB.aufStatus("zu"); } }
    };
    return pc;
  },
  kanal: function (dc) {
    var self = this; this.dc = dc;
    dc.onopen = function () { self.offen = true; if (self.aufStatus) self.aufStatus("offen"); };
    dc.onclose = function () { if (self.dc === dc && self.offen) { self.offen = false; if (self.aufStatus) self.aufStatus("zu"); } };
    dc.onmessage = function (ev) { var o; try { o = JSON.parse(ev.data); } catch (e) { return; } if (self.aufNachricht) self.aufNachricht(o); };
  },
  warteAufIce: function (pc) {
    return new Promise(function (ok) {
      if (pc.iceGatheringState === "complete") return ok();
      var t, f = function () { if (pc.iceGatheringState === "complete") fertig(); };
      var fertig = function () { pc.removeEventListener("icegatheringstatechange", f); clearTimeout(t); ok(); };
      pc.addEventListener("icegatheringstatechange", f);
      t = setTimeout(fertig, VERB.ICE_WARTEN);
    });
  },
  // Chrome zeigt Netzadressen nur mit Kamera-Erlaubnis im Klartext; ohne sie stehen dort zufaellige ".local"-Namen,
  // die nicht jedes Netz aufloest. Deshalb einmal kurz um die Kamera bitten (wird sofort wieder freigegeben).
  kameraFreischalten: async function () {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return false;
      var st = await navigator.mediaDevices.getUserMedia({ video: true });
      st.getTracks().forEach(function (t) { t.stop(); });
      return true;
    } catch (e) { return false; }
  },
  hostStart: async function () {
    this.rolle = "host";
    var pc = this.neuePC();
    this.kanal(pc.createDataChannel("g", { ordered: true }));
    await pc.setLocalDescription(await pc.createOffer());
    await this.warteAufIce(pc);
    return this.kodieren(JSON.stringify({ t: "o", s: pc.localDescription.sdp }));
  },
  gastAnnehmen: async function (code) {
    var o = JSON.parse(await this.dekodieren(code));
    if (o.t !== "o") throw new Error("Das ist der falsche Code (der Gastgeber muss zuerst zeigen).");
    this.rolle = "gast";
    var pc = this.neuePC();
    pc.ondatachannel = function (ev) { VERB.kanal(ev.channel); };
    await pc.setRemoteDescription({ type: "offer", sdp: o.s });
    await pc.setLocalDescription(await pc.createAnswer());
    await this.warteAufIce(pc);
    return this.kodieren(JSON.stringify({ t: "a", s: pc.localDescription.sdp }));
  },
  hostAntwort: async function (code) {
    var o = JSON.parse(await this.dekodieren(code));
    if (o.t !== "a") throw new Error("Das ist der falsche Code (der Gast muss ihn zeigen).");
    if (!this.pc || this.rolle !== "host") throw new Error("Es wurde noch kein Spiel eroeffnet.");
    await this.pc.setRemoteDescription({ type: "answer", sdp: o.s });
  },
  senden: function (obj) {
    if (this.dc && this.dc.readyState === "open") { try { this.dc.send(JSON.stringify(obj)); return true; } catch (e) {} }
    return false;
  },
  schliessen: function () {
    var pc = this.pc; this.pc = null; this.offen = false;
    try { if (this.dc) { this.dc.onclose = null; this.dc.close(); } } catch (e) {}
    try { if (pc) pc.close(); } catch (e) {}
    this.dc = null;
  },

  // QR enthaelt einen Link (…/index.html#c=Code): die normale Handy-Kamera oeffnet damit direkt das Spiel mit dem Code.
  // Ohne http(s) (Datei) bleibt es der nackte Code. Die eingebaute Kamera liest beides.
  alsLink: function (code) {
    if (!/^https?:$/.test(location.protocol)) return code;
    return location.href.split("#")[0].split("?")[0] + "#c=" + code;
  },
  codeAusLink: function (h) { var m = String(h || "").match(/[#&?]c=(T1\.[A-Za-z0-9_\-]+)/); return m ? m[1] : null; },

  // ---- QR zeigen und lesen ---------------------------------------------------------------------
  qrZeichnen: function (canvas, text, cssPx) {       // ganze Geraetepixel je Modul: scharf, ohne Unschaerfe beim Scannen
    var qr = qrcode(0, "L"); qr.addData(text); qr.make();
    var n = qr.getModuleCount(), rand = 4, dpr = window.devicePixelRatio || 1;
    var maxDev = Math.floor(Math.min(cssPx || 300, window.innerWidth * 0.78) * dpr), zoom = Math.max(2, Math.floor(maxDev / (n + 2 * rand)));
    var g = canvas.getContext("2d"), gr = (n + 2 * rand) * zoom;
    canvas.width = gr; canvas.height = gr; canvas.style.width = (gr / dpr) + "px"; canvas.style.height = (gr / dpr) + "px";
    g.fillStyle = "#fff"; g.fillRect(0, 0, gr, gr); g.fillStyle = "#000";
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) if (qr.isDark(y, x)) g.fillRect((x + rand) * zoom, (y + rand) * zoom, zoom, zoom);
    return n;
  },
  scannerMoeglich: function () { return "BarcodeDetector" in window && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia); },
  scanStrom: null, scanLaeuft: false,
  scannen: async function (video, aufCode) {         // liest QR-Codes mit der Kamera; aufCode(text) beim ersten Treffer
    var det = new BarcodeDetector({ formats: ["qr_code"] });
    this.scanStrom = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    video.srcObject = this.scanStrom; video.setAttribute("playsinline", ""); await video.play();
    this.scanLaeuft = true;
    var schleife = async function () {
      if (!VERB.scanLaeuft) return;
      try { var r = await det.detect(video); if (r.length && r[0].rawValue) { aufCode(r[0].rawValue); return; } } catch (e) {}
      setTimeout(schleife, 160);
    };
    schleife();
  },
  scanStopp: function () {
    this.scanLaeuft = false;
    if (this.scanStrom) { this.scanStrom.getTracks().forEach(function (t) { t.stop(); }); this.scanStrom = null; }
  }
};
