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

        // Filtrar productos con stock disponible (excluyendo el actual)
        const availableProducts = products.filter(p => 
            p._id !== currentProductId && 
            p.stock === 'Disponible'
        );

        //  Separar por categorías
        const sameCategory = availableProducts.filter(p => p.category === currentCategory);
        const otherCategories = availableProducts.filter(p => p.category !== currentCategory);

        //  Mezclar aleatoriamente ambas listas
        const shuffleArray = (arr: Product[]) => {
            const shuffled = [...arr];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        const shuffledSame = shuffleArray(sameCategory);
        const shuffledOther = shuffleArray(otherCategories);

        
        // Si no hay suficientes de la misma categoría, completar con otras
        let finalRelated: Product[] = [];
        
        if (shuffledSame.length >= 4) {
           
            finalRelated = shuffledSame.slice(0, 4);
           
            const otherToAdd = shuffledOther.slice(0, 2);
            finalRelated = [...finalRelated, ...otherToAdd];
        } else {
            
            finalRelated = shuffledSame;
            
            const needed = 6 - finalRelated.length;
            const otherToAdd = shuffledOther.slice(0, needed);
            finalRelated = [...finalRelated, ...otherToAdd];
        }

        // Mezclar ligeramente para no tener siempre el mismo orden
        if (finalRelated.length > 0) {
            // Mezclar solo dentro de los primeros 4
            const firstFour = finalRelated.slice(0, 4);
            const rest = finalRelated.slice(4);
            
           
            for (let i = firstFour.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [firstFour[i], firstFour[j]] = [firstFour[j], firstFour[i]];
            }
            
            finalRelated = [...firstFour, ...rest];
        }

        setRelatedProducts(finalRelated.slice(0, 6));
        setLoading(false);
    }, [products, isLoading, currentProductId, currentCategory]);

    return { relatedProducts, loading };
};