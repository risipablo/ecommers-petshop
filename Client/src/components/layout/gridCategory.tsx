import { imageGrid } from "../data/images"
import "../../assets/styles/gridheader.css"

export const GridCategory = () => {

    return(
        <div className="grid-container">
            {imageGrid.map((imag,index) => (
                <ul key={index} className="grid-item">
                    <img 
                        src={imag.image} 
                        alt={imag.alt} 
                        className="grid-image"
                    />
                    <h3> {imag.title} </h3>
                    <button> Ir </button>
                </ul>
            ))}
        </div>
    )

}