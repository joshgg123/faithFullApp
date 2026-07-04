import React, { useEffect, useState, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { LogroImage } from "@/components/insignia/Logroitem";
import { db } from "@/services/firebaseService";
import { collection, onSnapshot, query } from "firebase/firestore";
import { UserLogro } from "@/types/insignia";
import { getUserName } from "@/services/userServices";

const { width } = Dimensions.get("window");
const HARDCODED_USER_ID = "DsKU3kJoDuWZywM8RdRo";

export function GlobalAchievementBanner() {
  const [bannerLogro, setBannerLogro] = useState<UserLogro | null>(null);
  const [userName, setUserName] = useState("");
  const slideAnim = useRef(new Animated.Value(-150)).current; 
  const previousUnlockedIds = useRef<string[]>([]);

  // 1. Traer el nombre del usuario al montar el componente global
  useEffect(() => {
    async function fetchName() {
      try {
        const name = await getUserName();
        setUserName(name || "Usuario");
      } catch (error) {
        console.error("Error al obtener el nombre en el banner:", error);
        setUserName("Usuario");
      }
    }
    fetchName();
  }, []);

  // 2. Escucha reactiva de Firestore para detectar nuevos logros
  useEffect(() => {
    const logrosRef = collection(db, "USUARIO", HARDCODED_USER_ID, "LOGROS");
    const q = query(logrosRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaLogros = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserLogro[];

      if (previousUnlockedIds.current.length === 0) {
        // Primera carga: registramos los que ya están desbloqueados
        previousUnlockedIds.current = listaLogros
          .filter(l => l.unlocked)
          .map(l => l.id || l.templateId);
      } else {
        // Siguientes cargas: si hay uno nuevo, disparamos el banner
        listaLogros.forEach(logro => {
          const id = logro.id || logro.templateId;
          if (logro.unlocked && !previousUnlockedIds.current.includes(id)) {
            previousUnlockedIds.current.push(id);
            triggerBanner(logro);
          }
        });
      }
    }, (error) => console.error("Error global listener logros:", error));

    return () => unsubscribe();
  }, []);

  const triggerBanner = (logro: UserLogro) => {
    setBannerLogro(logro);
    
    // Baja el banner suavemente por encima de la pantalla actual
    Animated.timing(slideAnim, {
      toValue: 60,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Se mantiene 4 segundos y vuelve a subir
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setBannerLogro(null));
    }, 4000);
  };

  if (!bannerLogro) return null;

  return (
    <Animated.View style={[styles.bannerContainer, { transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.bannerContent}>
        <LogroImage logro={bannerLogro} size={36} />
        <View style={styles.bannerTextWrapper}>
          {/* 🔥 Nombre dinámico en mayúsculas integrado en el mensaje */}
          <Text style={styles.bannerLabel}>🏆 ¡¡LO LOGRASTE, {userName.toUpperCase()}!!</Text>
          <Text style={styles.bannerTitle}>Desbloqueaste: {bannerLogro.title}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
    zIndex: 99999,
    elevation: 10,
    shadowColor: "#F5C518",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  bannerContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  bannerTextWrapper: { flex: 1 },
  bannerLabel: { fontSize: 11, fontWeight: "800", color: "#F5C518" },
  bannerTitle: { fontSize: 14, fontWeight: "700", color: "#FFF", marginTop: 1 },
});