import { GridCategory } from "../components/layout/gridCategory";
import Carousel from "../components/layout/sliderHeader";
import "../assets/styles/bodyHome.css"
import { EnviosHome } from "../components/layout/enviosHome";
import { Destacados } from "../components/layout/destacados";
import { ConsultaHome } from "../components/layout/consultaHome";
import { SliderMarcas } from "../components/layout/sliderMarcas";
import { Newsletter } from "../components/layout/newsletter";

export function BodyHome(){

    return(
        <div className="body-container">
          
            <Carousel/>
            <GridCategory/>
            <EnviosHome/>
            <Destacados/>
            <SliderMarcas/>
            <ConsultaHome/>
            <Newsletter/>
        </div>
    )
}