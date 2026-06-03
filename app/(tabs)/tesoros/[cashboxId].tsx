import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import TransactionList from "@/components/tesoros/TransactionList";

import TransactionDetailModal from "@/components/tesoros/TransactionModalDetail";

import {
  getCashbox,
  getTransactions,
} from "@/services/tesorosServices/tesoros";

import { Cashbox } from "@/types/tesoros/cashbox";

import { Transaction } from "@/types/tesoros/transaction";

export default function CashboxDetailScreen() {
  const { cashboxId } =
    useLocalSearchParams<{
      cashboxId: string;
    }>();

  const [loading, setLoading] =
    useState(true);

  const [cashbox, setCashbox] =
    useState<Cashbox | null>(null);

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>(
    [],
  );

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] = useState<Transaction | null>(
    null,
  );

  async function loadData() {
    try {
      setLoading(true);

      const cashboxData =
        await getCashbox(
          cashboxId,
        );

      const transactionsData =
        await getTransactions(
          cashboxId,
        );

      /**
       * MÁS NUEVAS PRIMERO
       */
      const sortedTransactions =
        transactionsData.sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );

      setCashbox(cashboxData);

      setTransactions(
        sortedTransactions,
      );
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
          Caja no encontrada
        </Text>
      </View>
    );
  }

  const income =
    transactions
      .filter(
        (t) =>
          t.type === "income",
      )
      .reduce(
        (acc, t) =>
          acc + t.amount,
        0,
      );

  const expense =
    transactions
      .filter(
        (t) =>
          t.type === "expense",
      )
      .reduce(
        (acc, t) =>
          acc + t.amount,
        0,
      );

  const balance =
    income - expense;

  return (
    <>
      <ScrollView
        style={{
          flex: 1,

          backgroundColor:
            "#1F2937",
        }}
        contentContainerStyle={{
          padding: 16,

          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",

            gap: 16,

            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.back()
            }
          >
            <Text
              style={{
                color: "#FFF",

                fontSize: 24,
              }}
            >
              ←
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: "#FFF",

              fontSize: 28,

              fontWeight: "700",
            }}
          >
            {cashbox.name}
          </Text>
        </View>

        {/* SUMMARY */}
        <View
          style={{
            backgroundColor:
              "#111827",

            borderRadius: 28,

            padding: 24,

            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#9CA3AF",

              marginBottom: 8,
            }}
          >
            Balance
          </Text>

          <Text
            style={{
              color: "#FFF",

              fontSize: 38,

              fontWeight: "700",
            }}
          >
            $
            {balance.toFixed(2)}
          </Text>

          <View
            style={{
              flexDirection: "row",

              marginTop: 24,

              gap: 12,
            }}
          >
            {/* INCOME */}
            <View
              style={{
                flex: 1,

                backgroundColor:
                  "#052E16",

                borderRadius: 20,

                padding: 16,
              }}
            >
              <Text
                style={{
                  color: "#86EFAC",

                  marginBottom: 8,
                }}
              >
                Ingresos
              </Text>

              <Text
                style={{
                  color: "#FFF",

                  fontSize: 22,

                  fontWeight: "700",
                }}
              >
                $
                {income.toFixed(2)}
              </Text>
            </View>

            {/* EXPENSE */}
            <View
              style={{
                flex: 1,

                backgroundColor:
                  "#3F0D1D",

                borderRadius: 20,

                padding: 16,
              }}
            >
              <Text
                style={{
                  color: "#FDA4AF",

                  marginBottom: 8,
                }}
              >
                Gastos
              </Text>

              <Text
                style={{
                  color: "#FFF",

                  fontSize: 22,

                  fontWeight: "700",
                }}
              >
                $
                {expense.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* MOVEMENTS */}
        <Text
          style={{
            color: "#FFF",

            fontSize: 22,

            fontWeight: "700",

            marginBottom: 16,
          }}
        >
          Movimientos
        </Text>

        <TransactionList
          transactions={transactions}
          onPress={(
            transaction,
          ) =>
            setSelectedTransaction(
              transaction,
            )
          }
        />
      </ScrollView>

      {/* MODAL */}
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
    </>
  );
}