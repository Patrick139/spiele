# Spielesammlung

Spiele und Lernprogramme für den Browser, ohne Werbung und ohne Server. Veröffentlicht über GitHub Pages; nach dem ersten Besuch läuft alles auch ohne Internet.

## Inhalt

| Ordner | Was |
|---|---|
| `index.html`, `js/`, `style.css` | Startseite und Tetris (allein oder zu zweit im selben WLAN) |
| `spiele/snake`, `spiele/asteroids`, `spiele/schiessbude` | je ein Spiel in einer Datei |
| `spiele/dungeon` | „Der Zehnte“ (Dungeon), eine Datei je Baustein in `js/` |
| `spiele/gitarre` | Gitarre: Griffbrett, Noten, Akkorde, Theorie, Lieder; auch mit echter Gitarre |
| `spiele/lernen` | Lernecke für Kinder; darin `noten/` (Notenrally, Klavier) und `koreanisch/` (Lernkarten und Themenübungen, eigene `LIESMICH.md`) |
| `spiele/lieder.js` | Melodien für Gitarre und Klavier |
| `sw.js`, `manifest.json` | Offline-Ablage und Installation als App |
| `zurueck.js` | Knopf „‹ Spiele“ in den Einzelspielen |

## Regeln für Änderungen

- Kein Build-Schritt, keine fremden Bibliotheken außer `js/qrcode.js`. Jede Seite läuft direkt aus dem Ordner.
- Neue oder entfernte Dateien in `sw.js` in die Liste `DATEIEN` eintragen und dort `VERSION` erhöhen. Geänderte Dateien holt sich die Seite im Hintergrund selbst; sie sind beim übernächsten Öffnen da.
- Spielstände liegen im `localStorage` des Browsers. Schlüssel nicht umbenennen, sonst sind die Stände weg: `snake.hiscore`, `asteroids_high`, `notenrally`, `gitarre_*`, `koreanisch_v1`, dazu die Schlüssel von Dungeon, Lernecke und Schießbude.
- Koreanisch: Einträge in den Datendateien nur am Ende anhängen (siehe `spiele/lernen/koreanisch/LIESMICH.md`).
- Neue Lieder: in `spiele/lieder.js` anhängen; Gitarre und Klavier zeigen sie von selbst. Die Schreibweise steht oben in der Datei.

## Lokal ansehen

```
python3 -m http.server 8000
```

Dann `http://localhost:8000/` öffnen. Die Offline-Ablage (`sw.js`) arbeitet nur über einen Server, nicht beim Öffnen der Dateien per Doppelklick.
