import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

import { UserLogro } from "@/types/insignia";
import { LogroItem } from "@/components/insignia/Logroitem";

const { height, width } = Dimensions.get("window");

/* ==========================================
   Vista detallada de un logro
========================================== */

function LogroDetail({
  logro,
  onBack,
}: {
  logro: UserLogro;
  onBack: () => void;
}) {
  const color = logro.unlocked ? "#F5C518" : "#555";
  const size = 120;

  return (
    <View style={detail.container}>
      <View style={detail.placeholder}>
        {/* placeholder grande — reemplazar con <Image> después */}
        {logro.shape === "circle" && (
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 3,
              borderColor: color,
              backgroundColor: logro.unlocked ? color + "22" : "#2A2A2A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: size * 0.4,
                height: size * 0.4,
                borderRadius: size * 0.2,
                backgroundColor: color,
                opacity: logro.unlocked ? 1 : 0.3,
              }}
            />
          </View>
        )}
        {logro.shape === "diamond" && (
          <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
            <View
              style={{
                width: size * 0.65,
                height: size * 0.65,
                borderWidth: 3,
                borderColor: color,
                backgroundColor: logro.unlocked ? color + "22" : "#2A2A2A",
                transform: [{ rotate: "45deg" }],
              }}
            />
          </View>
        )}
        {logro.shape === "square" && (
          <View
            style={{
              width: size,
              height: size,
              borderRadius: 16,
              borderWidth: 3,
              borderColor: color,
              backgroundColor: logro.unlocked ? color + "22" : "#2A2A2A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: size * 0.4,
                height: size * 0.4,
                borderRadius: 6,
                backgroundColor: color,
                opacity: logro.unlocked ? 1 : 0.3,
              }}
            />
          </View>
        )}
      </View>

      <Text style={detail.title}>{logro.unlocked ? logro.title : "???"}</Text>
      <Text style={detail.description}>
        {logro.unlocked ? logro.description : "Seguí usando la app para desbloquear este logro."}
      </Text>

      {logro.unlocked && logro.unlockedAt && (
        <Text style={detail.date}>
          Desbloqueado el{" "}
          {new Date(logro.unlockedAt).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      )}

      {/* Fila inferior de insignias relacionadas (decorativa) */}
      <View style={detail.relatedRow}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "#333",
              backgroundColor: "#1A1A1A",
              margin: 6,
            }}
          />
        ))}
        {[0, 1].map((i) => (
          <View
            key={i}
            style={{
              width: 40,
              height: 40,
              transform: [{ rotate: "45deg" }],
              borderWidth: 2,
              borderColor: "#333",
              backgroundColor: "#1A1A1A",
              margin: 6,
            }}
          />
        ))}
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
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  placeholder: {
    marginBottom: 20,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
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
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: "#F5C518",
    marginBottom: 16,
  },
  relatedRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  backBtn: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#444",
  },
  backText: {
    color: "#AAA",
    fontSize: 14,
    fontWeight: "600",
  },
});

/* ==========================================
   LogrosModal — grid con scroll + detalle
========================================== */

interface LogrosModalProps {
  visible: boolean;
  logros: UserLogro[];
  onClose: () => void;
}

export function LogrosModal({ visible, logros, onClose }: LogrosModalProps) {
  const [selectedLogro, setSelectedLogro] = useState<UserLogro | null>(null);

  const handleClose = () => {
    setSelectedLogro(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {selectedLogro ? "Logro" : "Logros"}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {selectedLogro ? (
            /* Vista detallada */
            <LogroDetail
              logro={selectedLogro}
              onBack={() => setSelectedLogro(null)}
            />
          ) : (
            /* Grid con scroll */
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.grid}
            >
              {/* Renderizamos en filas de 3 */}
              {Array.from({ length: Math.ceil(logros.length / 3) }).map(
                (_, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {logros
                      .slice(rowIndex * 3, rowIndex * 3 + 3)
                      .map((logro) => (
                        <LogroItem
                          key={logro.id}
                          logro={logro}
                          onPress={setSelectedLogro}
                          size={60}
                        />
                      ))}
                  </View>
                ),
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: height * 0.72,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 13,
    color: "#AAA",
    fontWeight: "600",
  },
  grid: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 4,
  },
});