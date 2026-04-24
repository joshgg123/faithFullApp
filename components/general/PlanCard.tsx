import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';
import { Chip } from '@/components/general/Chip';
import { MiniProgressBar } from '@/components/general/MiniProgressBar';
import type { ActivityPlan, PlanCategory } from '@/types/general/plan';

type PlanCardProps = {
  plan: ActivityPlan;
};

const categoryColors: Record<PlanCategory, string> = {
  Ejercicio: appColors.error,
  Alimentacion: appColors.success,
  Espiritualidad: appColors.primaryBright,
};

const categoryVariants: Record<PlanCategory, 'error' | 'success' | 'primary'> = {
  Ejercicio: 'error',
  Alimentacion: 'success',
  Espiritualidad: 'primary',
};

export function PlanCard({ plan }: PlanCardProps) {
  const categoryColor = categoryColors[plan.category];

  return (
    <View style={styles.card}>
      <View style={styles.previewBox}>
        {plan.imageUrl ? (
          <Image source={{ uri: plan.imageUrl }} contentFit="cover" style={styles.previewImage} />
        ) : (
          <View style={styles.previewImagePlaceholder} />
        )}

        <View style={styles.previewDifficultyRow}>
          {Array.from({ length: 5 }).map((_, index) => {
            const isActive = index < plan.difficulty;

            return (
              <Ionicons
                key={`${plan.id}-${index}`}
                name={isActive ? 'flame' : 'flame-outline'}
                size={16}
                color={
                  isActive
                    ? plan.difficulty === 5
                      ? appColors.error
                      : appColors.accent
                    : appColors.textSecondary
                }
              />
            );
          })}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{plan.title}</Text>
        <Chip label={plan.category} variant={categoryVariants[plan.category]} />

        <View style={styles.middleRow}>
        <View style={styles.metrics}>
          <Text style={styles.daysText}>
            {plan.completedDays}/{plan.totalDays} dias
          </Text>
          <Text style={styles.bestText}>Best {plan.bestScore}%</Text>
        </View>

       
        </View>

        <MiniProgressBar value={plan.progress} color={categoryColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: appColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  previewBox: {
    width: 118,
    minHeight: 128,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.border,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: appColors.surface,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewImagePlaceholder: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  previewDifficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: '#FFFFFFF2',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 2,
  },
  title: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    color: appColors.text,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  metrics: {
    gap: 6,
    flex: 1,
  },
  daysText: {
    color: appColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  bestText: {
    color: appColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  bestBadge: {
    borderRadius: 999,
    backgroundColor: appColors.background,
    borderWidth: 1,
    borderColor: appColors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bestBadgeText: {
    color: appColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
