import { useMemo, useState } from "react";

import { AppText as Text } from "@/components/ui/AppText";
import { closeAndCreateCashbox } from "@/services/tesorosServices/tesoros";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { Cashbox } from "@/types/tesoros/cashbox";
import { reload } from "expo-router/build/global-state/routing";

interface Props {
  visible: boolean;
  cashbox: Cashbox;
  balance: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CloseCashboxModal({
  visible,
  cashbox,
  balance,
  onClose,
  onSuccess,
}: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [loading, setLoading] = useState(false);
  const [newCashboxName, setNewCashboxName] = useState("");

  async function handleCloseCashbox() {
    if (!newCashboxName.trim()) {
      return;
    }

    try {
      setLoading(true);

      await closeAndCreateCashbox(cashbox.id, newCashboxName);

      setNewCashboxName("");

      onSuccess();
      reload();

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Cerrar caja</Text>

          <Text style={styles.subtitle}>
            Balance final: ${balance.toFixed(2)}
          </Text>

          <TextInput
            placeholder="Nombre nueva caja"
            placeholderTextColor={theme.textSecondary}
            value={newCashboxName}
            onChangeText={setNewCashboxName}
            style={styles.input}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={loading}
              onPress={handleCloseCashbox}
              style={styles.confirmButton}
            >
              {loading ? (
                <ActivityIndicator color={theme.textInverse} />
              ) : (
                <Text style={styles.confirmText}>Cerrar y abrir</Text>
              )}
            </TouchableOpacity>
          </View>
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
      borderRadius: 28,
      padding: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 10,
      color: theme.text,
    },
    subtitle: {
      color: theme.textSecondary,
      marginBottom: 24,
    },
    input: {
      backgroundColor: theme.surfaceAlt,
      color: theme.text,
      borderRadius: 18,
      padding: 16,
      marginBottom: 24,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.border,
      padding: 16,
      borderRadius: 18,
      alignItems: "center",
    },
    cancelText: {
      fontWeight: "600",
      color: theme.text,
    },
    confirmButton: {
      flex: 1,
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 18,
      alignItems: "center",
    },
    confirmText: {
      color: theme.textInverse,
      fontWeight: "600",
    },
  });