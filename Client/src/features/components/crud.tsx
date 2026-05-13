import { useState } from "react"
import { useProducts } from "../hooks/useProducts"
import { X, Upload } from "lucide-react"
import "../../assets/styles/crud.css"

export const Crud = () => {
    const { addProduct, isLoading, error } = useProducts()

    const [formData, setFormData] = useState({
        name: "", brand: "", pet: "", category: "", description: "",
        age: "", price: "", kg: "", condition: ""
    })
    
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
            if (!validTypes.includes(file.type)) {
                alert(`Formato no válido: ${file.name}`)
                return false
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`Imagen muy grande (máx 5MB): ${file.name}`)
                return false
            }
            return true
        })

        if (validFiles.length + imageFiles.length > 10) {
            alert('Máximo 10 imágenes por producto')
            return
        }

        const newPreviews = validFiles.map(file => URL.createObjectURL(file))
        
        setImageFiles([...imageFiles, ...validFiles])
        setImagePreviews([...imagePreviews, ...newPreviews])
    }

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index])
        setImageFiles(imageFiles.filter((_, i) => i !== index))
        setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    }

    const handleAddProduct = async () => {
        const requiredFields = ['name', 'brand', 'pet', 'category', 'description', 'age', 'price']
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
        
        if (missingFields.length > 0) {
            alert(`Faltan campos: ${missingFields.join(', ')}`)
            return
        }

        if (imageFiles.length === 0) {
            alert('Debes seleccionar al menos una imagen para el producto')
            return
        }

        const formDataToSend = new FormData()
        formDataToSend.append('name', formData.name)
        formDataToSend.append('brand', formData.brand)
        formDataToSend.append('pet', formData.pet)
        formDataToSend.append('category', formData.category)
        formDataToSend.append('description', formData.description)
        formDataToSend.append('age', formData.age)
        formDataToSend.append('price', formData.price)
        if (formData.kg) formDataToSend.append('kg', formData.kg)
        if (formData.condition) formDataToSend.append('condition', formData.condition)

        imageFiles.forEach(file => {
            formDataToSend.append('images', file)
        })

        try {
            await addProduct(formDataToSend)
            
            setFormData({
                name: "", brand: "", pet: "", category: "", description: "",
                age: "", price: "", kg: "", condition: ""
            })
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview))
            setImageFiles([])
            setImagePreviews([])
            
            const fileInput = document.getElementById('image-input') as HTMLInputElement
            if (fileInput) fileInput.value = ''
            
            alert('✅ Producto agregado exitosamente')
        } catch (err) {
            console.error('Error:', err)
        }
    }

    return(
        <div className="product-list-container">
            <h2>Agregar Nuevo Producto</h2>
            
            {error && <div className="error-message">❌ {error}</div>}
            
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

            {/* Sección de múltiples imágenes */}
            <div className="multi-image-section">
                <label>Imágenes del producto *</label>
                <div className="image-upload-area">
                    <input
                        id="image-input"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImagesChange}
                        multiple
                        disabled={isLoading || imageFiles.length >= 10}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="image-input" className="upload-label">
                        <Upload size={24} />
                        <span>Seleccionar imágenes</span>
                        <small>Máx 10 imágenes, 5MB cada una (Primera imagen será la principal)</small>
                    </label>
                </div>

                {/* Grid de previews */}
                {imagePreviews.length > 0 && (
                    <div className="images-grid">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="image-preview-item">
                                <img src={preview} alt={`Preview ${index + 1}`} />
                                {index === 0 && <span className="main-badge">Principal</span>}
                                <button 
                                    type="button"
                                    className="remove-image"
                                    onClick={() => removeImage(index)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button 
                onClick={handleAddProduct} 
                disabled={isLoading || imageFiles.length === 0}
            >
                {isLoading ? '🔄 Agregando...' : '➕ Agregar Producto'}
            </button>
        </div>
    )
}