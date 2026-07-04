import { AppText as Text } from "@/components/ui/AppText";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

interface Props {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
}

const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
const ITEM_HEIGHT = 44;

// 1. LISTA DE AÑOS FIJA: Evita que el array mute dinámicamente rompiendo el scroll
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 41 }, (_, i) => CURRENT_YEAR - 20 + i); // 20 años atrás y 20 adelante

function Wheel({
  data,
  value,
  onChange,
}: {
  data: (string | number)[];
  value: string | number;
  onChange: (val: any) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const isInitialRender = useRef(true);

  // Encontrar el índice del valor seleccionado actual
  const selectedIndex = useMemo(() => {
    const idx = data.indexOf(value);
    return idx !== -1 ? idx : 0;
  }, [data, value]);

  // Sincronizar la posición del scroll visual cuando cambia el valor externamente o se abre
  useEffect(() => {
    const scrollToTarget = () => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: !isInitialRender.current,
      });
      isInitialRender.current = false;
    };

    // Un pequeño delay asegura que el ScrollView esté montado y listo en el layout
    const timer = setTimeout(scrollToTarget, 60);
    return () => clearTimeout(timer);
  }, [selectedIndex]);

  // Manejar el final del scroll de forma precisa
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const safeIndex = Math.max(0, Math.min(index, data.length - 1));
    const selected = data[safeIndex];

    if (selected !== value) {
      onChange(selected);
    }
  };

  return (
    <View style={styles.wheelContainer}>
      {/* Contenedores fantasmas superiores e inferiores para dar un espaciado perfecto */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd} // Detecta de forma óptima el freno del scroll
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2, // Espacio para que el primer y último item queden centrados
        }}
      >
        {data.map((item) => {
          const selected = item === value;
          return (
            <View
              key={String(item)}
              style={[styles.wheelItem, selected && styles.wheelItemActive]}
            >
              <Text style={[styles.wheelText, selected && styles.wheelTextActive]}>
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.centerOverlayPointer} pointerEvents="none" />
    </View>
  );
}

export default function DatePickerField({
  value,
  onChange,
  label,
  placeholder = "Seleccionar fecha",
}: Props) {
  const [open, setOpen] = useState(false);

  // Estados locales intermedios para el modal (así no mutamos el valor real hasta dar 'Confirmar')
  const [tempDay, setTempDay] = useState(1);
  const [tempMonth, setTempMonth] = useState(0);
  const [tempYear, setTempYear] = useState(CURRENT_YEAR);

  // Sincronizar estados locales cuando el modal se abre
  useEffect(() => {
    if (open) {
      const activeDate = value || new Date();
      setTempDay(activeDate.getDate());
      setTempMonth(activeDate.getMonth());
      setTempYear(activeDate.getFullYear());
    }
  }, [open, value]);

  // Calcular dinámicamente los días del mes intermedio seleccionado
  const maxDays = useMemo(() => {
    return new Date(tempYear, tempMonth + 1, 0).getDate();
  }, [tempMonth, tempYear]);

  // Si cambiamos de mes y el día guardado supera al día máximo, ajustamos automáticamente
  useEffect(() => {
    if (tempDay > maxDays) {
      setTempDay(maxDays);
    }
  }, [maxDays, tempDay]);

  const daysArray = useMemo(() => {
    return Array.from({ length: maxDays }, (_, i) => String(i + 1).padStart(2, "0"));
  }, [maxDays]);

  const formattedDate = value
    ? `${String(value.getDate()).padStart(2, "0")}/${String(value.getMonth() + 1).padStart(2, "0")}/${value.getFullYear()}`
    : "";

  const handleConfirm = () => {
    // Asegurar que el día sea válido antes de enviar al onChange principal
    const safeDay = Math.min(tempDay, maxDays);
    onChange(new Date(tempYear, tempMonth, safeDay));
    setOpen(false);
  };

  return (
    <>
      {/* INPUT */}
      <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TouchableOpacity style={styles.inputField} onPress={() => setOpen(true)}>
          <Text style={styles.inputText}>{formattedDate || placeholder}</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Seleccionar fecha</Text>

            <View style={styles.wheelsRow}>
              {/* DÍAS */}
              <Wheel
                data={daysArray}
                value={String(tempDay).padStart(2, "0")}
                onChange={(val) => setTempDay(Number(val))}
              />

              {/* MESES */}
              <Wheel
                data={months}
                value={months[tempMonth]}
                onChange={(val) => setTempMonth(months.indexOf(val))}
              />

              {/* AÑOS */}
              <Wheel
                data={YEARS}
                value={tempYear}
                onChange={(val) => setTempYear(Number(val))}
              />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#27272A",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#D4D4D8",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFF",
  },
  inputText: {
    color: "#27272A",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 24,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#18181B",
  },
  wheelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: ITEM_HEIGHT * 5, // Altura exacta para mostrar 5 filas (2 arriba, 1 activa, 2 abajo)
    overflow: "hidden",
  },
  wheelContainer: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelItemActive: {
    // Mantén limpio el fondo de los ítems para no solaparse con el pointer central
  },
  wheelText: {
    fontSize: 16,
    color: "#A1A1AA",
  },
  wheelTextActive: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7C3AED",
  },
  centerOverlayPointer: {
    position: "absolute",
    top: "50%",
    marginTop: -ITEM_HEIGHT / 2,
    height: ITEM_HEIGHT,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "rgba(124,58,237,0.04)",
    borderRadius: 8,
  },
  confirmButton: {
    marginTop: 24,
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 16,
  },
  confirmButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
});