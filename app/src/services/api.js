import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - ajustar para o endereço correto do backend
const API_URL = 'http://10.0.2.2:3000/api'; // Para emulador Android
// const API_URL = 'http://localhost:3000/api'; // Para iOS ou web

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação a todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@CineScope:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Se o token expirou (status 401), podemos fazer logout automático
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('@CineScope:token');
      await AsyncStorage.removeItem('@CineScope:user');
      // Aqui você pode adicionar lógica para redirecionar para a tela de login
    }
    return Promise.reject(error);
  }
);

export default api;
