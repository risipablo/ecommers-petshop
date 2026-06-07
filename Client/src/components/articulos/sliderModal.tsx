// components/articulos/SliderModal.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { SliderModalProps } from '../../features/types/articulos.types';

export const SliderModal = ({ article, onClose }: SliderModalProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const startX = useRef(0);
    const totalImages = article.images.length;

    // Resetear índice al abrir
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentImageIndex(0);
        setDragOffset(0);
    }, [article.id]);

    // Scroll to top al abrir
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const goTo = useCallback((index: number) => {
        if (isAnimating) return;
        const clamped = (index + totalImages) % totalImages;
        setIsAnimating(true);
        setCurrentImageIndex(clamped);
        setDragOffset(0);
        setTimeout(() => setIsAnimating(false), 320);
    }, [totalImages, isAnimating]);

    const goToPrevious = useCallback(() => goTo(currentImageIndex - 1), [currentImageIndex, goTo]);
    const goToNext = useCallback(() => goTo(currentImageIndex + 1), [currentImageIndex, goTo]);

    // Navegación con teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToPrevious, goToNext, onClose]);

    // ── Pointer events (drag / swipe) ──────────────────────────────────────
    const handlePointerDown = (e: React.PointerEvent) => {
        if (isAnimating) return;
        startX.current = e.clientX;
        setIsDragging(true);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const diff = e.clientX - startX.current;
        // Resistencia en los extremos
        if ((currentImageIndex === 0 && diff > 0) || (currentImageIndex === totalImages - 1 && diff < 0)) {
            setDragOffset(diff * 0.25);
        } else {
            setDragOffset(diff);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        const diff = e.clientX - startX.current;
        setIsDragging(false);
        if (diff < -50) goToNext();
        else if (diff > 50) goToPrevious();
        else setDragOffset(0);
    };

    const stripTranslate = `translateX(calc(${-currentImageIndex * 100}% + ${dragOffset}px))`;

    return (
        <div
            className="art-modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="art-modal">

                {/* Botón cerrar */}
                <button className="art-modal-close" onClick={onClose} aria-label="Cerrar">
                    <X size={18} />
                </button>

                {/* ── Slider estilo Instagram ── */}
                <div
                    className={`art-slider${isDragging ? ' dragging' : ''}`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {/* Strip horizontal */}
                    <div
                        className="art-slider-strip"
                        style={{
                            transform: stripTranslate,
                            transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    >
                        {article.images.map((img, idx) => (
                            <div key={idx} className="art-slider-slide">
                                <img
                                    src={img.url}
                                    alt={img.caption}
                                    draggable={false}
                                    className="art-slider-img"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Flechas — solo si no estamos en el extremo */}
                    {totalImages > 1 && (
                        <>
                            {currentImageIndex > 0 && (
                                <button className="art-arrow prev" onClick={goToPrevious} aria-label="Anterior">
                                    <ChevronLeft size={18} />
                                </button>
                            )}
                            {currentImageIndex < totalImages - 1 && (
                                <button className="art-arrow next" onClick={goToNext} aria-label="Siguiente">
                                    <ChevronRight size={18} />
                                </button>
                            )}
                        </>
                    )}

                    {/* Dots centrados abajo */}
                    {totalImages > 1 && (
                        <div className="art-slider-dots">
                            {article.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`art-dot${idx === currentImageIndex ? ' active' : ''}`}
                                    onClick={() => goTo(idx)}
                                    aria-label={`Imagen ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Contenido ── */}
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

                    {article.images[currentImageIndex]?.caption && (
                        <p className="art-modal-caption">
                            {article.images[currentImageIndex].caption}
                        </p>
                    )}

                    {/* Miniaturas */}
                    <div className="art-thumbs">
                        {article.images.map((img, idx) => (
                            <button
                                key={idx}
                                className={`art-thumb${idx === currentImageIndex ? ' active' : ''}`}
                                onClick={() => goTo(idx)}
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