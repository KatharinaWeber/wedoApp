import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type Props = TextInputProps & { label?: string; error?: string | null };

export default function Input({ label, error, style, ...inputProps }: Props) {
  const { palette, typography } = useTheme() as any;
  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, typography.label, { color: palette.muted }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={palette.muted}
        {...inputProps}
        style={[
          styles.input,
          typography.body,
          {
            backgroundColor: palette.surface,
            borderColor: error ? palette.error : palette.border,
            color: palette.primary,
          },
          style,
        ]}
      />
      {error ? <Text style={[styles.error, { color: palette.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
  },
});
