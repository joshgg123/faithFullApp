import { Text, View } from "react-native";

import { Cashbox } from "@/types/tesoros/cashbox";

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
  const positive =
    balance >= 0;

  return (
    <View
      style={{
        backgroundColor: "#111827",

        borderRadius: 28,

        padding: 24,

        marginBottom: 24,
      }}
    >
      <Text
        style={{
          color: "#9CA3AF",

          fontSize: 14,

          marginBottom: 12,
        }}
      >
        Balance actual
      </Text>

      <Text
        style={{
          color: "#FFF",

          fontSize: 38,

          fontWeight: "700",
        }}
      >
        $
        {balance.toLocaleString()}
      </Text>

      <Text
        style={{
          color: positive
            ? "#22C55E"
            : "#EF4444",

          marginTop: 6,
        }}
      >
        {positive
          ? "Balance positivo"
          : "Balance negativo"}
      </Text>

      <View
        style={{
          height: 1,

          backgroundColor:
            "rgba(255,255,255,0.1)",

          marginVertical: 20,
        }}
      />

      <View
        style={{
          flexDirection: "row",

          justifyContent:
            "space-between",
        }}
      >
        <View>
          <Text
            style={{
              color: "#9CA3AF",

              marginBottom: 4,
            }}
          >
            Caja
          </Text>

          <Text
            style={{
              color: "#FFF",

              fontWeight: "600",
            }}
          >
            {cashbox.name}
          </Text>
        </View>

        <View>
          <Text
            style={{
              color: "#9CA3AF",

              marginBottom: 4,
            }}
          >
            Movimientos
          </Text>

          <Text
            style={{
              color: "#FFF",

              fontWeight: "600",

              textAlign: "right",
            }}
          >
            {transactionsCount}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",

          justifyContent:
            "space-between",

          marginTop: 24,
        }}
      >
        <View
          style={{
            flex: 1,

            backgroundColor:
              "rgba(34,197,94,0.15)",

            padding: 16,

            borderRadius: 18,

            marginRight: 8,
          }}
        >
          <Text
            style={{
              color: "#86EFAC",

              marginBottom: 6,
            }}
          >
            Ingresos
          </Text>

          <Text
            style={{
              color: "#FFF",

              fontWeight: "700",

              fontSize: 18,
            }}
          >
            $
            {totalIncome.toLocaleString()}
          </Text>
        </View>

        <View
          style={{
            flex: 1,

            backgroundColor:
              "rgba(239,68,68,0.15)",

            padding: 16,

            borderRadius: 18,

            marginLeft: 8,
          }}
        >
          <Text
            style={{
              color: "#FCA5A5",

              marginBottom: 6,
            }}
          >
            Gastos
          </Text>

          <Text
            style={{
              color: "#FFF",

              fontWeight: "700",

              fontSize: 18,
            }}
          >
            $
            {totalExpense.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}