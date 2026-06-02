// context/productsProvider.tsx (optimizado para carga rápida)
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Product, ProductsContextType } from "../features/types/product.type";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { config } from '../config/index';

const API_URL = config.Api;

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);


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

    // context/productsProvider.tsx (versión óptima)
    const applySearchFilter = useCallback((query: string) => {
        const lowerQuery = query.toLowerCase().trim();
        
       
        const searchWords = lowerQuery.split(/\s+/).filter(word => word.length > 0);
        
        const filtered = products.filter(product => {
            if (!product) return false;

            // Crear un objeto con cada campo por separado para mejor búsqueda
            const searchableText = [
                product.name || '',
                product.brand || '',
                product.category || '',
                product.pet || '',
                product.age || '',
                product.condition || '',
                product.description || '',
                String(product.price) || '',
                product.kg || '',
                product.special || ''
            ].join(' ').toLowerCase();
            
            // Para búsqueda de múltiples palabras, todas deben estar presentes (AND)
            const allWordsMatch = searchWords.length > 0 
                ? searchWords.every(word => searchableText.includes(word))
                : true;
            
            return allWordsMatch;
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

// context/productsProvider.tsx (parte actualizada - updateProduct y deleteProduct)
const updateProduct = async (id: string, formData: FormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
        const token = localStorage.getItem('token');
        
        const response = await axios.put(`${API_URL}/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
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
        const token = localStorage.getItem('token');
        
        const response = await axios.delete(`${API_URL}/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });
        
        if (response.data.success) {
            
            setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
            setFilteredProducts(prevFiltered => prevFiltered.filter(product => product._id !== id));
            
            
            console.log(' Producto eliminado exitosamente');
        } else {
            throw new Error(response.data.error || 'Error al eliminar producto');
        }
    } catch (err) {
        console.error('Error en deleteProduct:', err);
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