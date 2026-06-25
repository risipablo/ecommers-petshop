// features/components/ProductList.tsx  

import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import '../../assets/styles/productList.css';
import '../../assets/styles/pagination.css';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ProductSkeletonGrid } from '../../components/common/productSkeleton';
import { useAuth } from '../../context/authProvider';
import { Filters } from './filters';
import type { Product } from '../types/product.type';
import { SEO } from '../../components/common/SEO';
import { SortControls } from './filterPrice';
import { LazyImage } from './lazyImage';

export const ProductList = () => {
    const { filteredProducts: contextFilteredProducts, searchTerms, searchQuery, isLoading, deleteProduct } = useProducts();
    const { isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const categoryPath = currentPath.substring(1);
    const searchParams = new URLSearchParams(location.search);
    const petFilter = searchParams.get('pet');

    const [localProducts, setLocalProducts] = useState<Product[]>([]);
    const [filterProductsState, setFilteredProductsState] = useState<Product[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
    
    // Estados para loaders
    const [, setSortedProducts] = useState<Product[]>([])
    const [isSorting, setIsSorting] = useState(false)
    const [isFilterLoading, setIsFilterLoading] = useState(false)
    const [isSearchLoading, setIsSearchLoading] = useState(false) 

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(18);
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

    // Función de orden
    const handleSort = (sorted: Product[]) => {
        setIsSorting(true)
        setFilteredProductsState(sorted)
        setSortedProducts([])
        setCurrentPage(1)
        setTimeout(() => {
            setIsSorting(false)
        }, 300)
    }

    // Función de filtros con loader
    const handleFilterChange = useCallback((filtered: Product[]) => {
        setIsFilterLoading(true)
        setFilteredProductsState(filtered)
        setSortedProducts([])
        setCurrentPage(1)
        setTimeout(() => {
            setIsFilterLoading(false)
        }, 300)
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    // Filtrar productos por categoría y mascota
    useEffect(() => {
        if (!isLoading) {
            // Mostrar loader cuando hay búsqueda activa
            if (searchQuery) {
                setIsSearchLoading(true);
            }
            
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

            // Filtrar por mascota (desde query param ?pet=)
            if (petFilter && petFilter !== 'todos') {
                products = products.filter(
                    (p) => p.pet?.toLowerCase() === petFilter.toLowerCase()
                );
            }

            const inStock = products.filter(p => p.stock === 'Disponible' || p.stock === 'Ultimos en stock');
            const outOfStock = products.filter(p => p.stock === 'Agotado');
            const noStock = products.filter(p => !p.stock || p.stock === '' || p.stock === null);

            const sortedStock = [...inStock, ...noStock, ...outOfStock];

            setLocalProducts(sortedStock);
            setFilteredProductsState(sortedStock);
            setSortedProducts([])
            setCurrentPage(1);

            const paginated = sortedStock.slice(0, itemsPerPage)
            setPaginatedProducts(paginated)
            setTotalPages(Math.ceil(sortedStock.length / itemsPerPage))
            
    
            setTimeout(() => {
                setIsSearchLoading(false);
            }, 300);
        }
    }, [contextFilteredProducts, isLoading, categoryPath, petFilter, searchQuery,itemsPerPage]);

    
    useEffect(() => {
    
    const productsToPaginate = filterProductsState.length > 0 ? filterProductsState : [];
    
    if (productsToPaginate.length === 0) {
        setPaginatedProducts([]);
        setTotalPages(0);
        return;
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newTotalPages = Math.ceil(productsToPaginate.length / itemsPerPage);
    setTotalPages(newTotalPages);
    
    if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(1);
    } else {
        const paginated = productsToPaginate.slice(startIndex, endIndex);
        setPaginatedProducts(paginated);
    }
}, [filterProductsState, currentPage, itemsPerPage]);

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
            return ` ${categoryName}`;
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

    // Funciones de paginación
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    };

    const getSEOTitle = () => {
        if (categoryPath === 'alimentos') return 'Alimentos para Mascotas'
        if (categoryPath === 'accesorios') return 'Accesorios para Mascotas'
        if (categoryPath === 'higiene') return 'Higiene y Cuidado para Mascotas'
        if (categoryPath === 'indumentaria') return 'Indumentaria para Mascotas'
        return 'Productos para Mascotas'
    }

    const getSEODescription = () => {
        if (categoryPath === 'alimentos') return 'Los mejores alimentos balanceados para perros y gatos. Marcas premium, nutrición completa y sabores que aman tus mascotas.'
        if (categoryPath === 'accesorios') return 'Descubrí nuestra colección de accesorios para mascotas. Collares, correas, camas, juguetes y mucho más.'
        return 'Productos de calidad para el bienestar de tu mascota. Envíos a todo el país.'
    }

    const truncateText = (text: string, maxLength: number = 28) => {
        if (!text) return '';
        
        const isMobile = window.innerWidth <= 768;
        const actualMaxLength = isMobile ? 18 : maxLength;
        
        if (text.length <= actualMaxLength) return text;
        return text.slice(0, actualMaxLength) + '...';
    };

    // Mostrar loader cuando está cargando inicialmente, aplicando filtros, ordenando o buscando
    const showLoader = isLoading || isFilterLoading || isSorting || isSearchLoading;

    if (showLoader && localProducts.length === 0) {
        return (
            <div className="products-layout">
                <div className="products-header">
                    <h1 className="product-list-title">{getTitle()}</h1>
                </div>
                <ProductSkeletonGrid count={8} />
            </div>
        );
    }

    // Loader overlay para cuando se aplican filtros, ordenamiento o búsqueda
    if (isFilterLoading || isSorting || isSearchLoading) {
        return (
            <div className="products-layout">
                <SEO 
                    title={getSEOTitle()}
                    description={getSEODescription()}
                    url={`https://ecommers-petshop.vercel.app/${categoryPath}`}
                />

                <div className="products-header">
                        <div className="products-header-top">
                            <h1 className="product-list-title">{getTitle()}</h1>
                        </div>
                        
                        
                    </div>
                <div className="products-grid-filters">
                    <aside className="filters-sidebar">
                        <Filters products={localProducts} onFilterChange={handleFilterChange} />
                    </aside>
                    <main className="products-main-content">
                        <div className="loader-overlay">
                            <div className="loader-spinner"></div>
                            <p>{isSearchLoading ? 'Buscando productos...' : 'Aplicando cambios...'}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (searchTerms && filterProductsState.length === 0 && currentPath === '/search') {
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

    if (filterProductsState.length === 0 && !isLoading) {
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
            <SEO 
                title={getSEOTitle()}
                description={getSEODescription()}
                url={`https://ecommers-petshop.vercel.app/${categoryPath}`}
            />
            <div className="products-header">
                <div className="products-header-top">
                    <h1 className="product-list-title">{getTitle()}</h1>
                </div>

            
                <div className="sort-controls-desktop">
                    <p className="products-count">{filterProductsState.length} productos encontrados</p>
                    <SortControls
                        products={localProducts}
                        onSortChange={handleSort}
                        isLoading={isSorting}
                    />
                </div>    
            </div>

            <div className="products-grid-filters">
                <aside className="filters-sidebar">
                    <Filters products={localProducts} onFilterChange={handleFilterChange} />
                </aside>

                <main className="products-main-content">
                    <div className="product-grid">
                        {paginatedProducts.map((product, index) => {
                            const isOutOfStock = product.stock === 'Agotado';
                            const hasDiscount = product.descuento === 'si';
                            const hasLiquidacion = product.descuento === 'liquidacion';
                            const isUltimosStock = product.stock === 'Ultimos en stock';

                            const isSearchRoute = currentPath === '/search';
                            const activeCategory = isSearchRoute ? product.category : categoryPath;
                            
                            return (
                                <div
                                    key={product._id}
                                    className={`product-card 
                                        ${isOutOfStock ? 'out-of-stock' : ''} 
                                        ${hasDiscount ? 'discount' : ''}
                                        ${hasLiquidacion ? 'liquidacion' : ''}
                                        ${isUltimosStock ? 'ultimos-stock' : ''}
                                    `}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                    onClick={() => handleProductClick(product._id)}
                                >
                                    {/* Badge de "Sin stock" */}
                                    {isOutOfStock && (
                                        <div className="stock-badge">
                                            ❌ Sin stock
                                        </div>
                                    )}
                                    
                                    {/* Badge de "Oferta" */}
                                    {hasDiscount && !isOutOfStock && (
                                        <div className="discount-badge">
                                            🏷️ Oferta
                                        </div>
                                    )}

                                    {/* Badge de "Liquidación" */}
                                    {hasLiquidacion && !isOutOfStock && (
                                        <div className="liquidacion-badge">
                                            🔥 Liquidación
                                        </div>
                                    )}

                                    {isUltimosStock && (
                                        <div className="ultimos-stock-badge">
                                            ⚡ Últimos en stock
                                        </div>
                                    )}

                                    {/* Admin Actions */}
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
                                        <LazyImage
                                                src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}
                                                alt={product.name}
                                                className="product-image"
                                                fallback="https://via.placeholder.com/300x300?text=Sin+Imagen"
                                            />
                                </div>

                                    <div className="featured-divider">
                                    </div>

                                    <div className="product-content">
                                        <h3 className="product-name" title={product.name}>
                                            {truncateText(product.name).toUpperCase()}
                                        </h3>

                                        {/* Mostrar información específica según categoría - AHORA FUNCIONA EN BÚSQUEDA */}
                                        {activeCategory === 'alimentos' && product.kg && product.condition?.toLowerCase() !== 'pouch'  && product.condition?.toLowerCase() !== 'lata'  && product.condition?.toLowerCase() !== 'snacks' && (
                                            <p className="products-kg">{product.kg} kg</p>
                                        )}

                                        {activeCategory === 'alimentos' && product.condition?.toLowerCase() === 'pouch' && product.kg && (
                                            <p className="products-kg">{product.kg} gr</p>
                                        )}

                                        {activeCategory === 'alimentos' && product.condition?.toLowerCase() === 'lata' && product.kg && (
                                            <p className="products-kg">{product.kg} gr</p>
                                        )}
                                           {activeCategory === 'alimentos' && product.condition?.toLowerCase() === 'snacks' && product.kg && (
                                            <p className="products-kg">{product.kg} gr</p>
                                        )}
                                        
                                        
                                        {activeCategory === 'indumentaria' && product.kg && (
                                            <p className="products-kg">Talle: {product.kg}</p>
                                        )}

                                        {activeCategory === 'colchonetas' && product.kg && (
                                            <p className="products-kg">{product.kg}</p>
                                        )} 

                                        {activeCategory === 'accesorios' && product.brand && (
                                            <p className="products-kg">{product.brand}</p>
                                        )}
                                        {activeCategory === 'higiene' && product.brand && (
                                            <p className="products-kg">{product.brand}</p>
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
                            );
                        })}
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="pagination-btn pagination-prev"
                                aria-label="Página anterior"
                            >
                                <ChevronLeft size={18} />
                                Anterior
                            </button>

                            <div className="pagination-numbers">
                                {getPageNumbers().map((page, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => typeof page === 'number' && goToPage(page)}
                                        className={`pagination-number ${currentPage === page ? 'active' : ''} ${typeof page !== 'number' ? 'dots' : ''}`}
                                        disabled={typeof page !== 'number'}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="pagination-btn pagination-next"
                                aria-label="Página siguiente"
                            >
                                Siguiente
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
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