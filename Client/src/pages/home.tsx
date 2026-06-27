// pages/home.tsx
import "../assets/styles/index.css"
import "../assets/styles/productList.css"
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Header } from "../components/layout/header";
import { BodyHome } from "./bodyHome";
import Footer from "../components/layout/footer";
import { Contacto } from "../components/layout/contacto";
import { SearchResultsPage } from "./searchResultsPage";
import { AdminGuard } from "../components/admin/adminGuard";
import { ResetPasswordPage } from "./resetPasswordPage";
import { Whatsapp } from "../components/layout/whatsappButton";
import { ScrollTop } from "../components/layout/upButton";
import { LoginPage } from "./loginPage";
import { RegisterPage } from "./registerPage";
import { ForgotPasswordPage } from "./forgotPassword";
import { UnderConstruction } from "../components/common/construccion";


const ProductListLazy = lazy(() => import('../features/components/productList'));
const ProductDetailLazy = lazy(() => import('../features/components/productDetail'));
const CrudLazy = lazy(() => import('../features/components/crud'));
const EditProductLazy = lazy(() => import('../features/components/editProduct'));
const ManageProductImagesLazy = lazy(() => import('../features/components/manageProductImage'));
const ProfilePageLazy = lazy(() => import('./profilePage'));
const ArticulosListLazy = lazy(() => import('../features/components/articulosList'));

// Componente Loader
const PageLoader = () => (
    <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
    </div>
);

export function Home() {
    return (
        <>
            <Header />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<BodyHome />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/:category" element={<ProductListLazy />} />
                    <Route path="/item/:id" element={<ProductDetailLazy />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/pedidos" element={<UnderConstruction />} />
                    <Route path="/profile" element={<ProfilePageLazy />} />
                    <Route path="/articulos" element={<ArticulosListLazy />} />
                    
                    {/* Rutas de autenticación */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                    
                    {/* Rutas protegidas - solo admin */}
                    <Route path="/crud" element={
                        <AdminGuard>
                            <CrudLazy />
                        </AdminGuard>
                    } />
                    
                    <Route path="/admin/products" element={
                        <AdminGuard>
                            <ProductListLazy />
                        </AdminGuard>
                    } />
                    
                    <Route path="/admin/products/new" element={
                        <AdminGuard>
                            <CrudLazy />
                        </AdminGuard>
                    } />
                    
                    <Route path="/admin/products/edit/:id" element={
                        <AdminGuard>
                            <EditProductLazy />
                        </AdminGuard>
                    } />
                    
                    <Route path="/admin/products/images/:id" element={
                        <AdminGuard>
                            <ManageProductImagesLazy />
                        </AdminGuard>
                    } />
                </Routes>
            </Suspense>
            <ScrollTop />
            <Whatsapp />
            <Footer />
        </>
    );
}