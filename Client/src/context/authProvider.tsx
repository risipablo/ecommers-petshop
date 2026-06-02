// context/authProvider.tsx (actualizado con seguridad)
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axiosInstance from '../config/axiosConfig';
import { sanitizeInput, validateEmail, validatePassword, hasSQLInjection } from '../components/utils/security';
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
import { config } from '../config';

const API_URL = config.Api;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get(`${API_URL}/auth/me`);
            if (response.data.success && response.data.data) {
                setUser(response.data.data);
                setIsAuthenticated(true);
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        setError(null);
        
        // Sanitizar inputs
        const sanitizedName = sanitizeInput(credentials.name);
        const sanitizedEmail = sanitizeInput(credentials.email);
        
        // Validar email
        if (!validateEmail(sanitizedEmail)) {
            setError('Email inválido');
            setIsLoading(false);
            throw new Error('Email inválido');
        }
        
        // Validar contraseña
        const passwordValidation = validatePassword(credentials.password);
        if (!passwordValidation.valid) {
            const passwordError = passwordValidation.error ?? 'Contraseña inválida';
            setError(passwordError);
            setIsLoading(false);
            throw new Error(passwordError);
        }
        
        // Detectar SQL Injection
        if (hasSQLInjection(sanitizedName) || hasSQLInjection(sanitizedEmail)) {
            setError('Datos inválidos');
            setIsLoading(false);
            throw new Error('Datos inválidos');
        }
        
        try {
            const response = await axiosInstance.post(`${API_URL}/auth/register`, {
                name: sanitizedName,
                email: sanitizedEmail,
                password: credentials.password,
                confirmPassword: credentials.confirmPassword
            });
            
            if (response.data.success) {
                setUser(response.data.data);
                setIsAuthenticated(true);
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

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        
        const sanitizedEmail = sanitizeInput(credentials.email);
        
        if (!validateEmail(sanitizedEmail)) {
            setError('Email inválido');
            setIsLoading(false);
            throw new Error('Email inválido');
        }
        
        try {
            const response = await axiosInstance.post(`${API_URL}/auth/login`, {
                email: sanitizedEmail,
                password: credentials.password
            });
            
            if (response.data.success) {
                setUser(response.data.data);
                setIsAuthenticated(true);
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

    const changeName = async (credentials: ChangeNameCredentials) => {
        setIsLoading(true);
        setError(null);
        
        const sanitizedName = sanitizeInput(credentials.name);
        
        if (sanitizedName.length < 2) {
            setError('El nombre debe tener al menos 2 caracteres');
            setIsLoading(false);
            throw new Error('El nombre debe tener al menos 2 caracteres');
        }
        
        try {
            const response = await axiosInstance.put(`${API_URL}/auth/change-name`, { name: sanitizedName });
            if (response.data.success) {
                setUser(response.data.data);
                return response.data;
            }
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al cambiar nombre';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const changePassword = async (credentials: ChangePasswordCredentials) => {
        setIsLoading(true);
        setError(null);
        
        const passwordValidation = validatePassword(credentials.newPassword);
        if (!passwordValidation.valid) {
            const passwordError = passwordValidation.error ?? 'Contraseña inválida';
            setError(passwordError);
            setIsLoading(false);
            throw new Error(passwordError);
        }
        
        try {
            const response = await axiosInstance.put('/auth/change-password', credentials);
            if (response.data.success) {
                return response.data;
            }
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al cambiar contraseña';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (credentials: ForgotPasswordCredentials) => {
        setIsLoading(true);
        setError(null);
        
        const sanitizedEmail = sanitizeInput(credentials.email);
        
        if (!validateEmail(sanitizedEmail)) {
            setError('Email inválido');
            setIsLoading(false);
            throw new Error('Email inválido');
        }
        
        try {
            const response = await axiosInstance.post(`${API_URL}/auth/forgot-password`, { email: sanitizedEmail });
            return response.data;
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al enviar email de recuperación';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (credentials: ResetPasswordCredentials) => {
        setIsLoading(true);
        setError(null);
        
        const passwordValidation = validatePassword(credentials.newPassword);
        if (!passwordValidation.valid) {
            const passwordError = passwordValidation.error ?? 'Contraseña inválida';
            setError(passwordError);
            setIsLoading(false);
            throw new Error(passwordError);
        }
        
        try {
            const response = await axiosInstance.post(`${API_URL}/auth/reset-password`, credentials);
            return response.data;
        } catch (err: unknown) {
            const errorMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error al restablecer contraseña';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post(`${API_URL}/auth/logout`);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
        } catch (err: unknown) {
            console.error('Error al cerrar sesión:', (err as Error).message);
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