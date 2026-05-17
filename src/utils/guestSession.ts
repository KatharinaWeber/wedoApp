import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_GUEST_WEDDING_ID_KEY = 'wedo:lastGuestWeddingId';

export const saveLastGuestWeddingId = async (weddingId: string) => {
  await AsyncStorage.setItem(LAST_GUEST_WEDDING_ID_KEY, weddingId);
};

export const getLastGuestWeddingId = async () => {
  return AsyncStorage.getItem(LAST_GUEST_WEDDING_ID_KEY);
};

export const clearLastGuestWeddingId = async () => {
  await AsyncStorage.removeItem(LAST_GUEST_WEDDING_ID_KEY);
};
