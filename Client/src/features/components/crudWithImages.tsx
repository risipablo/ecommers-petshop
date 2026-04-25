/* eslint-disable @typescript-eslint/no-unused-vars */
// features/components/CrudWithImages.tsx
import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { X } from "lucide-react";

export const CrudWithImages = () => {
    const { addProduct, isLoading, error } = useProducts();

    const [formData, setFormData] = useState({
        name: "", brand: "", pet: "", category: "", description: "",
        age: "",  price: "", kg: "", special: ""
    });
    
    // 🔥 Estado para múltiples imágenes
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // 🔥 Manejador para múltiples imágenes
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        // Validar cada archivo
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

        if (validFiles.length + imageFiles.length > 10) {
            alert('Máximo 10 imágenes por producto');
            return;
        }

        // Crear previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        
        setImageFiles([...imageFiles, ...validFiles]);
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    // 🔥 Eliminar imagen de la selección
    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImageFiles(imageFiles.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    // 🔥 Reordenar imágenes (drag & drop básico)
    const moveImage = (fromIndex: number, toIndex: number) => {
        const newFiles = [...imageFiles];
        const newPreviews = [...imagePreviews];
        
        [newFiles[fromIndex], newFiles[toIndex]] = [newFiles[toIndex], newFiles[fromIndex]];
        [newPreviews[fromIndex], newPreviews[toIndex]] = [newPreviews[toIndex], newPreviews[fromIndex]];
        
        setImageFiles(newFiles);
        setImagePreviews(newPreviews);
    };

    const handleAddProduct = async () => {
        const requiredFields = ['name', 'brand', 'pet', 'category', 'description', 'age', 'condition', 'price'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
        
        if (missingFields.length > 0) {
            alert(`Faltan campos: ${missingFields.join(', ')}`);
            return;
        }

        if (imageFiles.length === 0) {
            alert('Debes seleccionar al menos una imagen');
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value && key !== 'special') formDataToSend.append(key, value);
        });
        
        if (formData.special && formData.special.trim() !== '') {
            formDataToSend.append('special', formData.special);
        }
        
        // 🔥 Enviar todas las imágenes
        imageFiles.forEach(file => {
            formDataToSend.append('images', file);
        });

        try {
            await addProduct(formDataToSend);
            alert('✅ Producto agregado exitosamente');
            
            // Resetear formulario
            setFormData({
                name: "", brand: "", pet: "", category: "", description: "",
                age: "", price: "", kg: "", special: ""
            });
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
            setImageFiles([]);
            setImagePreviews([]);
            
        } catch (err) {
            console.error('Error:', err);
        }
    };

    return (
        <div className="crud-container">
            <h2>Agregar Nuevo Producto</h2>
            
            {error && <div className="error-message">❌ {error}</div>}
            
            {/* ... tus campos existentes ... */}
            
            {/* 🔥 Sección de múltiples imágenes */}
            <div className="multi-image-section">
                <label>Imágenes del producto (máx 10)</label>
                <div className="image-upload-area">
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImagesChange}
                        multiple
                        disabled={imageFiles.length >= 10}
                    />
                    <small>Primera imagen será la principal</small>
                </div>

                {/* Grid de previews */}
                <div className="images-grid">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <div className="image-overlay">
                                {index === 0 && <span className="main-badge">Principal</span>}
                                <button 
                                    className="remove-image"
                                    onClick={() => removeImage(index)}
                                >
                                    <X size={16} />
                                </button>
                                <div className="image-order-controls">
                                    {index > 0 && (
                                        <button onClick={() => moveImage(index, index - 1)}>
                                            ↑
                                        </button>
                                    )}
                                    {index < imagePreviews.length - 1 && (
                                        <button onClick={() => moveImage(index, index + 1)}>
                                            ↓
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={handleAddProduct} disabled={isLoading || imageFiles.length === 0}>
                {isLoading ? '🔄 Agregando...' : '➕ Agregar Producto'}
            </button>
        </div>
    );
};