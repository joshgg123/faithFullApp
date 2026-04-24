import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PlanCard } from '@/components/general/PlanCard';
import { appColors } from '@/constants/colors';
import { bd } from '@/services/bd';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>
            Cards de planes con progreso simple, pensadas para retos y actividades.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planes activos</Text>
          {bd.activityPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 22,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: appColors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: appColors.textSecondary,
    lineHeight: 24,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: appColors.text,
  },
});
