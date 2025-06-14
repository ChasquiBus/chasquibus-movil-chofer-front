import { LinearGradient } from 'expo-linear-gradient'; // Agregar esta importación
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Aquí iría la lógica de autenticación
    // router.push('/(tabs)');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Reemplazar el View gradient por LinearGradient */}
        <LinearGradient
          colors={['#B3C6FF', '#FFFFFF']}
          style={styles.gradient}
        />
        <View style={styles.contentContainer}>
          <Image source={require('../../assets/images/welco.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Inicio Sesión</Text>
          <Text style={styles.subtitle}>
            ¡Escanea, valida y controla los asientos de tu bus fácilmente!
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Correo Electronico</Text>
            <TextInput
              style={styles.input}
              placeholder="hello@example.com"
              placeholderTextColor="#BDBDBD"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Contraseña</Text>
              <TouchableOpacity onPress={() => { }} style={styles.forgotPasswordBtn}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.inputPassword}
                placeholder="••••••••••••••••"
                placeholderTextColor="#BDBDBD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButtonInside}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7B61FF',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 6,
    marginLeft: 6,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#7B61FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#0F172A',
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 6,
    marginRight: 6,
  },
  forgotPasswordBtn: {
    padding: 2,
  },
  forgotPasswordText: {
    color: '#7B61FF',
    fontSize: 13,
  },
  passwordInputWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  inputPassword: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#7B61FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#0F172A',
    paddingRight: 44, // espacio para el icono
  },
  eyeButtonInside: {
    position: 'absolute',
    right: 10,
    top: 0,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 2,
  },
  primaryButton: {
    backgroundColor: '#1200d3',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});