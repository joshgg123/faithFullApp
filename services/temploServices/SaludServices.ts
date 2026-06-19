import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/services/firebaseService";

import { PlanTemplate } from "@/types/templo/salud";
import { PlanDay } from "@/types/templo/salud";
import { DailyTask } from "@/types/templo/salud";
import { Intento } from "@/types/templo/salud";

/*
 * TODO:
 * reemplazar por auth.currentUser.uid
 */
const USER_ID = "DsKU3kJoDuWZywM8RdRo";

/* ==========================================
   COLLECTIONS
========================================== */

const planTemplatesCollection =
  collection(
    db,
    "PLANES_TEMPLATE",
  );

const intentosCollection =
  collection(
    db,
    "USUARIO",
    USER_ID,
    "INTENTOS",
  );

/* ==========================================
   PLANES_TEMPLATE
========================================== */

export async function getPlanTemplates(): Promise<
  PlanTemplate[]
> {
  const snapshot =
    await getDocs(
      planTemplatesCollection,
    );

  return snapshot.docs.map(
    (document) => ({
      id: document.id,

      ...(document.data() as Omit<
        PlanTemplate,
        "id"
      >),
    }),
  );
}

export async function getPlanTemplate(
  templateId: string,
): Promise<PlanTemplate | null> {
  const snapshot =
    await getDoc(
      doc(
        db,
        "PLANES_TEMPLATE",
        templateId,
      ),
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,

    ...(snapshot.data() as Omit<
      PlanTemplate,
      "id"
    >),
  };
}

/* ==========================================
   PLANES_TEMPLATE / days
========================================== */

export async function getPlanDay(
  templateId: string,
  day: number,
): Promise<PlanDay | null> {
  const snapshot =
    await getDoc(
      doc(
        db,
        "PLANES_TEMPLATE",
        templateId,
        "days",
        String(day),
      ),
    );

  if (!snapshot.exists()) {
    return null;
  }

  const data =
    snapshot.data() as Omit<
      PlanDay,
      "id" | "tasks"
    > & {
      tasks: Omit<
        DailyTask,
        "id"
      >[];
    };

  return {
    id: snapshot.id,

    day: data.day,

    tasks: data.tasks.map(
      (task, index) => ({
        id: String(index),

        ...task,
      }),
    ),
  };
}

/* ==========================================
   INTENTOS
========================================== */

export async function getActiveIntentos(): Promise<
  Intento[]
> {
  const q = query(
    intentosCollection,
    where("active", "==", true),
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (document) => ({
      id: document.id,

      ...(document.data() as Omit<
        Intento,
        "id"
      >),
    }),
  );
}

export async function getIntentosByCategory(
  category: Intento["category"],
): Promise<Intento[]> {
  const q = query(
    intentosCollection,
    where(
      "category",
      "==",
      category,
    ),
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (document) => ({
      id: document.id,

      ...(document.data() as Omit<
        Intento,
        "id"
      >),
    }),
  );
}

export async function getIntento(
  intentoId: string,
): Promise<Intento | null> {
  const snapshot =
    await getDoc(
      doc(
        db,
        "USUARIO",
        USER_ID,
        "INTENTOS",
        intentoId,
      ),
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,

    ...(snapshot.data() as Omit<
      Intento,
      "id"
    >),
  };
}

export async function getIntentoByTemplateId(
  templateId: string,
): Promise<Intento | null> {
  const q = query(
    intentosCollection,
    where(
      "templateId",
      "==",
      templateId,
    ),
  );

  const snapshot =
    await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const document = snapshot.docs[0];

  return {
    id: document.id,

    ...(document.data() as Omit<
      Intento,
      "id"
    >),
  };
}

/**
 * Crea un nuevo intento a partir de un template (al tocar "Iniciar").
 * Devuelve el id del documento creado para poder navegar directo.
 */
export async function startIntento(
  template: PlanTemplate,
): Promise<string> {
  const ref = await addDoc(
    intentosCollection,
    {
      templateId: template.id,

      category: template.category,

      title: template.title,

      difficulty:
        template.difficulty,

      durationDays:
        template.durationDays,

      active: true,

      status: "in_progress",

      currentDay: 1,

      completedTaskIds: [],

      progress: 0,

      bestScore: 0,

      startedAt:
        new Date().toISOString(),

      finishedAt: null,
    },
  );

  return ref.id;
}

/**
 * Reinicia un intento existente (al tocar "Reiniciar").
 * Mantiene el bestScore histórico, resetea el resto.
 */
export async function restartIntento(
  intentoId: string,
): Promise<void> {
  const intentoRef = doc(
    db,
    "USUARIO",
    USER_ID,
    "INTENTOS",
    intentoId,
  );

  await updateDoc(intentoRef, {
    active: true,

    status: "in_progress",

    currentDay: 1,

    completedTaskIds: [],

    progress: 0,

    startedAt:
      new Date().toISOString(),

    finishedAt: null,
  });
}

/**
 * Marca una tarea del día actual como completada.
 * Se llama cada vez que el usuario toca "Siguiente/Listo" en una tarea.
 */
export async function completeTask(
  intentoId: string,
  taskId: string,
): Promise<void> {
  const intento = await getIntento(
    intentoId,
  );

  if (!intento) {
    throw new Error(
      "Intento no encontrado",
    );
  }

  const completedTaskIds = [
    ...new Set([
      ...intento.completedTaskIds,
      taskId,
    ]),
  ];

  await updateDoc(
    doc(
      db,
      "USUARIO",
      USER_ID,
      "INTENTOS",
      intentoId,
    ),
    {
      completedTaskIds,
    },
  );
}

/**
 * Avanza el intento al día siguiente (cuando se terminaron
 * todas las tareas del día actual). Recalcula progress.
 * Si currentDay llega a durationDays, marca el intento como finished.
 */
export async function advanceToNextDay(
  intentoId: string,
): Promise<void> {
  const intento = await getIntento(
    intentoId,
  );

  if (!intento) {
    throw new Error(
      "Intento no encontrado",
    );
  }

  const nextDay =
    intento.currentDay + 1;

  const isFinished =
    nextDay > intento.durationDays;

  const progress = Math.min(
    100,
    Math.round(
      ((isFinished
        ? intento.durationDays
        : intento.currentDay) /
        intento.durationDays) *
        100,
    ),
  );

  const bestScore = Math.max(
    intento.bestScore,
    progress,
  );

  await updateDoc(
    doc(
      db,
      "USUARIO",
      USER_ID,
      "INTENTOS",
      intentoId,
    ),
    {
      currentDay: isFinished
        ? intento.currentDay
        : nextDay,

      completedTaskIds: [],

      progress,

      bestScore,

      active: !isFinished,

      status: isFinished
        ? "finished"
        : "in_progress",

      finishedAt: isFinished
        ? new Date().toISOString()
        : null,
    },
  );
}

/**
 * Abandona un intento (sale del plan sin terminarlo).
 * Lo saca de "en curso" pero no lo borra (mantiene bestScore).
 */
export async function abandonIntento(
  intentoId: string,
): Promise<void> {
  await updateDoc(
    doc(
      db,
      "USUARIO",
      USER_ID,
      "INTENTOS",
      intentoId,
    ),
    {
      active: false,

      status: "abandoned",
    },
  );
}