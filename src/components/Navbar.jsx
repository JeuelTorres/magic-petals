import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')
  const isLoggedIn = !!session.email
  const isAdmin = session.role === 'admin'

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
        Magic Petals
      </h1>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
        <button onClick={() => navigate('/')} className="hover:text-pink-600 transition">Home</button>
        <button onClick={() => navigate('/catalog')} className="hover:text-pink-600 transition">Shop</button>
        <button onClick={() => navigate('/book-bear')} className="hover:text-pink-600 transition">Bear Delivery</button>
        <button onClick={() => navigate('/faq')} className="hover:text-pink-600 transition">FAQ</button>
        

        {isAdmin && (
          <button onClick={() => navigate('/admin')} className="hover:text-pink-600 transition">Admin</button>
        )}

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