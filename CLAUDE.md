# WedO — Claude Project Context

## Project Overview

WedO is a React Native (Expo) wedding photography app with two user roles:

- **Guests** scan a QR code at the wedding and upload photos directly to the couple's gallery
- **Photographers** create events, manage galleries, share QR codes, and download all guest photos

Firebase is the sole backend (Auth + Firestore + Cloud Storage). No server-side code exists.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native via Expo ~54 |
| Language | TypeScript (strict) |
| Navigation | React Navigation v6 (native stack) |
| Backend | Firebase v12 (Auth, Firestore, Storage) |
| Fonts | Playfair Display (display/heading) + Manrope (body) |
| Icons | `@expo/vector-icons` MaterialIcons |
| QR | `react-native-qrcode-svg` (generate) + `expo-camera` (scan) |
| Haptics | `expo-haptics` via `src/utils/haptics.ts` |
| State | React Context (Auth + Theme) |

## Repository Structure

```
src/
  screens/
    WelcomeScreen.tsx       landing page, routes to QRScanner or Login
    LoginScreen.tsx         email/password auth for photographers
    DashboardScreen.tsx     photographer portal: list events, create events
    EventDetailScreen.tsx   gallery view: photos, QR code card, share invite
    GuestCameraScreen.tsx   camera for guests: capture + upload to Firebase
    QRScannerScreen.tsx     scan event QR → show event frame → open camera
    InstructionsScreen.tsx  how-to guide for guests and photographers
  components/
    Button.tsx              primary / secondary / ghost, loading state
    Input.tsx               labeled input with error display
    LoadingSpinner.tsx      centered spinner + label
    QRCodeCard.tsx          renders a QR code with label
    PhotoGrid.tsx           3-column grid with optional delete buttons
    WeddingCard.tsx         event card for dashboard list
  contexts/
    AuthContext.tsx         Firebase auth state + login/register/logout
  firebase/
    firebase.ts             init app, export auth / db / storage
  services/
    weddingService.ts       createWedding / getWeddingsByUser / getWeddingById
    photoService.ts         uploadPhoto / getPhotosByWedding / deletePhoto
  theme/
    ThemeContext.tsx         palette + typography constants
  types/
    index.ts                User / Wedding / Photo types
  utils/
    haptics.ts              impact / notification / selection helpers
    qr.ts                   makeEventLink(weddingId) → "wedo://event/{id}"
  navigation/
    RootNavigator.tsx       stack: Welcome → Login → Dashboard → EventDetail → GuestCamera / QRScanner / Instructions
firebase.rules/
  firestore.rules
  storage.rules
```

## Firebase Data Model

### Firestore

```
weddings/{weddingId}
  title: string
  createdBy: string        # photographer's Firebase uid
  shareCode: string        # 6-char random code (legacy, actual link uses doc id)
  date?: string            # free-text date string
  location?: string
  createdAt: Timestamp

photos/{photoId}
  weddingId: string
  uploadedBy: string       # uid or 'guest'
  imageUrl: string         # public download URL
  storagePath: string      # path in Cloud Storage
  createdAt: Timestamp
```

### Cloud Storage

```
weddings/{weddingId}/images/{timestamp}-{random}.jpg
```

The folder is created implicitly when the first photo is uploaded.

## Deep-Link / QR URL Format

```
wedo://event/{weddingId}
```

Scheme `wedo` is registered in `app.json`. The QR code in `EventDetailScreen` encodes this URL. `QRScannerScreen` parses it with:

```ts
const match = data.match(/^wedo:\/\/event\/(.+)$/);
const weddingId = match?.[1];
```

## Navigation Flow

```
Welcome
├── "QR-Code scannen"  →  QRScannerScreen
│     └── (scan + confirm)  →  GuestCameraScreen { weddingId }
├── "Anleitung"        →  InstructionsScreen
└── "Fotograf Login"   →  LoginScreen
      └── auth success →  Dashboard
            ├── click event card        →  EventDetail { weddingId }
            │     ├── "Guest Camera"    →  GuestCameraScreen { weddingId }
            │     └── "Einladung teilen" → native Share sheet
            └── "Anleitung"            →  InstructionsScreen
```

## Key Conventions

- **Theme access**: `const { palette, typography } = useTheme() as any;`
  - `palette.primary` (dark warm brown), `palette.accent` (gold), `palette.muted`, `palette.surface`, `palette.border`
  - `typography.display`, `.heading`, `.subheading`, `.body`, `.label`
- **All user-visible strings** are German (the target user base is German-speaking)
- **Error display**: show errors inline; use `Alert.alert` for destructive confirmations only
- **Haptics**: call helpers from `src/utils/haptics.ts` for button presses; avoid raw `Haptics.*` calls in screens
- **No real-time listeners**: all data is fetched on mount + pull-to-refresh (`RefreshControl`)
- **Photos**: upload goes through `photoService.uploadPhoto` — never call Firebase Storage directly from screens

## Services API

```ts
// weddingService.ts
createWedding(title, createdBy, date?, location?) → Promise<Wedding>
getWeddingsByUser(uid) → Promise<(Wedding & { photoCount: number })[]>
getWeddingById(weddingId) → Promise<Wedding | null>

// photoService.ts
uploadPhoto(weddingId, localUri, uploadedBy?, options?) → Promise<{ id, weddingId, imageUrl, storagePath }>
getPhotosByWedding(weddingId) → Promise<Photo[]>
deletePhoto(photo) → Promise<void>
```

## Known Issues / Limitations

- **No real-time updates** — data only refreshes on mount or manual pull-to-refresh
- **N+1 query** in `getWeddingsByUser` — one extra Firestore query per wedding to count photos
- **Guest upload without auth** — Storage rules allow unauthenticated writes (intentional for guest flow)
- **Firestore delete rule bug** — photo delete rule checks `createdBy` but the field is named `uploadedBy`
- **No offline support** — failed uploads are not queued or retried
- **`as any` casts** on `useTheme()` return value — TypeScript generic is not fully wired up

## Development

```bash
npm start          # Expo dev server
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run lint       # ESLint

# Environment
cp .env.example .env   # fill in Firebase config
```

Firebase config keys are in `.env` and loaded via `src/firebase/firebase.ts`. Never commit real API keys.

## Firebase Rules Files

`firebase.rules/firestore.rules` and `storage.rules` must be deployed separately via the Firebase CLI:

```bash
firebase deploy --only firestore:rules,storage
```
