import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function Header({ title }: { title: string }) {
  const { palette, typography } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[{ color: palette.primary }, typography.heading, styles.title]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20 },
});
