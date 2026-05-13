// components/common/userIcon.tsx
import { useState } from 'react';
import { User, LogIn, UserPlus, LogOut, Package, User as UserIconLucide } from 'lucide-react';
import { useAuth } from '../../context/authProvider';
import { useNavigate } from 'react-router-dom';
import { LoginModal } from '../auth/loginModal';
import { RegisterModal } from '../auth/registerModal';
import '../../assets/styles/userIcon.css';

export const UserIcon = () => {
    const { isAuthenticated, user, isAdmin, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profile');
        setIsDropdownOpen(false);
    };

    const handleCrud = () => {
        navigate('/crud');
        setIsDropdownOpen(false);
    };

    // Si no está autenticado, mostrar solo el ícono
    if (!isAuthenticated) {
        return (
            <>
                <div className="user-icon-wrapper" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <div className="user-icon-container">
                        <User size={24} />
                    </div>
                </div>

                {isDropdownOpen && (
                    <div className="user-dropdown">
                        <button 
                            className="dropdown-item"
                            onClick={() => {
                                setIsDropdownOpen(false);
                                setShowLogin(true);
                            }}
                        >
                            <LogIn size={18} />
                            Iniciar Sesión
                        </button>
                        <button 
                            className="dropdown-item"
                            onClick={() => {
                                setIsDropdownOpen(false);
                                setShowRegister(true);
                            }}
                        >
                            <UserPlus size={18} />
                            Registrarse
                        </button>
                    </div>
                )}

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
    }

    // Si está autenticado, mostrar ícono con saludo
    return (
        <>
            <div className="user-icon-wrapper authenticated" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div className="user-greeting">
                    ¡Hola, {user?.name?.split(' ')[0]}!
                </div>
                <div className="user-icon-container">
                    <User size={24} />
                    <span className="user-status-dot"></span>
                </div>
            </div>

            {isDropdownOpen && (
                <div className="user-dropdown">
                    <div className="dropdown-header">
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button className="dropdown-item" onClick={handleProfile}>
                        <UserIconLucide size={18} />
                        Mi Perfil
                    </button>
                    
                    {isAdmin && (
                        <button className="dropdown-item admin" onClick={handleCrud}>
                            <Package size={18} />
                            Gestionar Productos
                        </button>
                    )}
                    
                    <div className="dropdown-divider"></div>
                    
                    <button className="dropdown-item logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </>
    );
};