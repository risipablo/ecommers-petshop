// components/common/LazyImage.tsx

import { OptimizedImage } from "../../components/common/optimazeImage";
import { useLazyLoad } from "../hooks/useLazyLoad";



interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    quality?: number;
    fallback?: string;
}

export const LazyImage = ({ src, alt, className, width, height, quality, fallback }: LazyImageProps) => {
    const { ref, isVisible } = useLazyLoad(0.1);

    return (
        <div ref={ref} className={`lazy-image-wrapper ${className}`}>
            {isVisible ? (
                <OptimizedImage
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    quality={quality}
                    fallback={fallback}
                    loading="lazy"
                />
            ) : (
                <div className="image-placeholder skeleton-loading" />
            )}
        </div>
    );
};