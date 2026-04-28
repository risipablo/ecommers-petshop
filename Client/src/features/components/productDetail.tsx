import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../assets/styles/producDetail.css';
import { useProduct } from '../hooks/useProducts';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import { useEffect, useState } from 'react';

export function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { product, loading } = useProduct(id || '');
    const { relatedProducts, loading: loadingRelated } = useRelatedProducts(
        id || '', 
        product?.category || '',
        product?.pet,
        product?.brand
    );
    const [backPath, setBackPath] = useState<string>('/');
    const [backText, setBackText] = useState<string>('Volver');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setItemsPerView(4);
            } else if (window.innerWidth >= 1024) {
                setItemsPerView(3);
            } else if (window.innerWidth >= 768) {
                setItemsPerView(2);
            } else {
                setItemsPerView(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentIndex(0);
    }, [relatedProducts.length]);

    useEffect(() => {
        if (!product) return;

        if (location.state?.from) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBackPath(location.state.from);
            const fromPath = location.state.from;
            
            if (fromPath === '/') {
                setBackText('Volver al inicio');
            } else if (fromPath.includes('/search')) {
                setBackText('Volver a búsqueda');
            } else {
                const category = fromPath.substring(1);
                if (category) {
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                    setBackText(`Volver a ${categoryName}`);
                }
            }
            return;
        }

        const savedPath = sessionStorage.getItem('lastProductListPath');
        if (savedPath) {
            setBackPath(savedPath);
            
            if (savedPath === '/') {
                setBackText('Volver al inicio');
            } else if (savedPath.includes('/search')) {
                setBackText('Volver a búsqueda');
            } else {
                const category = savedPath.substring(1);
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                setBackText(`Volver a ${categoryName}`);
            }
            return;
        }

        setBackPath('/');
        setBackText('Volver al inicio');
    }, [location.state, product]);

    useEffect(() => {
        return () => {
            if (location.state?.from) {
                sessionStorage.setItem('lastProductListPath', location.state.from);
            }
        };
    }, [location.state]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando producto...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="not-found-container">
                <h2>Producto no encontrado</h2>
                <p>El producto que buscas no existe o fue eliminado</p>
                <Link to="/" className="back-home-btn">Volver al inicio</Link>
            </div>
        );
    }

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'number' ? price : parseFloat(price);
        return numPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };

    const maxIndex = Math.max(0, relatedProducts.length - itemsPerView);
    
    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    return (
        <div className="product-detail-container">
            <Link to={backPath} className="back-link">
                <ArrowLeft size={20} strokeWidth={2} />
                {backText}
            </Link>

            <div className="product-detail-wrapper">
                <div className="product-image-section">
                    <div className="main-image-wrapper">
                        <img 
                            src={product.imageUrl || 'https://via.placeholder.com/500x500?text=Sin+Imagen'} 
                            alt={product.name} 
                            className="main-image"
                            loading="lazy"
                        />
                    </div>
                    
                    <div className="thumbnails-wrapper">
                        <div className="thumbnail active">
                            <img 
                                src={product.imageUrl || 'https://via.placeholder.com/100x100?text=Sin+Imagen'} 
                                alt={product.name}
                            />
                        </div>
                    </div>
                </div>

                <div className="product-info-section">
                    <h1 className="product-title">{product.name}</h1>

                    <div className="price-section">
                        <span className="current-price">${formatPrice(product.price)}</span>
                    </div>

                    {product.brand && (
                        <div className="brand-section">
                            <span className="brand-label">Marca:</span>
                            <span className="brand-value">{product.brand}</span>
                        </div>
                    )}

                    {product.pet && (
                        <div className="pet-section">
                            <span className="pet-label">Mascota:</span>
                            <span className="pet-value">{product.pet}</span>
                        </div>
                    )}

                    {product.age && (
                        <div className="age-section">
                            <span className="age-label">Edad recomendada:</span>
                            <span className="age-value">{product.age}</span>
                        </div>
                    )}

                    {product.description && (
                        <div className="description-section">
                            <h2 className="section-title">Descripción del producto</h2>
                            <div className="description-content">
                                <p>{product.description}</p>
                            </div>
                        </div>
                    )}
                    
                    {product.category && (
                        <div className="category-section">
                            <span className="category-label">Categoría:</span>
                            <span className="category-tag">{product.category}</span>
                        </div>
                    )}
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2 className="section-title">Productos relacionados</h2>
                    {loadingRelated ? (
                        <div className="loading-related">Cargando productos relacionados...</div>
                    ) : (
                        <div className="related-carousel-wrapper">
                            {relatedProducts.length > itemsPerView && (
                                <button 
                                    onClick={prevSlide} 
                                    disabled={currentIndex === 0}
                                    className="related-nav related-nav-left"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft />
                                </button>
                            )}

                            <div className="related-carousel">
                                <div 
                                    className="related-track"
                                    style={{ 
                                        transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                                    }}
                                >
                                    {relatedProducts.map(relatedProduct => (
                                        <div 
                                            key={relatedProduct._id} 
                                            className="related-product-card"
                                            style={{ minWidth: `${100 / itemsPerView}%` }}
                                        >
                                            <div className="related-image-wrapper">
                                                <img 
                                                    src={relatedProduct.imageUrl || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
                                                    alt={relatedProduct.name}
                                                    loading="lazy"
                                                />
                                            </div>
                                            
                                            <div className="related-divider"></div>
                                            
                                            <div className="related-content">
                                                <h3 className="related-name">{relatedProduct.name}</h3>
                                                <div className="related-footer">
                                                    <span className="related-price">
                                                        ${formatPrice(relatedProduct.price)}
                                                    </span>
                                                    <Link 
                                                        className="related-view-btn" 
                                                        to={`/item/${relatedProduct._id}`}
                                                        state={{ from: backPath }}
                                                    >
                                                        <Eye size={16} strokeWidth={2.5} />
                                                        Ver
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {relatedProducts.length > itemsPerView && (
                                <button 
                                    onClick={nextSlide} 
                                    disabled={currentIndex === maxIndex}
                                    className="related-nav related-nav-right"
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight />
                                </button>
                            )}
                        </div>
                    )}
                    
                    {relatedProducts.length > itemsPerView && (
                        <div className="related-dots">
                            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`related-dot ${currentIndex === index ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Ir a slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}