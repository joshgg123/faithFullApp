import { Timestamp } from "firebase/firestore";

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD (fecha base de la tarea)
  allDay: boolean;
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  isCompleted: boolean; // para tareas no recurrentes
  completedDates: string[]; // YYYY-MM-DD[] para tareas recurrentes
  recurring: RepeatType;
  notificationMinutes: number; // 0 = sin notificación
  createdAt: Timestamp; // para ordenar por fecha de creación, no se muestra al usuario
  //priority: boolean; // a confirmar
}