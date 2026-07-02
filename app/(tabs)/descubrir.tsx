import { AppText as Text } from '@/components/ui/AppText';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';


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