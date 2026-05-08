// features/components/ProductList.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import '../../assets/styles/productList.css';
import { Eye, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductSkeletonGrid } from '../../components/common/productSkeleton';

export const ProductList = () => {
    const { filteredProducts, searchTerms, searchQuery, isLoading } = useProducts();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const categoryPath = currentPath.substring(1);
    const [localProducts, setLocalProducts] = useState(filteredProducts);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    useEffect(() => {
        if (!isLoading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalProducts(filteredProducts);
        }
    }, [filteredProducts, isLoading]);

    const getTitle = () => {
        if (searchTerms && searchQuery.trim() !== '' && currentPath === '/search') {
            return `Resultados para: "${searchQuery}"`;
        }
        
        if (categoryPath && categoryPath !== 'todos' && categoryPath !== 'search' && !categoryPath.includes('edit-product') && !categoryPath.includes('admin')) {
            const categoryName = categoryPath.charAt(0).toUpperCase() + categoryPath.slice(1);
            return `Productos de ${categoryName}`;
        }
        
        if (currentPath === '/search') {
            return "Todos los productos";
        }
        
        return "Productos para Mascotas";
    };

    const handleProductClick = (productId: string) => {
        sessionStorage.setItem('lastProductListPath', location.pathname);
        navigate(`/item/${productId}`, { state: { from: location.pathname } });
    };

    const toggleWishlist = (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        setWishlist(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    };

    if (isLoading && localProducts.length === 0) {
        return (
            <div className="product-list-container">
                <h1 className="product-list-title">{getTitle()}</h1>
                <ProductSkeletonGrid count={8} />
            </div>
        );
    }

    if (searchTerms && localProducts.length === 0 && currentPath === '/search') {
        return (
            <div className="no-results">
                <SearchOffIcon sx={{ fontSize: 80, color: '#d4a574' }} />
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

    if (localProducts.length === 0 && !isLoading) {
        return (
            <div className="no-results">
                <h2>No hay productos disponibles en esta categoría</h2>
                <Link to="/" className="back-to-home">
                    Volver al inicio
                </Link>
            </div>
        );
    }

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'number' ? price : parseFloat(price);
        return numPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    return (
        <div className="product-list-container">
            <div className="page-header">
                <h1 className="product-list-title">{getTitle()}</h1>
                
            </div>
            
            <div className="product-grid">
                {localProducts.map((product, index) => (
                    <div 
                        key={product._id} 
                        className="product-card"
                        style={{ animationDelay: `${index * 0.08}s` }}
                    >
                        {/* Wishlist Button */}
                        <button
                            className={`wishlist-btn ${wishlist.has(product._id) ? 'active' : ''}`}
                            onClick={(e) => toggleWishlist(e, product._id)}
                            aria-label="Agregar a favoritos"
                        >
                            <Heart size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="product-image-container">
                            <img 
                                src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
                                alt={product.name} 
                                className="product-image"
                                loading="lazy"
                                onClick={() => handleProductClick(product._id)}
                            />
                            <div className="image-overlay"></div>
                        </div>

                        {/* Content Section */}
                        <div className="product-content">
                            <h3 className="product-name" title={product.name}>{product.name}</h3>
                            
                            <div className="price-section">
                                <span className="currency">$</span>
                                <span className="price-amount">{formatPrice(product.price)}</span>
                            </div>

                            <Link 
                                className="view-btn" 
                                to={`/item/${product._id}`}
                                state={{ from: location.pathname }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleProductClick(product._id);
                                }}
                            >
                                <Eye size={16} />
                                <span>Ver detalles</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};