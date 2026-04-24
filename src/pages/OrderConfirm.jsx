import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function OrderConfirm() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const justPlaced = JSON.parse(localStorage.getItem('mp_justPlacedOrders') || '[]')
    setOrders(justPlaced)
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

  const totalPrice = orders.reduce((sum, o) => sum + (typeof o.price === 'number' ? o.price : 0), 0)

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">

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

        {orders.map((order, index) => (
          <div key={order.id} className="bg-white rounded-2xl shadow border border-pink-100 overflow-hidden mb-4">

            <div className="bg-pink-50 px-6 py-4 border-b border-pink-100 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="text-xs text-gray-500 font-semibold">ORDER {index + 1} OF {orders.length}</span>
                <p className="text-lg font-bold text-pink-700">{order.ref}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Order ID</p>
                <p className="font-mono text-sm text-gray-600">#{order.id}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start gap-3 pb-3 border-b border-pink-100">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase">Product</p>
                  <p className="font-semibold text-gray-800 mt-1">🌸 {order.product}</p>
                </div>
                <p className="text-xl font-bold text-pink-600">
                  {typeof order.price === 'number' ? `BZD $${order.price}` : order.price}
                </p>
              </div>

              <div className="pt-4">
                <p className="text-gray-500 text-xs font-semibold uppercase">Status</p>
                <span className="inline-block text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full mt-1">
                  PENDING
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4 text-sm text-pink-800 mb-6">
          💌 <strong>What's next?</strong> Our team will contact you shortly to confirm all the details.
          Keep your reference number{orders.length > 1 ? 's' : ''} handy!
        </div>

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