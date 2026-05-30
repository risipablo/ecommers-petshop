// ContactoBanner.jsx
import { useNavigate } from 'react-router-dom';
import "../../assets/styles/consultaBanner.css";

export const ContactoBanner = () => {
    const navigate = useNavigate();

 return (
    <section className="contacto-banner" onClick={() => navigate('/contacto')}>
        <div className="contacto-banner-deco" />
        <div className="contacto-banner-left">
            <h2 className="contacto-banner-title">
                ¿Tenés alguna consulta?<br />
                Estamos para ayudarte
            </h2>
            <p> Contactanos para más información</p>
        </div>
        <div className="contacto-banner-right">
            <button
                className="contacto-banner-btn"
                onClick={(e) => { e.stopPropagation(); navigate('/contacto'); }}
            >
                Contactar ahora
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
            </button>
        </div>
    </section>
);
};