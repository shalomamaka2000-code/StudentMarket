
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../api';

export type Role = 'customer' | 'vendor' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  hostel?: string;
  roomNumber?: number;
  regNumber?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  regNumber?: string;
  hostel?: string;
  roomNumber?: number;
  role?: 'customer' | 'vendor';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'hostelMarketUser';
const TOKEN_KEY = 'token';

const loadUser = (): User | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(loadUser);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const persist = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, t);
  };

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await api.post<{ _id: string; name: string; email: string; role: Role; token: string }>(
      '/auth/login',
      { email, password }
    );
    const { token: jwt, ...userData } = data;
    const fullUser: User = { ...userData, _id: userData._id };
    persist(fullUser, jwt);
    return fullUser;
  };

  const signup = async (payload: SignupData): Promise<User> => {
    const { data } = await api.post<{ _id: string; name: string; email: string; role: Role; token: string }>(
      '/auth/register',
      payload
    );
    const { token: jwt, ...userData } = data;
    const fullUser: User = { ...userData, _id: userData._id };
    persist(fullUser, jwt);
    return fullUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};