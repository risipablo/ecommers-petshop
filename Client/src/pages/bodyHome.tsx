import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { GridCategory } from "../components/layout/gridCategory";
import Carousel from "../components/layout/sliderHeader";
import "../assets/styles/bodyHome.css";
import { EnviosHome } from "../components/layout/enviosHome";
import { Destacados } from "../components/layout/destacados";
import { ContactoBanner } from "../components/layout/consultaHome";
import { SliderMarcas } from "../components/layout/sliderMarcas";
import { ArticulosHome } from "../components/layout/articulos";

export function BodyHome() {

    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    useEffect(() => {
        AOS.init({
            duration: 700,        // duración de cada animación en ms
            once: true,           // la animación ocurre solo la primera vez
            easing: "ease-out-cubic",
            offset: 60,           // px desde el borde inferior del viewport para disparar
        });
    }, []);

    return (
        <div className="body-container">

            
            <div data-aos="fade-down" data-aos-duration="800">
                <Carousel />
            </div>

            
            <div data-aos="fade-up" data-aos-delay="100">
                <GridCategory />
            </div>

            
            <div data-aos="fade-up" data-aos-delay="50">
                <EnviosHome />
            </div>

            
            <div data-aos="zoom-in" data-aos-duration="600">
                <Destacados />
            </div>

            
            <div data-aos="fade-up" data-aos-delay="50">
                <ArticulosHome />
            </div>

            
            <div data-aos="fade-down" data-aos-delay="50">
                <SliderMarcas />
            </div>

            
            
                <ContactoBanner />
            

        </div>
    );
}