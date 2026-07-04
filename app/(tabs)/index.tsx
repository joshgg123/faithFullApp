import React, { useEffect, useState } from "react";
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
import { getUserName } from "@/services/userServices";
import { UserLogro, UserStreak } from "@/types/insignia";
import { db } from "@/services/firebaseService";
import { collection, onSnapshot, query } from "firebase/firestore";

import {
  updateStreak,
} from "@/services/insigniasservice";

const HARDCODED_USER_ID = "DsKU3kJoDuWZywM8RdRo";

export default function HomeScreen() {
  const [userName, setUserName] = useState("");
  const [streak, setStreak] = useState<UserStreak>({
    streakDays: 0,
    lastLoginDate: "",
  });

  // Estado reactivo para los logros locales de esta pantalla
  const [localLogros, setLocalLogros] = useState<UserLogro[]>([]);
  const [loading, setLoading] = useState(true);

  const [rachaVisible, setRachaVisible] = useState(false);
  const [logrosVisible, setLogrosVisible] = useState(false);

  // 1. Obtener nombre del usuario
  useEffect(() => {
    async function fetchUserName() {
      const name = await getUserName();
      setUserName(name);
    }
    
    fetchUserName();
  }, []);

  // 2. 🔥 OBSERVADOR EN TIEMPO REAL: Sincroniza los logros y actualiza el contador al instante
  useEffect(() => {
    const logrosRef = collection(db, "USUARIO", HARDCODED_USER_ID, "LOGROS");
    const q = query(logrosRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaLogros = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserLogro[];

      setLocalLogros(listaLogros);
    }, (error) => {
      console.error("Error escuchando logros en el Home: ", error);
    });

    return () => unsubscribe();
  }, []);

  // 3. Cargar la racha (y quitar la carga estática de logros anteriores)
  useEffect(() => {
    async function loadStreakData() {
      setLoading(true);
      try {
        const streakData = await updateStreak();
        setStreak(streakData);
      } catch (error) {
        console.error("Error al cargar racha:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStreakData();
  }, []);

  // ⚡ El conteo se recalcula solo cada vez que 'localLogros' cambie en Firestore
  const unlockedCount = localLogros.filter((l) => l.unlocked).length;

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
              <RachaButton
                streakDays={streak.streakDays}
                onPress={() => setRachaVisible(true)}
              />
              {/* El botón ahora reflejará el cambio al milisegundo */}
              <LogrosButton
                unlockedCount={unlockedCount}
                totalCount={localLogros.length}
                onPress={() => setLogrosVisible(true)}
              />
            </View>
          )}

          {/* Tareas */}
          <View style={styles.todayRow}>
            <HomeCharacter />
            <View style={styles.todayCardWrap}>
              <TodayTasksCard />
            </View>
          </View>
          
          {/* Finanzas y Artículos */}
          <FinanceSummaryCard />
          <LatestArticles />
        </View>
      </ScrollView>

      {/* Modales del sistema */}
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