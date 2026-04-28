// features/hooks/useRelatedProducts.ts
import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';
import type { Product } from '../types/product.type';

export const useRelatedProducts = (
    currentProductId: string,
    currentCategory: string,
    currentPet?: string,
    currentBrand?: string
) => {
    const { products, isLoading } = useProducts();
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoading) {
            setLoading(true);
            return;
        }

        if (!products.length || !currentProductId) {
            setRelatedProducts([]);
            setLoading(false);
            return;
        }

        try {
            const otherProducts = products.filter(p => p._id !== currentProductId);
            
            const productsWithScore = otherProducts.map(product => {
                let score = 0;
                
                if (product.category === currentCategory) {
                    score += 50;
                }
                
                if (currentPet && product.pet === currentPet) {
                    score += 30;
                }
                
                if (currentBrand && product.brand === currentBrand) {
                    score += 20;
                }
                
                const currentPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price));
                const productPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price));
                const priceDiff = Math.abs(currentPrice - productPrice) / currentPrice;
                if (priceDiff <= 0.3) {
                    score += 15;
                }
                
                if (product.age === currentCategory) {
                    score += 10;
                }
                
                return { product, score };
            });
            
            productsWithScore.sort((a, b) => b.score - a.score);
            const topRelated = productsWithScore.slice(0, 6).map(item => item.product);
            
            setRelatedProducts(topRelated);
            setError(null);
        } catch (err) {
            console.error('Error al obtener productos relacionados:', err);
            setError('Error al cargar productos relacionados');
            setRelatedProducts([]);
        } finally {
            setLoading(false);
        }
    }, [products, isLoading, currentProductId, currentCategory, currentPet, currentBrand]);

    return { relatedProducts, loading, error };
};