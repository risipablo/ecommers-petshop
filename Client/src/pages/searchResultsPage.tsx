import { ProductList } from "../features/components/productList";
import { useProducts } from "../features/hooks/useProducts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function SearchResultsPage() {
    const { searchQuery } = useProducts();
    const navigate = useNavigate();
    
    useEffect(() => {
        // Si no hay término de búsqueda, redirigir al home
        if (!searchQuery.trim()) {
            navigate('/');
        }
    }, [searchQuery, navigate]);

    return <ProductList />;
}