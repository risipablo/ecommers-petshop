// components/common/OptimizedImage.tsx
import { useState, useEffect, useRef } from "react";

interface OptimizedImageProps {
    src?: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    quality?: number;
    loading?: 'lazy' | 'eager';
    fallback?: string;
}

export const OptimizedImage = ({
    src,
    alt,
    className = '',
    width = 300,
    height = 300,
    quality = 80,
    loading = 'lazy',
    fallback = 'https://via.placeholder.com/300x300?text=Sin+Imagen'
}: OptimizedImageProps) => {
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const getOptimizedUrl = (url: string) => {
        if (!url) return fallback;
        
        if (url.includes('supabase.co')) {
            const baseUrl = url.split('?')[0];
            return `${baseUrl}?width=${width}&height=${height}&quality=${quality}&format=webp&fit=cover`;
        }
        
        return url;
    };

    useEffect(() => {
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoaded(false);
        setError(false);
        
        
        if (src) {
            const cachedImage = new Image();
            cachedImage.src = getOptimizedUrl(src);
            
            if (cachedImage.complete) {
                setIsLoaded(true);
            }
        }
    }, [src]);

    return (
        <div className={`optimized-image-wrapper ${className}`}>
            {!isLoaded && !error && (
                <div className="image-placeholder skeleton-loading" />
            )}
            <img
                ref={imgRef}
                src={error ? fallback : getOptimizedUrl(src || '')}
                alt={alt}
                loading={loading}
                width={width}
                height={height}
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                onError={() => setError(true)}
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                }}
            />
        </div>
    );
};