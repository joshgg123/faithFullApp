import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import TaskFormModal from '@/components/tiempo/TaskFormModal';
import TaskList from '@/components/tiempo/TaskList';
import WeeklyCalendar from '@/components/tiempo/WeeklyCalendar';
import { AppText as Text } from '@/components/ui/AppText';
import { appColors } from '@/constants/colors';
import useAgenda, { AgendaProvider } from '@/contexts/TiempoContext';
import { Task } from '@/types/tiempo/task';

/* ==========================================
   HELPERS
========================================== */

const DAY_NAMES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles',
  'Jueves', 'Viernes', 'Sábado',
];

const MONTH_SHORT = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

function formatDisplayDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const diffMs = d.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';

  return `${DAY_NAMES[date.getDay()]}, ${date.getDate()} de ${MONTH_SHORT[date.getMonth()]}`;
}

/* ==========================================
   INNER CONTENT (usa el contexto)
========================================== */

function AgendaContent() {
  const {
    loading,
    selectedDate,
    setSelectedDate,
    tasksForSelectedDay,
    addTask,
    editTask,
    toggleTaskCompletion,
    isCompletedOnSelectedDate,
  } = useAgenda();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /** TIE-04: Guardar nueva tarea */
  async function handleSaveTask(data: Omit<Task, 'id'>) {
    try {
      await addTask(data);
    } catch (error) {
      console.log('handleSaveTask error:', error);
    }
  }

  /**
   * TIE-10: Guardar cambios y mostrar mensaje "tarea editada"
   */
  async function handleUpdateTask(
    taskId: string,
    data: Partial<Omit<Task, 'id'>>
  ) {
    try {
      await editTask(taskId, data);
      Alert.alert('✓ Listo', 'Tarea editada correctamente.');
    } catch (error) {
      console.log('handleUpdateTask error:', error);
    }
  }

  const pendingCount = tasksForSelectedDay.filter(
    (t: any) => !isCompletedOnSelectedDate(t)
  ).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={appColors.primary} />
        <Text style={styles.loadingText}>Cargando agenda…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Mi Agenda</Text>
          {pendingCount > 0 && (
            <Text style={styles.screenSubtitle}>
              {pendingCount} tarea{pendingCount !== 1 ? 's' : ''} pendiente
              {pendingCount !== 1 ? 's' : ''} hoy
            </Text>
          )}
        </View>

        {/* TIE-04: Botón "Añadir +" visible en pantalla */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCreateModalVisible(true)}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── CALENDARIO SEMANAL (TIE-01) ── */}
        <WeeklyCalendar
          selectedDate={selectedDate}
          onDaySelect={setSelectedDate} // TIE-01: actualiza lista al cambiar día
        />

        {/* ── CABECERA DEL DÍA ── */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{formatDisplayDate(selectedDate)}</Text>
          <View style={styles.dayCountBadge}>
            <Text style={styles.dayCountText}>
              {tasksForSelectedDay.length} tarea
              {tasksForSelectedDay.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* ── LISTA DE TAREAS (TIE-02) ── */}
        <TaskList
          tasks={tasksForSelectedDay}
          isCompletedOnDate={isCompletedOnSelectedDate}
          onToggleComplete={toggleTaskCompletion} // TIE-03
          onEdit={setEditingTask} // TIE-10
        />
      </ScrollView>

      {/* ── MODAL NUEVA TAREA (TIE-04 al TIE-08) ── */}
      <TaskFormModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        selectedDate={selectedDate}
        onSave={handleSaveTask}
      />

      {/* ── MODAL EDITAR TAREA (TIE-10) ── */}
      <TaskFormModal
        visible={!!editingTask}
        onClose={() => setEditingTask(null)}
        selectedDate={selectedDate}
        task={editingTask}
        onSave={handleSaveTask}
        onUpdate={handleUpdateTask}
      />
    </SafeAreaView>
  );
}

/* ==========================================
   SCREEN (con Provider igual que Tesoros)
========================================== */

export default function AgendaScreen() {
  return (
    <AgendaProvider>
      <AgendaContent />
    </AgendaProvider>
  );
}

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: appColors.textSecondary,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: appColors.background,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: appColors.text,
  },
  screenSubtitle: {
    fontSize: 13,
    color: appColors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: appColors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: appColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 20,
  },

  // Day header
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.text,
  },
  dayCountBadge: {
    backgroundColor: appColors.surface,
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dayCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
});

