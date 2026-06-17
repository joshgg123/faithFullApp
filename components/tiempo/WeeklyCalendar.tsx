import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { appColors } from '@/constants/colors';

/* ==========================================
   HELPERS
========================================== */

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

/** Devuelve el lunes de la semana que contiene la fecha dada */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Devuelve los 7 días de la semana a partir del lunes */
function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/* ==========================================
   PROPS
========================================== */

interface Props {
  selectedDate: Date;
  onDaySelect: (date: Date) => void; // TIE-01
}

/* ==========================================
   COMPONENT
========================================== */

export default function WeeklyCalendar({ selectedDate, onDaySelect }: Props) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(selectedDate));

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  function goToPrevWeek() {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  }

  function goToNextWeek() {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  }

  const monthLabel = useMemo(() => {
    // Si la semana cruza dos meses, mostramos ambos
    const lastDay = weekDays[6];
    if (weekStart.getMonth() !== lastDay.getMonth()) {
      return `${MONTH_NAMES[weekStart.getMonth()].slice(0, 3)} – ${MONTH_NAMES[lastDay.getMonth()].slice(0, 3)} ${lastDay.getFullYear()}`;
    }
    return `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`;
  }, [weekStart, weekDays]);

  return (
    <View style={styles.card}>
      {/* Header: mes/año + navegación */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToPrevWeek}
          style={styles.navBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={18} color={appColors.text} />
        </TouchableOpacity>

        <Text style={styles.monthLabel}>{monthLabel}</Text>

        <TouchableOpacity
          onPress={goToNextWeek}
          style={styles.navBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-forward" size={18} color={appColors.text} />
        </TouchableOpacity>
      </View>

      {/* Días de la semana - TIE-01 */}
      <View style={styles.daysRow}>
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);

          return (
            <Pressable
              key={index}
              style={[styles.dayItem, isSelected && styles.dayItemSelected]}
              onPress={() => onDaySelect(day)} // TIE-01: cambiar día seleccionado
            >
              <Text
                style={[
                  styles.dayAbbr,
                  isSelected && styles.dayAbbrSelected,
                  isToday && !isSelected && styles.dayAbbrToday,
                ]}
              >
                {DAY_LABELS[index]}
              </Text>

              <View
                style={[
                  styles.dayNumberWrap,
                  isSelected && styles.dayNumberWrapSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.dayNumberSelected,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </View>

              {/* Indicador de hoy */}
              {isToday && !isSelected && <View style={styles.todayDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* ==========================================
   STYLES
========================================== */

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 16,
    gap: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: appColors.background,
    borderWidth: 1,
    borderColor: appColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: appColors.text,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 14,
  },
  dayItemSelected: {
    backgroundColor: appColors.primarySoft, // TIE-01: día seleccionado resaltado visualmente
  },
  dayAbbr: {
    fontSize: 10,
    fontWeight: '600',
    color: appColors.textSecondary,
    textTransform: 'uppercase',
  },
  dayAbbrSelected: {
    color: appColors.primary,
  },
  dayAbbrToday: {
    color: appColors.primaryBright,
  },
  dayNumberWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberWrapSelected: {
    backgroundColor: appColors.primary,
  },
  dayNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: appColors.text,
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: appColors.primaryBright,
  },
});