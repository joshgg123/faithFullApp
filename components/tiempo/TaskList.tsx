import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';
import { Task } from '@/types/tiempo/task';
import TaskItem from './TaskItem';

/* ==========================================
   PROPS
========================================== */

interface Props {
  tasks: Task[]; // TIE-02: tareas del día seleccionado
  isCompletedOnDate: (task: Task) => boolean;
  onToggleComplete: (task: Task) => void; // TIE-03
  onEdit: (task: Task) => void; // TIE-10
}

/* ==========================================
   COMPONENT
========================================== */

export default function TaskList({
  tasks,
  isCompletedOnDate,
  onToggleComplete,
  onEdit,
}: Props) {
  if (tasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrap}>
          <Ionicons name="calendar-outline" size={36} color={appColors.textSecondary} />
        </View>
        <Text style={styles.emptyTitle}>Sin tareas</Text>
        <Text style={styles.emptySubtitle}>
          No hay tareas programadas para este día.{'\n'}
          Presiona «Añadir +» para crear una.
        </Text>
      </View>
    );
  }

  // TIE-02: separar tareas pendientes y completadas
  const pending = tasks.filter((t) => !isCompletedOnDate(t));
  const completed = tasks.filter((t) => isCompletedOnDate(t));

  return (
    <View style={styles.container}>
      {/* Pendientes */}
      {pending.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: appColors.primaryBright }]} />
            <Text style={styles.sectionTitle}>
              Pendientes · {pending.length}
            </Text>
          </View>
          <View style={styles.list}>
            {pending.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isCompleted={false}
                onToggleComplete={() => onToggleComplete(task)}
                onEdit={() => onEdit(task)}
              />
            ))}
          </View>
        </View>
      )}

      {/* Completadas - TIE-02: distinción visual */}
      {completed.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: appColors.success }]} />
            <Text style={styles.sectionTitle}>
              Completadas · {completed.length}
            </Text>
          </View>
          <View style={styles.list}>
            {completed.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isCompleted={true}
                onToggleComplete={() => onToggleComplete(task)}
                onEdit={() => onEdit(task)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: appColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  list: {
    gap: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 52,
    gap: 10,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: appColors.background,
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: appColors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: appColors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
});