import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi, userApi } from '../services/api';
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const currentUser = await userApi.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    const response: AuthResponse = await authApi.login(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.id,
      username: response.username,
      email: response.email,
      avatar: response.avatar,
      role: response.role,
      createdAt: new Date().toISOString(),
    }));
    setToken(response.token);
    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
      avatar: response.avatar,
      role: response.role,
      createdAt: new Date().toISOString(),
    });
  };

  const register = async (data: RegisterRequest) => {
    const response: AuthResponse = await authApi.register(data);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.id,
      username: response.username,
      email: response.email,
      avatar: response.avatar,
      role: response.role,
      createdAt: new Date().toISOString(),
    }));
    setToken(response.token);
    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
      avatar: response.avatar,
      role: response.role,
      createdAt: new Date().toISOString(),
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
