import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc, getCountFromServer, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export type Wedding = {
  id: string;
  title: string;
  createdBy: string;
  shareCode: string;
  date?: string;
  location?: string;
  createdAt: any;
};

export const createWedding = async (title: string, createdBy: string, date = '', location = '') => {
  const shareCode = (Math.random() + 1).toString(36).substring(2, 8).toUpperCase();
  const docRef = await addDoc(collection(db, 'weddings'), {
    title,
    createdBy,
    shareCode,
    date,
    location,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, title, createdBy, shareCode, date, location } as Wedding;
};

export const getWeddingsByUser = async (uid: string) => {
  const q = query(collection(db, 'weddings'), where('createdBy', '==', uid));
  const snap = await getDocs(q);
  const weddings = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const counts = await Promise.all(
    weddings.map(async (wedding) => {
      const photosQuery = query(collection(db, 'photos'), where('weddingId', '==', wedding.id));
      const countSnap = await getCountFromServer(photosQuery);
      return { id: wedding.id, photoCount: countSnap.data().count };
    }),
  );

  return weddings.map((wedding) => ({
    ...wedding,
    photoCount: counts.find((count) => count.id === wedding.id)?.photoCount ?? 0,
  }));
};

export const getWeddingById = async (weddingId: string) => {
  const weddingRef = doc(db, 'weddings', weddingId);
  const snap = await getDoc(weddingRef);

  if (!snap.exists()) {
    return null;
  }

  return { id: snap.id, ...snap.data() } as Wedding;
};

export const updateWedding = async (weddingId: string, updates: Partial<Wedding>) => {
  if (!weddingId) {
    throw new Error('Missing wedding id.');
  }

  const sanitizedUpdates: Partial<Wedding> = {};
  if (updates.title !== undefined) sanitizedUpdates.title = updates.title;
  if (updates.date !== undefined) sanitizedUpdates.date = updates.date;
  if (updates.location !== undefined) sanitizedUpdates.location = updates.location;

  if (!Object.keys(sanitizedUpdates).length) {
    throw new Error('No wedding updates provided.');
  }

  try {
    await updateDoc(doc(db, 'weddings', weddingId), sanitizedUpdates);
  } catch (error: any) {
    throw new Error(error?.message || 'Wedding could not be updated.');
  }
};
