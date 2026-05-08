// pages/home.tsx
import { Route, Routes } from "react-router-dom";
import { Header } from "../components/layout/header";
import { BodyHome } from "./bodyHome";
import { ProductList } from "../features/components/productList";
import { ProductDetail } from "../features/components/productDetail";
import { Crud } from "../features/components/crud";
import Footer from "../components/layout/footer";
import { Contacto } from "../components/layout/contacto";
import { SearchResultsPage } from "./searchResultsPage";
import { AdminGuard } from "../components/admin/adminGuard";
// import { EditProduct } from '../features/components/editProduct';


export function Home() {
    return (
        <>
            <Header />
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<BodyHome />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/:category" element={<ProductList />} />
                <Route path="/item/:id" element={<ProductDetail />} />
                <Route path="/contacto" element={<Contacto />} />
                
                {/* Rutas de administración (protegidas) */}
                <Route path="/admin/products" element={
                    <AdminGuard>
                        <ProductList />
                    </AdminGuard>
                } />
                <Route path="/admin/products/new" element={
                    <AdminGuard>
                        <Crud />
                    </AdminGuard>
                } />
                {/* <Route path="/admin/products/edit/:id" element={
                    <AdminGuard>
                        <EditProduct />
                    </AdminGuard>
                } /> */}

                {/* Ruta antigua de crud (redirige o protege) */}
                <Route path="/crud" element={
                    <AdminGuard>
                        <Crud />
                    </AdminGuard>
                } />
            </Routes>
            <Footer />
        </>
    );
}