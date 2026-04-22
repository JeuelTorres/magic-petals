import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function OrderConfirm() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Get ALL orders placed in this session (sorted newest first)
    const all = JSON.parse(localStorage.getItem('mp_orders') || '[]')
    const session = JSON.parse(localStorage.getItem('mp_session') || '{}')
    const justPlaced = JSON.parse(localStorage.getItem('mp_justPlaced') || '[]')

    if (justPlaced.length > 0) {
      // Find the orders we just placed
      const placedOrders = all.filter(o => justPlaced.includes(o.id))
      setOrders(placedOrders)
    } else {
      // Fallback: just show the last order
      const lastOrder = JSON.parse(localStorage.getItem('mp_lastOrder') || 'null')
      if (lastOrder) setOrders([lastOrder])
    }
  }, [])

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <div className="bg-white rounded-2xl shadow border border-pink-100 p-10">
            <p className="text-5xl mb-3">🌸</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No recent order</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed an order yet.</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-full transition"
            >
              Browse Flowers 🌹
            </button>
          </div>
        </div>
      </div>
    )
  }

  const typeIcon = (t) => t === 'bear' ? '🐻' : t === 'basket' ? '🎁' : '🌹'

  const totalPrice = orders.reduce((sum, o) => sum + (typeof o.price === 'number' ? o.price : 0), 0)

  const OrderDetails = ({ order, index }) => (
    <div className="bg-white rounded-2xl shadow border border-pink-100 overflow-hidden mb-4">

      {/* Order Header */}
      <div className="bg-pink-50 px-6 py-4 border-b border-pink-100 flex justify-between items-center flex-wrap gap-2">
        <div>
          <span className="text-xs text-gray-500 font-semibold">ORDER {index + 1} OF {orders.length}</span>
          <p className="text-lg font-bold text-pink-700">{order.ref}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Order ID</p>
          <p className="font-mono text-sm text-gray-600">{order.id}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3 text-sm">

          {/* Product */}
          <div className="flex justify-between items-start gap-3 pb-3 border-b border-pink-100">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase">Product</p>
              <p className="font-semibold text-gray-800 mt-1">
                {typeIcon(order.type)} {order.product}
              </p>
            </div>
            <p className="text-xl font-bold text-pink-600">
              {typeof order.price === 'number' ? `BZD $${order.price}` : order.price}
            </p>
          </div>

          {/* Recipient */}
          {order.recipient && (
            <div className="pb-3 border-b border-pink-100">
              <p className="text-gray-500 text-xs font-semibold uppercase">Recipient</p>
              <p className="text-gray-800 mt-1">🎁 {order.recipient}</p>
            </div>
          )}

          {/* Date & Time */}
          <div className="pb-3 border-b border-pink-100">
            <p className="text-gray-500 text-xs font-semibold uppercase">
              {order.deliveryType === 'pickup' ? 'Pickup Scheduled For' : 'Delivery Scheduled For'}
            </p>
            <p className="text-gray-800 mt-1">
              📅 {order.date} {order.time && `· ⏰ ${order.time}`}
            </p>
          </div>

          {/* Delivery or Pickup */}
          <div className="pb-3 border-b border-pink-100">
            <p className="text-gray-500 text-xs font-semibold uppercase">
              {order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
            </p>
            {order.deliveryType === 'pickup' ? (
              <p className="text-gray-800 mt-1">🏪 Pick up at our shop — we'll contact you when it's ready!</p>
            ) : (
              <p className="text-gray-800 mt-1">📍 {order.address}</p>
            )}
          </div>

          {/* Song Request */}
          {order.song && (
            <div className="pb-3 border-b border-pink-100">
              <p className="text-gray-500 text-xs font-semibold uppercase">🎤 Song Request</p>
              <p className="text-gray-800 mt-1 italic">"{order.song}"</p>
            </div>
          )}

          {/* Flower Types (Natural bouquets) */}
          {(order.flowerTypes?.length > 0 || order.customFlower) && (
            <div className="pb-3 border-b border-pink-100">
              <p className="text-gray-500 text-xs font-semibold uppercase">🌺 Flower Types</p>
              {order.flowerTypes?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {order.flowerTypes.map(type => (
                    <span key={type} className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold">
                      {type}
                    </span>
                  ))}
                </div>
              )}
              {order.customFlower && (
                <p className="text-gray-700 text-sm mt-2">+ {order.customFlower}</p>
              )}
            </div>
          )}

          {/* Extras */}
          {order.extras?.length > 0 && (
            <div className="pb-3 border-b border-pink-100">
              <p className="text-gray-500 text-xs font-semibold uppercase">✨ Extras Added</p>
              <div className="mt-2 space-y-2">
                {order.extras.map(extraId => {
                  const detail = order.extraDetails?.[extraId]
                  return (
                    <div key={extraId} className="bg-pink-50 rounded-lg p-2">
                      <p className="text-sm font-semibold text-pink-700 capitalize">{extraId.replace('_', ' ')}</p>
                      {detail && <p className="text-gray-700 text-xs mt-1">"{detail}"</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Basket items */}
          {order.basketItems?.length > 0 && (
            <div className="pb-3 border-b border-pink-100">
              <p className="text-gray-500 text-xs font-semibold uppercase">🎁 Basket Items</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {order.basketItems.map(item => (
                  <span key={item} className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Basket description */}
          {order.basketDescription && (
            <div className="pb-3 border-b border-pink-100">
              <p className="text-gray-500 text-xs font-semibold uppercase">📝 Basket Notes</p>
              <p className="text-gray-700 mt-1 text-sm">{order.basketDescription}</p>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="pb-3 border-b border-pink-100">
              <p className="text-gray-500 text-xs font-semibold uppercase">📝 Special Requests</p>
              <p className="text-gray-700 mt-1 text-sm">{order.notes}</p>
            </div>
          )}

          {/* Inspo photo */}
          {order.hasInspo && (
            <div className="pb-3 border-b border-pink-100">
              <p className="text-gray-500 text-xs font-semibold uppercase">📸 Inspiration Photo</p>
              <p className="text-green-600 mt-1 text-sm">✅ Photo attached — our team will review it!</p>
            </div>
          )}

          {/* Status */}
          <div className="pt-1">
            <p className="text-gray-500 text-xs font-semibold uppercase">Status</p>
            <span className="inline-block text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full mt-1">
              {order.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Big Success Header */}
        <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white p-8 text-center rounded-2xl mb-4 shadow">
          <div className="text-6xl mb-3">✅</div>
          <h2 className="text-3xl font-bold mb-1">
            {orders.length > 1 ? `${orders.length} Orders Confirmed!` : 'Your Order is Confirmed!'}
          </h2>
          <p className="text-pink-100">Thank you for choosing Magic Pettals 🌸</p>
          {orders.length > 1 && (
            <p className="text-pink-100 text-sm mt-3">
              Total: <strong className="text-white">BZD ${totalPrice}</strong>
            </p>
          )}
        </div>

        {/* Render each order */}
        {orders.map((order, index) => (
          <OrderDetails key={order.id} order={order} index={index} />
        ))}

        {/* What's next */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4 text-sm text-pink-800 mb-6">
          💌 <strong>What's next?</strong> Our team will contact you shortly to confirm all the details.
          Keep your reference number{orders.length > 1 ? 's' : ''} handy!
        </div>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-full transition"
          >
            🏠 Back to Home
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

export default OrderConfirm