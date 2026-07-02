// components/insignia/RachaModal.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const DAYS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

/* ── Calendario semanal (Rediseñado) ── */
function WeekCalendar({ streakDays }: { streakDays: number }) {
  const today = new Date();
  const todayIndex = today.getDay();
  // Asumimos que los días de racha consecutivos son los últimos días
  const daysThisWeek = Math.min(streakDays, todayIndex + 1);

  return (
    <View style={cal.container}>
      <View style={cal.monthRow}>
        <TouchableOpacity style={cal.arrow}>
          <Text style={cal.arrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={cal.monthText}>
          {today.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
        </Text>
        <TouchableOpacity style={cal.arrow}>
          <Text style={cal.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={cal.daysRow}>
        {DAYS.map((day, index) => {
          const isCompleted =
            index <= todayIndex && index >= todayIndex - daysThisWeek + 1;
          const isToday = index === todayIndex;
          return (
            <View key={day} style={cal.dayCol}>
              <Text style={cal.dayLabel}>{day}</Text>
              <View
                style={[
                  cal.dayCircle,
                  isCompleted && cal.dayCircleCompleted,
                  isToday && cal.dayCircleToday,
                ]}
              >
                {isCompleted && <Text style={cal.checkmark}>✓</Text>}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const cal = StyleSheet.create({
  container: { width: "100%", marginTop: 24, paddingHorizontal: 4 },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
    paddingBottom: 10,
  },
  monthText: { color: "#AAA", fontSize: 13, fontWeight: "600", textTransform: "capitalize" },
  arrow: { padding: 4 },
  arrowText: { color: "#AAA", fontSize: 20, lineHeight: 22 },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayCol: { alignItems: "center", gap: 8 },
  dayLabel: { fontSize: 9, color: "#666", fontWeight: "600" },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleCompleted: { backgroundColor: "#E8611A22", borderColor: "#E8611A" },
  dayCircleToday: { borderColor: "#FFF" },
  checkmark: { color: "#E8611A", fontSize: 14, fontWeight: "800" },
});

/* ── RachaModal ── */
interface RachaModalProps {
  visible: boolean;
  streakDays: number;
  onClose: () => void;
}

export function RachaModal({ visible, streakDays, onClose }: RachaModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Racha de</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fireSection}>
            <Text style={styles.fireEmoji}>🔥</Text>
            <View style={styles.streakNumberWrapper}>
              <Text style={styles.streakNumber}>{streakDays}</Text>
            </View>
            <Text style={styles.streakLabel}>días</Text>
          </View>

          <WeekCalendar streakDays={streakDays} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, alignItems: "center", justifyContent: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.65)" },
  card: {
    width: width * 0.82,
    backgroundColor: "#111",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#FFF" },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 12, color: "#AAA", fontWeight: "600" },
  fireSection: { alignItems: "center", marginVertical: 12, gap: 4 },
  fireEmoji: { fontSize: 72 },
  streakNumberWrapper: {
    borderWidth: 1.5,
    borderColor: "#E8611A",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginVertical: 4,
  },
  streakNumber: {
    fontSize: 52,
    fontWeight: "900",
    color: "#FFF",
    lineHeight: 56,
  },
  streakLabel: { fontSize: 14, color: "#AAA", fontWeight: "600" },
});