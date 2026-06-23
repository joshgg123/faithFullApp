import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";

/*
 * Lottie solo en nativo (iOS/Android).
 * En web usamos emoji de fuego para evitar el error
 * de @lottiefiles/dotlottie-react en el bundler web.
 *
 * Cuando quieras testear en dispositivo físico o emulador,
 * Lottie va a funcionar automáticamente.
 *
 * Animación: bajala de https://lottiefiles.com/search?q=fire
 * y guardala en assets/animations/fire.json
 */
let LottieView: any = null;
if (Platform.OS !== "web") {
  LottieView = require("lottie-react-native").default;
}

const { width } = Dimensions.get("window");
const DAYS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

/* ── Calendario semanal ── */
function WeekCalendar({ streakDays }: { streakDays: number }) {
  const today = new Date();
  const todayIndex = today.getDay();
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
  container: { width: "100%", marginTop: 16, paddingHorizontal: 4 },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  monthText: { color: "#FFF", fontSize: 14, fontWeight: "600", textTransform: "capitalize" },
  arrow: { padding: 4 },
  arrowText: { color: "#AAA", fontSize: 22, lineHeight: 24 },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayCol: { alignItems: "center", gap: 6 },
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
  const isWeb = Platform.OS === "web";

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
            {/* Lottie en nativo, emoji en web */}
            {!isWeb && LottieView ? (
              <LottieView
                source={require("@/assets/animations/fire.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
            ) : (
              <Text style={styles.fireEmoji}>🔥</Text>
            )}
            <Text style={styles.streakNumber}>{streakDays}</Text>
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
    width: width * 0.85,
    backgroundColor: "#111",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#FFF" },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 12, color: "#AAA", fontWeight: "600" },
  fireSection: { alignItems: "center", marginVertical: 8 },
  lottie: { width: 120, height: 120 },
  fireEmoji: { fontSize: 72, lineHeight: 90 },
  streakNumber: {
    fontSize: 64,
    fontWeight: "900",
    color: "#FFF",
    lineHeight: 70,
    marginTop: -4,
  },
  streakLabel: { fontSize: 16, color: "#AAA", fontWeight: "600", marginTop: 2 },
});