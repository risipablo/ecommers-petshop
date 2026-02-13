
import {  SendHorizontal } from 'lucide-react';
import '../../assets/styles/newsletter.css';

export const Newsletter = () => {
  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h1 className="newsletter-title">¡Únete a Nuestra Comunidad!</h1>
        <p className="newsletter-subtitle">
          Enterate de todas nuestras promocion e ingresos nuevos
        </p>
        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Tu correo electrónico"
            className="newsletter-input"
          />
          <button className="newsletter-button">
            
            <SendHorizontal />
          </button>
        </div>
        
      </div>
    </section>
  );
};