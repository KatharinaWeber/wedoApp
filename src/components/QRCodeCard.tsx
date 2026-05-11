import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../theme/ThemeContext';

export default function QRCodeCard({ code }: { code: string }) {
  const { palette } = useTheme() as any;
  return (
    <View style={styles.card}>
      <QRCode value={code} size={180} color={palette.primary} backgroundColor={palette.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 12 },
});
