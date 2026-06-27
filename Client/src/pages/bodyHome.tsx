// components/layout/bodyHome.tsx (optimizado)
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { GridCategory } from "../components/layout/gridCategory";
import "../assets/styles/bodyHome.css";
import { EnviosHome } from "../components/layout/enviosHome";
import { Destacados } from "../components/layout/destacados";
import { ContactoBanner } from "../components/layout/consultaHome";
import { SliderMarcas } from "../components/layout/sliderMarcas";
import { ArticulosHome } from "../components/layout/articulos";
import { WelcomeModal } from "../components/layout/welcome";
import { useWelcomeModal } from "../features/hooks/useWelcome";
import { SEO } from "../components/common/SEO";
import { LiquidacionProduct } from "../components/layout/liquidacionProduct";
import { PromoBanner } from "../components/layout/banner";
import SliderHeader from "../components/layout/sliderHeader";

// Configuración de AOS optimizada
const AOS_CONFIG = {
    duration: 700,
    once: true,
    easing: "ease-out-cubic",
    offset: 60,
};

export function BodyHome() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    useEffect(() => {
        // Inicializar AOS solo una vez
        AOS.init(AOS_CONFIG as never);
        // Limpiar AOS al desmontar
        return () => {
            AOS.refresh();
        };
    }, []);

    const { isOpen, handleClose, handleDontShowAgain } = useWelcomeModal();

    return (
        <div className="body-container">
            <SEO 
                title="Bambina Petshop"
                description="Tienda online de productos para mascotas. Alimentos premium, accesorios, juguetes y más para perros y gatos. ¡Enviamos a todo el país!"
                url="https://ecommers-petshop.vercel.app"
            />
            
            <div data-aos="fade-down" data-aos-duration="800">
                <SliderHeader />
            </div>

            <div data-aos="zoom-in" data-aos-duration="900">
                <PromoBanner />
            </div>
            
            <div data-aos="fade-up" data-aos-delay="100">
                <GridCategory />
            </div>
            
            <div data-aos="zoom-in" data-aos-duration="600">
                <Destacados />
            </div>

            <div data-aos="zoom-in" data-aos-duration="600">
                <LiquidacionProduct />
            </div>

            <div data-aos="fade-up" data-aos-delay="50">
                <EnviosHome />
            </div>

            <div data-aos="fade-up" data-aos-delay="50">
                <ArticulosHome />
            </div>

            <div data-aos="fade-down" data-aos-delay="50">
                <SliderMarcas />
            </div>

            <ContactoBanner />
            
            <WelcomeModal 
                isOpen={isOpen} 
                onClose={handleClose}
                onDontShowAgain={handleDontShowAgain}
            />
        </div>
    );
}