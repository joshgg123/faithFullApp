import { StyleSheet, Text, TextProps } from "react-native";

export function AppText({ style, ...props }: TextProps) {
  return <Text style={[styles.default, style]} {...props} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Satoshi-Regular",
  },
});