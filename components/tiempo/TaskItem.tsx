import { AppText as Text } from '@/components/ui/AppText';
import { appColors } from '@/constants/colors';
import { Task } from '@/types/tiempo/task';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

/* ==========================================
   HELPERS
========================================== */

const REPEAT_LABELS: Record<string, string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  monthly: 'Mensual',
};

/** TIE-09: Formatea la fecha de creación (campo automático, no editable) */
function formatCreatedAt(iso: string): string {
  try {
    const date = new Date(iso);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  } catch {
    return '';
  }
}

function getTimeLabel(task: Task): string {
  if (task.allDay) return 'Todo el día';
  if (task.startTime && task.endTime) return `${task.startTime} – ${task.endTime}`;
  if (task.startTime) return `Desde ${task.startTime}`;
  return 'Todo el día';
}

/* ==========================================
   PROPS
========================================== */

interface Props {
  task: Task;
  isCompleted: boolean; // TIE-02: distinción visual completada/pendiente
  onToggleComplete: () => void; // TIE-03
  onEdit: () => void; // TIE-10
}

/* ==========================================
   COMPONENT
========================================== */

export default function TaskItem({
  task,
  isCompleted,
  onToggleComplete,
  onEdit,
}: Props) {
  return (
    <View style={[styles.container, isCompleted && styles.containerCompleted]}>
      {/* TIE-03: Control para marcar como completada */}
      <TouchableOpacity
        onPress={onToggleComplete}
        style={styles.checkbox}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={isCompleted ? appColors.success : appColors.textSecondary}
        />
      </TouchableOpacity>

      {/* Contenido */}
      <View style={styles.content}>
        {/* TIE-02: Título (con tachado si está completada) */}
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {/* TIE-02, TIE-05: Horario */}
        <View style={styles.metaRow}>
          <Ionicons
            name={task.allDay ? 'sunny-outline' : 'time-outline'}
            size={12}
            color={appColors.textSecondary}
          />
          <Text style={styles.metaText}>{getTimeLabel(task)}</Text>

          {/* TIE-07: Badge de periodicidad */}
          {task.recurring !== 'none' && (
            <View style={styles.repeatBadge}>
              <Ionicons name="repeat" size={10} color={appColors.primary} />
              <Text style={styles.repeatLabel}>
                {REPEAT_LABELS[task.recurring]}
              </Text>
            </View>
          )}
        </View>

        {/* TIE-06: Descripción si existe */}
        {task.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {task.description}
          </Text>
        ) : null}

        {/* TIE-09: Fecha de creación (no editable, automática) */}
        <Text style={styles.createdAt}>
          Creado el {formatCreatedAt(task.createdAt.toDate().toISOString())}
        </Text>
      </View>

      {/* TIE-10: Botón editar */}
      <TouchableOpacity
        onPress={onEdit}
        style={styles.editBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="pencil-outline" size={18} color={appColors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: appColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 14,
    gap: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  /** TIE-02: Las tareas completadas se distinguen visualmente */
  containerCompleted: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    opacity: 0.75,
  },
  checkbox: {
    marginTop: 1,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.text,
    lineHeight: 21,
  },
  /** TIE-02: Tachado para tareas completadas */
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: appColors.textSecondary,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: appColors.textSecondary,
  },
  repeatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: appColors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  repeatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: appColors.primary,
  },
  description: {
    fontSize: 13,
    color: appColors.textSecondary,
    lineHeight: 18,
  },
  createdAt: {
    fontSize: 11,
    color: appColors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    padding: 4,
    marginTop: 1,
  },
});