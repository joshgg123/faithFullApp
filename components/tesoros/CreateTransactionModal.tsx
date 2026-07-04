import { useMemo } from "react";

import {
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import { AppText as Text } from "@/components/ui/AppText";

import DynamicForm from "@/components/general/DynamicForm";

import useTreasury from "@/contexts/TesoroContext";

import { Cashbox } from "@/types/tesoros/cashbox";

import { Field } from "@/types/general/field";

interface Props {
  visible: boolean;

  onClose: () => void;

  cashbox: Cashbox;
}

export default function CreateTransactionModal({
  visible,
  onClose,
  cashbox,
}: Props) {
  const {
    createTransaction,
  } = useTreasury();

  const fields: Field[] =
    useMemo(
      () => [
        {
          name: "description",

          label: "Descripción",

          type: "text",

          placeholder:
            "Ej: Compra de insumos",
        },

        {
  name: "amount",
  label: "Monto",
  type: "text",
  placeholder: "10000",

  keyboardType: "number-pad",

  numbersOnly: true,

  required: true,
},

        {
  name: "category",

  label: "Categoría",

  type: "select",

  placeholder: "Seleccionar categoría",

  required: true,

          options: [
            {
              label: "General",

              value: "general",
            },

            {
              label: "Servicios",

              value: "services",
            },

            {
              label: "Compras",

              value: "shopping",
            },

            {
              label: "Eventos",

              value: "events",
            },
          ],
        },

        {
  name:"type",

  label:"Tipo",

  type:"segmented",

  required:true,

  options:[
      {
        label:"Ingreso",
        value:"income"
      },
      {
        label:"Gasto",
        value:"expense"
      }
  ]
},

        {
          name: "isScheduled",

          label:
            "Programar movimiento",

          type: "boolean",
        },

        {
    name:"scheduledFor",

    label:"Fecha programada",

    type:"date",

    visibleWhen:{
        field:"isScheduled",
        equals:true
    }
},
      ],
      [],
    );

  async function handleSubmit(
    values: Record<string, any>,
  ) {
    try {
      const amount =
        parseFloat(
          values.amount || "0",
        );

      const isScheduled =
        values.isScheduled ||
        false;

      const now =
        new Date().toISOString();

      await createTransaction({
        cashboxId:
          cashbox.id,

        description:
          values.description || "",

        amount,

        category:
          values.category ||
          "general",

        type:
          values.type ||
          "expense",

        status: isScheduled
          ? "pending"
          : "confirmed",

        createdAt: now,

        scheduledFor:
          isScheduled &&
          values.scheduledFor
            ? values.scheduledFor instanceof
              Date
              ? values.scheduledFor.toISOString()
              : values.scheduledFor
            : null,
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View
        style={{
          flex: 1,

          backgroundColor:
            "rgba(0,0,0,0.4)",

          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "#FFF",

            borderTopLeftRadius: 28,

            borderTopRightRadius: 28,

            maxHeight: "90%",
          }}
        >
          <View
            style={{
              flexDirection: "row",

              justifyContent:
                "space-between",

              alignItems: "center",

              padding: 24,

              paddingBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 24,

                fontWeight: "700",
              }}
            >
              Nuevo movimiento
            </Text>

            <TouchableOpacity
              onPress={onClose}
            >
              <Text
                style={{
                  fontSize: 28,

                  color: "#6B7280",
                }}
              >
                ×
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              padding: 24,

              paddingTop: 0,

              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={
              false
            }
          >
            <DynamicForm
              fields={fields}
              onSubmit={handleSubmit}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}