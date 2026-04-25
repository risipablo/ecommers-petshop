// features/components/EditProduct.tsx
import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";

export const EditProduct = () => {
    const { id } = useParams<{ id: string }>();
    const { updateProduct, isLoading, error } = useProducts();
    const { product, loading } = useProduct(id || "");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "", brand: "", pet: "", category: "", description: "",
        age: "", price: "", kg: "", special: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Cargar datos del producto al montar
    useEffect(() => {
        if (product) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: product.name || "",
                brand: product.brand || "",
                pet: product.pet || "",
                category: product.category || "",
                description: product.description || "",
                age: product.age || "",
                price: String(product.price) || "",
                kg: product.kg || "",
                special: product.special || ""
            });
            if (product.imageUrl) {
                setImagePreview(product.imageUrl);
            }
        }
    }, [product]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                alert('Solo se permiten imágenes JPG, PNG o WEBP');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no puede superar los 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
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

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value && key !== 'special') formDataToSend.append(key, value);
        });
        
        if (formData.special && formData.special.trim() !== '') {
            formDataToSend.append('special', formData.special);
        }
        
        if (imageFile) {
            formDataToSend.append('image', imageFile);
        }

        try {
            await updateProduct(id!, formDataToSend);
            alert('✅ Producto actualizado exitosamente');
            navigate('/crud');
        } catch (err) {
            console.error('Error:', err);
        }
    };

    if (loading) {
        return <div className="loading-container">Cargando producto...</div>;
    }

    if (!product) {
        return <div className="not-found-container">Producto no encontrado</div>;
    }

    return (
        <div className="product-list-container">
            <h2>Editar Producto</h2>
            
            {error && <div className="error-message">❌ {error}</div>}
            
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Nombre *" 
                    value={formData.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={isLoading}
                />
                
                <input 
                    type="text" 
                    placeholder="Marca *" 
                    value={formData.brand} 
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    disabled={isLoading}
                />
                
                <select 
                    value={formData.pet} 
                    onChange={(e) => handleInputChange('pet', e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Seleccionar mascota *</option>
                    <option value="gato">Gato</option>
                    <option value="perro">Perro</option>
                    <option value="ambos">Ambos</option>
                </select>

                <select 
                    value={formData.category} 
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Seleccionar categoría *</option>
                    <option value="alimentos">Alimentos</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="higiene">Higiene</option>
                    <option value="indumentaria">Indumentaria</option>
                    <option value="colchonetas">Colchonetas</option>
                </select>

                <textarea 
                    placeholder="Descripción *" 
                    value={formData.description} 
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={isLoading}
                    rows={3}
                />
                
                <select 
                    value={formData.age} 
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Seleccionar edad *</option>
                    <option value="cachorro">Cachorro</option>
                    <option value="mini adulto">Mini Adulto</option>
                    <option value="adulto">Adulto</option>
                    <option value="senior">Senior</option>
                    <option value="otro">Otro</option>
                </select>
                
                
                <input 
                    type="number" 
                    placeholder="Precio *" 
                    value={formData.price} 
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    disabled={isLoading}
                />
                
                <input 
                    type="text" 
                    placeholder="Kg (opcional)" 
                    value={formData.kg} 
                    onChange={(e) => handleInputChange('kg', e.target.value)}
                    disabled={isLoading}
                />

                <select 
                    value={formData.special} 
                    onChange={(e) => handleInputChange('special', e.target.value)}
                    disabled={isLoading}
                >
                    <option value="">Especial (opcional)</option>
                    <option value="derma adulto">Derma Adulto</option>
                    <option value="derma mini adulto">Derma Mini Adulto</option>
                    <option value="urinary">Urinary</option>
                    <option value="castrado">Castrado</option>
                    <option value="light">Light</option>
                </select>

                <div className="image-upload-container">
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        disabled={isLoading}
                    />
                    <small>Dejar vacío para mantener imagen actual</small>
                    
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button 
                                type="button" 
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview(product.imageUrl || null);
                                }}
                            >
                                ✖
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-buttons">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? '🔄 Actualizando...' : '💾 Actualizar Producto'}
                    </button>
                    <button type="button" onClick={() => navigate('/crud')}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};