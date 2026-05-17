import React from 'react';
import { ActivityIndicator, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Photo } from '../types';

type BusyAction = 'save' | 'share' | 'delete' | null;

type Props = {
  photo: Photo | null;
  visible: boolean;
  busyAction: BusyAction;
  onClose: () => void;
  onSave: (photo: Photo) => void;
  onShare: (photo: Photo) => void;
  onDelete?: (photo: Photo) => void;
};

export default function PhotoPreviewModal({
  photo,
  visible,
  busyAction,
  onClose,
  onSave,
  onShare,
  onDelete,
}: Props) {
  const { palette, typography } = useTheme();
  const disabled = Boolean(busyAction);

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <SafeAreaView style={styles.backdrop}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Vorschau schliessen"
            disabled={disabled}
            onPress={onClose}
            style={({ pressed }) => [styles.iconButton, { opacity: pressed || disabled ? 0.72 : 1 }]}
          >
            <MaterialIcons name="close" size={24} color="#FAF8F5" />
          </Pressable>
          <Text style={[styles.headerTitle, typography.label]}>Foto-Vorschau</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.imageWrap}>
          {photo ? (
            <Image resizeMode="contain" source={{ uri: photo.imageUrl }} style={styles.image} />
          ) : (
            <ActivityIndicator color={palette.accent} />
          )}
        </View>

        <View style={[styles.actionPanel, { backgroundColor: palette.surface }]}>
          <ActionButton
            icon="file-download"
            label="Speichern"
            loading={busyAction === 'save'}
            disabled={disabled || !photo}
            onPress={() => photo && onSave(photo)}
          />
          <ActionButton
            icon="share"
            label="Teilen"
            loading={busyAction === 'share'}
            disabled={disabled || !photo}
            onPress={() => photo && onShare(photo)}
          />
          {onDelete ? (
            <ActionButton
              icon="delete"
              label="Loeschen"
              loading={busyAction === 'delete'}
              disabled={disabled || !photo}
              danger
              onPress={() => photo && onDelete(photo)}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </Modal>
  );

  function ActionButton({
    icon,
    label,
    loading,
    disabled,
    danger,
    onPress,
  }: {
    icon: any;
    label: string;
    loading: boolean;
    disabled: boolean;
    danger?: boolean;
    onPress: () => void;
  }) {
    const color = danger ? palette.error : palette.primary;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [styles.actionButton, { opacity: pressed || disabled ? 0.62 : 1 }]}
      >
        {loading ? (
          <ActivityIndicator color={danger ? palette.error : palette.accent} />
        ) : (
          <MaterialIcons name={icon} size={22} color={color} />
        )}
        <Text style={[styles.actionLabel, typography.label, { color }]}>{label}</Text>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.94)',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerTitle: {
    color: '#FAF8F5',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  imageWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 12,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  actionPanel: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
    justifyContent: 'center',
    minHeight: 64,
  },
  actionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
});
