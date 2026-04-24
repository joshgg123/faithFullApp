import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/general/ActionButton';
import { ExpandableList } from '@/components/general/ExpandableList';
import { PlanCard } from '@/components/general/PlanCard';
import { SearchFiltersBar } from '@/components/general/SearchFiltersBar';
import { appColors } from '@/constants/colors';
import { bd } from '@/services/bd';

export default function DescubrirScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Descubrir</Text>
          <Text style={styles.subtitle}>
            Vista de ejemplo para mapear dos planes desde la bd y probar componentes globales.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Botones globales</Text>
          <View style={styles.buttonsRow}>
            <ActionButton label="Aceptar" icon="checkmark" variant="success" />
            <ActionButton label="Rechazar" icon="close" variant="danger" />
            <ActionButton icon="heart" variant="ghost" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planes sugeridos</Text>
          {bd.activityPlans.slice(0, 2).map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Busqueda y filtros</Text>
          <SearchFiltersBar
            placeholder="Buscar planes o actividades"
            applyLabel="Aplicar"
            filters={[
              { id: 'ejercicio', label: 'Ejercicio', active: true },
              { id: 'alimentacion', label: 'Alimentacion' },
              { id: 'espiritualidad', label: 'Espiritualidad', active: true },
              { id: 'intermedio', label: 'Intermedio' },
            ]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lista desplegable</Text>
          <ExpandableList
            title="Opciones de hoy"
            headerIcon="list"
            defaultOpen
            items={[
              {
                id: 'one',
                title: 'Ver detalle del plan',
                subtitle: 'Accion para abrir el reto seleccionado',
                icon: 'eye',
              },
              {
                id: 'two',
                title: 'Continuar encuesta',
                subtitle: 'Perfecto para onboarding o formularios',
                icon: 'reader',
              },
              {
                id: 'three',
                title: 'Marcar actividad',
                subtitle: 'Puede reutilizarse en Tiempo o Templo',
                icon: 'checkbox',
              },
            ]}
          />
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
    fontSize: 20,
    fontWeight: '700',
    color: appColors.text,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
