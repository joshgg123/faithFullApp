import { AppText as Text } from "@/components/ui/AppText";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface RachaButtonProps {
  streakDays: number;
  onPress: () => void;
}

const NEXT_DAYS_TO_SHOW = 3;

export function RachaButton({ streakDays, onPress }: RachaButtonProps) {
  const nextDays = Array.from(
    { length: NEXT_DAYS_TO_SHOW },
    (_, i) => streakDays + i + 1
  );

  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.mainCircle}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text style={styles.streakNumber}>{streakDays}</Text>
      </View>

      <View style={styles.pill}>
        {nextDays.map((day) => (
          <View key={day} style={styles.dayCircle}>
            <Text style={styles.dayNumber}>{day}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mainCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#111",
    borderWidth: 1.5,
    borderColor: "#E8611A",
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
    color: "#FFF",
    marginTop: -2,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#111",
    borderWidth: 1.5,
    borderColor: "#E8611A55",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    paddingVertical: 10,
    paddingLeft: 28,
    paddingRight: 10,
    marginLeft: -28,
    height: 56,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumber: {
    fontSize: 10,
    fontWeight: "700",
    color: "#888",
  },
});