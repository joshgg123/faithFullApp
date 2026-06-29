import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { RachaModal } from "@/components/insignia/RachaModal";
import { LogrosModal } from "@/components/insignia/Logrosmodal";
import { TodayTasksCard } from "@/components/general/TodayTaskCard";
import { FinanceSummaryCard } from "@/components/general/FinanceSummaryCard";
import { UserLogro, UserStreak } from "@/types/insignia";
import {getUserName } from "@/services/userServices";
import {LatestArticles} from "@/components/general/LatestArticles";

import {
  updateStreak,
  getUserLogros,
} from "@/services/insigniasservice";

export default function HomeScreen() {
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    async function fetchUserName() {
      const name = await getUserName();
      setUserName(name);
    }
    
    fetchUserName();
  }, []);
  const [streak, setStreak] = useState<UserStreak>({
    streakDays: 0,
    lastLoginDate: "",
  });

  const [logros, setLogros] = useState<UserLogro[]>([]);
  const [loading, setLoading] = useState(true);

  const [rachaVisible, setRachaVisible] = useState(false);
  const [logrosVisible, setLogrosVisible] = useState(false);

  useEffect(() => {
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

  const unlockedCount = logros.filter(
    (l) => l.unlocked
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Saludo */}
          <Text style={styles.greeting}>
            HOLA, {userName.toUpperCase()}!
          </Text>

          {/* Header */}
          {loading ? (
            <ActivityIndicator
              color="#F5C518"
              style={{ marginVertical: 30 }}
            />
          ) : (
            <View style={styles.btnRow}>
              {/* Racha */}
              <TouchableOpacity
                style={styles.rachaBtn}
                activeOpacity={0.8}
                onPress={() => setRachaVisible(true)}
              >
                <Text style={styles.fireEmoji}>🔥</Text>

                <Text style={styles.rachaNumber}>
                  {streak.streakDays}
                </Text>

                <Text style={styles.rachaLabel}>
                  días de racha
                </Text>
              </TouchableOpacity>

              {/* Logros */}
              <TouchableOpacity
                style={styles.logrosBtn}
                activeOpacity={0.8}
                onPress={() => setLogrosVisible(true)}
              >
                <Text style={styles.trophyEmoji}>🏆</Text>

                <Text style={styles.logrosNumber}>
                  {unlockedCount}/{logros.length}
                </Text>

                <Text style={styles.logrosLabel}>
                  logros
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Tareas */}
          <TodayTasksCard />

          <LatestArticles />
          
          <FinanceSummaryCard />

        </View>
      </ScrollView>

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
    paddingBottom: 40,
  },

  container: {
    flex: 1,
    padding: 20,
  },

  greeting: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 24,
    letterSpacing: 0.5,
  },

  btnRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },

  rachaBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#E8611A55",
    paddingVertical: 24,
    alignItems: "center",
  },

  fireEmoji: {
    fontSize: 40,
  },

  rachaNumber: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFF",
  },

  rachaLabel: {
    color: "#888",
    marginTop: 4,
    fontSize: 12,
  },

  logrosBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#F5C51855",
    paddingVertical: 24,
    alignItems: "center",
  },

  trophyEmoji: {
    fontSize: 40,
  },

  logrosNumber: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFF",
  },

  logrosLabel: {
    color: "#888",
    marginTop: 4,
    fontSize: 12,
  },
});