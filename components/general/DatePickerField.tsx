import { useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
}

const months = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

function Wheel({
  value,
  previousValue,
  nextValue,
  onIncrement,
  onDecrement,
}: {
  value: string | number;
  previousValue: string | number;
  nextValue: string | number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <View style={styles.wheelContainer}>
      {/* PREVIOUS */}
      <TouchableOpacity onPress={onDecrement} style={styles.wheelButton}>
        <Text style={styles.wheelTextSecondary}>{previousValue}</Text>
      </TouchableOpacity>

      {/* CURRENT */}
      <View style={styles.wheelCurrentBox}>
        <Text style={styles.wheelTextPrimary}>{value}</Text>
      </View>

      {/* NEXT */}
      <TouchableOpacity onPress={onIncrement} style={styles.wheelButton}>
        <Text style={styles.wheelTextSecondary}>{nextValue}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function DatePickerField({
  value,
  onChange,
  label,
  placeholder = "Seleccionar fecha",
}: Props) {
  const today = useMemo(() => value || new Date(), [value]);

  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const maxDays = new Date(year, month + 1, 0).getDate();

  const formattedDate = value
    ? `${String(value.getDate()).padStart(2, "0")}/${String(
        value.getMonth() + 1
      ).padStart(2, "0")}/${value.getFullYear()}`
    : "";

  const updateDate = (newDay: number, newMonth: number, newYear: number) => {
    const safeDay = Math.min(
      newDay,
      new Date(newYear, newMonth + 1, 0).getDate()
    );

    const date = new Date(newYear, newMonth, safeDay);
    onChange(date);
  };

  return (
    <>
      {/* INPUT */}
      <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TouchableOpacity
          style={styles.inputField}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.inputText}>{formattedDate || placeholder}</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* HEADER */}
            <Text style={styles.modalHeader}>Seleccionar fecha</Text>

            {/* WHEELS */}
            <View style={styles.wheelsRow}>
              {/* DAY */}
              <Wheel
                value={String(day).padStart(2, "0")}
                previousValue={String(day <= 1 ? maxDays : day - 1).padStart(
                  2,
                  "0"
                )}
                nextValue={String(day >= maxDays ? 1 : day + 1).padStart(
                  2,
                  "0"
                )}
                onIncrement={() => {
                  const next = day >= maxDays ? 1 : day + 1;
                  setDay(next);
                  updateDate(next, month, year);
                }}
                onDecrement={() => {
                  const prev = day <= 1 ? maxDays : day - 1;
                  setDay(prev);
                  updateDate(prev, month, year);
                }}
              />

              {/* MONTH */}
              <Wheel
                value={months[month]}
                previousValue={months[month <= 0 ? 11 : month - 1]}
                nextValue={months[month >= 11 ? 0 : month + 1]}
                onIncrement={() => {
                  const next = month >= 11 ? 0 : month + 1;
                  setMonth(next);
                  updateDate(day, next, year);
                }}
                onDecrement={() => {
                  const prev = month <= 0 ? 11 : month - 1;
                  setMonth(prev);
                  updateDate(day, prev, year);
                }}
              />

              {/* YEAR */}
              <Wheel
                value={year}
                previousValue={year - 1}
                nextValue={year + 1}
                onIncrement={() => {
                  const next = year + 1;
                  setYear(next);
                  updateDate(day, month, next);
                }}
                onDecrement={() => {
                  const prev = year - 1;
                  setYear(prev);
                  updateDate(day, month, prev);
                }}
              />
            </View>

            {/* BUTTON */}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Estilos del Input Principal
  inputContainer: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  inputText: {
    color: "#27272a",
  },

  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo translúcido corregido
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 384,
  },
  modalHeader: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 32,
  },
  wheelsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Estilos de las Ruedas (Wheel)
  wheelContainer: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  wheelButton: {
    paddingVertical: 8,
  },
  wheelTextSecondary: {
    fontSize: 20,
    color: "#a1a1aa",
  },
  wheelCurrentBox: {
    backgroundColor: "#f4f4f5",
    borderRadius: 24,
    height: 96,
    width: "100%", // Ocupa todo el ancho de su flex-1 de manera fluida
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  wheelTextPrimary: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  },

  // Botón Confirmar
  confirmButton: {
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    padding: 16,
    marginTop: 40,
  },
  confirmButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});