import { useState } from "react"
import { useProducts } from "../hooks/useProducts"
import { X, Upload, CheckCircle } from "lucide-react"
import "../../assets/styles/crud.css"
 
export const Crud = () => {
    const { addProduct, isLoading, error } = useProducts()
    const [successMessage, setSuccessMessage] = useState("")
 
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
                alert(`Formato no válido: ${file.name}. Usa JPEG, PNG o WebP`)
                return false
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`Imagen muy grande: ${file.name} (máx 5MB)`)
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
       setSuccessMessage("")
    
    const requiredFields = ['name', 'brand', 'pet', 'category', 'description', 'age', 'price', 'condition']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
        alert(`Faltan campos obligatorios: ${missingFields.join(', ')}`)
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
    formDataToSend.append('condition', formData.condition)
    if (formData.kg) formDataToSend.append('kg', formData.kg)

    imageFiles.forEach(file => {
        formDataToSend.append('images', file)
    })
 
        try {
            await addProduct(formDataToSend)
            
            // LIMPIAR FORMULARIO
            setFormData({
                name: "", brand: "", pet: "", category: "", description: "",
                age: "", price: "", kg: "", condition: ""
            })
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview))
            setImageFiles([])
            setImagePreviews([])
            
            const fileInput = document.getElementById('image-input') as HTMLInputElement
            if (fileInput) fileInput.value = ''
            
            // MOSTRAR MENSAJE DE ÉXITO
            setSuccessMessage("✅ Producto agregado exitosamente")
            setTimeout(() => setSuccessMessage(""), 4000)
        } catch (err) {
            console.error('Error:', err)
        }
    }
 
    return(
        <div className="product-list-container">
            <h2>➕ Agregar Nuevo Producto</h2>
            
            {/* MENSAJES DE ERROR Y ÉXITO */}
            {error && <div className="error-message">❌ {error}</div>}
            {successMessage && (
                <div className="success-message">
                    <CheckCircle size={20} />
                    {successMessage}
                </div>
            )}
            
            <form className="edit-form">
                <div className="form-grid">
                    {/* FILA 1: Nombre y Marca */}
                    <div className="form-group">
                        <label data-required="*">Nombre</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Collar Premium" 
                            value={formData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label data-required="*">Marca</label>
                        <input 
                            type="text" 
                            placeholder="Ej: Purina" 
                            value={formData.brand} 
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    
                    {/* FILA 2: Mascota y Categoría */}
                    <div className="form-group">
                        <label data-required="*">Mascota</label>
                        <select 
                            value={formData.pet} 
                            onChange={(e) => handleInputChange('pet', e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Seleccionar mascota</option>
                            <option value="Gato">🐱 Gato</option>
                            <option value="Perro">🐕 Perro</option>
                            <option value="Ambos">🐱 🐕 Ambos</option>
                        </select>
                    </div>
 
                    <div className="form-group">
                        <label data-required="*">Categoría</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Seleccionar categoría</option>
                            <option value="Alimentos">🍖 Alimentos</option>
                            <option value="Accesorios">🎀 Accesorios</option>
                            <option value="Higiene">🧼 Higiene</option>
                            <option value="Indumentaria">👕 Indumentaria</option>
                            <option value="Colchonetas">🛏️ Colchonetas</option>
                        </select>
                    </div>
 
                    {/* DESCRIPCIÓN - ANCHO COMPLETO */}
                    <div className="form-group full-width">
                        <label data-required="*">Descripción</label>
                        <textarea 
                            placeholder="Describe los detalles y características del producto..." 
                            value={formData.description} 
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={isLoading}
                            rows={4}
                        />
                    </div>
                    
                    {/* FILA 3: Edad y Precio */}
                    <div className="form-group">
                        <label data-required="*">Edad</label>
                        <select 
                            value={formData.age} 
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="">Seleccionar edad</option>
                            <option value="Cachorro">👶 Cachorro</option>
                            <option value="Mini adulto">🐾 Mini Adulto</option>
                            <option value="Adulto">🐕 Adulto</option>
                            <option value="Senior">👴 Senior</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label data-required="*">Precio</label>
                        <input 
                            type="number" 
                            placeholder="0.00" 
                            value={formData.price} 
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            disabled={isLoading}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    
                    {/* FILA 4: Kg y Condición */}
                    <div className="form-group">
                        <label>Kg (opcional)</label>
                        <input 
                            type="text" 
                            placeholder="Ej: 1kg, 500g" 
                            value={formData.kg} 
                            onChange={(e) => handleInputChange('kg', e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
 
                    <div className="form-group">
                        <label>Especial (opcional)</label>
                        <select 
                            value={formData.condition} 
                            onChange={(e) => handleInputChange('condition', e.target.value)}
                            disabled={isLoading}
                        >
                            
                            <option value="Derma adulto">Derma Adulto</option>
                            <option value="Derma mini adulto">Derma Mini Adulto</option>
                            <option value="Urinary">Urinary</option>
                            <option value="Castrado">Castrado</option>
                            <option value="Light">Light</option>
                            <option value=" ">Ninguno</option>
                        </select>
                    </div>
 
                    {/* SECCIÓN DE IMÁGENES - ANCHO COMPLETO */}
                    <div className="form-group full-width multi-image-section">
                        <label data-required="*">Imágenes del producto</label>
                        <div className="image-upload-area">
                            <input
                                id="image-input"
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImagesChange}
                                multiple
                                disabled={isLoading || imageFiles.length >= 10}
                            />
                            <label htmlFor="image-input" className="upload-label">
                                <Upload size={28} />
                                <span>Seleccionar imágenes</span>
                                <small>Máx 10 imágenes, 5MB cada una • La primera será la principal</small>
                            </label>
                        </div>
 
                        {/* GRID DE PREVIEWS */}
                        {imagePreviews.length > 0 && (
                            <div className="new-images-preview">
                                <h4>📸 {imagePreviews.length} imagen{imagePreviews.length !== 1 ? 's' : ''} cargada{imagePreviews.length !== 1 ? 's' : ''}</h4>
                                <div className="images-grid">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="image-preview-item">
                                            <img src={preview} alt={`Preview ${index + 1}`} />
                                            {index === 0 && <span className="main-badge">📍 Principal</span>}
                                            <button 
                                                type="button"
                                                className="remove-image"
                                                onClick={() => removeImage(index)}
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
                    <button 
                        type="button"
                        onClick={handleAddProduct} 
                        disabled={isLoading || imageFiles.length === 0}
                        className="btn-save"
                    >
                        {isLoading ? '⏳ Agregando...' : '✅ Agregar Producto'}
                    </button>
                </div>
            </form>
        </div>
    )
}
