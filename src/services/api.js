import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Request Interceptor: Agrega el JWT a cada petición si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Manejo global de errores como tokens expirados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Sesión expirada o inválida, cerrando sesión local...');
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
      const publicPaths = ['/', '/login', '/registro', '/agendar'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
