import { Link, useLocation } from 'react-router-dom';
import '../../assets/styles/navbar.css';
import { useState, useEffect } from 'react';
import { useProducts } from '../../features/hooks/useProducts';

import {
    Shield,
    Package,
    Plus,
    Images,
    LayoutDashboard,
    Shirt,
    Heart,
    Phone,
    ShoppingBag
} from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const { clearSearch } = useProducts();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAdmin(adminStatus);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMenuOpen(false);
    }, [location.pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const handleNavClick = () => {
        clearSearch();
        setIsMenuOpen(false);
    };

    const categories = [
        { path: '/alimentos', label: 'Alimentos', icon: <ShoppingBag size={18} /> },
        { path: '/accesorios', label: 'Accesorios', icon: <Package size={18} /> },
        { path: '/higiene', label: 'Higiene', icon: <Heart size={18} /> },
        { path: '/indumentaria', label: 'Indumentaria', icon: <Shirt size={18} /> },
        { path: '/articulos', label: 'Artículos', icon: <Package size={18} /> },
        { path: '/contacto', label: 'Contacto', icon: <Phone size={18} /> }
    ];

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/admin/products', label: 'Productos', icon: <Package size={18} /> },
        { path: '/admin/products/new', label: 'Nuevo Producto', icon: <Plus size={18} /> },
        { path: '/admin/images', label: 'Imágenes', icon: <Images size={18} /> }
    ];

    return (
        <>
            {/* OVERLAY */}
            <div
                className={`overlay ${isMenuOpen ? 'open' : ''}`}
                onClick={() => setIsMenuOpen(false)}
            />

            <nav className="navbar-container">

                {/* BOTÓN HAMBURGUESA */}
                <div
                    className={`menu-icon ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* MENÚ */}
                <div className={`menu ${isMenuOpen ? 'open' : ''}`}>

                    {/* CATEGORÍAS */}
                    <div className="menu-section">
                        {categories.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={handleNavClick}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* ADMIN */}
                    {isAdmin && (
                        <div className="menu-section">
                            <div className="section-title">
                                <Shield size={14} />
                                Administración
                            </div>

                            {adminLinks.map(item => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={handleNavClick}
                                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* HOME */}
                    <Link
                        to="/"
                        onClick={handleNavClick}
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Inicio</span>
                    </Link>

                </div>
            </nav>
        </>
    );
};

export default Navbar;