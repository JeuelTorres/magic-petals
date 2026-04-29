import { useNavigate } from 'react-router-dom'

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-gray-900 text-gray-400 py-10 px-6 text-center mt-auto">
      <h3 className="text-white text-xl font-bold italic mb-2">🌸 Magic Petals</h3>
      <p className="text-sm mb-6">Eternal roses & bear delivery — Belize</p>
      <div className="flex justify-center gap-8 text-sm mb-6 flex-wrap">
        <button onClick={() => navigate('/')} className="hover:text-white transition">Home</button>
        <button onClick={() => navigate('/catalog')} className="hover:text-white transition">Shop</button>
        <button onClick={() => navigate('/book-bear')} className="hover:text-white transition">Bear Delivery</button>
        <button onClick={() => navigate('/faq')} className="hover:text-white transition">FAQ</button>
        <button onClick={() => navigate('/login')} className="hover:text-white transition">Login</button>
      </div>
      <p className="text-xs text-gray-600">© 2025 Magic Pettals. All rights reserved.</p>
    </footer>
  )
}

export default Footer