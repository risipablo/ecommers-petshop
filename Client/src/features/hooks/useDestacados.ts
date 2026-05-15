// features/hooks/useDestacados.ts
import { useState } from 'react';
import { useProducts } from './useProducts';

export const UseDestacados = () => {
    const { products, isLoading, fetchProducts } = useProducts();
    const [loading, setLoading] = useState(true);

    const fetch = async () => {
        setLoading(true);
        await fetchProducts();
        setLoading(false);
    };

    // Mostrar los primeros 8 productos (los más recientes)
    const destacados = products.slice(0, 8);

    return {
        products: destacados,
        loading: loading || isLoading,
        fetch
    };
};