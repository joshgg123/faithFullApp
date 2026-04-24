import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '@/components/general/ActionButton';
import { appColors } from '@/constants/colors';

type SearchFilterOption = {
  id: string;
  label: string;
  active?: boolean;
};

type SearchFiltersBarProps = {
  value?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onFilterPress?: () => void;
  onApplyPress?: () => void;
  applyLabel?: string;
  filters?: SearchFilterOption[];
};

export function SearchFiltersBar({
  value,
  placeholder = 'Buscar',
  onChangeText,
  onFilterPress,
  onApplyPress,
  applyLabel = 'Buscar',
  filters = [],
}: SearchFiltersBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>(
    filters.filter((filter) => filter.active).map((filter) => filter.id)
  );

  const handleFilterPress = () => {
    setIsOpen((current) => !current);
    onFilterPress?.();
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilterIds((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId]
    );
  };

  const activeFilterCount = selectedFilterIds.length;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={appColors.textSecondary} />
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={appColors.textSecondary}
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={handleFilterPress}
          style={({ hovered, pressed }) => [
            styles.filterButton,
            isOpen && styles.filterButtonActive,
            hovered && styles.filterButtonHovered,
            pressed && styles.filterButtonPressed,
          ]}>
          <Ionicons
            name={isOpen ? 'options' : 'options-outline'}
            size={18}
            color={isOpen ? appColors.surface : appColors.primary}
          />
        </Pressable>

        <ActionButton
          label={applyLabel}
          icon="search"
          size="sm"
          onPress={onApplyPress}
        />
      </View>

      {isOpen && filters.length > 0 ? (
        <View style={styles.filtersPanel}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filtros</Text>
            <Text style={styles.filtersCount}>
              {activeFilterCount} seleccionados
            </Text>
          </View>
          <View style={styles.filtersWrap}>
            {filters.map((filter) => (
              <Pressable
                key={filter.id}
                onPress={() => toggleFilter(filter.id)}
                style={[
                  styles.filterChip,
                  selectedFilterIds.includes(filter.id) && styles.filterChipActive,
                ]}>
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilterIds.includes(filter.id) && styles.filterChipTextActive,
                  ]}>
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.surface,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: appColors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transitionDuration: '120ms',
  },
  filterButtonActive: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  filterButtonHovered: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  filterButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  filtersPanel: {
    backgroundColor: appColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 14,
    gap: 10,
  },
  filtersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  filtersTitle: {
    color: appColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  filtersCount: {
    color: appColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filtersWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: appColors.border,
    backgroundColor: appColors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: appColors.primarySoft,
    borderColor: appColors.primarySoft,
  },
  filterChipText: {
    color: appColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: appColors.primary,
  },
});
