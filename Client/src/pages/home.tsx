import { Route, Routes } from "react-router-dom";
import { Header } from "../components/layout/header";
import { BodyHome } from "./bodyHome";
import { ProductList } from "../features/components/productList";
import { ProductDetail } from "../features/components/productDetail";
import { Crud } from "../features/components/crud";
import Footer from "../components/layout/footer";
import { Contacto } from "../components/layout/contacto";
import { SearchResultsPage } from "./searchResultsPage";

export function Home() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<BodyHome />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/:category" element={<ProductList />} />
                <Route path="/item/:id" element={<ProductDetail />} />
                <Route path="/crud" element={<Crud />} />
                <Route path="/contacto" element={<Contacto />} />   
            </Routes>
            <Footer />
        </>
    );
}