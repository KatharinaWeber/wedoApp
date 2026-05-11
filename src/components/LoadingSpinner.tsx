import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function LoadingSpinner({ label = 'Lade WedO' }: { label?: string }) {
  const { palette, typography } = useTheme() as any;
  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <View style={[styles.card, { borderColor: palette.border, backgroundColor: palette.surface }]}>
        <ActivityIndicator size="large" color={palette.accent} />
        <Text style={[styles.label, typography.label, { color: palette.muted }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
    padding: 24,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
  },
});
