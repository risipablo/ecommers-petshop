// components/auth/MobileUserAuth.tsx
import { useState } from 'react';
import { User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/authProvider';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from './loginModal';
import { RegisterModal } from './registerModal';
import '../../assets/styles/mobile.auth.css';

export const MobileUserAuth = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    if (isAuthenticated) {
        return (
            <div className="mobile-user-auth authenticated">
                <button className="user-auth-btn user-greeting">
                    <User size={20} />
                    <span>{user?.name?.split(' ')[0] || 'Usuario'}</span>
                </button>
                <button 
                    className="user-auth-btn profile-btn"
                    onClick={handleProfile}
                    title="Ver perfil"
                >
                    <User size={20} />
                    <span>Perfil</span>
                </button>
                <button 
                    className="user-auth-btn logout-btn"
                    onClick={handleLogout}
                    title="Cerrar sesión"
                >
                    <LogOut size={20} />
                    <span>Salir</span>
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="mobile-user-auth unauthenticated">
                <button 
                    className="user-auth-btn login-btn"
                    onClick={() => setShowLogin(true)}
                    title="Iniciar sesión"
                >
                    <LogIn size={20} />
                    <span>Iniciar sesión</span>
                </button>
                <button 
                    className="user-auth-btn register-btn"
                    onClick={() => setShowRegister(true)}
                    title="Crear cuenta"
                >
                    <UserPlus size={20} />
                    <span>Crear cuenta</span>
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