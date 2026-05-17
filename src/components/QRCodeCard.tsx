import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../theme/ThemeContext';
import { selectionHaptic } from '../utils/haptics';

export default function QRCodeCard({ code, title = 'Guest Link' }: { code: string; title?: string }) {
  const { palette, typography } = useTheme();

  const copyCode = async () => {
    await selectionHaptic();
    await Clipboard.setStringAsync(code);
    Alert.alert('Link kopiert', 'Du kannst den WedO-Link jetzt im Gast-Flow einfuegen.');
  };

  return (
    <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <Text style={[styles.title, typography.label, { color: palette.muted }]}>{title}</Text>
      <QRCode value={code} size={184} color={palette.primary} backgroundColor={palette.white} />
      <Text style={[styles.code, typography.body, { color: palette.primary }]} numberOfLines={1}>
        {code}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="WedO-Link kopieren"
        onPress={copyCode}
        style={({ pressed }) => [
          styles.copyButton,
          { borderColor: palette.primary, opacity: pressed ? 0.72 : 1 },
        ]}
      >
        <MaterialIcons name="content-copy" size={18} color={palette.primary} />
        <Text style={[styles.copyText, typography.label, { color: palette.primary }]}>Link kopieren</Text>
      </Pressable>
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
  copyButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 14,
    minHeight: 44,
    paddingHorizontal: 16,
  },
  copyText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
