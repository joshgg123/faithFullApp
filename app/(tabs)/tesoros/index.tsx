import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { router } from "expo-router";

import SummaryCard from "@/components/tesoros/SummaryCard";
import BalanceEvolutionChart from "@/components/tesoros/BalanceEvolutionChart";
import TransactionDetailModal from "@/components/tesoros/TransactionModalDetail";
import TransactionList from "@/components/tesoros/TransactionList";
import FloatingActionButton from "@/components/tesoros/FloatingActionButton";
import CreateTransactionModal from "@/components/tesoros/CreateTransactionModal";
import CloseCashboxModal from "@/components/tesoros/CloseCashboxModal";

import useTreasury from "@/contexts/TesoroContext";
import { Transaction } from "@/types/tesoros/transaction";

export default function TreasuryScreen() {
  const { loading, cashbox, balance, transactions } = useTreasury();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  if (!cashbox) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: "#FFF" }}>No hay una caja activa</Text>
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
        {/* TÍTULO PRINCIPAL: Finanzas corregido */}
        <Text style={styles.mainScreenTitle}>
          Finanzas
        </Text>

        {/* HEADER CON BOTONES */}
        <View style={styles.headerButtonsRow}>
          {/* HISTORY */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/tesoros/history")}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Historial</Text>
          </TouchableOpacity>

          {/* CLOSE */}
          <TouchableOpacity
            onPress={() => setCloseModalVisible(true)}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Cerrar caja</Text>
          </TouchableOpacity>
        </View>

        <SummaryCard
          cashbox={cashbox}
          balance={balance}
          transactionsCount={transactions.length}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <BalanceEvolutionChart transactions={transactions} />

        {/* MOVEMENTS HEADER */}
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

      {/* MODALS */}
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

      {/* CONTENEDOR SEGURO PARA EL BOTÓN + */}
      <View style={styles.fabContainer} pointerEvents="box-none">
        <FloatingActionButton onPress={() => setCreateModalVisible(true)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#bab9b9d4",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F2937",
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
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,       // Espacio superior seguro
    marginBottom: 16,   // ¡Aquí le damos aire antes de los botones!
  },
  headerButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
  },
  headerButtonText: {
    color: "#FFF",
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
    color: "#111827",
  },
  viewMoreText: {
    color: "#2563EB",
    fontWeight: "600",
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 999,
  },
});