// features/components/Destacados.tsx
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/destacosHome.css';
import { UseDestacados } from '../../features/hooks/useDestacados';


export const Destacados = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [autoplay, setAutoplay] = useState(true);

  const { products, fetch, loading } = UseDestacados();
  const navigate = useNavigate();

  useEffect(() => {
    fetch();

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

  // Autoplay
  useEffect(() => {
    if (!autoplay || products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, products.length - itemsPerView);
        if (prev >= maxIndex) {
          return 0;
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, products.length, itemsPerView]);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const next = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    setTimeout(() => setAutoplay(true), 10000);
  };

  const prev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setAutoplay(true), 10000);
  };

  const goToSlide = (index: number) => {
    setAutoplay(false);
    setCurrentIndex(index);
    setTimeout(() => setAutoplay(true), 10000);
  };

  const handleProductClick = (productId: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/item/${productId}`);
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'number' ? price : parseFloat(String(price));
    return numPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  if (loading || products.length === 0) {
    return (
      <section className="featured-section">
        <h1>Productos Destacados</h1>
        <div className="featured-carousel-wrapper">
          <div className="featured-carousel">
            <div className="featured-track">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="featured-card" style={{ minWidth: `${100 / itemsPerView}%` }}>
                  <div>
                    <div className="featured-image skeleton-loading"></div>
                    <div className="product-divider"></div>
                    <h3 className="featured-name skeleton-loading"></h3>
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
        <button 
          onClick={prev} 
          disabled={currentIndex === 0}
          className="featured-nav featured-nav-left"
          aria-label="Anterior"
        >
          <ChevronLeft />
        </button>

        <div className="featured-carousel">
          <div 
            className="featured-track"
            style={{ 
              transform: `translateX(calc(-${currentIndex} * ${100 / itemsPerView}%))`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {products.map((product) => (
              <div 
                key={product._id} 
                className="featured-card"
                style={{ minWidth: `${100 / itemsPerView}%` }}
                onClick={() => handleProductClick(product._id)}
              >
                <div>
                  <div className="featured-image">
                    <img 
                      src={product.imageUrl || product.images?.[0]?.url} 
                      alt={product.name} 
                    />
                  </div>
                  <div className="product-divider"></div>
                  <h3 className="featured-name">{product.name}</h3>
                  <div className="featured-price">{formatPrice(product.price)}</div>
                  <button 
                    className="featured-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product._id);
                    }}
                  >
                    <Eye size={16} />
                    Ver producto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={next} 
          disabled={currentIndex === maxIndex}
          className="featured-nav featured-nav-right"
          aria-label="Siguiente"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="featured-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`featured-dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Ir a página ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};