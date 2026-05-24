// features/components/ProductList.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import '../../assets/styles/productList.css';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ProductSkeletonGrid } from '../../components/common/productSkeleton';
import { useAuth } from '../../context/authProvider';
import { Filters } from './filters';
import type { Product } from '../types/product.type';

export const ProductList = () => {
    const { filteredProducts: contextFilteredProducts, searchTerms, searchQuery, isLoading, deleteProduct } = useProducts();
    const { isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const categoryPath = currentPath.substring(1);

    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const [filteredProductsState, setFilteredProductsState] = useState<Product[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    useEffect(() => {
        if (!isLoading) {
            let products = [...contextFilteredProducts];

            if (
                categoryPath &&
                categoryPath !== 'todos' &&
                categoryPath !== 'search' &&
                !categoryPath.includes('edit-product') &&
                !categoryPath.includes('admin')
            ) {
                products = products.filter(
                    (p) => p.category?.toLowerCase() === categoryPath.toLowerCase()
                );
            }

            setLocalProducts(products);
            setFilteredProductsState(products);
        }
    }, [contextFilteredProducts, isLoading, categoryPath]);

    const handleFilterChange = useCallback((filtered: Product[]) => {
        setFilteredProductsState(filtered);
    }, []);

    const getTitle = () => {
        if (searchTerms && searchQuery.trim() !== '' && currentPath === '/search') {
            return `Resultados para: "${searchQuery}"`;
        }

        if (
            categoryPath &&
            categoryPath !== 'todos' &&
            categoryPath !== 'search' &&
            !categoryPath.includes('edit-product') &&
            !categoryPath.includes('admin')
        ) {
            const categoryName = categoryPath.charAt(0).toUpperCase() + categoryPath.slice(1);
            return `Productos de ${categoryName}`;
        }

        if (currentPath === '/search') {
            return 'Todos los productos';
        }

        return 'Productos para Mascotas';
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
            await deleteProduct(productToDelete.id);
            setLocalProducts((prev) => prev.filter((p) => p._id !== productToDelete.id));
            setFilteredProductsState((prev) => prev.filter((p) => p._id !== productToDelete.id));
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

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'number' ? price : parseFloat(price);
        return numPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    if (isLoading && localProducts.length === 0) {
        return (
            <div className="products-layout">
                <div className="products-header">
                    <h1 className="product-list-title">{getTitle()}</h1>
                </div>
                <ProductSkeletonGrid count={8} />
            </div>
        );
    }

    if (searchTerms && filteredProductsState.length === 0 && currentPath === '/search') {
        return (
            <div className="no-results">
                <SearchOffIcon sx={{ fontSize: 80, color: '#d4a574' }} />
                <h2>No hubo resultados para tu búsqueda</h2>
                <p>Intenta con otros términos o revisa la ortografía</p>
                {searchQuery && (
                    <p className="search-query">
                        Buscaste: <strong>"{searchQuery}"</strong>
                    </p>
                )}
                <button onClick={() => navigate('/')} className="back-to-home">
                    Volver al inicio
                </button>
            </div>
        );
    }

    if (filteredProductsState.length === 0 && !isLoading) {
        return (
            <div className="products-layout">
                <div className="products-header">
                    <h1 className="product-list-title">{getTitle()}</h1>
                </div>
                <div className="no-results-filter">
                    <h3>No hay productos disponibles</h3>
                    <p>Pronto agregaremos más productos a esta categoría</p>
                    <button onClick={() => navigate('/')} className="back-to-home">
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
    <div className="products-layout">
        <div className="products-header">
            <h1 className="product-list-title">{getTitle()}</h1>
            <p className="products-count">{filteredProductsState.length} productos encontrados</p>
        </div>

        <div className="products-grid-filters">
            <aside className="filters-sidebar">
                <Filters products={localProducts} onFilterChange={handleFilterChange} />
            </aside>

            <main className="products-main-content">
                <div className="product-grid">
                    {filteredProductsState.map((product, index) => (
                        <div
                            key={product._id}
                            className="product-card"
                            style={{ animationDelay: `${index * 0.05}s` }}
                            onClick={() => handleProductClick(product._id)}
                        >
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

                            <div className="product-image-container">
                                <img
                                    src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}
                                    alt={product.name}
                                    className="product-image"
                                    loading="lazy"
                                />
                            </div>

                            <div className="product-content">
                                <h3 className="product-name" title={product.name}>
                                    {product.name}
                                </h3>

                                {/* ✅ Mostrar kg SOLO en la categoría alimentos */}
                                {categoryPath === 'alimentos' && product.kg && (
                                    <p className="product-kg">Kilos: {product.kg} kg</p>
                                )}

                                <div className="price-action-row">
                                    <div className="price-section">
                                        <span className="currency">$</span>
                                        <span className="price-amount">{formatPrice(product.price)}</span>
                                    </div>

                                    <button
                                        className="view-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleProductClick(product._id);
                                        }}
                                    >
                                        <Eye size={16} />
                                        <span>Ver</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
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
                        <p>
                            ¿Estás seguro de eliminar el producto{' '}
                            <strong>"{productToDelete.name}"</strong>?
                        </p>
                        <p className="warning-text">
                            Esta acción no se puede deshacer y eliminará todas las imágenes asociadas.
                        </p>
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