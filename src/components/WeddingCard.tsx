import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function WeddingCard({ title, date, photoCount, onPress }: any) {
  const { palette, typography } = useTheme() as any;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title} oeffnen`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
    >
      <View style={styles.copy}>
        <Text style={[styles.title, typography.subheading, { color: palette.primary }]}>{title}</Text>
        <View style={styles.metaRow}>
          <MaterialIcons name="event" size={16} color={palette.muted} />
          <Text style={[styles.meta, typography.body, { color: palette.muted }]}>{date || 'Termin offen'}</Text>
        </View>
      </View>
      <View style={[styles.count, { backgroundColor: palette.surfaceSoft }]}>
        <Text style={[styles.countText, typography.label, { color: palette.primary }]}>{photoCount || 0}</Text>
        <Text style={[styles.countLabel, typography.label, { color: palette.muted }]}>Fotos</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    padding: 16,
  },
  copy: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  meta: {
    fontSize: 14,
  },
  count: {
    alignItems: 'center',
    borderRadius: 12,
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  countText: {
    fontSize: 18,
    fontWeight: '700',
  },
  countLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
