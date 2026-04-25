// context/productsProvider.tsx (agregar updateProduct y deleteProduct)
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product, ProductsContextType } from "../features/types/product.type";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerms, setSearchTerms] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/products`);
            const productsData = response.data.success ? response.data.data : response.data;
            setProducts(productsData);
            setFilteredProducts(productsData);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Error al cargar productos');
        } finally {
            setIsLoading(false);
        }
    };

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
                ${product.description || ''}
                ${product.price || ''}
                ${product.kg || ''}
            `.toLowerCase();

            return searchableText.includes(lowerQuery);
        });

        setFilteredProducts(filtered);
        
        if (query.trim()) {
            setSearchTerms([query]);
        } else {
            setSearchTerms([]);
        }
    };

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        applySearchFilter(term);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchTerms([]);
        
        const currentPath = location.pathname;
        const categoryPath = currentPath.substring(1);
        
        if (currentPath === '/' || categoryPath === '' || categoryPath === 'todos') {
            setFilteredProducts(products);
        } else if (categoryPath !== 'search') {
            const filtered = products.filter(product => 
                product.category?.toLowerCase() === categoryPath.toLowerCase()
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    };

    // 🔥 AGREGAR: Actualizar producto
    const updateProduct = async (id: string, formData: FormData): Promise<void> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.put(`${API_URL}/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                await fetchProducts();
                if (searchQuery) {
                    applySearchFilter(searchQuery);
                }
            } else {
                throw new Error(response.data.error || 'Error al actualizar producto');
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            const errorMessage = axios.isAxiosError(err) ? err.response?.data?.error || error.message : error.message;
            setError(errorMessage || 'Error desconocido');
            throw new Error(errorMessage || 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    // 🔥 AGREGAR: Eliminar producto
    const deleteProduct = async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.delete(`${API_URL}/products/${id}`);
            
            if (response.data.success) {
                await fetchProducts();
                if (searchQuery) {
                    applySearchFilter(searchQuery);
                }
            } else {
                throw new Error(response.data.error || 'Error al eliminar producto');
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            const errorMessage = axios.isAxiosError(err) ? err.response?.data?.error || error.message : error.message;
            setError(errorMessage || 'Error desconocido');
            throw new Error(errorMessage || 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const addProduct = async (formData: FormData): Promise<void> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${API_URL}/products`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                await fetchProducts();
                if (searchQuery) {
                    applySearchFilter(searchQuery);
                }
            } else {
                throw new Error(response.data.error || 'Error al agregar producto');
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido');
            const errorMessage = axios.isAxiosError(err) ? err.response?.data?.error || error.message : error.message;
            setError(errorMessage || 'Error desconocido');
            throw new Error(errorMessage || 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    const contextValue: ProductsContextType = {
        products,
        filteredProducts,
        setFilteredProducts,
        addProduct,
        updateProduct,  // 🔥 Agregado
        deleteProduct,  // 🔥 Agregado
        setSearchTerms,
        searchTerms,
        handleSearch,
        clearSearch,
        searchQuery,
        isLoading,
        error,
        fetchProducts
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