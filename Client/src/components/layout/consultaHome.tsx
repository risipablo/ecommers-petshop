import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../assets/styles/consulta.css";

export const ConsultaHome = () => {
    const navigate = useNavigate();
    const bgRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!bgRef.current || !sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            // rect.top es negativo cuando la sección ya subió
            // multiplicamos por 0.35 para el efecto suave
            const offset = rect.top * 0.35;
            bgRef.current.style.transform = `translateY(${-offset}px)`;
        };

        // Ejecutar una vez al montar para posición inicial correcta
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
                    <span className="consulta-tag">Estamos para vos</span>
                    <h2 className="consulta-title">
                        ¿Tenés alguna <span>duda o consulta?</span>
                    </h2>
                    <p className="consulta-subtitle">
                        Respondemos todas tus preguntas sobre productos, envíos y formas de pago. ¡Tu mascota merece lo mejor!
                    </p>
                    <button
                        className="consulta-btn"
                        onClick={() => navigate('/contacto')}
                    >
                        Contactanos
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                        </svg>
                    </button>
                </div>

            </div>
        </section>
    );
};