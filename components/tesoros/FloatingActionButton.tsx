import {
  Text,
  TouchableOpacity,
} from "react-native";

interface Props {
  onPress: () => void;
}

export default function FloatingActionButton({
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        position: "absolute",

        bottom: 110,

        right: 24,

        width: 64,

        height: 64,

        borderRadius: 32,

        backgroundColor: "#111827",

        alignItems: "center",

        justifyContent: "center",

        zIndex: 999,

        elevation: 999,

        shadowColor: "#000",

        shadowOffset: {
          width: 0,
          height: 4,
        },

        shadowOpacity: 0.25,

        shadowRadius: 8,
      }}
    >
      <Text
        style={{
          color: "#FFF",

          fontSize: 34,

          fontWeight: "300",

          marginTop: -2,
        }}
      >
        +
      </Text>
    </TouchableOpacity>
  );
}