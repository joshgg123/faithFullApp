import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { appColors } from '@/constants/colors';
import { RepeatType, Task } from '@/types/tiempo/task';
import TimePickerField from './TimePickerField';

/* ==========================================
   CONFIG OPTIONS
========================================== */

/** TIE-07: Opciones de periodicidad */
const REPEAT_OPTIONS: { label: string; value: RepeatType; icon: string }[] = [
  { label: 'No repetir', value: 'none', icon: 'ban-outline' },
  { label: 'Diario', value: 'daily', icon: 'sunny-outline' },
  { label: 'Semanal', value: 'weekly', icon: 'calendar-outline' },
  { label: 'Mensual', value: 'monthly', icon: 'refresh-outline' },
];

/** TIE-08: Opciones de notificación anticipada */
const NOTIFICATION_OPTIONS: { label: string; value: number }[] = [
  { label: 'Sin notificación', value: 0 },
  { label: '5 min antes', value: 5 },
  { label: '10 min antes', value: 10 },
  { label: '15 min antes', value: 15 },
  { label: '30 min antes', value: 30 },
  { label: '1 hora antes', value: 60 },
  { label: '2 horas antes', value: 120 },
];

/* ==========================================
   HELPERS
========================================== */

function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ==========================================
   PROPS
========================================== */

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  task?: Task | null; // Si se pasa, modo edición (TIE-10)
  onSave: (data: Omit<Task, 'id'>) => Promise<void>;
  onUpdate?: (taskId: string, data: Partial<Omit<Task, 'id'>>) => Promise<void>;
}

/* ==========================================
   COMPONENT
========================================== */

export default function TaskFormModal({
  visible,
  onClose,
  selectedDate,
  task,
  onSave,
  onUpdate,
}: Props) {
  const isEditing = !!task;

  // Campos del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // TIE-06
  const [isAllDay, setIsAllDay] = useState(true); // TIE-05
  const [startTime, setStartTime] = useState('09:00'); // TIE-05
  const [endTime, setEndTime] = useState('10:00'); // TIE-05
  const [repeatType, setRepeatType] = useState<RepeatType>('none'); // TIE-07
  const [notificationMinutes, setNotificationMinutes] = useState(0); // TIE-08
  const [saving, setSaving] = useState(false);

  /** TIE-10: Pre-cargar datos al editar */
  useEffect(() => {
    if (!visible) return;

    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setIsAllDay(task.allDay);
      setStartTime(task.startTime ?? '09:00');
      setEndTime(task.endTime ?? '10:00');
      setRepeatType(task.recurring);
      setNotificationMinutes(task.notificationMinutes ?? 0);
    } else {
      // Reset para nueva tarea
      setTitle('');
      setDescription('');
      setIsAllDay(true);
      setStartTime('09:00');
      setEndTime('10:00');
      setRepeatType('none');
      setNotificationMinutes(0);
    }
  }, [task, visible]);

  /** TIE-04, TIE-05: Validación antes de guardar */
  async function handleSave() {
    // Validar título obligatorio (TIE-04)
    if (!title.trim()) {
      Alert.alert('Campo requerido', 'El título de la tarea es obligatorio.');
      return;
    }

    // TIE-05: Validar que hora inicio < hora fin
    if (!isAllDay) {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      if (sh * 60 + sm >= eh * 60 + em) {
        Alert.alert(
          'Horario inválido',
          'La hora de inicio debe ser anterior a la hora de fin.'
        );
        return;
      }
    }

    try {
      setSaving(true);

      if (isEditing && task && onUpdate) {
        /** TIE-10: Guardar cambios en tarea existente */
        await onUpdate(task.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          allDay: isAllDay,
          startTime: isAllDay ? undefined : startTime,
          endTime: isAllDay ? undefined : endTime,
          recurring: repeatType,
          notificationMinutes,
        });
      } else {
        /** TIE-04: Guardar nueva tarea */
        const newTask: Omit<Task, 'id'> = {
          title: title.trim(),
          description: description.trim() || undefined,
          date: formatDateStr(selectedDate),
          allDay: isAllDay,
          startTime: isAllDay ? undefined : startTime,
          endTime: isAllDay ? undefined : endTime,
          isCompleted: false,
          completedDates: [],
          recurring: repeatType,
          notificationMinutes,
          createdAt: Timestamp.now(), // TIE-09: generado automáticamente
        };
        await onSave(newTask);
      }

      onClose();
    } catch (error) {
      console.log('TaskFormModal save error:', error);
      Alert.alert('Error', 'No se pudo guardar la tarea. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>
                {isEditing ? 'Editar tarea' : 'Nueva tarea'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={appColors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── TÍTULO (TIE-04) ── */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Título <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Nombre de la tarea"
                placeholderTextColor={appColors.textSecondary}
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
                autoFocus={!isEditing}
              />
            </View>

            {/* ── DESCRIPCIÓN (TIE-06) ── */}
            <View style={styles.field}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Nota o descripción opcional"
                placeholderTextColor={appColors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* ── TODO EL DÍA (TIE-05) ── */}
            <View style={styles.switchRow}>
              <View style={styles.switchLabelGroup}>
                <Ionicons name="sunny-outline" size={18} color={appColors.primary} />
                <Text style={styles.label}>Todo el día</Text>
              </View>
              <Switch
                value={isAllDay}
                onValueChange={setIsAllDay}
                trackColor={{ false: '#e4e4e7', true: appColors.primarySoft }}
                thumbColor={isAllDay ? appColors.primary : '#f4f4f5'}
                ios_backgroundColor="#e4e4e7"
              />
            </View>

            {/* ── HORAS (TIE-05): visible solo si no es todo el día ── */}
            {!isAllDay && (
              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <TimePickerField
                    label="Hora inicio"
                    value={startTime}
                    onChange={setStartTime}
                  />
                </View>
                <View style={styles.timeField}>
                  <TimePickerField
                    label="Hora fin"
                    value={endTime}
                    onChange={setEndTime}
                  />
                </View>
              </View>
            )}

            {/* ── PERIODICIDAD (TIE-07) ── */}
            <View style={styles.field}>
              <Text style={styles.label}>Periodicidad</Text>
              <View style={styles.chipsRow}>
                {REPEAT_OPTIONS.map((opt) => {
                  const selected = repeatType === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.chip, selected && styles.chipSelected]}
                      onPress={() => setRepeatType(opt.value)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selected && styles.chipTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── NOTIFICACIÓN (TIE-08) ── */}
            <View style={styles.field}>
              <Text style={styles.label}>Recordatorio</Text>
              <View style={styles.optionsList}>
                {NOTIFICATION_OPTIONS.map((opt) => {
                  const selected = notificationMinutes === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.optionRow,
                        selected && styles.optionRowSelected,
                      ]}
                      onPress={() => setNotificationMinutes(opt.value)}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          selected && styles.radioCircleSelected,
                        ]}
                      >
                        {selected && <View style={styles.radioInner} />}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── BOTÓN GUARDAR ── */}
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>
                {saving
                  ? 'Guardando…'
                  : isEditing
                  ? 'Guardar cambios'
                  : 'Añadir tarea'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '94%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 0,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: appColors.text,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: appColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    gap: 20,
  },
  field: { gap: 8 },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: appColors.text,
  },
  required: {
    color: appColors.error,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: appColors.text,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: appColors.background,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  switchLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeField: { flex: 1 },

  // Chips periodicidad
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.background,
  },
  chipSelected: {
    backgroundColor: appColors.primarySoft,
    borderColor: appColors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.textSecondary,
  },
  chipTextSelected: {
    color: appColors.primary,
  },

  // Opciones de notificación
  optionsList: {
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: '#FAFAFA',
  },
  optionRowSelected: {
    backgroundColor: appColors.primarySoft,
    borderColor: appColors.primary,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: appColors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: appColors.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.primary,
  },
  optionText: {
    fontSize: 14,
    color: appColors.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: appColors.primary,
    fontWeight: '600',
  },

  // Botón guardar
  saveBtn: {
    backgroundColor: appColors.primary,
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    shadowColor: appColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});