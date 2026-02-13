import { BrowserRouter } from "react-router-dom"
import { Home } from "./pages/home"
import { ProductsProvider } from "./context/productsProvider"


function App() {
 

  return (
      <BrowserRouter>
        <ProductsProvider>
              <Home/>
        </ProductsProvider>
      </BrowserRouter>
  )
}

export default App
