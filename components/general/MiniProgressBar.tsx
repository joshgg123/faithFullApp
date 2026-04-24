import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';

type MiniProgressBarProps = {
  value: number;
  showPercentage?: boolean;
  color?: string;
};

export function MiniProgressBar({
  value,
  showPercentage = true,
  color = appColors.accent,
}: MiniProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <View style={styles.row}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedValue}%`, backgroundColor: color }]} />
      </View>
      {showPercentage ? <Text style={[styles.label, { color }]}>{clampedValue}%</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  label: {
    minWidth: 40,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
});
