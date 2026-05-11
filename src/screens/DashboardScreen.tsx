import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getWeddingsByUser, createWedding } from '../services/weddingService';
import WeddingCard from '../components/WeddingCard';
import FloatingActionButton from '../components/FloatingActionButton';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const [weddings, setWeddings] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const nav = useNavigation();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const items = await getWeddingsByUser(user.uid);
      setWeddings(items);
    })();
  }, [user]);

  const onCreate = async () => {
    if (!title || !user) return;
    setCreating(true);
    const p = await createWedding(title, user.uid);
    setWeddings((s) => [p, ...s]);
    setTitle('');
    setCreating(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deine Hochzeiten</Text>
      <TextInput placeholder="Neuer Event Titel" value={title} onChangeText={setTitle} style={styles.input} />
      <FlatList data={weddings} keyExtractor={(i) => i.id} renderItem={({ item }) => <WeddingCard {...item} onPress={() => nav.navigate('EventDetail' as any, { weddingId: item.id })} />} />
      <FloatingActionButton onPress={onCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FAF8F5' },
  title: { fontSize: 20, color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12 },
});
