// components/layout/navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import '../../assets/styles/navbar.css';
import { useState, useEffect } from 'react';
import { useProducts } from '../../features/hooks/useProducts';
import { useAuth } from '../../context/authProvider';
import { Shield, Package, Plus, LogIn, UserPlus, User as UserIconLucide, ChevronDown, ChevronRight } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const { clearSearch } = useProducts();
    const { isAuthenticated, user, isAdmin: authIsAdmin } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

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
        setOpenSubmenu(null);
    }, [location.pathname]);

    const categories = [
        { 
            path: '/alimentos', 
            label: 'Alimentos',
            hasSubmenu: true,
            submenu: [
                { path: '/alimentos?pet=perro', label: 'Perro', petType: 'perro' },
                { path: '/alimentos?pet=gato', label: 'Gato', petType: 'gato' },
                // { path: '/alimentos?pet=ambos', label: ' Ambos', petType: 'ambos' }
            ]
        },
        { 
            path: '/accesorios', 
            label: 'Accesorios',
            hasSubmenu: true,
            submenu: [
                { path: '/accesorios?pet=perro', label: 'Perro', petType: 'perro' },
                { path: '/accesorios?pet=gato', label: 'Gato', petType: 'gato' },
                { path: '/accesorios?pet=ambos', label: 'Ambos', petType: 'ambos' }
            ]
        },
        { 
            path: '/higiene', 
            label: 'Higiene',
            hasSubmenu: true,
            submenu: [
                { path: '/higiene?pet=perro', label: 'Perro', petType: 'perro' },
                { path: '/higiene?pet=gato', label: 'Gato', petType: 'gato' },
                { path: '/higiene?pet=ambos', label: 'Ambos', petType: 'ambos' }
            ]
        },
        { 
            path: '/indumentaria', 
            label: 'Indumentaria',
            hasSubmenu: true,
            submenu: [
                { path: '/indumentaria?pet=perro', label: 'Perro', petType: 'perro' },
                { path: '/indumentaria?pet=gato', label: 'Gato', petType: 'gato' },
                { path: '/indumentaria?pet=ambos', label: 'Ambos', petType: 'ambos' }
            ]
        },
        { 
            path: '/articulos', 
            label: 'Artículos',
            hasSubmenu: false,
            submenu: []
        },
        { 
            path: '/contacto', 
            label: 'Contacto',
            hasSubmenu: false,
            submenu: []
        }
    ];

    const adminLinks = [
        { path: '/admin/products', label: 'Productos', icon: <Package size={18} /> },
        { path: '/admin/products/new', label: 'Nuevo Producto', icon: <Plus size={18} /> },
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleAdminMenu = () => {
        setIsAdminMenuOpen(!isAdminMenuOpen);
    };

    const toggleSubmenu = (categoryLabel: string) => {
        if (openSubmenu === categoryLabel) {
            setOpenSubmenu(null);
        } else {
            setOpenSubmenu(categoryLabel);
        }
    };

    const handleNavClick = () => {
        clearSearch();
        setIsMenuOpen(false);
        setOpenSubmenu(null);
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
                {/* Sección Categorías con Submenús */}
                <div className="menu-section">
                    {categories.map(item => (
                        <div key={item.path} className="nav-item-wrapper">
                            {item.hasSubmenu ? (
                                <>
                                    <Link
                                        to={item.path}
                                        className={`nav-link nav-link-parent ${location.pathname === item.path ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSubmenu(item.label);
                                        }}
                                    >
                                        <span>{item.label}</span>
                                        {openSubmenu === item.label ? (
                                            <ChevronDown size={16} className="nav-chevron" />
                                        ) : (
                                            <ChevronRight size={16} className="nav-chevron" />
                                        )}
                                    </Link>
                                    <div className={`submenu ${openSubmenu === item.label ? 'open' : ''}`}>
                                        <Link
                                            to={item.path}
                                            onClick={handleNavClick}
                                            className="submenu-link submenu-all"
                                        >
                                            Todos
                                        </Link>
                                        {item.submenu.map(sub => (
                                            <Link
                                                key={sub.path}
                                                to={sub.path}
                                                onClick={handleNavClick}
                                                className={`submenu-link ${location.pathname + location.search === sub.path ? 'active' : ''}`}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <Link
                                    to={item.path}
                                    onClick={handleNavClick}
                                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
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

                {/* Sección Usuario Móvil */}
                <div className="mobile-user-section">
                    {!isAuthenticated ? (
                        <div className="mobile-user-btns-row">
                            <Link to="/login" className="mobile-user-btn login-btn" onClick={handleNavClick}>
                                <LogIn size={16} />
                                <span>Iniciar Sesión</span>
                            </Link>
                            <Link to="/register" className="mobile-user-btn register-btn" onClick={handleNavClick}>
                                <UserPlus size={16} />
                                <span>Registrarse</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="mobile-user-info">
                            <span className="mobile-user-name">¡Hola, {user?.name?.split(' ')[0]}!</span>
                            <div className="mobile-user-actions-row">
                                <Link to="/profile" className="mobile-user-btn profile-btn" onClick={handleNavClick}>
                                    <UserIconLucide size={16} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Botón FAB Admin */}
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