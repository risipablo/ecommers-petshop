// components/articulos/SliderModal.tsx
import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SliderModalProps } from '../../features/types/articulos.types';
import { SEO } from '../common/SEO';

export const SliderModal = ({ article, onClose }: SliderModalProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const totalImages = article.images.length;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentImageIndex(0);
    }, [article.id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const goTo = useCallback((index: number) => {
        if (isAnimating) return;
        const clamped = (index + totalImages) % totalImages;
        setIsAnimating(true);
        setCurrentImageIndex(clamped);
        setTimeout(() => setIsAnimating(false), 320);
    }, [totalImages, isAnimating]);

    const goToPrevious = useCallback(() => goTo(currentImageIndex - 1), [currentImageIndex, goTo]);
    const goToNext = useCallback(() => goTo(currentImageIndex + 1), [currentImageIndex, goTo]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToPrevious, goToNext, onClose]);

     const articleUrl = `https://ecommers-petshop.vercel.app/articulos/${article.id}`

    return (
        <div className="art-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <SEO 
                title={article.title}
                description={article.excerpt}
                keywords={`${article.category}, mascotas, cuidado de mascotas, ${article.title}`}
                image={article.images[0]?.url}
                url={articleUrl}
                type="article"
                publishedTime={new Date().toISOString()}
            />
            <div className="art-modal-slider">
                {/* Botón cerrar */}
                <button className="art-modal-close" onClick={onClose} aria-label="Cerrar">
                    <X size={24} />
                </button>

                {/* Slider principal */}
                <div
                    className="art-slider-container"
                >
                    <div
                        className="art-slider-strip"
                        style={{
                            transform: `translateX(-${currentImageIndex * 100}%)`,
                            transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {article.images.map((img, idx) => (
                            <div key={idx} className="art-slider-slide">
                                <img
                                    src={img.url}
                                    alt={img.caption || `Imagen ${idx + 1}`}
                                    draggable={false}
                                    className="art-slider-img"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Contador de imágenes */}
                    <div className="art-image-counter">
                        {currentImageIndex + 1} / {totalImages}
                    </div>

                    {/* Flechas de navegación */}
                    {totalImages > 1 && (
                        <>
                            {currentImageIndex > 0 && (
                                <button 
                                    className="art-arrow-simple prev" 
                                    onClick={goToPrevious}
                                    aria-label="Imagen anterior"
                                >
                                    <ChevronLeft size={28} />
                                </button>
                            )}
                            {currentImageIndex < totalImages - 1 && (
                                <button 
                                    className="art-arrow-simple next" 
                                    onClick={goToNext}
                                    aria-label="Imagen siguiente"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            )}
                        </>
                    )}

                    {/* Dots indicadores */}
                    {totalImages > 1 && (
                        <div className="art-dots-simple">
                            {article.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`art-dot-simple ${idx === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => goTo(idx)}
                                    aria-label={`Ir a imagen ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};