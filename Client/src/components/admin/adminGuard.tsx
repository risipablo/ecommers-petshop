// components/admin/AdminGuard.tsx (versión simplificada)
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authProvider';

interface AdminGuardProps {
    children: ReactNode;
    redirectTo?: string;
}

export const AdminGuard = ({ children, redirectTo = '/' }: AdminGuardProps) => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    // Mostrar loading mientras verifica
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Verificando acceso...</p>
            </div>
        );
    }

    // Si no está autenticado o no es admin, redirigir
    if (!isAuthenticated || !isAdmin) {
        return <Navigate to={redirectTo} replace />;
    }

    // Si es admin, mostrar el contenido
    return <>{children}</>;
};