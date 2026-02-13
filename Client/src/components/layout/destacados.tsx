
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../assets/styles/destacosHome.css';
import { UseDestacados } from '../../features/hooks/useDestacados';



export const Destacados = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  const{products, fetch} = UseDestacados()



  useEffect(() => {
    fetch()

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 480) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="featured-section">
      <h1>Productos Destacados</h1>
      <div className="featured-container">
        
        
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
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="featured-card"
                  style={{ minWidth: `${100 / itemsPerView}%` }}
                >
         
                  <div className="featured-image">
                    <img src={product.image} alt="pictures" />
                    <div className="product-divider"></div>
                    <h3 className="featured-name">{product.name}</h3>
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


      </div>
    </section>
  );
};

        {/* <div className="featured-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`featured-dot ${index === currentIndex ? 'featured-dot-active' : ''}`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div> */}