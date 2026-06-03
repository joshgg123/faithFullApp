import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/general/ActionButton';
import { ArticleCard } from '@/components/general/ArticleCard';
import { ExpandableList } from '@/components/general/ExpandableList';
import { PlanCard } from '@/components/general/PlanCard';
import { SearchFiltersBar } from '@/components/general/SearchFiltersBar';
import { appColors } from '@/constants/colors';
import { bd } from '@/services/bd';

export default function DescubrirScreen() {
  return (
//solo return un texto que diga "Descubrir Screen"
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Descubrir Screen</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});