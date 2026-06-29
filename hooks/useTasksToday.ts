import { useEffect, useState } from "react";

import { getTasks } from "@/services/tiempoServices/tiempo";
import { Task } from "@/types/tiempo/task";

import {
  isTaskCompletedToday,
  isTaskForToday,
} from "@/utils/taskUtils";

export function useTodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    const allTasks = await getTasks();
    console.log("All tasks:", allTasks);    

    const todayTasks = allTasks
      .filter(isTaskForToday)
      .sort((a, b) => {
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;

        return (a.startTime ?? "").localeCompare(
          b.startTime ?? ""
        );
      });

    setTasks(todayTasks);

    setLoading(false);
  }

  return {
    tasks,
    loading,
    completed: tasks.filter(isTaskCompletedToday).length,
    total: tasks.length,
  };
}