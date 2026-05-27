# WedO - Ausführliche Projektgrundlage für die Abschlusspräsentation

Diese Datei dient als Materialsammlung für eine ca. 15-minütige Abschlusspräsentation. Sie enthält Kommunikationskonzept, Zielgruppen, Personas, Use Cases, User Journeys, Requirements, Architektur, Demo-Ablauf, Learnings und mögliche Folienstruktur.

## 1. Elevator Pitch

WedO ist eine mobile Hochzeitsfoto-App, mit der Gäste Fotos per QR-Code direkt in eine gemeinsame Event-Galerie hochladen können. Fotografen erstellen Events, teilen den QR-Code mit den Gästen und verwalten die gesammelten Bilder zentral. Die App verbindet einfache Gast-Nutzung ohne Login mit einem geschützten Fotografenbereich.

## 2. Problemstellung

Bei Hochzeiten entstehen viele authentische Fotos auf den Smartphones der Gäste. Diese Bilder landen später oft verstreut in WhatsApp-Gruppen, privaten Galerien oder werden gar nicht geteilt. Für Brautpaar und Fotograf ist es schwierig, alle Perspektiven des Tages gesammelt zu bekommen.

WedO soll diesen Prozess vereinfachen:

- Gäste sollen ohne Account schnell teilnehmen können.
- Der Einstieg soll über QR-Code funktionieren.
- Alle Bilder sollen pro Hochzeit gesammelt werden.
- Fotografen sollen Events und Bilder verwalten können.
- Teilen soll über native Smartphone-Funktionen möglich sein.

## 3. Zielgruppe

### Primäre Zielgruppen

**Hochzeitsfotografen:** Sie wollen Gäste-Fotos zentral sammeln, ohne manuell Links, Cloud-Ordner oder Messenger-Gruppen verwalten zu müssen.

**Hochzeitsgäste:** Sie wollen ohne komplizierte Registrierung Fotos aufnehmen und teilen.

### Sekundäre Zielgruppen

**Brautpaare:** Sie profitieren von einer größeren Fotoauswahl und bekommen spontane Momente aus Sicht der Gäste.

**Eventplaner:** Das Konzept lässt sich später auch auf Geburtstage, Firmenfeiern oder andere Events erweitern.

## 4. Personas

### Persona 1: Sarah, Hochzeitsfotografin

- Alter: 31
- Kontext: Fotografiert regelmäßig Hochzeiten und möchte Gäste-Fotos strukturiert sammeln.
- Ziele: Event schnell erstellen, QR-Code teilen, Galerie kontrollieren, einzelne Fotos speichern oder löschen.
- Pain Points: Messenger-Chaos, unvollständige Foto-Sammlungen, viele manuelle Nachfragen.
- Erwartung an WedO: Einfacher Event-Workflow und professionelle Verwaltung.

### Persona 2: Lukas, Hochzeitsgast

- Alter: 26
- Kontext: Macht viele spontane Fotos mit dem Smartphone.
- Ziele: QR-Code scannen, Foto aufnehmen, hochladen, Galerie ansehen.
- Pain Points: Keine Lust auf Registrierung, keine komplizierte App-Erklärung.
- Erwartung an WedO: Sofort verstehen, sofort nutzen.

### Persona 3: Anna und Markus, Brautpaar

- Alter: 29 und 32
- Kontext: Wollen möglichst viele Erinnerungen an ihren Hochzeitstag sammeln.
- Ziele: Fotos aus verschiedenen Perspektiven erhalten.
- Pain Points: Bilder werden oft in privaten Chats vergessen.
- Erwartung an WedO: Ein zentraler Ort für Gäste-Fotos.

## 5. Stakeholder und Kommunikation

### Stakeholder

- Gäste als schnelle, nicht angemeldete Nutzer
- Fotografen als angemeldete Hauptnutzer
- Brautpaar als indirekter Auftraggeber
- Lehrveranstaltung / Prüfer als bewertende Instanz

### Kommunikationsziele der App

Die App muss ohne lange Erklärung kommunizieren:

- "Scanne den QR-Code und lade Fotos hoch."
- "Du bist Gast und brauchst keinen Account."
- "Du bist Fotograf und verwaltest Events im Dashboard."
- "Fotos sind pro Event gesammelt."

### Tonalität

WedO soll freundlich, festlich und vertraünswürdig wirken. Die App nutzt eine klare Sprache und trennt Gast- und Fotografen-Flow deutlich. Die UI darf emotional zum Hochzeitsthema passen, soll aber nicht verspielt auf Kosten der Bedienbarkeit werden.

### Kommunikationskanäle im Produkt

- QR-Code als Einstiegspunkt für Gäste
- Deep-Link `wedo://event/{weddingId}`
- Nativer Share-Dialog für Einladung und Fotos
- Event-Karten und Galerie als visülle Orientierung
- Anleitungsscreen für Gast- und Fotografenrolle

## 6. Kernfunktionen

### Gastfunktionen

- QR-Code scannen
- Link manuell eingeben
- Event bestätigen
- Foto aufnehmen
- Foto lokal speichern
- Foto in Firebase hochladen
- Event-Galerie ansehen
- Foto speichern oder teilen
- Zum zuletzt gescannten Event zurückkehren

### Fotografenfunktionen

- Registrieren und einloggen
- Event erstellen
- Datum und Location erfassen
- Eventliste im Dashboard ansehen
- Event-Detailseite öffnen
- QR-Code und Link anzeigen
- Einladung per Share-Dialog teilen
- Event bearbeiten
- Fotos ansehen, speichern, teilen und löschen

## 7. Use Cases

### Use Case 1: Fotograf erstellt ein Event

**Akteur:** Fotograf  
**Vorbedingung:** Fotograf ist eingeloggt.  
**Ablauf:** Dashboard öffnen, neues Event anlegen, Titel/Datum/Location eingeben, speichern.  
**Ergebnis:** Neüs Dokument in `weddings`, Event erscheint im Dashboard.

### Use Case 2: Gast tritt einem Event bei

**Akteur:** Gast  
**Vorbedingung:** Fotograf hat QR-Code oder Link geteilt.  
**Ablauf:** QR-Code scannen, Eventdaten laden, Event bestätigen.  
**Ergebnis:** Gast ist im Event-Kontext und kann Fotos aufnehmen oder Galerie ansehen.

### Use Case 3: Gast lädt Foto hoch

**Akteur:** Gast  
**Vorbedingung:** Gast befindet sich in einem Event.  
**Ablauf:** Kamera öffnen, Foto aufnehmen, Berechtigungen bestätigen, Upload abwarten.  
**Ergebnis:** Bild liegt in Firebase Storage, Foto-Dokument liegt in Firestore.

### Use Case 4: Fotograf verwaltet Galerie

**Akteur:** Fotograf  
**Vorbedingung:** Event existiert und Fotos wurden hochgeladen.  
**Ablauf:** Event öffnen, Galerie ansehen, Foto previewen, speichern/teilen/löschen.  
**Ergebnis:** Fotograf kontrolliert die Event-Fotos.

### Use Case 5: Einladung teilen

**Akteur:** Fotograf  
**Vorbedingung:** Event existiert.  
**Ablauf:** Event-Detailseite öffnen, "Einladung teilen" antippen, Ziel-App im nativen Share-Sheet wählen.  
**Ergebnis:** Gäste erhalten den WedO-Link.

## 8. User Journeys

### Journey A: Gast beim Event

1. Gast sieht QR-Code auf Tischkarte, Leinwand oder Einladung.
2. Gast öffnet WedO und scannt den Code.
3. WedO zeigt den Eventnamen, damit der Gast sicher ist, im richtigen Event zu sein.
4. Gast nimmt ein Foto auf.
5. WedO speichert das Foto lokal und lädt es in die Cloud.
6. Gast öffnet die Galerie und sieht weitere Event-Fotos.
7. Beim späteren App-Start findet WedO das zuletzt genutzte Event wieder.

### Journey B: Fotograf vor der Hochzeit

1. Fotograf registriert sich oder loggt sich ein.
2. Fotograf erstellt das Hochzeits-Event.
3. App generiert Event-ID, Share-Code und QR-Code.
4. Fotograf teilt den Link mit dem Brautpaar oder druckt den QR-Code.
5. Event ist für Gäste vorbereitet.

### Journey C: Fotograf während/nach der Hochzeit

1. Fotograf öffnet das Dashboard.
2. Fotograf sieht Anzahl der hochgeladenen Fotos.
3. Fotograf öffnet Event-Details.
4. Fotograf prüft Bilder in der Galerie.
5. Fotograf teilt, speichert oder löscht einzelne Fotos.

## 9. Requirements

### Funktionale Requirements

- Nutzer können als Fotograf einen Account erstellen.
- Fotografen können sich einloggen und ausloggen.
- Fotografen können Events erstellen, lesen und bearbeiten.
- Fotografen können Event-Einladungen teilen.
- Gäste können per QR-Code oder Link einem Event beitreten.
- Gäste können Fotos aufnehmen und hochladen.
- Gäste und Fotografen können Event-Fotos ansehen.
- Fotografen können Fotos löschen.
- Fotos können über den nativen Share-Dialog geteilt werden.

### Nicht-funktionale Requirements

- Mobile-first, da Nutzung während eines Events am Smartphone passiert.
- Einfache Gast-Nutzung ohne Registrierung.
- Persistente Speicherung in einer Cloud-Datenbank.
- Klare Trennung zwischen Gast- und Fotografenrolle.
- Verständliche UI für kurze Nutzungssituationen.
- TypeScript für stabilere Entwicklung.

### Uni-Kriterien

| Kriterium | Umsetzung |
|---|---|
| CRUD | Event erstellen/lesen/bearbeiten, Fotos erstellen/lesen/löschen |
| Persistierende Daten | Firebase Firestore und Firebase Storage |
| Offline oder Share | Share-Dialog umgesetzt |
| Keine Web-App | Expo React Native Mobile App |
| Learnings | In Doku und Präsentation enthalten |

## 10. Informationsarchitektur

```text
Welcome
  |-- QRScanner
  |     |-- GüstCamera
  |     |-- GüstGallery
  |
  |-- Login
  |     |-- Dashboard
  |           |-- EventDetail
  |                 |-- GüstCamera
  |                 |-- PhotoPreview
  |
  |-- Instructions
```

## 11. Datenmodell

### Collection `weddings`

```text
weddings/{weddingId}
  title: string
  createdBy: string
  shareCode: string
  date?: string
  location?: string
  createdAt: Timestamp
```

### Collection `photos`

```text
photos/{photoId}
  weddingId: string
  uploadedBy: 'güst' | 'photographer'
  imageUrl: string
  storagePath: string
  localAssetId?: string | null
  createdAt: Timestamp
```

### Storage-Struktur

```text
weddings/{weddingId}/images/{timestamp}-{random}.jpg
```

## 12. Architektur

### Frontend

- React Native Screens für die einzelnen Workflows
- React Navigation für Stack-Navigation
- Wiederverwendbare Komponenten wie Button, Header, PhotoGrid, QRCodeCard und PhotoPreviewModal
- ThemeContext für Farben und Typografie

### Backend / Cloud

- Firebase Auth für Fotografen-Login
- Firestore für Events und Foto-Metadaten
- Firebase Storage für Bilddateien
- Firebase Security Rules für Zugriffskontrolle

### Lokale Speicherung

- AsyncStorage für Auth-Persistence
- AsyncStorage für zuletzt gescanntes Gast-Event
- Media Library für lokale Speicherung auf dem Gerät

## 13. Technische Entscheidungen

### Warum Mobile App?

Der Kern der App ist Kamera, QR-Code, Galeriezugriff und natives Teilen. Diese Funktionen gehören direkt zum Smartphone-Kontext. Eine Web-App wäre für die Aufgabenstellung nicht erlaubt und würde sich für Kamera-/Galerieflows weniger nativ anfühlen.

### Warum Expo React Native?

- Gemeinsame Codebasis für Android und iOS
- Gute Unterstützung für Kamera, Media Library und native APIs
- Schnelles Prototyping für ein Uni-MVP
- TypeScript-Unterstützung
- Gute Kombinierbarkeit mit Firebase

### Warum Firebase?

- Kein eigenes Backend nötig
- Auth, Datenbank und Storage aus einer Plattform
- Schnelle Umsetzung von persistenten Daten
- Geeignet für MVPs und Demo-Projekte

## 14. Mockup / Wireframe

### Startscreen

```text
+--------------------------------+
| WedO                           |
| Wedding Photo Sharing          |
|                                |
| [ QR-Code scannen ]            |
| [ Fotografen-Login ]           |
| [ Wie funktioniert's? ]        |
|                                |
| Letztes Event                  |
| [ Weiter hochladen ] [Galerie] |
+--------------------------------+
```

### Fotografen-Dashboard

```text
+--------------------------------+
| Dashboard              Logout  |
| Events this season: 3          |
| Total photos: 128              |
|                                |
| + Neüs Event                  |
|                                |
| [ Anna & Markus ] 42 Fotos     |
| [ Lisa & Tom    ] 31 Fotos     |
+--------------------------------+
```

### Event-Detailseite

```text
+--------------------------------+
| Anna & Markus          Share   |
| 31.05.2026 | Wien              |
|                                |
| [ QR-Code ]                    |
| wedo://event/abc123            |
| [ Einladung teilen ]           |
|                                |
| Hochgeladene Fotos             |
| [img] [img] [img]              |
| [img] [img] [img]              |
+--------------------------------+
```

### Gast-Kamera

```text
+--------------------------------+
| Event: Anna & Markus           |
|                                |
|          Kamera-Preview        |
|                                |
| [Flash] [Auslöser] [Switch]   |
| [ Galerie ansehen ]            |
+--------------------------------+
```

## 15. UX-Prinzipien

- Gast-Flow ohne Login, damit die Einstiegshürde niedrig bleibt.
- QR-Code als schneller Event-Kontext.
- Event-Bestätigung verhindert versehentliche Uploads ins falsche Event.
- Fotografenbereich ist getrennt und authentifiziert.
- Visülle Galerie macht den Nutzen direkt sichtbar.
- Native Share-Sheets senken Reibung beim Teilen.
- Pull-to-refresh ist für Nutzer bekannt und passt zur Galerie.

## 16. Edge Cases und Fehlerfälle

- Kamera- oder Galerie-Berechtigung wird verweigert.
- QR-Code enthält kein gültiges WedO-Linkformat.
- Event wurde gelöscht oder existiert nicht.
- Netzwerk ist beim Upload instabil.
- Storage-Delete schlägt fehl, Firestore-Dokument wird trotzdem bereinigt.
- Gast versucht ohne Event-Kontext ein Foto hochzuladen.
- Firebase Rules wurden nicht deployed.

## 17. Demo-Ablauf für 15 Minuten

### 0:00-1:30 Einstieg

- Problem erklären: Hochzeitsfotos sind verstreut.
- Ziel der App vorstellen: gemeinsame Galerie per QR-Code.

### 1:30-3:00 App-Art und Tech Stack

- Native Mobile App mit Expo React Native.
- Firebase für Auth, Firestore und Storage.
- Warum keine Web-App und warum Share-Dialog.

### 3:00-6:00 Fotografen-Flow zeigen

- Login/Registrierung kurz erklären.
- Dashboard zeigen.
- Event erstellen.
- Event-Detailseite, QR-Code und Share-Dialog zeigen.

### 6:00-9:00 Gast-Flow zeigen

- QR-Code scannen oder Link manuell eingeben.
- Event bestätigen.
- Foto aufnehmen.
- Upload-Status und Galerie zeigen.

### 9:00-11:00 CRUD und Datenmodell

- Create: Event und Foto.
- Read: Dashboard, Galerie, Detailseite.
- Update: Event bearbeiten.
- Delete: Foto löschen.
- Firestore Collections und Storage-Struktur erklären.

### 11:00-13:00 Requirements und Learnings

- Uni-Kriterien abhaken.
- Was lief gut/schlecht.
- Was würden wir anders machen.

### 13:00-15:00 Fazit und Fragen

- MVP-Ziel erreicht.
- Ausblick: Offline-Qüü, Moderation, Bulk-Download.
- Fragen beantworten.

## 18. Folienvorschlag

1. Titel: WedO - Wedding Photo Sharing App
2. Problem: Hochzeitsfotos sind verstreut
3. Lösung: QR-Code-basierte Event-Galerie
4. Zielgruppen und Personas
5. User Journey Gast
6. User Journey Fotograf
7. Live-Demo / Screens
8. Requirements: CRUD, persistente Daten, Share-Dialog
9. Architektur und Datenmodell
10. Framework-Entscheidung
11. Learnings
12. Fazit und Ausblick

## 19. Mögliche Sprechertexte

### Einstieg

"Unser Projekt heisst WedO. Die Idee dahinter ist einfach: Auf Hochzeiten entstehen sehr viele Fotos auf den Smartphones der Gäste. Diese Fotos werden aber oft später über verschiedene Chats verteilt oder gehen komplett unter. WedO sammelt diese Bilder pro Hochzeit in einer gemeinsamen Galerie."

### Framework-Begründung

"Wir haben uns für eine mobile App mit Expo React Native entschieden, weil unser Haupt-Use-Case direkt auf dem Smartphone passiert: QR-Code scannen, Kamera nutzen, Fotos lokal speichern und Inhalte über den nativen Share-Dialog teilen. Firebase ergänzt das gut, weil wir damit Authentifizierung, Datenbank und Bildspeicher ohne eigenes Backend umsetzen konnten."

### Requirements

"Die drei geforderten Kriterien sind umgesetzt. CRUD ist über Events und Fotos abgedeckt. Die Daten werden persistent in Firestore und Firebase Storage gespeichert. Als Zusatzkriterium haben wir den Share-Dialog gewählt, sowohl für Event-Einladungen als auch für einzelne Fotos."

### Learnings

"Gut funktioniert hat die Kombination aus Expo und Firebase, weil wir schnell einen echten MVP baün konnten. Schwieriger waren native Berechtigungen, Firebase Rules und Löschvorgänge im Storage. Beim nächsten Mal würden wir früher ein Security-Konzept und Tests für die wichtigsten Services einplanen."

## 20. Risiken und Verbesserungen

### Aktülle Limitierungen

- Keine echte Offline-Upload-Qüü
- Kein Bulk-Download aller Fotos
- Keine Moderation vor der Sichtbarkeit für Gäste
- Keine Rollenverwaltung für Brautpaar oder mehrere Fotografen
- Pull-to-refresh statt Live-Updates

### Erweiterungsideen

- Offline-Warteschlange für Uploads
- Moderationsmodus für Fotografen
- ZIP-/Bulk-Export
- Album-Ansichten nach Zeitpunkt oder Gast
- Push Notifications bei neuen Bildern
- Web-Admin nur als spätere Ergänzung, nicht für diese Abgabe
- Designbare QR-Code-Karten für Tischaufsteller

## 21. Projektfazit

WedO ist ein realistischer MVP für ein konkretes Event-Problem. Die App zeigt, wie mobile Gerätefunktionen und Cloud-Datenhaltung zusammenspielen: QR-Code, Kamera, Galerie, Share-Dialog, Authentifizierung, Firestore und Storage. Für die Uni-Anforderungen ist das Projekt passend, weil alle Muss-Kriterien praktisch sichtbar sind und in einer Demo nachvollziehbar gezeigt werden können.


