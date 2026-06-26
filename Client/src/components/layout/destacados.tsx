// features/components/Destacados.tsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/destacosHome.css';
import '../../assets/styles/productList.css';
import { UseDestacados } from '../../features/hooks/useDestacados';
import { OptimizedImage } from '../common/optimazeImage';

export const Destacados = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { products, fetch, loading } = UseDestacados();
  const navigate = useNavigate();

  const GAP_PX = 16;

  useEffect(() => {
    fetch();

    const handleResize = () => {
      if (window.innerWidth >= 1280) setItemsPerView(4);
      else if (window.innerWidth >= 1024) setItemsPerView(4);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateCardWidth = useCallback(() => {
    if (!carouselRef.current) return;
    const containerWidth = carouselRef.current.offsetWidth;
    const totalGap = GAP_PX * (itemsPerView - 1);
    setCardWidth((containerWidth - totalGap) / itemsPerView);
  }, [itemsPerView]);

  useEffect(() => {
    calculateCardWidth();
    window.addEventListener('resize', calculateCardWidth);
    return () => window.removeEventListener('resize', calculateCardWidth);
  }, [calculateCardWidth]);

  useEffect(() => {
    const timer = setTimeout(calculateCardWidth, 50);
    return () => clearTimeout(timer);
  }, [calculateCardWidth, products.length]);

  const cloneCount = itemsPerView;
  const clonedProducts = products.length > 0
    ? [...products.slice(-cloneCount), ...products, ...products.slice(0, cloneCount)]
    : [];
  const realStart = cloneCount;
  const trackIndex = currentIndex + realStart;
  const trackOffset = cardWidth > 0 ? Math.round(trackIndex * (cardWidth + GAP_PX)) : 0; // redondeo decimal para los navegadores

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);
  }, []);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    startAutoplay();
    return () => stopAutoplay();
  }, [products.length, itemsPerView, startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (products.length === 0) return;
    if (currentIndex >= products.length) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (currentIndex < 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(products.length - 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, products.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const next = () => {
    stopAutoplay();
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => startAutoplay(), 10000);
  };

  const prev = () => {
    stopAutoplay();
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => startAutoplay(), 10000);
  };

  const goToSlide = (index: number) => {
    stopAutoplay();
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => startAutoplay(), 10000);
  };

  const handleProductClick = (productId: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/item/${productId}`);
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(String(price));
    return numPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const activeDot = ((currentIndex % products.length) + products.length) % products.length;

  // SKELETON MEJORADO - con duración de 1 segundo por producto
  if (loading || products.length === 0) {
    return (
      <section className="featured-section">
        <h1>Destacados</h1>
        <div className="featured-carousel-wrapper">
          <div className="featured-carousel">
            <div className="featured-track">
              {/* Skeleton mejorado */}
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="skeleton-card">
                    <div className="skeleton-image" />
                    <div className="skeleton-divider" />
                    <div className="skeleton-content">
                      <div className="skeleton-line skeleton-title" />
                      <div className="skeleton-line skeleton-subtitle" />
                      <div className="skeleton-price-row">
                        <div className="skeleton-line skeleton-price" />
                        <div className="skeleton-line skeleton-button" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-section">
      <h1>Destacados</h1>

      <div className="featured-carousel-wrapper">
        <button onClick={prev} className="featured-nav" aria-label="Anterior">
          <ChevronLeft />
        </button>

        <div className="featured-carousel" ref={carouselRef}>
          <div
            className="featured-track"
            style={{
              transform: `translateX(-${trackOffset}px)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {clonedProducts.map((product, index) => {
              const isOutOfStock = product.stock === 'Agotado';
              const hasDiscount = product.descuento === 'si';
              const hasLiquidacion = product.descuento === 'liquidacion';

              return (
                <div
                  key={`${product._id}-${index}`}
                  className={`related-product-card-destacado ${isOutOfStock ? 'out-of-stock' : ''} ${hasDiscount ? 'discount' : ''} ${hasLiquidacion ? 'liquidacion' : ''}`}
                  style={{
                    width: cardWidth > 0 ? `${cardWidth}px` : undefined,
                    flexShrink: 0,
                    position: 'relative',
                  }}
                  onClick={() => handleProductClick(product._id)}
                >
                  {/* Badges */}
                  {isOutOfStock && (
                    <div className="stock-badge">
                      ❌ Sin stock
                    </div>
                  )}
                  
                  {hasDiscount && !isOutOfStock && (
                    <div className="discount-badge">
                      🏷️ Oferta
                    </div>
                  )}

                  {hasLiquidacion && !isOutOfStock && (
                    <div className="liquidacion-badge">
                      🔥 Liquidación
                    </div>
                  )}

                  <div className="featured-card">
                    {/* Imagen con aspect ratio consistente */}
                    <div className="product-image-container-destacado">
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

                    {/* Línea divisoria */}
                    <div className="featured-divider" />


                    <div className="product-content-destacado">
                      <h3 className="product-name-destacado" title={product.name}>
                        {(product.name).toUpperCase()}
                      </h3>

                          {product.category === 'alimentos' && product.kg && product.condition?.toLowerCase() !== 'pouch'  && product.condition?.toLowerCase() !== 'lata'  && product.condition?.toLowerCase() !== 'snacks' && (
                            <p className="products-kg-destacado">{product.kg} kg</p>
                        )}

                        {product.category === 'alimentos' && product.condition?.toLowerCase() === 'pouch' && product.kg && (
                            <p className="products-kg-destacado">{product.kg} gr</p>
                        )}

                        {product.category === 'alimentos' && product.condition?.toLowerCase() === 'lata' && product.kg && (
                            <p className="products-kg-destacado">{product.kg} gr</p>
                        )}
                            {product.category === 'alimentos' && product.condition?.toLowerCase() === 'snacks' && product.kg && (
                            <p className="products-kg-destacado">{product.kg} gr</p>
                        )}
                        
                        
                        {product.category === 'indumentaria' && product.kg && (
                            <p className="products-kg-destacado">Talle: {product.kg}</p>
                        )}

                        {product.category === 'colchonetas' && product.kg && (
                            <p className="products-kg-destacado">{product.kg}</p>
                        )} 

                        {product.category === 'accesorios' && product.brand && (
                            <p className="products-kg-destacado">{product.brand}</p>
                        )}
                        {product.category === 'higiene' && product.brand && (
                            <p className="products-kg-destacado">{product.brand}</p>
                        )}

                      <div className="price-action-row-destacdo">
                        <div className="price-section-destacado">
                          <span className="currency-destacado">$</span>
                          <span className="price-amount-destacado">{formatPrice(product.price)}</span>
                        </div>

                        <button
                          className="view-btn-destacado"
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
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={next} className="featured-nav" aria-label="Siguiente">
          <ChevronRight />
        </button>
      </div>

      <div className="featured-dots">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`featured-dot ${index === activeDot ? 'active' : ''}`}
            aria-label={`Ir a página ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};