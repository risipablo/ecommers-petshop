/* eslint-disable react-hooks/static-components */
// features/components/filters.tsx
import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, Filter, X, SlidersHorizontal } from 'lucide-react';
import type { Product } from '../types/product.type';
import '../../assets/styles/filters.css';


interface FiltersProps {
    products: Product[];
    onFilterChange: (filteredProducts: Product[]) => void;
}

type SectionKey = 'pet' | 'brand' | 'age' | 'weight' | 'price';

export const Filters = ({ products, onFilterChange }: FiltersProps) => {
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedAges, setSelectedAges] = useState<string[]>([]);
    const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 100000 });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openSections, setOpenSections] = useState({
        pet: true,
        brand: true,
        age: true,
        weight: true,
        price: true
    });

    // Memoizar opciones únicas
    const options = useMemo(() => ({
        pet: Array.from(new Set(products.map(p => p.pet).filter(Boolean))),
        brand: Array.from(new Set(products.map(p => p.brand).filter(Boolean))),
        age: Array.from(new Set(products.map(p => p.age).filter(Boolean))),
        weight: Array.from(new Set(products.map(p => p.kg).filter(Boolean)))
    }), [products]);

    // Calcular rango de precios
    useEffect(() => {
        if (products.length > 0) {
            const prices = products.map(p => typeof p.price === 'number' ? p.price : parseFloat(String(p.price)));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPriceRange({ min: minPrice, max: maxPrice });
            setTempPriceRange({ min: minPrice, max: maxPrice });
        }
    }, [products]);

    // Aplicar filtros
    useEffect(() => {
        let filtered = [...products];

        if (selectedPets.length) filtered = filtered.filter(p => selectedPets.includes(p.pet));
        if (selectedBrands.length) filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        if (selectedAges.length) filtered = filtered.filter(p => selectedAges.includes(p.age));
        if (selectedWeights.length) filtered = filtered.filter(p => selectedWeights.includes(p.kg || ''));
        
        filtered = filtered.filter(p => {
            const price = typeof p.price === 'number' ? p.price : parseFloat(String(p.price));
            return price >= tempPriceRange.min && price <= tempPriceRange.max;
        });

        onFilterChange(filtered);
    }, [selectedPets, selectedBrands, selectedAges, selectedWeights, tempPriceRange, products, onFilterChange]);

    const toggleSection = (section: SectionKey) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };

    const clearAllFilters = () => {
        setSelectedPets([]);
        setSelectedBrands([]);
        setSelectedAges([]);
        setSelectedWeights([]);
        setTempPriceRange({ min: priceRange.min, max: priceRange.max });
    };

    const hasActiveFilters = selectedPets.length > 0 || selectedBrands.length > 0 || 
                            selectedAges.length > 0 || selectedWeights.length > 0 ||
                            tempPriceRange.min !== priceRange.min || tempPriceRange.max !== priceRange.max;

    const FilterSection = ({ 
        title, section, options, selectedValues, onChange 
    }: { 
        title: string; section: SectionKey; options: string[]; 
        selectedValues: string[]; onChange: (value: string) => void;
    }) => (
        <div className="filter-section">
            <button className="filter-section-header" onClick={() => toggleSection(section)}>
                <span>{title}</span>
                {openSections[section] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSections[section] && options.length > 0 && (
                <div className="filter-section-content">
                    {options.map(option => (
                        <label key={option} className="filter-checkbox">
                            <input type="checkbox" checked={selectedValues.includes(option)} onChange={() => onChange(option)} />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <button className="mobile-filter-btn" onClick={() => setIsMobileMenuOpen(true)}>
                <SlidersHorizontal size={18} />
                Filtrar productos
                {hasActiveFilters && <span className="filter-badge">•</span>}
            </button>

            <div className="filters-panel">
                <div className="filters-header">
                    <h3><Filter size={18} />Filtros</h3>
                    {hasActiveFilters && (
                        <button className="clear-filters" onClick={clearAllFilters}>
                            <X size={14} />Limpiar todo
                        </button>
                    )}
                </div>

                <FilterSection title="Mascota" section="pet" options={options.pet} selectedValues={selectedPets} onChange={(v) => handleCheckboxChange(setSelectedPets, v)} />
                <FilterSection title="Marcas" section="brand" options={options.brand} selectedValues={selectedBrands} onChange={(v) => handleCheckboxChange(setSelectedBrands, v)} />
                <FilterSection title="Edad" section="age" options={options.age} selectedValues={selectedAges} onChange={(v) => handleCheckboxChange(setSelectedAges, v)} />
                <FilterSection title="Peso (kg)" section="weight" options={[]} selectedValues={selectedWeights} onChange={(v) => handleCheckboxChange(setSelectedWeights, v)} />

                <div className="filter-section">
                    <button className="filter-section-header" onClick={() => toggleSection('price')}>
                        <span>Rango de precio</span>
                        {openSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openSections.price && (
                        <div className="filter-section-content price-range">
                            <div className="price-inputs">
                                <div className="price-input">
                                    <label>Min</label>
                                    <input type="number" value={tempPriceRange.min} onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))} min={priceRange.min} max={tempPriceRange.max} />
                                </div>
                                <span>-</span>
                                <div className="price-input">
                                    <label>Max</label>
                                    <input type="number" value={tempPriceRange.max} onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))} min={tempPriceRange.min} max={priceRange.max} />
                                </div>
                            </div>
                            <div className="price-slider">
                                <input type="range" min={priceRange.min} max={priceRange.max} value={tempPriceRange.min} onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))} />
                                <input type="range" min={priceRange.min} max={priceRange.max} value={tempPriceRange.max} onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))} />
                            </div>
                            <div className="price-values">
                                <span>${tempPriceRange.min.toLocaleString()}</span>
                                <span>${tempPriceRange.max.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="filters-modal-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="filters-modal-header">
                            <h3>Filtrar productos</h3>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
                        </div>
                        <div className="filters-modal-content">
                            <FilterSection title="Mascota" section="pet" options={options.pet} selectedValues={selectedPets} onChange={(v) => handleCheckboxChange(setSelectedPets, v)} />
                            <FilterSection title="Marcas" section="brand" options={options.brand} selectedValues={selectedBrands} onChange={(v) => handleCheckboxChange(setSelectedBrands, v)} />
                            <FilterSection title="Edad" section="age" options={options.age} selectedValues={selectedAges} onChange={(v) => handleCheckboxChange(setSelectedAges, v)} />
                            <FilterSection title="Peso (kg)" section="weight" selectedValues={selectedWeights} onChange={(v) => handleCheckboxChange(setSelectedWeights, v)} options={[]} />
                            <div className="filter-section">
                                <div className="filter-section-header"><span>Rango de precio</span></div>
                                <div className="filter-section-content price-range">
                                    <div className="price-inputs">
                                        <div className="price-input">
                                            <label>Min</label>
                                            <input type="number" value={tempPriceRange.min} onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))} />
                                        </div>
                                        <span>-</span>
                                        <div className="price-input">
                                            <label>Max</label>
                                            <input type="number" value={tempPriceRange.max} onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="filters-modal-footer">
                            <button className="clear-filters-btn" onClick={clearAllFilters}>Limpiar todo</button>
                            <button className="apply-filters-btn" onClick={() => setIsMobileMenuOpen(false)}>Aplicar filtros</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};