// components/general/TodayTaskCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTodayTasks } from "@/hooks/useTasksToday";
import { isTaskCompletedToday } from "@/utils/taskUtils";

export function TodayTasksCard() {
  const { tasks, loading, completed, total } = useTodayTasks();

  if (loading) {
    return (
      <View style={styles.cardCompact}>
        <View style={styles.header}>
          <Text style={styles.title}>HOY</Text>
        </View>
        <Text style={styles.subtitle}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.cardCompact}>
      <View style={styles.header}>
        <Text style={styles.title}>HOY</Text>
      </View>

      <View style={styles.listContainer}>
        {tasks.length === 0 && (
          <Text style={styles.empty}>No hay tareas para hoy</Text>
        )}

        {tasks.slice(0, 3).map((task) => (
          <View key={task.id} style={styles.row}>
            <View
              style={[
                styles.checkCircle,
                isTaskCompletedToday(task) && styles.checkCircleCompleted,
              ]}
            >
              {isTaskCompletedToday(task) && <Text style={styles.checkmark}>✓</Text>}
            </View>

            <Text 
              style={[
                styles.taskText,
                isTaskCompletedToday(task) && styles.taskTextCompleted,
              ]} 
              numberOfLines={1}
            >
              {task.title}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        {completed}/{total} completadas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardCompact: {
    backgroundColor: "#111",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#222",
    paddingVertical: 12,
    paddingHorizontal: 14,
    height: 190, // Altura exacta para emparejar con la columna de Pedro
    justifyContent: "space-between",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    paddingBottom: 6,
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
    marginVertical: 4,
  },
  subtitle: {
    color: "#666",
    fontSize: 11,
    textAlign: "center",
  },
  empty: {
    color: "#555",
    fontSize: 11,
    textAlign: "center",
    fontStyle: "italic",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleCompleted: {
    borderColor: "#E8611A",
    backgroundColor: "#E8611A22",
  },
  checkmark: {
    color: "#E8611A",
    fontSize: 11,
    fontWeight: "900",
  },
  taskText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  taskTextCompleted: {
    color: "#555",
    textDecorationLine: "line-through",
  },
  footer: {
    color: "#555",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
  },
});