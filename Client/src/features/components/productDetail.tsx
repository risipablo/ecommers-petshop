import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import '../../assets/styles/producDetail.css';
import { useProduct } from '../hooks/useProducts';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import { useEffect, useState } from 'react';

export function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const { product, loading } = useProduct(id || '');
    const { relatedProducts, loading: loadingRelated } = useRelatedProducts(id || '', product?.category || '');
    const [backPath, setBackPath] = useState<string>('/');
    const [backText, setBackText] = useState<string>('Volver a productos');

    useEffect(() => {
        if (!product) return;

        // Prioridad 1: Estado de React Router (cuando viene de navegación interna)
        if (location.state?.from) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBackPath(location.state.from);
            
            // Generar texto amigable para el botón
            const fromPath = location.state.from;
            if (fromPath === '/') {
                setBackText('Volver al inicio');
            } else if (fromPath.includes('/search')) {
                setBackText('Volver a resultados de búsqueda');
            } else {
                const category = fromPath.substring(1);
                if (category) {
                    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                    setBackText(`Volver a ${categoryName}`);
                }
            }
            return;
        }

        // Prioridad 2: sessionStorage (para recargas de página)
        const savedPath = sessionStorage.getItem('lastProductListPath');
        if (savedPath) {
            setBackPath(savedPath);
            
            if (savedPath === '/') {
                setBackText('Volver al inicio');
            } else if (savedPath.includes('/search')) {
                setBackText('Volver a resultados de búsqueda');
            } else {
                const category = savedPath.substring(1);
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                setBackText(`Volver a ${categoryName}`);
            }
            return;
        }

        // Prioridad 3: Categoría del producto (fallback)
        if (product?.category) {
            const categoryPath = `/${product.category.toLowerCase()}`;
            setBackPath(categoryPath);
            const categoryName = product.category.charAt(0).toUpperCase() + product.category.slice(1);
            setBackText(`Volver a ${categoryName}`);
            return;
        }

        // Prioridad 4: Home (último recurso)
        setBackPath('/');
        setBackText('Volver al inicio');
    }, [location.state, product, id]);

    // Guardar la ruta actual cuando el componente se desmonte (opcional)
    useEffect(() => {
        return () => {
            // Si venimos de una lista y hay una ruta guardada, mantenerla
            if (location.state?.from) {
                sessionStorage.setItem('lastProductListPath', location.state.from);
            }
        };
    }, [location.state]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando producto...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="not-found-container">
                <h2>Producto no encontrado</h2>
                <p>El producto que buscas no existe o fue eliminado</p>
                <Link to="/" className="back-home-btn">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <Link to={backPath} className="back-link">
                <ArrowLeft size={20} />
                {backText}
            </Link>

            <div className="product-detail-wrapper">
                {/* Columna Izquierda - Imagen */}
                <div className="product-image-section">
                    <div className="main-image-wrapper">
                        <img 
                            src={product.image || 'https://via.placeholder.com/500x500?text=Sin+Imagen'} 
                            alt={product.name} 
                            className="main-image" 
                        />
                    </div>
                    
                    <div className="thumbnails-wrapper">
                        <div className="thumbnail active">
                            <img 
                                src={product.image || 'https://via.placeholder.com/100x100?text=Sin+Imagen'} 
                                alt="Vista principal" 
                            />
                        </div>
                    </div>
                </div>

                {/* Columna Derecha - Info */}
                <div className="product-info-section">
                    <h1 className="product-title">{product.name}</h1>

                    <div className="price-section">
                        <span className="current-price">${product.price}</span>
                    </div>

                    <div className="details-grid">
                        {product.brand && (
                            <div className="detail-item">
                                <span className="detail-label">Marca:</span>
                                <span className="detail-value">{product.brand}</span>
                            </div>
                        )}
                        
                        {product.pet && (
                            <div className="detail-item">
                                <span className="detail-label">Mascota:</span>
                                <span className="detail-value">{product.pet}</span>
                            </div>
                        )}
                        
                        {product.age && (
                            <div className="detail-item">
                                <span className="detail-label">Edad:</span>
                                <span className="detail-value">{product.age}</span>
                            </div>
                        )}
                        
                        {product.condition && (
                            <div className="detail-item">
                                <span className="detail-label">Condición:</span>
                                <span className="detail-value">{product.condition}</span>
                            </div>
                        )}
                        
                        {product.kg && (
                            <div className="detail-item">
                                <span className="detail-label">Peso:</span>
                                <span className="detail-value">{product.kg} kg</span>
                            </div>
                        )}
                    </div>

                    <div className="category-section">
                        <span className="category-label">Categoría:</span>
                        <span className="category-tag">{product.category}</span>
                    </div>
                </div>
            </div>

            {/* Descripción del Producto */}
            <div className="description-section">
                <h2 className="section-title">Descripción</h2>
                <div className="description-content">
                    <p>{product.description || 'Sin descripción disponible'}</p>
                </div>
            </div>

            {/* Productos Relacionados */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2 className="section-title">Productos Relacionados</h2>
                    {loadingRelated ? (
                        <div className="loading-related">Cargando productos relacionados...</div>
                    ) : (
                        <div className="related-products-grid">
                            {relatedProducts.map(relatedProduct => (
                                <div key={relatedProduct._id} className="related-product-card">
                                    <div className="related-image-wrapper">
                                        <img 
                                            src={relatedProduct.image || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
                                            alt={relatedProduct.name} 
                                        />
                                    </div>
                                    <div className="related-divider"></div>
                                    <div className="related-content">
                                        <h3 className="related-name">{relatedProduct.name}</h3>
                                        <div className="related-footer">
                                            <span className="related-price">${relatedProduct.price}</span>
                                            <Link 
                                                className="related-view-btn" 
                                                to={`/item/${relatedProduct._id}`}
                                                state={{ from: backPath }} // Pasar la ruta actual para mantener contexto
                                            >
                                                <Eye size={16} />
                                                Ver
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}