import { AppText as Text } from "@/components/ui/AppText";
import { Theme } from "@/constants/theme/index";
import { useTheme } from "@/contexts/ThemeContext";
import { useTodayTasks } from "@/hooks/useTasksToday";
import { isTaskCompletedToday } from "@/utils/taskUtils";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export function TodayTasksCard() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { tasks, loading, completed, total } = useTodayTasks();

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.shadowLayer} />
        <View style={styles.card}>
          <Text style={styles.title}>Hoy</Text>
          <Text style={styles.subtitle}>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.shadowLayer} />
      <View style={styles.card}>
        <Text style={styles.title}>Hoy</Text>

        {tasks.length === 0 && (
          <Text style={styles.empty}>No tienes tareas para hoy</Text>
        )}

        {tasks.slice(0, 3).map((task) => (
          <View key={task.id} style={styles.row}>
            <Text style={styles.check}>
              {isTaskCompletedToday(task) ? "✅" : "⭕"}
            </Text>

            <Text style={styles.task}>{task.title}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          {completed}/{total} completadas
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      marginTop: 20,
    },
    shadowLayer: {
      position: "absolute",
      top: 6,
      left: 6,
      right: -6,
      bottom: -6,
      backgroundColor: theme.primaryBright,
      borderRadius: 20,
    },
    card: {
      backgroundColor: theme.surfaceAlt,
      borderRadius: 20,
      padding: 20,
    },
    title: {
      color: theme.text,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 15,
      textAlign: "center",
    },
    subtitle: {
      color: theme.textSecondary,
    },
    empty: {
      color: theme.textSecondary,
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
      color: theme.text,
      flex: 1,
    },
    footer: {
      color: theme.textSecondary,
      marginTop: 10,
      fontSize: 13,
    },
  });