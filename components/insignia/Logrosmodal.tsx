// components/insignia/Logrosmodal.tsx
import React, { useState } from "react";
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  ScrollView, Dimensions,
} from "react-native";

import { UserLogro } from "@/types/insignia";
import { LogroItem, LogroImage } from "@/components/insignia/Logroitem";

const { height, width } = Dimensions.get("window");

/* ==========================================
    Vista detallada de un logro (Minimal)
========================================== */
function LogroDetail({ logro, onBack }: { logro: UserLogro; onBack: () => void }) {
  const color = logro.unlocked ? "#F5C518" : "#444";

  return (
    <View style={detail.container}>
      {/* Imagen grande */}
      <View style={[detail.imageWrapper, { borderColor: color }]}>
        <LogroImage logro={logro} size={100} />
      </View>

      {/* Título — oculto si no desbloqueado */}
      <Text style={detail.title}>
        {logro.unlocked ? logro.title : "???"}
      </Text>

      {/* Descripción */}
      <Text style={detail.description}>
        {logro.unlocked
          ? logro.description
          : "Seguí usando la app para descubrir este logro."}
      </Text>

      {/* Fecha */}
      {logro.unlocked && logro.unlockedAt && (
        <Text style={detail.date}>
          Desbloqueado el{" "}
          {new Date(logro.unlockedAt).toLocaleDateString("es-AR", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </Text>
      )}

      {/* Badge */}
      <View style={[detail.badge, { backgroundColor: logro.unlocked ? "#F5C51822" : "#1A1A1A", borderColor: color }]}>
        <Text style={[detail.badgeText, { color }]}>
          {logro.unlocked ? "✓ Desbloqueado" : "🔒 Bloqueado"}
        </Text>
      </View>

      <TouchableOpacity style={detail.backBtn} onPress={onBack}>
        <Text style={detail.backText}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const detail = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 28,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#1A1A1A",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#AAA",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  date: {
    fontSize: 12,
    color: "#F5C518",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#333",
  },
  backText: { color: "#AAA", fontSize: 14, fontWeight: "600" },
});

/* ==========================================
    Grid item con nombre debajo (Compacto)
========================================== */
function GridItem({ logro, onPress }: { logro: UserLogro; onPress: (l: UserLogro) => void }) {
  return (
    <TouchableOpacity
      style={grid.wrapper}
      onPress={() => onPress(logro)}
      activeOpacity={0.75}
    >
      <View style={{ opacity: logro.unlocked ? 1 : 0.4 }}>
        <LogroImage logro={logro} size={50} />
      </View>
      <Text style={[grid.name, { color: logro.unlocked ? "#FFF" : "#555" }]} numberOfLines={1}>
        {logro.unlocked ? logro.title : "???"}
      </Text>
    </TouchableOpacity>
  );
}

const grid = StyleSheet.create({
  wrapper: {
    width: (width * 0.85 - 40) / 3, // Grid de 3 columnas
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },
  name: {
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
  },
});

/* ==========================================
    LogrosModal (Rediseñado)
========================================== */
interface LogrosModalProps {
  visible: boolean;
  logros: UserLogro[];
  onClose: () => void;
}

export function LogrosModal({ visible, logros, onClose }: LogrosModalProps) {
  const [selected, setSelected] = useState<UserLogro | null>(null);

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  const unlockedCount = logros.filter((l) => l.unlocked).length;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Logros</Text>
              {!selected && (
                <Text style={styles.headerSub}>
                  {unlockedCount} de {logros.length} desbloqueados
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {selected ? (
            <LogroDetail logro={selected} onBack={() => setSelected(null)} />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridContainer}
            >
              <View style={styles.gridRow}>
                {logros.map((logro) => (
                  <GridItem key={logro.id} logro={logro} onPress={setSelected} />
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.65)" },
  sheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.70, // Un poco más bajo
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#FFF" },
  headerSub: { fontSize: 11, color: "#555", marginTop: 2 },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 12, color: "#AAA", fontWeight: "600" },
  gridContainer: { paddingVertical: 16, paddingHorizontal: 16 },
  gridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});