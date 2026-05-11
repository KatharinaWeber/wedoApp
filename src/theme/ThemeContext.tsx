import React, { createContext, ReactNode, useContext } from 'react';
import { TextStyle } from 'react-native';

const palette = {
  primary: '#1E1B16',
  accent: '#C5A059',
  background: '#FFF8F3',
  white: '#FFFFFF',
  text: '#333333',
  muted: '#7F7667',
  border: '#D1C5B4',
  surface: '#FFFFFF',
  surfaceSoft: '#F5EDE4',
  surfaceHigh: '#E9E1D8',
  success: '#2F6F4E',
  error: '#BA1A1A',
};

export const typography: {
  display: TextStyle;
  heading: TextStyle;
  subheading: TextStyle;
  body: TextStyle;
  label: TextStyle;
} = {
  display: { fontFamily: 'PlayfairDisplay_600SemiBold', letterSpacing: 0 },
  heading: { fontFamily: 'PlayfairDisplay_500Medium', letterSpacing: 0 },
  subheading: { fontFamily: 'PlayfairDisplay_500Medium', letterSpacing: 0 },
  body: { fontFamily: 'Manrope_400Regular' },
  label: { fontFamily: 'Manrope_600SemiBold', letterSpacing: 0.7 },
};

const ThemeContext = createContext({ palette, typography });

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={{ palette, typography }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
