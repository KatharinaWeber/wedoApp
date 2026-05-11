import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function WeddingCard({ title, date, photoCount, onPress }: any) {
  const { palette } = useTheme() as any;
  return (
    <TouchableOpacity style={[styles.card]} onPress={onPress}>
      <View>
        <Text style={{ color: palette.primary, fontSize: 16, fontWeight: '600' }}>{title}</Text>
        <Text style={{ color: '#666', marginTop: 6 }}>{date}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ color: '#666' }}>{photoCount} Fotos</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
});
