import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";

import { RachaModal } from "@/components/insignia/RachaModal";
import { LogrosModal } from "@/components/insignia/Logrosmodal";

import { UserLogro, UserStreak } from "@/types/insignia";
import { updateStreak, getUserLogros } from "@/services/insigniasservice";

export default function HomeScreen() {
  const [streak, setStreak] = useState<UserStreak>({ streakDays: 0, lastLoginDate: "" });
  const [logros, setLogros] = useState<UserLogro[]>([]);
  const [loading, setLoading] = useState(true);
  const [rachaVisible, setRachaVisible] = useState(false);
  const [logrosVisible, setLogrosVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [streakData, logrosData] = await Promise.all([
          updateStreak(),
          getUserLogros(),
        ]);
        setStreak(streakData);
        setLogros(logrosData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const unlockedCount = logros.filter((l) => l.unlocked).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.greeting}>HOLA, [NOMBRE]</Text>

        {loading ? (
          <ActivityIndicator color="#F5C518" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.btnRow}>
            {/* Botón Racha */}
            <TouchableOpacity
              style={styles.rachaBtn}
              onPress={() => setRachaVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.fireEmoji}>🔥</Text>
              <Text style={styles.rachaNumber}>{streak.streakDays}</Text>
              <Text style={styles.rachaLabel}>días de racha</Text>
            </TouchableOpacity>

            {/* Botón Logros */}
            <TouchableOpacity
              style={styles.logrosBtn}
              onPress={() => setLogrosVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.trophyEmoji}>🏆</Text>
              <Text style={styles.logrosNumber}>{unlockedCount}/{logros.length}</Text>
              <Text style={styles.logrosLabel}>logros</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <RachaModal
        visible={rachaVisible}
        streakDays={streak.streakDays}
        onClose={() => setRachaVisible(false)}
      />

      <LogrosModal
        visible={logrosVisible}
        logros={logros}
        onClose={() => setLogrosVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0A0A0A" },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 48,
    letterSpacing: 0.5,
  },
  btnRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  rachaBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#E8611A55",
    paddingVertical: 28,
    alignItems: "center",
    gap: 4,
  },
  fireEmoji: { fontSize: 44 },
  rachaNumber: { fontSize: 42, fontWeight: "900", color: "#FFF", lineHeight: 48 },
  rachaLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  logrosBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#F5C51855",
    paddingVertical: 28,
    alignItems: "center",
    gap: 4,
  },
  trophyEmoji: { fontSize: 44 },
  logrosNumber: { fontSize: 42, fontWeight: "900", color: "#FFF", lineHeight: 48 },
  logrosLabel: { fontSize: 12, color: "#888", marginTop: 2 },
});