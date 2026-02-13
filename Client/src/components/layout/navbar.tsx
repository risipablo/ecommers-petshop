import { Link, useLocation } from 'react-router-dom';
import '../../assets/styles/navbar.css';
import { useState } from 'react';
import { useProducts } from '../../features/hooks/useProducts';


const Navbar = () => {
    const location = useLocation();
    const { clearSearch } = useProducts();
    const [isMenu, setIsMenu] = useState(false);

    const categories = [
        { path: '/alimentos', label: 'Alimentos' },
        { path: '/accesorios', label: 'Accesorios' },
        { path: '/higiene', label: 'Higiene' },
        { path: '/indumentaria', label: 'Indumentaria' },
        { path: '/articulos', label: 'Articulos' },
        { path: '/contacto', label: 'Contacto' }
    ];

    const toggleMenu = () => {
        setIsMenu(!isMenu);
    };

    const handleNavClick = () => {
        // Limpiar búsqueda al hacer clic en cualquier categoría
        clearSearch();
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
        </nav>
    );
};

export default Navbar;