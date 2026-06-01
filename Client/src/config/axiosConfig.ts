// config/axiosConfig.ts (versión minimalista y segura)
import axios from 'axios';

// Configuración global
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

// Interceptor para agregar token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
        
        if (error.response?.status === 429) {
            alert('Demasiadas peticiones. Por favor espera un momento.');
        }
        
        return Promise.reject(error);
    }
);

export default axios;