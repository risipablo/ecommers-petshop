import { useNavigate } from 'react-router-dom';
import { imageGrid } from "../data/images";
import "../../assets/styles/gridheader.css";
import { ArrowRight } from 'lucide-react';

export const GridCategory = () => {
    const navigate = useNavigate();

    return (
        <div className="grid-container">
            {imageGrid.map((imag, index) => (
                <div
                    key={imag.id}
                    className="grid-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/${imag.path}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/${imag.path}`)}
                    aria-label={`Ir a ${imag.title}`}
                >
                    <img
                        src={imag.image}
                        alt={imag.alt}
                        className="grid-image"
                        loading="lazy"
                    />
                    <div className="grid-overlay" />

                    <div className="grid-content">
                        <h3 className="grid-title">{imag.title}</h3>
                        <button
                            className="grid-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/${imag.path}`);
                            }}
                            tabIndex={-1}
                        >
                            <span>Ver productos</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};