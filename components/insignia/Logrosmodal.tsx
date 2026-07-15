import { LogroImage } from "@/components/insignia/Logroitem";
import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { db } from "@/services/firebaseService";
import { UserLogro } from "@/types/insignia";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");
const HARDCODED_USER_ID = "DsKU3kJoDuWZywM8RdRo";

const GRID_PADDING = 16;
const GRID_GAP = 12;
const GRID_COLUMNS = 3;
const GRID_ITEM_WIDTH =
  (width - GRID_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

function LogroDetail({
  logro,
  onBack,
  theme,
}: {
  logro: UserLogro;
  onBack: () => void;
  theme: Theme;
}) {
  const detail = useMemo(() => createDetailStyles(theme), [theme]);
  const color = logro.unlocked ? theme.achievement : theme.border;

  return (
    <View style={detail.container}>
      <View style={[detail.imageWrapper, { borderColor: color }]}>
        <LogroImage logro={logro} size={110} />
      </View>

      <Text style={detail.title}>{logro.unlocked ? logro.title : "???"}</Text>

      <Text style={detail.description}>
        {logro.unlocked
          ? logro.description
          : "Seguí usando la app para descubrir este logro."}
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

      <View
        style={[
          detail.badge,
          {
            backgroundColor: logro.unlocked ? theme.achievement + "22" : theme.surfaceAlt,
            borderColor: color,
          },
        ]}
      >
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

function GridItem({
  logro,
  onPress,
  theme,
}: {
  logro: UserLogro;
  onPress: (l: UserLogro) => void;
  theme: Theme;
}) {
  const grid = useMemo(() => createGridStyles(theme), [theme]);

  return (
    <TouchableOpacity style={grid.wrapper} onPress={() => onPress(logro)} activeOpacity={0.75}>
      <View style={{ opacity: logro.unlocked ? 1 : 0.4 }}>
        <LogroImage logro={logro} size={58} />
      </View>
      <Text
        style={[grid.name, { color: logro.unlocked ? theme.text : theme.textSecondary }]}
        numberOfLines={1}
      >
        {logro.unlocked ? logro.title : "???"}
      </Text>
    </TouchableOpacity>
  );
}

interface LogrosModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LogrosModal({ visible, onClose }: LogrosModalProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [localLogros, setLocalLogros] = useState<UserLogro[]>([]);
  const [selected, setSelected] = useState<UserLogro | null>(null);

  const [bannerLogro, setBannerLogro] = useState<UserLogro | null>(null);
  const slideAnim = useRef(new Animated.Value(-120)).current;

  const previousUnlockedIds = useRef<string[]>([]);

  useEffect(() => {
    const logrosRef = collection(db, "USUARIO", HARDCODED_USER_ID, "LOGROS");
    const q = query(logrosRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const listaLogros = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserLogro[];

        if (previousUnlockedIds.current.length === 0) {
          previousUnlockedIds.current = listaLogros
            .filter((l) => l.unlocked)
            .map((l) => l.id || l.templateId);
        } else {
          listaLogros.forEach((logro) => {
            const id = logro.id || logro.templateId;
            if (logro.unlocked && !previousUnlockedIds.current.includes(id)) {
              previousUnlockedIds.current.push(id);
              triggerBanner(logro);
            }
          });
        }

        setLocalLogros(listaLogros);

        if (selected) {
          const updatedSelected = listaLogros.find(
            (l) => (l.id || l.templateId) === (selected.id || selected.templateId)
          );
          if (updatedSelected) setSelected(updatedSelected);
        }
      },
      (error) => {
        console.error("Error escuchando logros en tiempo real: ", error);
      }
    );

    return () => unsubscribe();
  }, [selected]);

  const triggerBanner = (logro: UserLogro) => {
    setBannerLogro(logro);

    Animated.timing(slideAnim, {
      toValue: 50,
      duration: 500,
      useNativeDriver: true,
    }).start();

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
      {bannerLogro && (
        <Animated.View
          style={[styles.bannerContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.bannerContent}>
            <LogroImage logro={bannerLogro} size={36} />
            <View style={styles.bannerTextWrapper}>
              <Text style={styles.bannerLabel}>🏆 ¡LOGRO DESBLOQUEADO!</Text>
              <Text style={styles.bannerTitle}>{bannerLogro.title}</Text>
            </View>
          </View>
        </Animated.View>
      )}

      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={handleClose} />

          <View style={styles.sheet}>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>
                  {selected ? (selected.unlocked ? selected.title : "Logro bloqueado") : "Logros"}
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
              <LogroDetail logro={selected} onBack={() => setSelected(null)} theme={theme} />
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.gridContainer}
              >
                <View style={styles.gridRow}>
                  {localLogros.map((logro) => (
                    <GridItem
                      key={logro.id || logro.templateId}
                      logro={logro}
                      onPress={setSelected}
                      theme={theme}
                    />
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

const createDetailStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, alignItems: "center", paddingTop: 16, paddingHorizontal: 28 },
    imageWrapper: {
      width: 130,
      height: 130,
      borderRadius: 20,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
      backgroundColor: theme.surfaceAlt,
    },
    title: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 10,
      textAlign: "center",
    },
    description: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 16,
    },
    date: { fontSize: 12, color: theme.achievement, marginBottom: 12 },
    badge: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1.5,
      marginBottom: 24,
    },
    badgeText: { fontSize: 13, fontWeight: "700" },
    backBtn: {
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: theme.border,
    },
    backText: { color: theme.textSecondary, fontSize: 14, fontWeight: "600" },
  });

const createGridStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: { width: GRID_ITEM_WIDTH, alignItems: "center", marginBottom: 20, gap: 6 },
    name: { fontSize: 10, fontWeight: "600", textAlign: "center" },
  });

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: { flex: 1, justifyContent: "flex-end" },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.65)" },
    sheet: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: height * 0.72,
      paddingBottom: 32,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    headerTitle: { fontSize: 18, fontWeight: "800", color: theme.text },
    headerSub: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    closeText: { fontSize: 13, color: theme.textSecondary, fontWeight: "600" },
    gridContainer: { paddingVertical: 20, paddingHorizontal: GRID_PADDING },
    gridRow: { flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP },

    bannerContainer: {
      position: "absolute",
      top: 0,
      left: width * 0.05,
      width: width * 0.9,
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1.5,
      borderColor: theme.achievement,
      zIndex: 9999,
      shadowColor: theme.achievement,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    bannerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
    bannerTextWrapper: { flex: 1 },
    bannerLabel: { fontSize: 11, fontWeight: "800", color: theme.achievement },
    bannerTitle: { fontSize: 14, fontWeight: "700", color: theme.text, marginTop: 1 },
  });