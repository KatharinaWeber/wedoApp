# WedO Projektueberblick

Diese Datei beschreibt die Screens, Workflows, Firebase-Flows, CRUD-Abdeckung und die wichtigsten Befehle fuer Entwicklung, Demo und Uni-Abgabe.

## Kurzbeschreibung

WedO ist eine Expo React Native App fuer Hochzeitsfoto-Sharing.

- Gaeste scannen einen QR-Code oder geben einen WedO-Link manuell ein.
- Danach koennen sie Fotos aufnehmen, hochladen und die Event-Galerie ansehen.
- Fotografen registrieren sich, erstellen Events, teilen QR-Codes und verwalten Fotos.
- Backend ist Firebase: Auth, Firestore und Cloud Storage.

## Rollen

### Gast

Ein Gast braucht keinen Login.

Moeglichkeiten:

- QR-Code scannen
- WedO-Link manuell eingeben
- Event-Einladung bestaetigen
- Fotos aufnehmen
- Fotos automatisch lokal speichern und zu Firebase hochladen
- Aktuelle Event-Galerie ansehen
- Einzelne Fotos in der Vorschau ansehen, speichern und teilen
- Beim naechsten App-Start zum zuletzt gescannten Event zurueckkehren

### Fotograf

Ein Fotograf nutzt Firebase Auth mit E-Mail und Passwort.

Moeglichkeiten:

- Account registrieren
- Einloggen
- Events erstellen
- Datum per Datepicker auswaehlen
- Event-Detailseite oeffnen
- QR-Code und Deep-Link fuer Gaeste anzeigen
- WedO-Link kopieren
- Link ueber Native Share-Sheet teilen
- Galerie ansehen
- Fotos in Vollbild-Vorschau ansehen
- Fotos speichern, teilen und loeschen

## Screens

### `WelcomeScreen`

Startscreen der App.

Funktionen:

- Einstieg zum QR-Scanner
- Einstieg zum Fotografen-Login
- Einstieg zur Anleitung
- Zeigt nach einem erfolgreichen Gast-Scan ein letztes Event an
- Buttons fuer letztes Event:
  - `Weiter hochladen`
  - `Fotos ansehen`

Navigation:

- `QR-Code scannen` -> `QRScanner`
- `Du bist der Fotograf? Hier einloggen` -> `Login`
- `Wie funktionierts?` -> `Instructions`
- `Weiter hochladen` -> `GuestCamera`
- `Fotos ansehen` -> `GuestGallery`

### `QRScannerScreen`

Screen fuer den Gast-Einstieg.

Funktionen:

- Kamera scannt QR-Codes
- Erwartetes Linkformat: `wedo://event/{weddingId}`
- Manuelle Eingabe ueber `Kein QR-Code?`
- Event wird in Firestore geladen
- Erfolgreich gescanntes Event wird lokal gespeichert
- Zeigt danach eine Event-Bestaetigung

Navigation:

- Erfolgreicher Scan -> Event-Bestaetigung
- `Fotos aufnehmen` -> `GuestCamera`
- `Erneut scannen` -> Scanner-Reset
- `Link manuell eingeben` -> Eingabefeld fuer WedO-Link

### `GuestCameraScreen`

Kamera fuer Gaeste.

Funktionen:

- Kamera- und Galerie-Berechtigungen anfragen
- Foto aufnehmen
- Foto lokal in der Media Library speichern
- Foto zu Firebase Storage hochladen
- Firestore-Dokument fuer das Foto erstellen
- Upload-Status anzeigen
- Blitz umschalten
- Kamera wechseln
- Event-Galerie oeffnen

Wichtig:

- Es gibt nur den echten Modus `Foto`.
- Die frueheren Labels `Video` und `Story` waren nur UI-Platzhalter und wurden entfernt.

### `GuestGalleryScreen`

Read-only Galerie fuer Gaeste.

Funktionen:

- Event-Metadaten laden
- Fotos des Events aus Firestore laden
- Pull-to-refresh
- Foto-Vorschau oeffnen
- Foto speichern
- Foto teilen
- Neues Foto hochladen

Navigation:

- `Foto hochladen` -> `GuestCamera`

### `LoginScreen`

Login und Registrierung fuer Fotografen.

Funktionen:

- Login per E-Mail und Passwort
- Registrierung per E-Mail und Passwort
- Wechsel zwischen Login und Registrierung
- Erfolgreicher Login -> Dashboard

Firebase:

- `signInWithEmailAndPassword`
- `createUserWithEmailAndPassword`

### `DashboardScreen`

Fotografen-Portal.

Funktionen:

- Events des eingeloggten Fotografen laden
- Neues Event erstellen
- Datum per Datepicker setzen
- Location setzen
- Event-Karten anzeigen
- Anzahl der Fotos pro Event anzeigen
- Pull-to-refresh
- Logout

Navigation:

- Event-Karte -> `EventDetail`
- `Gallery Invites` -> erstes/featured Event
- `Anleitung` -> `Instructions`

### `EventDetailScreen`

Detailseite fuer ein Fotografen-Event.

Funktionen:

- Event-Metadaten laden
- Fotos laden
- QR-Code anzeigen
- WedO-Link anzeigen
- WedO-Link kopieren
- Einladung teilen
- Guest Camera fuer dieses Event oeffnen
- Galerie anzeigen
- Foto-Vorschau oeffnen
- Foto speichern
- Foto teilen
- Foto loeschen
- Pull-to-refresh

### `InstructionsScreen`

Anleitungsseite.

Funktionen:

- Tabs fuer `Als Gast` und `Als Fotograf`
- Schritt-fuer-Schritt-Erklaerung
- Tipps fuer Demo und Nutzung

## Workflows

### Gast-Workflow mit QR-Code

1. App oeffnen.
2. `QR-Code scannen` antippen.
3. QR-Code des Events scannen.
4. Event-Bestaetigung ansehen.
5. `Fotos aufnehmen` antippen.
6. Kamera- und Galerie-Berechtigung erlauben.
7. Foto aufnehmen.
8. App speichert das Foto lokal.
9. App laedt das Foto zu Firebase Storage hoch.
10. App erstellt ein Foto-Dokument in Firestore.
11. Gast kann ueber `Galerie` die aktuellen Event-Fotos sehen.

### Gast-Workflow ohne QR-Code

1. Als Fotograf Event oeffnen.
2. In der QR-Code-Karte `Link kopieren` antippen.
3. Zurueck zum Welcome-Screen.
4. `QR-Code scannen` antippen.
5. `Kein QR-Code?` antippen.
6. Link einfuegen, z. B. `wedo://event/abc123`.
7. `Event oeffnen` antippen.
8. Danach wie im normalen Gast-Workflow weiter.

### Rueckkehr als Gast

1. Gast scannt ein Event erfolgreich.
2. App speichert die letzte `weddingId` in AsyncStorage.
3. Wenn die App spaeter wieder geoeffnet wird, zeigt `WelcomeScreen` das letzte Event.
4. Gast kann direkt:
   - weiter Fotos hochladen
   - Event-Galerie ansehen

### Fotografen-Workflow

1. App oeffnen.
2. `Du bist der Fotograf? Hier einloggen` antippen.
3. Registrieren oder einloggen.
4. Dashboard oeffnet sich.
5. `Neues Event` antippen.
6. Titel, Datum und Location setzen.
7. `Event anlegen` antippen.
8. Event in der Liste oeffnen.
9. QR-Code oder Link mit Gaesten teilen.
10. Galerie per Pull-to-refresh aktualisieren.
11. Fotos ansehen, speichern, teilen oder loeschen.

## CRUD-Abdeckung

### Create

- Fotograf erstellt ein Event.
- Gast erstellt ein Foto durch Upload.
- Firestore erstellt:
  - `weddings/{weddingId}`
  - `photos/{photoId}`
- Storage erstellt:
  - `weddings/{weddingId}/images/{fileName}.jpg`

### Read

- App liest Events des Fotografen.
- App liest einzelne Event-Metadaten.
- App liest Fotos eines Events.
- Gast und Fotograf koennen Galerien anzeigen.

### Update

- Fotograf kann ein Event im `EventDetailScreen` bearbeiten.
- Editierbare Felder: Titel, Datum, Location.
- Die Bearbeitung laeuft ueber ein Bottom-Sheet-Modal.
- Service-Funktion: `updateWedding(weddingId, updates)`.
- Nach dem Speichern aktualisiert sich der Screen direkt ohne App-Neustart.

### Delete

- Fotograf kann Fotos loeschen.
- Client versucht zuerst Storage-Datei zu loeschen.
- Danach wird das Firestore-Foto-Dokument geloescht.

Wichtig:

- Damit Delete wirklich funktioniert, muessen die Firebase Rules deployed sein.

## Firebase-Datenmodell

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
  uploadedBy: 'guest' | 'photographer'
  imageUrl: string
  storagePath: string
  localAssetId?: string | null
  createdAt: Timestamp
```

### Storage

```text
weddings/{weddingId}/images/{timestamp}-{random}.jpg
```

## Firebase-Konfiguration

Die App nutzt keine eigenen REST-Endpunkte. Alle Backend-Zugriffe laufen ueber das Firebase SDK.

Die Firebase-Werte kommen aus `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

Diese Werte werden in `src/firebase/firebase.ts` verwendet.

## Firebase Rules

Rules liegen hier:

```text
firebase.rules/firestore.rules
firebase.rules/storage.rules
```

Deployment:

```bash
firebase deploy --only firestore:rules,storage
```

Wichtig fuer die Demo:

- Ohne deployte Rules kann Foto-Loeschen fehlschlagen.
- Gast-Uploads sind bewusst ohne Auth erlaubt.
- Event-Metadaten und Fotos sind fuer den MVP lesbar.

## Wichtige Dateien

```text
src/App.tsx                         App-Root, Provider, NavigationContainer
src/navigation/RootNavigator.tsx    Stack Navigation
src/firebase/firebase.ts            Firebase Initialisierung
src/services/weddingService.ts      Event-CRUD-nahe Funktionen
src/services/photoService.ts        Foto Upload, Laden, Speichern, Loeschen
src/utils/guestSession.ts           Letztes Gast-Event in AsyncStorage
src/theme/ThemeContext.tsx          Farben und Typografie
```

## Befehle

### Installation

```bash
npm install
```

### App starten

```bash
npm start
```

Startet Expo/Metro. Danach kann man:

- QR-Code mit Expo Go scannen
- Web unter `http://localhost:8081` oeffnen

### Cache leeren und starten

```bash
npm start -- --clear
```

Hilfreich, wenn Metro neue Dateien oder Env-Werte nicht erkennt.

### Android starten

```bash
npm run android
```

Startet Expo fuer Android Emulator oder verbundenes Android-Geraet.

### iOS starten

```bash
npm run ios
```

Nur auf macOS sinnvoll.

### Web starten

```bash
npm run web
```

Oeffnet die Web-Version. Kamera/Media-Library-Verhalten kann von Mobile abweichen.

### TypeScript pruefen

```bash
npx tsc --noEmit
```

Prueft Typfehler, ohne Dateien zu schreiben.

### Lint ausfuehren

```bash
npm run lint
```

Prueft Code-Stil und typische Fehler.

### Firebase Rules deployen

```bash
firebase login
firebase use <projekt-id>
firebase deploy --only firestore:rules,storage
```

## Demo-Checkliste

1. App mit `npm start -- --clear` starten.
2. Als Fotograf registrieren oder einloggen.
3. Neues Event erstellen.
4. Datum mit Datepicker auswaehlen.
5. Event oeffnen.
6. Link kopieren oder QR-Code anzeigen.
7. Als Gast QR scannen oder Link manuell eingeben.
8. Event bestaetigen.
9. Foto aufnehmen.
10. Upload-Erfolg abwarten.
11. Gast-Galerie oeffnen und Foto sehen.
12. App verlassen und wieder oeffnen.
13. Welcome-Screen zeigt letztes Event.
14. Als Fotograf Galerie per Pull-to-refresh aktualisieren.
15. Foto-Vorschau oeffnen.
16. Foto speichern oder teilen.
17. Foto loeschen.

## Bekannte Limitierungen

- Keine Live-Updates; Galerien werden per Pull-to-refresh aktualisiert.
- Keine Offline-Upload-Warteschlange.
- Kein Bulk- oder ZIP-Download.
- Event-Update ist noch nicht umgesetzt.
- Expo Go kann auf modernen Android-Versionen Media-Library-Funktionen eingeschraenkt testen; fuer volle Sicherheit ist ein Development Build besser.

## Naechste sinnvolle Aufgabe

Die CRUD-Abdeckung ist fuer Events und Fotos im MVP sichtbar. Als naechster Ausbau waere sinnvoll:

- Event komplett loeschen inklusive aller zugehoerigen Fotos.
- Optional bessere Echtzeit-Galerie mit Firestore Snapshot Listener.
- Optional Bulk-Download oder Export fuer Fotografen.
