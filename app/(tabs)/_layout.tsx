import { Tabs } from 'expo-router';

import { BottomNavigation } from '@/components/general/BottomNavigation';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavigation {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="finanzas" options={{ title: 'Finanzas' }} />
      <Tabs.Screen name="descubrir" options={{ title: 'Descubrir' }} />
      <Tabs.Screen name="agenda" options={{ title: 'Agenda' }} />
      <Tabs.Screen name="salud" options={{ title: 'Salud' }} />
    </Tabs>
  );
}
