import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeContext';

type LoginNavigation = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const auth = useAuth();
  const nav = useNavigation<LoginNavigation>();
  const { palette, typography } = useTheme();

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        await auth.register(email.trim(), password);
      } else {
        await auth.login(email.trim(), password);
      }
      nav.navigate('Dashboard');
    } catch (e: any) {
      setError(e.message || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: palette.background }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Zurueck"
        onPress={() => nav.goBack()}
        style={styles.back}
      >
        <MaterialIcons name="arrow-back" size={22} color={palette.primary} />
      </Pressable>

      <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.kicker, typography.label, { color: palette.muted }]}>Photographer Portal</Text>
        <Text style={[styles.title, typography.display, { color: palette.primary }]}>
          {mode === 'login' ? 'Willkommen zurueck' : 'Account anlegen'}
        </Text>
        <Text style={[styles.subtitle, typography.body, { color: palette.muted }]}>
          {mode === 'login'
            ? 'Melde dich an, um Events, Galerien und Gast-Uploads zu verwalten.'
            : 'Erstelle einen Fotografen-Zugang fuer dein WedO-Portal.'}
        </Text>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: '#FFDAD6' }]}>
            <MaterialIcons name="error-outline" size={18} color={palette.error} />
            <Text style={[styles.error, { color: palette.error }]}>{error}</Text>
          </View>
        ) : null}

        <Input
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="atelier@wedo.app"
          textContentType="emailAddress"
          value={email}
        />
        <Input
          label="Passwort"
          onChangeText={setPassword}
          placeholder="Dein Passwort"
          secureTextEntry
          textContentType="password"
          value={password}
        />
        <Button
          title={mode === 'login' ? 'Einloggen' : 'Registrieren'}
          onPress={submit}
          loading={loading}
          style={styles.submit}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={mode === 'login' ? 'Zur Registrierung wechseln' : 'Zum Login wechseln'}
          onPress={() => {
            setError(null);
            setMode((current) => (current === 'login' ? 'register' : 'login'));
          }}
          style={styles.modeSwitch}
        >
          <Text style={[styles.modeSwitchText, typography.body, { color: palette.muted }]}>
            {mode === 'login' ? 'Noch kein Zugang? Account anlegen' : 'Schon registriert? Einloggen'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  back: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    left: 20,
    position: 'absolute',
    top: 56,
    width: 44,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
  },
  kicker: {
    fontSize: 12,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 38,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 20,
    marginTop: 12,
  },
  errorBox: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    padding: 12,
  },
  error: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  submit: {
    marginTop: 16,
  },
  modeSwitch: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 44,
  },
  modeSwitchText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
