import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";

import { AppText as Text } from "@/components/ui/AppText";
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

  /*
  // Cálculo dinámico de porcentaje de rendimiento (Ingresos vs Gastos)
  const trendPercent = useMemo(() => {
    if (totalExpense === 0) return totalIncome > 0 ? "100%" : "0%";
    const pct = ((totalIncome - totalExpense) / totalExpense) * 100;
    return `${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct).toFixed(1)}%`;
  }, [totalIncome, totalExpense]);
  */
  
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
    marginTop: 20,
    paddingVertical: 18,
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
   color: "#4CAF50",
   fontSize: 10,
  },
  arrowDown: {
   color: "#FF5252",
   fontSize: 10,
  },
  incomeValue: {
   color: "#4CAF50",
   fontSize: 12,
   fontWeight: "700",
  },
  expenseValue: {
   color: "#FF5252",
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