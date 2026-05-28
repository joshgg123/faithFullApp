import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { appColors } from '@/constants/colors';

export default function AgendaScreen() {
  const scale = useSharedValue(1);
  const innerScale = useSharedValue(1);
  const glow = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 450,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.95, {
          duration: 450,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    innerScale.value = withRepeat(
      withSequence(
        withTiming(1.1, {
          duration: 320,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.9, {
          duration: 320,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    glow.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 700 }),
        withTiming(0.35, { duration: 700 })
      ),
      -1,
      true
    );
  }, []);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const innerFlameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: scale.value * 1.15 }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* ================= FIRE ================= */}

      <View style={fire.container}>
        {/* Glow */}
        <Animated.View style={[fire.glow, glowStyle]} />

        {/* OUTER FIRE */}
        <Animated.View style={[fire.outerFlame, flameStyle]}>
          {/* Left cut */}
          <View style={fire.leftCut} />

          {/* Right cut */}
          <View style={fire.rightCut} />

          {/* Top cut */}
          <View style={fire.topCut} />
        </Animated.View>

        {/* INNER FIRE */}
        <Animated.View style={[fire.innerFlame, innerFlameStyle]}>
          <View style={fire.innerLeftCut} />
          <View style={fire.innerRightCut} />
        </Animated.View>
      </View>

      {/* ================= TEXT ================= */}

      <Text style={styles.title}>Agenda</Text>

      <Text style={styles.subtitle}>
        Nombre propuesto para el calendario de tareas.
      </Text>
    </SafeAreaView>
  );
}

/* =========================
      FIRE STYLES
========================= */

const fire = StyleSheet.create({
  container: {
    width: 180,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  glow: {
    position: 'absolute',

    width: 120,
    height: 120,

    borderRadius: 999,

    backgroundColor: 'rgba(255,140,0,0.25)',

    bottom: 30,
  },

  /* =================
      OUTER FIRE
  ================= */

  outerFlame: {
    position: 'absolute',

    width: 110,
    height: 150,

    backgroundColor: '#ff6a00',

    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,

    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,

    overflow: 'hidden',

    transform: [{ rotate: '-2deg' }],
  },

  /* Left inner curve */
  leftCut: {
    position: 'absolute',

    width: 55,
    height: 90,

    backgroundColor: appColors.background,

    borderRadius: 999,

    left: -5,
    top: 28,

    transform: [{ rotate: '28deg' }],
  },

  /* Right inner curve */
  rightCut: {
    position: 'absolute',

    width: 48,
    height: 82,

    backgroundColor: appColors.background,

    borderRadius: 999,

    right: -6,
    top: 62,

    transform: [{ rotate: '-25deg' }],
  },

  /* Top point shaping */
  topCut: {
    position: 'absolute',

    width: 60,
    height: 60,

    backgroundColor: appColors.background,

    borderRadius: 999,

    top: -12,
    left: 8,

    transform: [{ rotate: '22deg' }],
  },

  /* =================
      INNER FIRE
  ================= */

  innerFlame: {
    position: 'absolute',

    width: 58,
    height: 88,

    backgroundColor: '#fff176',

    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,

    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,

    bottom: 36,

    overflow: 'hidden',
  },

  innerLeftCut: {
    position: 'absolute',

    width: 26,
    height: 50,

    backgroundColor: appColors.background,

    borderRadius: 999,

    left: -4,
    top: 18,

    transform: [{ rotate: '25deg' }],
  },

  innerRightCut: {
    position: 'absolute',

    width: 22,
    height: 40,

    backgroundColor: appColors.background,

    borderRadius: 999,

    right: -3,
    top: 34,

    transform: [{ rotate: '-18deg' }],
  },
});

/* =========================
      PAGE STYLES
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: appColors.background,

    padding: 24,
  },

  title: {
    fontSize: 42,
    fontWeight: '800',

    color: appColors.text,

    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,

    color: appColors.textSecondary,

    textAlign: 'center',

    lineHeight: 28,

    maxWidth: 300,
  },
});