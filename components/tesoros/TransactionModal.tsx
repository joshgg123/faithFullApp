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

export default function TransactionModal({
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
      <View className="flex-1 bg-black/40 items-center justify-center p-6">
        <View className="bg-white rounded-2xl p-6 w-full">

          <Text className="text-xl font-bold mb-4">
            Movimiento
          </Text>

          <Text>
            Descripción:
          </Text>

          <Text className="mb-3">
            {transaction.description}
          </Text>

          <Text>
            Categoría:
          </Text>

          <Text className="mb-3">
            {transaction.category}
          </Text>

          <Text>
            Monto:
          </Text>

          <Text className="mb-3">
            ${transaction.amount}
          </Text>

          <Text>
            Estado:
          </Text>

          <Text className="mb-6">
            {transaction.status}
          </Text>

          <TouchableOpacity
            className="bg-black rounded-xl p-4"
            onPress={onClose}
          >
            <Text className="text-white text-center">
              Cerrar
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}