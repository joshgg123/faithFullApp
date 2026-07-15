import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface LogrosButtonProps {
  unlockedCount: number;
  totalCount: number;
  onPress: () => void;
}

export function LogrosButton({
  unlockedCount,
  totalCount,
  onPress,
}: LogrosButtonProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.pillWrapper}>
        <View style={styles.pillShadow} />
        <View style={styles.pill}>
          <Text style={styles.label}>Logros</Text>
          <Text style={styles.count}>
            {unlockedCount}/{totalCount}
          </Text>
        </View>
      </View>

      <View style={styles.circleWrapper}>
        <View style={styles.circleShadow} />
        <View style={styles.mainCircle}>
          <Text style={styles.trophyEmoji}>🏆</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    pillWrapper: {
      flex: 1,
      position: "relative",
      height: 56,
      justifyContent: "center",
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
      backgroundColor: theme.primaryBright,
      borderTopLeftRadius: 24,
      borderBottomLeftRadius: 24,
      paddingVertical: 10,
      paddingLeft: 16,
      paddingRight: 28,
      height: 56,
      justifyContent: "center",
    },
    label: {
      fontSize: 20,
      fontWeight: "800",
      textAlign: "center",
      color: theme.textSecondary,
      marginTop: 5,
    },
    count: {
      fontSize: 15,
      textAlign: "center",
      color: theme.textSecondary,
      marginTop: -1,
      marginBottom: 5,
    },
    circleWrapper: {
      width: 72,
      height: 72,
      position: "relative",
      marginLeft: -28,
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
    trophyEmoji: {
      fontSize: 26,
    },
  });