// features/components/filterPrice.tsx
import { useState, useEffect, useRef } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, ChevronDown } from 'lucide-react';
import type { Product } from '../types/product.type';
import '../../assets/styles/filters.css';

interface SortControlsProps {
    products: Product[];
    onSortChange: (sortedProducts: Product[]) => void;
    isLoading?: boolean;
}

type SortType = 'none' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SortControls = ({ products, onSortChange, isLoading = false }: SortControlsProps) => {
    const [sortType, setSortType] = useState<SortType>('none');
    const [isSorting, setIsSorting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sortProducts = (type: SortType) => {
        if (type === 'none') {
            onSortChange([...products]);
            return;
        }

        const sorted = [...products];
        
        switch (type) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name, 'es'));
                break;
        }
        
        onSortChange(sorted);
    };

    const handleSortChange = (type: SortType) => {
        if (isSorting) return;
        
        setIsSorting(true);
        setSortType(type);
        sortProducts(type);
        setIsOpen(false);
        
        setTimeout(() => {
            setIsSorting(false);
        }, 300);
    };

    const getSortLabel = () => {
        if (sortType === 'price-asc') return 'Precio: menor a mayor';
        if (sortType === 'price-desc') return 'Precio: mayor a menor';
        if (sortType === 'name-asc') return 'Nombre: A a Z';
        if (sortType === 'name-desc') return 'Nombre: Z a A';
        return 'Ordenar por';
    };

    return (
        <div className="sort-controls-wrapper">
            <div className="sort-controls" ref={dropdownRef}>
                <button 
                    className="sort-trigger"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isSorting}
                >
                    {isSorting ? <Loader2 size={16} className="spinner" /> : <ArrowUpDown size={16} />}
                    <span>{getSortLabel()}</span>
                    <ChevronDown size={14} className={`sort-chevron ${isOpen ? 'open' : ''}`} />
                </button>
                
                {isOpen && (
                    <div className="sort-menu">
                        <button 
                            className={`sort-option ${sortType === 'none' ? 'active' : ''}`}
                            onClick={() => handleSortChange('none')}
                        >
                            <ArrowUpDown size={14} />
                            Sin ordenar (por defecto)
                        </button>
                        <button 
                            className={`sort-option ${sortType === 'price-asc' ? 'active' : ''}`}
                            onClick={() => handleSortChange('price-asc')}
                        >
                            <ArrowUp size={14} />
                            Precio: menor a mayor
                        </button>
                        <button 
                            className={`sort-option ${sortType === 'price-desc' ? 'active' : ''}`}
                            onClick={() => handleSortChange('price-desc')}
                        >
                            <ArrowDown size={14} />
                            Precio: mayor a menor
                        </button>
                        <button 
                            className={`sort-option ${sortType === 'name-asc' ? 'active' : ''}`}
                            onClick={() => handleSortChange('name-asc')}
                        >
                            <ArrowUp size={14} />
                            Nombre: A a Z
                        </button>
                        <button 
                            className={`sort-option ${sortType === 'name-desc' ? 'active' : ''}`}
                            onClick={() => handleSortChange('name-desc')}
                        >
                            <ArrowDown size={14} />
                            Nombre: Z a A
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};