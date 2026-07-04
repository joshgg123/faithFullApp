import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AppText as Text } from "@/components/ui/AppText";

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  options: Option[];
  value?: string | number;
  onChange: (value: string | number) => void;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <TouchableOpacity
            key={String(option.value)}
            activeOpacity={0.85}
            style={[
              styles.segment,
              selected && styles.segmentSelected,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.text,
                selected && styles.textSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 4,
  },

  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },

  segmentSelected: {
    backgroundColor: "#7C3AED",

    shadowColor: "#7C3AED",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },

  textSelected: {
    color: "#FFFFFF",
  },
});