// pages/home.tsx (SIN lazy loading)
import { Route, Routes } from "react-router-dom";
import { Header } from "../components/layout/header";
import { BodyHome } from "./bodyHome";
import  ProductList  from "../features/components/productList";
import  ProductDetail  from "../features/components/productDetail";
import Crud  from "../features/components/crud";
import Footer from "../components/layout/footer";
import { Contacto } from "../components/layout/contacto";
import { SearchResultsPage } from "./searchResultsPage";
import { AdminGuard } from "../components/admin/adminGuard";
import  ProfilePage  from "./profilePage";
import  EditProduct  from "../features/components/editProduct";
import  ManageProductImages  from "../features/components/manageProductImage";
import { ResetPasswordPage } from "./resetPasswordPage";
import { Whatsapp } from "../components/layout/whatsappButton";
import { ScrollTop } from "../components/layout/upButton";
import { LoginPage } from "./loginPage";
import { RegisterPage } from "./registerPage";
import { ForgotPasswordPage } from "./forgotPassword";
import ArticulosList from "../features/components/articulosList";
import { UnderConstruction } from "../components/common/construccion";

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
                <Route path="/pedidos" element={<UnderConstruction />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/articulos" element={<ArticulosList />} />
                
                {/* Rutas de autenticación */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                
                {/* Rutas protegidas - solo admin */}
                <Route path="/crud" element={
                    <AdminGuard>
                        <Crud />
                    </AdminGuard>
                } />
                
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
                
                <Route path="/admin/products/edit/:id" element={
                    <AdminGuard>
                        <EditProduct />
                    </AdminGuard>
                } />
                
                <Route path="/admin/products/images/:id" element={
                    <AdminGuard>
                        <ManageProductImages />
                    </AdminGuard>
                } />
            </Routes>
            <ScrollTop />
            <Whatsapp />
            <Footer />
        </>
    );
}