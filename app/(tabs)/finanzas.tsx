import { SafeAreaView, StyleSheet, Text } from 'react-native';
import DynamicForm from '@/components/general/DynamicForm';
import { appColors } from '@/constants/colors';
import { Field } from '@/types/general/field';
export default function FinanzasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Finanzas</Text>
      <Text style={styles.subtitle}>Espacio listo para tus modulos financieros.</Text>
      <DynamicForm
        fields={
          [
            {
              type: "text",
              name: "accountName",
              label: "Nombre de la cuenta",
              placeholder: "Ej: Cuenta de ahorros"
            },

            {
              type: "boolean",
              name: "isActive",
              label: "¿Cuenta activa?"
            },
            {
              type: "date",
              name: "openedDate",
              label: "Fecha de apertura"
            }
          ] as Field[]
        }
        onSubmit={(values) => {
          console.log("Valores del formulario:", values);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.background,
    padding: 24,
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
    textAlign: 'center',
  },
});
