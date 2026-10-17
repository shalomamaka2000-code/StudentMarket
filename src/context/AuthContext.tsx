import React, { createContext, use, useState, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  hostel: string;
  roomNumber: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  hostel: string;
  roomNumber: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'hostelMarketUser';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loadStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadStoredUser);

  const login = async (email: string, _password: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      hostel: 'Maple Hall',
      roomNumber: '204',
    };
    setUser(mockUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
  };

  const signup = async (data: SignupData): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      hostel: data.hostel,
      roomNumber: data.roomNumber,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext
      value={{ user, login, signup, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};