import { SafeAreaView, StyleSheet, Text } from 'react-native';

import { appColors } from '@/constants/colors';

export default function SaludScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Salud</Text>
      <Text style={styles.subtitle}>Seccion reservada para bienestar y seguimiento personal.</Text>
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
