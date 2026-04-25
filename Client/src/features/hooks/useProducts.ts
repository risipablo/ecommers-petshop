// features/hooks/useProducts.ts
import { useProductContext } from "../../context/productsProvider";

export const useProducts = () => {
    const context = useProductContext();
    
    return {
        products: context.products,
        filteredProducts: context.filteredProducts,
        setFilteredProducts: context.setFilteredProducts,
        addProduct: context.addProduct,
        updateProduct: context.updateProduct,  // 🔥 Agregado
        deleteProduct: context.deleteProduct,  // 🔥 Agregado
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
    const { products, isLoading } = useProductContext();
    const product = products.find((p: { _id: string; }) => p._id === id) || null;
    
    return { product, loading: isLoading || (!product && products.length > 0) };
};