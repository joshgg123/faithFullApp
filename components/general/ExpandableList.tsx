import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { appColors } from '@/constants/colors';

type ExpandableListItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type ExpandableListProps = {
  title: string;
  headerIcon?: keyof typeof Ionicons.glyphMap;
  items: ExpandableListItem[];
  defaultOpen?: boolean;
};

export function ExpandableList({
  title,
  headerIcon = 'menu',
  items,
  defaultOpen = false,
}: ExpandableListProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={styles.card}>
      <Pressable
        style={({ hovered, pressed }) => [
          styles.header,
          hovered && styles.headerHovered,
          pressed && styles.headerPressed,
        ]}
        onPress={() => setIsOpen((value) => !value)}>
        <View style={styles.headerContent}>
          {headerIcon ? (
            <View style={styles.headerIconWrap}>
              <Ionicons name={headerIcon} size={16} color={appColors.primary} />
            </View>
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={appColors.textSecondary}
        />
      </Pressable>

      {isOpen ? (
        <View style={styles.itemsWrap}>
          {items.map((item, index) => (
            <View
              key={item.id}
              style={[styles.itemRow, index !== items.length - 1 && styles.itemRowBorder]}>
              <View style={styles.itemLeading}>
                {item.icon ? (
                  <View style={styles.itemIconWrap}>
                    <Ionicons name={item.icon} size={16} color={appColors.primary} />
                  </View>
                ) : null}
                <View style={styles.itemCopy}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.subtitle ? <Text style={styles.itemSubtitle}>{item.subtitle}</Text> : null}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={appColors.textSecondary} />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.border,
    overflow: 'hidden',
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    transitionDuration: '120ms',
  },
  headerHovered: {
    backgroundColor: '#F8FAFC',
  },
  headerPressed: {
    opacity: 0.82,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: appColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: appColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  itemsWrap: {
    borderTopWidth: 1,
    borderTopColor: appColors.border,
  },
  itemRow: {
    minHeight: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: appColors.border,
  },
  itemLeading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: appColors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCopy: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    color: appColors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: appColors.textSecondary,
    fontSize: 12,
  },
});
