// components/auth/UserMenu.tsx (actualizar)
import { useEffect, useRef, useState } from 'react';
import { User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/authProvider';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/auth.css'

export const UserMenu = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        navigate('/');
    };

    if (!isAuthenticated) return null;

    return (
        <div className="user-menu-container"  ref={containerRef}>
            <button className="user-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                
                <User size={20} />
                <span>{user?.name?.split(' ')[0] || 'Usuario'}</span>
            </button>
            
            {isOpen && (
                <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                        <span className="user-role-badge">
                            {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </span>
                    </div>
                    
                    <div className="user-menu-divider"></div>
                    
                    
                    {isAdmin && (
                        <>
                            <button 
                                className="user-menu-item"
                                onClick={() => {
                                    navigate('/crud');
                                    setIsOpen(false);
                                }}
                            >
                                <Package size={18} />
                                Gestionar Productos
                            </button>
                            <button 
                                className="user-menu-item"
                                onClick={() => {
                                    navigate('/admin/products');
                                    setIsOpen(false);
                                }}
                            >
                                <LayoutDashboard size={18} />
                                Panel Admin
                            </button>
                            <div className="user-menu-divider"></div>
                        </>
                    )}
                    
                    <button className="user-menu-item logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};