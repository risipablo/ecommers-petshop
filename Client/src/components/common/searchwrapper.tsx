import { UseBuscador } from "../../features/hooks/useBuscador";
import { Search } from "../../features/components/buscador";

export function SearchWrapper() {
    const { filterProduct } = UseBuscador();
    
    return <Search 
        placeholder="¿Qué producto estás buscando?" 
        filterData={filterProduct} 
    />;
}