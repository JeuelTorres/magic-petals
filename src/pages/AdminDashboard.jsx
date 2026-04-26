import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
import { api } from '../api'

function AdminDashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  useEffect(() => {
    if (session.role !== 'admin') {
      navigate('/login')
      return
    }
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const { orders } = await api.getAllOrders()
      setOrders(orders)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  // Check if a bear delivery is within 24 hours
  const isUrgent = (o) => {
    if (o.type !== 'bear' || !o.date || !o.time) return false
    const delivery = new Date(o.date.slice(0, 10) + 'T' + o.time)
    const now = new Date()
    const diff = delivery - now
    return diff > 0 && diff < 24 * 60 * 60 * 1000
  }

  const urgentOrders = orders.filter(o => o.status !== 'cancelled' && isUrgent(o))

  // Search filter
  const filterSearch = (o) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      o.customer?.toLowerCase().includes(s) ||
      String(o.date || '').includes(s) ||
      String(o.ref || '').toLowerCase().includes(s) ||
      String(o.product || '').toLowerCase().includes(s)
    )
  }

  const pending = orders.filter(o => o.status === 'pending' && filterSearch(o))
  const active = orders.filter(o => o.status === 'active' && filterSearch(o))
  const completed = orders.filter(o => o.status === 'completed' && filterSearch(o))
  const cancelled = orders.filter(o => o.status === 'cancelled')

  // Stats
  const totalOrders = orders.length
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.price) || 0), 0)

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return (
      <span className={'text-xs font-semibold px-2 py-1 rounded-full ' + colors[status]}>
        {status?.toUpperCase()}
      </span>
    )
  }

  const OrderCard = ({ order }) => (
    <div className={'bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition ' + (isUrgent(order) ? 'border-red-300 ring-2 ring-red-200' : 'border-pink-100')}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs text-gray-400">{order.ref}</p>
          <p className="font-bold text-gray-800">{order.customer}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          {order.type === 'bear' ? '🐻' : order.type === 'basket' ? '🎁' : '🌹'}{' '}
          <strong>{order.product}</strong>
        </p>
        <p>
          📅 {order.date ? new Date(order.date).toLocaleDateString() : '—'}
          {order.time && ' · ⏰ ' + order.time}
        </p>
        <p className="text-pink-600 font-bold">BZD ${Number(order.price).toFixed(2)}</p>
      </div>

      {isUrgent(order) && (
        <p className="mt-2 text-xs text-red-600 font-semibold">⚡ URGENT — within 24 hours!</p>
      )}
    </div>
  )

  const Section = ({ title, list, color }) => (
    <div className="mb-8">
      <h3 className={'text-lg font-bold mb-3 ' + color}>
        {title} <span className="text-sm text-gray-400">({list.length})</span>
      </h3>
      {list.length === 0 ? (
        <p className="text-gray-400 text-sm italic bg-white rounded-lg border border-pink-100 p-4 text-center">
          No {title.toLowerCase()} right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <AdminNavbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-pink-600 text-lg animate-pulse">📊 Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">

      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500">Welcome back! Here's what's happening with Magic Pettals today.</p>
        </div>

        {/* Urgent banner */}
        {urgentOrders.length > 0 && (
          <div className="bg-red-50 border-2 border-red-300 text-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div className="flex-1">
              <p className="font-bold">
                URGENT: {urgentOrders.length} bear delivery booking(s) scheduled within the next 24 hours!
              </p>
              <p className="text-sm mt-1">Check the Reminders page to see full details.</p>
            </div>
            <button
              onClick={() => navigate('/admin/reminders')}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
            >
              View Reminders →
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold">TOTAL ORDERS</p>
            <p className="text-3xl font-bold text-pink-600">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold">PENDING</p>
            <p className="text-3xl font-bold text-yellow-500">{pending.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold">ACTIVE</p>
            <p className="text-3xl font-bold text-green-600">{active.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold">REVENUE</p>
            <p className="text-3xl font-bold text-pink-600">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">🔍 Search Orders</label>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name, date, order ref, or product..."
            className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
          />
        </div>

        {/* Orders Sections */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-pink-100 p-8 text-center">
            <p className="text-5xl mb-3">🌸</p>
            <p className="text-gray-500">No orders yet. When customers place orders, they will appear here!</p>
          </div>
        ) : (
          <>
            <Section title="Pending Orders"   list={pending}   color="text-yellow-600" />
            <Section title="Active Orders"    list={active}    color="text-green-600" />
            <Section title="Completed Orders" list={completed} color="text-blue-600" />
            {cancelled.length > 0 && (
              <Section title="Cancelled Orders" list={cancelled} color="text-red-600" />
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard