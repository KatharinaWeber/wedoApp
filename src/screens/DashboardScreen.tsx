import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import WeddingCard from '../components/WeddingCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { createWedding, getWeddingsByUser, Wedding } from '../services/weddingService';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeContext';

type DashboardNavigation = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const nav = useNavigation<DashboardNavigation>();
  const { palette, typography } = useTheme();

  const featured = useMemo(() => weddings[0], [weddings]);
  const seasonPhotoCount = useMemo(
    () => weddings.reduce((sum, wedding) => sum + (wedding.photoCount || 0), 0),
    [weddings],
  );

  const loadWeddings = useCallback(async () => {
    if (!user) return;
    const items = await getWeddingsByUser(user.uid);
    setWeddings(items);
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        await loadWeddings();
      } finally {
        setLoading(false);
      }
    })();
  }, [loadWeddings]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadWeddings();
    } finally {
      setRefreshing(false);
    }
  };

  const onCreate = async () => {
    if (!title.trim() || !user) return;

    setCreating(true);
    try {
      const wedding = await createWedding(title.trim(), user.uid, date.trim(), location.trim());
      setWeddings((current) => [{ ...wedding, photoCount: 0 }, ...current]);
      setTitle('');
      setDate('');
      setLocation('');
      setShowCreate(false);
    } catch (error) {
      Alert.alert('Event konnte nicht angelegt werden', 'Bitte pruefe deine Internetverbindung und versuche es erneut.');
    } finally {
      setCreating(false);
    }
  };

  const openGalleryInvites = () => {
    if (!featured) {
      Alert.alert('Kein Event vorhanden', 'Lege zuerst ein Event an, bevor du Einladungen teilst.');
      return;
    }
    nav.navigate('EventDetail', { weddingId: featured.id });
  };

  const renderWedding = ({ item }: { item: Wedding & { photoCount?: number } }) => (
    <WeddingCard
      {...item}
      photoCount={item.photoCount || 0}
      onPress={() => nav.navigate('EventDetail', { weddingId: item.id })}
    />
  );

  if (loading) {
    return <LoadingSpinner label="Events werden geladen" />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: palette.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.accent} />}
    >
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.logo, typography.heading, { color: palette.primary }]}>WedO</Text>
          <Text style={[styles.portal, typography.label, { color: palette.muted }]}>Photographer Portal</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Ausloggen" onPress={logout} style={styles.iconButton}>
          <MaterialIcons name="person" size={22} color={palette.primary} />
        </Pressable>
      </View>

      <Text style={[styles.heading, typography.display, { color: palette.primary }]}>Portfolio Overview</Text>
      <Text style={[styles.subheading, typography.body, { color: palette.muted }]}>Upcoming Celebrations</Text>

      <View style={[styles.featured, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.featuredHeader}>
          <Text style={[styles.featuredLabel, typography.label, { color: palette.accent }]}>Featured Session</Text>
          <MaterialIcons name="auto-awesome" size={20} color={palette.accent} />
        </View>
        <Text style={[styles.featuredTitle, typography.heading, { color: palette.primary }]}>
          {featured?.title || 'Maria & Tim'}
        </Text>
        <View style={styles.metaLine}>
          <MaterialIcons name="location-on" size={18} color={palette.muted} />
          <Text style={[styles.meta, typography.body, { color: palette.muted }]}>
            {featured?.location || 'The Glass House, New York'}
          </Text>
        </View>
        <View style={styles.featuredFooter}>
          <View style={[styles.dateBox, { backgroundColor: palette.surfaceSoft }]}>
            <Text style={[styles.dateText, typography.label, { color: palette.primary }]}>
              {featured?.date || 'OCT 14, 2026'}
            </Text>
          </View>
          <Button
            title="Oeffnen"
            onPress={() => featured && nav.navigate('EventDetail', { weddingId: featured.id })}
            variant="secondary"
            style={styles.openButton}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard icon="auto-awesome" label="Events this season" value={weddings.length} />
        <StatCard icon="photo-library" label="Photos gathered" value={seasonPhotoCount} />
      </View>

      <View style={styles.quickActions}>
        <Button title={showCreate ? 'Formular schliessen' : 'Neues Event'} onPress={() => setShowCreate((value) => !value)} />
        <Button title="Gallery Invites" variant="secondary" onPress={openGalleryInvites} />
        <Button title="Anleitung" variant="ghost" onPress={() => nav.navigate('Instructions')} />
      </View>

      {showCreate ? (
        <View style={[styles.createPanel, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.panelTitle, typography.subheading, { color: palette.primary }]}>Neue Hochzeit</Text>
          <TextInput
            placeholder="Elena & David"
            placeholderTextColor={palette.muted}
            value={title}
            onChangeText={setTitle}
            style={[styles.input, typography.body, { borderColor: palette.border, color: palette.primary }]}
          />
          <TextInput
            placeholder="21. Oktober 2026"
            placeholderTextColor={palette.muted}
            value={date}
            onChangeText={setDate}
            style={[styles.input, typography.body, { borderColor: palette.border, color: palette.primary }]}
          />
          <TextInput
            placeholder="Location"
            placeholderTextColor={palette.muted}
            value={location}
            onChangeText={setLocation}
            style={[styles.input, typography.body, { borderColor: palette.border, color: palette.primary }]}
          />
          <Button title="Event anlegen" onPress={onCreate} loading={creating} />
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, typography.subheading, { color: palette.primary }]}>Main Menu</Text>
        <MaterialIcons name="grid-view" size={20} color={palette.muted} />
      </View>

      <FlatList
        data={weddings}
        keyExtractor={(item) => item.id}
        renderItem={renderWedding}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <MaterialIcons name="favorite" size={26} color={palette.accent} />
            <Text style={[styles.emptyTitle, typography.subheading, { color: palette.primary }]}>Noch keine Events</Text>
            <Text style={[styles.emptyText, typography.body, { color: palette.muted }]}>
              Lege deine erste Hochzeit an und teile den QR-Code mit den Gaesten.
            </Text>
          </View>
        }
      />
    </ScrollView>
  );

  function StatCard({ icon, label, value }: { icon: any; label: string; value: number }) {
    return (
      <View style={[styles.statCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <MaterialIcons name={icon} size={22} color={palette.accent} />
        <Text style={[styles.statValue, typography.heading, { color: palette.primary }]}>{value}</Text>
        <Text style={[styles.statLabel, typography.label, { color: palette.muted }]}>{label}</Text>
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
    marginBottom: 32,
    marginTop: 32,
  },
  logo: {
    fontSize: 28,
    lineHeight: 34,
  },
  portal: {
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  heading: {
    fontSize: 38,
    lineHeight: 46,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 24,
    marginTop: 4,
  },
  featured: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
  },
  featuredHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontSize: 32,
    lineHeight: 40,
    marginTop: 16,
  },
  metaLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  meta: {
    flex: 1,
    fontSize: 14,
  },
  featuredFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  dateBox: {
    borderRadius: 12,
    flex: 1,
    padding: 14,
  },
  dateText: {
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  openButton: {
    minWidth: 112,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    padding: 16,
  },
  statValue: {
    fontSize: 28,
    lineHeight: 34,
    marginTop: 14,
  },
  statLabel: {
    fontSize: 10,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  quickActions: {
    gap: 12,
    marginTop: 20,
  },
  createPanel: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginTop: 16,
    padding: 16,
  },
  panelTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 30,
  },
  empty: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    lineHeight: 30,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
    textAlign: 'center',
  },
});
