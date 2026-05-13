// context/authProvider.tsx
import{ createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { AuthContextType, LoginCredentials, RegisterCredentials, User } from '../features/types/auth.types';


const API_URL = "https://ecommers-petshop.onrender.com/api"
const AuthContext = createContext<AuthContextType | undefined>(undefined);

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Configurar axios para enviar cookies
    axios.defaults.withCredentials = true;

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setIsLoading(false);
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success && response.data.data) {
                setUser(response.data.data);
                setIsAuthenticated(true);
                // Actualizar token si es necesario
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            }
        } catch (err) {
            console.error('Error verificando auth:', err);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            if (response.data.success) {
                setUser(response.data.data);
                setIsAuthenticated(true);
                // Guardar token en localStorage
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
                return response.data;
            }
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al iniciar sesión';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/auth/register`, credentials);
            if (response.data.success) {
                setUser(response.data.data);
                setIsAuthenticated(true);
                // Guardar token en localStorage
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
                return response.data;
            }
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al registrarse';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/auth/logout`);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
        } catch (err) {
            console.error('Error al cerrar sesión:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const isAdmin = user?.role === 'admin';

       console.log('📊 Estado actual:', { isAuthenticated, isAdmin, userRole: user?.role });

       
    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            error,
            login,
            register,
            logout,
            checkAuth,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};