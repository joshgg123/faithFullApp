import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";

import { AppText as Text } from "@/components/ui/AppText";

import { LineChart } from "react-native-chart-kit";

import useTreasury from "@/hooks/useTreasury";

const screenWidth = Dimensions.get("window").width;

export function FinanceSummaryCard() {
  const {
    loading,
    cashbox,
    balance,
    totalIncome,
    totalExpense,
    confirmedTransactions,
  } = useTreasury();

  const chartData = useMemo(() => {
    let runningBalance = 0;

    const ordered = [...confirmedTransactions].reverse();

    const values = ordered.map((t) => {
      runningBalance +=
        t.type === "income"
          ? t.amount
          : -t.amount;

      return runningBalance;
    });

    return values.length
      ? values
      : [0];
  }, [confirmedTransactions]);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#FFD54F" />
      </View>
    );
  }
  if (!cashbox) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          Finanzas
        </Text>

        <Text style={styles.empty}>
          No hay una caja abierta.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        💰 Finanzas
      </Text>

      <Text style={styles.balance}>
        ${balance.toLocaleString("es-AR")}
      </Text>

      <Text style={styles.subtitle}>
        Balance actual
      </Text>

      <LineChart
        data={{
          labels: [],
          datasets: [
            {
              data: chartData,
            },
          ],
        }}
        width={screenWidth - 80}
        height={150}
        withDots={false}
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
        withHorizontalLabels={false}
        withVerticalLabels={false}
        bezier
        chartConfig={{
          backgroundGradientFrom: "#111",
          backgroundGradientTo: "#111",
          decimalPlaces: 0,

          color: (opacity = 1) =>
            `rgba(255,213,79,${opacity})`,

          labelColor: () => "#111",

          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        style={{
          marginVertical: 10,
          borderRadius: 16,
        }}
      />

      <View style={styles.footer}>
        <View>
          <Text style={styles.incomeLabel}>
            ↑ Ingresos
          </Text>

          <Text style={styles.value}>
            ${totalIncome.toLocaleString("es-AR")}
          </Text>
        </View>

        <View>
          <Text style={styles.expenseLabel}>
            ↓ Gastos
          </Text>

          <Text style={styles.value}>
            ${totalExpense.toLocaleString("es-AR")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    borderRadius: 24,
    padding: 20,
    marginTop: 20,
  },

  title: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 20,
  },

  balance: {
    color: "#FFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 15,
  },

  subtitle: {
    color: "#888",
    marginBottom: 10,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  incomeLabel: {
    color: "#4CAF50",
    fontWeight: "700",
  },

  expenseLabel: {
    color: "#FF5252",
    fontWeight: "700",
  },

  value: {
    color: "#FFF",
    marginTop: 5,
    fontWeight: "700",
    fontSize: 18,
  },

  empty: {
    color: "#888",
    marginTop: 10,
  },
});