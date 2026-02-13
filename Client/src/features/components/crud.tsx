import { useState } from "react"
import { useProducts } from "../hooks/useProducts"



export const Crud = () => {
    const {addProduct} = useProducts()

    const [formData, setFormData] = useState({
        name: "", brand: "", pet: "", category: "", description: "",
        age: "", condition: "", price: "", kg: "" 
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAddProduct = () => {
        addProduct(
            formData.name, 
            formData.brand, 
            formData.pet, 
            formData.category, 
            formData.description, 
            formData.age, 
            formData.condition, 
            formData.price,
            formData.kg 
        )
        setFormData({
            name: "", brand: "", pet: "", category: "", description: "",
            age: "", condition: "", price: "", kg: ""
        });
    }

    return(
        <div className="product-list-container">
            <input type="text" placeholder="ingresar nombre" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)}/>
            <input type="text" placeholder="ingresar marca" value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)}/>
            
            {/* Cambiamos a select para pet */}
            <select value={formData.pet} onChange={(e) => handleInputChange('pet', e.target.value)}>
                <option value="">Seleccionar mascota</option>
                <option value="gato">Gato</option>
                <option value="perro">Perro</option>
                <option value="ambos">Ambos</option>
            </select>

            {/* Cambiamos a select para category */}
            <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)}>
                <option value="">Seleccionar categoría</option>
                <option value="alimentos">Alimentos</option>
                <option value="accesorios">Accesorios</option>
                <option value="higiene">Higiene</option>
                <option value="indumentaria">Indumentaria</option>
                <option value="colchonetas">Colchonetas</option>
            </select>

            <input type="text" placeholder="ingresar descripcion" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)}/>
            <input type="text" placeholder="ingresar edad" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)}/>
            <input type="text" placeholder="ingresar condicion" value={formData.condition} onChange={(e) => handleInputChange('condition', e.target.value)}/>
            <input type="number" placeholder="Ingresar precio" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)}/>
            <input type="text" placeholder="Ingresar kg" value={formData.kg} onChange={(e) => handleInputChange('kg', e.target.value)}/>

            <button onClick={handleAddProduct}>Agregar</button>
        </div>
    )
}