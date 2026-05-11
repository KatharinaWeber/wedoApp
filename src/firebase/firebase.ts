import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FirebaseAuth from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBBMPWqWc8lme4iTY1RSTxFcQUxIZ3Qztk',
  authDomain: 'wedoapp-d11d0.firebaseapp.com',
  projectId: 'wedoapp-d11d0',
  storageBucket: 'wedoapp-d11d0.firebasestorage.app',
  messagingSenderId: '182565192719',
  appId: '1:182565192719:web:ffe9dbbe29c64be63acf7a',
};

const app = initializeApp(firebaseConfig as any);

export const auth = (() => {
  const getReactNativePersistence = (FirebaseAuth as any).getReactNativePersistence;

  try {
    return FirebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence ? getReactNativePersistence(AsyncStorage) : undefined,
    });
  } catch (error) {
    return FirebaseAuth.getAuth(app);
  }
})();
export const db = getFirestore(app);
export const storage = getStorage(app);
