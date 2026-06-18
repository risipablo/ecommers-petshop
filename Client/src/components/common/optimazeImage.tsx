// components/common/OptimizedImage.tsx
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    quality?: number;
    loading?: 'lazy' | 'eager';
    fallback?: string;
    sizes?: string;
    onLoad?: () => void;
}

export const OptimizedImage = ({
    src,
    alt,
    className = '',
    width,
    height,
    quality = 80,
    loading = 'lazy',
    fallback = 'https://via.placeholder.com/300x300?text=Sin+Imagen',
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    onLoad
}: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImgSrc(src);
        setError(false);
        setIsLoaded(false);
    }, [src]);

    // Generar URLs optimizadas con parámetros de Supabase
    const getOptimizedUrl = (url: string) => {
        if (!url) return fallback;
        
        // Si es de Supabase, usar transformaciones
        if (url.includes('supabase.co')) {
            const widthParam = width ? `&width=${width}` : '';
            const qualityParam = quality ? `&quality=${quality}` : '';
            return `${url}${url.includes('?') ? '&' : '?'}${widthParam}${qualityParam}`;
        }
        
        return url;
    };

    const handleError = () => {
        setError(true);
        setImgSrc(fallback);
    };

    const handleLoad = () => {
        setIsLoaded(true);
        if (onLoad) onLoad();
    };

    // Placeholder mientras carga
    const showPlaceholder = !isLoaded && !error;

    return (
        <div className={`optimized-image-wrapper ${className}`} style={{ position: 'relative' }}>
            {showPlaceholder && (
                <div className="image-placeholder skeleton-loading" />
            )}
            <img
                src={error ? fallback : getOptimizedUrl(imgSrc)}
                alt={alt}
                className={`optimized-image ${isLoaded ? 'loaded' : ''}`}
                loading={loading}
                width={width}
                height={height}
                sizes={sizes}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                }}
            />
        </div>
    );
};