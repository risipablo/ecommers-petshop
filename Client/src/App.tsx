import { BrowserRouter } from "react-router-dom"
import { Home } from "./pages/home"
import { ProductsProvider } from "./context/productsProvider"
import { AuthProvider } from './context/authProvider';
import './assets/styles/index.css'
import './assets/styles/header.css'
import './assets/styles/navbar.css'

function App() {
 

  return (
      <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
              <Home/>
        </ProductsProvider>
      </AuthProvider>
      </BrowserRouter>
  )
}

export default App
