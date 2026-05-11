import * as Haptics from 'expo-haptics';

export const selectionHaptic = async () => {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    // Haptics are best-effort and may be unavailable on web.
  }
};

export const impactHaptic = async (style: Haptics.ImpactFeedbackStyle) => {
  try {
    await Haptics.impactAsync(style);
  } catch (error) {
    // Haptics are best-effort and may be unavailable on web.
  }
};

export const notificationHaptic = async (type: Haptics.NotificationFeedbackType) => {
  try {
    await Haptics.notificationAsync(type);
  } catch (error) {
    // Haptics are best-effort and may be unavailable on web.
  }
};
