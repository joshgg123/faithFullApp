import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { PlanCard } from "@/components/templo/PlanCard";
import { PlanDetailModal } from "@/components/templo/PlanDetailmodal";

import { Intento, PlanCategory, PlanTemplate } from "@/types/templo/salud";

import {
  getActiveIntentos,
  getIntentosByCategory,
  getPlanTemplates,
  getIntentoByTemplateId,
  startIntento,
  restartIntento,
} from "@/services/temploServices/SaludServices";

type FilterCategory = "en_curso" | PlanCategory;

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: "en_curso",       label: "En Curso" },
  { key: "ejercicio",      label: "Ejercicio" },
  { key: "alimentacion",   label: "Alimentación" },
  { key: "espiritualidad", label: "Espiritualidad" },
];

const CATEGORY_CONFIG: Record<
  PlanCategory,
  { color: string; bg: string; label: string; icon: string }
> = {
  ejercicio:      { color: "#E8611A", bg: "#FFF1EA", label: "Ejercicio",      icon: "⚡" },
  alimentacion:   { color: "#2E8B57", bg: "#EAF7EF", label: "Alimentación",   icon: "🌿" },
  espiritualidad: { color: "#6B4FBB", bg: "#F0ECFF", label: "Espiritualidad", icon: "✦" },
};

function TemplateCard({
  template,
  onPress,
}: {
  template: PlanTemplate;
  onPress: (t: PlanTemplate) => void;
}) {
  const cfg = CATEGORY_CONFIG[template.category];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(template)}
      activeOpacity={0.85}
    >
      <View style={[styles.thumbnail, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.thumbnailIcon, { color: cfg.color }]}>{cfg.icon}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.badgeText, { color: cfg.color }]}>
              {cfg.label.toUpperCase()}
            </Text>
          </View>
          <View style={styles.fireRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Text key={i} style={{ fontSize: 11, opacity: i <= template.difficulty ? 1 : 0.2 }}>
                🔥
              </Text>
            ))}
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {template.title}
        </Text>

        <Text style={styles.cardMeta}>{template.durationDays} días</Text>

        <View style={[styles.startBadge, { borderColor: cfg.color }]}>
          <Text style={[styles.startBadgeText, { color: cfg.color }]}>Iniciar →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SaludScreen() {
  const router = useRouter();

  const [filter, setFilter] = useState<FilterCategory>("en_curso");
  const [intentos, setIntentos] = useState<Intento[]>([]);
  const [templates, setTemplates] = useState<PlanTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedIntento, setSelectedIntento] = useState<Intento | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PlanTemplate | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      if (filter === "en_curso") {
        const data = await getActiveIntentos();
        setIntentos(data);
        setTemplates([]);
      } else {
        const [intentosData, templatesData] = await Promise.all([
          getIntentosByCategory(filter),
          getPlanTemplates(),
        ]);
        setIntentos(intentosData);
        setTemplates(templatesData.filter((t) => t.category === filter));
      }
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const templatesWithoutIntento = templates.filter(
    (t) => !intentos.some((i) => i.templateId === t.id),
  );

  const handleCardPress = (intento: Intento) => {
    const matchingTemplate = templates.find((t) => t.id === intento.templateId) ?? null;
    setSelectedIntento(intento);
    setSelectedTemplate(matchingTemplate);
  };

  const handleTemplatePress = (template: PlanTemplate) => {
    setSelectedTemplate(template);
    setSelectedIntento(null);
  };

  const handleStart = async (template: PlanTemplate) => {
    setSelectedIntento(null);
    setSelectedTemplate(null);

    const existing = await getIntentoByTemplateId(template.id);
    const intentoId = existing ? existing.id : await startIntento(template);

    router.push(`/salud/intento/${intentoId}`as any);
  };

  const handleRestart = async (intento: Intento) => {
    setSelectedIntento(null);
    setSelectedTemplate(null);
    await restartIntento(intento.id);
    router.push(`/salud/intento/${intento.id}` as any);
  };

  const closeModal = () => {
    setSelectedIntento(null);
    setSelectedTemplate(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salud</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={styles.loadingText}>Cargando...</Text>
        ) : (
          <>
            {intentos.length === 0 && templatesWithoutIntento.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🌱</Text>
                <Text style={styles.emptyTitle}>Sin planes acá todavía</Text>
                <Text style={styles.emptyText}>Probá otra categoría.</Text>
              </View>
            )}

            {intentos.map((intento) => (
              <PlanCard key={intento.id} intento={intento} onPress={handleCardPress} />
            ))}

            {filter !== "en_curso" &&
              templatesWithoutIntento.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPress={handleTemplatePress}
                />
              ))}
          </>
        )}
      </ScrollView>

      <PlanDetailModal
        intento={selectedIntento}
        template={selectedTemplate}
        onClose={closeModal}
        onStart={handleStart}
        onRestart={handleRestart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#1A1A2E" },
  filterScroll: { flexGrow: 0, marginBottom: 12 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#EFEFEF",
  },
  filterTabActive: { backgroundColor: "#1A1A2E" },
  filterText: { fontSize: 13, color: "#888", fontWeight: "600" },
  filterTextActive: { color: "#FFF" },
  list: { flex: 1 },
  listContent: { paddingBottom: 24, paddingTop: 4 },
  loadingText: { textAlign: "center", marginTop: 40, color: "#AAA" },
  empty: { alignItems: "center", marginTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A2E", marginBottom: 6 },
  emptyText: { fontSize: 14, color: "#AAA", textAlign: "center" },
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
  thumbnail: { width: 80, alignItems: "center", justifyContent: "center" },
  thumbnailIcon: { fontSize: 32 },
  cardContent: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 14,
    paddingLeft: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  fireRow: { flexDirection: "row", gap: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A2E", marginBottom: 2 },
  cardMeta: { fontSize: 11, color: "#888", marginBottom: 8 },
  startBadge: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  startBadgeText: { fontSize: 11, fontWeight: "700" },
});