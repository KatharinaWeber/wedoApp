import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

export default function WelcomeScreen() {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.logo}>WedO</Text>
      </View>

      <View style={{ paddingHorizontal: 24, width: '100%' }}>
        <Button title="QR-Code scannen" onPress={() => nav.navigate('GuestCamera' as any)} />
      </View>

      <TouchableOpacity style={{ position: 'absolute', bottom: 36 }} onPress={() => nav.navigate('Login' as any)}>
        <Text style={{ color: '#666' }}>Du bist der Fotograf? Hier einloggen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5', alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 44, fontWeight: '700', color: '#333333', marginBottom: 40 },
});
