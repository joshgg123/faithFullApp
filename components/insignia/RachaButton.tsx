import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface RachaButtonProps {
  streakDays: number;
  onPress: () => void;
}

const NEXT_DAYS_TO_SHOW = 3;

export function RachaButton({ streakDays, onPress }: RachaButtonProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const nextDays = Array.from(
    { length: NEXT_DAYS_TO_SHOW },
    (_, i) => streakDays + i + 1
  );

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.circleWrapper}>
        <View style={styles.circleShadow} />
        <View style={styles.mainCircle}>
          <Text style={styles.fireEmoji}>🔥</Text>
          <Text style={styles.streakNumber}>{streakDays}</Text>
        </View>
      </View>

      <View style={styles.pillWrapper}>
        <View style={styles.pillShadow} />
        <View style={styles.pill}>
          {nextDays.map((day) => (
            <View key={day} style={styles.dayCircle}>
              <Text style={styles.dayNumber}>{day}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      position: "relative",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    circleWrapper: {
      width: 72,
      height: 72,
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
    },
    circleShadow: {
      position: "absolute",
      top: 6,
      left: 6,
      right: -6,
      bottom: -6,
      backgroundColor: theme.surfaceShadow,
      borderRadius: 36,
    },
    mainCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.primaryBright,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    },
    fireEmoji: {
      fontSize: 20,
      lineHeight: 22,
    },
    streakNumber: {
      fontSize: 16,
      fontWeight: "900",
      color: theme.textSecondary,
      marginTop: -2,
    },
    pillWrapper: {
      flex: 1,
      position: "relative",
      height: 56,
      justifyContent: "center",
      marginLeft: -28,
    },
    pillShadow: {
      position: "absolute",
      top: 6,
      left: 6,
      right: -6,
      bottom: -6,
      backgroundColor: theme.surfaceShadow,
      borderRadius: 24,
    },
    pill: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      backgroundColor: theme.primaryBright,
      borderTopRightRadius: 24,
      borderBottomRightRadius: 24,
      paddingVertical: 10,
      paddingLeft: 28,
      paddingRight: 10,
      height: 56,
    },
    dayCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    dayNumber: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.textSecondary,
    },
  });