import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const bearPackages = [
  {
    id: 1,
    name: 'Package #1',
    price: 113,
    image: '/pck1.jpeg',
    includes: 'Magic Bear + umbrella/bubbles + foil balloon + small bouquet',
    hasSinger: false,
  },
  {
    id: 2,
    name: 'Package #2',
    price: 169,
    image: '/pkg2.jpeg',
    includes: 'Magic Bear + umbrella/bubbles + personalized bobo balloon + large bouquet',
    hasSinger: false,
  },
  {
    id: 3,
    name: 'Package #3',
    price: 225,
    image: '/PUT_IMAGE_NAME_HERE.jpeg',
    includes: 'Magic Bear + umbrella/bubbles + personalized balloon + big bouquet + solo singer',
    hasSinger: true,
  },
]

const BASKET_ITEMS = [
  '🧸 Stuffed Animal',
  '🍫 Chocolates',
  '🍭 Candy',
  '🎈 Extra Balloons',
  '📚 Storybook',
  '🎨 Coloring Kit',
  '🧩 Toys',
  '👕 Clothing',
  '🍼 Baby Items',
  '🎁 Small Gifts',
]

function BearBooking() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [recipient, setRecipient] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [address, setAddress] = useState('')
  const [song, setSong] = useState('')
  const [error, setError] = useState('')

  // Customization states
  const [showCustom, setShowCustom] = useState(false)
  const [basketItems, setBasketItems] = useState([])
  const [basketDescription, setBasketDescription] = useState('')

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')
  const today = new Date().toISOString().slice(0, 10)

  const toggleBasketItem = (item) => {
    setBasketItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const openPackage = (pkg) => {
    setSelected(pkg)
    setRecipient('')
    setDate('')
    setTime('')
    setAddress('')
    setSong('')
    setError('')
    setShowCustom(false)
    setBasketItems([])
    setBasketDescription('')
  }

  const handleBooking = () => {
    if (!session.email) {
      localStorage.setItem('mp_redirect', '/book-bear')
      navigate('/login')
      return
    }
    if (!recipient || !date || !time || !address) {
      setError('Please fill in all required fields.')
      return
    }
    if (selected.hasSinger && !song) {
      setError('Please enter a song request for the solo singer.')
      return
    }

    const orders = JSON.parse(localStorage.getItem('mp_orders') || '[]')
    const newOrder = {
      id: 'MP-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      ref: '#' + Math.floor(10000 + Math.random() * 90000),
      type: 'bear',
      product: selected.name,
      price: selected.price,
      includes: selected.includes,
      customer: session.name,
      customerEmail: session.email,
      recipient,
      date,
      time,
      address,
      song: selected.hasSinger ? song : null,
      basketItems,
      basketDescription,
      deliveryType: 'delivery',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem('mp_orders', JSON.stringify([...orders, newOrder]))
    localStorage.setItem('mp_lastOrder', JSON.stringify(newOrder))
    setSelected(null)
    navigate('/order-confirm')
  }

  return (
    <div className="min-h-screen bg-pink-50">

      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white px-6 py-10 text-center">
        <h2 className="text-3xl font-bold mb-2">Magic Bear Delivery</h2>
        <p className="text-pink-100 max-w-xl mx-auto">
          Make someone feel truly special with our unforgettable bear delivery experience!
        </p>
      </div>

      {/* Info banner */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="bg-pink-100 border border-pink-300 rounded-lg p-3 text-pink-800 text-sm">
           Want to add items for kids? Tap any package and hit <strong>Customize My Order</strong> to build a personalized gift basket on top of your package!
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">Choose Your Package</h3>
        <p className="text-gray-500 text-center mb-8">Tap a package to book</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bearPackages.map(pkg => (
            <div
              key={pkg.id}
              onClick={() => openPackage(pkg)}
              className={`bg-white rounded-2xl shadow border border-pink-100 overflow-hidden hover:shadow-xl transition cursor-pointer hover:-translate-y-1 ${pkg.id === 3 ? 'ring-2 ring-pink-400' : ''}`}
            >    

              <div className="bg-pink-100 h-72 overflow-hidden">
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" style={{objectPosition: 'center top'}} />
              </div>

              <div className="p-5">
                {pkg.id === 3 && (
                  <span className="inline-block text-xs bg-pink-600 text-white px-3 py-1 rounded-full font-semibold mb-2">
                    ⭐ Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-pink-800">🐻 {pkg.name}</h3>
                <p className="text-2xl font-bold text-pink-600 mt-1 mb-3">BZD ${pkg.price}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{pkg.includes}</p>
                <button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-full transition">
                  Book This Package →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selected && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: 'rgba(255, 182, 193, 0.45)', backdropFilter: 'blur(6px)' }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-800 to-pink-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="w-full pr-4">
                  <div className="overflow-hidden rounded-2xl mb-4">
                    <img src={selected.image} alt={selected.name} className="w-full h-56 object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold">🐻 {selected.name}</h3>
                  <p className="text-pink-200 text-sm mt-1">{selected.includes}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white text-2xl hover:opacity-70">✕</button>
              </div>
              <div className="text-3xl font-bold mt-3">BZD ${selected.price}</div>
            </div>

            <div className="p-6">

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Recipient */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Recipient's Name
                </label>
                <input
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="Who is receiving this?"
                  className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Delivery Address / Location
                </label>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Full delivery address"
                  className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              {/* Song Request — only for Package #3 */}
              {selected.hasSinger && (
                <div className="mb-4 bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-pink-700 mb-1">
                    🎤 Song Request for the Solo Singer
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Your solo singer will perform a song of your choice!
                  </p>
                  <input
                    value={song}
                    onChange={e => setSong(e.target.value)}
                    placeholder='e.g. "Perfect" by Ed Sheeran'
                    className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400 bg-white"
                  />
                </div>
              )}

              {/* Customize Toggle */}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="w-full border-2 border-pink-400 text-pink-600 font-semibold py-2 rounded-full mb-4 hover:bg-pink-50 transition"
              >
                {showCustom ? '✕ Hide Customization' : '✨ Customize My Order'}
              </button>

              {/* Customization Section */}
              {showCustom && (
                <div className="bg-pink-50 rounded-xl p-4 mb-4 border border-pink-200">
                  <h4 className="font-bold text-pink-700 mb-1">🎁 Build Your Gift Basket</h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Add kid-friendly items on top of your bear package. Pricing varies — our team will confirm the final total.
                  </p>

                  <p className="text-sm font-medium text-gray-600 mb-2">Pick items to add:</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {BASKET_ITEMS.map(item => (
                      <div
                        key={item}
                        onClick={() => toggleBasketItem(item)}
                        className={`border-2 rounded-lg p-2 cursor-pointer text-xs text-center transition ${
                          basketItems.includes(item)
                            ? 'border-pink-500 bg-pink-100 text-pink-700 font-semibold'
                            : 'border-gray-200 text-gray-600 hover:border-pink-300 bg-white'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      📝 Any other details?
                    </label>
                    <textarea
                      value={basketDescription}
                      onChange={e => setBasketDescription(e.target.value)}
                      placeholder="Favorite characters, colors, themes, specific items, age of recipient, etc."
                      className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 h-20"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleBooking}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-full transition text-lg"
              >
                🐻 Confirm Booking — BZD ${selected.price}
              </button>

              <p className="text-center text-xs text-gray-400 mt-2">
                Our team will contact you to confirm all details{basketItems.length > 0 || basketDescription ? ' and final price with customizations' : ''}
              </p>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default BearBooking