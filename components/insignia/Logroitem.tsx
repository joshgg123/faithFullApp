import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { LogroShape as LogroShapeType, UserLogro } from "@/types/insignia";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const LOGRO_IMAGES: Record<string, any> = {
  // logro_01: require("@/assets/images/logros/logro_01.png"),
};

function ShapePlaceholder({
  shape,
  unlocked,
  size,
  theme,
}: {
  shape: LogroShapeType;
  unlocked: boolean;
  size: number;
  theme: Theme;
}) {
  const color = unlocked ? theme.achievement : theme.textSecondary;
  const borderColor = unlocked ? theme.achievement : theme.border;
  const lockedBg = theme.surfaceAlt;

  if (shape === "circle") {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: unlocked ? color + "22" : lockedBg,
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
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            width: size * 0.65,
            height: size * 0.65,
            backgroundColor: unlocked ? color + "22" : lockedBg,
            borderWidth: 2.5,
            borderColor,
            transform: [{ rotate: "45deg" }],
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        backgroundColor: unlocked ? color + "22" : lockedBg,
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

export function LogroImage({ logro, size = 56 }: { logro: UserLogro; size?: number }) {
  const { theme } = useTheme();
  const imageSource = LOGRO_IMAGES[logro.imageKey];

  if (imageSource) {
    return (
      <Image
        source={imageSource}
        style={[{ width: size, height: size }, !logro.unlocked && { opacity: 0.25 }]}
        resizeMode="contain"
      />
    );
  }

  return (
    <ShapePlaceholder shape={logro.shape} unlocked={logro.unlocked} size={size} theme={theme} />
  );
}

export function LogroItem({
  logro,
  onPress,
  size = 56,
}: {
  logro: UserLogro;
  onPress: (logro: UserLogro) => void;
  size?: number;
}) {
  return (
    <TouchableOpacity onPress={() => onPress(logro)} activeOpacity={0.75} style={styles.wrapper}>
      <LogroImage logro={logro} size={size} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", margin: 8 },
});