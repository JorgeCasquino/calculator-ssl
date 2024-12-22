import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  
  // No sobrescribir el Content-Type si ya está establecido (para form-data)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Si no es una petición multipart/form-data, usar application/json
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;