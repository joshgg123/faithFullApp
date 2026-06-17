import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  createTask,
  getTasks,
  updateTask,
} from '@/services/tiempoServices/tiempo';
import { Task } from '@/types/tiempo/task';

/* ==========================================
   HELPERS
========================================== */

export function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * TIE-07: Determina si una tarea debe mostrarse en una fecha dada,
 * considerando su tipo de periodicidad.
 */
function shouldShowTaskOnDate(task: Task, date: string): boolean {
  // La tarea no puede aparecer antes de su fecha base
  if (task.date > date) return false;

  switch (task.recurring) {
    case 'none':
      return task.date === date;

    case 'daily':
      // TIE-07: tareas diarias se muestran automáticamente cada día
      return true;

    case 'weekly': {
      const taskDay = new Date(task.date + 'T00:00:00').getDay();
      const targetDay = new Date(date + 'T00:00:00').getDay();
      return taskDay === targetDay;
    }

    case 'monthly': {
      const taskDayOfMonth = parseInt(task.date.split('-')[2], 10);
      const targetDayOfMonth = parseInt(date.split('-')[2], 10);
      return taskDayOfMonth === targetDayOfMonth;
    }

    default:
      return false;
  }
}

/**
 * TIE-03: Verifica si una tarea está completada en una fecha específica.
 * - Tareas únicas: usa el campo isCompleted
 * - Tareas recurrentes: verifica si la fecha está en completedDates
 */
function isTaskCompletedForDate(task: Task, date: string): boolean {
  if (task.recurring === 'none') {
    return task.isCompleted;
  }
  return (task.completedDates ?? []).includes(date);
}

/* ==========================================
   HOOK
========================================== */

export default function useAgenda() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.log('useAgenda loadTasks error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const selectedDateStr = useMemo(
    () => formatDateStr(selectedDate),
    [selectedDate]
  );

  /** TIE-02: Tareas filtradas por día seleccionado (incluye recurrentes) */
  const tasksForSelectedDay = useMemo(
    () => tasks.filter((task) => shouldShowTaskOnDate(task, selectedDateStr)),
    [tasks, selectedDateStr]
  );

  /** TIE-04: Crear tarea nueva */
  const addTask = useCallback(async (data: Omit<Task, 'id'>): Promise<void> => {
    await createTask(data);
    await loadTasks();
  }, []);

  /** TIE-10: Editar tarea existente */
  const editTask = useCallback(
    async (taskId: string, data: Partial<Omit<Task, 'id'>>): Promise<void> => {
      await updateTask(taskId, data);
      await loadTasks();
    },
    []
  );

  /**
   * TIE-03: Alternar estado completado de una tarea.
   * - Tareas únicas: invierte isCompleted
   * - Tareas recurrentes: agrega/quita la fecha del array completedDates
   */
  const toggleTaskCompletion = useCallback(
    async (task: Task): Promise<void> => {
      if (task.recurring === 'none') {
        await updateTask(task.id, { isCompleted: !task.isCompleted });
      } else {
        const completedDates = task.completedDates ?? [];
        const alreadyCompleted = completedDates.includes(selectedDateStr);
        const newDates = alreadyCompleted
          ? completedDates.filter((d) => d !== selectedDateStr)
          : [...completedDates, selectedDateStr];
        await updateTask(task.id, { completedDates: newDates });
      }
      await loadTasks();
    },
    [selectedDateStr]
  );

  /** TIE-03: Verifica si una tarea está completada en el día seleccionado */
  const isCompletedOnSelectedDate = useCallback(
    (task: Task): boolean => isTaskCompletedForDate(task, selectedDateStr),
    [selectedDateStr]
  );

  return {
    loading,
    tasks,
    selectedDate,
    selectedDateStr,
    setSelectedDate,
    tasksForSelectedDay,
    addTask,
    editTask,
    toggleTaskCompletion,
    isCompletedOnSelectedDate,
    reload: loadTasks,
  };
}