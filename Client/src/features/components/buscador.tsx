// features/components/buscador.tsx
import { useState, useEffect, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useProducts } from '../hooks/useProducts';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/styles/search.css';
import type { SearchProps } from '../types/product.type';

export const Search = ({ placeholder, filterData }: SearchProps) => {
    const [inputValue, setInputValue] = useState('');
    const { searchQuery, clearSearch } = useProducts();
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef<HTMLInputElement>(null);

    // Sincronizar con searchQuery del contexto
    useEffect(() => {
        if (searchQuery) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setInputValue(searchQuery);
        } else {
            setInputValue('');
        }
    }, [searchQuery]);

    // Ejecutar búsqueda solo cuando se presiona Enter o el botón
    const performSearch = () => {
        const value = inputValue.trim();
        if (value) {
            const terms = value.split(/\s+/);
            filterData(terms);
            if (location.pathname !== '/search') {
                navigate('/search');
            }
            // Limpiar el input después de la búsqueda
            setInputValue('');
        } else {
            clearSearch();
            if (location.pathname === '/search') {
                navigate('/');
            }
        }
    };

    // Solo actualizar el estado local, NO ejecutar búsqueda
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        
        // Si el input se vacía, limpiar búsqueda inmediatamente
        if (value.trim() === '') {
            clearSearch();
            if (location.pathname === '/search') {
                navigate('/');
            }
        }
    };

    // Ejecutar búsqueda al presionar Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    };

    // Ejecutar búsqueda al hacer clic en la lupa
    const handleSearchClick = () => {
        performSearch();
    };

    // Limpiar búsqueda
    const handleClear = () => {
        setInputValue('');
        clearSearch();
        if (location.pathname === '/search') {
            navigate('/');
        }
        inputRef.current?.focus();
    };

    return (
        <div className="search-container">
            <div className="search-input-wrapper">
                <input
                    ref={inputRef}
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
                            type="button"
                        >
                            <ClearIcon />
                        </button>
                    )}
                    <button 
                        onClick={handleSearchClick} 
                        className="search-button"
                        aria-label="Buscar"
                        type="button"
                    >
                        <SearchIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};