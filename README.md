# ChasquiBus - Aplicación Móvil para Choferes 🚌

## 📱 Descripción

ChasquiBus es una aplicación móvil desarrollada con **React Native** y **Expo** diseñada específicamente para choferes de transporte público. La aplicación permite a los choferes gestionar sus rutas, escanear códigos QR de boletos de pasajeros y administrar la lista de pasajeros durante sus viajes.

## ✨ Características Principales

- 🔐 **Autenticación de Usuarios**: Sistema de login seguro para choferes
- 📷 **Escáner QR**: Escaneo de códigos QR de boletos de pasajeros
- 🚌 **Gestión de Rutas**: Visualización de rutas asignadas para el día
- 👥 **Lista de Pasajeros**: Control y gestión de pasajeros a bordo
- 🎨 **Interfaz Moderna**: Diseño intuitivo y responsive
- 📱 **Multiplataforma**: Compatible con iOS y Android
- 🔄 **Navegación Fluida**: Sistema de navegación con drawer lateral

## 🛠️ Tecnologías Utilizadas

- **React Native** (0.79.3) - Framework principal
- **Expo** (53.0.10) - Plataforma de desarrollo
- **TypeScript** (5.8.3) - Tipado estático
- **Expo Router** (5.0.7) - Navegación
- **Expo Camera** (16.1.8) - Escáner de códigos QR
- **React Navigation** (7.1.6) - Navegación entre pantallas
- **AsyncStorage** (2.2.0) - Almacenamiento local
- **Expo Linear Gradient** (14.1.5) - Efectos visuales

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**

### Para desarrollo móvil:
- **Expo Go** (aplicación móvil para pruebas)
- **Android Studio** (para desarrollo Android)
- **Xcode** (para desarrollo iOS, solo macOS)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd chasquibus-movil-chofer-front
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración de la API
API_BASE_URL=https://tu-api-backend.com/api
API_TIMEOUT=10000

# Configuración de la aplicación
APP_NAME=ChasquiBus Chofer
APP_VERSION=1.0.0
```

### 4. Iniciar el Proyecto

```bash
# Iniciar en modo desarrollo
npm start
# o
expo start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en web
npm run web
```

## 📱 Estructura del Proyecto

```
chasquibus-movil-chofer-front/
├── app/                          # Directorio principal de la aplicación
│   ├── (tabs)/                   # Navegación por tabs
│   ├── screens/                  # Pantallas de la aplicación
│   │   ├── HomeChoferScreen.tsx  # Pantalla principal del chofer
│   │   ├── LoginScreen.tsx       # Pantalla de login
│   │   ├── QRScannerScreen.tsx   # Escáner de códigos QR
│   │   ├── ChoferRoutesScreen.tsx # Rutas del chofer
│   │   ├── PassengerListScreen.tsx # Lista de pasajeros
│   │   └── WelcomeScreen.tsx     # Pantalla de bienvenida
│   ├── context/                  # Contextos de React
│   │   └── UserContext.tsx       # Contexto de usuario
│   └── components/               # Componentes reutilizables
├── assets/                       # Recursos estáticos
│   ├── images/                   # Imágenes
│   └── fonts/                    # Fuentes
├── components/                   # Componentes globales
├── constants/                    # Constantes de la aplicación
├── hooks/                        # Hooks personalizados
└── scripts/                      # Scripts de utilidad
```

## 🎯 Funcionalidades Principales

### 1. Autenticación
- Login seguro con validación de credenciales
- Persistencia de sesión con AsyncStorage
- Logout con limpieza de datos

### 2. Escáner QR
- Escaneo de códigos QR de boletos
- Validación de boletos de pasajeros
- Interfaz intuitiva con marco de escaneo
- Cambio entre cámara frontal y trasera

### 3. Gestión de Rutas
- Visualización de rutas asignadas
- Información detallada de cada ruta
- Estado de las rutas (activa, completada, pendiente)

### 4. Lista de Pasajeros
- Control de pasajeros a bordo
- Validación de boletos escaneados
- Gestión de asientos ocupados

## 🔧 Scripts Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Iniciar en Android
npm run android

# Iniciar en iOS
npm run ios

# Iniciar en web
npm run web

# Ejecutar linting
npm run lint

# Resetear proyecto (limpiar cache)
npm run reset-project
```

## 📱 Configuración de Dispositivos

### Android
1. Instala **Expo Go** desde Google Play Store
2. Ejecuta `npm run android` o escanea el código QR con Expo Go

### iOS
1. Instala **Expo Go** desde App Store
2. Ejecuta `npm run ios` o escanea el código QR con Expo Go

### Web
1. Ejecuta `npm run web`
2. Abre tu navegador en `http://localhost:8081`

## 🔐 Configuración de Permisos

La aplicación requiere los siguientes permisos:

- **Cámara**: Para escanear códigos QR
- **Almacenamiento**: Para guardar datos localmente
- **Internet**: Para comunicación con la API

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests e2e
npm run test:e2e
```

## 📦 Build y Deploy

### Build para Producción

```bash
# Android
expo build:android

# iOS
expo build:ios

# Web
expo build:web
```

### Publicar en Stores

```bash
# Subir a Google Play Store
expo upload:android

# Subir a App Store
expo upload:ios
```

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de dependencias**
   ```bash
   npm install --force
   # o
   rm -rf node_modules && npm install
   ```

2. **Error de cache de Metro**
   ```bash
   npm run reset-project
   # o
   expo start --clear
   ```

3. **Problemas de permisos de cámara**
   - Verificar permisos en configuración del dispositivo
   - Reiniciar la aplicación

4. **Error de conexión con la API**
   - Verificar configuración de variables de entorno
   - Comprobar conectividad de red

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: NeoSoft
- **Diseño UI/UX**: NeoSoft
- **Backend**: Neosoft

## 📞 Soporte

Para soporte técnico o preguntas:

- 📧 Email: soporte@chasquibus.com
- 📱 WhatsApp: +593 968622132
- 🌐 Website: https://neosoft-a8aeb.web.app/

## 🔄 Changelog

### v1.0.0 (2024-01-XX)
- ✨ Lanzamiento inicial
- 🔐 Sistema de autenticación
- 📷 Escáner QR funcional
- 🚌 Gestión de rutas
- 👥 Lista de pasajeros

---

**¡Gracias por usar ChasquiBus! 🚌✨**
