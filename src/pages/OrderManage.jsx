import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
import { api } from '../api'

function OrderManage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
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

  const updateStatus = async (id, newStatus) => {
    try {
      await api.updateOrderStatus(id, newStatus)
      loadOrders()
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order permanently? This cannot be undone.')) return
    try {
      await api.deleteOrder(id)
      loadOrders()
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const sendWhatsApp = (order) => {
    if (!order.customerPhone) {
      alert('No phone number on file for this customer.')
      return
    }

    let message = ''
    if (order.status === 'pending') {
      message = `Hi ${order.customer}! 🌸 This is Magic Pettals. We've received your order ${order.ref} for ${order.product}. We'll contact you shortly to confirm all the details. Thank you!`
    } else if (order.status === 'active') {
      message = `Hi ${order.customer}! 🌸 This is Magic Pettals. Your order ${order.ref} (${order.product}) is being prepared${order.deliveryType === 'pickup' ? ' and will be ready for pickup soon!' : ' and will be delivered soon!'} 💕`
    } else if (order.status === 'completed') {
      message = `Hi ${order.customer}! 🌸 Your Magic Pettals order ${order.ref} is ready! ${order.deliveryType === 'pickup' ? 'You can pick it up at our shop.' : 'We will deliver it at the scheduled time.'} Thank you for choosing us! 💕`
    } else {
      message = `Hi ${order.customer}! 🌸 This is Magic Pettals regarding your order ${order.ref}.`
    }

    let phone = order.customerPhone.replace(/\D/g, '')
    if (!phone.startsWith('501') && phone.length <= 8) {
      phone = '501' + phone
    }

    const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message)
    window.open(url, '_blank')
  }

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (!search) return true
    const s = search.toLowerCase()
    return (
      o.customer?.toLowerCase().includes(s) ||
      String(o.date || '').includes(s) ||
      String(o.ref || '').toLowerCase().includes(s) ||
      String(o.product || '').toLowerCase().includes(s)
    )
  })

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

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <AdminNavbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-pink-600 text-lg animate-pulse">📋 Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📋 Order Management</h2>
          <p className="text-gray-500">Confirm, update, or cancel customer orders — and message them on WhatsApp</p>
        </div>

        <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🔍 Search</label>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Customer, date, order ref, product..."
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Status</label>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400 bg-white"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-pink-100 p-8 text-center">
            <p className="text-5xl mb-3">📋</p>
            <p className="text-gray-500">
              {orders.length === 0
                ? 'No orders yet. Orders will appear here when customers place them.'
                : 'No orders match your search.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-pink-50 border-b border-pink-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Order Ref</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Item</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Price</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-pink-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id} className="border-b border-pink-50 hover:bg-pink-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-gray-600">{order.ref}</p>
                        <p className="text-xs text-gray-400">ID: {order.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.customerEmail}</p>
                        {order.customerPhone && (
                          <p className="text-xs text-gray-400">📞 {order.customerPhone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">
                          {order.type === 'bear' ? '🐻' : order.type === 'basket' ? '🎁' : '🌹'}{' '}
                          {order.product}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{order.date ? new Date(order.date).toLocaleDateString() : '—'}</p>
                        {order.time && <p className="text-xs text-gray-400">⏰ {order.time}</p>}
                      </td>
                      <td className="px-4 py-3 font-bold text-pink-600">
                        ${Number(order.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end flex-wrap">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(order.id, 'active')}
                              className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition"
                            >
                              ✓ Confirm
                            </button>
                          )}
                          {order.status === 'active' && (
                            <button
                              onClick={() => updateStatus(order.id, 'completed')}
                              className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition"
                            >
                              ✓ Complete
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button
                              onClick={() => updateStatus(order.id, 'cancelled')}
                              className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                            >
                              ✕ Cancel
                            </button>
                          )}
                          {order.status === 'cancelled' && (
                            <button
                              onClick={() => updateStatus(order.id, 'pending')}
                              className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full transition"
                            >
                              ↻ Reopen
                            </button>
                          )}
                          <button
                            onClick={() => sendWhatsApp(order)}
                            className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition"
                          >
                            💬 WhatsApp
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-xs bg-gray-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-pink-50 px-4 py-2 text-xs text-gray-500 border-t border-pink-100">
              Showing {filtered.length} of {orders.length} orders
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderManage