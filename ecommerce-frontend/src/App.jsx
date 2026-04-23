import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import Layout from "./components/layout/Layout"

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
