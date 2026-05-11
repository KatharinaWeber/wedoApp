import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

export const uploadPhoto = async (weddingId: string, uri: string, uploadedBy: 'guest' | 'photographer' = 'guest') => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, `weddings/${weddingId}/images/${Date.now()}-${Math.random().toString(36).substring(2,8)}.jpg`);
  await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(storageRef);

  const docRef = await addDoc(collection(db, 'photos'), {
    weddingId,
    uploadedBy,
    imageUrl: url,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, weddingId, imageUrl: url };
};
