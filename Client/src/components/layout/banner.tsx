// components/common/PromoBanner.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tag, 
  Headphones, 
  ArrowRight,
  Sparkles,

} from 'lucide-react';
import '../../assets/styles/promoBanner.css';

export const PromoBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Tag size={20} />,
      title: 'Ofertas en indumentaria',
      description: 'Aprovecha nuestros descuentos en indumentaria para tu mascota',
      cta: 'Ver ofertas',
      link: '/indumentaria',
      color: 'oferta'
    },
    // {
    //   icon: <Truck size={20} />,
    //   title: 'Envíos a todo el país',
    //   description: 'Recibí tu pedido en la puerta de tu casa o retíralo en el local',
    //   cta: 'Más info',
    //   link: '/contacto',
    //   color: 'alimento'
    // },
    {
      icon: <Headphones size={20} />,
      title: '¿Necesitas ayuda?',
      description: 'Sacate todas las dudas, ¡Estamos para ayudarte!',
      cta: 'Contactanos',
      link: '/contacto',
      color: 'contacto'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const current = slides[currentSlide];

  return (
    <section className="promo-banner">
      <div className="promo-banner-container">
        {/* Contenido del banner */}
        <div className={`promo-banner-content ${current.color}`}>
          <div className="promo-banner-icon">
            {current.icon}
          </div>
          
          <div className="promo-banner-text">
            <h3 className="promo-banner-title">
              <Sparkles size={16} />
              {current.title}
            </h3>
            <p className="promo-banner-description">
              {current.description}
            </p>
          </div>

          <button 
            className="promo-banner-cta"
            onClick={() => navigate(current.link)}
          >
            {current.cta}
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Indicadores (dots) */}
        <div className="promo-banner-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`promo-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};