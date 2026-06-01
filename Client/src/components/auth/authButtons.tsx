// components/auth/AuthButtons.tsx
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/authProvider';
import { UserMenu } from './userMenu';
import "../../assets/styles/auth.css"

export const AuthButtons = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <UserMenu />;
    }

    return (
        <div className="auth-buttons">
            <Link to="/login" className="auth-btn-outline">
                <LogIn size={18} />
                <span>Iniciar Sesión</span>
            </Link>
            <Link to="/register" className="auth-btn-primary">
                <UserPlus size={18} />
                <span>Registrarse</span>
            </Link>
        </div>
    );
};