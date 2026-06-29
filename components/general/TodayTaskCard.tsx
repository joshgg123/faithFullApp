import { View, Text, StyleSheet } from "react-native";

import { useTodayTasks } from "@/hooks/useTasksToday";
import { isTaskCompletedToday } from "@/utils/taskUtils";

export function TodayTasksCard() {
  const { tasks, loading, completed, total } = useTodayTasks();

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Hoy</Text>
        <Text style={styles.subtitle}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Hoy</Text>

      {tasks.length === 0 && (
        <Text style={styles.empty}>
          No tienes tareas para hoy
        </Text>
      )}

      {tasks.slice(0, 3).map((task) => (
        <View key={task.id} style={styles.row}>
          <Text style={styles.check}>
            {isTaskCompletedToday(task) ? "✅" : "⭕"}
          </Text>

          <Text style={styles.task}>
            {task.title}
          </Text>
        </View>
      ))}

      <Text style={styles.footer}>
        {completed}/{total} completadas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },

  subtitle: {
    color: "#888",
  },

  empty: {
    color: "#888",
  },

  row: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },

  check: {
    fontSize: 18,
    marginRight: 10,
  },

  task: {
    color: "white",
    flex: 1,
  },

  footer: {
    color: "#888",
    marginTop: 10,
    fontSize: 13,
  },
});