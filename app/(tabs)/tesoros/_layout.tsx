import { Stack } from "expo-router";

import {
  TreasuryProvider,
} from "@/contexts/TesoroContext";

export default function RootLayout() {
  return (
    <TreasuryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </TreasuryProvider>
  );
}