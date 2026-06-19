import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Intento, PlanCategory } from "@/types/templo/salud";

const CATEGORY_CONFIG: Record<
  PlanCategory,
  { color: string; bg: string; label: string; icon: string }
> = {
  ejercicio: { color: "#E8611A", bg: "#FFF1EA", label: "Ejercicio", icon: "⚡" },
  alimentacion: { color: "#2E8B57", bg: "#EAF7EF", label: "Alimentación", icon: "🌿" },
  espiritualidad: { color: "#6B4FBB", bg: "#F0ECFF", label: "Espiritualidad", icon: "✦" },
};

function FireDifficulty({ level }: { level: number }) {
  return (
    <View style={styles.fireRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={[styles.fire, { opacity: i <= level ? 1 : 0.2 }]}>
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

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(intento)} activeOpacity={0.85}>
      <View style={[styles.thumbnail, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.thumbnailIcon, { color: cfg.color }]}>{cfg.icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label.toUpperCase()}</Text>
          </View>
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
            <Text style={[styles.progressValue, { color: cfg.color }]}>{intento.progress}%</Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Mejor</Text>
            <ProgressBar value={intento.bestScore} color="#C5C5C5" />
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  thumbnail: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnailIcon: {
    fontSize: 32,
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
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  fireRow: {
    flexDirection: "row",
    gap: 1,
  },
  fire: {
    fontSize: 11,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  daysText: {
    fontSize: 11,
    color: "#888",
    marginBottom: 8,
  },
  progressSection: {
    gap: 4,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressLabel: {
    fontSize: 10,
    color: "#AAA",
    width: 32,
  },
  progressBg: {
    flex: 1,
    height: 5,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressValue: {
    fontSize: 10,
    color: "#AAA",
    width: 28,
    textAlign: "right",
  },
});