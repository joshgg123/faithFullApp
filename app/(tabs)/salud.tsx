import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
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

/* ==========================================
   Mismo mapa de imágenes que PlanCard
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

const CATEGORY_CONFIG: Record<PlanCategory, { color: string; bg: string; label: string }> = {
  ejercicio:      { color: "#E8611A", bg: "#FFF4EE", label: "Ejercicio"      },
  alimentacion:   { color: "#2E8B57", bg: "#EEF8F2", label: "Alimentación"   },
  espiritualidad: { color: "#6B4FBB", bg: "#F3EEFF", label: "Espiritualidad" },
};

type FilterCategory = "en_curso" | PlanCategory;

const FILTERS: { key: FilterCategory; label: string }[] = [
  { key: "en_curso",       label: "En Curso"      },
  { key: "ejercicio",      label: "Ejercicio"      },
  { key: "alimentacion",   label: "Alimentación"   },
  { key: "espiritualidad", label: "Espiritualidad" },
];

/* ==========================================
   TemplateCard — mismo estilo que PlanCard
   pero sin barras de progreso, con "Iniciar →"
========================================== */
function TemplateCard({
  template,
  onPress,
}: {
  template: PlanTemplate;
  onPress: (t: PlanTemplate) => void;
}) {
  const cfg = CATEGORY_CONFIG[template.category];
  const image = useMemo(
    () => getImage(template.category, template.id),
    [template.category, template.id],
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(template)}
      activeOpacity={0.8}
    >
      {/* Thumbnail — misma área que PlanCard */}
      <View style={[styles.thumbnailWrapper, { backgroundColor: cfg.bg }]}>
        <Image source={image} style={styles.thumbnail} resizeMode="contain" />
      </View>

      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.categoryLabel, { color: cfg.color }]}>
            {cfg.label.toUpperCase()}
          </Text>
          <View style={styles.fireRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Text key={i} style={{ fontSize: 11, opacity: i <= template.difficulty ? 1 : 0.15 }}>
                🔥
              </Text>
            ))}
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {template.title}
        </Text>

        <Text style={styles.cardMeta}>{template.durationDays} días</Text>

        {/* Pill de acción */}
        <View style={[styles.startPill, { borderColor: cfg.color + "88", backgroundColor: cfg.bg }]}>
          <Text style={[styles.startPillText, { color: cfg.color }]}>Iniciar →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ==========================================
   Screen
========================================== */
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
    router.push(`/salud/intento/${intentoId}` as any);
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

      {/* Filtros */}
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

      {/* Lista */}
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
                <TemplateCard key={template.id} template={template} onPress={handleTemplatePress} />
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

/* ==========================================
   Styles
========================================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
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

  /* TemplateCard — misma base que PlanCard */
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
  thumbnail: { width: 52, height: 52 },
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
    marginBottom: 3,
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },
  fireRow: { flexDirection: "row", gap: 1 },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A2E", marginBottom: 2 },
  cardMeta: { fontSize: 11, color: "#AAA", marginBottom: 8 },
  startPill: {
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  startPillText: { fontSize: 11, fontWeight: "700" },
});