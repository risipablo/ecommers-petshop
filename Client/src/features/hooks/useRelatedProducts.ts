// features/hooks/useRelatedProducts.ts
import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';
import type { Product } from '../types/product.type';

export const useRelatedProducts = (
    currentProductId: string,
    currentCategory: string,
    // currentPet?: string,
    // currentBrand?: string
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
            // 🔥 Excluir el producto actual y filtrar por MISMA CATEGORÍA
            const otherProducts = products.filter(p => p._id !== currentProductId);
            
            // Primero, productos de la misma categoría
            const sameCategory = otherProducts.filter(p => p.category === currentCategory);
            
            // Si hay suficientes de la misma categoría (más de 4), tomar esos
            if (sameCategory.length >= 4) {
                const shuffled = [...sameCategory];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                setRelatedProducts(shuffled.slice(0, 6));
            } else {
                // Si no hay suficientes, completar con productos aleatorios de otras categorías
                const otherCategories = otherProducts.filter(p => p.category !== currentCategory);
                const shuffledSame = [...sameCategory];
                const shuffledOther = [...otherCategories];
                
                for (let i = shuffledOther.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledOther[i], shuffledOther[j]] = [shuffledOther[j], shuffledOther[i]];
                }
                
                const combined = [...shuffledSame, ...shuffledOther];
                setRelatedProducts(combined.slice(0, 6));
            }
            
            setError(null);
        } catch (err) {
            console.error('Error al obtener productos relacionados:', err);
            setError('Error al cargar productos relacionados');
            setRelatedProducts([]);
        } finally {
            setLoading(false);
        }
    }, [products, isLoading, currentProductId, currentCategory]);

    return { relatedProducts, loading, error };
};