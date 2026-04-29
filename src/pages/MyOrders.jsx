import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../api'

function MyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  const loadOrders = async () => {
    try {
      const { orders } = await api.getUserOrders(session.id)
      setOrders(orders)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!session.id) {
      navigate('/login')
      return
    }
    loadOrders()
    const interval = setInterval(loadOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const StatusBadge = ({ status }) => {
    const map = {
      pending:   { color: 'bg-yellow-100 text-yellow-700', icon: '⏳', label: 'Pending' },
      active:    { color: 'bg-green-100 text-green-700',   icon: '🚗', label: 'In Progress' },
      completed: { color: 'bg-blue-100 text-blue-700',     icon: '✅', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700',       icon: '❌', label: 'Cancelled' },
    }
    const s = map[status] || map.pending
    return (
      <span className={'text-xs font-semibold px-3 py-1 rounded-full ' + s.color}>
        {s.icon} {s.label}
      </span>
    )
  }

  const StatusBar = ({ status }) => {
    const steps = ['pending', 'active', 'completed']
    const currentIndex = steps.indexOf(status)

    if (status === 'cancelled') return (
      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 text-center font-semibold">
        ❌ This order has been cancelled. Please contact us for more info.
      </div>
    )

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, i) => {
            const labels = { pending: 'Pending', active: 'In Progress', completed: 'Delivered' }
            const icons  = { pending: '⏳', active: '🚗', completed: '✅' }
            const done   = i <= currentIndex
            return (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${done ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {icons[step]}
                </div>
                <p className={`text-xs font-semibold ${done ? 'text-pink-600' : 'text-gray-400'}`}>
                  {labels[step]}
                </p>
              </div>
            )
          })}
        </div>
        <div className="relative mx-4">
          <div className="h-1 bg-gray-200 rounded-full" />
          <div
            className="h-1 bg-pink-500 rounded-full absolute top-0 left-0 transition-all duration-500"
            style={{ width: currentIndex === 0 ? '0%' : currentIndex === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-pink-600 text-lg animate-pulse">🌸 Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <div className="bg-white rounded-2xl shadow border border-pink-100 p-10">
            <p className="text-5xl mb-3">🌸</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-full transition"
            >
              Browse Flowers
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">

        <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white p-8 text-center rounded-2xl mb-4 shadow">
          <h2 className="text-3xl font-bold mb-1">My Orders</h2>
          <p className="text-pink-100">Track all your Magic Petals orders 🌸</p>
          <p className="text-pink-100 text-sm mt-2">{orders.length} order{orders.length > 1 ? 's' : ''}</p>
        </div>

        <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-3 text-sm text-pink-800 mb-4 text-center">
          🔄 Status updates automatically every 30 seconds
        </div>

        {orders.map((order, index) => (
          <div key={order.id} className="bg-white rounded-2xl shadow border border-pink-100 overflow-hidden mb-4">

            {/* Order Header */}
            <div className="bg-pink-50 px-6 py-4 border-b border-pink-100 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="text-xs text-gray-500 font-semibold">ORDER {index + 1} OF {orders.length}</span>
                <p className="text-lg font-bold text-pink-700">{order.ref}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="font-mono text-xs text-gray-400">#{order.id}</p>
                <StatusBadge status={order.status} />
              </div>
            </div>

            <div className="p-6 space-y-4">

              {/* Product + Price */}
              <div className="flex justify-between items-start gap-3 pb-4 border-b border-pink-100">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase">Product</p>
                  <p className="font-semibold text-gray-800 mt-1">{order.product}</p>
                </div>
                <p className="text-xl font-bold text-pink-600">
                  BZD ${parseFloat(order.total_price || order.price || 0).toFixed(2)}
                </p>
              </div>

              {/* Delivery or Pickup */}
              <div className="pb-4 border-b border-pink-100">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-1">
                  {order.deliveryType === 'pickup' ? '🏪 Pickup' : '🚗 Delivery'}
                </p>
                {order.deliveryType === 'pickup' ? (
                  <p className="text-sm text-gray-700">You will pick up your order from our shop.</p>
                ) : (
                  order.address && (
                    <p className="text-sm text-gray-700">📍 {order.address}</p>
                  )
                )}
              </div>

              {/* Date & Time */}
              {order.date && (
                <div className="pb-4 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">
                    {order.deliveryType === 'pickup' ? 'Pickup Date & Time' : 'Delivery Date & Time'}
                  </p>
                  <p className="text-sm text-gray-700">
                    📅 {new Date(order.date).toLocaleDateString()}
                    {order.time && <span> · ⏰ {order.time}</span>}
                  </p>
                </div>
              )}

              {/* Recipient */}
              {order.recipient && (
                <div className="pb-4 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Recipient</p>
                  <p className="text-sm text-gray-700">👤 {order.recipient}</p>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="pb-4 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Special Requests</p>
                  <p className="text-sm text-gray-700">📝 {order.notes}</p>
                </div>
              )}

              {/* Custom Flower */}
              {order.customFlower && (
                <div className="pb-4 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Custom Flower</p>
                  <p className="text-sm text-gray-700">🌸 {order.customFlower}</p>
                </div>
              )}

              {/* Status Bar */}
              <StatusBar status={order.status} />

            </div>
          </div>
        ))}

        <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4 text-sm text-pink-800 mb-6">
          💌 <strong>Need help?</strong> Our team will contact you to confirm your order details.
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-full transition"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/catalog')}
            className="flex-1 border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-semibold py-3 rounded-full transition"
          >
            Place Another Order
          </button>
        </div>

      </div>
    </div>
  )
}

export default MyOrders