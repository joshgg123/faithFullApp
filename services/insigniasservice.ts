import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/services/firebaseService";

import { LogroTemplate, UserLogro, UserStreak } from "@/types/insignia";

/*
 * TODO:
 * reemplazar por auth.currentUser.uid
 */
const USER_ID = "DsKU3kJoDuWZywM8RdRo";

/* ==========================================
   COLLECTIONS
========================================== */

const logrosTemplateCollection = collection(db, "LOGROS_TEMPLATE");

const userLogrosCollection = collection(
  db,
  "USUARIO",
  USER_ID,
  "LOGROS",
);

const userDocRef = doc(db, "USUARIO", USER_ID);

/* ==========================================
   STREAK
========================================== */

/**
 * Lee streakDays y lastLoginDate del documento del usuario.
 */
export async function getStreak(): Promise<UserStreak> {
  const snapshot = await getDoc(userDocRef);

  if (!snapshot.exists()) {
    return { streakDays: 0, lastLoginDate: "" };
  }

  const data = snapshot.data();

  return {
    streakDays: data.streakDays ?? 0,
    lastLoginDate: data.lastLoginDate ?? "",
  };
}

/**
 * Llama esto cuando el usuario abre la app / entra al home.
 * Compara lastLoginDate con hoy:
 *   - hoy     → no cambia (ya se contó)
 *   - ayer    → streakDays + 1
 *   - más viejo → reset a 1
 */
export async function updateStreak(): Promise<UserStreak> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const current = await getStreak();

  if (current.lastLoginDate === today) {
    // ya se actualizó hoy, no hacer nada
    return current;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newStreakDays =
    current.lastLoginDate === yesterdayStr
      ? current.streakDays + 1 // racha continúa
      : 1; // se rompió o es la primera vez

  const updated: UserStreak = {
    streakDays: newStreakDays,
    lastLoginDate: today,
  };

  // setDoc con merge:true crea los campos si no existen,
  // o los actualiza si ya están — nunca falla por doc vacío.
  await setDoc(userDocRef, updated, { merge: true });

  return updated;
}

/* ==========================================
   LOGROS_TEMPLATE (catálogo)
========================================== */

export async function getLogrosTemplates(): Promise<LogroTemplate[]> {
  const snapshot = await getDocs(logrosTemplateCollection);

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...(document.data() as Omit<LogroTemplate, "id">),
    }))
    .sort((a, b) => a.order - b.order);
}

/* ==========================================
   USUARIO / LOGROS
========================================== */

/**
 * Trae todos los logros del usuario (bloqueados y desbloqueados).
 */
export async function getUserLogros(): Promise<UserLogro[]> {
  const snapshot = await getDocs(userLogrosCollection);

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...(document.data() as Omit<UserLogro, "id">),
    }))
    .sort((a, b) => a.order - b.order);
}

/**
 * Desbloquea un logro del usuario (setea unlocked=true y unlockedAt).
 */
export async function unlockLogro(logroId: string): Promise<void> {
  await updateDoc(
    doc(db, "USUARIO", USER_ID, "LOGROS", logroId),
    {
      unlocked: true,
      unlockedAt: new Date().toISOString(),
    },
  );
}