import { AppText as Text } from "@/components/ui/AppText";
import { TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  onPress: () => void;
}

export default function FloatingActionButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.text}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  text: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "300",
    marginTop: -4, // Centra verticalmente el símbolo "+" de manera perfecta
  },
});