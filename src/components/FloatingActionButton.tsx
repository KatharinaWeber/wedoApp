import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function FloatingActionButton({ onPress }: { onPress?: () => void }) {
  const { palette } = useTheme() as any;
  return (
    <TouchableOpacity style={[styles.fab, { backgroundColor: palette.accent }]} onPress={onPress}>
      <Text style={{ color: '#fff', fontSize: 28 }}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
