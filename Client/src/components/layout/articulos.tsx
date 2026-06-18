// components/layout/articulosHome.tsx

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
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
                    {/* Tag decorativo */}
                    <div className="consulta-tag">
                        <Sparkles size={14} />
                        Blog de Bambina Petshop
                    </div>

                    {/* Título principal */}
                    <h2 className="consulta-title">
                        Todo lo que necesitás saber <br />
                        sobre tu mascota
                    </h2>

                    {/* Subtítulo */}
                    <p className="consulta-subtitle">
                        Guías, consejos y artículos escritos por especialistas 
                        para que cuides mejor a tu compañero.
                    </p>


                    {/* Botón CTA */}
                    <button
                        className="consulta-btn"
                        onClick={() => navigate('/articulos')}
                    >
                        Leer artículos
                        <ChevronRight size={18} />
                    </button>
                </div>

            </div>
        </section>
    );
};