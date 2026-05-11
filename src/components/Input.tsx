import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = { placeholder?: string; value?: string; onChangeText?: (t: string) => void; secureTextEntry?: boolean; label?: string };

export default function Input({ placeholder, value, onChangeText, secureTextEntry, label }: Props) {
  const { palette } = useTheme() as any;
  return (
    <View style={{ marginVertical: 8 }}>
      {label ? <Text style={{ color: palette.primary, marginBottom: 6 }}>{label}</Text> : null}
      <TextInput placeholder={placeholder} value={value} onChangeText={onChangeText} secureTextEntry={secureTextEntry} style={[styles.input, { borderColor: '#eee' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
});
