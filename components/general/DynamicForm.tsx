import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Switch,
  TouchableOpacity,
} from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import DatePickerField from "./DatePickerField";
import { Field } from "../../types/general/field";

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (values: Record<string, any>) => void;
}

export default function DynamicForm({
  fields,
  onSubmit,
}: DynamicFormProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  const updateValue = (name: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <View style={styles.formContainer}>
      {fields.map((field) => {
        switch (field.type) {
          case "text":
            return (
              <View key={field.name} style={styles.fieldContainer}>
                <Text style={styles.label}>{field.label}</Text>

                <TextInput
                  style={styles.textInput}
                  placeholder={field.placeholder}
                  placeholderTextColor="#a1a1aa"
                  value={values[field.name] || ""}
                  onChangeText={(text) => updateValue(field.name, text)}
                />
              </View>
            );

          case "boolean":
            return (
              <View key={field.name} style={styles.switchContainer}>
                <View style={styles.switchTextContainer}>
                  <Text style={styles.label}>{field.label}</Text>
                </View>

                <Switch
                  trackColor={{ false: "#e4e4e7", true: "#ddd6fe" }}
                  thumbColor={values[field.name] ? "#7c3aed" : "#f4f4f5"}
                  ios_backgroundColor="#e4e4e7"
                  value={values[field.name] || false}
                  onValueChange={(value) => updateValue(field.name, value)}
                />
              </View>
            );

          case "select":
            return (
              <View key={field.name} style={styles.fieldContainer}>
                <Text style={styles.label}>{field.label}</Text>

                <View style={styles.optionsWrapper}>
                  {field.options?.map(
                    (option: { label: string; value: string | number }) => {
                      const selected = values[field.name] === option.value;

                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.optionButton,
                            selected && styles.optionButtonSelected,
                          ]}
                          onPress={() => updateValue(field.name, option.value)}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              selected && styles.optionTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>
              </View>
            );

          case "date":
            return (
              <DatePickerField
                key={field.name}
                label={field.label}
                value={values[field.name]}
                onChange={(date) => updateValue(field.name, date)}
              />
            );

          default:
            return null;
        }
      })}

      {/* SUBMIT BUTTON */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => onSubmit(values)}
      >
        <Text style={styles.submitButtonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor general del formulario
  formContainer: {
    gap: 20, // Espaciado consistente entre campos
    paddingVertical: 10,
  },

  // Contenedores por campo
  fieldContainer: {
    gap: 6,
  },

  // Etiquetas unificadas con el DatePicker
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#27272a",
  },

  // Inputs de texto estilizados
  textInput: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
    fontSize: 16,
    color: "#27272a",
  },

  // Fila del Switch (Boolean)
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 16,
    padding: 16,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 8,
  },

  // Contenedor de opciones (Select)
  optionsWrapper: {
    gap: 8,
  },
  optionButton: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    backgroundColor: "#ffffff",
  },
  optionButtonSelected: {
    backgroundColor: "#f5f3ff", // Fondo sutil violeta al seleccionar
    borderColor: "#7c3aed", // Borde violeta fuerte
  },
  optionText: {
    fontSize: 15,
    color: "#27272a",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#7c3aed", // Texto violeta cuando está activo
    fontWeight: "600",
  },

  // Botón Principal de Envío
  submitButton: {
    backgroundColor: "#7c3aed", // El mismo violeta del DatePicker
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3, // Sombra suave para Android
  },
  submitButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});