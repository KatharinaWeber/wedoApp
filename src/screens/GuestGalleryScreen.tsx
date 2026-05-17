import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import PhotoGrid from '../components/PhotoGrid';
import PhotoPreviewModal from '../components/PhotoPreviewModal';
import { getPhotosByWedding, savePhotoToLibrary } from '../services/photoService';
import { getWeddingById, Wedding } from '../services/weddingService';
import { useTheme } from '../theme/ThemeContext';
import { Photo } from '../types';

type BusyAction = 'save' | 'share' | null;

export default function GuestGalleryScreen({ route, navigation }: any) {
  const weddingId: string | undefined = route?.params?.weddingId;
  const { palette, typography } = useTheme();
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [busyAction, setBusyAction] = useState<BusyAction>(null);

  const loadGallery = useCallback(async () => {
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
        await loadGallery();
      } finally {
        setLoading(false);
      }
    })();
  }, [loadGallery]);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await loadGallery();
    } finally {
      setRefreshing(false);
    }
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
        <View style={styles.iconButton} />
      </View>

      <Text style={[styles.title, typography.display, { color: palette.primary }]}>
        {wedding?.title || 'Wedding Gallery'}
      </Text>
      <Text style={[styles.subtitle, typography.body, { color: palette.muted }]}>
        Sieh dir die aktuellen Fotos an oder lade weitere Momente hoch.
      </Text>

      <View style={styles.actions}>
        <Button title="Foto hochladen" onPress={() => navigation.navigate('GuestCamera', { weddingId })} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, typography.subheading, { color: palette.primary }]}>
          Fotos ({photos.length})
        </Text>
        <MaterialIcons name="photo-library" size={20} color={palette.muted} />
      </View>
      <PhotoGrid photos={photos} onPhotoPress={setSelectedPhoto} />

      <PhotoPreviewModal
        busyAction={busyAction}
        onClose={() => !busyAction && setSelectedPhoto(null)}
        onSave={savePhoto}
        onShare={sharePhoto}
        photo={selectedPhoto}
        visible={Boolean(selectedPhoto)}
      />
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
  title: {
    fontSize: 42,
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  actions: {
    marginTop: 20,
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
});
