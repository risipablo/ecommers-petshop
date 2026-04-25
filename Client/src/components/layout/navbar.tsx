import { Link, useLocation } from 'react-router-dom';
import '../../assets/styles/navbar.css';
import { useState, useEffect } from 'react';
import { useProducts } from '../../features/hooks/useProducts';
import { Shield, Package, Plus, Images, LayoutDashboard,} from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const { clearSearch } = useProducts();
    const [isMenu, setIsMenu] = useState(false);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Verificar si es admin (puedes cambiar según tu lógica de autenticación)
    useEffect(() => {
       
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAdmin(adminStatus);
        
    }, []);

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
        setIsMenu(!isMenu);
        if (isAdminMenuOpen) setIsAdminMenuOpen(false);
    };

    const toggleAdminMenu = () => {
        setIsAdminMenuOpen(!isAdminMenuOpen);
    };

    const handleNavClick = () => {
        clearSearch();
        setIsMenu(false);
        setIsAdminMenuOpen(false);
    };

    const handleAdminClick = () => {
        setIsAdminMenuOpen(false);
        setIsMenu(false);
    };

    return (
        <nav className='navbar-container'>
            <div className={`menu-icon ${isMenu ? 'open' : ''}`} onClick={toggleMenu}> 
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={`menu ${isMenu ? 'open' : ''}`}>
                {/* Categorías de productos */}
                <div className="menu-section">
                    <div className="section-title">Productos</div>
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

                {/* Enlaces de administración (solo si es admin) */}
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

                {/* Enlace al home */}
                <Link 
                    to="/"
                    onClick={handleNavClick}
                    className={`nav-link home-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                    Inicio
                </Link>
            </div>

            {/* Botón flotante de admin para móvil */}
            {isAdmin && (
                <div className="admin-fab" onClick={toggleAdminMenu}>
                    <Shield size={20} />
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