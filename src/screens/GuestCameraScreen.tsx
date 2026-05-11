import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { uploadPhoto } from '../services/photoService';

export default function GuestCameraScreen({ route, navigation }: any) {
  const weddingId = route?.params?.weddingId || 'guest';
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  useEffect(() => {
    (async () => {
      const cam = await Camera.requestCameraPermissionsAsync();
      const media = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(cam.status === 'granted' && media.status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    // Save locally
    try {
      await MediaLibrary.createAssetAsync(photo.uri);
    } catch (e) {}
    // Upload
    try {
      await uploadPhoto(weddingId, photo.uri, 'guest');
      // show toast
      alert('Gespeichert & Hochgeladen');
    } catch (e) {
      alert('Upload failed');
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <View><Text>No access to camera</Text></View>;

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={(r) => (cameraRef.current = r)} />
      <TouchableOpacity style={styles.shutter} onPress={takePhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  shutter: { position: 'absolute', alignSelf: 'center', bottom: 40, width: 80, height: 80, borderRadius: 40, backgroundColor: '#C5A059', borderWidth: 6, borderColor: '#fff' },
});
