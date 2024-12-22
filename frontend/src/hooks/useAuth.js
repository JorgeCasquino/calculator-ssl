import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    setUser(response.data.user);
  };

  const register = async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    setUser(response.data.user);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
  };
};