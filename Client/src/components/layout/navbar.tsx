import { Link, useLocation } from 'react-router-dom';
import '../../assets/styles/navbar.css';
import { useState, useEffect } from 'react';
import { useProducts } from '../../features/hooks/useProducts';
import { useAuth } from '../../context/authProvider'; // Importamos el auth hook
import { Shield, Package, Plus, Images, LayoutDashboard, User, LogIn, UserPlus, User as UserIconLucide } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const { clearSearch } = useProducts();
    const { isAuthenticated, user, isAdmin: authIsAdmin,  } = useAuth(); // Extraemos estado de auth
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin') === 'true' || authIsAdmin;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAdmin(adminStatus);
    }, [authIsAdmin]);

    // Cerrar menú al cambiar ruta
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMenuOpen(false);
        setIsAdminMenuOpen(false);
    }, [location.pathname]);

    const categories = [
        { path: '/alimentos', label: 'Alimentos' },
        { path: '/accesorios', label: 'Accesorios' },
        { path: '/higiene', label: 'Higiene' },
        { path: '/indumentaria', label: 'Indumentaria' },
        { path: '/articulos', label: 'Artículos' },
        { path: '/contacto', label: 'Contacto' }
    ];

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/admin/products', label: 'Productos', icon: <Package size={18} /> },
        { path: '/admin/products/new', label: 'Nuevo Producto', icon: <Plus size={18} /> },
        { path: '/admin/images', label: 'Gestionar Imágenes', icon: <Images size={18} /> }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleAdminMenu = () => {
        setIsAdminMenuOpen(!isAdminMenuOpen);
    };

    const handleNavClick = () => {
        clearSearch();
        setIsMenuOpen(false);
    };

    const handleAdminClick = () => {
        setIsAdminMenuOpen(false);
    };

    return (
        <nav className='navbar-container'>
            {/* Icono Hamburguesa */}
            <div 
                className={`menu-icon ${isMenuOpen ? 'open' : ''}`} 
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Menú Lateral */}
            <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
                {/* Sección Categorías */}
                <div className="menu-section">
                    {categories.map(item => (
                        <Link 
                            key={item.path}
                            to={item.path}
                            onClick={handleNavClick}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Sección Admin (solo si es admin) */}
                {isAdmin && (
                    <div className="menu-section admin-section">
                        <div className="section-title admin-title">
                            <Shield size={16} />
                            Administración
                        </div>
                        {adminLinks.map(item => (
                            <Link 
                                key={item.path}
                                to={item.path}
                                onClick={handleAdminClick}
                                className={`nav-link admin-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                )}


               
                <div className="mobile-user-section">
                    {!isAuthenticated ? (
                        <>
                            <div className="mobile-user-avatar">
                                <User size={22} />
                            </div>
                            <Link to="/login" className="mobile-user-btn login-btn">
                                <LogIn size={16} />
                                <span>Iniciar Sesión</span>
                            </Link>
                            <Link to="/register" className="mobile-user-btn register-btn">
                                <UserPlus size={16} />
                                <span>Registrarse</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="mobile-user-avatar authenticated">
                                <User size={22} />
                                <span className="mobile-status-dot"></span>
                            </div>
                            <div className="mobile-user-info">
                                <span className="mobile-user-name">¡Hola, {user?.name?.split(' ')[0]}!</span>
                            </div>
                            <div className="mobile-user-actions-row">
                                <Link to="/profile" className="mobile-user-btn profile-btn">
                                    <UserIconLucide size={16} />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            
            {isAdmin && (
                <div className="admin-fab" onClick={toggleAdminMenu} aria-label="Admin menu">
                    <Shield size={24} />
                    {isAdminMenuOpen && (
                        <div className="admin-fab-menu">
                            {adminLinks.map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={handleAdminClick}
                                    className="fab-link"
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;