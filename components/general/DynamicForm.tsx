import { useMemo, useState } from "react";
import {
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AppText as Text } from "@/components/ui/AppText";

import DatePickerField from "./DatePickerField";
import Dropdown from "./Dropdown";
import SegmentedControl from "./SegmentedControl";

import { Field } from "@/types/general/field";

interface Props {
  fields: Field[];
  onSubmit: (values: Record<string, any>) => void;
}

export default function DynamicForm({
  fields,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<Record<string, any>>({});

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  function updateValue(
    name: string,
    value: any
  ) {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors: Record<
      string,
      string
    > = {};

    fields.forEach((field) => {
      if (
        field.visibleWhen &&
        values[field.visibleWhen.field] !==
          field.visibleWhen.equals
      ) {
        return;
      }

      const value = values[field.name];

      if (
        field.required &&
        (!value || value === "")
      ) {
        newErrors[field.name] =
          "Este campo es obligatorio.";
      }

      if (
        field.numbersOnly &&
        value &&
        !/^\d+$/.test(value)
      ) {
        newErrors[field.name] =
          "Solo se permiten números enteros.";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function submit() {
    if (!validate()) return;

    onSubmit(values);
  }

  const visibleFields = useMemo(() => {
    return fields.filter((field) => {
      if (!field.visibleWhen) return true;

      return (
        values[field.visibleWhen.field] ===
        field.visibleWhen.equals
      );
    });
  }, [fields, values]);
    return (
    <View style={styles.formContainer}>
      {visibleFields.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <View
                key={field.name}
                style={styles.fieldContainer}
              >
                <Text style={styles.label}>
                  {field.label}
                </Text>

                <TextInput
                  style={[
                    styles.textInput,
                    errors[field.name] &&
                      styles.inputError,
                  ]}
                  placeholder={field.placeholder}
                  placeholderTextColor="#9CA3AF"
                  value={values[field.name] ?? ""}
                  keyboardType={
                    field.keyboardType ??
                    "default"
                  }
                  autoCapitalize="sentences"
                  onChangeText={(text) => {
                    let value = text;

                    if (field.numbersOnly) {
                      value = value.replace(
                        /[^0-9]/g,
                        ""
                      );
                    }

                    updateValue(
                      field.name,
                      value
                    );
                  }}
                />

                {!!errors[field.name] && (
                  <Text style={styles.error}>
                    {errors[field.name]}
                  </Text>
                )}
              </View>
            );

          case "segmented":
            return (
              <View
                key={field.name}
                style={styles.fieldContainer}
              >
                <Text style={styles.label}>
                  {field.label}
                </Text>

                <SegmentedControl
                  options={field.options ?? []}
                  value={values[field.name]}
                  onChange={(value) =>
                    updateValue(
                      field.name,
                      value
                    )
                  }
                />

                {!!errors[field.name] && (
                  <Text style={styles.error}>
                    {errors[field.name]}
                  </Text>
                )}
              </View>
            );

          case "select":
            return (
              <View
                key={field.name}
                style={styles.fieldContainer}
              >
                <Dropdown
                  label={field.label}
                  placeholder={
                    field.placeholder ??
                    "Seleccionar"
                  }
                  value={values[field.name]}
                  options={
                    field.options ?? []
                  }
                  onChange={(value) =>
                    updateValue(
                      field.name,
                      value
                    )
                  }
                />

                {!!errors[field.name] && (
                  <Text style={styles.error}>
                    {errors[field.name]}
                  </Text>
                )}
              </View>
            );

          case "boolean":
            return (
<TouchableOpacity
  key={field.name}
  activeOpacity={0.8}
  style={styles.switchContainer}
  onPress={() =>
    updateValue(
      field.name,
      !(values[field.name] ?? false)
    )
  }
>
  <View style={styles.switchTextContainer}>
    <Text style={styles.label}>
      {field.label}
    </Text>
  </View>

  <View
    style={[
      styles.circle,
      values[field.name] && styles.circleActive,
    ]}
  >
    {values[field.name] && (
      <View style={styles.innerDot} />
    )}
  </View>
</TouchableOpacity>
            );

          case "date":
            return (
              <DatePickerField
                key={field.name}
                label={field.label}
                value={values[field.name]}
                onChange={(date) =>
                  updateValue(
                    field.name,
                    date
                  )
                }
              />
            );

          default:
            return null;
        }
      })}

      <TouchableOpacity
        style={styles.submitButton}
        activeOpacity={0.9}
        onPress={submit}
      >
        <Text
          style={styles.submitButtonText}
        >
          Guardar movimiento
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  formContainer: {
    gap: 22,
    paddingVertical: 8,
  },

  fieldContainer: {
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18181B",
    marginBottom: 2,
  },
  circle: {
  width: 26,
  height: 26,
  borderRadius: 13,

  borderWidth: 2,
  borderColor: "#D4D4D8",

  alignItems: "center",
  justifyContent: "center",

  backgroundColor: "#FFFFFF",
},

circleActive: {
  borderColor: "#7C3AED",
},

innerDot: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: "#7C3AED",
},

  textInput: {
    height: 56,
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 16,

    paddingHorizontal: 16,

    fontSize: 16,
    color: "#18181B",
  },

  inputError: {
    borderColor: "#EF4444",
  },

  error: {
    marginTop: 4,
    marginLeft: 4,

    color: "#EF4444",

    fontSize: 13,

    fontWeight: "500",
  },

switchContainer: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",

  minHeight: 60,

  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 16,
  backgroundColor: "#FFFFFF",

  paddingHorizontal: 16,
},

switchTextContainer: {
  flex: 1,
  justifyContent: "center",
  marginRight: 12,
},

  submitButton: {
    marginTop: 12,

    height: 58,

    borderRadius: 18,

    backgroundColor: "#7C3AED",

    justifyContent: "center",

    alignItems: "center",

    shadowColor: "#7C3AED",

    shadowOpacity: 0.18,

    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  submitButtonText: {
    color: "#FFFFFF",

    fontWeight: "700",

    fontSize: 17,
  },
});