import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '../cart'

function Cart() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  const refresh = () => {
    setItems(getCart())
    setTotal(getCartTotal())
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleRemove = (cartId) => {
    removeFromCart(cartId)
    refresh()
  }

  const handleQty = (cartId, qty) => {
    updateQuantity(cartId, qty)
    refresh()
  }

  const handleCheckout = () => {
    const session = JSON.parse(localStorage.getItem('mp_session') || '{}')
    if (!session.email) {
      localStorage.setItem('mp_redirect', '/cart')
      navigate('/login')
      return
    }

    if (items.length === 0) return

    // Turn each cart item into a separate order (one per quantity)
    const orders = JSON.parse(localStorage.getItem('mp_orders') || '[]')
    const placedOrders = []

    items.forEach(item => {
      const qty = item.quantity || 1
      for (let i = 0; i < qty; i++) {
        const newOrder = {
          id: 'MP-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
          ref: '#' + Math.floor(10000 + Math.random() * 90000),
          customer: session.name,
          customerEmail: session.email,
          customerPhone: session.phone,
          status: 'pending',
          createdAt: new Date().toISOString(),
          ...item,
        }
        delete newOrder.cartId
        delete newOrder.quantity
        orders.push(newOrder)
        placedOrders.push(newOrder)
      }
    })

    localStorage.setItem('mp_orders', JSON.stringify(orders))
    localStorage.setItem('mp_lastOrder', JSON.stringify(placedOrders[0]))
    // Save the IDs of the orders we just placed so the confirm page knows to show them all
    localStorage.setItem('mp_justPlaced', JSON.stringify(placedOrders.map(o => o.id)))
    clearCart()
    navigate('/order-confirm')
    
  }

  const typeIcon = (t) => t === 'bear' ? '🐻' : t === 'basket' ? '🎁' : '🌹'

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🛒 Your Cart</h2>
          <p className="text-gray-500">Review your items before placing your order</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center shadow-sm">
            <p className="text-6xl mb-4">🛒</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some beautiful flowers or book a bear delivery!</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => navigate('/catalog')}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-full transition"
              >
                Shop Flowers 🌹
              </button>
              <button
                onClick={() => navigate('/book-bear')}
                className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-semibold px-6 py-3 rounded-full transition"
              >
                Bear Delivery 🐻
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.cartId} className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm flex gap-4">

                  {/* Image */}
                  {item.image ? (
                    <img src={item.image} alt={item.product} className="w-24 h-24 object-cover rounded-xl" />
                  ) : (
                    <div className="w-24 h-24 bg-pink-100 rounded-xl flex items-center justify-center text-4xl">
                      {typeIcon(item.type)}
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{typeIcon(item.type)} {item.product}</h3>
                        <p className="text-pink-600 font-bold">
                          {typeof item.price === 'number' ? `BZD $${item.price}` : item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.cartId)}
                        className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-full transition"
                      >
                        🗑️ Remove
                      </button>
                    </div>

                    <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                      {item.recipient && <p>🎁 For: <strong>{item.recipient}</strong></p>}
                      {item.date && <p>📅 {item.date} {item.time && `· ⏰ ${item.time}`}</p>}
                      {item.deliveryType === 'pickup' ? (
                        <p>🏪 Pickup at shop</p>
                      ) : item.address ? (
                        <p>📍 {item.address}</p>
                      ) : null}
                      {item.flowerTypes?.length > 0 && (
                        <p>🌺 {item.flowerTypes.join(', ')}</p>
                      )}
                      {item.extras?.length > 0 && (
                        <p>✨ {item.extras.length} extra{item.extras.length > 1 ? 's' : ''} added</p>
                      )}
                      {item.basketItems?.length > 0 && (
                        <p>🎁 {item.basketItems.length} basket item{item.basketItems.length > 1 ? 's' : ''}</p>
                      )}
                      {item.song && <p>🎤 Song: "{item.song}"</p>}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <button
                        onClick={() => handleQty(item.cartId, (item.quantity || 1) - 1)}
                        className="w-7 h-7 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold"
                      >−</button>
                      <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                      <button
                        onClick={() => handleQty(item.cartId, (item.quantity || 1) + 1)}
                        className="w-7 h-7 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold"
                      >+</button>
                      {typeof item.price === 'number' && (
                        <span className="text-sm text-gray-500 ml-2">
                          Subtotal: <strong className="text-pink-600">BZD ${item.price * (item.quantity || 1)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total + Checkout */}
            <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className="text-3xl font-bold text-pink-600">BZD ${total}</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Custom gift baskets and some items may have a final price confirmed by our team after ordering.
              </p>
              <button
                onClick={handleCheckout}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-full transition text-lg"
              >
                ✅ Place Order
              </button>
              <button
                onClick={() => navigate('/catalog')}
                className="w-full mt-2 text-pink-600 hover:text-pink-800 font-semibold py-2 transition text-sm"
              >
                ← Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart