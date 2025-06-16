import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';

export default function HomeChoferScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-270)).current; // Drawer width

  const handleNavigate = () => {

  };

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -270,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setDrawerVisible(false));
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#B3C6FF', '#FFFFFF']}
          style={styles.gradient}
        />
        <View style={styles.headerContainer}>
          <Ionicons name="person-circle" size={60} color="#1200d3" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.holaText}>Hola, <Text style={styles.nombreText}>{user?.nombre} {user?.apellido}</Text></Text>
          </View>
          <TouchableOpacity onPress={openDrawer}>
            <Ionicons name="menu" size={36} color="#1200d3" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>OPCIONES</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={() => router.push('/screens/QRScannerScreen')}>
            <Ionicons name="qr-code" size={40} color="#1200d3" style={styles.icon} />
            <View style={styles.infoContainer}>
              <Text style={styles.optionTitle}>Escanear QR</Text>
              <Text style={styles.optionDesc}>Escanea boletos de los pasajeros</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard} onPress={() => router.push('/screens/PassengerListScreen')}>
            <Ionicons name="people" size={40} color="#1200d3" style={styles.icon} />
            <View style={styles.infoContainer}>
              <Text style={styles.optionTitle}>Lista de Pasajeros</Text>
              <Text style={styles.optionDesc}>Ver todos los pasajeros del viaje</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* Drawer Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={drawerVisible}
          onRequestClose={closeDrawer}
        >
          <Pressable style={styles.drawerOverlay} onPress={closeDrawer} />
          <Animated.View style={[styles.drawerContainer, { left: drawerAnim }]}>
            <View style={styles.drawerHeader}>
              <Ionicons name="person-circle" size={70} color="#1200d3" />
              <Text style={styles.drawerUserName}>{user?.nombre} {user?.apellido}</Text>
            </View>
            <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/screens/QRScannerScreen')}>
              <Ionicons name="qr-code" size={26} color="#1200d3" style={{ marginRight: 16 }} />
              <Text style={styles.drawerItemText}>Escanear QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/screens/PassengerListScreen')}>
              <Ionicons name="people" size={26} color="#1200d3" style={{ marginRight: 16 }} />
              <Text style={styles.drawerItemText}>Lista de Pasajeros</Text>
            </TouchableOpacity>
            <View style={styles.drawerDivider} />
            <TouchableOpacity style={styles.drawerItem} onPress={() => {
              closeDrawer();
              setTimeout(() => {
                router.push('/screens/LoginScreen');
              }, 250);
            }}>
              <Ionicons name="log-out-outline" size={26} color="#d32f2f" style={{ marginRight: 16 }} />
              <Text style={[styles.drawerItemText, { color: '#d32f2f' }]}>Cerrar sesión</Text>
            </TouchableOpacity>
          </Animated.View>
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
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  holaText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  nombreText: {
    fontWeight: 'bold',
    color: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 20,
    marginBottom: 18,
  },
  optionsContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    width: '95%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 18,
  },
  infoContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: '#000000',
  },
  // Drawer styles
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 270,
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 2,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  drawerHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  drawerUserName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 18,
  },
}); 