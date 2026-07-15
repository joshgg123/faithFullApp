import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-chart-kit/v2";

import { Transaction } from "@/types/tesoros/transaction";

interface Props {
  transactions: Transaction[];
}

const screenWidth = Dimensions.get("window").width;

function formatDateLabel(value: string) {
  try {
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  } catch {
    return "";
  }
}

export default function BalanceEvolutionChart({ transactions }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  let currentBalance = 0;

  const confirmedTransactions = transactions.filter(
    (transaction) => transaction.status === "confirmed"
  );

  const sortedTransactions = [...confirmedTransactions].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const data = sortedTransactions.map((transaction) => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      currentBalance += amount;
    } else {
      currentBalance -= amount;
    }

    return {
      date: formatDateLabel(transaction.createdAt),
      balance: currentBalance,
    };
  });

  // Últimos 8 movimientos, mismo criterio que FinanceSummaryCard
  const visibleData = data.slice(-8);

  if (visibleData.length === 0) {
    visibleData.push({ date: "", balance: 0 });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Evolución del balance</Text>

      <BarChart
        data={visibleData}
        xKey="date"
        yKey="balance"
        width={screenWidth - 72}
        height={180}
        showValuesOnTopOfBars
        formatYLabel={(value) =>
         value < 0
           ? `-$${Math.abs(value).toLocaleString("es-AR")}`
           : `$${value.toLocaleString("es-AR")}`
       }
        theme={{
          background: "transparent",
          plotBackground: "transparent",
          grid: "rgba(255,255,255,0.12)",
          text: theme.primaryBright,
          series: [theme.primaryBright],
        }}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.primary,
      borderRadius: 28,
      padding: 20,
      marginBottom: 24,
      overflow: "hidden",
    },
    title: {
      color: theme.textInverse,
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 20,
    },
  });