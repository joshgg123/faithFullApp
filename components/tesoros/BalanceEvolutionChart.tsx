import { AppText as Text } from "@/components/ui/AppText";
import {
  Dimensions,
  View,
} from "react-native";
import {
  LineChart,
} from "react-native-gifted-charts";

import { Transaction } from "@/types/tesoros/transaction";

interface Props {
  transactions: Transaction[];
}

const screenWidth =
  Dimensions.get("window").width;

function formatDateLabel(
  value: any,
) {
  try {
    const date = new Date(value);

    const day = String(
      date.getDate(),
    ).padStart(2, "0");

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");

    return `${day}/${month}`;
  } catch {
    return "";
  }
}

export default function BalanceEvolutionChart({
  transactions,
}: Props) {
  let currentBalance = 0;

  /**
   * SOLO CONFIRMADAS
   */
  const confirmedTransactions =
    transactions.filter(
      (transaction) =>
        transaction.status ===
        "confirmed",
    );

  /**
   * ORDENAR
   */
  const sortedTransactions =
    [...confirmedTransactions].sort(
      (a, b) =>
        new Date(
          a.createdAt,
        ).getTime() -
        new Date(
          b.createdAt,
        ).getTime(),
    );

  /**
   * DATASET
   */
  const data =
    sortedTransactions.map(
      (transaction) => {
        const amount =
          Number(
            transaction.amount,
          ) || 0;

        if (
          transaction.type ===
          "income"
        ) {
          currentBalance +=
            amount;
        } else {
          currentBalance -=
            amount;
        }

        return {
          value: currentBalance,

          label:
            formatDateLabel(
              transaction.createdAt,
            ),
        };
      },
    );

  /**
   * EMPTY STATE
   */
  if (data.length === 0) {
    data.push({
      value: 0,

      label: "",
    });
  }

  return (
    <View
      style={{
        backgroundColor: "#111827",

        borderRadius: 28,

        padding: 20,

        marginBottom: 24,

        overflow: "hidden",
      }}
    >
      <Text
        style={{
          color: "#FFF",

          fontSize: 18,

          fontWeight: "600",

          marginBottom: 20,
        }}
      >
        Evolución del balance
      </Text>

      <LineChart
        areaChart
        curved
        data={data}
        height={20}
        width={screenWidth - 72}
        hideDataPoints
        hideYAxisText
        hideRules
        thickness={4}
        color="#22C55E"
        startFillColor="#22C55E"
        endFillColor="#22C55E"
        startOpacity={0.35}
        endOpacity={0.02}
        noOfSections={3}
        initialSpacing={10}
        endSpacing={10}
        spacing={45}
        yAxisColor="transparent"
        xAxisColor="rgba(255,255,255,0.1)"
        xAxisLabelTextStyle={{
          color: "#9CA3AF",

          fontSize: 10,
        }}
        backgroundColor="#111827"
      />
    </View>
  );
}