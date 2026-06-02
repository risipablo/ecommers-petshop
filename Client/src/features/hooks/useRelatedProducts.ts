// features/hooks/useRelatedProducts.ts 

import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';
import type { Product } from '../types/product.type';

export const useRelatedProducts = (
    currentProductId: string,
    currentCategory: string,
) => {
    const { products, isLoading } = useProducts();
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (isLoading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true);
            return;
        }

        if (!products.length || !currentProductId) {
            setRelatedProducts([]);
            setLoading(false);
            return;
        }

        // Excluir producto actual y filtrar por misma categoría
        const sameCategory = products.filter(p => 
            p._id !== currentProductId && 
            p.category === currentCategory
        );
        
        // Mezclar aleatoriamente
        const shuffled = [...sameCategory];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Tomar primeros 6 productos
        const topRelated = shuffled.slice(0, 6);
        
        setRelatedProducts(topRelated);
        setLoading(false);
    }, [products, isLoading, currentProductId, currentCategory]);

    return { relatedProducts, loading };
};