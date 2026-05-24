// features/components/Destacados.tsx
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/destacosHome.css';
import { UseDestacados } from '../../features/hooks/useDestacados';

export const Destacados = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { products, fetch, loading } = UseDestacados();
  const navigate = useNavigate();

  useEffect(() => {
    fetch();

    const handleResize = () => {
      if (window.innerWidth >= 1280) setItemsPerView(4);
      else if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 768) setItemsPerView(2);
      else setItemsPerView(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cloneCount = itemsPerView;
  const clonedProducts = products.length > 0
    ? [...products.slice(-cloneCount), ...products, ...products.slice(0, cloneCount)]
    : [];
  const realStart = cloneCount;
  const trackIndex = currentIndex + realStart;

  const startAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };

  useEffect(() => {
    if (products.length === 0) return;
    startAutoplay();
    return () => stopAutoplay();
  }, [products.length, itemsPerView]);

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

  if (loading || products.length === 0) {
    return (
      <section className="featured-section">
        <h1>Productos Destacados</h1>
        <div className="featured-carousel-wrapper">
          <div className="featured-carousel">
            <div className="featured-track">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="featured-card"
                  style={{ width: `calc(${100 / itemsPerView}% - var(--card-gap))` }}
                >
                  <div className="featured-card-inner">
                    <div className="featured-image skeleton-loading" />
                    <div className="featured-content">
                      <p className="featured-name skeleton-loading" />
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
      <h1>Productos Destacados</h1>

      <div className="featured-carousel-wrapper">
        <button onClick={prev} className="featured-nav" aria-label="Anterior">
          <ChevronLeft />
        </button>

        <div className="featured-carousel">
          <div
            className="featured-track"
            style={{
              transform: `translateX(calc(-${trackIndex} * (${100 / itemsPerView}% + var(--card-gap))))`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
            }}
          >
            {clonedProducts.map((product, index) => (
              <div
                key={`${product._id}-${index}`}
                className="featured-card"
                style={{ width: `calc(${100 / itemsPerView}% - var(--card-gap))` }}
                onClick={() => handleProductClick(product._id)}
              >
                <div className="featured-card-inner">

                  {/* Imagen — igual que product-image-container */}
                  <div className="featured-image-container">
                    <img
                      src={product.imageUrl || product.images?.[0]?.url}
                      alt={product.name}
                      className="featured-image"
                      loading="lazy"
                    />
                  </div>

                  {/* Línea divisoria negra */}
                  <div className="featured-divider" />

                  {/* Contenido — igual que product-content */}
                  <div className="featured-content">
                    <h3 className="featured-name" title={product.name}>
                      {product.name}
                    </h3>

                    {/* Fila precio + botón — igual que price-action-row */}
                    <div className="featured-price-action-row">
                      <div className="featured-price-section">
                        <span className="featured-currency">$</span>
                        <span className="featured-price">{formatPrice(product.price)}</span>
                      </div>

                      <button
                        className="featured-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product._id);
                        }}
                      >
                        <Eye size={13} />
                        <span>Ver</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
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