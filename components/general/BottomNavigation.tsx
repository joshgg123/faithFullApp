import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';

type NavigationItem = {
  routeName: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const navigationItems: NavigationItem[] = [
  { routeName: 'index', label: 'Home', icon: 'home' },
  { routeName: 'finanzas', label: 'Finanzas', icon: 'wallet' },
  { routeName: 'descubrir', label: 'Descubrir', icon: 'compass' },
  { routeName: 'agenda', label: 'Agenda', icon: 'calendar' },
  { routeName: 'salud', label: 'Salud', icon: 'heart' },
];

export function BottomNavigation({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {navigationItems.map((item) => {
          const routeIndex = state.routes.findIndex((route) => route.name === item.routeName);

          if (routeIndex === -1) {
            return null;
          }

          const route = state.routes[routeIndex];
          const isFocused = state.index === routeIndex;
          const options = descriptors[route.key]?.options;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options?.tabBarAccessibilityLabel}
              onPress={onPress}
              style={[styles.item, isFocused && styles.itemActive]}>
              <Ionicons
                name={item.icon}
                size={22}
                color={isFocused ? appColors.primaryBright : appColors.textSecondary}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    paddingBottom: 18,
    paddingTop: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: appColors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: appColors.border,
    paddingHorizontal: 8,
    paddingVertical: 10,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
    elevation: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 56,
    borderRadius: 20,
    paddingVertical: 6,
  },
  itemActive: {
    backgroundColor: appColors.primarySoft,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  labelActive: {
    color: appColors.primary,
  },
});
