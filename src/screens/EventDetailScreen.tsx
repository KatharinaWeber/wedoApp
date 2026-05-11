import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import QRCodeCard from '../components/QRCodeCard';
import PhotoGrid from '../components/PhotoGrid';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function EventDetailScreen({ route }: any) {
  const weddingId = route?.params?.weddingId;
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (!weddingId) return;
    (async () => {
      const q = query(collection(db, 'photos'), where('weddingId', '==', weddingId));
      const snap = await getDocs(q);
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    })();
  }, [weddingId]);

  const shareCode = `wedo://event/${weddingId}`;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <QRCodeCard code={shareCode} />
      <Text style={{ marginTop: 16, marginBottom: 8 }}>Uploaded Photos</Text>
      <PhotoGrid photos={photos} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#FAF8F5' } });
