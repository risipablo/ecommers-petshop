/* eslint-disable react-hooks/immutability */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product, ProductsContextType } from "../features/types/types";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);
const serverFront = "https://ecommers-petshop.onrender.com"

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerms, setSearchTerms] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const location = useLocation();

    // Cargar productos iniciales
    useEffect(() => {
        axios.get(`${serverFront}/api/products`)
            .then(response => {
                setProducts(response.data);
                setFilteredProducts(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    // Efecto para manejar cambios de ruta y búsqueda
    useEffect(() => {
        if (products.length === 0) return;

        const currentPath = location.pathname;
        const categoryPath = currentPath.substring(1);

        // Si hay una búsqueda activa
        if (searchQuery.trim() !== '') {
            setSearchTerms(true);
            applySearchFilter(searchQuery);
            return;
        }

        // Si no hay búsqueda, aplicar filtro por ruta
        setSearchTerms(false);
        
        if (currentPath === '/' || categoryPath === '' || categoryPath === 'todos') {
            setFilteredProducts(products);
        }  else if (categoryPath !== 'search') {
            const filtered = products.filter(product => 
                product.category.toLowerCase() === categoryPath.toLowerCase()
            );
            setFilteredProducts(filtered);
        }
    }, [location.pathname, products, searchQuery]);

    // Función para aplicar filtro de búsqueda
    const applySearchFilter = (query: string) => {
        const lowerQuery = query.toLowerCase().trim();
        
        const filtered = products.filter(product => {
            if (!product) return false;

            const searchableText = `
                ${product.name || ''}
                ${product.brand || ''}
                ${product.category || ''}
                ${product.pet || ''}
                ${product.age || ''}
                ${product.condition || ''}
                ${product.description || ''}
                ${product.price || ''}
                ${product.kg || ''}
            `.toLowerCase();

            return searchableText.includes(lowerQuery);
        });

        setFilteredProducts(filtered);
    };

    // Función para manejar búsqueda
    const handleSearch = (term: string) => {
        setSearchQuery(term);
        setSearchTerms(true);

        if (location.pathname !== '/search') {
            setFilteredProducts(products)
        }
    };

    // Función para limpiar búsqueda
    const clearSearch = () => {
        setSearchQuery('');
        setSearchTerms(false);
        
        // Si estamos en la ruta /search, mantener los productos sin filtrar
        if (location.pathname === '/search') {
            setFilteredProducts(products);
        }
    };


    // Función para añadir producto
    const addProduct = (name: string, brand: string, pet: string, category: string, description: string, age: string, condition: string, price: string, kg: string) => {
        axios.post(`${serverFront}/api/products`, {
            name, brand, pet, category, age, price, description, condition, kg
        })
        .then(response => {
            setProducts(prev => {
                const updatedProducts = [...prev, response.data];
                
                // Actualizar filteredProducts si corresponde
                const currentPath = location.pathname;
                
                if (currentPath === '/search' && searchQuery.trim() !== '') {
                    // Si estamos en búsqueda y el producto coincide, añadirlo
                    if (productMatchesSearch(response.data, searchQuery)) {
                        setFilteredProducts(prev => [...prev, response.data]);
                    }
                } else if (currentPath === '/' || currentPath === '/search') {
                    // En home o search sin término, añadir siempre
                    setFilteredProducts(prev => [...prev, response.data]);
                } else {
                    // En categoría específica, añadir solo si coincide
                    const categoryPath = currentPath.substring(1);
                    if (response.data.category.toLowerCase() === categoryPath.toLowerCase()) {
                        setFilteredProducts(prev => [...prev, response.data]);
                    }
                }
                
                return updatedProducts;
            });
        })
        .catch(error => {
            console.log('Error:', error.response?.data);
        });
    };
    // Función auxiliar para verificar si un producto coincide con la búsqueda
    const productMatchesSearch = (product: Product, query: string): boolean => {
        const lowerQuery = query.toLowerCase().trim();
        const searchableText = `
            ${product.name || ''}
            ${product.brand || ''}
            ${product.category || ''}
            ${product.pet || ''}
            ${product.age || ''}
            ${product.condition || ''}
            ${product.description || ''}
            ${product.price || ''}
            ${product.kg || ''}
        `.toLowerCase();

        return searchableText.includes(lowerQuery);
    };

    const contextValue: ProductsContextType = {
        products: products,
        filteredProducts: filteredProducts,
        setFilteredProducts: setFilteredProducts,
        addProduct: addProduct,
        setSearchTerms: setSearchTerms,
        searchTerms: searchTerms,
        handleSearch: handleSearch,
        clearSearch: clearSearch,
        searchQuery: searchQuery
    };

    return (
        <ProductsContext.Provider value={contextValue}>
            {children}
        </ProductsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProductContext = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProductsContext debe usarse dentro de ProductsProvider');
    }
    return context;
};