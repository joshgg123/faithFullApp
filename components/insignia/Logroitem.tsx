import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { UserLogro, LogroShape as LogroShapeType } from "@/types/insignia";

/* ==========================================
   Placeholder shape (reemplazar por Image después)
========================================== */

function LogroShape({
  shape,
  unlocked,
  size = 56,
}: {
  shape: LogroShapeType;
  unlocked: boolean;
  size?: number;
}) {
  const color = unlocked ? "#F5C518" : "#3A3A3A";
  const borderColor = unlocked ? "#F5C518" : "#555";

  if (shape === "circle") {
    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: unlocked ? color + "22" : "#2A2A2A",
            borderWidth: 2.5,
            borderColor,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <View
          style={{
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size * 0.2,
            backgroundColor: color,
            opacity: unlocked ? 1 : 0.3,
          }}
        />
      </View>
    );
  }

  if (shape === "diamond") {
    return (
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size * 0.65,
            height: size * 0.65,
            backgroundColor: unlocked ? color + "22" : "#2A2A2A",
            borderWidth: 2.5,
            borderColor,
            transform: [{ rotate: "45deg" }],
          }}
        />
      </View>
    );
  }

  // square
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        backgroundColor: unlocked ? color + "22" : "#2A2A2A",
        borderWidth: 2.5,
        borderColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: 4,
          backgroundColor: color,
          opacity: unlocked ? 1 : 0.3,
        }}
      />
    </View>
  );
}

/* ==========================================
   LogroItem
========================================== */

interface LogroItemProps {
  logro: UserLogro;
  onPress: (logro: UserLogro) => void;
  size?: number;
}

export function LogroItem({ logro, onPress, size = 56 }: LogroItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(logro)}
      activeOpacity={0.75}
      style={[styles.wrapper, { opacity: logro.unlocked ? 1 : 0.5 }]}
    >
      <LogroShape shape={logro.shape} unlocked={logro.unlocked} size={size} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
});