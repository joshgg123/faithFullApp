import { LogroImage } from "@/components/insignia/Logroitem";
import { AppText as Text } from "@/components/ui/AppText";
import { UserLogro } from "@/types/insignia";
import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { db } from "@/services/firebaseService";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const { height, width } = Dimensions.get("window");

// 🔑 ID fijo temporal para las pruebas de desarrollo
const HARDCODED_USER_ID = "DsKU3kJoDuWZywM8RdRo";

/* ==========================================
    Vista detallada de un logro
========================================== */
function LogroDetail({ logro, onBack }: { logro: UserLogro; onBack: () => void }) {
  const color = logro.unlocked ? "#F5C518" : "#444";

  return (
    <View style={detail.container}>
      <View style={[detail.imageWrapper, { borderColor: color }]}>
        <LogroImage logro={logro} size={110} />
      </View>

      <Text style={detail.title}>
        {logro.unlocked ? logro.title : "???"}
      </Text>

      <Text style={detail.description}>
        {logro.unlocked
          ? logro.description
          : "Seguí usando la app para descubrir este logro."}
      </Text>

      {logro.unlocked && logro.unlockedAt && (
        <Text style={detail.date}>
          Desbloqueado el{" "}
          {new Date(logro.unlockedAt).toLocaleDateString("es-AR", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </Text>
      )}

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

/* ==========================================
    Grid item con nombre debajo
========================================== */
function GridItem({ logro, onPress }: { logro: UserLogro; onPress: (l: UserLogro) => void }) {
  // Aseguramos de mapear correctamente el id que venga del documento
  const idMapeado = logro.id || logro.templateId;
  
  return (
    <TouchableOpacity
      style={grid.wrapper}
      onPress={() => onPress(logro)}
      activeOpacity={0.75}
    >
      <View style={{ opacity: logro.unlocked ? 1 : 0.4 }}>
        <LogroImage logro={logro} size={58} />
      </View>
      <Text style={[grid.name, { color: logro.unlocked ? "#FFF" : "#555" }]} numberOfLines={1}>
        {logro.unlocked ? logro.title : "???"}
      </Text>
    </TouchableOpacity>
  );
}

/* ==========================================
    Componente Principal: LogrosModal
========================================== */
interface LogrosModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LogrosModal({ visible, onClose }: LogrosModalProps) {
  const [localLogros, setLocalLogros] = useState<UserLogro[]>([]);
  const [selected, setSelected] = useState<UserLogro | null>(null);
  
  // Estado y animación para el Banner Pop-up
  const [bannerLogro, setBannerLogro] = useState<UserLogro | null>(null);
  const slideAnim = useRef(new Animated.Value(-120)).current; 
  
  // Guardamos una referencia para saber cuáles ya estaban desbloqueados y evitar falsas alertas al cargar
  const previousUnlockedIds = useRef<string[]>([]);

  // ⚡ Escucha reactiva en tiempo real con Firestore
  useEffect(() => {
    const logrosRef = collection(db, "USUARIO", HARDCODED_USER_ID, "LOGROS");
    const q = query(logrosRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaLogros = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserLogro[];

      // Si es la primera carga de la app, mapeamos el estado actual y no disparamos alertas
      if (previousUnlockedIds.current.length === 0) {
        previousUnlockedIds.current = listaLogros
          .filter(l => l.unlocked)
          .map(l => l.id || l.templateId);
      } else {
        // En subsiguientes actualizaciones, buscamos si hay uno nuevo desbloqueado
        listaLogros.forEach(logro => {
          const id = logro.id || logro.templateId;
          if (logro.unlocked && !previousUnlockedIds.current.includes(id)) {
            
            // 🚨 ¡NUEVO LOGRO DETECTADO EN CALIENTE! Disparar Pop-up
            previousUnlockedIds.current.push(id);
            triggerBanner(logro);
          }
        });
      }

      setLocalLogros(listaLogros);

      // Si el logro detallado está abierto, actualizamos sus datos dinámicamente si cambia
      if (selected) {
        const updatedSelected = listaLogros.find(l => (l.id || l.templateId) === (selected.id || selected.templateId));
        if (updatedSelected) setSelected(updatedSelected);
      }
    }, (error) => {
      console.error("Error escuchando logros en tiempo real: ", error);
    });

    return () => unsubscribe();
  }, [selected]);

  // Función animadora del Pop-up desde arriba
  const triggerBanner = (logro: UserLogro) => {
    setBannerLogro(logro);
    
    // Baja el banner
    Animated.timing(slideAnim, {
      toValue: 50, // Margen superior cómodo desde el notch/arriba
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Se queda 4 segundos suspendido y sube de nuevo
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setBannerLogro(null);
      });
    }, 4000);
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  const unlockedCount = localLogros.filter((l) => l.unlocked).length;

  return (
    <>
      {/* 🔔 POP-UP ANIMADO SUPERPUESTO AL SISTEMA */}
      {bannerLogro && (
        <Animated.View style={[styles.bannerContainer, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.bannerContent}>
            <LogroImage logro={bannerLogro} size={36} />
            <View style={styles.bannerTextWrapper}>
              <Text style={styles.bannerLabel}>🏆 ¡LOGRO DESBLOQUEADO!</Text>
              <Text style={styles.bannerTitle}>{bannerLogro.title}</Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* MODAL PRINCIPAL */}
      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>
                  {selected ? selected.unlocked ? selected.title : "Logro bloqueado" : "Logros"}
                </Text>
                {!selected && (
                  <Text style={styles.headerSub}>
                    {unlockedCount} de {localLogros.length} desbloqueados
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
                  {localLogros.map((logro) => (
                    <GridItem key={logro.id || logro.templateId} logro={logro} onPress={setSelected} />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

/* ==========================================
    Estilos
========================================== */
const detail = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 16, paddingHorizontal: 28 },
  imageWrapper: { width: 130, height: 130, borderRadius: 20, borderWidth: 2, alignItems: "center", justifyContent: "center", marginBottom: 20, backgroundColor: "#1A1A1A" },
  title: { fontSize: 22, fontWeight: "800", color: "#FFF", marginBottom: 10, textAlign: "center" },
  description: { fontSize: 14, color: "#AAA", textAlign: "center", lineHeight: 22, marginBottom: 16 },
  date: { fontSize: 12, color: "#F5C518", marginBottom: 12 },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, marginBottom: 24 },
  badgeText: { fontSize: 13, fontWeight: "700" },
  backBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12, borderWidth: 1.5, borderColor: "#333" },
  backText: { color: "#AAA", fontSize: 14, fontWeight: "600" },
});

const grid = StyleSheet.create({
  wrapper: { width: (width * 0.85 - 48) / 3, alignItems: "center", marginBottom: 20, gap: 6 },
  name: { fontSize: 10, fontWeight: "600", textAlign: "center" },
});

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.65)" },
  sheet: { backgroundColor: "#111", borderTopLeftRadius: 24, borderTopRightRadius: 24, height: height * 0.72, paddingBottom: 32 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "#1E1E1E" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#FFF" },
  headerSub: { fontSize: 12, color: "#555", marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#222", alignItems: "center", justifyContent: "center" },
  closeText: { fontSize: 13, color: "#AAA", fontWeight: "600" },
  gridContainer: { paddingVertical: 20, paddingHorizontal: 16 },
  gridRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  
  // Estilos del Banner Push flotante superior
  bannerContainer: {
    position: "absolute",
    top: 0,
    left: width * 0.05,
    width: width * 0.9,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#F5C518",
    zIndex: 9999, // Se renderiza sobre absolutamente todo
    shadowColor: "#F5C518",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  bannerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  bannerTextWrapper: { flex: 1 },
  bannerLabel: { fontSize: 11, fontWeight: "800", color: "#F5C518" },
  bannerTitle: { fontSize: 14, fontWeight: "700", color: "#FFF", marginTop: 1 },
});