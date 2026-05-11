import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import PhotoGrid from '../components/PhotoGrid';
import QRCodeCard from '../components/QRCodeCard';
import { deletePhoto, getPhotosByWedding } from '../services/photoService';
import { getWeddingById, Wedding } from '../services/weddingService';
import { useTheme } from '../theme/ThemeContext';

export default function EventDetailScreen({ route, navigation }: any) {
  const weddingId = route?.params?.weddingId;
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { palette, typography } = useTheme() as any;

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

  const confirmDelete = (photo: any) => {
    Alert.alert('Foto loeschen?', 'Das Bild wird aus Storage und Firestore entfernt.', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Loeschen',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(photo.id);
          try {
            await deletePhoto(photo);
            setPhotos((current) => current.filter((item) => item.id !== photo.id));
          } catch (error) {
            Alert.alert('Loeschen fehlgeschlagen', 'Bitte versuche es erneut.');
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingSpinner label="Galerie wird geladen" />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.accent} />}
    >
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Zurueck" onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={palette.primary} />
        </Pressable>
        <Text style={[styles.logo, typography.heading, { color: palette.primary }]}>WedO</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Galerie teilen" onPress={shareInvite} style={styles.iconButton}>
          <MaterialIcons name="share" size={22} color={palette.primary} />
        </Pressable>
      </View>

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
      <PhotoGrid photos={photos} onDelete={confirmDelete} />
    </ScrollView>
  );
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
});
