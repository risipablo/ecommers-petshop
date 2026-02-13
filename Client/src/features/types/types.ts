export interface SearchProps {
    placeholder: string;
    filterData: (searchTerms: string[]) => void;
}

export interface ProductsContextType {
    products: Product[];
    filteredProducts: Product[];
    setFilteredProducts: (products: Product[]) => void;
    addProduct: (name: string, brand: string, pet: string, category: string, description: string, age: string, condition: string, price: string, kg: string) => void;
    searchTerms: boolean;
    setSearchTerms: (active: boolean) => void;
    handleSearch: (term: string) => void;
    clearSearch: () => void;
    searchQuery: string;
}

export interface Product {
    _id: string;
    name: string;
    brand: string;
    pet: string;
    category: string;
    description: string;
    age: string;
    condition: string;
    price: string;
    kg: string;
    image?: string;
}


export interface IDestacados{
    id:number
    name:string
    image:string
}