import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartCount } from '../cart'

function Navbar() {
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(getCartCount())

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')
  const isLoggedIn = !!session.email
  const isAdmin = session.role === 'admin'

  // Listen for cart updates so the count refreshes instantly
  useEffect(() => {
    const refresh = () => setCartCount(getCartCount())
    window.addEventListener('cart-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('cart-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('mp_session')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <h1
        onClick={() => navigate('/')}
        className="text-2xl font-bold text-gray-800 italic cursor-pointer"
      >
        🌸 Magic Pettals
      </h1>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
        <button onClick={() => navigate('/')} className="hover:text-pink-600 transition">Home</button>
        <button onClick={() => navigate('/catalog')} className="hover:text-pink-600 transition">Shop</button>
        <button onClick={() => navigate('/book-bear')} className="hover:text-pink-600 transition">Bear Delivery</button>
        <button onClick={() => navigate('/faq')} className="hover:text-pink-600 transition">FAQ</button>

        {isAdmin && (
          <button onClick={() => navigate('/admin')} className="hover:text-pink-600 transition">Admin</button>
        )}

        {/* Cart button */}
        <button
          onClick={() => navigate('/cart')}
          className="relative hover:text-pink-600 transition text-xl"
          title="Cart"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-5 py-2 rounded-full transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-full transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar