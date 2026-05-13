// features/components/ManageProductImages.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { ArrowLeft, Trash2, Star, Upload, X } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/authProvider";
import type { ProductImage, Product } from "../types/product.type";

const API_URL = 'https://ecommers-petshop.onrender.com/api'

export const ManageProductImages = () => {
    const { id } = useParams<{ id: string }>();
    const { product, loading } = useProduct(id || "") as { product: Product | null; loading: boolean };
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    
    const [images, setImages] = useState<ProductImage[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (product && Array.isArray(product.images) && product.images.length > 0) {
            setImages(product.images as ProductImage[]);
        } else if (product && product.imageUrl) {
            setImages([{
                _id: 'main',
                url: product.imageUrl,
                publicId: product.imagePublicId || '',
                isMain: true,
                order: 0
            }]);
        }
    }, [product]);

    if (!isAdmin) return null;

    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert(`Formato no válido: ${file.name}`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`Imagen muy grande (máx 5MB): ${file.name}`);
                return false;
            }
            return true;
        });

        if (validFiles.length + images.length > 10) {
            alert('Máximo 10 imágenes por producto');
            return;
        }

        const previews = validFiles.map(file => URL.createObjectURL(file));
        setNewImages([...newImages, ...validFiles]);
        setNewImagePreviews([...newImagePreviews, ...previews]);
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImages(newImages.filter((_, i) => i !== index));
        setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        if (newImages.length === 0) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        newImages.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await axios.put(`${API_URL}/products/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (response.data.success) {
                alert('✅ Imágenes agregadas exitosamente');
                setNewImages([]);
                newImagePreviews.forEach(preview => URL.revokeObjectURL(preview));
                setNewImagePreviews([]);
                // Recargar la página para mostrar las nuevas imágenes
                window.location.reload();
            }
        } catch (err: unknown) {
            console.error('Error al subir imágenes:', err);
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al subir imágenes');
        } finally {
            setIsUploading(false);
        }
    };

    const deleteImage = async (imageId: string) => {
        if (!confirm('¿Eliminar esta imagen permanentemente?')) return;

        setIsDeleting(imageId);
        try {
            const response = await axios.delete(`${API_URL}/products/${id}/images/${imageId}`, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setImages(images.filter(img => img._id !== imageId));
                alert('✅ Imagen eliminada');
            }
        } catch (err: unknown) {
            console.error('Error al eliminar imagen:', err);
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al eliminar imagen');
        } finally {
            setIsDeleting(null);
        }
    };

    const setMainImage = async (imageId: string) => {
        try {
            const response = await axios.patch(`${API_URL}/products/${id}/main-image/${imageId}`, {}, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setImages(images.map(img => ({
                    ...img,
                    isMain: img._id === imageId
                })));
                alert('✅ Imagen principal actualizada');
            }
        } catch (err: unknown) {
            console.error('Error al establecer imagen principal:', err);
            setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al actualizar imagen principal');
        }
    };

    if (loading) return <div className="loading-container">Cargando producto...</div>;
    if (!product) return <div className="not-found-container">Producto no encontrado</div>;

    return (
        <div className="manage-images-container">
            <div className="manage-images-header">
                <button className="back-btn" onClick={() => navigate('/admin/products')}>
                    <ArrowLeft size={20} />
                    Volver
                </button>
                <h1>Gestionar Imágenes - {product.name}</h1>
            </div>

            {error && <div className="error-message">❌ {error}</div>}

            {/* Imágenes existentes */}
            <div className="existing-images">
                <h2>Imágenes actuales ({images.length}/10)</h2>
                {images.length === 0 ? (
                    <p className="no-images">No hay imágenes para este producto</p>
                ) : (
                    <div className="images-grid">
                        {images.map((image) => (
                            <div key={image._id} className="image-card">
                                <img src={image.url} alt={`Imagen del producto`} />
                                <div className="image-overlay">
                                    {image.isMain && <span className="main-badge">Principal</span>}
                                    <div className="image-actions-buttons">
                                        {!image.isMain && (
                                            <button 
                                                className="set-main-btn"
                                                onClick={() => setMainImage(image._id)}
                                                title="Establecer como principal"
                                            >
                                                <Star size={18} />
                                            </button>
                                        )}
                                        <button 
                                            className="delete-image-btn"
                                            onClick={() => deleteImage(image._id)}
                                            disabled={isDeleting === image._id}
                                            title="Eliminar imagen"
                                        >
                                            {isDeleting === image._id ? '...' : <Trash2 size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Agregar nuevas imágenes */}
            <div className="add-images-section">
                <h2>Agregar más imágenes</h2>
                <div className="upload-area">
                    <label className="upload-label">
                        <Upload size={32} />
                        <span>Seleccionar imágenes</span>
                        <small>Máx 10 imágenes, 5MB cada una</small>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleAddImages}
                            multiple
                            hidden
                        />
                    </label>
                </div>

                {newImagePreviews.length > 0 && (
                    <div className="new-images-preview">
                        <h3>Nuevas imágenes a subir ({newImages.length})</h3>
                        <div className="images-grid">
                            {newImagePreviews.map((preview, index) => (
                                <div key={index} className="image-card new">
                                    <img src={preview} alt={`Nueva ${index + 1}`} />
                                    <button 
                                        className="remove-new-btn"
                                        onClick={() => removeNewImage(index)}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="upload-btn"
                            onClick={uploadImages}
                            disabled={isUploading}
                        >
                            {isUploading ? 'Subiendo...' : `Subir ${newImages.length} imágenes`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};