import { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import TransactionList from "@/components/tesoros/TransactionList";
import TransactionDetailModal from "@/components/tesoros/TransactionModalDetail";
import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";

import {
  getCashbox,
  getTransactions,
} from "@/services/tesorosServices/tesoros";

import { Cashbox } from "@/types/tesoros/cashbox";
import { Transaction } from "@/types/tesoros/transaction";

export default function CashboxDetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { cashboxId } = useLocalSearchParams<{ cashboxId: string }>();

  const [loading, setLoading] = useState(true);
  const [cashbox, setCashbox] = useState<Cashbox | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  async function loadData() {
    try {
      setLoading(true);

      const cashboxData = await getCashbox(cashboxId);
      const transactionsData = await getTransactions(cashboxId);

      const sortedTransactions = transactionsData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setCashbox(cashboxData);
      setTransactions(sortedTransactions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!cashboxId) return;
    loadData();
  }, [cashboxId]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!cashbox) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: theme.text }}>Caja no encontrada</Text>
      </View>
    );
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{cashbox.name}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={styles.summaryBalance}>${balance.toFixed(2)}</Text>

          <View style={styles.pillsRow}>
            <View style={[styles.pill, styles.pillIncome]}>
              <Text style={styles.pillLabelIncome}>Ingresos</Text>
              <Text style={styles.pillValue}>${income.toFixed(2)}</Text>
            </View>

            <View style={[styles.pill, styles.pillExpense]}>
              <Text style={styles.pillLabelExpense}>Gastos</Text>
              <Text style={styles.pillValue}>${expense.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.movementsTitle}>Movimientos</Text>

        <TransactionList
          transactions={transactions}
          onPress={(transaction) => setSelectedTransaction(transaction)}
        />
      </ScrollView>

      <TransactionDetailModal
        visible={selectedTransaction !== null}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
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
      paddingBottom: 120,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      marginBottom: 24,
    },
    backIcon: {
      color: theme.text,
      fontSize: 24,
    },
    headerTitle: {
      color: theme.text,
      fontSize: 28,
      fontWeight: "700",
    },
    summaryCard: {
      backgroundColor: theme.primary,
      borderRadius: 28,
      padding: 24,
      marginBottom: 24,
    },
    summaryLabel: {
      color: theme.primaryBright,
      marginBottom: 8,
    },
    summaryBalance: {
      color: theme.textInverse,
      fontSize: 38,
      fontWeight: "700",
    },
    pillsRow: {
      flexDirection: "row",
      marginTop: 24,
      gap: 12,
    },
    pill: {
      flex: 1,
      borderRadius: 20,
      padding: 16,
    },
    pillIncome: {
      backgroundColor: "rgba(34,197,94,0.15)",
    },
    pillExpense: {
      backgroundColor: "rgba(239,68,68,0.15)",
    },
    pillLabelIncome: {
      color: "#86EFAC",
      marginBottom: 8,
    },
    pillLabelExpense: {
      color: "#FDA4AF",
      marginBottom: 8,
    },
    pillValue: {
      color: theme.textInverse,
      fontSize: 22,
      fontWeight: "700",
    },
    movementsTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 16,
    },
  });