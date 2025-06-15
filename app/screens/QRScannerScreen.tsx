import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function QRScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return; // Evita múltiples escaneos
    
    setScanned(true);
    processQRData(data);
  };

  const processQRData = (data: string) => {
    try {
      // Intenta parsear como JSON (para códigos QR estructurados)
      const qrData = JSON.parse(data);
      
      // Si es un boleto de transporte
      if (qrData.type === 'ticket' || qrData.pasajero || qrData.asiento) {
        Alert.alert(
          'Boleto Válido ✅',
          `Pasajero: ${qrData.pasajero || qrData.passenger || 'No especificado'}\n` +
          `Asiento: ${qrData.asiento || qrData.seat || 'No especificado'}\n` +
          `Fecha: ${qrData.fecha || qrData.date || 'No especificada'}\n` +
          `Destino: ${qrData.destino || qrData.destination || 'No especificado'}`,
          [
            {
              text: 'Escanear otro',
              onPress: () => setScanned(false),
            },
            {
              text: 'Volver',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        // Para otros tipos de QR estructurados
        Alert.alert(
          'QR Escaneado',
          `Tipo: ${qrData.type || 'Desconocido'}\nContenido: ${JSON.stringify(qrData, null, 2)}`,
          [
            {
              text: 'Escanear otro',
              onPress: () => setScanned(false),
            },
            {
              text: 'Volver',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      // Si no es JSON, verifica si es una URL
      if (data.startsWith('http://') || data.startsWith('https://')) {
        Alert.alert(
          'URL Escaneada 🔗',
          `Enlace: ${data}`,
          [
            {
              text: 'Escanear otro',
              onPress: () => setScanned(false),
            },
            {
              text: 'Volver',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        // Para texto plano
        Alert.alert(
          'QR Escaneado 📄',
          `Contenido: ${data}`,
          [
            {
              text: 'Escanear otro',
              onPress: () => setScanned(false),
            },
            {
              text: 'Volver',
              onPress: () => router.back(),
            },
          ]
        );
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    // Los permisos de cámara aún se están cargando
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient colors={['#B3C6FF', '#FFFFFF']} style={styles.gradient} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1200d3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escáner QR</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.loadingContainer}>
            <Ionicons name="camera" size={80} color="#1200d3" />
            <Text style={styles.loadingText}>Cargando cámara...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    // Los permisos de cámara no están otorgados
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <LinearGradient colors={['#B3C6FF', '#FFFFFF']} style={styles.gradient} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#1200d3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Escáner QR</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.permissionContainer}>
            <Ionicons name="camera-outline" size={80} color="#ff6b6b" />
            <Text style={styles.permissionTitle}>Acceso a Cámara Requerido</Text>
            <Text style={styles.permissionText}>
              Para usar el escáner QR necesitamos acceso a tu cámara
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Ionicons name="camera" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.permissionButtonText}>Permitir Cámara</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'aztec', 'ean13', 'ean8', 'upc_e', 'datamatrix', 'code128', 'code39', 'codabar', 'itf14', 'upc_a'],
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitleWhite}>Escáner QR</Text>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Overlay con marco de escaneo */}
        <View style={styles.overlay}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            {/* Línea de escaneo animada */}
            <View style={styles.scanLine} />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.instructionsText}>
            Apunta la cámara hacia el código QR
          </Text>
          
          <View style={styles.buttonContainer}>
            {scanned && (
              <TouchableOpacity 
                style={styles.scanAgainButton} 
                onPress={() => setScanned(false)}
              >
                <Ionicons name="refresh" size={24} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.scanAgainButtonText}>Escanear de nuevo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
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
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  flipButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerTitleWhite: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#1200d3',
    marginTop: 20,
    fontWeight: '600',
  },
  permissionContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#1200d3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00ff88',
    borderWidth: 0,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#00ff88',
    opacity: 0.8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#1200d3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    minWidth: 200,
  },
  scanAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});