import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useUser } from '../context/UserContext';
import Constants from 'expo-constants';

export default function PassengerListScreen() {
  const router = useRouter();
  const { hojaTrabajoId, codigo, origen, destino, hora, placa } = useLocalSearchParams();
  const { user } = useUser();
  const [pasajeros, setPasajeros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPasajeros = async () => {
      if (!user?.token || !hojaTrabajoId) return;
      setLoading(true);
      setError('');
      const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:3001/';
      try {
        const res = await fetch(`${API_URL}boletos/chofer?hojaTrabajoId=${hojaTrabajoId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setPasajeros(data);
        } else {
          setError(data.message || 'Error al obtener pasajeros');
        }
      } catch (e) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };
    fetchPasajeros();
  }, [user, hojaTrabajoId]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#B3C6FF', '#FFFFFF']}
          style={styles.gradient}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push('/screens/ChoferRoutesScreen')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#1200d3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PASAJEROS</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
          <Text style={{ fontWeight: 'bold', color: '#1200d3' }}>Ruta: <Text style={{ color: '#000' }}>{codigo}</Text></Text>
          <Text style={{ fontWeight: 'bold', color: '#1200d3' }}>Origen: <Text style={{ color: '#000' }}>{origen}</Text></Text>
          <Text style={{ fontWeight: 'bold', color: '#1200d3' }}>Destino: <Text style={{ color: '#000' }}>{destino}</Text></Text>
          <Text style={{ fontWeight: 'bold', color: '#1200d3' }}>Hora salida: <Text style={{ color: '#000' }}>{hora}</Text></Text>
          {placa && <Text style={{ fontWeight: 'bold', color: '#1200d3' }}>Bus: <Text style={{ color: '#000' }}>{placa}</Text></Text>}
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#1200d3" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={{ color: 'red', marginLeft: 20, marginTop: 20 }}>{error}</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {pasajeros.length === 0 ? (
              <Text style={{ marginLeft: 20, color: '#888' }}>No hay pasajeros para esta ruta.</Text>
            ) : pasajeros.map((p) => (
              <View key={p.id} style={styles.passengerCard}>
                <Ionicons name="person-circle" size={60} color="#1200d3" style={styles.avatar} />
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerIdLabel}>C.I. <Text style={styles.passengerId}>{p.cedula}</Text></Text>
                  <Text style={styles.passengerName}>{p.nombre}</Text>
                  <Text style={styles.passengerDetails}>Total sin descuento: $ {p.totalSinDescPorPers}</Text>
                  <Text style={styles.passengerDetails}>Descuento: $ {p.totalDescPorPers}</Text>
                  <Text style={styles.passengerDetails}>Total pagado: $ {p.totalPorPer}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
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
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    marginRight: 15,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerIdLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  passengerId: {
    fontWeight: 'normal',
  },
  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  passengerDetails: {
    fontSize: 14,
    color: '#000000',
  },
}); 