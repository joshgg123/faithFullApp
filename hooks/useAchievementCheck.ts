import { db } from "@/services/firebaseService";
import { collection, doc, getDocs, getDoc, setDoc, query, where } from "firebase/firestore";
import { useState } from "react";
import { Alert } from "react-native";

const HARDCODED_USER_ID = "DsKU3kJoDuWZywM8RdRo";

export type AchievementType = "streak" | "articles_read" | "transactions" | "tasks" | "tasks_completed";

export function useAchievementCheck() {
  // Estado local para capturar el logro recién desbloqueado y pasárselo a un modal custom si querés
  const [newlyUnlocked, setNewlyUnlocked] = useState<any | null>(null);
  
  const checkAchievements = async (type: AchievementType, fallbackCount?: number) => {
    const userId = HARDCODED_USER_ID;

    try {
      let currentValue = 0;

      if (type === "streak" || type === "articles_read") {
        const userRef = doc(db, "USUARIO", userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (type === "streak") currentValue = userData.streakDays || 0;
          else if (type === "articles_read") currentValue = userData.leidos?.length || 0;
        }
      } else {
        currentValue = fallbackCount || 0;
      }

      const templatesRef = collection(db, "LOGROS_TEMPLATE");
      const q = query(templatesRef, where("type", "==", type));
      const querySnapshot = await getDocs(q);

      for (const templateDoc of querySnapshot.docs) {
        const template = templateDoc.data();

        if (currentValue >= template.target) {
          const userLogroRef = doc(db, "USUARIO", userId, "LOGROS", template.id);
          const userLogroSnap = await getDoc(userLogroRef);

          const isAlreadyUnlocked = userLogroSnap.exists() && userLogroSnap.data().unlocked === true;

          if (!isAlreadyUnlocked) {
            const unlockedData = {
              templateId: template.id,
              title: template.title,
              description: template.description,
              imageKey: template.imageKey,
              shape: template.shape,
              order: template.order,
              unlocked: true,
              unlockedAt: new Date().toISOString()
            };

            await setDoc(userLogroRef, unlockedData, { merge: true });
            
            // 🌟 Seteamos el estado para que la app se entere al instante en caliente
            setNewlyUnlocked(unlockedData);

            // 🔔 Forzamos una alerta nativa inmediata fuera del hilo principal para asegurar que salte
            setTimeout(() => {
              Alert.alert(
                "🏆 ¡LOGRO DESBLOQUEADO!",
                `¡Felicidades!\n\n✨ ${template.title} ✨\n\n"${template.description}"`,
                [{ text: "¡Buenísimo!", onPress: () => setNewlyUnlocked(null) }],
                { cancelable: false }
              );
            }, 500);
          }
        }
      }
    } catch (error) {
      console.error(`Error procesando logros [${type}]:`, error);
    }
  };

  return { checkAchievements, newlyUnlocked, setNewlyUnlocked };
}