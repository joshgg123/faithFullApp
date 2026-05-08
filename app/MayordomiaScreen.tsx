import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import CustomModal from '../components/CustomModal';
import { Colors } from '../constants/theme';

export default function MayordomiaScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  // Variables simuladas para el prototipo
  const montoIngresado = 5000;
  const diezmoYOfrendaCalculado = montoIngresado * 0.15; // 10% Diezmo + 5% Ofrenda sugerida

  const handleAgendar = () => {
    // Aquí iría la lógica para crear el registro de salida programado [cite: 60]
    console.log("Egreso agendado para el próximo sábado");
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      <Text style={[styles.headerText, { color: themeColors.text }]}>
        Mi Tesoro
      </Text>

      {/* Botón que dispara la acción (Simulando el guardado de un ingreso) */}
      <TouchableOpacity 
        style={[styles.primaryButton, { backgroundColor: themeColors.tint }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Registrar Ingreso de ${montoIngresado}</Text>
      </TouchableOpacity>

      {/* Uso del Modal Dinámico */}
      <CustomModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)}
        title="¡Tesoro Apartado!"
      >
        {/* Contenido específico para esta Historia de Usuario */}
        <View style={styles.modalContent}>
          <Ionicons name="gift-outline" size={50} color={themeColors.tint} style={styles.icon} />
          
          <Text style={[styles.message, { color: themeColors.text }]}>
            Se han reservado ${diezmoYOfrendaCalculado} para tu próxima visita a la iglesia. ¿Quieres agendar este egreso para el próximo sábado? [cite: 59]
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.secondaryButton, { borderColor: themeColors.icon }]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.secondaryButtonText, { color: themeColors.icon }]}>Más tarde</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.confirmButton, { backgroundColor: themeColors.tint }]} 
              onPress={handleAgendar}
            >
              <Text style={styles.buttonText}>Agendar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  primaryButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContent: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
});