import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
}

export default function FloatingActionButton({ onPress }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.primaryBright,
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 8,
    },
    text: {
      color: theme.textInverse,
      fontSize: 32,
      fontWeight: "300",
      marginTop: -4,
    },
  });