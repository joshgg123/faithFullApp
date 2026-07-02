// index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";


const pedroImg = require("@/assets/animations/Pedro.png");
import { RachaModal } from "@/components/insignia/RachaModal";
import { LogrosModal } from "@/components/insignia/Logrosmodal";
import { TodayTasksCard } from "@/components/general/TodayTaskCard";
import { FinanceSummaryCard } from "@/components/general/FinanceSummaryCard";
import { UserLogro, UserStreak } from "@/types/insignia";
import { getUserName } from "@/services/userServices";
import { LatestArticles } from "@/components/general/LatestArticles";

import {
  updateStreak,
  getUserLogros,
} from "@/services/insigniasservice";

export default function HomeScreen() {
  const [userName, setUserName] = useState("");
  const [streak, setStreak] = useState<UserStreak>({ streakDays: 0, lastLoginDate: "" });
  const [logros, setLogros] = useState<UserLogro[]>([]);
  const [loading, setLoading] = useState(true);

  const [rachaVisible, setRachaVisible] = useState(false);
  const [logrosVisible, setLogrosVisible] = useState(false);

  useEffect(() => {
    async function fetchUserName() {
      const name = await getUserName();
      setUserName(name);
    }
    fetchUserName();
    loadData();
  }, []);

  async function loadData() {
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
  }

  const unlockedCount = logros.filter((l) => l.unlocked).length;
  const daysToShow = [35, 36, 37, 38, 39]; // Días siguientes de la racha

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          
          {/* 1. SALUDO (Centrado arriba de todo) */}
          <Text style={styles.mainGreeting}>
            HOLA, {userName.toUpperCase()}!
          </Text>

          {loading ? (
            <ActivityIndicator color="#F5C518" style={{ marginVertical: 40 }} />
          ) : (
            <>
              {/* 2. FILA DE WIDGETS (Racha y Logros) */}
              <View style={styles.widgetsRow}>
                {/* Racha Compacta */}
                <View style={styles.rachaCompact}>
                  <View style={styles.rachaCircleContainer}>
                    <Text style={styles.fireEmoji}>🔥</Text>
                    <Text style={styles.rachaCompactNumber}>{streak.streakDays}</Text>
                  </View>
                  <View style={styles.rachaCompactSequence}>
                    {daysToShow.map((day) => (
                      <View key={day} style={styles.rachaNextCircle}>
                        <Text style={styles.rachaNextText}>{day}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.rachaButtonPop} onPress={() => setRachaVisible(true)}>
                    <Text style={styles.rachaButtonPopText}>→</Text>
                  </TouchableOpacity>
                </View>

                {/* Logros Compacto */}
                <TouchableOpacity 
                  style={styles.logrosBtnCompact} 
                  activeOpacity={0.8} 
                  onPress={() => setLogrosVisible(true)}
                >
                  <Text style={styles.logrosLabelCompact}>Logros</Text>
                  <Text style={styles.trophyEmojiCompact}>🏆</Text>
                </TouchableOpacity>
              </View>

              {/* 3. SECCIÓN DEL MEDIO (Pedro a la izquierda, Tareas a la derecha) */}
              <View style={styles.splitSection}>
                <View style={styles.pedroColumn}>
                  <Image 
                    source={pedroImg} 
                    style={styles.pedroImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.tasksColumn}>
                  <TodayTasksCard />
                </View>
              </View>

              {/* 4. FINANZAS (Ancho completo) */}
              <View style={styles.fullWidthWrapper}>
                <FinanceSummaryCard />
              </View>

              {/* 5. NOVEDADES / ARTÍCULOS (Ancho completo) */}
              <View style={styles.fullWidthWrapper}>
                <Text style={styles.novedadesTitle}>NOVEDADES</Text>
                <LatestArticles />
              </View>
            </>
          )}

        </View>
      </ScrollView>

      {/* Modales */}
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
  safe: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  mainGreeting: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },
  widgetsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  rachaCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#E8611A55",
    backgroundColor: "#111",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  rachaCircleContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E8611A",
  },
  fireEmoji: {
    fontSize: 12,
  },
  rachaCompactNumber: {
    fontSize: 14,
    fontWeight: "900",
    color: "#FFF",
    marginTop: -2,
  },
  rachaCompactSequence: {
    flexDirection: "row",
    gap: 3,
    paddingHorizontal: 2,
  },
  rachaNextCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#161616",
  },
  rachaNextText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#555",
  },
  rachaButtonPop: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  rachaButtonPopText: {
    color: "#E8611A",
    fontSize: 10,
    fontWeight: "700",
  },
  logrosBtnCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#111",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F5C51855",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  logrosLabelCompact: {
    color: "#AAA",
    fontSize: 12,
    fontWeight: "700",
  },
  trophyEmojiCompact: {
    fontSize: 14,
  },
  splitSection: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 12,
    marginBottom: 16,
  },
  pedroColumn: {
    flex: 1.1, 
    justifyContent: "flex-end",
    alignItems: "center",
  },
  pedroImage: {
    width: "100%",
    height: 190, // Altura calibrada para alinearse con la tarjeta de tareas
  },
  tasksColumn: {
    flex: 1,
    justifyContent: "center",
  },
  fullWidthWrapper: {
    width: "100%",
    marginBottom: 16,
  },
  novedadesTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: "uppercase",
  },
});