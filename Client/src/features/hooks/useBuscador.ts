import { useProducts } from "./useProducts";

export const UseBuscador = () => {
    const { products, handleSearch, clearSearch } = useProducts();


    const filterProduct = (searchTerms: string[]) => {
        console.log('🚀 filterProduct llamado con términos:', searchTerms);
        console.log('🔍 Longitud de términos:', searchTerms?.length);
        
        if (!searchTerms || searchTerms.length === 0 || !searchTerms[0].trim()) {
            clearSearch();
            
            return;
        }


        // Unir todos los términos en una sola cadena
        const searchQuery = searchTerms.join(' ');
        handleSearch(searchQuery);
    };

    return { filterProduct, products };
};