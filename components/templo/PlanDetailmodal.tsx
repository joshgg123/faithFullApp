import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";

import { PlanCategory, PlanTemplate, Intento } from "@/types/templo/salud";

const { height } = Dimensions.get("window");

const CATEGORY_CONFIG: Record<
  PlanCategory,
  { color: string; bg: string; label: string; icon: string }
> = {
  ejercicio:      { color: "#E8611A", bg: "#FFF1EA", label: "Ejercicio",      icon: "⚡" },
  alimentacion:   { color: "#2E8B57", bg: "#EAF7EF", label: "Alimentación",   icon: "🌿" },
  espiritualidad: { color: "#6B4FBB", bg: "#F0ECFF", label: "Espiritualidad", icon: "✦" },
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

  /*
   * Cuando se abre desde una PlanCard, template puede llegar null
   * porque en "En Curso" no cargamos templates. En ese caso
   * reconstruimos el objeto mínimo desde el intento — tiene
   * todos los campos necesarios para llamar a startIntento/onStart.
   */
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

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.hero, { backgroundColor: cfg.bg }]}>
              <Text style={styles.heroIcon}>{cfg.icon}</Text>
              <View style={[styles.heroBadge, { backgroundColor: cfg.color }]}>
                <Text style={styles.heroBadgeText}>{cfg.label.toUpperCase()}</Text>
              </View>
              <Text style={styles.heroTitle}>{data.title}</Text>
              <View style={styles.fireRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Text key={i} style={{ fontSize: 18, opacity: i <= data.difficulty ? 1 : 0.2 }}>
                    🔥
                  </Text>
                ))}
              </View>
            </View>

            {resolvedTemplate.description ? (
              <View style={styles.section}>
                <Text style={styles.description}>{resolvedTemplate.description}</Text>
              </View>
            ) : null}

            <View style={styles.statsRow}>
              <StatChip label="días" value={data.durationDays} />
              {hasIntento && <StatChip label="progreso" value={`${intento!.progress}%`} />}
              {hasIntento && <StatChip label="mejor" value={`${intento!.bestScore}%`} />}
            </View>

            {hasIntento && (
              <View style={styles.section}>
                <View style={styles.progressRecapRow}>
                  <View style={styles.progressRecapItem}>
                    <Text style={[styles.progressRecapValue, { color: cfg.color }]}>
                      {intento!.progress}%
                    </Text>
                    <Text style={styles.progressRecapLabel}>Progreso actual</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.progressRecapItem}>
                    <Text style={styles.progressRecapValue}>{intento!.bestScore}%</Text>
                    <Text style={styles.progressRecapLabel}>Mejor puntaje</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.progressRecapItem}>
                    <Text style={styles.progressRecapValue}>
                      {intento!.currentDay}/{intento!.durationDays}
                    </Text>
                    <Text style={styles.progressRecapLabel}>Días</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

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
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.88,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EBEBEB",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeText: { fontSize: 13, color: "#555", fontWeight: "600" },
  hero: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 4,
  },
  heroIcon: { fontSize: 48, marginBottom: 8 },
  heroBadge: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: 6, marginBottom: 10 },
  heroBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 8,
  },
  fireRow: { flexDirection: "row", gap: 4 },
  section: { marginHorizontal: 20, marginTop: 16 },
  description: { fontSize: 14, color: "#555", lineHeight: 22 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 20,
    flexWrap: "wrap",
  },
  statChip: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: "800", color: "#1A1A2E" },
  statLabel: { fontSize: 10, color: "#AAA", marginTop: 2 },
  progressRecapRow: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  progressRecapItem: { flex: 1, alignItems: "center" },
  progressRecapValue: { fontSize: 20, fontWeight: "800", color: "#1A1A2E" },
  progressRecapLabel: { fontSize: 10, color: "#AAA", textAlign: "center", marginTop: 3 },
  divider: { width: 1, backgroundColor: "#EEE", marginVertical: 4 },
  actions: { flexDirection: "row", gap: 12, paddingHorizontal: 20, paddingTop: 16 },
  btn: { flex: 1, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  btnPrimary: {},
  btnPrimaryText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  btnSecondary: { backgroundColor: "transparent", borderWidth: 2 },
  btnSecondaryText: { fontSize: 16, fontWeight: "700" },
});