// features/components/ProductSkeleton.tsx
import "../../assets/styles/search.css"

export const ProductSkeleton = () => {
    return (
        <div className="product-card skeleton">
            <div className="product-image-wrapper skeleton-image">
                <div className="skeleton-loading"></div>
            </div>
            <div className="product-divider skeleton-divider"></div>
            <div className="product-content">
                <div className="skeleton-title skeleton-loading"></div>
                <div className="product-footer">
                    <div className="skeleton-price skeleton-loading"></div>
                    <div className="skeleton-button skeleton-loading"></div>
                </div>
            </div>
        </div>
    );
};

export const ProductSkeletonGrid = ({ count = 8 }: { count?: number }) => {
    return (
        <div className="product-grid">
            {Array(count).fill(0).map((_, index) => (
                <ProductSkeleton key={index} />
            ))}
        </div>
    );
};