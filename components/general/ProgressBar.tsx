import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';
import type { ProgressMetric, ProgressVariant } from '@/types/general/progress';

type ProgressBarProps = {
  progress: ProgressMetric;
};

const variantStyles: Record<
  ProgressVariant,
  {
    softBackground: string;
    strongColor: string;
    barColor: string;
  }
> = {
  primary: {
    softBackground: appColors.primarySoft,
    strongColor: appColors.primary,
    barColor: appColors.primaryBright,
  },
  success: {
    softBackground: appColors.successSoft,
    strongColor: appColors.success,
    barColor: appColors.success,
  },
  accent: {
    softBackground: appColors.accentSoft,
    strongColor: appColors.accent,
    barColor: appColors.accent,
  },
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const safeTotal = progress.total <= 0 ? 1 : progress.total;
  const clampedCurrent = Math.min(Math.max(progress.current, 0), safeTotal);
  const percentage = Math.round((clampedCurrent / safeTotal) * 100);
  const variant = variantStyles[progress.variant];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <View style={[styles.iconBadge, { backgroundColor: variant.softBackground }]}>
            <Ionicons name={progress.icon} size={18} color={variant.strongColor} />
          </View>

          <View style={styles.copyWrap}>
            <Text style={styles.title}>{progress.title}</Text>
            <Text style={styles.subtitle}>{progress.subtitle}</Text>
          </View>
        </View>

        <View style={[styles.percentBadge, { backgroundColor: variant.softBackground }]}>
          <Text style={[styles.percentText, { color: variant.strongColor }]}>{percentage}%</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: variant.barColor,
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.progressText}>
          {clampedCurrent}/{safeTotal} {progress.unitLabel}
        </Text>
        {progress.helperText ? <Text style={styles.helperText}>{progress.helperText}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 18,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: appColors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: appColors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  percentBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    width: '100%',
    height: 12,
    borderRadius: 999,
    backgroundColor: appColors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  footer: {
    gap: 4,
  },
  progressText: {
    color: appColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    color: appColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
