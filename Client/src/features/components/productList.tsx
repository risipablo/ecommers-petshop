import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import '../../assets/styles/productList.css';
import { Eye } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const ProductList = () => {
    const { filteredProducts, searchTerms, searchQuery } = useProducts();
    const location = useLocation();
    const currentPath = location.pathname;
    const categoryPath = currentPath.substring(1);

    // Determinar el título según el contexto
    const getTitle = () => {
        if (searchTerms && searchQuery.trim() !== '' && currentPath === '/search') {
            return `Resultados para: "${searchQuery}"`;
        }
        
        if (categoryPath && categoryPath !== 'todos' && categoryPath !== 'search') {
            // Capitalizar la primera letra
            const categoryName = categoryPath.charAt(0).toUpperCase() + categoryPath.slice(1);
            return `Productos de ${categoryName}`;
        }
        
        if (currentPath === '/search') {
            return "Todos los productos";
        }
        
        return "Productos para Mascotas";
    };

    // Guardar la ruta actual antes de navegar a un detalle
    const handleProductClick = () => {
        sessionStorage.setItem('lastProductListPath', location.pathname);
    };

    if (searchTerms && filteredProducts.length === 0 && currentPath === '/search') {
        return (
            <div className="no-results">
                <SearchOffIcon sx={{ fontSize: 80, color: '#9ca3af' }} />
                <h2>No se encontró ningún producto</h2>
                <p>Intenta con otros términos de búsqueda</p>
                {searchQuery && (
                    <p className="search-query">Buscaste: "{searchQuery}"</p>
                )}
                <Link to="/" className="back-to-home">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    if (filteredProducts.length === 0) {
        return (
            <div className="no-results">
                <h2>No hay productos disponibles en esta categoría</h2>
                <Link to="/" className="back-to-home">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="product-list-container">
            <h1 className="product-list-title">{getTitle()}</h1>
            <div className="product-grid">
                {filteredProducts.map(product => (
                    <div key={product._id} className="product-card">
                        <div className="product-image-wrapper">
                            <img 
                                src={product.image || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
                                alt={product.name} 
                                className="product-image"
                            />
                        </div>
                        
                        <div className="product-divider"></div>
                        
                        <div className="product-content">
                            <h3 className="product-name">{product.name}</h3>
                            
                            <div className="product-footer">
                                <span className="current-price">${product.price}</span>
                                <Link 
                                    className="view-more-btn" 
                                    to={`/item/${product._id}`}
                                    state={{ from: location.pathname }}
                                    onClick={handleProductClick}
                                >
                                    <Eye size={18} />
                                    Ver
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};