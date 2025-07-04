import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Modal, Pressable } from 'react-native';
import { useUser } from '../context/UserContext';
import Constants from 'expo-constants';

export default function ChoferRoutesScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [rutas, setRutas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:3001/';
    const fetchRutas = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}hoja-trabajo/chofer/mis-programadas`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setRutas(data.data || []);
        } else {
          setError(data.message || 'Error al obtener rutas');
        }
      } catch (e) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    fetchRutas();
  }, [user]);

  const handleRutaPress = (ruta: any) => {
    setSelectedRuta(ruta);
    setModalVisible(true);
  };

  const handleOptionPress = (option: 'pasajeros' | 'asientos') => {
    setModalVisible(false);
    if (option === 'pasajeros') {
      router.push({
        pathname: '/screens/PassengerListScreen',
        params: {
          hojaTrabajoId: selectedRuta.id,
          codigo: selectedRuta.codigo,
          origen: selectedRuta.ciudad_origen,
          destino: selectedRuta.ciudad_destino,
          hora: selectedRuta.horaSalidaProg,
          placa: selectedRuta.placa
        }
      });
    } else if (option === 'asientos') {
      router.push({
        pathname: '/screens/BusSeatsScreen',
        params: {
          busId: selectedRuta.idBus || selectedRuta.busId,
          hojaTrabajoId: selectedRuta.id
        }
      });
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 20, color: 'red' }}>No hay usuario autenticado.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#B3C6FF', '#FFFFFF']}
          style={styles.gradient}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push('/screens/HomeChoferScreen')}>
            <Ionicons name="arrow-back" size={32} color="#1200d3" style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <Text style={styles.title}>Rutas del Chofer</Text>
        </View>
        <Text style={styles.holaText}>Hola, <Text style={styles.nombreText}>{user?.nombre} {user?.apellido}</Text></Text>
        <Text style={styles.subtitle}>Rutas asignadas para hoy:</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1200d3" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: 'red', marginLeft: 20, marginTop: 20 }}>{error}</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.rutasContainer}>
            {rutas.length === 0 ? (
              <Text style={{ marginLeft: 20, color: '#888' }}>No tienes rutas asignadas para hoy.</Text>
            ) : rutas.map((ruta) => (
              <TouchableOpacity
                key={ruta.id}
                style={styles.rutaCard}
                onPress={() => handleRutaPress(ruta)}
              >
                <Ionicons name="bus" size={32} color="#1200d3" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rutaNombre}>
                    {ruta.codigo || 'Ruta'}
                  </Text>
                  <Text style={styles.rutaInfo}>
                    <Text style={{ fontWeight: 'bold' }}>Origen:</Text> {ruta.ciudad_origen || 'N/A'}
                  </Text>
                  <Text style={styles.rutaInfo}>
                    <Text style={{ fontWeight: 'bold' }}>Destino:</Text> {ruta.ciudad_destino || 'N/A'}
                  </Text>
                  <Text style={styles.rutaInfo}>
                    <Text style={{ fontWeight: 'bold' }}>Hora salida:</Text> {ruta.horaSalidaProg || 'N/A'}
                  </Text>
                  {ruta.placa && (
                    <Text style={styles.rutaInfo}>
                      <Text style={{ fontWeight: 'bold' }}>Bus:</Text> {ruta.placa}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Modal de opciones */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)} />
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Opciones de Ruta</Text>
              
              {selectedRuta && (
                <View style={styles.modalInfoBox}>
                  <Text style={styles.modalInfoText}>
                    <Text style={{ color: '#1200d3', fontWeight: 'bold' }}>Ruta:</Text> {selectedRuta.codigo}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={{ color: '#1200d3', fontWeight: 'bold' }}>Origen:</Text> {selectedRuta.ciudad_origen}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={{ color: '#1200d3', fontWeight: 'bold' }}>Destino:</Text> {selectedRuta.ciudad_destino}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={{ color: '#1200d3', fontWeight: 'bold' }}>Hora salida:</Text> {selectedRuta.horaSalidaProg}
                  </Text>
                  {selectedRuta.placa && (
                    <Text style={styles.modalInfoText}>
                      <Text style={{ color: '#1200d3', fontWeight: 'bold' }}>Bus:</Text> {selectedRuta.placa}
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity
                style={styles.modalOptionButton}
                onPress={() => handleOptionPress('pasajeros')}
              >
                <Ionicons name="people" size={32} color="#fff" style={{ marginRight: 12 }} />
                <Text style={styles.modalOptionButtonText}>Lista de Pasajeros</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOptionButton}
                onPress={() => handleOptionPress('asientos')}
              >
                <Ionicons name="bus" size={32} color="#fff" style={{ marginRight: 12 }} />
                <Text style={styles.modalOptionButtonText}>Asientos del Bus</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 10,
  },
  holaText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 20,
    marginBottom: 8,
  },
  nombreText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#1200d3',
    fontWeight: '500',
    marginLeft: 20,
    marginBottom: 10,
  },
  rutasContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  rutaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  rutaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  rutaInfo: {
    fontSize: 14,
    color: '#000000',
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInfoBox: {
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalInfoText: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  modalOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1200d3',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  modalOptionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalCancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 