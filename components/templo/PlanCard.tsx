import { AppText as Text } from "@/components/ui/AppText";
import { Intento, PlanCategory } from "@/types/templo/salud";
import React, { useMemo } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useAchievementCheck } from "@/hooks/useAchievementCheck"; // 🏆 Importamos el hook genérico de logros

/* ==========================================
   Imágenes por categoría — al azar por intento
========================================== */
const CATEGORY_IMAGES: Record<PlanCategory, any[]> = {
  espiritualidad: [
    require("@/assets/templo/biblia.png"),
    require("@/assets/templo/pergamino.png"),
    require("@/assets/templo/cordero.png"),
    require("@/assets/templo/lampara.png"),
    require("@/assets/templo/corona.png"),
    require("@/assets/templo/escudo.png"),
    require("@/assets/templo/manos.png"),
  ],
  ejercicio: [
    require("@/assets/templo/correr.png"),
    require("@/assets/templo/biceps.png"),
    require("@/assets/templo/plancha.png"),
    require("@/assets/templo/guerrero.png"),
    require("@/assets/templo/levant.png"),
    require("@/assets/templo/sprint.png"),
    require("@/assets/templo/yoga.png"),
  ],
  alimentacion: [
    require("@/assets/templo/ensalada.png"),
    require("@/assets/templo/jarra.png"),
    require("@/assets/templo/frutos.png"),
    require("@/assets/templo/pan.png"),
    require("@/assets/templo/peces.png"),
    require("@/assets/templo/sopa.png"),
    require("@/assets/templo/datiles.png"),
  ],
};

function getImage(category: PlanCategory, seedId: string): any {
  const images = CATEGORY_IMAGES[category];
  const hash = seedId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return images[hash % images.length];
}

const CATEGORY_CONFIG: Record<
  PlanCategory,
  { color: string; bg: string; label: string }
> = {
  ejercicio:      { color: "#E8611A", bg: "#FFF4EE", label: "Ejercicio"      },
  alimentacion:   { color: "#2E8B57", bg: "#EEF8F2", label: "Alimentación"   },
  espiritualidad: { color: "#6B4FBB", bg: "#F3EEFF", label: "Espiritualidad" },
};

function FireDifficulty({ level }: { level: number }) {
  return (
    <View style={styles.fireRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 11, opacity: i <= level ? 1 : 0.15 }}>
          🔥
        </Text>
      ))}
    </View>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${value}%` as any, backgroundColor: color }]} />
    </View>
  );
}

interface PlanCardProps {
  intento: Intento;
  onPress: (intento: Intento) => void;
}

export function PlanCard({ intento, onPress }: PlanCardProps) {
  const cfg = CATEGORY_CONFIG[intento.category];
  const image = useMemo(
    () => getImage(intento.category, intento.id),
    [intento.category, intento.id],
  );

  // 🔥 Inicializamos nuestro motor verificador de logros
  const { checkAchievements } = useAchievementCheck();

  const handleCardPress = async () => {
    // 1. Ejecuta la navegación o acción original provista por el padre
    onPress(intento);

    try {
      // 2. 🔥 Dispara de fondo el validador de metas diarias / primer día
      // El hook comprobará en Firestore si sumaste un progreso y lanzará el banner global si corresponde
      await checkAchievements("tasks_completed");
    } catch (error) {
      console.error("Error al verificar logros desde la tarjeta de plan:", error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleCardPress} // Redireccionamos el click al handler modificado
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <View style={[styles.thumbnailWrapper, { backgroundColor: cfg.bg }]}>
        <Image source={image} style={styles.thumbnail} resizeMode="contain" />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.categoryLabel, { color: cfg.color }]}>
            {cfg.label.toUpperCase()}
          </Text>
          <FireDifficulty level={intento.difficulty} />
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {intento.title}
        </Text>

        <Text style={styles.daysText}>
          {intento.currentDay}/{intento.durationDays} días
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Actual</Text>
            <ProgressBar value={intento.progress} color={cfg.color} />
            <Text style={[styles.progressValue, { color: cfg.color }]}>
              {intento.progress}%
            </Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Mejor</Text>
            <ProgressBar value={intento.bestScore} color="#D0D0D0" />
            <Text style={styles.progressValue}>{intento.bestScore}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  thumbnailWrapper: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  thumbnail: {
    width: 52,
    height: 52,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 14,
    paddingLeft: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  fireRow: { flexDirection: "row", gap: 1 },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  daysText: {
    fontSize: 11,
    color: "#AAA",
    marginBottom: 8,
  },
  progressSection: { gap: 4 },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressLabel: {
    fontSize: 10,
    color: "#CCC",
    width: 32,
  },
  progressBg: {
    flex: 1,
    height: 4,
    backgroundColor: "#F2F2F2",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressValue: {
    fontSize: 10,
    color: "#CCC",
    width: 28,
    textAlign: "right",
  },
});