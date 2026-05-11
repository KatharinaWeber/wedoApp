import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { selectionHaptic } from '../utils/haptics';

type Props = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
};

export default function Button({ title, onPress, loading, variant = 'primary', style }: Props) {
  const { palette, typography } = useTheme();

  const handlePress = async () => {
    if (loading || !onPress) return;
    await selectionHaptic();
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: loading }}
      disabled={loading}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && { backgroundColor: palette.accent },
        variant === 'secondary' && {
          backgroundColor: 'transparent',
          borderColor: palette.primary,
          borderWidth: 1,
        },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        { opacity: pressed || loading ? 0.78 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : palette.accent} />
      ) : (
        <Text
          style={[
            styles.text,
            typography.label,
            { color: variant === 'primary' ? '#fff' : palette.primary },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase' },
});
