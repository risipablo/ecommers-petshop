// components/articulos/SliderModal.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { SliderModalProps } from '../../features/types/articulos.types';


export const SliderModal = ({ article, onClose }: SliderModalProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const totalImages = article.images.length;

    // Resetear índice al abrir
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [article.id]);

    // Scroll to top al abrir
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // eslint-disable-next-line react-hooks/immutability
            if (e.key === 'ArrowLeft') goToPrevious();
            // eslint-disable-next-line react-hooks/immutability
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentImageIndex]);

    const goToPrevious = useCallback(() => {
        setCurrentImageIndex(prev => (prev - 1 + totalImages) % totalImages);
    }, [totalImages]);

    const goToNext = useCallback(() => {
        setCurrentImageIndex(prev => (prev + 1) % totalImages);
    }, [totalImages]);

    const handlePointerDown = (e: React.PointerEvent) => {
        startX.current = e.clientX;
        setIsDragging(true);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const diff = e.clientX - startX.current;
        if (diff < -40) goToNext();
        else if (diff > 40) goToPrevious();
        setIsDragging(false);
    };

    return (
        <div className="art-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="art-modal">
                {/* Botón cerrar */}
                <button className="art-modal-close" onClick={onClose} aria-label="Cerrar">
                    <X size={18} />
                </button>

                {/* Slider de imágenes */}
                <div
                    className={`art-slider ${isDragging ? 'dragging' : ''}`}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={() => setIsDragging(false)}
                >
                    {article.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img.url}
                            alt={img.caption}
                            draggable={false}
                            className={`art-slider-img ${idx === currentImageIndex ? 'active' : ''}`}
                        />
                    ))}
                    <div className="art-slider-gradient" />
                    <p className="art-slider-caption">{article.images[currentImageIndex]?.caption}</p>

                    {/* Dots de navegación */}
                    <div className="art-slider-dots">
                        {article.images.map((_, idx) => (
                            <button
                                key={idx}
                                className={`art-dot ${idx === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(idx)}
                                aria-label={`Imagen ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Flechas de navegación */}
                    {totalImages > 1 && (
                        <>
                            <button className="art-arrow prev" onClick={goToPrevious} aria-label="Anterior">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="art-arrow next" onClick={goToNext} aria-label="Siguiente">
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                {/* Contenido del modal */}
                <div className="art-modal-body">
                    <div className="art-modal-tags">
                        <span
                            className="art-modal-badge"
                            style={{ background: `${article.color}18`, color: article.color }}
                        >
                            {article.category}
                        </span>
                        <span className="art-modal-readtime">
                            <Clock size={12} />
                            {article.readTime} de lectura
                        </span>
                    </div>
                    <h2 className="art-modal-title">{article.title}</h2>
                    <p className="art-modal-excerpt">{article.excerpt}</p>

                    {/* Miniaturas */}
                    <div className="art-thumbs">
                        {article.images.map((img, idx) => (
                            <button
                                key={idx}
                                className={`art-thumb ${idx === currentImageIndex ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(idx)}
                                style={idx === currentImageIndex ? { outlineColor: article.color } : undefined}
                                aria-label={`Ver imagen ${idx + 1}`}
                            >
                                <img src={img.url} alt={img.caption} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};