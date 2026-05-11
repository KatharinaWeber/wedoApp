import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const col = 3;

export default function PhotoGrid({ photos, onDelete }: any) {
  const { width } = useWindowDimensions();
  const { palette, typography } = useTheme() as any;
  const size = Math.floor((width - 56) / col);

  if (!photos?.length) {
    return (
      <View style={[styles.empty, { borderColor: palette.border, backgroundColor: palette.surface }]}>
        <MaterialIcons name="photo-library" size={28} color={palette.accent} />
        <Text style={[styles.emptyTitle, typography.subheading, { color: palette.primary }]}>
          Noch keine Fotos
        </Text>
        <Text style={[styles.emptyText, typography.body, { color: palette.muted }]}>
          Sobald Gaeste oder Fotografen Bilder hochladen, erscheint hier die Galerie.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      numColumns={col}
      scrollEnabled={false}
      keyExtractor={(i: any) => i.id}
      renderItem={({ item }: any) => (
        <Pressable style={styles.tile} onPress={() => {}}>
          <Image source={{ uri: item.imageUrl }} style={[styles.image, { width: size, height: size }]} />
          {onDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Foto loeschen"
              onPress={() => onDelete(item)}
              style={[styles.deleteButton, { backgroundColor: 'rgba(30, 27, 22, 0.74)' }]}
            >
              <MaterialIcons name="delete" size={16} color="#fff" />
            </Pressable>
          ) : null}
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  tile: {
    margin: 4,
  },
  image: {
    borderRadius: 12,
    backgroundColor: '#E9E1D8',
  },
  deleteButton: {
    alignItems: 'center',
    borderRadius: 18,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 6,
    top: 6,
    width: 32,
  },
  empty: {
    alignItems: 'center',
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 28,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
    textAlign: 'center',
  },
});
