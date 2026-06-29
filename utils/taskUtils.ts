import { Task } from "@/types/tiempo/task";

export function isTaskForToday(task: Task) {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  switch (task.recurring) {
    case "none":
      return task.date === todayString;

    case "daily":
      return task.date <= todayString;

    case "weekly": {
      const taskDate = new Date(task.date);
      return (
        task.date <= todayString &&
        taskDate.getDay() === today.getDay()
      );
    }

    case "monthly": {
      const taskDate = new Date(task.date);
      return (
        task.date <= todayString &&
        taskDate.getDate() === today.getDate()
      );
    }

    default:
      return false;
  }
}

export function isTaskCompletedToday(task: Task) {
  const today = new Date().toISOString().split("T")[0];

  if (task.recurring === "none") {
    return task.isCompleted;
  }

  return task.completedDates.includes(today);
}