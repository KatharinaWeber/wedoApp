import React from 'react';
import { FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const col = 3;
const size = Math.floor((width - 32) / col);

export default function PhotoGrid({ photos, onDelete }: any) {
  return (
    <FlatList
      data={photos}
      numColumns={col}
      keyExtractor={(i: any) => i.id}
      renderItem={({ item }: any) => (
        <TouchableOpacity style={{ margin: 4 }} onPress={() => {}}>
          <Image source={{ uri: item.imageUrl }} style={{ width: size, height: size, borderRadius: 8 }} />
        </TouchableOpacity>
      )}
    />
  );
}
