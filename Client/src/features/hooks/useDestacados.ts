import { useState } from "react"
import type { IDestacados } from "../types/types"
import { destacado } from "../../components/data/destacados"

export const UseDestacados = () => {
    const [products, setProducts] = useState<IDestacados[]>([])

    const fetch = ():Promise<IDestacados[]> => {
        
        return new Promise<IDestacados[]>((resolve) => {
            const prods = (destacado as IDestacados[])

            setProducts(prods)
            resolve(prods)
        })
    }

    return{products, fetch}

}