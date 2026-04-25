import { useState } from "react"
import { useProducts } from "../hooks/useProducts"
import "../../assets/styles/crud.css"

export const Crud = () => {
    const { addProduct, isLoading, error } = useProducts()

    const [formData, setFormData] = useState({
        name: "", brand: "", pet: "", category: "", description: "",
        age: "", price: "", kg: "", special: ""
    })
    
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                alert('Solo se permiten imágenes JPG, PNG o WEBP')
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no puede superar los 5MB')
                return
            }

            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleAddProduct = async () => {
        const requiredFields = ['name', 'brand', 'pet', 'category', 'description', 'age', 'condition', 'price']
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
        
        if (missingFields.length > 0) {
            alert(`Faltan campos: ${missingFields.join(', ')}`)
            return
        }

        if (!imageFile) {
            alert('Debes seleccionar una imagen para el producto')
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
        // 🔥 Solo enviar special si tiene valor
        if (formData.special && formData.special.trim() !== '') {
            formDataToSend.append('special', formData.special)
        }
        formDataToSend.append('image', imageFile)

        try {
            await addProduct(formDataToSend)
            
            setFormData({
                name: "", brand: "", pet: "", category: "", description: "",
                age: "", price: "", kg: "", special: ""
            })
            setImageFile(null)
            setImagePreview(null)
            
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

            {/* 🔥 Campo special (opcional) */}
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

            {/* Input de imagen */}
            <div className="image-upload-container">
                <input
                    id="image-input"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    disabled={isLoading}
                />
                <small>Imagen requerida (máx 5MB)</small>
                
                {imagePreview && (
                    <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button 
                            type="button" 
                            onClick={() => {
                                setImageFile(null)
                                setImagePreview(null)
                                const input = document.getElementById('image-input') as HTMLInputElement
                                if (input) input.value = ''
                            }}
                        >
                            ✖
                        </button>
                    </div>
                )}
            </div>

            <button 
                onClick={handleAddProduct} 
                disabled={isLoading || !imageFile}
            >
                {isLoading ? '🔄 Agregando...' : '➕ Agregar Producto'}
            </button>
        </div>
    )
}