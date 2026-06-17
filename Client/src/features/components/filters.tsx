/* eslint-disable react-hooks/static-components */
// features/components/Filters.tsx
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X, SlidersHorizontal } from 'lucide-react';
import type { Product } from '../types/product.type';
import '../../assets/styles/filters.css';

interface FiltersProps {
    products: Product[];
    onFilterChange: (filteredProducts: Product[]) => void;
}

type SectionKey = 'pet' | 'brand' | 'age' | 'weight' | 'price' | 'discount';

export const Filters = ({ products, onFilterChange }: FiltersProps) => {
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedAges, setSelectedAges] = useState<string[]>([]);
    const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
    const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
    const [selectedDiscount, setSelectedDiscount] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
    const [tempPriceRange, setTempPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openSections, setOpenSections] = useState({
        pet: true,
        brand: true,
        age: true,
        weight: true,
        condition: true,
        price: true,
        discount: true
    });

    // Obtener opciones únicas de los productos (ordenadas alfabéticamente)
    const petOptions = Array.from(new Set(products.map(p => p.pet).filter((pet): pet is string => Boolean(pet)))).sort((a, b) => a.localeCompare(b, 'es'));
    const brandOptions = Array.from(new Set(products.map(p => p.brand).filter((brand): brand is string => Boolean(brand)))).sort((a, b) => a.localeCompare(b, 'es'));
    const ageOptions = Array.from(new Set(products.map(p => p.age).filter((age): age is string => Boolean(age)))).sort((a, b) => a.localeCompare(b, 'es'));
    const weightOptions = Array.from(new Set(products.map(p => p.kg).filter((kg): kg is string => Boolean(kg)))).sort((a, b) => a.localeCompare(b, 'es'));
    const conditionOptions = Array.from(new Set(products.map(p => p.condition).filter((condition): condition is string => Boolean(condition)))).sort((a, b) => a.localeCompare(b, 'es'));
    
    // 🔥 Opciones de descuento actualizadas
    const discountOptions = ['Con descuento', 'En liquidación', 'Sin descuento'];

    // Calcular precio mínimo y máximo
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

        if (selectedPets.length > 0) {
            filtered = filtered.filter(p => selectedPets.includes(p.pet));
        }

        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        }

        if (selectedAges.length > 0) {
            filtered = filtered.filter(p => selectedAges.includes(p.age));
        }

        if (selectedWeights.length > 0) {
            filtered = filtered.filter(p => selectedWeights.includes(p.kg || ''));
        }

        if (selectedCondition.length > 0) {
            filtered = filtered.filter(p => selectedCondition.includes(p.condition || ''));
        }

        // 🔥 Filtrar por descuento (incluyendo liquidación)
        if (selectedDiscount.length > 0) {
            filtered = filtered.filter(p => {
                const hasDiscount = p.descuento === 'si';
                const hasLiquidacion = p.descuento === 'liquidacion';
                
                if (selectedDiscount.includes('Con descuento') && selectedDiscount.includes('En liquidación') && selectedDiscount.includes('Sin descuento')) {
                    return true;
                }
                if (selectedDiscount.includes('Con descuento') && selectedDiscount.includes('En liquidación')) {
                    return hasDiscount || hasLiquidacion;
                }
                if (selectedDiscount.includes('Con descuento')) {
                    return hasDiscount;
                }
                if (selectedDiscount.includes('En liquidación')) {
                    return hasLiquidacion;
                }
                if (selectedDiscount.includes('Sin descuento')) {
                    return !hasDiscount && !hasLiquidacion;
                }
                return true;
            });
        }

        filtered = filtered.filter(p => {
            const price = typeof p.price === 'number' ? p.price : parseFloat(String(p.price));
            return price >= tempPriceRange.min && price <= tempPriceRange.max;
        });

        onFilterChange(filtered);
    }, [selectedPets, selectedBrands, selectedAges, selectedWeights, selectedDiscount, selectedCondition, tempPriceRange, products, onFilterChange]);

    const toggleSection = (section: SectionKey) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePetChange = (pet: string) => {
        setSelectedPets(prev =>
            prev.includes(pet) ? prev.filter(p => p !== pet) : [...prev, pet]
        );
    };

    const handleBrandChange = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const handleAgeChange = (age: string) => {
        setSelectedAges(prev =>
            prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
        );
    };

    const handleConditionChange = (condition: string) => {
        setSelectedCondition(prev =>
            prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
        );
    }

    const handleWeightChange = (weight: string) => {
        setSelectedWeights(prev =>
            prev.includes(weight) ? prev.filter(w => w !== weight) : [...prev, weight]
        );
    };

    const handleDiscountChange = (discount: string) => {
        setSelectedDiscount(prev =>
            prev.includes(discount) ? prev.filter(d => d !== discount) : [...prev, discount]
        );
    };

    const clearAllFilters = () => {
        setSelectedPets([]);
        setSelectedBrands([]);
        setSelectedAges([]);
        setSelectedWeights([]);
        setSelectedCondition([]);
        setSelectedDiscount([]);
        setTempPriceRange({ min: priceRange.min, max: priceRange.max });
        setIsMobileMenuOpen(false)
    };

    const hasActiveFilters = selectedPets.length > 0 || selectedBrands.length > 0 || 
                            selectedAges.length > 0 || selectedWeights.length > 0 || 
                            selectedDiscount.length > 0 || selectedCondition.length > 0 ||
                            tempPriceRange.min !== priceRange.min || tempPriceRange.max !== priceRange.max;

    const FilterSection = ({ 
        title, 
        section, 
        options, 
        selectedValues, 
        onChange 
    }: { 
        title: string; 
        section: SectionKey; 
        options: string[]; 
        selectedValues: string[]; 
        onChange: (value: string) => void;
    }) => (
        <div className="filter-section">
            <button 
                className="filter-section-header"
                onClick={() => toggleSection(section)}
            >
                <span>{title}</span>
                {openSections[section] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openSections[section] && options.length > 0 && (
                <div className="filter-section-content">
                    {options.map((option) => (
                        <label key={option} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option)}
                                onChange={() => onChange(option)}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Botón móvil */}
            <button 
                className="mobile-filter-btn"
                onClick={() => setIsMobileMenuOpen(true)}
            >
                <SlidersHorizontal size={18} />
                Filtrar productos
                {hasActiveFilters && <span className="filter-badge">•</span>}
            </button>

            {/* Panel de filtros desktop */}
            <div className="filters-panel">
                <div className="filters-header">
                    <h3>
                        <Filter size={18} />
                        Filtros
                    </h3>
                    {hasActiveFilters && (
                        <button className="clear-filters" onClick={clearAllFilters}>
                            <X size={14} />
                            Limpiar todo
                        </button>
                    )}
                </div>

                <div className="filters-content">
                    <FilterSection
                        title="Mascota"
                        section="pet"
                        options={petOptions}
                        selectedValues={selectedPets}
                        onChange={handlePetChange}
                    />

                    <FilterSection
                        title="Marcas"
                        section="brand"
                        options={brandOptions}
                        selectedValues={selectedBrands}
                        onChange={handleBrandChange}
                    />

                    <FilterSection
                        title="Edad"
                        section="age"
                        options={ageOptions}
                        selectedValues={selectedAges}
                        onChange={handleAgeChange}
                    />

                    <FilterSection
                        title="Medicados"  
                        options={conditionOptions}
                        selectedValues={selectedCondition}
                        onChange={handleConditionChange} section={'pet'}
                    />

                    <FilterSection
                        title="Peso (kg)"
                        section="weight"
                        options={weightOptions}
                        selectedValues={selectedWeights}
                        onChange={handleWeightChange}
                    />

                    

                    {/* 🔥 Sección de Descuentos actualizada */}
                    <FilterSection
                        title="Descuentos"
                        section="discount"
                        options={discountOptions}
                        selectedValues={selectedDiscount}
                        onChange={handleDiscountChange}
                    />


                    <div className="filter-section">
                        <button 
                            className="filter-section-header"
                            onClick={() => toggleSection('price')}
                        >
                            <span>Rango de precio</span>
                            {openSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {openSections.price && (
                            <div className="filter-section-content price-range">
                                <div className="price-inputs">
                                    <div className="price-input">
                                        <label>Mínimo</label>
                                        <input
                                            type="number"
                                            value={tempPriceRange.min}
                                            onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            min={priceRange.min}
                                            max={tempPriceRange.max}
                                        />
                                    </div>
                                    <span>-</span>
                                    <div className="price-input">
                                        <label>Máximo</label>
                                        <input
                                            type="number"
                                            value={tempPriceRange.max}
                                            onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                            min={tempPriceRange.min}
                                            max={priceRange.max}
                                        />
                                    </div>
                                </div>
                                <div className="price-slider">
                                    <input
                                        type="range"
                                        min={priceRange.min}
                                        max={priceRange.max}
                                        value={tempPriceRange.min}
                                        onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                        className="slider-min"
                                    />
                                    <input
                                        type="range"
                                        min={priceRange.min}
                                        max={priceRange.max}
                                        value={tempPriceRange.max}
                                        onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                        className="slider-max"
                                    />
                                </div>
                                <div className="price-values">
                                    <span>${tempPriceRange.min.toLocaleString()}</span>
                                    <span>${tempPriceRange.max.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Panel de filtros móvil */}
            {isMobileMenuOpen && (
                <div className="filters-modal-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="filters-modal-header">
                            <h3>Filtrar productos</h3>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="filters-modal-content">
                            <FilterSection
                                title="Mascota"
                                section="pet"
                                options={petOptions}
                                selectedValues={selectedPets}
                                onChange={handlePetChange}
                            />
                            <FilterSection
                                title="Marcas"
                                section="brand"
                                options={brandOptions}
                                selectedValues={selectedBrands}
                                onChange={handleBrandChange}
                            />
                            <FilterSection
                                title="Edad"
                                section="age"
                                options={ageOptions}
                                selectedValues={selectedAges}
                                onChange={handleAgeChange}
                            />
                            <FilterSection
                                title="Peso (kg)"
                                section="weight"
                                options={weightOptions}
                                selectedValues={selectedWeights}
                                onChange={handleWeightChange}
                            />
                            <FilterSection
                                title="Descuentos"
                                section="discount"
                                options={discountOptions}
                                selectedValues={selectedDiscount}
                                onChange={handleDiscountChange}
                            />
                            <div className="filter-section">
                                <div className="filter-section-header">
                                    <span>Rango de precio</span>
                                </div>
                                <div className="filter-section-content price-range">
                                    <div className="price-inputs">
                                        <div className="price-input">
                                            <label>Mínimo</label>
                                            <input
                                                type="number"
                                                value={tempPriceRange.min}
                                                onChange={(e) => setTempPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            />
                                        </div>
                                        <span>-</span>
                                        <div className="price-input">
                                            <label>Máximo</label>
                                            <input
                                                type="number"
                                                value={tempPriceRange.max}
                                                onChange={(e) => setTempPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="filters-modal-footer">
                            <button className="clear-filters-btn" onClick={clearAllFilters}>
                                Limpiar todo
                            </button>
                            <button className="apply-filters-btn" onClick={() => setIsMobileMenuOpen(false)}>
                                Aplicar filtros
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};