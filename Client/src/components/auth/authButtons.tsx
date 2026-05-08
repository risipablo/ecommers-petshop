// components/auth/AuthButtons.tsx
import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/authProvider';
import { UserMenu } from './userMenu';
import { LoginModal } from './loginModal';
import { RegisterModal } from './registerModal';
import "../../assets/styles/auth.css"

export const AuthButtons = () => {
    const { isAuthenticated } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    if (isAuthenticated) {
        return <UserMenu />;
    }

    return (
        <>
            <div className="auth-buttons">
                <button 
                    className="auth-btn-outline"
                    onClick={() => setShowLogin(true)}
                >
                    <LogIn size={18} />
                    <span>Iniciar Sesión</span>
                </button>
                <button 
                    className="auth-btn-primary"
                    onClick={() => setShowRegister(true)}
                >
                    <UserPlus size={18} />
                    <span>Registrarse</span>
                </button>
            </div>

            <LoginModal 
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
            />

            <RegisterModal 
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />
        </>
    );
};