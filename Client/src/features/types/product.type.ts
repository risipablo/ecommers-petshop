// features/types/product.type.ts
export interface SearchProps {
    placeholder: string;
    filterData: (searchTerms: string[]) => void;
}

export interface ProductsContextType {
    products: Product[];
    filteredProducts: Product[];
    setFilteredProducts: (products: Product[]) => void;
    addProduct: (formData: FormData) => Promise<void>;
    updateProduct: (id: string, formData: FormData) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    searchTerms: string[];
    setSearchTerms: (terms: string[]) => void;
    handleSearch: (term: string) => void;
    clearSearch: () => void;
    searchQuery: string;
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}


export interface Product {
    condition: string;
    _id: string;
    name: string;
    brand: string;
    pet: string;
    category: string;
    description: string;
    age: string;
    price: number;
    kg?: string;
    special?: string | null;
    imageUrl?: string;
    imagePublicId?: string;
}

export interface IDestacados {
    id: number;
    name: string;
    image: string;
}