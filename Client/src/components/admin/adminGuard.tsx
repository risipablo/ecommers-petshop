// components/admin/AdminGuard.tsx
import {  useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminGuardProps {
    children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        // Verificar si es admin
        const checkAdmin = () => {
            // Opción 1: Variable de entorno
            const adminStatus = localStorage.getItem('isAdmin') === 'true';
            
            // Opción 2: Token o autenticación
            // const token = localStorage.getItem('adminToken');
            
            setIsAdmin(adminStatus);
        };

        checkAdmin();
    }, []);

    if (isAdmin === null) {
        return <div className="loading-container">Verificando permisos...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};