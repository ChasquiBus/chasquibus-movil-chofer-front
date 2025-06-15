import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PassengerListScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#B3C6FF', '#FFFFFF']}
          style={styles.gradient}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push('/screens/HomeChoferScreen')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#1200d3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PASAJEROS</Text>
          <View style={{ width: 30 }} /> {/* Spacer to balance the back button */}
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.passengerCard}>
            <Ionicons name="person-circle" size={60} color="#1200d3" style={styles.avatar} />
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerIdLabel}>C.I. <Text style={styles.passengerId}>1805548996</Text></Text>
              <Text style={styles.passengerName}>Juan Edison Mejía Perez</Text>
              <Text style={styles.passengerDetails}>22 años</Text>
              <Text style={styles.passengerDetails}>Hombre</Text>
            </View>
            
          </View>

          <View style={styles.passengerCard}>
            <Ionicons name="person-circle" size={60} color="#1200d3" style={styles.avatar} />
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerIdLabel}>C.I. <Text style={styles.passengerId}>1805548996</Text></Text>
              <Text style={styles.passengerName}>Camilo Edgar Naranjo Camacho</Text>
              <Text style={styles.passengerDetails}>25 años</Text>
              <Text style={styles.passengerDetails}>Hombre</Text>
            </View>
            
          </View>

          <View style={styles.passengerCard}>
            <Ionicons name="person-circle" size={60} color="#1200d3" style={styles.avatar} />
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerIdLabel}>C.I. <Text style={styles.passengerId}>1805548996</Text></Text>
              <Text style={styles.passengerName}>Kevin Javier Jara Medina</Text>
              <Text style={styles.passengerDetails}>22 años</Text>
              <Text style={styles.passengerDetails}>Hombre</Text>
            </View>
            
          </View>

          <View style={styles.passengerCard}>
            <Ionicons name="person-circle" size={60} color="#1200d3" style={styles.avatar} />
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerIdLabel}>C.I. <Text style={styles.passengerId}>1805548996</Text></Text>
              <Text style={styles.passengerName}>Juan Edison Mejía Perez</Text>
              <Text style={styles.passengerDetails}>22 años</Text>
              <Text style={styles.passengerDetails}>Hombre</Text>
            </View>
            
          </View>

        </ScrollView>
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