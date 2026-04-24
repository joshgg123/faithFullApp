import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';

type ChipProps = {
  label: string;
  variant?: 'neutral' | 'primary' | 'success' | 'accent' | 'error';
};

const variantStyles = {
  neutral: {
    backgroundColor: appColors.background,
    borderColor: appColors.border,
    textColor: appColors.textSecondary,
  },
  primary: {
    backgroundColor: appColors.primarySoft,
    borderColor: appColors.primarySoft,
    textColor: appColors.primary,
  },
  success: {
    backgroundColor: appColors.successSoft,
    borderColor: appColors.successSoft,
    textColor: appColors.success,
  },
  accent: {
    backgroundColor: appColors.accentSoft,
    borderColor: appColors.accentSoft,
    textColor: appColors.accent,
  },
  error: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
    textColor: appColors.error,
  },
} as const;

export function Chip({ label, variant = 'neutral' }: ChipProps) {
  const currentVariant = variantStyles[variant];

  return (
    <View
      style={[
        styles.tag,
        {
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
        },
      ]}>
      <Text style={[styles.tagText, { color: currentVariant.textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
