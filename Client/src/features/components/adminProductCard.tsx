// features/components/AdminProductCard.tsx
import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye } from "lucide-react";

interface AdminProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        imageUrl?: string;
        category: string;
    };
}

export const AdminProductCard = ({ product }: AdminProductCardProps) => {
    const { deleteProduct, isLoading } = useProducts();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
            setIsDeleting(true);
            try {
                await deleteProduct(product._id);
                alert('Producto eliminado exitosamente');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                alert('Error al eliminar el producto');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit-product/${product._id}`);
    };

    const handleView = () => {
        navigate(`/item/${product._id}`);
    };

    return (
        <div className="product-card admin-card">
            <div className="product-image-wrapper">
                <img 
                    src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Sin+Imagen'} 
                    alt={product.name} 
                    className="product-image"
                />
            </div>
            
            <div className="product-divider"></div>
            
            <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                
                <div className="product-footer">
                    <span className="current-price">${product.price}</span>
                    <div className="admin-actions">
                        <button 
                            className="view-btn"
                            onClick={handleView}
                            title="Ver producto"
                        >
                            <Eye size={18} />
                        </button>
                        <button 
                            className="edit-btn"
                            onClick={handleEdit}
                            title="Editar producto"
                        >
                            <Edit size={18} />
                        </button>
                        <button 
                            className="delete-btn"
                            onClick={handleDelete}
                            disabled={isDeleting || isLoading}
                            title="Eliminar producto"
                        >
                            {isDeleting ? '...' : <Trash2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};