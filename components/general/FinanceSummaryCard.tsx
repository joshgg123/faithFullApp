// components/general/FinanceSummaryCard.tsx
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import useTreasury from "@/hooks/useTreasury";

const DAYS_LABELS = ["L", "M", "M", "J", "J", "V", "S", "D"];

export function FinanceSummaryCard() {
  const {
    loading,
    cashbox,
    balance,
    totalIncome,
    totalExpense,
    confirmedTransactions,
  } = useTreasury();

  // Generamos y normalizamos las barras basadas en las últimas transacciones
  const barsData = useMemo(() => {
    const lastTx = [...confirmedTransactions].slice(0, 8).reverse();
    
    // Si no hay transacciones, mostramos una visualización dummy estética por defecto
    if (lastTx.length === 0) {
      return [25, 45, 30, 55, 40, 65, 50, 75];
    }

    const amounts = lastTx.map((t) => t.amount);
    const maxAmount = Math.max(...amounts, 1);

    // Mapeamos a una altura máxima de 50px para mantenerlo ultra compacto
    return amounts.map((amt) => Math.max((amt / maxAmount) * 50, 8));
  }, [confirmedTransactions]);

  // Cálculo dinámico de porcentaje de rendimiento (Ingresos vs Gastos)
  const trendPercent = useMemo(() => {
    if (totalExpense === 0) return totalIncome > 0 ? "100%" : "0%";
    const pct = ((totalIncome - totalExpense) / totalExpense) * 100;
    return `${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct).toFixed(1)}%`;
  }, [totalIncome, totalExpense]);

  if (loading) {
    return (
      <View style={[styles.card, styles.center]}>
        <ActivityIndicator color="#F5C518" />
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
      {/* COLUMNA IZQUIERDA: Datos numéricos */}
      <View style={styles.infoColumn}>
        <Text style={styles.titleText}>Mis Finanzas</Text>
        <Text style={styles.balanceText}>
          ${balance.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
        </Text>
        <Text style={[
          styles.trendText, 
          { color: totalIncome >= totalExpense ? "#4CAF50" : "#FF5252" }
        ]}>
          {trendPercent} <Text style={styles.trendSub}>desde la semana pasada</Text>
        </Text>
      </View>

      {/* COLUMNA DERECHA: Gráfico de barras micro */}
      <View style={styles.chartColumn}>
        <View style={styles.barsContainer}>
          {barsData.map((heightValue, index) => (
            <View key={index} style={styles.barWrapper}>
              <View style={[styles.barItem, { height: heightValue }]} />
              <Text style={styles.barLabel}>
                {DAYS_LABELS[index % DAYS_LABELS.length]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
    paddingVertical: 16,
    paddingHorizontal: 18,
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
    color: "#666",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "900",
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "700",
  },
  trendSub: {
    color: "#555",
    fontWeight: "500",
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
    backgroundColor: "#1DB954", // Verde premium estilo gráfico financiero moderno
    borderRadius: 3,
  },
  barLabel: {
    color: "#444",
    fontSize: 8,
    fontWeight: "700",
    textAlign: "center",
  },
  empty: {
    color: "#555",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
});