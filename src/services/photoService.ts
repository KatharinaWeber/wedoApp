import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { db, storage } from '../firebase/firebase';
import { Photo } from '../types';

type UploadedBy = 'guest' | 'photographer';

type UploadPhotoOptions = {
  localAssetId?: string;
};

export const uploadPhoto = async (
  weddingId: string,
  uri: string,
  uploadedBy: UploadedBy = 'guest',
  options: UploadPhotoOptions = {},
) => {
  if (!weddingId) {
    throw new Error('Missing wedding id for photo upload.');
  }

  console.log('[photoService] reading local image', { weddingId, uri });
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error('Could not read the captured image.');
  }

  const blob = await response.blob();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;
  const storagePath = `weddings/${weddingId}/images/${fileName}`;
  const storageRef = ref(storage, storagePath);

  console.log('[photoService] uploading storage object', { storagePath, size: blob.size });
  await uploadBytes(storageRef, blob, {
    contentType: 'image/jpeg',
    customMetadata: {
      weddingId,
      uploadedBy,
      ...(options.localAssetId ? { localAssetId: options.localAssetId } : {}),
    },
  });

  const url = await getDownloadURL(storageRef);
  console.log('[photoService] storage upload complete', { storagePath, url });

  const docRef = await addDoc(collection(db, 'photos'), {
    weddingId,
    uploadedBy,
    imageUrl: url,
    storagePath,
    localAssetId: options.localAssetId || null,
    createdAt: serverTimestamp(),
  });
  console.log('[photoService] firestore photo document created', { id: docRef.id, weddingId });

  return { id: docRef.id, weddingId, imageUrl: url, storagePath };
};

export const getPhotosByWedding = async (weddingId: string) => {
  const q = query(collection(db, 'photos'), where('weddingId', '==', weddingId));
  const snap = await getDocs(q);
  return snap.docs
    .map((document) => ({ id: document.id, ...document.data() } as Photo))
    .sort((a, b) => {
      const left = a.createdAt?.toMillis?.() || 0;
      const right = b.createdAt?.toMillis?.() || 0;
      return right - left;
    });
};

export const deletePhoto = async (photo: { id: string; storagePath?: string }) => {
  if (!photo.id) {
    throw new Error('Missing photo id.');
  }

  if (photo.storagePath) {
    try {
      await deleteObject(ref(storage, photo.storagePath));
    } catch (error) {
      console.warn('[photoService] storage delete failed, deleting firestore document anyway', error);
    }
  }

  await deleteDoc(doc(db, 'photos', photo.id));
};

export const savePhotoToLibrary = async (photo: Pick<Photo, 'id' | 'imageUrl'>) => {
  if (!photo.imageUrl) {
    throw new Error('Missing photo URL.');
  }

  const permission = await MediaLibrary.requestPermissionsAsync();

  if (permission.status !== 'granted') {
    throw new Error('WedO braucht Zugriff auf deine Galerie, um das Foto zu speichern.');
  }

  const targetFile = new File(Paths.cache, `wedo-${photo.id}-${Date.now()}.jpg`);
  const downloadedFile = await File.downloadFileAsync(photo.imageUrl, targetFile, {
    idempotent: true,
  });

  return MediaLibrary.createAssetAsync(downloadedFile.uri);
};
