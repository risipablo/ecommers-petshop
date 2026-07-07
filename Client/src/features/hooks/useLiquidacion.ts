// features/hooks/useLiquidacion.ts
import { useState, useEffect, useRef } from 'react';
import { useProducts } from './useProducts';

export const UseLiquidacion = () => {
    const { products, isLoading, fetchProducts } = useProducts();
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [liquidacionProductos, setLiquidacionProductos] = useState<any[]>([]);
    const isFirstLoad = useRef(true);

    const fetch = async () => {
        setLoading(true);
        await fetchProducts();
        setLoading(false);
    };

    useEffect(() => {
        if (products.length > 0 && isFirstLoad.current) {
            const productosFiltrados = products.filter(product => 
                product.descuento === 'liquidacion' || 
                product.descuento === 'si' || 
                product.stock === 'Ultimos en stock'
            );
            
            // Mezclar aleatoriamente
            const shuffled = [...productosFiltrados].sort(() => Math.random() - 0.5);
            
            // Tomar solo 9 productos
            const liquidacionTotal = shuffled.slice(0, 9);
            
            setLiquidacionProductos(liquidacionTotal);
            isFirstLoad.current = false;
        }
    }, [products.length]);

    return {
        products: liquidacionProductos,
        loading: loading || isLoading,
        fetch
    };
};