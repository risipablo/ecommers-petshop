// components/layout/sliderHeader.tsx (actualizado para WebP)
import { useState, useEffect, type SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../../assets/styles/slider.css';


import desk1 from "../../assets/images/pic1d.webp";
import desk2 from "../../assets/images/pic3d.webp"
import desk3 from "../../assets/images/picndes.jpg";

import mobile1 from "../../assets/images/pic2.webp";
import mobile2 from "../../assets/images/pic1.webp";
import mobile3 from "../../assets/images/picnmo.jpg";

function SliderHeader() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    { id: 1, mobile: mobile1, desktop: desk1, alt: "Banner promocional Bambina Petshop - Alimentos y accesorios" },
    { id: 2, mobile: mobile2, desktop: desk2, alt: "Ofertas especiales en Bambina Petshop" },
    { id: 3, mobile: mobile3, desktop: desk3, alt: "Productos destacados para tu mascota" }
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
      <div 
        className="carousel-slides"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="carousel-slide">
            <picture>
              <source 
                media="(max-width: 768px)" 
                srcSet={slide.mobile}
                type="image/webp"
              />
              <img 
                src={slide.desktop}
                alt={slide.alt}
                className="carousel-image"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
              />
            </picture>
            
            <div className="carousel-overlay" />
            <div className="carousel-content">
              <div className="carousel-text" />
            </div>
          </div>
        ))}
      </div>

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


export default SliderHeader