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

    // 🔥 Filtrar solo productos que tienen destacado = 'si'
    const destacados = products.filter(product => product.destacado === 'true');

    return {
        products: destacados,
        loading: loading || isLoading,
        fetch
    };
};