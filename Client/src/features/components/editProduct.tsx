/* eslint-disable @typescript-eslint/no-explicit-any */
// features/components/EditProduct.tsx
import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { ArrowLeft, Save, Upload, X, Trash2, Star } from "lucide-react";
import axios from "axios";
import type { Product, ProductFormData } from "../types/product.type";
import {config} from "../../config/index"


const serverFront = config.Api


export const EditProduct = () => {
     useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);


    
    const { id } = useParams<{ id: string }>();
    const { updateProduct, isLoading, error } = useProducts();
    const { product, loading } = useProduct(id || "") as {
        product: Product | null;
        loading: boolean;
    };
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProductFormData>({
        name: "", brand: "", pet: "", category: "", description: "",
        age: "", condition: "", price: "", kg: ""
    });
    
    // Estados para imágenes existentes
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeletingImage, setIsDeletingImage] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                brand: product.brand || "",
                pet: product.pet || "",
                category: product.category || "",
                description: product.description || "",
                age: product.age || "",
                condition: product.condition || "",
                price: String(product.price) || "",
                kg: product.kg || ""
            });
            
            // Cargar imágenes existentes
            if (product.images && product.images.length > 0) {
                setExistingImages(product.images);
            } else if (product.imageUrl) {
                setExistingImages([{
                    _id: 'main',
                    url: product.imageUrl,
                    publicId: product.imagePublicId || '',
                    isMain: true,
                    order: 0
                }]);
            }
        }
    }, [product]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        if (validFiles.length + existingImages.length + newImages.length > 10) {
            alert('Máximo 10 imágenes por producto');
            return;
        }

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setNewImages([...newImages, ...validFiles]);
        setNewImagePreviews([...newImagePreviews, ...newPreviews]);
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImages(newImages.filter((_, i) => i !== index));
        setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
    };

    // Eliminar imagen existente (desde el backend)
    const deleteExistingImage = async (imageId: string) => {
        if (!confirm('¿Eliminar esta imagen permanentemente?')) return;
        
        setIsDeletingImage(imageId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${serverFront}/products/${id}/images/${imageId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            
            if (response.data.success) {
                setExistingImages(prev => prev.filter(img => img._id !== imageId));
                alert('✅ Imagen eliminada');
            }
        } catch (err) {
            console.error('Error al eliminar imagen:', err);
            alert('❌ Error al eliminar imagen');
        } finally {
            setIsDeletingImage(null);
        }
    };

    // Reordenar imágenes (mover arriba/abajo)
    const moveImageUp = (index: number) => {
        if (index === 0) return;
        const newImages = [...existingImages];
        [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        setExistingImages(newImages);
    };

    const moveImageDown = (index: number) => {
        if (index === existingImages.length - 1) return;
        const newImages = [...existingImages];
        [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
        setExistingImages(newImages);
    };

    // Establecer imagen principal
    const setAsMainImage = async (imageId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(`${serverFront}/products/${id}/main-image/${imageId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            
            if (response.data.success) {
                setExistingImages(prev => prev.map(img => ({
                    ...img,
                    isMain: img._id === imageId
                })));
                alert('✅ Imagen principal actualizada');
            }
        } catch (err) {
            console.error('Error al establecer imagen principal:', err);
            alert('❌ Error al actualizar imagen principal');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const requiredFields = ['name', 'brand', 'pet', 'category', 'description', 'age', 'condition', 'price'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
        
        if (missingFields.length > 0) {
            alert(`Faltan campos: ${missingFields.join(', ')}`);
            return;
        }

        setIsSaving(true);
        const formDataToSend = new FormData();
        
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSend.append(key, value);
        });
        
        // Agregar nuevas imágenes
        newImages.forEach(file => {
            formDataToSend.append('images', file);
        });

        // Enviar el orden actualizado de las imágenes existentes
        existingImages.forEach((img, index) => {
            formDataToSend.append('existingImagesOrder', JSON.stringify({
                id: img._id,
                order: index,
                isMain: img.isMain
            }));
        });

        try {
            await updateProduct(id!, formDataToSend);
            alert('✅ Producto actualizado exitosamente');
            navigate('/admin/products');
        } catch (err) {
            console.error('Error:', err);
            alert('❌ Error al actualizar el producto');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="loading-container">Cargando producto...</div>;
    if (!product) return <div className="not-found-container">Producto no encontrado</div>;

    return (
        <div className="edit-product-container">
            {/* HEADER CON BOTÓN VOLVER */}
            <div className="edit-header">
                <button className="back-btn" onClick={() => navigate('/admin/products')}>
                    <ArrowLeft size={20} />
                    Volver
                </button>
                <h1>Editar Producto: {product.name}</h1>
            </div>

            {/* MENSAJE DE ERROR */}
            {error && <div className="error-message">❌ {error}</div>}

            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
                    {/* INFORMACIÓN BÁSICA */}
                    <div className="form-group">
                        <label data-required="*">Nombre</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label data-required="*">Marca</label>
                        <input 
                            type="text" 
                            value={formData.brand} 
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            required
                        />
                    </div>

                    {/* CATEGORIZACIÓN */}
                    <div className="form-group">
                        <label data-required="*">Mascota</label>
                        <select 
                            value={formData.pet} 
                            onChange={(e) => handleInputChange('pet', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="gato">🐱 Gato</option>
                            <option value="perro">🐕 Perro</option>
                            <option value="ambos">🐱 🐕 Ambos</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label data-required="*">Categoría</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="alimentos">🍖 Alimentos</option>
                            <option value="accesorios">🎀 Accesorios</option>
                            <option value="higiene">🧼 Higiene</option>
                            <option value="indumentaria">👕 Indumentaria</option>
                            <option value="colchonetas">🛏️ Colchonetas</option>
                        </select>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="form-group full-width">
                        <label data-required="*">Descripción</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            required
                        />
                    </div>

                    {/* ESPECIFICACIONES */}
                    <div className="form-group">
                        <label data-required="*">Edad</label>
                        <select 
                            value={formData.age} 
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="cachorro">👶 Cachorro</option>
                            <option value="mini adulto">🐾 Mini Adulto</option>
                            <option value="adulto">🐕 Adulto</option>
                            <option value="senior">👴 Senior</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label data-required="*">Condición Especial</label>
                        <select 
                            value={formData.condition} 
                            onChange={(e) => handleInputChange('condition', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value=" ">Ninguno</option>
                            <option value="derma adulto">Derma Adulto</option>
                            <option value="derma mini adulto">Derma Mini Adulto</option>
                            <option value="urinary">Urinary</option>
                            <option value="castrado">Castrado</option>
                            <option value="light">Light</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label data-required="*">Precio</label>
                        <input 
                            type="number" 
                            value={formData.price} 
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Kg (opcional)</label>
                        <input 
                            type="text" 
                            value={formData.kg} 
                            onChange={(e) => handleInputChange('kg', e.target.value)}
                        />
                    </div>

                    {/* 🔥 IMÁGENES EXISTENTES */}
                    {existingImages.length > 0 && (
                        <div className="form-group full-width">
                            <label>Imágenes actuales ({existingImages.length}/10)</label>
                            <div className="existing-images-grid">
                                {existingImages.map((img, index) => (
                                    <div key={img._id} className="existing-image-card">
                                        <img src={img.url} alt={`Imagen ${index + 1}`} />
                                        <div className="image-overlay">
                                            {img.isMain && <span className="main-badge">⭐ Principal</span>}
                                            <div className="image-controls">
                                                {!img.isMain && (
                                                    <button 
                                                        type="button"
                                                        className="set-main-btn"
                                                        onClick={() => setAsMainImage(img._id)}
                                                        title="Establecer como principal"
                                                    >
                                                        <Star size={16} />
                                                    </button>
                                                )}
                                                <button 
                                                    type="button"
                                                    className="delete-image-btn"
                                                    onClick={() => deleteExistingImage(img._id)}
                                                    disabled={isDeletingImage === img._id}
                                                    title="Eliminar imagen"
                                                >
                                                    {isDeletingImage === img._id ? '...' : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                            <div className="order-controls">
                                                {index > 0 && (
                                                    <button 
                                                        type="button"
                                                        className="move-up"
                                                        onClick={() => moveImageUp(index)}
                                                        title="Mover arriba"
                                                    >
                                                        ↑
                                                    </button>
                                                )}
                                                {index < existingImages.length - 1 && (
                                                    <button 
                                                        type="button"
                                                        className="move-down"
                                                        onClick={() => moveImageDown(index)}
                                                        title="Mover abajo"
                                                    >
                                                        ↓
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <small className="help-text">Las flechas ↑ ↓ cambian el orden. La primera imagen será la principal.</small>
                        </div>
                    )}

                    {/* AGREGAR NUEVAS IMÁGENES */}
                    <div className="form-group full-width multi-image-section">
                        <label>Agregar nuevas imágenes (opcional)</label>
                        <div className="image-upload-area">
                            <input 
                                id="new-images"
                                type="file" 
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleNewImagesChange}
                                multiple
                            />
                            <label htmlFor="new-images" className="upload-label">
                                <Upload size={28} />
                                <span>Seleccionar imágenes</span>
                                <small>Máx 10 imágenes, 5MB cada una</small>
                            </label>
                        </div>
                        
                        {/* PREVIEWS DE NUEVAS IMÁGENES */}
                        {newImagePreviews.length > 0 && (
                            <div className="new-images-preview">
                                <h4>📸 {newImagePreviews.length} nueva{newImagePreviews.length !== 1 ? 's' : ''} imagen{newImagePreviews.length !== 1 ? 'es' : ''} a subir:</h4>
                                <div className="images-grid">
                                    {newImagePreviews.map((preview, index) => (
                                        <div key={index} className="image-preview-item">
                                            <img src={preview} alt={`Nueva ${index + 1}`} />
                                            <button 
                                                type="button"
                                                className="remove-image"
                                                onClick={() => removeNewImage(index)}
                                                aria-label="Eliminar imagen"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/admin/products')}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={isSaving || isLoading}>
                        <Save size={18} />
                        {isSaving ? '💾 Guardando...' : '✅ Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};