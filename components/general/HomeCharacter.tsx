import React from "react";
import { StyleSheet, View } from "react-native";

export function HomeCharacter() {
  return (
    <View style={styles.wrapper}>
      {/* Activar cuando haya imagen */}
      {/* <Image
        source={require("@/assets/images/home-placeholder.png")}
        style={styles.image}
        resizeMode="contain"
      /> */}
    </View>
  );
}

// Usar este cuando haya imagen
/* const styles = StyleSheet.create({
  wrapper: {
    width: 110,
    marginTop: 20,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 160,
  },
}); */

const styles = StyleSheet.create({
  wrapper: {
    width: 110,
    height: 160,
    marginTop: 20,
    marginRight: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#333",
  },
});