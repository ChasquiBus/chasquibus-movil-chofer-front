import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useUser } from '../context/UserContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import SeatSelection from '../../components/SeatSelection';

export default function BusSeatsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { hojaTrabajoId } = useLocalSearchParams();
  const [detalle, setDetalle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [boletos, setBoletos] = useState<any[]>([]);
  const [loadingBoletos, setLoadingBoletos] = useState(false);
  const [pisoSeleccionado, setPisoSeleccionado] = useState(1);

  // Mock de asientos para visualización
  const mockSeats = Array.from({ length: 32 }, (_, i) => ({
    id: (i + 1).toString(),
    status: (i % 7 === 0 ? 'reserved' : i % 5 === 0 ? 'selected' : 'available') as 'reserved' | 'selected' | 'available',
    fila: Math.floor(i / 4) + 1,
    columna: (i % 4) + 1,
  }));

  // Obtener boletos del chofer para la hoja de trabajo actual
  useEffect(() => {
    const fetchBoletos = async () => {
      if (!user || !detalle || !detalle.id) return;
      setLoadingBoletos(true);
      try {
        const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:3001/';
        const res = await fetch(`${API_URL}boletos/chofer?hojaTrabajoId=${detalle.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setBoletos(data);
      } catch (e) {
        setBoletos([]);
      }
      setLoadingBoletos(false);
    };
    fetchBoletos();
  }, [detalle, user]);

  // Generador de asientos por piso con estado según boletos
  function generarAsientosConEstado(total: number, piso: number = 1, offset: number = 0) {
    const seats = [];
    const asientosPorFila = 4;
    for (let i = 0; i < total; i++) {
      const numeroAsiento = (offset + i + 1).toString();
      let status: 'available' | 'reserved' | 'selected' = 'available';
      // Buscar el boleto ignorando ceros a la izquierda
      const boleto = boletos.find(b => String(Number(b.asientoNumero)) === numeroAsiento);
      if (boleto) {
        status = boleto.usado ? 'selected' : 'reserved';
      }
      seats.push({
        id: numeroAsiento,
        status,
        fila: Math.floor(i / asientosPorFila) + 1,
        columna: (i % asientosPorFila) + 1,
        piso,
      });
    }
    return seats;
  }

  useEffect(() => {
    if (!user) {
      setError('No hay usuario autenticado.');
      setLoading(false);
      return;
    }
    if (!hojaTrabajoId) {
      setError('No se proporcionó hojaTrabajoId.');
      setLoading(false);
      return;
    }
    const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:3001/';
    const fetchHojaTrabajo = async () => {
      setLoading(true);
      setError('');
      try {
        // Buscar solo la hoja de trabajo específica
        const res = await fetch(`${API_URL}hoja-trabajo/chofer/mis-programadas`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (!data.data || data.data.length === 0) {
          setError('No hay hojas de trabajo programadas.');
          setDetalle(null);
        } else {
          // Buscar la hoja de trabajo con el id recibido
          const detalleSeleccionado = data.data.find((h: any) => String(h.id) === String(hojaTrabajoId));
          if (!detalleSeleccionado) {
            setError('No se encontró la hoja de trabajo seleccionada.');
            setDetalle(null);
          } else {
            setDetalle(detalleSeleccionado);
          }
        }
      } catch (e: any) {
        setError(e.message || 'Error al cargar datos');
        setDetalle(null);
      }
      setLoading(false);
    };
    fetchHojaTrabajo();
  }, [user, hojaTrabajoId]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#B3C6FF', '#FFFFFF']} style={styles.gradient} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#1200d3" />
        </TouchableOpacity>
        <Text style={styles.title}>Asientos del Bus</Text>
        <View style={{ width: 30 }} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#1200d3" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', marginTop: 20, marginLeft: 20 }}>{error}</Text>
      ) : detalle ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Selector de piso si hay dos pisos */}
          {detalle.piso_doble && (
            <View style={styles.pisoSelectorContainer}>
              <TouchableOpacity
                style={[styles.pisoButton, pisoSeleccionado === 1 && styles.pisoButtonActive]}
                onPress={() => setPisoSeleccionado(1)}
              >
                <Text style={[styles.pisoButtonText, pisoSeleccionado === 1 && styles.pisoButtonTextActive]}>Piso 1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pisoButton, pisoSeleccionado === 2 && styles.pisoButtonActive]}
                onPress={() => setPisoSeleccionado(2)}
              >
                <Text style={[styles.pisoButtonText, pisoSeleccionado === 2 && styles.pisoButtonTextActive]}>Piso 2</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Visualización de asientos según piso seleccionado */}
          <View style={styles.seatSection}>
            {loadingBoletos ? (
              <ActivityIndicator size="small" color="#1200d3" style={{ marginTop: 10 }} />
            ) : detalle.piso_doble ? (
              pisoSeleccionado === 1 ? (
                <>
                  <Text style={styles.seatSectionTitle}>Piso 1</Text>
                  <SeatSelection seats={generarAsientosConEstado(detalle.total_asientos, 1)} />
                </>
              ) : (
                <>
                  <Text style={styles.seatSectionTitle}>Piso 2</Text>
                  <SeatSelection seats={generarAsientosConEstado(detalle.total_asientos_piso2 || 0, 2, detalle.total_asientos)} />
                </>
              )
            ) : (
              <SeatSelection seats={generarAsientosConEstado(detalle.total_asientos, 1)} />
            )}
          </View>
        </ScrollView>
      ) : null}
    </View>
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
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  coopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1200d3',
  },
  busImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  label: {
    fontSize: 15,
    color: '#1200d3',
    fontWeight: 'bold',
    marginTop: 6,
  },
  value: {
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  seatSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  seatSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1200d3',
    marginBottom: 10,
    textAlign: 'center',
  },
  pisoSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  pisoButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  pisoButtonActive: {
    backgroundColor: '#1200d3',
  },
  pisoButtonText: {
    color: '#1200d3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pisoButtonTextActive: {
    color: '#fff',
  },
}); 