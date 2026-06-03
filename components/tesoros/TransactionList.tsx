import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Transaction } from "@/types/tesoros/transaction";

interface Props {
  transactions: Transaction[];

  onPress?: (
    transaction: Transaction,
  ) => void;
}

export default function TransactionList({
  transactions,
  onPress,
}: Props) {
  return (
    <FlatList
      data={transactions}
      scrollEnabled={false}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        const isIncome =
          item.type === "income";

        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              onPress?.(item)
            }
          >
            <View
              style={{
                backgroundColor: "#FFF",

                padding: 16,

                borderRadius: 16,

                marginBottom: 12,

                borderWidth: 1,

                borderColor: "#E5E7EB",
              }}
            >
              <View
                style={{
                  flexDirection: "row",

                  justifyContent:
                    "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,

                    fontWeight: "600",
                  }}
                >
                  {item.description}
                </Text>

                <Text
                  style={{
                    fontWeight: "700",

                    color: isIncome
                      ? "#22C55E"
                      : "#EF4444",
                  }}
                >
                  {isIncome ? "+" : "-"}$
                  {item.amount.toLocaleString()}
                </Text>
              </View>

              <Text
                style={{
                  color: "#6B7280",

                  marginTop: 4,
                }}
              >
                {item.category}
              </Text>

              <Text
                style={{
                  color: "#9CA3AF",

                  marginTop: 2,
                }}
              >
                {item.createdAt}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={() => (
        <View
          style={{
            paddingVertical: 40,
          }}
        >
          <Text
            style={{
              textAlign: "center",

              color: "#6B7280",
            }}
          >
            No hay movimientos
          </Text>
        </View>
      )}
    />
  );
}