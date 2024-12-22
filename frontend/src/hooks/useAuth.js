// src/hooks/useAuth.js
import { useState } from 'react';
import api from '../components/services/Api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Intentando login con:', credentials); // Debug log
      
      const response = await api.post('/auth/login', credentials);
      
      console.log('Respuesta del servidor:', response.data); // Debug log
      
      // Guardar el token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      console.error('Error en login:', err.response?.data || err); // Debug log
      const errorMessage = err.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error al registrar usuario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    error,
    loading,
    login,
    logout,
    register
  };
};