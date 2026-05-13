// features/components/ProductList.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import '../../assets/styles/productList.css';
import { Eye, Heart, Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductSkeletonGrid } from '../../components/common/productSkeleton';
import { useAuth } from '../../context/authProvider';
import axios from 'axios';

const API_URL = "https://ecommers-petshop.onrender.com/api"

export const ProductList = () => {
    const { filteredProducts, searchTerms, searchQuery, isLoading, fetchProducts } = useProducts();
    const { isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const categoryPath = currentPath.substring(1);
    const [localProducts, setLocalProducts] = useState(filteredProducts);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    useEffect(() => {
        if (!isLoading) {
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

    const handleEdit = (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        navigate(`/admin/products/edit/${productId}`);
    };

    const handleDeleteClick = (e: React.MouseEvent, productId: string, productName: string) => {
        e.stopPropagation();
        setProductToDelete({ id: productId, name: productName });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        
        setIsDeleting(productToDelete.id);
        try {
            await axios.delete(`${API_URL}/products/${productToDelete.id}`, {
                withCredentials: true
            });
            await fetchProducts();
            alert('✅ Producto eliminado exitosamente');
            setShowDeleteModal(false);
            setProductToDelete(null);
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('❌ Error al eliminar el producto');
        } finally {
            setIsDeleting(null);
        }
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

                        {/* Admin Actions (solo visible para admin) */}
                        {isAdmin && (
                            <div className="admin-actions-overlay">
                                <button
                                    className="admin-action-btn edit"
                                    onClick={(e) => handleEdit(e, product._id)}
                                    title="Editar producto"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="admin-action-btn delete"
                                    onClick={(e) => handleDeleteClick(e, product._id, product.name)}
                                    disabled={isDeleting === product._id}
                                    title="Eliminar producto"
                                >
                                    {isDeleting === product._id ? '...' : <Trash2 size={16} />}
                                </button>
                            </div>
                        )}

                        {/* Image Section */}
                        <div className="product-image-container" onClick={() => handleProductClick(product._id)}>
                            <img 
                                src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
                                alt={product.name} 
                                className="product-image"
                                loading="lazy"
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

            {/* Modal de confirmación para eliminar */}
            {showDeleteModal && productToDelete && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content-delete" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                            ✕
                        </button>
                        <div className="modal-header">
                            <Trash2 size={40} color="#dc2626" />
                            <h2>Confirmar eliminación</h2>
                            <p>¿Estás seguro de eliminar el producto <strong>"{productToDelete.name}"</strong>?</p>
                            <p className="warning-text">Esta acción no se puede deshacer y eliminará todas las imágenes asociadas.</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-confirm-delete" onClick={confirmDelete}>
                                Eliminar permanentemente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};