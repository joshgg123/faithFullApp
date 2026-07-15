import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { Transaction } from "@/types/tesoros/transaction";
import { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  transactions: Transaction[];
  onPress?: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onPress }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <FlatList
      data={transactions}
      scrollEnabled={false}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        const isIncome = item.type === "income";

        return (
          <TouchableOpacity activeOpacity={0.8} onPress={() => onPress?.(item)}>
            <View
              style={[
                styles.card,
                isIncome ? styles.cardIncome : styles.cardExpense,
              ]}
            >
              <View style={styles.row}>
                <Text
                  style={[
                    styles.description,
                    isIncome
                      ? { color: theme.textSecondary }
                      : { color: theme.textInverse },
                  ]}
                >
                  {item.description}
                </Text>

                <Text
                  style={[
                    styles.amount,
                    isIncome
                      ? { color: theme.textSecondary }
                      : { color: theme.textInverse },
                  ]}
                >
                  {isIncome ? "+" : "-"}${item.amount.toLocaleString()}
                </Text>
              </View>

              <Text
                style={[
                  styles.category,
                  isIncome
                    ? { color: theme.textSecondary }
                    : { color: theme.textInverse },
                ]}
              >
                {item.category}
              </Text>
              <Text
                style={[
                  styles.date,
                  isIncome
                    ? { color: theme.textSecondary }
                    : { color: theme.textInverse },
                ]}
              >
                {item.createdAt}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={() => (
        <View style={styles.emptyWrapper}>
          <Text style={styles.empty}>No hay movimientos</Text>
        </View>
      )}
    />
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardIncome: {
      backgroundColor: theme.primaryBright,
    },
    cardExpense: {
      backgroundColor: theme.primary,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    description: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    amount: {
      fontWeight: "700",
    },
    category: {
      color: theme.textSecondary,
      marginTop: 4,
    },
    date: {
      color: theme.textSecondary,
      marginTop: 2,
    },
    emptyWrapper: {
      paddingVertical: 40,
    },
    empty: {
      textAlign: "center",
      color: theme.textSecondary,
    },
  });