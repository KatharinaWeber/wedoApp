import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import PhotoGrid from '../components/PhotoGrid';
import PhotoPreviewModal from '../components/PhotoPreviewModal';
import QRCodeCard from '../components/QRCodeCard';
import { deletePhoto, getPhotosByWedding, savePhotoToLibrary } from '../services/photoService';
import { getWeddingById, updateWedding, Wedding } from '../services/weddingService';
import { useTheme } from '../theme/ThemeContext';
import { Photo } from '../types';
import { notificationHaptic, selectionHaptic } from '../utils/haptics';

type BusyAction = 'save' | 'share' | 'delete' | null;

export default function EventDetailScreen({ route, navigation }: any) {
  const weddingId = route?.params?.weddingId;
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [busyAction, setBusyAction] = useState<BusyAction>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [, setEditDateValue] = useState(new Date());
  const [editLocation, setEditLocation] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const sheetTranslateY = useRef(new Animated.Value(360)).current;
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const { palette, typography } = useTheme();

  const shareCode = useMemo(() => `wedo://event/${weddingId}`, [weddingId]);

  const loadEvent = useCallback(async () => {
    if (!weddingId) return;
    const [weddingResult, photoResult] = await Promise.all([
      getWeddingById(weddingId),
      getPhotosByWedding(weddingId),
    ]);
    setWedding(weddingResult);
    setPhotos(photoResult);
  }, [weddingId]);

  useEffect(() => {
    (async () => {
      try {
        await loadEvent();
      } finally {
        setLoading(false);
      }
    })();
  }, [loadEvent]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await loadEvent();
    } finally {
      setRefreshing(false);
    }
  };

  const shareInvite = async () => {
    await Share.share({
      message: `Fotos fuer ${wedding?.title || 'unsere Hochzeit'} teilen: ${shareCode}`,
    });
  };

  const formatDate = (value: Date) => {
    return value.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const openEditModal = async () => {
    if (!wedding) return;
    await selectionHaptic();
    setEditTitle(wedding.title || '');
    setEditDate(wedding.date || '');
    setEditLocation(wedding.location || '');
    setEditDateValue(new Date());
    setEditVisible(true);
    sheetTranslateY.setValue(360);
    Animated.spring(sheetTranslateY, {
      toValue: 0,
      friction: 9,
      tension: 90,
      useNativeDriver: true,
    }).start();
  };

  const closeEditModal = () => {
    if (savingEvent) return;
    Animated.timing(sheetTranslateY, {
      toValue: 360,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setEditVisible(false));
  };

  const shiftEditDate = (days: number) => {
    setEditDateValue((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + days);
      setEditDate(formatDate(next));
      return next;
    });
  };

  const shiftEditMonth = (months: number) => {
    setEditDateValue((current) => {
      const next = new Date(current);
      next.setMonth(next.getMonth() + months);
      setEditDate(formatDate(next));
      return next;
    });
  };

  const shiftEditYear = (years: number) => {
    setEditDateValue((current) => {
      const next = new Date(current);
      next.setFullYear(next.getFullYear() + years);
      setEditDate(formatDate(next));
      return next;
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => setToastMessage(''));
  };

  const saveEventChanges = async () => {
    if (!weddingId || !editTitle.trim()) {
      Alert.alert('Titel fehlt', 'Bitte gib einen Namen fuer das Event ein.');
      return;
    }

    setSavingEvent(true);
    try {
      const updates: Partial<Wedding> = {
        title: editTitle.trim(),
        date: editDate.trim(),
        location: editLocation.trim(),
      };
      await updateWedding(weddingId, updates);
      setWedding((current) => (current ? { ...current, ...updates } : current));
      await notificationHaptic(Haptics.NotificationFeedbackType.Success);
      closeEditModal();
      showToast('Event erfolgreich aktualisiert');
    } catch (error: any) {
      await notificationHaptic(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Speichern fehlgeschlagen', error?.message || 'Bitte versuche es erneut.');
    } finally {
      setSavingEvent(false);
    }
  };

  const closePreview = () => {
    if (busyAction) return;
    setSelectedPhoto(null);
  };

  const savePhoto = async (photo: Photo) => {
    setBusyAction('save');
    try {
      await savePhotoToLibrary(photo);
      Alert.alert('Foto gespeichert', 'Das Bild wurde in deiner Galerie gespeichert.');
    } catch (error: any) {
      Alert.alert('Speichern fehlgeschlagen', error?.message || 'Bitte versuche es erneut.');
    } finally {
      setBusyAction(null);
    }
  };

  const sharePhoto = async (photo: Photo) => {
    setBusyAction('share');
    try {
      await Share.share({
        message: `WedO Foto: ${photo.imageUrl}`,
        url: photo.imageUrl,
      });
    } catch {
      Alert.alert('Teilen fehlgeschlagen', 'Das Foto konnte nicht geteilt werden.');
    } finally {
      setBusyAction(null);
    }
  };

  const confirmDelete = (photo: Photo) => {
    Alert.alert('Foto loeschen?', 'Das Bild wird aus Storage und Firestore entfernt.', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Loeschen',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(photo.id);
          setBusyAction('delete');
          try {
            await deletePhoto(photo);
            setPhotos((current) => current.filter((item) => item.id !== photo.id));
            setSelectedPhoto((current) => (current?.id === photo.id ? null : current));
          } catch (error) {
            Alert.alert('Loeschen fehlgeschlagen', 'Bitte versuche es erneut.');
          } finally {
            setDeletingId(null);
            setBusyAction(null);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingSpinner label="Galerie wird geladen" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.accent} />}
      >
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="Zurueck" onPress={() => navigation.goBack()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color={palette.primary} />
          </Pressable>
          <Text style={[styles.logo, typography.heading, { color: palette.primary }]}>WedO</Text>
          <View style={styles.topActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Event bearbeiten" onPress={openEditModal} style={styles.iconButton}>
              <MaterialIcons name="edit" size={22} color={palette.primary} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Galerie teilen" onPress={shareInvite} style={styles.iconButton}>
              <MaterialIcons name="share" size={22} color={palette.primary} />
            </Pressable>
          </View>
        </View>

        {toastMessage ? (
          <Animated.View style={[styles.toast, { opacity: toastOpacity, backgroundColor: palette.success }]}>
            <MaterialIcons name="check-circle" size={18} color="#fff" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </Animated.View>
        ) : null}

        <View style={styles.hero}>
          <Text style={[styles.title, typography.display, { color: palette.primary }]}>
            {wedding?.title || 'Wedding Gallery'}
          </Text>
          <Text style={[styles.date, typography.body, { color: palette.muted }]}>
            {wedding?.date || '12. September 2026'}
          </Text>
          {wedding?.location ? (
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={18} color={palette.muted} />
              <Text style={[styles.location, typography.body, { color: palette.muted }]}>{wedding.location}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Button title="Guest Camera" onPress={() => navigation.navigate('GuestCamera', { weddingId })} />
          <Button title="Einladung teilen" onPress={shareInvite} variant="secondary" />
        </View>

        <QRCodeCard code={shareCode} title="Guest QR Code" />

        <View style={[styles.adminPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <View>
            <Text style={[styles.adminLabel, typography.label, { color: palette.accent }]}>Administrator-Verwaltung</Text>
            <Text style={[styles.adminTitle, typography.subheading, { color: palette.primary }]}>Upload-Status</Text>
          </View>
          <View style={[styles.photoCount, { backgroundColor: palette.surfaceSoft }]}>
            <Text style={[styles.photoCountValue, typography.heading, { color: palette.primary }]}>{photos.length}</Text>
            <Text style={[styles.photoCountLabel, typography.label, { color: palette.muted }]}>Fotos</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, typography.subheading, { color: palette.primary }]}>
            Hochgeladene Fotos ({photos.length})
          </Text>
          {deletingId ? <Text style={[styles.deleting, { color: palette.muted }]}>Loesche...</Text> : null}
        </View>
        <PhotoGrid photos={photos} onPhotoPress={setSelectedPhoto} onDelete={confirmDelete} />
      </ScrollView>

      <PhotoPreviewModal
        busyAction={busyAction}
        onClose={closePreview}
        onDelete={confirmDelete}
        onSave={savePhoto}
        onShare={sharePhoto}
        photo={selectedPhoto}
        visible={Boolean(selectedPhoto)}
      />

      <Modal animationType="fade" transparent visible={editVisible} onRequestClose={closeEditModal}>
        <View style={styles.sheetBackdrop}>
          <Pressable style={styles.sheetDismiss} onPress={closeEditModal} />
          <Animated.View
            style={[
              styles.editSheet,
              { backgroundColor: '#FAF8F5', transform: [{ translateY: sheetTranslateY }] },
            ]}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={[styles.sheetEyebrow, typography.label, { color: palette.accent }]}>CRUD Update</Text>
                <Text style={[styles.sheetTitle, typography.subheading, { color: palette.primary }]}>Event bearbeiten</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Bearbeitung schliessen" onPress={closeEditModal} style={styles.iconButton}>
                <MaterialIcons name="close" size={22} color={palette.primary} />
              </Pressable>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, typography.label, { color: palette.muted }]}>Titel</Text>
              <TextInput
                editable={!savingEvent}
                onChangeText={setEditTitle}
                placeholder="Elena & David"
                placeholderTextColor={palette.muted}
                style={[styles.editInput, typography.body, { borderColor: palette.border, color: palette.primary }]}
                value={editTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, typography.label, { color: palette.muted }]}>Datum</Text>
              <View style={[styles.dateEditPanel, { borderColor: palette.border }]}>
                <Text style={[styles.dateEditValue, typography.heading, { color: palette.primary }]}>
                  {editDate || 'Datum auswaehlen'}
                </Text>
                <View style={styles.dateAdjustRows}>
                  <DateAdjustRow label="Tag" onMinus={() => shiftEditDate(-1)} onPlus={() => shiftEditDate(1)} />
                  <DateAdjustRow label="Monat" onMinus={() => shiftEditMonth(-1)} onPlus={() => shiftEditMonth(1)} />
                  <DateAdjustRow label="Jahr" onMinus={() => shiftEditYear(-1)} onPlus={() => shiftEditYear(1)} />
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, typography.label, { color: palette.muted }]}>Location</Text>
              <TextInput
                editable={!savingEvent}
                onChangeText={setEditLocation}
                placeholder="Location"
                placeholderTextColor={palette.muted}
                style={[styles.editInput, typography.body, { borderColor: palette.border, color: palette.primary }]}
                value={editLocation}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Event speichern"
              accessibilityState={{ disabled: savingEvent }}
              disabled={savingEvent}
              onPress={saveEventChanges}
              style={({ pressed }) => [
                styles.saveEventButton,
                { borderColor: palette.accent, opacity: pressed || savingEvent ? 0.76 : 1 },
              ]}
            >
              {savingEvent ? (
                <ActivityIndicator color={palette.accent} />
              ) : (
                <>
                  <MaterialIcons name="save" size={20} color={palette.primary} />
                  <Text style={[styles.saveEventText, typography.label, { color: palette.primary }]}>Speichern</Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );

  function DateAdjustRow({ label, onMinus, onPlus }: { label: string; onMinus: () => void; onPlus: () => void }) {
    return (
      <View style={styles.dateAdjustRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} verringern`}
          onPress={onMinus}
          style={[styles.dateAdjustButton, { borderColor: palette.border }]}
        >
          <MaterialIcons name="remove" size={20} color={palette.primary} />
        </Pressable>
        <Text style={[styles.dateAdjustLabel, typography.label, { color: palette.primary }]}>{label}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} erhoehen`}
          onPress={onPlus}
          style={[styles.dateAdjustButton, { borderColor: palette.border }]}
        >
          <MaterialIcons name="add" size={20} color={palette.primary} />
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    marginTop: 32,
  },
  topActions: {
    flexDirection: 'row',
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  logo: {
    fontSize: 26,
    lineHeight: 32,
  },
  toast: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    padding: 12,
  },
  toastText: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  hero: {
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    lineHeight: 50,
  },
  date: {
    fontSize: 16,
    marginTop: 8,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  location: {
    flex: 1,
    fontSize: 14,
  },
  actions: {
    gap: 12,
    marginBottom: 16,
  },
  adminPanel: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 16,
  },
  adminLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  adminTitle: {
    fontSize: 22,
    lineHeight: 28,
    marginTop: 4,
  },
  photoCount: {
    alignItems: 'center',
    borderRadius: 12,
    minWidth: 72,
    padding: 12,
  },
  photoCountValue: {
    fontSize: 28,
    lineHeight: 34,
  },
  photoCountLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  deleting: {
    fontSize: 13,
  },
  sheetBackdrop: {
    backgroundColor: 'rgba(30, 27, 22, 0.48)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetDismiss: {
    flex: 1,
  },
  editSheet: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    paddingBottom: 34,
  },
  sheetHandle: {
    alignSelf: 'center',
    backgroundColor: 'rgba(30, 27, 22, 0.22)',
    borderRadius: 2,
    height: 4,
    marginBottom: 16,
    width: 44,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetEyebrow: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  sheetTitle: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: 2,
  },
  formGroup: {
    gap: 8,
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  editInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  dateEditPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  dateEditValue: {
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  dateAdjustRows: {
    gap: 8,
    marginTop: 14,
  },
  dateAdjustRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateAdjustButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 64,
  },
  dateAdjustLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  saveEventButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 52,
  },
  saveEventText: {
    fontSize: 13,
    textTransform: 'uppercase',
  },
});
