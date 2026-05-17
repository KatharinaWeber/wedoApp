import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getWeddingById, Wedding } from '../services/weddingService';
import { useTheme } from '../theme/ThemeContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { saveLastGuestWeddingId } from '../utils/guestSession';

type QRScannerNavigation = NativeStackNavigationProp<RootStackParamList, 'QRScanner'>;

type ScanState = 'scanning' | 'loading' | 'found' | 'error';

export default function QRScannerScreen() {
  const nav = useNavigation<QRScannerNavigation>();
  const { palette, typography } = useTheme();
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const scannedRef = useRef(false);

  const loadWeddingFromLink = useCallback(async (data: string, invalidMessage: string) => {
    const match = data.trim().match(/^wedo:\/\/event\/(.+)$/);
    if (!match) {
      setErrorMsg(invalidMessage);
      setScanState('error');
      return;
    }

    const weddingId = match[1].trim();
    if (!weddingId) {
      setErrorMsg(invalidMessage);
      setScanState('error');
      return;
    }

    try {
      const result = await getWeddingById(weddingId);
      if (!result) {
        setErrorMsg('Dieses Event wurde nicht gefunden. Bitte frage den Fotografen nach dem aktuellen QR-Code.');
        setScanState('error');
        return;
      }
      await saveLastGuestWeddingId(result.id);
      setWedding(result);
      setScanState('found');
    } catch {
      setErrorMsg('Verbindung fehlgeschlagen. Bitte pruefe dein WLAN und versuche es erneut.');
      setScanState('error');
    }
  }, []);

  const handleBarcode = useCallback(
    async ({ data }: { data: string }) => {
      if (scannedRef.current) return;
      scannedRef.current = true;

      setScanState('loading');
      await loadWeddingFromLink(data, 'Dieser QR-Code gehoert nicht zu WedO. Bitte scanne den Code vom Hochzeitsfotografen.');
    },
    [loadWeddingFromLink],
  );

  const retry = () => {
    scannedRef.current = false;
    setErrorMsg('');
    setWedding(null);
    setScanState('scanning');
  };

  const submitManualUrl = async () => {
    scannedRef.current = true;
    setErrorMsg('');
    setWedding(null);
    setScanState('loading');
    await loadWeddingFromLink(
      manualUrl,
      'Bitte gib einen WedO-Link im Format wedo://event/DEINE_EVENT_ID ein.',
    );
  };

  if (scanState === 'found' && wedding) {
    return (
      <SafeAreaView style={[styles.frameContainer, { backgroundColor: palette.background }]}>
        <View style={styles.frameInner}>
          <View style={[styles.frameBadge, { backgroundColor: palette.accent }]}>
            <MaterialIcons name="favorite" size={18} color="#fff" />
            <Text style={styles.frameBadgeText}>Du wurdest eingeladen</Text>
          </View>

          <Text style={[styles.frameTitle, typography.display, { color: palette.primary }]}>
            {wedding.title}
          </Text>

          {wedding.date ? (
            <View style={styles.frameMeta}>
              <MaterialIcons name="calendar-today" size={16} color={palette.muted} />
              <Text style={[styles.frameMetaText, typography.body, { color: palette.muted }]}>
                {wedding.date}
              </Text>
            </View>
          ) : null}

          {wedding.location ? (
            <View style={styles.frameMeta}>
              <MaterialIcons name="location-on" size={16} color={palette.muted} />
              <Text style={[styles.frameMetaText, typography.body, { color: palette.muted }]}>
                {wedding.location}
              </Text>
            </View>
          ) : null}

          <View style={[styles.frameCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <MaterialIcons name="photo-camera" size={28} color={palette.accent} />
            <Text style={[styles.frameCardTitle, typography.subheading, { color: palette.primary }]}>
              Teile deine Momente
            </Text>
            <Text style={[styles.frameCardBody, typography.body, { color: palette.muted }]}>
              Fotografiere direkt mit der WedO-Kamera. Deine Bilder landen sofort in der Galerie des Brautpaars.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kamera oeffnen und Fotos aufnehmen"
            onPress={() => nav.replace('GuestCamera', { weddingId: wedding.id })}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: palette.accent, opacity: pressed ? 0.84 : 1 },
            ]}
          >
            <MaterialIcons name="photo-camera" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Fotos aufnehmen</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abbrechen und zurueck"
            onPress={() => nav.goBack()}
            style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.secondaryButtonText, { color: palette.muted }]}>Abbrechen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (scanState === 'error') {
    return (
      <SafeAreaView style={[styles.frameContainer, { backgroundColor: palette.background }]}>
        <View style={styles.frameInner}>
          <View style={[styles.errorIcon, { backgroundColor: palette.surfaceSoft }]}>
            <MaterialIcons name="qr-code-scanner" size={32} color={palette.muted} />
          </View>
          <Text style={[styles.frameTitle, typography.heading, { color: palette.primary }]}>
            Code nicht erkannt
          </Text>
          <Text style={[styles.frameCardBody, typography.body, { color: palette.muted, textAlign: 'center' }]}>
            {errorMsg}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Erneut scannen"
            onPress={retry}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: palette.accent, opacity: pressed ? 0.84 : 1 },
            ]}
          >
            <MaterialIcons name="refresh" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Erneut scannen</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Link manuell eingeben"
            onPress={() => {
              retry();
              setShowManualEntry(true);
            }}
            style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.secondaryButtonText, { color: palette.muted }]}>Link manuell eingeben</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => nav.goBack()}
            style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.secondaryButtonText, { color: palette.muted }]}>Zurueck</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanState === 'scanning' ? handleBarcode : undefined}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        pointerEvents="box-none"
        style={styles.overlay}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Schliessen"
            hitSlop={12}
            onPress={() => nav.goBack()}
            style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.75 : 1 }]}
          >
            <MaterialIcons name="close" size={22} color="#FAF8F5" />
          </Pressable>
          <View style={styles.pill}>
            <Text style={styles.pillText}>WedO</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.scanArea}>
          <View style={[styles.scanFrame, styles.cornerTL]} />
          <View style={[styles.scanFrame, styles.cornerTR]} />
          <View style={[styles.scanFrame, styles.cornerBL]} />
          <View style={[styles.scanFrame, styles.cornerBR]} />
          {scanState === 'loading' && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#FAF8F5" />
              <Text style={styles.loadingText}>Event wird geladen …</Text>
            </View>
          )}
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintTitle}>QR-Code scannen</Text>
          <Text style={styles.hintBody}>
            Halte die Kamera auf den QR-Code, den dir der Fotograf gegeben hat.
          </Text>
          {!showManualEntry ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="WedO-Link manuell eingeben"
              onPress={() => setShowManualEntry(true)}
              style={({ pressed }) => [styles.manualToggle, { opacity: pressed ? 0.72 : 1 }]}
            >
              <Text style={styles.manualToggleText}>Kein QR-Code?</Text>
            </Pressable>
          ) : (
            <View style={styles.manualPanel}>
              <Text style={styles.manualTitle}>Link einfuegen</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={scanState !== 'loading'}
                keyboardType="url"
                onChangeText={setManualUrl}
                placeholder="wedo://event/..."
                placeholderTextColor="rgba(250, 248, 245, 0.52)"
                returnKeyType="go"
                onSubmitEditing={submitManualUrl}
                style={styles.manualInput}
                value={manualUrl}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="WedO-Link pruefen"
                disabled={scanState === 'loading' || !manualUrl.trim()}
                onPress={submitManualUrl}
                style={({ pressed }) => [
                  styles.manualSubmit,
                  { opacity: pressed || scanState === 'loading' || !manualUrl.trim() ? 0.64 : 1 },
                ]}
              >
                {scanState === 'loading' ? (
                  <ActivityIndicator color="#FAF8F5" />
                ) : (
                  <Text style={styles.manualSubmitText}>Event oeffnen</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    width: '100%',
  },
  closeBtn: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pill: {
    backgroundColor: 'rgba(250, 248, 245, 0.16)',
    borderColor: 'rgba(250, 248, 245, 0.34)',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  pillText: {
    color: '#FAF8F5',
    fontSize: 13,
    fontWeight: '600',
  },
  scanArea: {
    alignItems: 'center',
    height: 240,
    justifyContent: 'center',
    width: 240,
  },
  scanFrame: {
    borderColor: '#FAF8F5',
    height: CORNER_SIZE,
    position: 'absolute',
    width: CORNER_SIZE,
  },
  cornerTL: {
    borderLeftWidth: CORNER_THICKNESS,
    borderTopWidth: CORNER_THICKNESS,
    left: 0,
    top: 0,
  },
  cornerTR: {
    borderRightWidth: CORNER_THICKNESS,
    borderTopWidth: CORNER_THICKNESS,
    right: 0,
    top: 0,
  },
  cornerBL: {
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    bottom: 0,
    left: 0,
  },
  cornerBR: {
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    bottom: 0,
    right: 0,
  },
  loadingOverlay: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#FAF8F5',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    alignItems: 'center',
    paddingBottom: 56,
    paddingHorizontal: 40,
    width: '100%',
  },
  hintTitle: {
    color: '#FAF8F5',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  hintBody: {
    color: 'rgba(250, 248, 245, 0.78)',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  manualToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 44,
    paddingHorizontal: 20,
  },
  manualToggleText: {
    color: '#FAF8F5',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  manualPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    borderColor: 'rgba(250, 248, 245, 0.22)',
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginTop: 16,
    maxWidth: 360,
    padding: 14,
    width: '100%',
  },
  manualTitle: {
    color: '#FAF8F5',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  manualInput: {
    borderColor: 'rgba(250, 248, 245, 0.34)',
    borderRadius: 12,
    borderWidth: 1,
    color: '#FAF8F5',
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  manualSubmit: {
    alignItems: 'center',
    backgroundColor: 'rgba(197, 160, 89, 0.96)',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 48,
  },
  manualSubmitText: {
    color: '#FAF8F5',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  frameInner: {
    alignItems: 'center',
    padding: 28,
  },
  frameBadge: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 28,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  frameBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  frameTitle: {
    fontSize: 38,
    lineHeight: 46,
    textAlign: 'center',
  },
  frameMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  frameMetaText: {
    fontSize: 15,
  },
  frameCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginTop: 32,
    padding: 20,
    width: '100%',
  },
  frameCardTitle: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  frameCardBody: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 52,
    paddingHorizontal: 28,
    width: '100%',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 44,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontSize: 14,
  },
  errorIcon: {
    alignItems: 'center',
    borderRadius: 40,
    height: 72,
    justifyContent: 'center',
    marginBottom: 20,
    width: 72,
  },
});
