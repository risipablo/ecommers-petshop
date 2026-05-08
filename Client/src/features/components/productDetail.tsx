// features/components/productDetail.tsx
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import '../../assets/styles/producDetail.css';
import { useProduct } from '../hooks/useProducts';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import { useEffect, useState } from 'react';
import type { Product } from '../types/product.type';

export function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { product, loading } = useProduct(id || '');
    const { relatedProducts, loading: loadingRelated } = useRelatedProducts(
        id || '', 
         (product as Product) ?.category || '',
         (product as Product)?.pet,
         (product as Product)?.brand
    );
    const [backPath, setBackPath] = useState<string>('/');
    const [backText, setBackText] = useState<string>('Volver');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

    const typedProduct = product as Product;
    const images: { url: string; publicId: string; isMain: boolean; order: number }[] = Array.isArray(typedProduct?.images) && typedProduct.images.length > 0 
        ? (typedProduct.images as { url: string; publicId: string; isMain: boolean; order: number }[]) 
        : (typedProduct?.imageUrl ? [{ url: typedProduct.imageUrl!, publicId: '', isMain: true, order: 0 }] : []);

    const hasMultipleImages = images.length > 1;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [id]);

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

        const fromState = location.state as { from?: string };
        
        if (fromState?.from) {
            const fromPath = fromState.from;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBackPath(fromPath);
            
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

    const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isZoomModalOpen) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) });
    };

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

    const handleRelatedProductClick = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const nextImage = () => {
        if (Array.isArray(images) && images.length > 0) {
            setSelectedImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (Array.isArray(images) && images.length > 0) {
            setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
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
                            src={images[selectedImageIndex]?.url || (product as Product).imageUrl || 'https://via.placeholder.com/500x500?text=Sin+Imagen'} 
                            alt={(product as Product).name} 
                            className="main-image"
                            loading="lazy"
                        />
                        <button 
                            className="zoom-btn"
                            onClick={() => setIsZoomModalOpen(true)}
                            aria-label="Ampliar imagen"
                        >
                            <ZoomIn size={20} />
                        </button>
                        {hasMultipleImages && (
                            <div className="image-counter">
                                {selectedImageIndex + 1} / {images.length}
                            </div>
                        )}
                    </div>
                    
                    {hasMultipleImages && (
                        <div className="thumbnails-wrapper">
                            {images.map((img, idx) => (
                                <div 
                                    key={idx}
                                    className={`thumbnail ${selectedImageIndex === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIndex(idx)}
                                >
                                    <img 
                                        src={img.url} 
                                        alt={`${(product as Product).name} - ${idx + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-info-section">
                    <h1 className="product-title">{ (product as Product) .name}</h1>

                    <div className="price-section">
                        <span className="current-price">${formatPrice((product as Product).price)}</span>
                    </div>

                    { (product as Product).brand && (
                        <div className="brand-section">
                            <span className="brand-label">Marca:</span>
                            <span className="brand-value">{(product as Product).brand}</span>
                        </div>
                    )}

                    { (product as Product).pet && (
                        <div className="pet-section">
                            <span className="pet-label">Mascota:</span>
                            <span className="pet-value">{(product as Product).pet}</span>
                        </div>
                    )}

                    { (product as Product).age && (
                        <div className="age-section">
                            <span className="age-label">Edad recomendada:</span>
                            <span className="age-value">{(product as Product).age}</span>
                        </div>
                    )}

                    { (product as Product).description && (
                        <div className="description-section">
                            <h2 className="section-title">Descripción del producto</h2>
                            <div className="description-content">
                                <p>{(product as Product).description}</p>
                            </div>
                        </div>
                    )}
                    
                    { (product as Product).category && (
                        <div className="category-section">
                            <span className="category-label">Categoría:</span>
                            <span className="category-tag">{(product as Product).category}</span>
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
                                    {relatedProducts.map((relatedProduct: Product) => (
                                        <Link
                                            key={relatedProduct._id}
                                            to={`/item/${relatedProduct._id}`}
                                            state={{ from: backPath }}
                                            onClick={handleRelatedProductClick}
                                            className="related-product-card-link"
                                        >
                                            <div className="related-product-card">
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
                                                        <div className="related-view-btn">
                                                            <Eye size={16} strokeWidth={2.5} />
                                                            Ver
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
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

            {/* Modal de zoom */}
            {isZoomModalOpen && (
                <div className="zoom-modal" onClick={() => setIsZoomModalOpen(false)}>
                    <div className="zoom-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="zoom-close-btn"
                            onClick={() => setIsZoomModalOpen(false)}
                        >
                            <X size={24} />
                        </button>
                        
                        {hasMultipleImages && (
                            <button 
                                className="zoom-nav zoom-prev"
                                onClick={prevImage}
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}
                        
                        <div 
                            className="zoom-image-container"
                            onMouseMove={handleZoom}
                        >
                            <img 
                                src={images[selectedImageIndex]?.url || (product as Product).imageUrl}
                                alt={(product as Product).name}
                                className="zoom-image"
                                style={{
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                    transform: 'scale(2.5)'
                                }}
                            />
                        </div>
                        
                        {hasMultipleImages && (
                            <button 
                                className="zoom-nav zoom-next"
                                onClick={nextImage}
                            >
                                <ChevronRight size={32} />
                            </button>
                        )}
                        
                        {hasMultipleImages && (
                            <div className="zoom-thumbnails">
                                {images.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        className={`zoom-thumbnail ${selectedImageIndex === idx ? 'active' : ''}`}
                                        onClick={() => setSelectedImageIndex(idx)}
                                    >
                                        <img src={img.url} alt={`Thumb ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}