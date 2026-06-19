import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { TaskScreen } from "@/components/templo/TaskScreen";
import { Intento, PlanDay } from "@/types/templo/salud";
import { getIntento, getPlanDay } from "@/services/temploServices/SaludServices";

export default function IntentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [intento, setIntento] = useState<Intento | null>(null);
  const [planDay, setPlanDay] = useState<PlanDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const intentoData = await getIntento(id);
      if (!intentoData) {
        setError("Plan no encontrado.");
        return;
      }

      const dayData = await getPlanDay(intentoData.templateId, intentoData.currentDay);
      if (!dayData) {
        setError(`No hay tareas para el día ${intentoData.currentDay}.`);
        return;
      }

      setIntento(intentoData);
      setPlanDay(dayData);
    } catch (e) {
      setError("Error al cargar el plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1A1A2E" />
      </View>
    );
  }

  if (error || !intento || !planDay) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? "Error inesperado."}</Text>
      </View>
    );
  }

  return (
    <TaskScreen
      intentoId={intento.id}
      planTitle={intento.title}
      planDay={intento.currentDay}
      category={intento.category}
      planDayData={planDay}
      onDayFinished={() => {
        // recargamos el intento (puede haber terminado o avanzado de día)
        // y volvemos a la tab de salud
        router.back();
      }}
      onBack={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
  },
  errorText: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});