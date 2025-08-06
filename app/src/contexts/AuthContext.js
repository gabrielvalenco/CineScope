import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// Criando o contexto de autenticação
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStorageData() {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem('@CineScope:user');
        const storedToken = await AsyncStorage.getItem('@CineScope:token');

        if (storedUser && storedToken) {
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do storage:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = async (email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      await AsyncStorage.setItem('@CineScope:user', JSON.stringify(user));
      await AsyncStorage.setItem('@CineScope:token', token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      setError(message);
      return { success: false, message };
    }
  };

  const signUp = async (username, email, password) => {
    setError(null);
    try {
      const response = await api.post('/auth/register', { username, email, password });
      const { user, token } = response.data;

      await AsyncStorage.setItem('@CineScope:user', JSON.stringify(user));
      await AsyncStorage.setItem('@CineScope:token', token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      setError(message);
      return { success: false, message };
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@CineScope:user');
    await AsyncStorage.removeItem('@CineScope:token');
    setUser(null);
    api.defaults.headers.Authorization = null;
  };

  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/me', userData);
      const updatedUser = response.data.user;

      await AsyncStorage.setItem('@CineScope:user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil.';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
