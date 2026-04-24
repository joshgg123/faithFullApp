import type { Ionicons } from '@expo/vector-icons';

export type ProgressVariant = 'primary' | 'success' | 'accent';

export type ProgressMetric = {
  id: string;
  title: string;
  subtitle: string;
  current: number;
  total: number;
  unitLabel: string;
  helperText?: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant: ProgressVariant;
};
