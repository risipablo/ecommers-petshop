// features/hooks/useProducts.ts
import { useProductContext } from "../../context/productsProvider";
import { useEffect, useState } from "react";

export const useProducts = () => {
    const context = useProductContext();
    
    return {
        products: context.products,
        filteredProducts: context.filteredProducts,
        setFilteredProducts: context.setFilteredProducts,
        addProduct: context.addProduct,
        updateProduct: context.updateProduct,
        deleteProduct: context.deleteProduct,
        setSearchTerms: context.setSearchTerms,
        searchTerms: context.searchTerms,
        handleSearch: context.handleSearch,
        clearSearch: context.clearSearch,
        searchQuery: context.searchQuery || '',
        isLoading: context.isLoading,
        error: context.error,
        fetchProducts: context.fetchProducts
    };
};

export const useProduct = (id: string) => {
    const { products, isLoading, fetchProducts } = useProductContext();
    const [product, setProduct] = useState<unknown>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        const findProduct = async () => {
            setLoading(true);
            
            if (products.length === 0) {
                await fetchProducts();
            }
            
            const foundProduct = products.find((p: { _id: string; }) => p._id === id);
            setProduct(foundProduct || null);
            setLoading(false);
        };

        findProduct();
    }, [id, products.length, fetchProducts]);

    useEffect(() => {
        if (products.length > 0 && !product) {
            const foundProduct = products.find((p: { _id: string; }) => p._id === id);
            if (foundProduct) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setProduct(foundProduct);
                setLoading(false);
            }
        }
    }, [products, id, product]);

    return { 
        product, 
        loading: loading || isLoading 
    };
};