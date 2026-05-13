// features/components/EditProduct.tsx
import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import { ArrowLeft, Save, X } from "lucide-react";
import type { Product, ProductFormData } from "../types/product.type";



export const EditProduct = () => {
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
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

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
        }
    }, [product]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImageFiles([...imageFiles, ...validFiles]);
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeNewImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImageFiles(imageFiles.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
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
        
        imageFiles.forEach(file => {
            formDataToSend.append('images', file);
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
            <div className="edit-header">
                <button className="back-btn" onClick={() => navigate('/admin/products')}>
                    <ArrowLeft size={20} />
                    Volver
                </button>
                <h1>Editar Producto: {product.name}</h1>
            </div>

            {error && <div className="error-message">❌ {error}</div>}

            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Nombre *</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Marca *</label>
                        <input 
                            type="text" 
                            value={formData.brand} 
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mascota *</label>
                        <select 
                            value={formData.pet} 
                            onChange={(e) => handleInputChange('pet', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="gato">Gato</option>
                            <option value="perro">Perro</option>
                            <option value="ambos">Ambos</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Categoría *</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="alimentos">Alimentos</option>
                            <option value="accesorios">Accesorios</option>
                            <option value="higiene">Higiene</option>
                            <option value="indumentaria">Indumentaria</option>
                            <option value="colchonetas">Colchonetas</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>Descripción *</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Edad *</label>
                        <select 
                            value={formData.age} 
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar</option>
                            <option value="cachorro">Cachorro</option>
                            <option value="mini adulto">Mini Adulto</option>
                            <option value="adulto">Adulto</option>
                            <option value="senior">Senior</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Condición *</label>
                                <select 
                                    value={formData.condition} 
                                    onChange={(e) => handleInputChange('condition', e.target.value)}
                                    disabled={isLoading}
                                >
                                    <option value="">Especial (opcional)</option>
                                    <option value="otro">-</option>
                                    <option value="derma adulto">Derma Adulto</option>
                                    <option value="derma mini adulto">Derma Mini Adulto</option>
                                    <option value="urinary">Urinary</option>
                                    <option value="castrado">Castrado</option>
                                    <option value="light">Light</option>
                                </select>

                    </div>

                    <div className="form-group">
                        <label>Precio *</label>
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


                    <div className="form-group full-width">
                        <label>Agregar nuevas imágenes (opcional)</label>
                        <input 
                            type="file" 
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImagesChange}
                            multiple
                        />
                        <small>Puedes agregar más imágenes al producto</small>
                        
                        {imagePreviews.length > 0 && (
                            <div className="new-images-preview">
                                <h4>Nuevas imágenes a subir:</h4>
                                <div className="images-grid">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="image-preview-item">
                                            <img src={preview} alt={`Nueva ${index + 1}`} />
                                            <button 
                                                type="button"
                                                className="remove-new-image"
                                                onClick={() => removeNewImage(index)}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={isSaving || isLoading}>
                        <Save size={18} />
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => navigate('/admin/products')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};