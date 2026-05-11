import React, { createContext, ReactNode, useContext } from 'react';
import { TextStyle } from 'react-native';

const palette = {
  primary: '#333333',
  accent: '#C5A059',
  background: '#FAF8F5',
  white: '#FFFFFF',
};

export const typography: { heading: TextStyle; body: TextStyle } = {
  heading: { fontFamily: 'serif', letterSpacing: 0.6 },
  body: { fontFamily: 'System' },
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
