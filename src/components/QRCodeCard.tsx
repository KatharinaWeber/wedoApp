import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../theme/ThemeContext';

export default function QRCodeCard({ code, title = 'Guest Link' }: { code: string; title?: string }) {
  const { palette, typography } = useTheme() as any;
  return (
    <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <Text style={[styles.title, typography.label, { color: palette.muted }]}>{title}</Text>
      <QRCode value={code} size={184} color={palette.primary} backgroundColor={palette.white} />
      <Text style={[styles.code, typography.body, { color: palette.primary }]} numberOfLines={1}>
        {code}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
  },
  title: {
    fontSize: 12,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  code: {
    fontSize: 13,
    marginTop: 16,
    maxWidth: '100%',
  },
});
