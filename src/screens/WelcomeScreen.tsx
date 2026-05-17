import React, { useCallback, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeContext';
import Button from '../components/Button';
import { getWeddingById, Wedding } from '../services/weddingService';
import { clearLastGuestWeddingId, getLastGuestWeddingId } from '../utils/guestSession';

type WelcomeNavigation = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const heroImage =
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';

export default function WelcomeScreen() {
  const nav = useNavigation<WelcomeNavigation>();
  const { palette, typography } = useTheme();
  const [lastWedding, setLastWedding] = useState<Wedding | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        const weddingId = await getLastGuestWeddingId();
        if (!weddingId) {
          if (active) setLastWedding(null);
          return;
        }

        const wedding = await getWeddingById(weddingId);
        if (!active) return;

        if (wedding) {
          setLastWedding(wedding);
        } else {
          await clearLastGuestWeddingId();
          setLastWedding(null);
        }
      })();

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <ImageBackground source={{ uri: heroImage }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.scrim} />
        <View style={styles.brandRow}>
          <Text style={[styles.brand, typography.heading]}>WedO</Text>
        </View>
        <View style={styles.heroCopy}>
          <Text style={[styles.kicker, typography.label]}>Wedding memories</Text>
          <Text style={[styles.title, typography.display]}>Capture Every Moment</Text>
          <Text style={[styles.subtitle, typography.body]}>
            Gaeste teilen Fotos direkt in die Galerie, Fotografen behalten alles elegant im Blick.
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.actions}>
        {lastWedding ? (
          <View style={[styles.guestReturn, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <View style={styles.guestReturnHeader}>
              <MaterialIcons name="favorite" size={20} color={palette.accent} />
              <Text style={[styles.guestReturnLabel, typography.label, { color: palette.accent }]}>
                Letztes Event
              </Text>
            </View>
            <Text style={[styles.guestReturnTitle, typography.subheading, { color: palette.primary }]}>
              {lastWedding.title}
            </Text>
            <View style={styles.guestReturnActions}>
              <Button
                title="Weiter hochladen"
                onPress={() => nav.navigate('GuestCamera', { weddingId: lastWedding.id })}
                style={styles.guestReturnButton}
              />
              <Button
                title="Fotos ansehen"
                variant="secondary"
                onPress={() => nav.navigate('GuestGallery', { weddingId: lastWedding.id })}
                style={styles.guestReturnButton}
              />
            </View>
          </View>
        ) : null}

        <Button title="QR-Code scannen" onPress={() => nav.navigate('QRScanner')} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fotograf Login oeffnen"
          onPress={() => nav.navigate('Login')}
          style={({ pressed }) => [styles.loginLink, { opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialIcons name="person" size={18} color={palette.muted} />
          <Text style={[styles.loginText, typography.body, { color: palette.muted }]}>
            Du bist der Fotograf? Hier einloggen
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Anleitung oeffnen"
          onPress={() => nav.navigate('Instructions')}
          style={({ pressed }) => [styles.loginLink, { opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialIcons name="help-outline" size={18} color={palette.muted} />
          <Text style={[styles.loginText, typography.body, { color: palette.muted }]}>
            Wie funktionierts?
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  heroImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 27, 22, 0.36)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  brandRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 248, 243, 0.88)',
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  brand: {
    color: '#1E1B16',
    fontSize: 26,
    lineHeight: 44,
  },
  heroCopy: {
    paddingBottom: 56,
  },
  kicker: {
    color: '#F8EFE6',
    fontSize: 12,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 44,
    lineHeight: 52,
    maxWidth: 310,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.86)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    maxWidth: 320,
  },
  actions: {
    gap: 16,
    padding: 24,
    paddingBottom: 40,
  },
  guestReturn: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  guestReturnHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  guestReturnLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  guestReturnTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  guestReturnActions: {
    gap: 10,
  },
  guestReturnButton: {
    width: '100%',
  },
  loginLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 44,
  },
  loginText: {
    fontSize: 14,
  },
});
