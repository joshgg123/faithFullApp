import React, { createContext, useContext } from "react";
import { light, Theme } from "../constants/theme/index";

interface ThemeContextValue {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: light });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value: ThemeContextValue = { theme: light };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}