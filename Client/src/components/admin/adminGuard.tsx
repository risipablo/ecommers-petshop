// components/admin/adminGuard.tsx
import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authProvider';

interface AdminGuardProps {
    children: ReactNode;
    redirectTo?: string;
}

export const AdminGuard = ({ children, redirectTo = '/' }: AdminGuardProps) => {
    const { isAuthenticated, isAdmin, isLoading, checkAuth, user } = useAuth();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verify = async () => {
            await checkAuth();
            setIsVerifying(false);
        };
        verify();
    }, []);

    if (isLoading || isVerifying) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Verificando permisos...</p>
            </div>
        );
    }

    console.log('🔒 AdminGuard - Estado:', { isAuthenticated, isAdmin, userEmail: user?.email, userRole: user?.role });

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};