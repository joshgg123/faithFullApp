import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { Cashbox } from "@/types/tesoros/cashbox";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  cashbox: Cashbox;
  balance: number;
  transactionsCount: number;
  totalIncome: number;
  totalExpense: number;
}

export default function SummaryCard({
  cashbox,
  balance,
  transactionsCount,
  totalIncome,
  totalExpense,
}: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const positive = balance >= 0;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Balance actual</Text>

      <Text style={styles.balance}>${balance.toLocaleString()}</Text>

      <View
        style={[
          styles.statusCard,
          { backgroundColor: positive ? theme.success : theme.error },
        ]}
      >
        <Text style={[styles.status]}>
          {positive ? "Balance positivo" : "Balance negativo"}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Caja</Text>
          <Text style={styles.value}>{cashbox.name}</Text>
        </View>

        <View>
          <Text style={styles.label}>Movimientos</Text>
          <Text style={[styles.value, { textAlign: "right" }]}>
            {transactionsCount}
          </Text>
        </View>
      </View>

      <View style={[styles.row, { marginTop: 24 }]}>
        <View style={[styles.pill, styles.pillIncome]}>
          <Text style={styles.pillLabelIncome}>Ingresos ▲</Text>
          <Text style={styles.pillValueIncome}>
            ${totalIncome.toLocaleString()}
          </Text>
        </View>

        <View style={[styles.pill, styles.pillExpense]}>
          <Text style={styles.pillLabelExpense}>Gastos ▼</Text>
          <Text style={styles.pillValueExpense}>
            ${totalExpense.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: 28,
      padding: 24,
      marginBottom: 24,
    },
    label: {
      color: theme.textSecondary,
      fontSize: 14,
      marginBottom: 10,
    },
    balance: {
      color: theme.textSecondary,
      fontSize: 38,
      fontWeight: "800",
      marginBottom: 5,
    },
    statusCard: {
      alignSelf: "flex-start",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    status: {
      color: theme.textInverse,
      fontWeight: "700",
      marginTop: 0,
    },
    divider: {
      height: 1,
      backgroundColor: "rgba(255,255,255,0.1)",
      marginVertical: 10,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    value: {
      color: theme.text,
      fontWeight: "600",
    },
    pill: {
      flex: 1,
      padding: 16,
      borderRadius: 18,
    },
    pillIncome: {
      backgroundColor: theme.primaryBright,
      marginRight: 8,
    },
    pillExpense: {
      backgroundColor: theme.primary,
      marginLeft: 8,
    },
    // Tints fijos: pensados para leerse bien sobre la tarjeta oscura de arriba,
    // no cambian con el tema (a diferencia de theme.success/theme.error).
    pillLabelIncome: {
      color: theme.textSecondary,
      marginBottom: 6,
      fontWeight: "700",
    },
    pillLabelExpense: {
      color: theme.textInverse,
      marginBottom: 6,
    },
    pillValueIncome: {
      color: theme.textSecondary,
      fontWeight: "800",
      fontSize: 18,
    },
    pillValueExpense: {
      color: theme.textInverse,
      fontWeight: "800",
      fontSize: 18,
    },
  });