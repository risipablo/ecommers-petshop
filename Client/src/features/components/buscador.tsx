// features/components/buscador.tsx (Search component)

import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useProducts } from '../hooks/useProducts';
import '../../assets/styles/search.css';
import type { SearchProps } from '../types/product.type';

export const Search = ({ placeholder, filterData }: SearchProps) => {
    const [inputValue, setInputValue] = useState('');
    const { searchQuery, clearSearch } = useProducts();

    useEffect(() => {
        if (searchQuery) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInputValue(searchQuery);
        } else {
            setInputValue('');
        }
    }, [searchQuery]);

    const performSearch = (value: string) => {
        if (value.trim()) {
            const terms = value.trim().split(/\s+/);
            filterData(terms);
        } else {
            filterData([]);
            clearSearch();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        performSearch(value);
    };

    const handleClear = () => {
        setInputValue('');
        filterData([]);
        clearSearch();
    };

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="search-input"
                />
                <div className="search-buttons">
                    {inputValue && (
                        <button 
                            onClick={handleClear} 
                            className="clear-button"
                            aria-label="Limpiar búsqueda"
                        >
                            <ClearIcon />
                        </button>
                    )}
                    <button 
                        onClick={() => performSearch(inputValue)} 
                        className="search-button"
                        aria-label="Buscar"
                    >
                        <SearchIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};