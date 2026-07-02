import { useState } from "react";

import { AppText as Text } from "@/components/ui/AppText";
import {
  closeAndCreateCashbox,
} from "@/services/tesorosServices/tesoros";
import {
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [loading, setLoading] =
    useState(false);

  const [newCashboxName, setNewCashboxName] =
    useState("");

  async function handleCloseCashbox() {
    if (!newCashboxName.trim()) {
      return;
    }

    try {
      setLoading(true);

      await closeAndCreateCashbox(
        cashbox.id,
        newCashboxName,
      );

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

            borderRadius: 28,

            padding: 24,
          }}
        >
          {/* TITLE */}
          <Text
            style={{
              fontSize: 24,

              fontWeight: "700",

              marginBottom: 10,
            }}
          >
            Cerrar caja
          </Text>

          {/* SUBTITLE */}
          <Text
            style={{
              color: "#6B7280",

              marginBottom: 24,
            }}
          >
            Balance final:
            {" "}
            ${balance.toFixed(2)}
          </Text>

          {/* INPUT */}
          <TextInput
            placeholder="Nombre nueva caja"
            value={newCashboxName}
            onChangeText={
              setNewCashboxName
            }
            style={{
              backgroundColor:
                "#F3F4F6",

              borderRadius: 18,

              padding: 16,

              marginBottom: 24,
            }}
          />

          {/* ACTIONS */}
          <View
            style={{
              flexDirection: "row",

              gap: 12,
            }}
          >
            {/* CANCEL */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,

                backgroundColor:
                  "#E5E7EB",

                padding: 16,

                borderRadius: 18,

                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            {/* CONFIRM */}
            <TouchableOpacity
              disabled={loading}
              onPress={
                handleCloseCashbox
              }
              style={{
                flex: 1,

                backgroundColor:
                  "#ffff",

                padding: 16,

                borderRadius: 18,

                alignItems: "center",
              }}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text
                  style={{
                    color: "#000000",

                    fontWeight: "600",
                  }}
                >
                  Cerrar y abrir
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}