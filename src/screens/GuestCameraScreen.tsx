import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Camera,
  CameraType,
  CameraView,
  FlashMode,
} from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import { uploadPhoto } from '../services/photoService';
import { getWeddingById } from '../services/weddingService';
import { useTheme } from '../theme/ThemeContext';
import { impactHaptic, notificationHaptic, selectionHaptic } from '../utils/haptics';

type PermissionState = 'checking' | 'granted' | 'denied';
type CaptureState = 'idle' | 'saving' | 'success' | 'error';

export default function GuestCameraScreen({ route, navigation }: any) {
  const weddingId: string | undefined = route?.params?.weddingId;
  const [eventTitle, setEventTitle] = useState<string>('');
  const { palette, typography } = useTheme();
  const cameraRef = useRef<CameraView | null>(null);
  const shutterScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.35)).current;
  const [permissionState, setPermissionState] = useState<PermissionState>('checking');
  const [captureState, setCaptureState] = useState<CaptureState>('idle');
  const [statusMessage, setStatusMessage] = useState('Bereit fuer euren Moment');
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');

  const isSaving = captureState === 'saving';

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (!weddingId) return;
    getWeddingById(weddingId).then((w) => {
      if (w?.title) setEventTitle(w.title);
    });
  }, [weddingId]);

  useEffect(() => {
    if (permissionState !== 'checking') return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 0.85,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [permissionState, pulseOpacity]);

  const requestPermissions = async () => {
    setPermissionState('checking');

    try {
      const [cameraPermission, mediaPermission] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        MediaLibrary.requestPermissionsAsync(),
      ]);

      const hasRequiredPermissions =
        cameraPermission.status === 'granted' && mediaPermission.status === 'granted';

      setPermissionState(hasRequiredPermissions ? 'granted' : 'denied');
    } catch (error) {
      setPermissionState('denied');
    }
  };

  const animateShutter = (toValue: number) => {
    Animated.spring(shutterScale, {
      toValue,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const takePhoto = async () => {
    if (!cameraRef.current || isSaving || !weddingId) return;

    setCaptureState('saving');
    setStatusMessage('Foto wird lokal gesichert und hochgeladen');
    console.log('[GuestCamera] capture started', { weddingId });
    await impactHaptic(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.86,
        skipProcessing: false,
      });
      console.log('[GuestCamera] photo captured', { uri: photo.uri, width: photo.width, height: photo.height });

      const localAsset = await MediaLibrary.createAssetAsync(photo.uri);
      console.log('[GuestCamera] saved to media library', { localAssetId: localAsset.id });

      const uploadedPhoto = await uploadPhoto(weddingId, photo.uri, 'guest', { localAssetId: localAsset.id });
      console.log('[GuestCamera] uploaded to firebase', uploadedPhoto);

      setCaptureState('success');
      setStatusMessage('Gespeichert und hochgeladen');
      await notificationHaptic(Haptics.NotificationFeedbackType.Success);

      setTimeout(() => {
        setCaptureState('idle');
        setStatusMessage('Bereit fuer euren Moment');
      }, 1600);
    } catch (error) {
      setCaptureState('error');
      setStatusMessage('Das Foto konnte nicht vollstaendig gespeichert werden');
      console.error('[GuestCamera] capture/upload failed', error);
      await notificationHaptic(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Foto nicht abgeschlossen',
        'Bitte pruefe deine Verbindung und versuche es erneut. Falls der lokale Speicher bereits geklappt hat, bleibt das Bild in deiner Galerie.',
      );
    }
  };

  const toggleCamera = async () => {
    await selectionHaptic();
    setCameraType((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = async () => {
    await selectionHaptic();
    setFlashMode((current) => (current === 'off' ? 'on' : 'off'));
  };

  const openGallery = async () => {
    if (!weddingId) return;
    await selectionHaptic();
    navigation.navigate('GuestGallery', { weddingId });
  };

  if (!weddingId) {
    return (
      <SafeAreaView style={[styles.permissionContainer, { backgroundColor: palette.background }]}>
        <View style={[styles.permissionPanel, { borderColor: palette.accent }]}>
          <Text style={[styles.permissionTitle, typography.heading, { color: palette.primary }]}>
            Kein Event ausgewaehlt
          </Text>
          <Text style={[styles.permissionText, { color: palette.primary }]}>
            Bitte scanne zuerst den QR-Code des Fotografen, um einem Event beizutreten.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.permissionButton,
              { backgroundColor: palette.accent, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={styles.permissionButtonText}>Zurueck</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (permissionState === 'checking') {
    return (
      <SafeAreaView style={[styles.permissionContainer, { backgroundColor: palette.background }]}>
        <Animated.View
          style={[
            styles.skeletonCard,
            { borderColor: palette.accent, opacity: pulseOpacity },
          ]}
        />
        <View style={styles.permissionCopy}>
          <Text style={[styles.permissionTitle, typography.heading, { color: palette.primary }]}>
            Kamera wird vorbereitet
          </Text>
          <Text style={[styles.permissionText, { color: palette.primary }]}>
            Einen Augenblick, wir holen die Freigaben fuer Kamera und Galerie.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (permissionState === 'denied') {
    return (
      <SafeAreaView style={[styles.permissionContainer, { backgroundColor: palette.background }]}>
        <View style={[styles.permissionPanel, { borderColor: palette.accent }]}>
          <Text style={[styles.permissionTitle, typography.heading, { color: palette.primary }]}>
            Zugriff benoetigt
          </Text>
          <Text style={[styles.permissionText, { color: palette.primary }]}>
            WedO braucht Kamera- und Galerie-Zugriff, um Fotos lokal und in der Hochzeitsgalerie
            zu sichern.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Berechtigungen erneut pruefen"
            onPress={requestPermissions}
            style={({ pressed }) => [
              styles.permissionButton,
              { backgroundColor: palette.accent, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={styles.permissionButtonText}>Erneut pruefen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        facing={cameraType}
        flash={flashMode}
        ratio="16:9"
        ref={(camera) => {
          cameraRef.current = camera;
        }}
        style={styles.camera}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Blitz umschalten"
            hitSlop={12}
            onPress={toggleFlash}
            style={({ pressed }) => [
              styles.backButton,
              { borderColor: 'rgba(250, 248, 245, 0.55)', opacity: pressed ? 0.78 : 1 },
            ]}
          >
            <Text style={styles.backButtonText}>{flashMode === 'on' ? 'Blitz an' : 'Blitz'}</Text>
          </Pressable>
          <View style={styles.eventPill}>
            <Text style={styles.eventPillText}>{eventTitle || 'WedO'}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kamera schliessen"
            hitSlop={12}
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.closeButton,
              { borderColor: 'rgba(250, 248, 245, 0.55)', opacity: pressed ? 0.78 : 1 },
            ]}
          >
            <Text style={styles.backButtonText}>Schliessen</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.statusPanel}>
            <Text style={[styles.statusTitle, typography.heading]}>
              {captureState === 'success' ? 'Danke' : 'WedO Moments'}
            </Text>
            <Text style={styles.statusText}>{statusMessage}</Text>
            {isSaving && <ActivityIndicator color={palette.accent} style={styles.spinner} />}
          </View>

          <View style={styles.captureRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Galerie oeffnen" onPress={openGallery} style={styles.sideAction}>
              <Text style={styles.sideActionText}>Galerie</Text>
            </Pressable>
          <Animated.View style={{ transform: [{ scale: shutterScale }] }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Foto aufnehmen"
              accessibilityState={{ disabled: isSaving }}
              disabled={isSaving}
              onPress={takePhoto}
              onPressIn={() => animateShutter(0.94)}
              onPressOut={() => animateShutter(1)}
              style={({ pressed }) => [
                styles.shutter,
                {
                  borderColor: palette.white,
                  backgroundColor: isSaving ? 'rgba(197, 160, 89, 0.55)' : palette.accent,
                  opacity: pressed || isSaving ? 0.9 : 1,
                },
              ]}
            >
              <View style={[styles.shutterCore, { backgroundColor: palette.white }]} />
            </Pressable>
          </Animated.View>
            <Pressable accessibilityRole="button" accessibilityLabel="Kamera wechseln" onPress={toggleCamera} style={styles.sideAction}>
              <Text style={styles.sideActionText}>Wechseln</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: '#FAF8F5',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  eventPill: {
    backgroundColor: 'rgba(250, 248, 245, 0.16)',
    borderColor: 'rgba(250, 248, 245, 0.34)',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  eventPillText: {
    color: '#FAF8F5',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  statusPanel: {
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.58)',
    borderColor: 'rgba(250, 248, 245, 0.18)',
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: 360,
    minHeight: 96,
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: '100%',
  },
  statusTitle: {
    color: '#FAF8F5',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 30,
  },
  statusText: {
    color: 'rgba(250, 248, 245, 0.82)',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    textAlign: 'center',
  },
  spinner: {
    marginTop: 12,
  },
  shutter: {
    alignItems: 'center',
    borderRadius: 44,
    borderWidth: 5,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  captureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sideAction: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    width: 88,
  },
  sideActionText: {
    color: '#FAF8F5',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  modeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
  },
  modeText: {
    color: '#FAF8F5',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  modeMuted: {
    opacity: 0.52,
  },
  shutterCore: {
    borderRadius: 27,
    height: 54,
    opacity: 0.92,
    width: 54,
  },
  permissionContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  skeletonCard: {
    borderRadius: 12,
    borderWidth: 1,
    height: 220,
    maxWidth: 360,
    width: '100%',
  },
  permissionCopy: {
    marginTop: 24,
    maxWidth: 360,
  },
  permissionPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: 360,
    padding: 24,
    width: '100%',
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 34,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  permissionButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 48,
    paddingHorizontal: 20,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
