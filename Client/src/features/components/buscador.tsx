import { useState, useEffect } from 'react';
import type { SearchProps } from '../types/types';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useProducts } from '../hooks/useProducts';
import '../../assets/styles/search.css';

export const Search = ({ placeholder, filterData }: SearchProps) => {
    const [inputValue, setInputValue] = useState('');
    
    const [searchTerms, setSearchTerms] = useState<string[]>([]);
    const { clearSearch, searchQuery } = useProducts();

    // Sincronizar con searchQuery del contexto
    useEffect(() => {
        if (searchQuery) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInputValue(searchQuery);
            setSearchTerms([searchQuery]);
            console.log('searchQuery changed:', searchTerms);
        } else {
            setInputValue('');
            setSearchTerms([]);
        }
    }, [searchQuery]);
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        
        if (value.trim() === '') {
            clearSearch();
            setSearchTerms([]);
        }
    };

    const handleSearch = () => {
        if (inputValue.trim()) {
            const terms = inputValue.trim().split(/\s+/);
            setSearchTerms(terms);
            filterData(terms);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClear = () => {
        setInputValue('');
        setSearchTerms([]);
        clearSearch();
    };

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
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
                        onClick={handleSearch} 
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