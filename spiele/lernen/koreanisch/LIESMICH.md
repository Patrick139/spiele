# Koreanisch lernen

Lernkarten mit Wiederholung nach Intervall, erreichbar über die Lernecke (Kachel „Koreanisch“) oder direkt unter `spiele/lernen/koreanisch/`.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Seite und Gestaltung |
| `js/srs.js` | Wiederholungsabstände (FSRS 4.5, Standardgewichte) |
| `js/kern.js` | Daten, Lernstand, Ton, Zusammenstellen der Lerneinheit |
| `js/ansicht.js` | Oberfläche |
| `daten/a1_*.js` … | Lerninhalte, ein Block je Datei |
| `daten/grammatik.js` | Grammatikteil: Grundlagen-Seiten, je Regel genauere Erklärung und Beispiele |
| `ton/*.mp3` | eine Tondatei je Wort und Satz |
| `werkzeug/` | Erzeugen der Tondateien |

Der Lernstand liegt im Browser des Geräts (`localStorage`, Schlüssel `koreanisch_v1`). Übertragen auf ein anderes Gerät: Mehr → Sichern und Laden.

## Inhalte ergänzen

1. In `daten/` einen neuen Block anlegen (Vorlage: `a1_1.js`) oder in einer bestehenden Lektion Einträge **am Ende** der Liste anhängen.
2. Nichts umreihen und nichts löschen: Die Kennung einer Karte ist Lektion plus Platz in der Liste (`a1-03w5`). Daran hängen Lernstand und Tondatei. Einen Eintrag stilllegen: durch `null` ersetzen.
3. Neue Datendatei in `index.html` (Skript-Zeile) und in `sw.js` (Liste `DATEIEN`) eintragen, in `sw.js` die `VERSION` erhöhen.
4. Tondateien erzeugen (siehe unten).

## Tondateien erzeugen

Einmalig: `pip install sherpa-onnx numpy`, dazu `ffmpeg` und `node`. Modell laden und entpacken:
`https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/sherpa-onnx-supertonic-tts-int8-2026-03-06.tar.bz2`

Dann im Ordner `spiele/lernen/koreanisch`:

```
python3 werkzeug/ton_erzeugen.py /pfad/zum/entpackten/modell
```

Das Skript spricht nur neue oder geänderte Texte (Merkliste `werkzeug/ton_stand.json`). Stimme: Nummer 5, Tempo 0,95.

Empfohlen mit Gegenprobe: Das Sprachmodell verschluckt gelegentlich ein Wort. Mit `--pruefen` wird jede Aufnahme von einer
koreanischen Spracherkennung zurück in Text gewandelt und bei Abweichung neu gesprochen (bis zu 6 Versuche, die beste bleibt):

```
python3 werkzeug/ton_erzeugen.py /pfad/zum/sprachmodell --pruefen /pfad/zum/erkennungsmodell
```

Erkennungsmodell: `https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-korean-2024-06-24.tar.bz2`
Was nach allen Versuchen noch abweicht, steht in `werkzeug/ton_pruefung.txt`. Oft sind das nur gleich klingende Schreibweisen
oder einzelne kurze Wörter, die die Erkennung ohne Zusammenhang nicht sicher trifft.

Wurden bestehende Tondateien neu erzeugt: in `sw.js` (`TON`) und in `js/kern.js` (`ladeAlle`) den Namen der Ton-Ablage hochzählen
(`ko-ton-v1` → `ko-ton-v2`), sonst behalten Geräte die alten Aufnahmen.

## Stand der Inhalte

- A1 Teil 1 (`a1_1.js`): 12 Lektionen, 307 Wörter, 162 Sätze.
- A1 Teil 2 (`a1_2.js`): 12 Lektionen, Schwerpunkt kurze Sätze aus dem heutigen Alltag.
- Offen: A2, B1.

Leitlinie für neue Sätze: nur, was man heute wirklich sagt oder hört (Handy, Bestellautomat, Lieferung, Taxi per Adresse,
Familie, Kind). Keine Lehrbuchsätze über Dinge, die im Alltag kaum mehr vorkommen.

Die koreanischen Texte und die Tondateien sind maschinell erstellt und nicht von einem Muttersprachler geprüft. Fehler lassen sich in der App unter Mehr → Durchsicht markieren.
