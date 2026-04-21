import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function OrderConfirm() {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mp_lastOrder') || 'null')
    setOrder(saved)
  }, [])

  // If no recent order, show a friendly message
  if (!order) {
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

  const icon = order.type === 'bear' ? '🐻' : order.type === 'basket' ? '🎁' : '🌹'

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow border border-pink-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white p-8 text-center">
            <div className="text-6xl mb-3"></div>
            <h2 className="text-3xl font-bold mb-1">Your Order is Confirmed!</h2>
            <p className="text-pink-100">Thank you for choosing Magic Pettals </p>
          </div>

          {/* Reference */}
          <div className="bg-pink-50 border-b border-pink-100 p-5 text-center">
            <p className="text-xs text-gray-500 font-semibold mb-1">REFERENCE NUMBER</p>
            <p className="text-2xl font-bold text-pink-700 tracking-wider">{order.ref}</p>
            <p className="text-xs text-gray-400 mt-1">Order ID: {order.id}</p>
          </div>

          {/* Summary */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">

              {/* Product */}
              <div className="flex justify-between items-start gap-3 pb-3 border-b border-pink-100">
                <div>
                  <p className="text-gray-500 text-xs font-semibold uppercase">Product</p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {icon} {order.product}
                  </p>
                </div>
                <p className="text-xl font-bold text-pink-600">
                  {typeof order.price === 'number' ? `BZD $${order.price}` : order.price}
                </p>
              </div>

              {/* Customer */}
              <div className="pb-3 border-b border-pink-100">
                <p className="text-gray-500 text-xs font-semibold uppercase">Customer</p>
                <p className="text-gray-800 mt-1">👤 {order.customer}</p>
                <p className="text-gray-500 text-xs">{order.customerEmail}</p>
              </div>

              {/* Recipient (if bear/basket) */}
              {order.recipient && (
                <div className="pb-3 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase">Recipient</p>
                  <p className="text-gray-800 mt-1"> {order.recipient}</p>
                  {order.recipientAge && (
                    <p className="text-gray-500 text-xs">Age: {order.recipientAge}</p>
                  )}
                </div>
              )}

              {/* Date & Time */}
              <div className="pb-3 border-b border-pink-100">
                <p className="text-gray-500 text-xs font-semibold uppercase">Scheduled For</p>
                <p className="text-gray-800 mt-1">
                   {order.date} {order.time && `·  ${order.time}`}
                </p>
              </div>

              {/* Delivery or Pickup */}
              <div className="pb-3 border-b border-pink-100">
                <p className="text-gray-500 text-xs font-semibold uppercase">
                  {order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}
                </p>
                {order.deliveryType === 'pickup' ? (
                  <p className="text-gray-800 mt-1"> Pick up at our shop — we'll contact you when it's ready!</p>
                ) : (
                  <p className="text-gray-800 mt-1">📍 {order.address}</p>
                )}
              </div>

              {/* Song Request */}
              {order.song && (
                <div className="pb-3 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase"> Song Request</p>
                  <p className="text-gray-800 mt-1 italic">"{order.song}"</p>
                </div>
              )}

              {/* Flower Types (Natural bouquets) */}
              {(order.flowerTypes?.length > 0 || order.customFlower) && (
                <div className="pb-3 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase"> Flower Types</p>
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

              {/* Extras (flower catalog) */}
              {order.extras?.length > 0 && (
                <div className="pb-3 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase">✨ Extras Added</p>
                  <div className="mt-2 space-y-2">
                    {order.extras.map(extraId => {
                      const detail = order.extraDetails?.[extraId]
                      return (
                        <div key={extraId} className="bg-pink-50 rounded-lg p-2">
                          <p className="text-sm font-semibold text-pink-700 capitalize">
                            {extraId.replace('_', ' ')}
                          </p>
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
                  <p className="text-gray-500 text-xs font-semibold uppercase"> Basket Items</p>
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
                  <p className="text-gray-500 text-xs font-semibold uppercase"> Basket Notes</p>
                  <p className="text-gray-700 mt-1 text-sm">{order.basketDescription}</p>
                </div>
              )}

              {/* Notes */}
              {order.notes && (
                <div className="pb-3 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase"> Special Requests</p>
                  <p className="text-gray-700 mt-1 text-sm">{order.notes}</p>
                </div>
              )}

              {/* Inspo photo note */}
              {order.hasInspo && (
                <div className="pb-3 border-b border-pink-100">
                  <p className="text-gray-500 text-xs font-semibold uppercase">📸 Inspiration Photo</p>
                  <p className="text-green-600 mt-1 text-sm"> Photo attached — our team will review it!</p>
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

            {/* What's next */}
            <div className="mt-6 bg-pink-50 border border-pink-200 rounded-xl p-4 text-sm text-pink-800">
              💌 <strong>What's next?</strong> Our team will contact you shortly to confirm all the details
              {typeof order.price !== 'number' && ' and finalize the price'}.
              Keep your reference number handy!
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 flex-wrap">
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
      </div>
    </div>
  )
}

export default OrderConfirm