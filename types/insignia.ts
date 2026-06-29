export type LogroShape = "circle" | "diamond" | "square";

export interface LogroTemplate {
  id: string;
  title: string;
  description: string;
  shape: LogroShape;
  imageKey: string;  // ej: "logro_01" → assets/images/logros/logro_01.png
  order: number;
}

export interface UserLogro {
  id: string;
  templateId: string;
  title: string;
  description: string;
  shape: LogroShape;
  imageKey: string;  // mismo valor que el template, copiado para no hacer doble fetch
  order: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface UserStreak {
  streakDays: number;
  lastLoginDate: string; // YYYY-MM-DD
}