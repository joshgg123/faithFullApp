import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Transaction } from "@/types/tesoros/transaction";

interface Props {
  visible: boolean;

  transaction: Transaction | null;

  onClose: () => void;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View
      style={{
        marginBottom: 16,
      }}
    >
      <Text
        style={{
          color: "#6B7280",
          marginBottom: 4,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export default function TransactionDetailModal({
  visible,
  transaction,
  onClose,
}: Props) {
  if (!transaction) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          backgroundColor:
            "rgba(0,0,0,0.4)",

          justifyContent: "center",

          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFF",

            borderRadius: 24,

            padding: 24,
          }}
        >
          <Text
            style={{
              fontSize: 22,

              fontWeight: "700",

              marginBottom: 24,
            }}
          >
            Movimiento
          </Text>

          <DetailRow
            label="Descripción"
            value={
              transaction.description
            }
          />

          <DetailRow
            label="Categoría"
            value={transaction.category}
          />

          <DetailRow
            label="Tipo"
            value={
              transaction.type ===
              "income"
                ? "Ingreso"
                : "Gasto"
            }
          />

          <DetailRow
            label="Monto"
            value={`$${transaction.amount.toLocaleString()}`}
          />

          <DetailRow
            label="Estado"
            value={transaction.status}
          />

          <DetailRow
            label="Fecha"
            value={transaction.createdAt}
          />

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",

              padding: 16,

              borderRadius: 16,

              marginTop: 12,
            }}
            onPress={onClose}
          >
            <Text
              style={{
                color: "#000000",

                textAlign: "center",

                fontWeight: "600",
              }}
            >
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}