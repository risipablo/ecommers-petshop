import { BrowserRouter } from "react-router-dom"
import { Home } from "./pages/home"
import { ProductsProvider } from "./context/productsProvider"
import { AuthProvider } from './context/authProvider';


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
