import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../assets/styles/articulosHome.css";

export const ArticulosHome = () => {
    const navigate = useNavigate();
    const bgRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

useEffect(() => {
    const handleScroll = () => {
       
        if (window.innerWidth < 768 || !bgRef.current || !sectionRef.current) return;
        
        const rect = sectionRef.current.getBoundingClientRect();
        const offset = rect.top * 0.35;
        bgRef.current.style.transform = `translateY(${-offset}px)`;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

    return (
        <section className="consulta-parallax" ref={sectionRef}>
            <div className="consulta-parallax-bg" ref={bgRef} />
            <div className="consulta-parallax-overlay" />
            <div className="consulta-parallax-content">
                <div className="consulta-text">
                    
                    <h2 className="consulta-title">
                        Todo lo que necesitás saber sobre tu mascota
                    </h2>
                    <p className="consulta-subtitle">
                        Guías, consejos y artículos escritos por especialistas para que cuides mejor a tu compañero.
                    </p>
                    <button
                        className="consulta-btn"
                        onClick={() => navigate('/articulos')}
                    >
                        Leer artículos
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};