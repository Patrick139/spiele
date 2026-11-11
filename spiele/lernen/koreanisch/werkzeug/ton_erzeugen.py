#!/usr/bin/env python3
"""ton_erzeugen.py — erzeugt die Tondateien (ton/<Kennung>.mp3) für alle Wörter und Sätze der Koreanisch-App.

Was es tut: liest die Datendateien (daten/*.js), spricht jeden koreanischen Text mit dem Sprachmodell Supertonic
(läuft lokal, kein Internet nötig), schneidet Stille weg, gleicht die Lautstärke an und speichert eine kleine MP3-Datei.
Schon vorhandene Dateien mit unverändertem Text werden übersprungen (Merkliste: werkzeug/ton_stand.json).

Einmalig einrichten:
  pip install sherpa-onnx numpy
  ffmpeg muss installiert sein, node ebenfalls
  Modell laden und entpacken:
  https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/sherpa-onnx-supertonic-tts-int8-2026-03-06.tar.bz2

Aufruf (im Ordner spiele/lernen/koreanisch):
  python3 werkzeug/ton_erzeugen.py /pfad/zu/sherpa-onnx-supertonic-tts-int8-2026-03-06

Stimme: Nummer 5 (männlich), Tempo 0,95. Andere Stimme: --stimme 0 bis 9, dann --alles, damit alle Dateien neu entstehen.

Gegenprobe (empfohlen): Das Sprachmodell würfelt bei jedem Aufruf etwas anders und verschluckt dabei gelegentlich ein Wort.
Mit --pruefen <Ordner eines koreanischen Spracherkennungsmodells> wird jede Aufnahme zurück in Text gewandelt; stimmt er nicht,
wird neu gesprochen (bis zu 6 Versuche) und die beste Aufnahme behalten. Was danach noch abweicht, steht in werkzeug/ton_pruefung.txt
(oft nur gleich klingende Schreibweisen wie 예요/에요 oder Zahlen als Ziffern). Modell dafür:
  https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-korean-2024-06-24.tar.bz2
"""
import argparse, hashlib, json, os, re, subprocess, sys
import numpy as np
import sherpa_onnx

HIER = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HIER)
TON = os.path.join(APP, "ton")
STAND = os.path.join(HIER, "ton_stand.json")
BERICHT = os.path.join(HIER, "ton_pruefung.txt")


def schneide(x, rate):
    """Stille am Anfang und Ende weg, kurze Ein-/Ausblende, Lautstärke auf einheitliche Spitze."""
    laut = np.abs(x)
    schwelle = max(0.01, 0.03 * float(laut.max() if len(x) else 0))
    wo = np.where(laut > schwelle)[0]
    if len(wo) == 0:
        return x
    a, b = max(0, wo[0] - int(0.03 * rate)), min(len(x), wo[-1] + int(0.08 * rate))
    x = x[a:b].copy()
    n = int(0.01 * rate)
    if len(x) > 2 * n:
        x[:n] *= np.linspace(0, 1, n)
        x[-n:] *= np.linspace(1, 0, n)
    x *= 0.7 / max(1e-6, float(np.abs(x).max()))
    pause = np.zeros(int(0.05 * rate), dtype=np.float32)
    return np.concatenate([pause, x.astype(np.float32), pause])


def glatt(t):
    """Für den Vergleich: ohne Leer- und Satzzeichen; 예요 und 에요 klingen gleich."""
    return re.sub(r"[\s.,!?]", "", t).replace("예요", "에요")


def abstand(a, b):
    """Zahl der Zeichen, die sich zwischen Solltext und erkanntem Text unterscheiden (Levenshtein)."""
    a, b = glatt(a), glatt(b)
    d = list(range(len(b) + 1))
    for i, x in enumerate(a, 1):
        p = d[:]
        d[0] = i
        for j, y in enumerate(b, 1):
            d[j] = min(p[j] + 1, d[j - 1] + 1, p[j - 1] + (x != y))
    return d[-1]


def erkenner(ordner):
    m = ordner.rstrip("/") + "/"
    return sherpa_onnx.OfflineRecognizer.from_transducer(
        tokens=m + "tokens.txt", encoder=m + "encoder-epoch-99-avg-1.int8.onnx", decoder=m + "decoder-epoch-99-avg-1.int8.onnx",
        joiner=m + "joiner-epoch-99-avg-1.int8.onnx", num_threads=4, sample_rate=16000, feature_dim=80)


def erkenne(rec, x, rate):
    n = int(len(x) * 16000 / rate)
    y = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x).astype(np.float32)
    s = rec.create_stream()
    s.accept_waveform(16000, np.concatenate([np.zeros(4800, dtype=np.float32), y, np.zeros(8000, dtype=np.float32)]))
    rec.decode_stream(s)
    return s.result.text


def main():
    p = argparse.ArgumentParser()
    p.add_argument("modell", help="Ordner des entpackten Supertonic-Modells")
    p.add_argument("--stimme", type=int, default=5)
    p.add_argument("--tempo", type=float, default=0.95)
    p.add_argument("--alles", action="store_true", help="alle Dateien neu erzeugen")
    p.add_argument("--pruefen", default="", help="Ordner des Spracherkennungsmodells für die Gegenprobe")
    p.add_argument("--versuche", type=int, default=6)
    a = p.parse_args()
    m = a.modell.rstrip("/") + "/"
    tts = sherpa_onnx.OfflineTts(sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
        supertonic=sherpa_onnx.OfflineTtsSupertonicModelConfig(
            duration_predictor=m + "duration_predictor.int8.onnx", text_encoder=m + "text_encoder.int8.onnx",
            vector_estimator=m + "vector_estimator.int8.onnx", vocoder=m + "vocoder.int8.onnx",
            tts_json=m + "tts.json", unicode_indexer=m + "unicode_indexer.bin", voice_style=m + "voice.bin"),
        num_threads=4, provider="cpu")))
    dinge = json.loads(subprocess.check_output(["node", os.path.join(HIER, "daten_als_json.js")]))
    stand = {}
    if os.path.exists(STAND) and not a.alles:
        stand = json.load(open(STAND, encoding="utf8"))
    os.makedirs(TON, exist_ok=True)
    rec = erkenner(a.pruefen) if a.pruefen else None
    bericht = {}
    if os.path.exists(BERICHT) and not a.alles:
        for z in open(BERICHT, encoding="utf8"):
            t = z.rstrip("\n").split(" | ")
            if len(t) == 4:
                bericht[t[0]] = z.rstrip("\n")
    neu = 0
    for d in dinge:
        marke = hashlib.sha1(("%s|%d|%.2f" % (d["ko"], a.stimme, a.tempo)).encode("utf8")).hexdigest()[:12]
        ziel = os.path.join(TON, d["id"] + ".mp3")
        if stand.get(d["id"]) == marke and os.path.exists(ziel):
            continue
        g = sherpa_onnx.GenerationConfig()
        g.sid, g.speed, g.num_steps, g.extra = a.stimme, a.tempo, 8, {"lang": "ko"}
        beste = None
        for versuch in range(a.versuche if rec else 1):
            aus = tts.generate(d["ko"], g)
            roh = np.array(aus.samples, dtype=np.float32)
            if not rec:
                beste = (0, roh, "")
                break
            text = erkenne(rec, roh, aus.sample_rate)
            fehler = abstand(d["ko"], text)
            if beste is None or fehler < beste[0]:
                beste = (fehler, roh, text)
            if fehler == 0:
                break
        bericht.pop(d["id"], None)
        if beste[0] > 0:
            bericht[d["id"]] = "%s | %s | %s | %d" % (d["id"], d["ko"], beste[2], beste[0])
        x = schneide(beste[1], aus.sample_rate)
        roh = (np.clip(x, -1, 1) * 32767).astype("<i2").tobytes()
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(aus.sample_rate), "-ac", "1", "-i", "-",
                        "-ar", "24000", "-ac", "1", "-b:a", "48k", ziel], input=roh, check=True)
        stand[d["id"]] = marke
        neu += 1
        if neu % 50 == 0:
            print(neu, "erzeugt …", flush=True)
            json.dump(stand, open(STAND, "w", encoding="utf8"), indent=0, sort_keys=True)
    # Dateien zu gelöschten Einträgen entfernen
    gueltig = {d["id"] + ".mp3" for d in dinge}
    for f in os.listdir(TON):
        if f.endswith(".mp3") and f not in gueltig:
            os.remove(os.path.join(TON, f))
    stand = {k: v for k, v in stand.items() if k + ".mp3" in gueltig}
    json.dump(stand, open(STAND, "w", encoding="utf8"), indent=0, sort_keys=True)
    if rec or bericht:
        with open(BERICHT, "w", encoding="utf8") as f:
            f.write("Kennung | Solltext | erkannter Text | abweichende Zeichen   (beste von bis zu %d Aufnahmen)\n" % a.versuche)
            for k in sorted(bericht):
                if k + ".mp3" in gueltig:
                    f.write(bericht[k] + "\n")
    print("Fertig:", neu, "neu erzeugt,", len(dinge), "Einträge gesamt,", len(bericht), "mit Abweichung in der Gegenprobe.")


if __name__ == "__main__":
    main()
