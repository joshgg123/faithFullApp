import { AppText as Text } from "@/components/ui/AppText";
import React from "react";
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
  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.pill}>
        <Text style={styles.label}>Logros</Text>
        <Text style={styles.count}>
          {unlockedCount}/{totalCount}
        </Text>
      </View>

      <View style={styles.mainCircle}>
        <Text style={styles.trophyEmoji}>🏆</Text>
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
  pill: {
    flex: 1,
    backgroundColor: "#111",
    borderWidth: 1.5,
    borderColor: "#F5C51855",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    paddingVertical: 10,
    paddingLeft: 16,
    paddingRight: 28,
    height: 56,
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFF",
  },
  count: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  mainCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#111",
    borderWidth: 1.5,
    borderColor: "#F5C518",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -28,
    zIndex: 2,
  },
  trophyEmoji: {
    fontSize: 26,
  },
});