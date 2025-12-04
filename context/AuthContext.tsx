import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = [
  'rodrigo@youngempreendimentos.com.br',
  'eduardo@youngempreendimentos.com.br',
  'suelen@youngempreendimentos.com.br'
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking session persistence
    const storedUser = localStorage.getItem('young_ats_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async () => {
    setLoading(true);
    // SIMULATED GOOGLE LOGIN
    // In a real app, this would be: await signInWithPopup(auth, googleProvider);
    
    // We mock a successful login as an Admin for demonstration
    const mockUser: User = {
      email: 'rodrigo@youngempreendimentos.com.br',
      name: 'Rodrigo (Admin)',
      photoURL: 'https://ui-avatars.com/api/?name=Rodrigo&background=fe5009&color=fff',
      role: 'admin' // Default to admin for demo
    };

    // Whitelist Check
    const isWhitelisted = ADMIN_EMAILS.includes(mockUser.email) || mockUser.email.endsWith('@youngempreendimentos.com.br');
    
    // If not admin specifically but in domain, maybe 'user'
    if (!isWhitelisted) {
        alert("Acesso negado. Usuário não autorizado.");
        setLoading(false);
        return;
    }

    // Determine role based on specific emails
    if (ADMIN_EMAILS.includes(mockUser.email)) {
        mockUser.role = 'admin';
    } else {
        mockUser.role = 'user';
    }

    localStorage.setItem('young_ats_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const signOut = () => {
    localStorage.removeItem('young_ats_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};