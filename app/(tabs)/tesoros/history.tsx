import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { getCashboxes } from "@/services/tesorosServices/tesoros";

import { Cashbox } from "@/types/tesoros/cashbox";

export default function CashboxesHistoryScreen() {
  const [loading, setLoading] =
    useState(true);

  const [cashboxes, setCashboxes] =
    useState<Cashbox[]>([]);

  async function loadCashboxes() {
    try {
      setLoading(true);

      const data =
        await getCashboxes();

      const sorted = data.sort(
        (a, b) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      );

      setCashboxes(sorted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCashboxes();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,

          justifyContent: "center",

          alignItems: "center",

          backgroundColor:
            "#1F2937",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,

        backgroundColor:
          "#1F2937",
      }}
      contentContainerStyle={{
        padding: 16,

        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",

          alignItems: "center",

          gap: 16,

          marginBottom: 24,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={{
              color: "#FFF",

              fontSize: 22,
            }}
          >
            ←
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 30,

            fontWeight: "700",

            color: "#FFF",
          }}
        >
          Historial
        </Text>
      </View>

      {cashboxes.map((cashbox) => {
        const isOpen =
          cashbox.status === "open";

        return (
          <TouchableOpacity
            key={cashbox.id}
            onPress={() =>
              router.push({
  pathname:
    "/(tabs)/tesoros/[cashboxId]",

  params: {
    cashboxId: cashbox.id,
  },
})
            }
            style={{
              backgroundColor:
                "#111827",

              borderRadius: 24,

              padding: 20,

              marginBottom: 16,
            }}
          >
            <Text
              style={{
                color: "#FFF",

                fontSize: 20,

                fontWeight: "700",

                marginBottom: 8,
              }}
            >
              {cashbox.name}
            </Text>

            <View
              style={{
                alignSelf:
                  "flex-start",

                backgroundColor:
                  isOpen
                    ? "#166534"
                    : "#374151",

                paddingHorizontal: 12,

                paddingVertical: 6,

                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  color: "#FFF",

                  fontWeight: "600",

                  fontSize: 12,
                }}
              >
                {isOpen
                  ? "ACTIVA"
                  : "CERRADA"}
              </Text>
            </View>

            <Text
              style={{
                color: "#9CA3AF",

                marginTop: 18,
              }}
            >
              Balance final
            </Text>

            <Text
              style={{
                color: "#FFF",

                fontSize: 28,

                fontWeight: "700",
              }}
            >
              $
              {(
                cashbox.finalBalance ??
                0
              ).toFixed(2)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}