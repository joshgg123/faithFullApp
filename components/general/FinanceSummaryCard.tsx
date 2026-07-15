import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import useTreasury from "@/hooks/useTreasury";

const DAYS_LABELS = ["L", "M", "M", "J", "J", "V", "S", "D"];

export function FinanceSummaryCard() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    loading,
    cashbox,
    balance,
    totalIncome,
    totalExpense,
    confirmedTransactions,
  } = useTreasury();

  const barsData = useMemo(() => {
    const lastTx = [...confirmedTransactions].slice(0, 8).reverse();

    if (lastTx.length === 0) {
      return [25, 45, 30, 55, 40, 65, 50, 75];
    }

    const amounts = lastTx.map((t) => t.amount);
    const maxAmount = Math.max(...amounts, 1);

    return amounts.map((amt) => Math.max((amt / maxAmount) * 50, 8));
  }, [confirmedTransactions]);

  if (loading) {
    return (
      <View style={[styles.card, styles.center]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!cashbox) {
    return (
      <View style={styles.card}>
        <Text style={styles.titleText}>Mis Finanzas</Text>
        <Text style={styles.empty}>No hay una caja abierta actualmente.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.infoColumn}>
        <Text style={styles.titleText}>Mis Finanzas</Text>
        <Text style={styles.balanceText}>
          ${balance.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </Text>
        <View style={styles.movementsRow}>
          <View style={styles.movementItem}>
            <Text style={styles.arrowUp}>▲</Text>
            <Text style={styles.incomeValue}>
              ${totalIncome.toLocaleString("es-AR")}
            </Text>
          </View>

          <View style={styles.movementItem}>
            <Text style={styles.arrowDown}>▼</Text>
            <Text style={styles.expenseValue}>
              ${totalExpense.toLocaleString("es-AR")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartColumn}>
        <View style={styles.barsContainer}>
          {barsData.map((heightValue, index) => {
            const isLast = index === barsData.length - 1;
            return (
              <View key={index} style={styles.barWrapper}>
                <View
                  style={[
                    styles.barItem,
                    { height: heightValue },
                    isLast && styles.barItemActive,
                  ]}
                />
                <Text style={styles.barLabel}>
                  {DAYS_LABELS[index % DAYS_LABELS.length]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: "transparent",
      marginTop: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: 110,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },
    infoColumn: {
      flex: 1.2,
      justifyContent: "center",
    },
    titleText: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "700",
    },
    balanceText: {
      color: theme.textSecondary,
      fontSize: 26,
      fontWeight: "900",
      marginVertical: 4,
      letterSpacing: -0.5,
    },
    movementsRow: {
      flexDirection: "row",
      gap: 14,
      marginTop: 2,
    },
    movementItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    arrowUp: {
      color: theme.income,
      fontSize: 10,
    },
    arrowDown: {
      color: theme.expense,
      fontSize: 10,
    },
    incomeValue: {
      color: theme.income,
      fontSize: 12,
      fontWeight: "700",
    },
    expenseValue: {
      color: theme.expense,
      fontSize: 12,
      fontWeight: "700",
    },
    chartColumn: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "flex-end",
      paddingTop: 10,
    },
    barsContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 5,
    },
    barWrapper: {
      alignItems: "center",
      gap: 4,
    },
    barItem: {
      width: 6,
      backgroundColor: theme.chartBar,
      borderRadius: 3,
    },
    barItemActive: {
      backgroundColor: theme.chartBarActive,
    },
    barLabel: {
      color: theme.textSecondary,
      fontSize: 8,
      fontWeight: "700",
      textAlign: "center",
    },
    empty: {
      color: theme.textSecondary,
      fontSize: 12,
      marginTop: 4,
      fontStyle: "italic",
    },
  });