import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from "react-native";

import { FinanceSummaryCard } from "@/components/general/FinanceSummaryCard";
import { HomeCharacter } from "@/components/general/HomeCharacter";
import { LatestArticles } from "@/components/general/LatestArticles";
import { TodayTasksCard } from "@/components/general/TodayTaskCard";
import { LogrosButton } from "@/components/insignia/LogrosButton";
import { LogrosModal } from "@/components/insignia/Logrosmodal";
import { RachaButton } from "@/components/insignia/RachaButton";
import { RachaModal } from "@/components/insignia/RachaModal";
import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { getUserName } from "@/services/userServices";
import { UserLogro, UserStreak } from "@/types/insignia";

import {
  getUserLogros,
  updateStreak,
} from "@/services/insigniasservice";

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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

  const unlockedCount = logros.filter((l) => l.unlocked).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.greeting}>
            HOLA, {userName.toUpperCase()}!
          </Text>

          {loading ? (
            <ActivityIndicator
              color={theme.primary}
              style={{ marginVertical: 30 }}
            />
          ) : (
            <View style={styles.btnRow}>
              <RachaButton
                streakDays={streak.streakDays}
                onPress={() => setRachaVisible(true)}
              />
              <LogrosButton
                unlockedCount={unlockedCount}
                totalCount={logros.length}
                onPress={() => setLogrosVisible(true)}
              />
            </View>
          )}

          <View style={styles.todayRow}>
            <HomeCharacter />
            <View style={styles.todayCardWrap}>
              <TodayTasksCard />
            </View>
          </View>

          <FinanceSummaryCard />
          <LatestArticles />
        </View>
      </ScrollView>

      <RachaModal
        visible={rachaVisible}
        streakDays={streak.streakDays}
        onClose={() => setRachaVisible(false)}
      />

      <LogrosModal
        visible={logrosVisible}
        onClose={() => setLogrosVisible(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background,
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
      color: theme.text,
      marginBottom: 24,
      letterSpacing: 0.5,
      textAlign: "center",
      width: "100%",
    },
    btnRow: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 24,
    },
    todayRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    todayCardWrap: {
      flex: 1,
    },
  });