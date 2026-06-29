import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";

import { PlanCategory, PlanTemplate, Intento } from "@/types/templo/salud";

const { height } = Dimensions.get("window");

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
  ejercicio:      { color: "#E8611A", bg: "#1A0800", label: "Ejercicio"      },
  alimentacion:   { color: "#2E8B57", bg: "#00150A", label: "Alimentación"   },
  espiritualidad: { color: "#7C5CBF", bg: "#0D0818", label: "Espiritualidad" },
};

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface PlanDetailModalProps {
  template: PlanTemplate | null;
  intento: Intento | null;
  onClose: () => void;
  onStart: (template: PlanTemplate) => void;
  onRestart: (intento: Intento) => void;
}

export function PlanDetailModal({
  template,
  intento,
  onClose,
  onStart,
  onRestart,
}: PlanDetailModalProps) {
  const data = intento ?? template;
  if (!data) return null;

  const cfg = CATEGORY_CONFIG[data.category];
  const hasIntento = intento != null;
  const seedId = intento?.id ?? template?.id ?? "default";

  const image = useMemo(
    () => getImage(data.category, seedId),
    [data.category, seedId],
  );

  const resolvedTemplate: PlanTemplate =
    template ?? {
      id: intento!.templateId,
      title: intento!.title,
      category: intento!.category,
      difficulty: intento!.difficulty,
      durationDays: intento!.durationDays,
      description: "",
      createdAt: "",
    };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: cfg.bg }]}>
          <View style={styles.handle} />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero con imagen grande */}
            <View style={styles.hero}>
              <Image source={image} style={styles.heroImage} resizeMode="contain" />

              <View style={[styles.heroBadge, { backgroundColor: cfg.color + "33", borderColor: cfg.color + "66" }]}>
                <Text style={[styles.heroBadgeText, { color: cfg.color }]}>
                  {cfg.label.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.heroTitle}>{data.title}</Text>

              {/* Fueguitos */}
              <View style={styles.fireRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Text key={i} style={{ fontSize: 20, opacity: i <= data.difficulty ? 1 : 0.15 }}>
                    🔥
                  </Text>
                ))}
              </View>
            </View>

            {/* Descripción */}
            {resolvedTemplate.description ? (
              <View style={styles.section}>
                <Text style={styles.description}>{resolvedTemplate.description}</Text>
              </View>
            ) : null}

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatChip label="días" value={data.durationDays} />
              {hasIntento && <StatChip label="progreso" value={`${intento!.progress}%`} />}
              {hasIntento && <StatChip label="mejor" value={`${intento!.bestScore}%`} />}
            </View>

            {/* Progreso detallado */}
            {hasIntento && (
              <View style={styles.section}>
                <View style={[styles.progressRecapRow, { backgroundColor: cfg.color + "11", borderColor: cfg.color + "33" }]}>
                  <View style={styles.progressRecapItem}>
                    <Text style={[styles.progressRecapValue, { color: cfg.color }]}>
                      {intento!.progress}%
                    </Text>
                    <Text style={styles.progressRecapLabel}>Progreso actual</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.progressRecapItem}>
                    <Text style={[styles.progressRecapValue, { color: "#FFF" }]}>
                      {intento!.bestScore}%
                    </Text>
                    <Text style={styles.progressRecapLabel}>Mejor puntaje</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.progressRecapItem}>
                    <Text style={[styles.progressRecapValue, { color: "#FFF" }]}>
                      {intento!.currentDay}/{intento!.durationDays}
                    </Text>
                    <Text style={styles.progressRecapLabel}>Días</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={{ height: 24 }} />
          </ScrollView>

          {/* Botones */}
          <View style={styles.actions}>
            {hasIntento ? (
              <>
                <TouchableOpacity
                  style={[styles.btn, styles.btnPrimary, { backgroundColor: cfg.color }]}
                  onPress={() => onStart(resolvedTemplate)}
                >
                  <Text style={styles.btnPrimaryText}>Continuar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnSecondary, { borderColor: cfg.color }]}
                  onPress={() => onRestart(intento!)}
                >
                  <Text style={[styles.btnSecondaryText, { color: cfg.color }]}>Reiniciar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary, { backgroundColor: cfg.color, flex: 1 }]}
                onPress={() => onStart(resolvedTemplate)}
              >
                <Text style={styles.btnPrimaryText}>Iniciar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.7)" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: height * 0.88,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: "#333",
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  closeBtn: {
    position: "absolute", top: 16, right: 16,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#FFFFFF15",
    alignItems: "center", justifyContent: "center",
    zIndex: 10,
  },
  closeText: { fontSize: 13, color: "#AAA", fontWeight: "600" },
  hero: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  heroImage: {
    width: 130,
    height: 130,
    marginBottom: 16,
  },
  heroBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
  },
  fireRow: { flexDirection: "row", gap: 4 },
  section: { marginHorizontal: 20, marginTop: 12 },
  description: { fontSize: 14, color: "#888", lineHeight: 22 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 20,
    flexWrap: "wrap",
  },
  statChip: {
    backgroundColor: "#FFFFFF0A",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF15",
  },
  statValue: { fontSize: 18, fontWeight: "800", color: "#FFF" },
  statLabel: { fontSize: 10, color: "#666", marginTop: 2 },
  progressRecapRow: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  progressRecapItem: { flex: 1, alignItems: "center" },
  progressRecapValue: { fontSize: 20, fontWeight: "800" },
  progressRecapLabel: { fontSize: 10, color: "#555", textAlign: "center", marginTop: 3 },
  divider: { width: 1, backgroundColor: "#FFFFFF15", marginVertical: 4 },
  actions: { flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingTop: 16 },
  btn: { flex: 1, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  btnPrimary: {},
  btnPrimaryText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  btnSecondary: { backgroundColor: "transparent", borderWidth: 2 },
  btnSecondaryText: { fontSize: 16, fontWeight: "700" },
});