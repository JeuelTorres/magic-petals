import { useNavigate, useLocation } from 'react-router-dom'

function AdminNavbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('mp_session')
    navigate('/')
  }

  const links = [
    { label: ' Dashboard', path: '/admin' },
    { label: ' Orders',    path: '/admin/orders' },
    { label: ' Reminders', path: '/admin/reminders' },
    { label: ' Inventory', path: '/admin/inventory' },
    { label: ' Reports',   path: '/admin/reports' },
    { label: ' Support',   path: '/admin/support' },
  ]

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold italic text-pink-400"> Magic Pettals</span>
        <span className="text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
      </div>

      <div className="flex items-center gap-1 text-sm font-medium flex-wrap">
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`px-3 py-1.5 rounded-lg transition ${
              location.pathname === link.path
                ? 'bg-pink-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {link.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="ml-3 bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-full transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default AdminNavbar