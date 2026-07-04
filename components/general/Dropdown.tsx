import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText as Text } from "@/components/ui/AppText";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  label?: string;
  placeholder?: string;
  value?: string | number;
  options: Option[];
  onChange: (value: string | number) => void;
}

export default function Dropdown({
  label,
  placeholder = "Seleccionar",
  value,
  options,
  onChange,
}: Props) {
  const [visible, setVisible] = useState(false);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [value, options]
  );

  return (
    <>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.input}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            styles.value,
            !selected && styles.placeholder,
          ]}
        >
          {selected?.label ?? placeholder}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <Pressable style={styles.sheet}>
            <Text style={styles.title}>
              Seleccionar
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => {
                const active =
                  option.value === value;

                return (
                  <TouchableOpacity
                    key={String(option.value)}
                    style={[
                      styles.option,
                      active && styles.optionActive,
                    ]}
                    onPress={() => {
                      onChange(option.value);
                      setVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        active &&
                          styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>

                    {active && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
                        color="#7C3AED"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#27272A",
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 16,
    backgroundColor: "#FFF",

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  value: {
    fontSize: 16,
    color: "#18181B",
  },

  placeholder: {
    color: "#9CA3AF",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.35)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  sheet: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },

  option: {
    height: 54,

    borderRadius: 14,

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionActive: {
    backgroundColor: "#F5F3FF",
  },

  optionText: {
    fontSize: 16,
    color: "#18181B",
  },

  optionTextActive: {
    color: "#7C3AED",
    fontWeight: "700",
  },
});