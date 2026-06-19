/* ==========================================
   FIRESTORE STRUCTURE
   ------------------------------------------
   PLANES_TEMPLATE/{templateId}                       (root collection — catálogo fijo)
     └── days (subcollection) /{dayId}                (un doc por día, contiene sus tasks)

   USUARIO/{uid}/INTENTOS/{intentoId}                  (subcollection)
========================================== */

export type PlanCategory = "ejercicio" | "alimentacion" | "espiritualidad";

export type TaskType = "ejercicio" | "alimentacion" | "espiritualidad";

/* ==========================================
   PLANES_TEMPLATE/{templateId}
========================================== */

export interface PlanTemplate {
  id: string;

  title: string;

  category: PlanCategory;

  difficulty: number; // 1 a 5 (fueguitos)

  durationDays: number;

  description: string;

  createdAt: string;
}

/* ==========================================
   PLANES_TEMPLATE/{templateId}/days/{dayId}
========================================== */

export interface DailyTask {
  id: string; // se asigna al leer (doc id de la subcolección de tasks, o índice)

  order: number;

  title: string;

  type: TaskType;

  // ejercicio
  reps?: number;

  durationSec?: number;

  restSec?: number;

  // alimentacion
  description?: string;

  // espiritualidad
  passage?: string;

  verse?: string;

  reflection?: string;
}

export interface PlanDay {
  id: string; // doc id, ej "1", "2", ...

  day: number;

  tasks: DailyTask[];
}

/* ==========================================
   USUARIO/{uid}/INTENTOS/{intentoId}
========================================== */

export interface Intento {
  id: string;

  templateId: string;

  category: PlanCategory;

  title: string;

  difficulty: number;

  durationDays: number;

  active: boolean; // booleano explícito que marca "en curso"

  status: "in_progress" | "finished" | "abandoned";

  currentDay: number;

  completedTaskIds: string[]; // tasks completadas del día actual (currentDay)

  progress: number; // 0-100, calculado en base a currentDay/durationDays

  bestScore: number; // 0-100, mejor score histórico de este templateId

  startedAt: string;

  finishedAt: string | null;
}