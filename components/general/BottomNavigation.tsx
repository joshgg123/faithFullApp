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
  { routeName: 'index', label: 'Home', icon: 'home-outline' },
  { routeName: 'tesoros', label: 'Tesoros', icon: 'wallet-outline' },
  { routeName: 'descubrir', label: 'Descubrir', icon: 'compass-outline' },
  { routeName: 'agenda', label: 'Agenda', icon: 'calendar-outline' },
  { routeName: 'salud', label: 'Salud', icon: 'heart-outline' },
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
          const routeIndex = state.routes.findIndex(
            (route) => route.name === item.routeName
          );

          if (routeIndex === -1) return null;

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
              style={[styles.item, isFocused && styles.itemActive]}
            >
              <Ionicons
                name={isFocused ? item.icon.replace('-outline', '') as any : item.icon}
                size={isFocused ? 25 : 23}
                color={
                  isFocused
                    ? appColors.primary
                    : appColors.textSecondary
                }
              />

              <Text
                style={[
                  styles.label,
                  isFocused && styles.labelActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: appColors.background,
    borderTopWidth: 1,
    borderTopColor: appColors.border,
  },

  container: {
    flexDirection: 'row',
    height: 72,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: appColors.surface,
    paddingBottom: 8,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 3,
    borderTopWidth: 3,
    borderTopColor: 'transparent',
  },

  itemActive: {
    borderTopColor: appColors.primary,
  },

  label: {
    fontSize: 12,
    fontWeight: '500',
    color: appColors.textSecondary,
  },

  labelActive: {
    color: appColors.primary,
    fontWeight: '600',
  },
});