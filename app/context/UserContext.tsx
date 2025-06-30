import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface UserContextType {
  user: {
    nombre: string;
    apellido: string;
    token: string;
  } | null;
  setUser: (user: { nombre: string; apellido: string; token: string } | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<{ nombre: string; apellido: string; token: string } | null>(null);

  // Guardar usuario en AsyncStorage (móvil) o localStorage (web)
  const setUser = async (user: { nombre: string; apellido: string; token: string } | null) => {
    setUserState(user);
    if (user) {
      if (Platform.OS === 'web') {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
    } else {
      if (Platform.OS === 'web') {
        localStorage.removeItem('user');
      } else {
        await AsyncStorage.removeItem('user');
      }
    }
  };

  // Al montar, leer usuario de AsyncStorage (móvil) o localStorage (web) si existe
  useEffect(() => {
    const loadUser = async () => {
      let storedUser = null;
      if (Platform.OS === 'web') {
        storedUser = localStorage.getItem('user');
      } else {
        storedUser = await AsyncStorage.getItem('user');
      }
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 