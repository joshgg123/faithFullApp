import { AppText as Text } from '@/components/ui/AppText';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
/* ==========================================
   WHEEL (mismo patrón que DatePickerField)
========================================== */

function Wheel({
  value,
  previousValue,
  nextValue,
  onIncrement,
  onDecrement,
}: {
  value: string;
  previousValue: string;
  nextValue: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <View style={styles.wheelContainer}>
      <TouchableOpacity onPress={onDecrement} style={styles.wheelButton}>
        <Text style={styles.wheelTextSecondary}>{previousValue}</Text>
      </TouchableOpacity>
      <View style={styles.wheelCurrentBox}>
        <Text style={styles.wheelTextPrimary}>{value}</Text>
      </View>
      <TouchableOpacity onPress={onIncrement} style={styles.wheelButton}>
        <Text style={styles.wheelTextSecondary}>{nextValue}</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ==========================================
   HELPERS
========================================== */

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function parseTime(value?: string): { h: number; m: number } {
  if (!value) return { h: 9, m: 0 };
  const [rawH, rawM] = value.split(':').map(Number);
  const h = isNaN(rawH) ? 9 : Math.min(23, Math.max(0, rawH));
  // Redondear minutos a múltiplo de 5
  const rawMin = isNaN(rawM) ? 0 : rawM;
  const m = Math.round(rawMin / 5) * 5 % 60;
  return { h, m };
}

/* ==========================================
   PROPS
========================================== */

interface Props {
  value?: string; // formato HH:MM
  onChange: (time: string) => void;
  label?: string;
  placeholder?: string;
}

/* ==========================================
   COMPONENT
========================================== */

export default function TimePickerField({
  value,
  onChange,
  label,
  placeholder = 'Seleccionar hora',
}: Props) {
  const [open, setOpen] = useState(false);
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.h);
  const [minute, setMinute] = useState(parsed.m);

  React.useEffect(() => {
    const parsedValue = parseTime(value);
    setHour(parsedValue.h);
    setMinute(parsedValue.m);
  }, [value]);

  const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  function currentMinuteIndex(): number {
    const idx = MINUTES.indexOf(minute);
    return idx >= 0 ? idx : 0;
  }

  function prevMinute(): number {
    const idx = currentMinuteIndex();
    return MINUTES[idx === 0 ? MINUTES.length - 1 : idx - 1];
  }

  function nextMinute(): number {
    const idx = currentMinuteIndex();
    return MINUTES[idx === MINUTES.length - 1 ? 0 : idx + 1];
  }

  function updateTime(h: number, m: number) {
    onChange(`${pad(h)}:${pad(m)}`);
  }

  const displayValue = value || '';

  return (
    <>
      <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity
          style={styles.inputField}
          onPress={() => setOpen(true)}
        >
          <Text style={[styles.inputText, !displayValue && styles.placeholder]}>
            {displayValue || placeholder}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Seleccionar hora</Text>

            <View style={styles.wheelsRow}>
              {/* Horas */}
              <Wheel
                value={pad(hour)}
                previousValue={pad(hour === 0 ? 23 : hour - 1)}
                nextValue={pad(hour === 23 ? 0 : hour + 1)}
                onDecrement={() => {
                  const h = hour === 0 ? 23 : hour - 1;
                  setHour(h);
                  updateTime(h, minute);
                }}
                onIncrement={() => {
                  const h = hour === 23 ? 0 : hour + 1;
                  setHour(h);
                  updateTime(h, minute);
                }}
              />

              <Text style={styles.separator}>:</Text>

              {/* Minutos (saltos de 5) */}
              <Wheel
                value={pad(minute)}
                previousValue={pad(prevMinute())}
                nextValue={pad(nextMinute())}
                onDecrement={() => {
                  const m = prevMinute();
                  setMinute(m);
                  updateTime(hour, m);
                }}
                onIncrement={() => {
                  const m = nextMinute();
                  setMinute(m);
                  updateTime(hour, m);
                }}
              />
            </View>

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

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  inputContainer: { gap: 6 },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#27272a',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#ffffff',
  },
  inputText: { color: '#27272a', fontSize: 15 },
  placeholder: { color: '#a1a1aa' },

  // Modal
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  modalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#111827',
  },
  wheelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  separator: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },

  // Wheel
  wheelContainer: {
    flex: 1,
    alignItems: 'center',
    maxWidth: 120,
  },
  wheelButton: { paddingVertical: 8 },
  wheelTextSecondary: { fontSize: 20, color: '#a1a1aa' },
  wheelCurrentBox: {
    backgroundColor: '#f4f4f5',
    borderRadius: 24,
    height: 96,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  wheelTextPrimary: { fontSize: 30, fontWeight: 'bold', color: '#000000' },

  // Confirm
  confirmButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 16,
    marginTop: 40,
  },
  confirmButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});