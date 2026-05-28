import { GridCategory } from "../components/layout/gridCategory";
import Carousel from "../components/layout/sliderHeader";
import "../assets/styles/bodyHome.css"
import { EnviosHome } from "../components/layout/enviosHome";
import { Destacados } from "../components/layout/destacados";
import { ConsultaHome } from "../components/layout/consultaHome";
import { SliderMarcas } from "../components/layout/sliderMarcas";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
// import { Newsletter } from "../components/layout/newsletter";

export function BodyHome(){
    
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);


    return(
        <div className="body-container">
          
            <Carousel/>
            <GridCategory/>
            <EnviosHome/>
            <Destacados/>
            <SliderMarcas/>
            <ConsultaHome/>
            
        </div>
    )
}