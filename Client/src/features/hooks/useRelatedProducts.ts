import { useEffect, useState } from "react"
import type { Product } from "../types/types"


export const useRelatedProducts = (currentProductId:string, category:string) => {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
      const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const fetchRelatedProducts = async () => {
            setLoading(true)
            try{
                const response = await fetch(`http://localhost:3001/api/products?category=${category}`)
                const data = await response.json()

                const filtered = data.filter((product:Product) => product._id !== currentProductId)
                .slice(0,4)
                setRelatedProducts(filtered)
            } catch(error){
                console.error('No se obtuvieron los resultados:', error);
                setRelatedProducts([]);
            } finally {
                setLoading(false);
            }
        }

        if(category && currentProductId){
            fetchRelatedProducts()
        }
    },[currentProductId, category] )

    return{relatedProducts, loading}

}