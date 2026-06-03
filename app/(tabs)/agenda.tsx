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

  return (
    <SafeAreaView >
      <Text >Agenda Screen</Text>
    </SafeAreaView>
  );
}


