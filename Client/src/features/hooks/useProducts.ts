import { useProductContext } from "../../context/productsProvider";

export const useProducts = () => {
    const context = useProductContext();
    
    return {
        products: context.products,
        filteredProducts: context.filteredProducts,
        setFilteredProducts: context.setFilteredProducts,
        addProduct: context.addProduct,
        setSearchTerms: context.setSearchTerms,
        searchTerms: context.searchTerms,
        handleSearch: context.handleSearch,
        clearSearch: context.clearSearch,
        searchQuery: context.searchQuery || ''
    };
};

// Get product by id
export const useProduct = (id: string) => {
    const { products } = useProductContext();
    const product = products.find(p => p._id === id) || null;
    
     return { product, loading: !product && products.length > 0 };
};