// features/components/productDetail.tsx
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, ChevronLeft, ChevronRight, ZoomIn, X, Edit, Trash2, Check, XCircle, AlertCircle, Flame, Tag } from 'lucide-react';
import '../../assets/styles/producDetail.css';
import { useProduct } from '../hooks/useProducts';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/authProvider';
import axios from 'axios';
import type { Product } from '../types/product.type';
import { config } from '../../config/index';
import { SEO } from '../../components/common/SEO';
import { OptimizedImage } from '../../components/common/optimazeImage';

const API_URL = config.Api;

export function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { product: productData, loading } = useProduct(id || '') as { product: Product | null; loading: boolean };
    const product = productData as Product | null;
    const { relatedProducts, loading: loadingRelated } = useRelatedProducts(
        id || '',
        product?.category || '',
    );
    const { isAdmin } = useAuth();
    const [backPath, setBackPath] = useState<string>('/');
    const [backText, setBackText] = useState<string>('Volver');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [cardWidth, setCardWidth] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const carouselRef = useRef<HTMLDivElement>(null);

    const currentPath = location.pathname;
    const categoryPath = currentPath.substring(1);

    const images = (product?.images && Array.isArray(product.images) && product.images.length > 0)
        ? product.images
        : (product?.imageUrl ? [{ _id: 'main', url: product.imageUrl, publicId: product.imagePublicId || '', isMain: true, order: 0 }] : []);

    const hasMultipleImages = images.length > 1;

    const GAP = 16;
    const itemsPerViewReal = Math.min(itemsPerView, relatedProducts.length);
    const cloneCount = itemsPerViewReal;
    const clonedProducts = relatedProducts.length > 0 && relatedProducts.length > itemsPerViewReal
        ? [...relatedProducts.slice(-cloneCount), ...relatedProducts, ...relatedProducts.slice(0, cloneCount)]
        : [...relatedProducts];
    const realStart = relatedProducts.length > itemsPerViewReal ? cloneCount : 0;
    const trackIndex = currentIndex + realStart;

    // Calcular ancho real de cada card desde el contenedor
    const calculateCardWidth = useCallback(() => {
        if (!carouselRef.current) return;
        const containerWidth = carouselRef.current.offsetWidth;
        const totalGap = GAP * (itemsPerViewReal - 1);
        setCardWidth((containerWidth - totalGap) / itemsPerViewReal);
    }, [itemsPerViewReal]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [id]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setItemsPerView(4);
            } else if (window.innerWidth >= 1024) {
                setItemsPerView(4);
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

    // Recalcular ancho cuando cambia itemsPerView o el contenedor monta
    useEffect(() => {
        calculateCardWidth();
        window.addEventListener('resize', calculateCardWidth);
        return () => window.removeEventListener('resize', calculateCardWidth);
    }, [calculateCardWidth]);

    // Pequeño delay para asegurarse que el DOM ya renderizó
    useEffect(() => {
        const timer = setTimeout(calculateCardWidth, 50);
        return () => clearTimeout(timer);
    }, [calculateCardWidth, relatedProducts.length]);

    // Resetear índice al cambiar productos
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentIndex(0);
    }, [relatedProducts.length]);

    // Loop infinito: saltar sin animación cuando llegamos a los clones
    useEffect(() => {
        if (relatedProducts.length === 0 || relatedProducts.length <= itemsPerViewReal) return;

        if (currentIndex >= relatedProducts.length) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(0);
            }, 500);
            return () => clearTimeout(timer);
        }

        if (currentIndex < 0) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(relatedProducts.length - 1);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, relatedProducts.length, itemsPerViewReal]);

    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

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
                setBackText('Volver a buscar');
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
                setBackText('Volver a buscar');
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

    const handleEdit = () => {
        navigate(`/admin/products/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/products/${id}`, {
                withCredentials: true
            });
            alert('✅ Producto eliminado exitosamente');
            navigate('/');
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert('❌ Error al eliminar el producto');
        }
    };

    const nextSlide = () => {
        if (relatedProducts.length <= itemsPerViewReal) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        if (relatedProducts.length <= itemsPerViewReal) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    };

    const handleRelatedProductClick = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!product) return null
    const productImage = product.imageUrl || product.images?.[0]?.url
    const productUrl = `https://ecommers-petshop.vercel.app/item/${product._id}`
    const productPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price)

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

    const isAlimentos = categoryPath === 'alimentos' || product?.category === 'alimentos';
    const isIndumentaria = categoryPath === 'indumentaria' || product?.category === 'indumentaria';
    const isHigiene = categoryPath === 'higiene' || product?.category === 'higiene';
    const isColchoneta = categoryPath === 'colchonetas' || product?.category === 'colchonetas'
    const isAccesorios = categoryPath === 'accesorios' || product?.category === 'accesorios'

    const trackOffset = cardWidth > 0 ? trackIndex * (cardWidth + GAP) : 0;

    return (
        <div className="product-detail-container">
            <SEO 
                title={product.name}
                description={`${product.name} - ${product.brand}. ${product.description?.slice(0, 150)}... Precio: $${productPrice}. Envíos a todo el país.`}
                keywords={`${product.name}, ${product.brand}, ${product.category}, ${product.pet}, alimento para mascotas`}
                image={productImage}
                url={productUrl}
                type="product"
            />

            <div className="detail-header">
                <Link to={backPath} className="back-link">
                    <ArrowLeft size={20} strokeWidth={2} />
                    {backText}
                </Link>

                {isAdmin && (
                    <div className="admin-detail-actions">
                        <button className="admin-detail-btn edit" onClick={handleEdit}>
                            <Edit size={18} />
                            Editar producto
                        </button>
                        <button className="admin-detail-btn delete" onClick={() => setShowDeleteModal(true)}>
                            <Trash2 size={18} />
                            Eliminar producto
                        </button>
                    </div>
                )}
            </div>

            <div className="product-detail-wrapper">
                <div className="product-image-section">
                    <div 
                        className={`main-image-wrapper 
                            ${product.stock === 'Agotado' ? 'image-out-of-stock' : ''} 
                            ${product.descuento === 'si' || product.descuento === 'liquidacion' ? 'image-on-sale' : ''}
                        `}
                        data-discount-label={
                            product.descuento === 'liquidacion' ? '🔥 Liquidación' : 
                            product.descuento === 'si' ? '% Descuento' : ''
                        }
                    >
                        <OptimizedImage
                            src={images[selectedImageIndex]?.url || product.imageUrl || 'https://via.placeholder.com/500x500?text=Sin+Imagen'}
                            alt={product.name}
                            className="main-image"
                            width={500}
                            height={500}
                            quality={85}
                            loading="eager"
                            fallback="https://via.placeholder.com/500x500?text=Sin+Imagen"
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
                                        alt={`${product.name} - ${idx + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-info-section">
                    <h1 className="product-title">{(product.name).toUpperCase()}</h1>

                    {isHigiene && product.brand && (
                        <div className="kg-section-front">
                            <span className="brand-label">{product.brand}</span>
                        </div>
                    )}

                    {isIndumentaria && product.kg && (
                        <div className="kg-section-front">
                            <span className="brand-label">Talle {product.kg}</span>
                        </div>
                    )}

                    {isColchoneta && product.kg && (
                        <div className="kg-section-front">
                            <span className="brand-label">{product.kg}</span>
                        </div>
                    )}

                    {isAccesorios && product.brand && (
                        <div className="kg-section-front">
                            <span className="brand-label">{product.brand}</span>
                        </div>
                    )}

                    {isAlimentos && product.kg && product.condition?.toLowerCase() !== 'pouch' && product.condition?.toLowerCase() !== 'lata' && product.condition?.toLowerCase() !== 'snacks' && (
                        <div className="kg-section-front">
                            <p className="products-kg">{product.kg} kg</p>
                        </div>
                    )}

                    {isAlimentos && product.condition?.toLowerCase() === 'pouch' && product.kg && (
                        <div className="kg-section-front">
                            <p className="products-kg">{product.kg} gr</p>
                        </div>
                    )}

                    {isAlimentos && product.condition?.toLowerCase() === 'lata' && product.kg && (
                        <div className="kg-section-front">
                            <p className="products-kg">{product.kg} gr</p>
                        </div>
                    )}

                    {isAlimentos && product.condition?.toLowerCase() === 'snacks' && product.kg && (
                        <div className="kg-section-front">
                            <p className="products-kg">{product.kg} gr</p>
                        </div>
                    )}

                    <div className="price-section">
                        <span className="current-price">${formatPrice(product.price)}</span>
                    </div>

                    <div className="product-detail-status-wrapper">
                        {product.stock && (
                            <div
                                className={`product-detail-badge product-detail-stock-badge ${
                                    product.stock === 'Disponible'
                                        ? 'product-detail-in-stock'
                                        : product.stock === 'Ultimos en stock'
                                        ? 'product-detail-low-stock'
                                        : 'product-detail-out-stock'
                                }`}
                            >
                                {product.stock === 'Disponible' && <Check size={16} strokeWidth={2} />}
                                {product.stock === 'Ultimos en stock' && <AlertCircle size={16} strokeWidth={2} />}
                                {product.stock === 'Agotado' && <XCircle size={16} strokeWidth={2} />}
                                <span>
                                    {product.stock === 'Disponible' && 'Stock disponible'}
                                    {product.stock === 'Ultimos en stock' && 'Últimas unidades'}
                                    {product.stock === 'Agotado' && 'Sin stock'}
                                </span>
                            </div>
                        )}

                        {product.descuento && (
                            <div
                                className={`product-detail-badge product-detail-offer-badge ${
                                    product.descuento === 'si'
                                        ? 'product-detail-offer'
                                        : product.descuento === 'liquidacion'
                                        ? 'product-detail-clearance'
                                        : ''
                                }`}
                            >
                                {product.descuento === 'si' && <Tag size={16} strokeWidth={2} />}
                                {product.descuento === 'liquidacion' && <Flame size={16} strokeWidth={2} />}
                                <span>
                                    {product.descuento === 'si' && 'Descuento'}
                                    {product.descuento === 'liquidacion' && 'Liquidación'}
                                </span>
                            </div>
                        )}
                    </div>

                    {product.brand && (
                        <div className="brand-section">
                            <span className="brand-label">Marca:</span>
                            <span className="brand-value">{product.brand}</span>
                        </div>
                    )}

                    {isAlimentos && product.kg && (
                        <div className="brand-section">
                            <span className="brand-label">Kilos: </span>
                            <span className="brand-value"> {product.kg} kg</span>
                        </div>
                    )}

                    {isIndumentaria && product.kg && (
                        <div className="size-section">
                            <span className="size-label">Talle: </span>
                            <span className="size-value">{product.kg}</span>
                        </div>
                    )}

                    {product.pet && (
                        <div className="pet-section">
                            <span className="pet-label">Mascota:</span>
                            <span className="pet-value">{product.pet.charAt(0).toUpperCase() + product.pet.slice(1)}</span>
                        </div>
                    )}

                    {product.age && (
                        <div className="age-section">
                            <span className="age-label">Edad recomendada:</span>
                            <span className="age-value">{product.age.charAt(0).toUpperCase() + product.age.slice(1)}</span>
                        </div>
                    )}

                    {product.description && (
                        <div className="description-section">
                            <h2 className="section-title">Descripción del producto</h2>
                            <div className={`description-content ${!expanded && product.description.length > 1000 ? 'description-collapsed' : ''}`}>
                                {product.description.split(' - ').map((item, index) => (
                                    <p key={index}>{item}</p>
                                ))}
                            </div>
                            {product.description.length > 1000 && (
                                <button
                                    className={`description-toggle-btn ${expanded ? 'expanded' : ''}`}
                                    onClick={() => setExpanded(!expanded)}
                                >
                                    {expanded ? 'Ver menos' : 'Ver más'}
                                    <span className="toggle-icon">{expanded ? '▲' : '▼'}</span>
                                </button>
                            )}
                        </div>
                    )}

                    {product.category && (
                        <div className="category-section">
                            <span className="age-label">Categoría: </span>
                            <span className="category-tag">{product.category}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="footer-detail">
                {product.stock && (
                    <div className={`stock-section ${product.stock === 'Disponible' ? 'in-stock' : 'Agotado'}`}>
                        <span className="stock-label">
                            {product.stock === 'Disponible' ? <Check /> : <XCircle />}
                        </span>
                        <span className="stock-value">
                            {product.stock === 'Disponible'
                                ? 'Este producto tiene stock disponible'
                                : product.stock === 'Ultimos en stock'
                                ? 'Este producto tiene stock limitado, consultar por mensaje'
                                : 'Este producto no tiene stock por el momento'}
                        </span>
                    </div>
                )}

                {product.descuento && (
                    <div className={`discount-section ${product.descuento === 'si' ? 'no' : product.descuento === 'liquidacion' ? 'liquidacion' : ''}`}>
                        <span>
                            {product.descuento === 'si'
                                ? 'Este producto tiene descuento, consultar por mensaje'
                                : product.descuento === 'liquidacion'
                                ? 'Este producto está en liquidación'
                                : product.descuento === ' '
                                ? ' '
                                : 'Este producto no tiene descuento actualmente'}
                        </span>
                    </div>
                )}
            </div>

            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2 className="realted-title">Productos relacionados</h2>
                    {loadingRelated ? (
                        <div className="loading-related">Cargando productos relacionados...</div>
                    ) : (
                        <div className="related-carousel-wrapper">
                            {relatedProducts.length > itemsPerView && (
                                <button
                                    onClick={prevSlide}
                                    className="related-nav related-nav-left"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft />
                                </button>
                            )}

                            <div className="related-carousel" ref={carouselRef}>
                                <div
                                    className="related-track"
                                    style={{
                                        transform: `translateX(-${trackOffset}px)`,
                                        transition: isTransitioning
                                            ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                            : 'none',
                                    }}
                                >
                                    {clonedProducts.map((relatedProduct, idx) => {
                                        const isAlimentosRelated = relatedProduct.category === 'alimentos';
                                        const isIndumentariaRelated = relatedProduct.category === 'indumentaria';
                                        const isOutOfStock = relatedProduct.stock === 'Agotado';
                                        const hasDiscount = relatedProduct.descuento === 'si';
                                        const hasLiquidacion = relatedProduct.descuento === 'liquidacion';
                                        const isUltimosStock = relatedProduct.stock === 'Ultimos en stock';

                                        return (
                                            <Link
                                                key={`${relatedProduct._id}-${idx}`}
                                                to={`/item/${relatedProduct._id}`}
                                                state={{ from: backPath }}
                                                onClick={handleRelatedProductClick}
                                                className={`related-product-card-link ${isOutOfStock ? 'out-of-stock' : ''} ${hasDiscount ? 'discount' : ''} ${hasLiquidacion ? 'liquidacion' : ''} ${isUltimosStock ? 'ultimos-stock' : ''}`}
                                                style={{
                                                    width: cardWidth > 0 ? `${cardWidth}px` : undefined,
                                                    flexShrink: 0,
                                                    position: 'relative',
                                                }}
                                            >
                                                {isOutOfStock && (
                                                    <div className="stock-badge-related">
                                                        ❌ Sin stock
                                                    </div>
                                                )}
                                                
                                                {isUltimosStock && !isOutOfStock && (
                                                    <div className="ultimos-stock-badge-related">
                                                        ⚡ Últimos en stock
                                                    </div>
                                                )}
                                                
                                                {hasDiscount && !isOutOfStock && (
                                                    <div className="discount-badge-related">
                                                        🏷️ Oferta
                                                    </div>
                                                )}

                                                {hasLiquidacion && !isOutOfStock && (
                                                    <div className="liquidacion-badge-related">
                                                        🔥 Liquidación
                                                    </div>
                                                )}

                                                <div className="related-product-card">
                                                    <div className="related-image-wrapper">
                                                    <OptimizedImage
                                                            src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}
                                                            alt={product.name}
                                                            className="product-image"
                                                            width={300}
                                                            height={300}
                                                            quality={80}
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    
                                                    <div className="featured-divider">
                                                    </div>

                                                    <div className="related-content">
                                                        <h3 className="related-name" title={relatedProduct.name}>
                                                            {(relatedProduct.name).toUpperCase()}
                                                        </h3>

                                                        {isAlimentosRelated && relatedProduct.kg && (
                                                            <p className="product-kg">Kilos: {relatedProduct.kg} kg</p>
                                                        )}

                                                        {isIndumentariaRelated && relatedProduct.kg && (
                                                            <p className="product-kg">Talle: {relatedProduct.kg}</p>
                                                        )}

                                                        {isColchoneta && relatedProduct.kg && (
                                                            <p className="product-kg">{relatedProduct.kg}</p>
                                                        )}

                                                        <div className="price-action-row">
                                                            <div className="price-section">
                                                                <span className="currency">$</span>
                                                                <span className="price-amount">{formatPrice(relatedProduct.price)}</span>
                                                            </div>
                                                            <div className="view-btn">
                                                                <Eye size={16} />
                                                                <span>Ver</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            {relatedProducts.length > itemsPerView && (
                                <button
                                    onClick={nextSlide}
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
                            {Array.from({ length: Math.min(relatedProducts.length, 6) }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`related-dot ${(currentIndex % relatedProducts.length) === index ? 'active' : ''}`}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setCurrentIndex(index);
                                    }}
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
                        <button className="zoom-close-btn" onClick={() => setIsZoomModalOpen(false)}>
                            <X size={24} />
                        </button>

                        {hasMultipleImages && (
                            <button className="zoom-nav zoom-prev" onClick={prevImage}>
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        <div className="zoom-image-container">
                            <img
                                src={images[selectedImageIndex]?.url || product.imageUrl}
                                alt={product.name}
                                className="zoom-image"
                            />
                        </div>

                        {hasMultipleImages && (
                            <button className="zoom-nav zoom-next" onClick={nextImage}>
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

            {/* Modal de confirmación para eliminar */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content-delete" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                            ✕
                        </button>
                        <div className="modal-header">
                            <Trash2 size={40} color="#dc2626" />
                            <h2>Confirmar eliminación</h2>
                            <p>¿Estás seguro de eliminar el producto <strong>"{product.name}"</strong>?</p>
                            <p className="warning-text">Esta acción no se puede deshacer y eliminará todas las imágenes asociadas.</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn-confirm-delete" onClick={handleDelete}>
                                Eliminar permanentemente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}