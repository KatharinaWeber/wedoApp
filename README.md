# WedO — Wedding Photo Sharing App

WedO verbindet Hochzeitsgäste und Fotografen in einer gemeinsamen Galerie. Gäste scannen einen QR-Code und laden Fotos direkt hoch – der Fotograf sieht alles in Echtzeit.

## Features

| Rolle | Was ist möglich |
|---|---|
| **Gast** | QR-Code scannen → Event-Frame sehen → Fotos aufnehmen → automatisch hochladen |
| **Fotograf** | Konto erstellen → Events anlegen → QR-Code teilen → Galerie verwalten → Fotos löschen |

## Tech Stack

- **React Native** via Expo ~54 (iOS, Android, Web)
- **Firebase** v12 — Auth, Firestore, Cloud Storage
- **TypeScript** (strict)
- **React Navigation** v6 (native stack)
- Fonts: Playfair Display + Manrope

## Voraussetzungen

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Firebase-Projekt (kostenloser Spark-Plan reicht)

## Setup

```bash
git clone <repo-url>
cd wedoApp

npm install

cp .env.example .env
# .env mit deinen Firebase-Werten befüllen
```

### Firebase-Projekt konfigurieren

1. Neues Projekt unter [console.firebase.google.com](https://console.firebase.google.com) anlegen
2. Authentication → E-Mail/Passwort aktivieren
3. Firestore Database anlegen (Testmodus oder mit den Rules unten)
4. Storage anlegen
5. App registrieren (Web) → Konfiguration in `.env` kopieren

### Firestore & Storage Rules deployen

```bash
npm install -g firebase-tools
firebase login
firebase use <projekt-id>
firebase deploy --only firestore:rules,storage
```

Die Rules liegen unter `firebase.rules/`.

## Starten

```bash
npm start          # Expo Dev-Server
npm run android    # Android Emulator
npm run ios        # iOS Simulator (macOS)
npm run lint       # ESLint
```

## Bildschirmübersicht

```
WelcomeScreen
├── QR-Code scannen  →  QRScannerScreen
│     └── Event bestätigen  →  GuestCameraScreen
├── Wie funktioniert's  →  InstructionsScreen
└── Fotograf-Login  →  LoginScreen
      └── Dashboard
            ├── Event öffnen  →  EventDetailScreen
            │     ├── Guest Camera  →  GuestCameraScreen
            │     └── Einladung teilen  (Share-Sheet)
            └── Anleitung  →  InstructionsScreen
```

## Projekt­struktur

```
src/
  screens/         Alle Screens
  components/      Wiederverwendbare UI-Bausteine
  contexts/        AuthContext (Firebase Auth-State)
  firebase/        Firebase-Initialisierung
  services/        weddingService, photoService
  theme/           ThemeContext (Palette + Typografie)
  types/           TypeScript-Typen
  utils/           Haptics-Helpers, QR-URL-Builder
  navigation/      RootNavigator (Stack)
firebase.rules/    Firestore + Storage Security Rules
```

## Umgebungsvariablen

Alle Firebase-Konfigurationswerte in `.env` (Vorlage: `.env.example`):

```
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

Nie echte Schlüssel in das Repository einchecken.

## Bekannte Limitierungen (MVP)

- Keine Echtzeit-Updates (Daten werden bei Pull-to-Refresh neu geladen)
- Keine Offline-Warteschlange für Uploads
- Gaeste-Fotos werden ohne Authentifizierung hochgeladen (so gewollt)

## Lizenz

Privat / Uni-Projekt. Nicht für die öffentliche Weiterverwendung freigegeben.
