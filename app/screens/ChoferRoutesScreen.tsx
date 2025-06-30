import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import { useUser } from '../context/UserContext';
import Constants from 'expo-constants';

export default function ChoferRoutesScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [rutas, setRutas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                onPress={() => router.push({
                  pathname: '/screens/PassengerListScreen',
                  params: {
                    hojaTrabajoId: ruta.id,
                    codigo: ruta.codigo,
                    origen: ruta.ciudad_origen,
                    destino: ruta.ciudad_destino,
                    hora: ruta.horaSalidaProg,
                    placa: ruta.placa
                  }
                })}
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
}); 