// features/hooks/useBuscador.ts
import { useProducts } from "./useProducts";

export const UseBuscador = () => {
    const { handleSearch, clearSearch } = useProducts();

    const filterProduct = (searchTerms: string[]) => {
        if (!searchTerms || searchTerms.length === 0 || !searchTerms[0].trim()) {
            clearSearch();
            return;
        }

        // Unir todos los términos en una sola cadena
        const searchQuery = searchTerms.join(' ');
        handleSearch(searchQuery);
    };

    return { filterProduct };
};