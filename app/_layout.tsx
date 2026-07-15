import { AppText as Text } from "@/components/ui/AppText";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { TextInput } from "react-native";

import { TreasuryProvider } from "@/contexts/TesoroContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Satoshi-Regular": require("@/assets/fonts/Satoshi-Regular.ttf"),
    "Satoshi-Medium": require("@/assets/fonts/Satoshi-Medium.ttf"),
    "Satoshi-Bold": require("@/assets/fonts/Satoshi-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <TreasuryProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </TreasuryProvider>
    </ThemeProvider>
  );
}

// Fuerza Satoshi como fuente por defecto en TODA la app
// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.style = { fontFamily: "Satoshi-Regular" };
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.style = { fontFamily: "Satoshi-Regular" };