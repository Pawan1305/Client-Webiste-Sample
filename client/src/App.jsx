import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-dark-900">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
)

function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#F5ECD7',
              border: '1px solid rgba(201,168,76,0.35)',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#C9A84C', secondary: '#111' } },
            error: { iconTheme: { primary: '#e53935', secondary: '#111' } },
          }}
        />

        <Routes>
          {/* Admin routes — standalone layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public routes — with Navbar + Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </CartProvider>
    </AdminAuthProvider>
  )
}

export default App
