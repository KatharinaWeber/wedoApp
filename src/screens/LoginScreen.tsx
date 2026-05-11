import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const nav = useNavigation();

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await auth.login(email, password);
      nav.navigate('Dashboard' as any);
    } catch (e: any) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fotograf Login</Text>
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Input label="Email" value={email} onChangeText={setEmail} />
      <Input label="Passwort" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Einloggen" onPress={submit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAF8F5' },
  title: { fontSize: 22, color: '#333', marginBottom: 16 },
});
