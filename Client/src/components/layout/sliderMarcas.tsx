import "../../assets/styles/slidermarcas.css"
import image1 from "../../assets/images/agility-removebg-preview.png"
import image2 from "../../assets/images/optimun-removebg-preview.png"
import image3 from "../../assets/images/balacned-removebg-preview.png"
import image4 from "../../assets/images/eukanuba-removebg-preview.png"
import image5 from "../../assets/images/livra1.png"
import image6 from "../../assets/images/monami-removebg-preview.png"
import image7 from "../../assets/images/purina-removebg-preview.png"
import image8 from "../../assets/images/sieger-removebg-preview.png"
import image9 from "../../assets/images/stone-removebg-preview.png"
import image10 from "../../assets/images/biopet-removebg-preview.png"



export const SliderMarcas = () => {
    const marcas = [
        image1, image2, image3, image4, image5, 
        image6, image7, image8, image9, image10
    ]
    
    // Optimización: usar solo dos copias en lugar de cuatro
    const marcasDuplicadas = [...marcas, ...marcas,...marcas]

    return (
        <div className="container-marcas">
            <h1>Marcas que trabajamos</h1>
            <div className="marcas-slider-wrapper">
                <div className="marcas-slider">
                    {
                        marcasDuplicadas.map((item, idx) => (
                            <img 
                                key={`marca-${idx}`} 
                                src={item} 
                                alt={`marca ${(idx % marcas.length) + 1}`} 
                                className="category-btn" 
                                loading="lazy"
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}