import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export type Wedding = {
  id: string;
  title: string;
  createdBy: string;
  shareCode: string;
  createdAt: any;
};

export const createWedding = async (title: string, createdBy: string) => {
  const shareCode = (Math.random() + 1).toString(36).substring(2, 8).toUpperCase();
  const docRef = await addDoc(collection(db, 'weddings'), {
    title,
    createdBy,
    shareCode,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, title, createdBy, shareCode } as Wedding;
};

export const getWeddingsByUser = async (uid: string) => {
  const q = query(collection(db, 'weddings'), where('createdBy', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
};
