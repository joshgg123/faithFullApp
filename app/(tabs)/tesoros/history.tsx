import { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { getCashboxes } from "@/services/tesorosServices/tesoros";
import { Cashbox } from "@/types/tesoros/cashbox";
import { router } from "expo-router";

export default function CashboxesHistoryScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [loading, setLoading] = useState(true);
  const [cashboxes, setCashboxes] = useState<Cashbox[]>([]);

  async function loadCashboxes() {
    try {
      setLoading(true);

      const data = await getCashboxes();

      const sorted = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setCashboxes(sorted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCashboxes();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Historial</Text>
      </View>

      {cashboxes.map((cashbox) => {
        const isOpen = cashbox.status === "open";

        return (
          <TouchableOpacity
            key={cashbox.id}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/tesoros/[cashboxId]",
                params: { cashboxId: cashbox.id },
              })
            }
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{cashbox.name}</Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: isOpen ? theme.success : theme.primaryBright },
              ]}
            >
              <Text style={styles.badgeText}>
                {isOpen ? "ACTIVA" : "CERRADA"}
              </Text>
            </View>

            <Text style={styles.cardLabel}>Balance final</Text>
            <Text style={styles.cardBalance}>
              ${(cashbox.finalBalance ?? 0).toFixed(2)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 24,
    },
    backIcon: {
      color: theme.text,
      fontSize: 22,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "700",
      color: theme.text,
    },
    card: {
      backgroundColor: theme.primary,
      borderRadius: 24,
      padding: 20,
      marginBottom: 16,
    },
    cardTitle: {
      color: theme.textInverse,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 8,
    },
    badge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },
    badgeText: {
      color: theme.textInverse,
      fontWeight: "600",
      fontSize: 12,
    },
    cardLabel: {
      color: theme.primaryBright,
      marginTop: 18,
    },
    cardBalance: {
      color: theme.textInverse,
      fontSize: 28,
      fontWeight: "700",
    },
  });