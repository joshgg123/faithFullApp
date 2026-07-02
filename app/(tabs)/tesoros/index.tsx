import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
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
  const {
    loading,
    cashbox,
    balance,
    transactions,
    
  } = useTreasury();

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] = useState<Transaction | null>(
    null,
  );

  const [
    createModalVisible,
    setCreateModalVisible,
  ] = useState(false);

  const [
    closeModalVisible,
    setCloseModalVisible,
  ] = useState(false);

  const confirmedTransactions =
    useMemo(() => {
      return transactions.filter(
        (transaction: Transaction) =>
          transaction.status ===
          "confirmed",
      );
    }, [transactions]);

  const calculatedIncome =
    useMemo(() => {
      return confirmedTransactions
        .filter(
          (t: Transaction) =>
            t.type === "income",
        )
        .reduce(
          (acc: number, t: Transaction) =>
            acc + t.amount,
          0,
        );
    }, [confirmedTransactions]);

  const calculatedExpense =
    useMemo(() => {
      return confirmedTransactions
        .filter(
          (t: { type: string; }) =>
            t.type === "expense",
        )
        .reduce(
          (acc: any, t: { amount: any; }) =>
            acc + t.amount,
          0,
        );
    }, [confirmedTransactions]);

  const totalIncome =
    cashbox?.status === "closed"
      ? cashbox.totalIncome || 0
      : calculatedIncome;

  const totalExpense =
    cashbox?.status === "closed"
      ? cashbox.totalExpense || 0
      : calculatedExpense;

  const previewTransactions =
    transactions.slice(0, 5);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,

          justifyContent: "center",

          alignItems: "center",

          backgroundColor:
            "#1F2937",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (!cashbox) {
    return (
      <View
        style={{
          flex: 1,

          justifyContent: "center",

          alignItems: "center",

          backgroundColor:
            "#1F2937",
        }}
      >
        <Text
          style={{
            color: "#FFF",
          }}
        >
          No hay una caja activa
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={{
          flex: 1,

          backgroundColor:
            "#bab9b9d4",
        }}
        contentContainerStyle={{
          padding: 16,

          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: 24,
          }}
        >
          {/* HISTORY */}
          <TouchableOpacity
            onPress={() =>
              router.push(
  "/(tabs)/tesoros/history",
)
            }
            style={{
              backgroundColor:
                "#111827",

              paddingHorizontal: 18,

              paddingVertical: 12,

              borderRadius: 18,
            }}
          >
            <Text
              style={{
                color: "#FFF",

                fontWeight: "600",
              }}
            >
              Historial
            </Text>
          </TouchableOpacity>

          {/* CLOSE */}
          <TouchableOpacity
            onPress={() =>
              setCloseModalVisible(
                true,
              )
            }
            style={{
              backgroundColor:
                "#111827",

              paddingHorizontal: 18,

              paddingVertical: 12,

              borderRadius: 18,
            }}
          >
            <Text
              style={{
                color: "#FFF",

                fontWeight: "600",
              }}
            >
              Cerrar caja
            </Text>
          </TouchableOpacity>
        </View>

        <SummaryCard
          cashbox={cashbox}
          balance={balance}
          transactionsCount={
            transactions.length
          }
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <BalanceEvolutionChart
          transactions={transactions}
        />

        {/* MOVEMENTS */}
        <View
          style={{
            flexDirection: "row",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 22,

              fontWeight: "700",

              color: "#FFF",
            }}
          >
            Movimientos
          </Text>

          <TouchableOpacity
            onPress={() =>
              router.push({
  pathname:
    "/(tabs)/tesoros/[cashboxId]",

  params: {
    cashboxId: cashbox.id,
  },
})
            }
          >
            <Text
              style={{
                color: "#60A5FA",

                fontWeight: "600",
              }}
            >
              Ver más
            </Text>
          </TouchableOpacity>
        </View>

        <TransactionList
          transactions={
            previewTransactions
          }
          onPress={(
            transaction,
          ) =>
            setSelectedTransaction(
              transaction,
            )
          }
        />
      </ScrollView>

      <TransactionDetailModal
        visible={
          selectedTransaction !== null
        }
        transaction={
          selectedTransaction
        }
        onClose={() =>
          setSelectedTransaction(null)
        }
      />

      <CreateTransactionModal
        visible={createModalVisible}
        onClose={() =>
          setCreateModalVisible(false)
        }
        cashbox={cashbox}
      />

      <CloseCashboxModal
        visible={closeModalVisible}
        cashbox={cashbox}
        balance={balance}
        onClose={() =>
          setCloseModalVisible(false)
        }
        onSuccess={() => {
          setCloseModalVisible(false);
        }}
      />

      <FloatingActionButton
        onPress={() =>
          setCreateModalVisible(true)
        }
      />
    </>
  );
}