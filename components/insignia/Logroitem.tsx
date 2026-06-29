import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { UserLogro, LogroShape as LogroShapeType } from "@/types/insignia";

/* ==========================================
   Mapa de imágenes
   ------------------------------------------
   Cuando tengas la imagen de un logro:
   1. Guardala en:  assets/images/logros/logro_XX.png
   2. Descomentá la línea correspondiente acá abajo.
   3. No hay que tocar nada más — el componente
      la va a mostrar automáticamente.
========================================== */
const LOGRO_IMAGES: Record<string, any> = {
  // logro_01: require("@/assets/images/logros/logro_01.png"),
  // logro_02: require("@/assets/images/logros/logro_02.png"),
  // logro_03: require("@/assets/images/logros/logro_03.png"),
  // logro_04: require("@/assets/images/logros/logro_04.png"),
  // logro_05: require("@/assets/images/logros/logro_05.png"),
  // logro_06: require("@/assets/images/logros/logro_06.png"),
  // logro_07: require("@/assets/images/logros/logro_07.png"),
  // logro_08: require("@/assets/images/logros/logro_08.png"),
  // logro_09: require("@/assets/images/logros/logro_09.png"),
  // logro_10: require("@/assets/images/logros/logro_10.png"),
  // logro_11: require("@/assets/images/logros/logro_11.png"),
  // logro_12: require("@/assets/images/logros/logro_12.png"),
};

/* ==========================================
   Placeholder de forma (mientras no hay imagen)
========================================== */
function ShapePlaceholder({ shape, unlocked, size }: {
  shape: LogroShapeType;
  unlocked: boolean;
  size: number;
}) {
  const color = unlocked ? "#F5C518" : "#3A3A3A";
  const borderColor = unlocked ? "#F5C518" : "#555";

  if (shape === "circle") {
    return (
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: unlocked ? color + "22" : "#2A2A2A",
        borderWidth: 2.5, borderColor,
        alignItems: "center", justifyContent: "center",
      }}>
        <View style={{
          width: size * 0.4, height: size * 0.4,
          borderRadius: size * 0.2,
          backgroundColor: color, opacity: unlocked ? 1 : 0.3,
        }} />
      </View>
    );
  }

  if (shape === "diamond") {
    return (
      <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
        <View style={{
          width: size * 0.65, height: size * 0.65,
          backgroundColor: unlocked ? color + "22" : "#2A2A2A",
          borderWidth: 2.5, borderColor,
          transform: [{ rotate: "45deg" }],
        }} />
      </View>
    );
  }

  return (
    <View style={{
      width: size, height: size, borderRadius: 10,
      backgroundColor: unlocked ? color + "22" : "#2A2A2A",
      borderWidth: 2.5, borderColor,
      alignItems: "center", justifyContent: "center",
    }}>
      <View style={{
        width: size * 0.4, height: size * 0.4, borderRadius: 4,
        backgroundColor: color, opacity: unlocked ? 1 : 0.3,
      }} />
    </View>
  );
}

/* ==========================================
   LogroImage — imagen real o placeholder
   Exportado para reusar en LogrosModal
========================================== */
export function LogroImage({ logro, size = 56 }: { logro: UserLogro; size?: number }) {
  const imageSource = LOGRO_IMAGES[logro.imageKey];

  if (imageSource) {
    return (
      <Image
        source={imageSource}
        style={[
          { width: size, height: size },
          !logro.unlocked && { opacity: 0.25 },
        ]}
        resizeMode="contain"
      />
    );
  }

  return <ShapePlaceholder shape={logro.shape} unlocked={logro.unlocked} size={size} />;
}

/* ==========================================
   LogroItem — tocable, para el grid
========================================== */
export function LogroItem({ logro, onPress, size = 56 }: {
  logro: UserLogro;
  onPress: (logro: UserLogro) => void;
  size?: number;
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress(logro)}
      activeOpacity={0.75}
      style={styles.wrapper}
    >
      <LogroImage logro={logro} size={size} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", margin: 8 },
});