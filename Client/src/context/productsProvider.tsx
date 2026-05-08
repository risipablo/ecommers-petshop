// context/productsProvider.tsx (optimizado para carga rápida)
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
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
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const location = useLocation();

    const fetchProducts = useCallback(async () => {
        if (!initialLoad && products.length > 0) return;
        
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/products`);
            const productsData = response.data.success ? response.data.data : response.data;
            setProducts(productsData);
            setFilteredProducts(productsData);
            setInitialLoad(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Error al cargar productos');
        } finally {
            setIsLoading(false);
        }
    }, [initialLoad, products.length]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (products.length === 0) return;

        const currentPath = location.pathname;
        const categoryPath = currentPath.substring(1);

        if (searchQuery.trim() !== '') {
            applySearchFilter(searchQuery);
            return;
        }

        if (currentPath === '/' || categoryPath === '' || categoryPath === 'todos') {
            setFilteredProducts(products);
        } else if (categoryPath !== 'search' && categoryPath !== 'crud' && categoryPath !== 'contacto' && !categoryPath.includes('edit-product') && !categoryPath.includes('admin')) {
            const filtered = products.filter(product => 
                product.category?.toLowerCase() === categoryPath.toLowerCase()
            );
            setFilteredProducts(filtered);
        }
    }, [location.pathname, products, searchQuery]);

    const applySearchFilter = useCallback((query: string) => {
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
        
        if (query.trim()) {
            setSearchTerms([query]);
        } else {
            setSearchTerms([]);
        }
    }, [products]);

    const handleSearch = useCallback((term: string) => {
        setSearchQuery(term);
        applySearchFilter(term);
    }, [applySearchFilter]);

    const clearSearch = useCallback(() => {
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
    }, [location.pathname, products]);

    const addProduct = async (formData: FormData): Promise<void> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${API_URL}/products`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.data.success) {
                setInitialLoad(true);
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

    const updateProduct = async (id: string, formData: FormData): Promise<void> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.put(`${API_URL}/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.data.success) {
                setInitialLoad(true);
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

    const deleteProduct = async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.delete(`${API_URL}/products/${id}`);
            
            if (response.data.success) {
                setProducts(prev => prev.filter(p => p._id !== id));
                setFilteredProducts(prev => prev.filter(p => p._id !== id));
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

    const contextValue: ProductsContextType = {
        products,
        filteredProducts,
        setFilteredProducts,
        addProduct,
        updateProduct,
        deleteProduct,
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