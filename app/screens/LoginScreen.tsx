import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { useUser } from '../context/UserContext';
import Constants from 'expo-constants';

// Interfaces para TypeScript
interface LoginResponse {
  access_token?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    nombre?: string;
    apellido?: string;
    cedula?: string;
    telefono?: string;
    activo?: boolean;
    rol?: number; // Campo rol de la base de datos
  };
}

interface ApiError {
  message?: string;
  error?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Validar campos vacíos
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa email y contraseña');
      return;
    }

    setError('');
    setLoading(true);
    const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:3001/';
    
    try {
      const response = await fetch(`${API_URL}auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password 
        })
      });

      let data: LoginResponse = {};
      try {
        data = await response.json() as LoginResponse;
      } catch (e) {
        data = {};
      }

      // Éxito si status 2xx y hay access_token
      if (response.ok && data.access_token) {
        // Validar que el usuario esté activo
        if (data.user?.activo === false) {
          setError('Tu cuenta está inactiva. Contacta al administrador');
          return;
        }

        // Validar que el usuario tenga rol 3
        if (!data.user?.rol || data.user.rol !== 3) {
          setError('No tienes permisos para acceder a esta aplicación');
          return;
        }

        // Guardar datos del usuario en el contexto
        setUser({
          nombre: data.user.nombre || '',
          apellido: data.user.apellido || '',
          token: data.access_token || ''
        });

        setError('');
        Keyboard.dismiss();
        router.push({
          pathname: '/screens/HomeChoferScreen',
          params: {
            user: JSON.stringify({
              nombre: data.user?.nombre,
              apellido: data.user?.apellido
            })
          }
        });

      } else if (response.status === 401) {
        setError('Correo o contraseña incorrectos');
      } else if (data.message) {
        setError(data.message);
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente');
      }

    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión. Verifica tu internet');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navegar a pantalla de recuperación de contraseña
    Alert.alert('Función no implementada', 'Próximamente disponible');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <LinearGradient
            colors={['#B3C6FF', '#FFFFFF']}
            style={styles.gradient}
          />
          <View style={styles.contentContainer}>
            <Image 
              source={require('../../assets/images/welco.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Text style={styles.title}>Inicio Sesión</Text>
            <Text style={styles.subtitle}>
              ¡Escanea, valida y controla los asientos de tu bus fácilmente!
            </Text>

            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="hello@example.com"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(''); // Limpiar error al escribir
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Contraseña</Text>
                <TouchableOpacity 
                  onPress={handleForgotPassword} 
                  style={styles.forgotPasswordBtn}
                  disabled={loading}
                >
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={[styles.inputPassword, error && styles.inputError]}
                  placeholder="••••••••••••••••"
                  placeholderTextColor="#BDBDBD"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError(''); // Limpiar error al escribir
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButtonInside}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#BDBDBD"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Mostrar error si existe */}
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Botón de Login */}
            <TouchableOpacity 
              style={[styles.primaryButton, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  inputError: {
    borderColor: '#EF4444',
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
    paddingRight: 44,
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
  errorContainer: {
    width: '100%',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
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
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});