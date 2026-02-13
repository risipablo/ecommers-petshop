import imagePerrito from "../../assets/images/perrito.png"
import "../../assets/styles/consulta.css"

export const ConsultaHome = () => {

    return(
        <div className="consulta-home-container">
            <div className="consulta-home-text">
                <h2 className="consulta-home-title">
                    ¿Te quedaste con alguna duda o consulta?
                </h2>
                <p className="consulta-home-subtitle">
                    Estamos aquí para ayudarte. Hacé click en el botón para conocer más información sobre nuestros productos, envíos y formas de pago.
                </p>
                <button className="consulta-home-button">Ver más</button>
            </div>
            <img 
                src={imagePerrito} 
                alt="Perrito feliz" 
                className="consulta-home-image"
            />
        </div>
    )
}