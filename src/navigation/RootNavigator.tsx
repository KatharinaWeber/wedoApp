import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import GuestCameraScreen from '../screens/GuestCameraScreen';
import GuestGalleryScreen from '../screens/GuestGalleryScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import InstructionsScreen from '../screens/InstructionsScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Dashboard: undefined;
  EventDetail: { weddingId: string };
  GuestCamera: { weddingId: string };
  GuestGallery: { weddingId: string };
  QRScanner: undefined;
  Instructions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="GuestCamera" component={GuestCameraScreen} />
      <Stack.Screen name="GuestGallery" component={GuestGalleryScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Instructions" component={InstructionsScreen} />
    </Stack.Navigator>
  );
}
