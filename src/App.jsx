import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductCatalog from './pages/ProductCatalog'
import BearBooking from './pages/BearBooking'
import Cart from './pages/Cart'
import OrderConfirm from './pages/OrderConfirm'
import FAQ from './pages/FAQ'
import AdminDashboard from './pages/AdminDashboard'
import OrderManage from './pages/OrderManage'
import Reminders from './pages/Reminders'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import ProductManage from './pages/ProductManage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/catalog" element={<ProductCatalog />} />
        <Route path="/book-bear" element={<BearBooking />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-confirm" element={<OrderConfirm />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<OrderManage />} />
        <Route path="/admin/reminders" element={<Reminders />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/products" element={<ProductManage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App