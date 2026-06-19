import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DailyTask, PlanCategory, PlanDay } from "@/types/templo/salud";

import {
  completeTask,
  advanceToNextDay,
} from "@/services/temploServices/SaludServices";

/*
 * Altura total de la navbar flotante:
 * paddingBottom(18) + paddingTop(8) + paddingVertical container(10*2) + minHeight item(56) = 102
 * Le sumamos un poco de aire = 110
 */
const FLOATING_NAV_HEIGHT = 110;

const { width } = Dimensions.get("window");

/*
 * IMPORTANTE: esta pantalla se navega FULL SCREEN
 * (fuera del stack de las tabs), por eso no hay
 * que preocuparse por la navbar de abajo acá.
 * En expo-router: pushear esta ruta como modal o
 * como screen sin "tabBarVisible", ej:
 *   router.push("/salud/intento/[id]/dia/[day]")
 * y en su _layout.tsx ponerle headerShown: false
 * y que no esté dentro del grupo (tabs).
 */

const CATEGORY_COLOR: Record<PlanCategory, string> = {
  ejercicio: "#E8611A",
  alimentacion: "#2E8B57",
  espiritualidad: "#6B4FBB",
};

/* ==========================================
   Countdown hook (es un hook de UI puro,
   solo cuenta segundos en pantalla, no toca Firebase)
========================================== */

function useCountdown(totalSec: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(totalSec);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setRemaining(totalSec);
  };

  useEffect(() => {
    if (running && remaining > 0) {
      ref.current = setInterval(() => setRemaining((p) => p - 1), 1000);
    } else if (remaining === 0) {
      setRunning(false);
      onDone();
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running, remaining]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return { display: `${mm}:${ss}`, remaining, running, start, pause, reset };
}

/* ==========================================
   Sub-screens (solo visual, sin botón propio:
   el botón "Siguiente/Listo" ahora vive fijo
   abajo, fuera del scroll, controlado por el padre)
========================================== */

function EjercicioRepsBody({ task, color }: { task: DailyTask; color: string }) {
  return (
    <View style={styles.taskContent}>
      <Text style={styles.taskTypeLabel}>EJERCICIO</Text>
      <View style={[styles.illustrationBox, { borderColor: color }]}>
        <Text style={{ fontSize: 64 }}>🏋️</Text>
      </View>
      <Text style={[styles.repsCount, { color }]}>x{task.reps}</Text>
      <Text style={styles.taskTitle}>{task.title}</Text>
    </View>
  );
}

function EjercicioTimerBody({
  task,
  color,
}: {
  task: DailyTask;
  color: string;
}) {
  const timer = useCountdown(task.durationSec ?? 30, () => {});
  const progress =
    (((task.durationSec ?? 30) - timer.remaining) / (task.durationSec ?? 30)) * 100;

  return (
    <View style={styles.taskContent}>
      <Text style={styles.taskTypeLabel}>EJERCICIO</Text>
      <View style={[styles.illustrationBox, { borderColor: color }]}>
        <Text style={{ fontSize: 64 }}>🤸</Text>
      </View>
      <Text style={[styles.timerDisplay, { color }]}>{timer.display}</Text>
      <Text style={styles.taskTitle}>{task.title}</Text>
      <View style={styles.timerBar}>
        <View
          style={[
            styles.timerBarFill,
            { width: `${progress}%` as any, backgroundColor: color },
          ]}
        />
      </View>
      <View style={styles.timerControls}>
        <TouchableOpacity
          style={[styles.timerBtn, { borderColor: color }]}
          onPress={timer.reset}
        >
          <Text style={[styles.timerBtnText, { color }]}>↺ Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timerBtn,
            styles.timerBtnPrimary,
            { backgroundColor: color },
          ]}
          onPress={timer.running ? timer.pause : timer.start}
        >
          <Text style={styles.timerBtnPrimaryText}>
            {timer.running ? "⏸ Pausa" : "▶ Iniciar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RestBody({ task }: { task: DailyTask }) {
  const timer = useCountdown(task.restSec ?? 10, () => {});
  return (
    <View style={styles.taskContent}>
      <Text style={styles.taskTypeLabel}>DESCANSO</Text>
      <Text style={{ fontSize: 80, marginVertical: 20 }}>😮‍💨</Text>
      <Text style={[styles.timerDisplay, { color: "#888" }]}>{timer.display}</Text>
      <View style={styles.timerControls}>
        <TouchableOpacity
          style={[styles.timerBtn, { borderColor: "#888" }]}
          onPress={timer.reset}
        >
          <Text style={[styles.timerBtnText, { color: "#888" }]}>↺</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timerBtn, styles.timerBtnPrimary, { backgroundColor: "#888" }]}
          onPress={timer.running ? timer.pause : timer.start}
        >
          <Text style={styles.timerBtnPrimaryText}>{timer.running ? "⏸" : "▶"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AlimentacionBody({ task }: { task: DailyTask }) {
  return (
    <View style={styles.taskContent}>
      <Text style={styles.taskTypeLabel}>ALIMENTACIÓN</Text>
      <View style={[styles.illustrationBox, { borderColor: "#2E8B57" }]}>
        <Text style={{ fontSize: 64 }}>🥗</Text>
      </View>
      <Text style={styles.taskTitle}>{task.title}</Text>
      {task.description && (
        <ScrollView style={styles.descriptionScroll}>
          <Text style={styles.descriptionText}>{task.description}</Text>
        </ScrollView>
      )}
    </View>
  );
}

function EspiritualidadBody({ task, color }: { task: DailyTask; color: string }) {
  return (
    <View style={styles.taskContent}>
      <Text style={styles.taskTypeLabel}>ESPIRITUALIDAD</Text>
      <Text style={styles.passageTitle}>{task.passage ?? task.title}</Text>
      {task.verse && (
        <View style={[styles.verseBox, { borderLeftColor: color }]}>
          <Text style={styles.verseText}>{task.verse}</Text>
        </View>
      )}
      {task.reflection && (
        <ScrollView style={styles.descriptionScroll}>
          <Text style={styles.reflectionLabel}>REFLEXIÓN</Text>
          <Text style={styles.descriptionText}>{task.reflection}</Text>
        </ScrollView>
      )}
    </View>
  );
}

/* ==========================================
   Main TaskScreen

   Sin hooks de datos: recibe planDayData ya
   cargado por el padre (con getPlanDay) y
   llama directo a las funciones del service.
   Después de cada acción, el PADRE es quien
   hace el reload (vuelve a pedir el intento/día).
========================================== */

interface TaskScreenProps {
  intentoId: string;
  planTitle: string;
  planDay: number;
  category: PlanCategory;
  planDayData: PlanDay; // cargado afuera con getPlanDay(templateId, day)
  onDayFinished: () => void; // el padre hace reload + navega cuando se acabó el día
  onBack: () => void;
}

export function TaskScreen({
  intentoId,
  planTitle,
  planDay,
  category,
  planDayData,
  onDayFinished,
  onBack,
}: TaskScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const color = CATEGORY_COLOR[category];

  const tasks = planDayData.tasks;
  const currentTask = tasks[currentIndex];
  const isLastTask = currentIndex === tasks.length - 1;

  const goNext = useCallback(async () => {
    if (saving || !currentTask) return;
    setSaving(true);

    try {
      // 1. marcar la tarea actual como completada en Firestore
      await completeTask(intentoId, currentTask.id);

      if (isLastTask) {
        // 2. era la última tarea del día -> avanzar de día en Firestore
        await advanceToNextDay(intentoId);
        // 3. el padre recarga el intento (reload) y decide a dónde navegar
        onDayFinished();
        return;
      }

      // 4. todavía quedan tareas hoy -> animar a la siguiente, sin salir de la pantalla
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(width);
        setCurrentIndex((i) => i + 1);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } finally {
      setSaving(false);
    }
  }, [currentIndex, isLastTask, currentTask, intentoId, saving]);

  useEffect(() => {
    slideAnim.setValue(0);
  }, [currentIndex]);

  const renderTaskBody = () => {
    if (!currentTask) return null;

    if (currentTask.restSec != null) {
      return <RestBody task={currentTask} />;
    }

    switch (currentTask.type) {
      case "ejercicio":
        if (currentTask.durationSec != null) {
          return <EjercicioTimerBody task={currentTask} color={color} />;
        }
        return <EjercicioRepsBody task={currentTask} color={color} />;
      case "alimentacion":
        return <AlimentacionBody task={currentTask} />;
      case "espiritualidad":
        return <EspiritualidadBody task={currentTask} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {planTitle}
          </Text>
          <Text style={styles.headerSub}>Día {planDay}</Text>
        </View>
        <Text style={styles.headerCounter}>
          {currentIndex + 1}/{tasks.length}
        </Text>
      </View>

      {/* Step dots */}
      <View style={styles.dots}>
        {tasks.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i <= currentIndex ? color : "#E0E0E0" },
              i === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Scrollable body (todo lo que no es el botón fijo) */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          {renderTaskBody()}
        </Animated.View>
      </ScrollView>

      {/*
        Botón fijo abajo, FUERA del scroll y FUERA del flujo de tabs.
        Como esta pantalla se navega full-screen (sin tab bar visible),
        alcanza con insets.bottom — no compite con la navbar porque
        la navbar directamente no está montada en esta ruta.
      */}
      <View style={[styles.fixedFooter, { paddingBottom: insets.bottom + FLOATING_NAV_HEIGHT }]}>
        <TouchableOpacity
          style={[styles.doneBtn, { backgroundColor: color, opacity: saving ? 0.6 : 1 }]}
          onPress={goNext}
          disabled={saving}
        >
          <Text style={styles.doneBtnText}>
            {saving ? "Guardando..." : "Siguiente / Listo →"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ==========================================
   Styles
========================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    backgroundColor: "#FFF",
  },
  backArrow: {
    fontSize: 22,
    color: "#333",
    marginRight: 8,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  headerSub: {
    fontSize: 11,
    color: "#AAA",
  },
  headerCounter: {
    fontSize: 13,
    color: "#AAA",
    fontWeight: "600",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: "#FFF",
  },
  dot: {
    height: 4,
    borderRadius: 2,
    width: 24,
  },
  dotActive: {
    width: 32,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  taskContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  taskTypeLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#AAA",
    marginBottom: 20,
  },
  illustrationBox: {
    width: width - 80,
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginBottom: 24,
  },
  repsCount: {
    fontSize: 72,
    fontWeight: "900",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 20,
  },
  timerDisplay: {
    fontSize: 64,
    fontWeight: "900",
    letterSpacing: -2,
    marginBottom: 8,
  },
  timerBar: {
    width: width - 80,
    height: 6,
    backgroundColor: "#EEE",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 20,
  },
  timerBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  timerControls: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  timerBtn: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  timerBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  timerBtnPrimary: {
    borderWidth: 0,
  },
  timerBtnPrimaryText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  descriptionScroll: {
    maxHeight: 180,
    width: "100%",
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
    textAlign: "center",
  },
  verseBox: {
    borderLeftWidth: 4,
    paddingLeft: 14,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  verseText: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#555",
    lineHeight: 24,
  },
  passageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1A2E",
    textAlign: "center",
    marginBottom: 20,
  },
  reflectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#AAA",
    marginBottom: 8,
    textAlign: "center",
  },
  fixedFooter: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
  },
  doneBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});