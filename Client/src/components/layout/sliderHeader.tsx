import { useState, useEffect, type SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../assets/styles/slider.css';
import image1 from "../../assets/images/foto2.jpg"

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      image: image1,
      
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1920&h=700&fit=crop',
      title: '¡Nuevos Productos de Invierno!',
      subtitle: 'Mantén a tu mascota abrigada y feliz',
      cta: 'Ver Productos'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=1920&h=700&fit=crop',
      title: 'Alimento Premium',
      subtitle: 'Nutrición de calidad para tu mejor amigo',
      cta: 'Descubrir Más'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, isAutoPlaying]);

  return (
    <div className="carousel-container">
      {/* Slides */}
      <div 
        className="carousel-slides"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="carousel-slide">
            {/* Imagen */}
            <img 
              src={slide.image} 
              alt={slide.title}
              className="carousel-image"
            />
            
            {/* Overlay oscuro */}
            <div className="carousel-overlay" />
            
            {/* Contenido */}
            <div className="carousel-content">
              <div className="carousel-text">
                <h2 className="carousel-title">
                  {slide.title}
                </h2>
                <p className="carousel-subtitle">
                  {slide.subtitle}
                </p>
                {/* <button className="carousel-button">
                  {slide.cta}
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de navegación */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="carousel-nav carousel-nav-left"
        aria-label="Anterior"
      >
        <ChevronLeft className="carousel-nav-icon" />
      </button>

      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="carousel-nav carousel-nav-right"
        aria-label="Siguiente"
      >
        <ChevronRight className="carousel-nav-icon" />
      </button>

      {/* Indicadores (dots) */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className={`carousel-dot ${index === currentSlide ? 'carousel-dot-active' : ''}`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>


      {/* <div className="carousel-counter">
        {currentSlide + 1} / {slides.length}
      </div> */}
    </div>
  );
}