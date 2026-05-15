// context/authProvider.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode, } from 'react';
import axios from 'axios';
import type {
    User,
    AuthContextType,
    LoginCredentials,
    RegisterCredentials,
    ChangeNameCredentials,
    ChangePasswordCredentials,
    ForgotPasswordCredentials,
    ResetPasswordCredentials
} from '../features/types/auth.types';

import  {config} from "../config/index"

const API_URL = config.Api;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success && response.data.data) {
                setUser(response.data.data);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
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
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
                return response.data;
            }
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error: string } } }).response?.data?.error || 'Error al registrarse';
            setError(errorMsg);
            throw new Error(errorMsg);
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
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }
                return response.data;
            }
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error: string } } }).response?.data?.error || 'Error al iniciar sesión';
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

    const changeName = async (credentials: ChangeNameCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/auth/change-name`, credentials, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setUser(response.data.data);
                return response.data;
            }
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error: string } } }).response?.data?.error || 'Error al cambiar nombre';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (credentials: ChangePasswordCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/auth/change-password`, credentials, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                return response.data;
            }
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error: string } } }).response?.data?.error || 'Error al cambiar contraseña';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (credentials: ForgotPasswordCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, credentials);
            return response.data;
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error: string } } }).response?.data?.error || 'Error al enviar email de recuperación';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (credentials: ResetPasswordCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, credentials);
            return response.data;
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error: string } } }).response?.data?.error || 'Error al restablecer contraseña';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const isAdmin = user?.role === 'admin';

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
            changeName,
            changePassword,
            forgotPassword,
            resetPassword,
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