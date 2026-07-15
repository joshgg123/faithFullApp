import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import BalanceEvolutionChart from "@/components/tesoros/BalanceEvolutionChart";
import CloseCashboxModal from "@/components/tesoros/CloseCashboxModal";
import CreateTransactionModal from "@/components/tesoros/CreateTransactionModal";
import FloatingActionButton from "@/components/tesoros/FloatingActionButton";
import SummaryCard from "@/components/tesoros/SummaryCard";
import TransactionList from "@/components/tesoros/TransactionList";
import TransactionDetailModal from "@/components/tesoros/TransactionModalDetail";

import useTreasury from "@/contexts/TesoroContext";
import { Transaction } from "@/types/tesoros/transaction";

export default function TreasuryScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { loading, cashbox, balance, transactions } = useTreasury();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [closeModalVisible, setCloseModalVisible] = useState(false);

  const confirmedTransactions = useMemo(() => {
    return transactions.filter(
      (transaction: Transaction) => transaction.status === "confirmed"
    );
  }, [transactions]);

  const calculatedIncome = useMemo(() => {
    return confirmedTransactions
      .filter((t: Transaction) => t.type === "income")
      .reduce((acc: number, t: Transaction) => acc + t.amount, 0);
  }, [confirmedTransactions]);

  const calculatedExpense = useMemo(() => {
    return confirmedTransactions
      .filter((t: { type: string }) => t.type === "expense")
      .reduce((acc: any, t: { amount: any }) => acc + t.amount, 0);
  }, [confirmedTransactions]);

  const totalIncome =
    cashbox?.status === "closed" ? cashbox.totalIncome || 0 : calculatedIncome;

  const totalExpense =
    cashbox?.status === "closed" ? cashbox.totalExpense || 0 : calculatedExpense;

  const previewTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!cashbox) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: theme.text }}>No hay una caja activa</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainScreenTitle}>Finanzas</Text>

        <SummaryCard
          cashbox={cashbox}
          balance={balance}
          transactionsCount={transactions.length}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <View style={styles.headerButtonsRow}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/tesoros/history")}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setCloseModalVisible(true)}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Cerrar caja</Text>
          </TouchableOpacity>
        </View>

        <BalanceEvolutionChart transactions={transactions} />

        <View style={styles.movementsHeaderRow}>
          <Text style={styles.movementsTitle}>Movimientos</Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(tabs)/tesoros/[cashboxId]",
                params: { cashboxId: cashbox.id },
              })
            }
          >
            <Text style={styles.viewMoreText}>Ver más</Text>
          </TouchableOpacity>
        </View>

        <TransactionList
          transactions={previewTransactions}
          onPress={(transaction) => setSelectedTransaction(transaction)}
        />
      </ScrollView>

      <TransactionDetailModal
        visible={selectedTransaction !== null}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      <CreateTransactionModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        cashbox={cashbox}
      />

      <CloseCashboxModal
        visible={closeModalVisible}
        cashbox={cashbox}
        balance={balance}
        onClose={() => setCloseModalVisible(false)}
        onSuccess={() => setCloseModalVisible(false)}
      />

      <View style={styles.fabContainer} pointerEvents="box-none">
        <FloatingActionButton onPress={() => setCreateModalVisible(true)} />
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
      margin: 5,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingTop: 24,
      paddingBottom: 120,
    },
    mainScreenTitle: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.text,
      marginTop: 8,
      marginBottom: 16,
      textAlign: "center",
    },
    headerButtonsRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 7,
      marginBottom: 24,
    },
    headerButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 18,
      marginHorizontal: 8,
    },
    headerButtonText: {
      color: theme.textInverse,
      fontWeight: "600",
    },
    movementsHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      marginTop: 8,
    },
    movementsTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.text,
    },
    viewMoreText: {
      color: theme.primary,
      fontWeight: "600",
    },
    fabContainer: {
      position: "absolute",
      bottom: 24,
      right: 24,
      zIndex: 999,
    },
  });