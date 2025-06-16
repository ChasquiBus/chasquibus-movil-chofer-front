import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  user: {
    nombre: string;
    apellido: string;
  } | null;
  setUser: (user: { nombre: string; apellido: string } | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ nombre: string; apellido: string } | null>(null);

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