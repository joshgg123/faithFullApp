import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import React, { useMemo } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

let LottieView: any = null;
if (Platform.OS !== "web") {
  LottieView = require("lottie-react-native").default;
}

const { width } = Dimensions.get("window");
const DAYS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

function WeekCalendar({
  streakDays,
  theme,
}: {
  streakDays: number;
  theme: Theme;
}) {
  const cal = useMemo(() => createCalStyles(theme), [theme]);

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

const createCalStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { width: "100%", marginTop: 16, paddingHorizontal: 4 },
    monthRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    monthText: {
      color: theme.text,
      fontSize: 14,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    arrow: { padding: 4 },
    arrowText: { color: theme.textSecondary, fontSize: 22, lineHeight: 24 },
    daysRow: { flexDirection: "row", justifyContent: "space-between" },
    dayCol: { alignItems: "center", gap: 6 },
    dayLabel: { fontSize: 9, color: theme.textSecondary, fontWeight: "600" },
    dayCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: theme.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    dayCircleCompleted: {
      backgroundColor: theme.primaryBright,
    },
    dayCircleToday: { backgroundColor: theme.primary },
    checkmark: { color: theme.textInverse, fontSize: 14, fontWeight: "800" },
  });

interface RachaModalProps {
  visible: boolean;
  streakDays: number;
  onClose: () => void;
}

export function RachaModal({ visible, streakDays, onClose }: RachaModalProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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

          <WeekCalendar streakDays={streakDays} theme={theme} />
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: { flex: 1, alignItems: "center", justifyContent: "center" },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.65)",
    },
    card: {
      width: width * 0.85,
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 4,
    },
    headerTitle: { fontSize: 18, fontWeight: "800", color: theme.text, textAlign: "center", flex: 1 },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    closeText: { fontSize: 12, color: theme.textSecondary, fontWeight: "600" },
    fireSection: { alignItems: "center", marginVertical: 8 },
    lottie: { width: 120, height: 120 },
    fireEmoji: { fontSize: 72, lineHeight: 90 },
    streakNumber: {
      fontSize: 64,
      fontWeight: "900",
      color: theme.text,
      lineHeight: 70,
      marginTop: -4,
    },
    streakLabel: {
      fontSize: 16,
      color: theme.textSecondary,
      fontWeight: "600",
      marginTop: 2,
    },
  });