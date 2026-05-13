// features/types/filters.types.ts
export interface FiltersState {
    pet: string[];
    brands: string[];
    age: string[];
    weight: string[];
    priceRange: {
        min: number;
        max: number;
    };
}

export interface FilterOption {
    id: string;
    label: string;
    value: string;
    count?: number;
}

export interface PriceRange {
    min: number;
    max: number;
}