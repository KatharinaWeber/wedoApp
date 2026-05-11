import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  style?: any;
};

export default function Button({ title, onPress, loading, style }: Props) {
  const { palette } = useTheme() as any;
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: palette.accent }, style]} onPress={onPress} activeOpacity={0.8}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: '#fff', fontWeight: '600' },
});
