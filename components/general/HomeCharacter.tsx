import React from "react";
import { Image, StyleSheet, View } from "react-native";

export function HomeCharacter() {
  return (
    <View style={styles.wrapper}>
      {/* Activar cuando haya imagen */}
      <Image
        source={require("@/assets/images/pedro.png")}
        style={styles.image}
        resizeMode="contain"
      /> 
    </View>
  );
}

// Usar este cuando haya imagen
const styles = StyleSheet.create({
  wrapper: {
    width: 200,
    height: 230,
    marginTop: 25,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "150%",
    height: "150%",
  },
}); 
/*
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
*/