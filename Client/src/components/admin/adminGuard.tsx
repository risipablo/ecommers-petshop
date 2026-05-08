// components/admin/AdminGuard.tsx

import { Navigate } from 'react-router-dom';

import type { ReactNode } from 'react';
import { useAuth } from '../../context/authProvider';

interface AdminGuardProps {
    children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return <div className="loading-container">Verificando permisos...</div>;
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};