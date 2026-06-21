import { useState, useEffect, type SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../assets/styles/slider.css';

// Imports para Desktop (versiones grandes)
import desk1 from "../../assets/images/pic1d.png";
import desk2 from "../../assets/images/pic3d.png";
import desk3 from "../../assets/images/picd3.png";

// Imports para Mobile (versiones pequeñas)
import mobile1 from "../../assets/images/pic2.png";
import mobile2 from "../../assets/images/pic1.png"
import mobile3 from "../../assets/images/pic3.png";

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      images: {
        mobile: mobile1,
        desktop: desk1
      }
    },
    {
      id: 2,
      images: {
        mobile: mobile2,
        desktop: desk2
      }
    },
    {
      id: 3,
      images: {
        mobile: mobile3,
        desktop: desk3
      }
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
            <picture>
              <source 
                media="(max-width: 767px)" 
                srcSet={slide.images.mobile}
              />
              <source 
                media="(min-width: 768px)" 
                srcSet={slide.images.desktop}
              />
              <img 
                src={slide.images.desktop} 
                alt={`Slide ${slide.id}`}
                className="carousel-image"
                loading="lazy"
              />
            </picture>
            
            <div className="carousel-overlay" />
            
            <div className="carousel-content">
              <div className="carousel-text">
                {/* Contenido si lo necesitas */}
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
    </div>
  );
}