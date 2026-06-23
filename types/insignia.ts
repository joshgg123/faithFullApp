/* ==========================================
   FIRESTORE STRUCTURE
   ------------------------------------------
   LOGROS_TEMPLATE/{logroId}              (raíz — catálogo fijo, seed lo carga)

   USUARIO/{uid}                          (doc del usuario)
     streakDays: number
     lastLoginDate: string  (YYYY-MM-DD)

   USUARIO/{uid}/LOGROS/{logroId}         (subcolección — copia del template + estado)
========================================== */

export type LogroShape = "circle" | "diamond" | "square";

export interface LogroTemplate {
  id: string;
  title: string;
  description: string;
  shape: LogroShape; // para el placeholder visual
  order: number;
}

export interface UserLogro {
  id: string;
  templateId: string;
  title: string;
  description: string;
  shape: LogroShape;
  order: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface UserStreak {
  streakDays: number;
  lastLoginDate: string; // YYYY-MM-DD
}