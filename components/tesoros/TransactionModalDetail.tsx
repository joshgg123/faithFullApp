import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { Transaction } from "@/types/tesoros/transaction";
import { useMemo } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

function DetailRow({ label, value, theme }: { label: string; value: string; theme: Theme }) {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function TransactionDetailModal({
  visible,
  transaction,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!transaction) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Movimiento</Text>

          <DetailRow
            label="Descripción"
            value={transaction.description}
            theme={theme}
          />

          <DetailRow
            label="Categoría"
            value={transaction.category}
            theme={theme}
          />

          <DetailRow
            label="Tipo"
            value={transaction.type === "income" ? "Ingreso" : "Gasto"}
            theme={theme}
          />

          <DetailRow
            label="Monto"
            value={`$${transaction.amount.toLocaleString()}`}
            theme={theme}
          />

          <DetailRow label="Estado" value={transaction.status} theme={theme} />

          <DetailRow
            label="Fecha"
            value={transaction.createdAt}
            theme={theme}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      padding: 20,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 24,
      color: theme.text,
    },
    row: {
      marginBottom: 16,
    },
    rowLabel: {
      color: theme.textSecondary,
      marginBottom: 4,
    },
    rowValue: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
    },
    closeButton: {
      backgroundColor: theme.surfaceAlt,
      padding: 16,
      borderRadius: 16,
      marginTop: 12,
    },
    closeText: {
      color: theme.text,
      textAlign: "center",
      fontWeight: "600",
    },
  });