import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';

type ActionButtonVariant = 'primary' | 'success' | 'danger' | 'ghost';
type ActionButtonSize = 'sm' | 'md';

type ActionButtonProps = {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  variant?: ActionButtonVariant;
  size?: ActionButtonSize;
  fullWidth?: boolean;
};

const variantStyles: Record<
  ActionButtonVariant,
  {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  primary: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
    textColor: appColors.surface,
  },
  success: {
    backgroundColor: appColors.success,
    borderColor: appColors.success,
    textColor: appColors.surface,
  },
  danger: {
    backgroundColor: appColors.error,
    borderColor: appColors.error,
    textColor: appColors.surface,
  },
  ghost: {
    backgroundColor: appColors.surface,
    borderColor: appColors.border,
    textColor: appColors.text,
  },
};

const sizeStyles: Record<
  ActionButtonSize,
  {
    minHeight: number;
    paddingHorizontal: number;
    iconSize: number;
    fontSize: number;
  }
> = {
  sm: {
    minHeight: 40,
    paddingHorizontal: 12,
    iconSize: 16,
    fontSize: 13,
  },
  md: {
    minHeight: 48,
    paddingHorizontal: 16,
    iconSize: 18,
    fontSize: 14,
  },
};

export function ActionButton({
  label,
  icon,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: ActionButtonProps) {
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const iconOnly = Boolean(icon && !label);

  return (
    <Pressable
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.button,
        {
          minHeight: currentSize.minHeight,
          paddingHorizontal: iconOnly ? 0 : currentSize.paddingHorizontal,
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          width: iconOnly ? currentSize.minHeight : undefined,
          opacity: pressed ? 0.82 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        hovered && styles.buttonHovered,
        pressed && styles.buttonPressed,
        fullWidth && styles.fullWidth,
      ]}>
      <View style={styles.content}>
        {icon ? (
          <Ionicons
            name={icon}
            size={currentSize.iconSize}
            color={currentVariant.textColor}
          />
        ) : null}
        {label ? (
          <Text style={[styles.label, { color: currentVariant.textColor, fontSize: currentSize.fontSize }]}>
            {label}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    transitionDuration: '120ms',
  },
  buttonHovered: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  buttonPressed: {
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '700',
  },
});
