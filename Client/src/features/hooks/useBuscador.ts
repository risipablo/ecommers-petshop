// features/hooks/useBuscador.ts
import { useProducts } from "./useProducts";
import { useNavigate } from 'react-router-dom';

export const UseBuscador = () => {
    const { handleSearch, clearSearch } = useProducts();
    const navigate = useNavigate();

    const filterProduct = (searchTerms: string[]) => {
        if (!searchTerms || searchTerms.length === 0 || !searchTerms[0].trim()) {
            clearSearch();
            if (window.location.pathname === '/search') {
                navigate('/');
            }
            return;
        }

        const searchQuery = searchTerms.join(' ');
        handleSearch(searchQuery);
    };

    return { filterProduct };
};