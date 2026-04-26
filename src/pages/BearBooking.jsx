import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { addToCart } from '../cart'
import { api } from '../api'

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
  const [bearPackages, setBearPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [recipient, setRecipient] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
const [streetVillage, setStreetVillage] = useState('')
  const [district, setDistrict] = useState('')  
  const [song, setSong] = useState('')
  const [error, setError] = useState('')
  const [addedMsg, setAddedMsg] = useState('')

  // Customization
  const [showCustom, setShowCustom] = useState(false)
  const [basketItems, setBasketItems] = useState([])
  const [basketDescription, setBasketDescription] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  // Load bear packages from backend
  useEffect(() => {
    const load = async () => {
      try {
        const { products } = await api.getProducts()
        setBearPackages(products.filter(p => p.category === 'bear'))
      } catch (err) {
        console.error('Failed to load bear packages:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleBasketItem = (item) => {
    setBasketItems(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item])
  }

  const openPackage = (pkg) => {
    setSelected(pkg)
    setQuantity(1)
    setRecipient('')
    setDate('')
    setTime('')
    setStreetVillage('')
    setDistrict('')
    setSong('')
    setError('')
    setShowCustom(false)
    setBasketItems([])
    setBasketDescription('')
  }

  const handleAddToCart = () => {
    if (!recipient || !date || !time || !streetVillage || !district) {
      setError('Please fill in all required fields.')
      return
    }
    // Package #3 is the one with the singer
    const hasSinger = selected.name === 'Package #3'
    if (hasSinger && !song) {
      setError('Please enter a song request for the solo singer.')
      return
    }

    addToCart({
      type: 'bear',
      productId: selected.id,
      product: selected.name,
      price: Number(selected.price),
      image: selected.image,
      includes: selected.includes,
      quantity,
      recipient,
      date,
      time,
      address: deliveryType === 'delivery' ? streetVillage + ', ' + district : '',
      song: hasSinger ? song : null,
      basketItems,
      basketDescription,
      deliveryType: 'delivery',
    })

    setAddedMsg(`✅ ${quantity} × ${selected.name} added to cart!`)
    setSelected(null)
    setTimeout(() => setAddedMsg(''), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-pink-600 text-lg animate-pulse">🐻 Loading bear packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">

      <Navbar />

      {/* Added to cart popup */}
      {addedMsg && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg z-50 font-semibold animate-bounce">
          {addedMsg}
        </div>
      )}

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
          🎁 Want to add items for kids? Tap any package and hit <strong>Customize My Order</strong> to build a personalized gift basket on top of your package!
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">Choose Your Package</h3>
        <p className="text-gray-500 text-center mb-8">Tap a package to book</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bearPackages.map(pkg => {
            const isMostPopular = pkg.name === 'Package #3'
            return (
              <div
                key={pkg.id}
                onClick={() => openPackage(pkg)}
                className={`bg-white rounded-2xl shadow border border-pink-100 overflow-hidden hover:shadow-xl transition cursor-pointer hover:-translate-y-1 ${isMostPopular ? 'ring-2 ring-pink-400' : ''}`}
              >
                <div className="bg-pink-100 aspect-square overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-5">
                  {isMostPopular && (
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
            )
          })}
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

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-xl"
                  >−</button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-xl"
                  >+</button>
                  <span className="text-sm text-gray-500 ml-2">
                    Subtotal: <strong className="text-pink-600">BZD ${selected.price * quantity}</strong>
                  </span>
                </div>
              </div>

              {/* Recipient */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Recipient's Name</label>
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
                  <label className="block text-sm font-medium text-gray-600 mb-1">Delivery Date</label>
                  <input
                    type="date"
                    value={date}
                    min={today}
                    onChange={e => setDate(e.target.value)}
                    className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Delivery Time</label>
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Delivery Address</label>
                <div className="space-y-2">
                  <input
                    value={streetVillage}
                    onChange={e => setStreetVillage(e.target.value)}
                    placeholder="Street and Village (e.g. 123 Main St, Trial Farm)"
                    className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                  />
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400 bg-white"
                  >
                    <option value="">— Select District —</option>
                    <option value="Belize">Belize</option>
                    <option value="Cayo">Cayo</option>
                    <option value="Corozal">Corozal</option>
                    <option value="Orange Walk">Orange Walk</option>
                    <option value="Stann Creek">Stann Creek</option>
                    <option value="Toledo">Toledo</option>
                  </select>
                </div>
              </div>

              {/* Song Request — only for Package #3 */}
              {selected.name === 'Package #3' && (
                <div className="mb-4 bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-pink-700 mb-1">
                    🎤 Song Request for the Solo Singer
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Your solo singer will perform a song of your choice!</p>
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
                    <label className="block text-sm font-medium text-gray-600 mb-1">📝 Any other details?</label>
                    <textarea
                      value={basketDescription}
                      onChange={e => setBasketDescription(e.target.value)}
                      placeholder="Favorite characters, colors, themes, specific items, age of recipient, etc."
                      className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 h-20"
                    />
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-full transition text-lg"
              >
                🛒 Add to Cart — BZD ${selected.price * quantity}
              </button>

              <p className="text-center text-xs text-gray-400 mt-2">
                You can review everything in your cart before placing your order
              </p>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default BearBooking