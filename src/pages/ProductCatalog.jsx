import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const bouquets = [
  { id: 1,  roses: 5,   price: 28,  image: "/5.jpeg", description: 'A sweet and intimate bouquet — perfect for a simple "thinking of you" moment.' },
  { id: 2,  roses: 7,   price: 35,  image: "/7.jpeg", description: 'A classic arrangement that says just enough without being too much.' },
  { id: 3,  roses: 10,  price: 60,  image: "/10.jpeg", description: 'Full and beautiful — great for birthdays, anniversaries, or just because.' },
  { id: 4,  roses: 12,  price: 75,  image: "/12.jpeg", description: 'A dozen roses — timeless and romantic. The classic love gesture.' },
  { id: 5,  roses: 15,  price: 84,  image: "/15.jpeg", description: 'A generous bouquet that makes a real statement when they open the door.' },
  { id: 6,  roses: 20,  price: 113, image: "/20.jpeg", description: 'Bold and lush — this one turns heads and melts hearts.' },
  { id: 7,  roses: 25,  price: 141, image: "/25.jpeg", description: 'Twenty-five reasons to smile. Stunning for any special occasion.' },
  { id: 8,  roses: 30,  price: 169, image: "/30.jpeg", description: 'A showstopper. Thirty eternal roses that will never wilt or fade.' },
  { id: 9,  roses: 35,  price: 197, image: "/35.jpeg", description: 'For when you really want to go all out. Absolutely breathtaking.' },
  { id: 10, roses: 40,  price: 225, image: "/40.jpeg", description: 'Forty roses — a grand romantic gesture they will never forget.' },
  { id: 11, roses: 45,  price: 253, image: "/45.jpeg", description: 'An extraordinary display of love and appreciation.' },
  { id: 12, roses: 50,  price: 309, image: "/50.jpeg", description: 'Fifty eternal roses. The ultimate bouquet for the most special person.' },
  { id: 13, roses: 100, price: 563, image: "/100.jpeg", description: 'One hundred roses. When words are simply not enough.' },
]

const naturalFlowers = [
  { id: 'nf1', name: 'Single Flower', price: 10,  image: '/1nf.jpeg', description: 'A single beautiful natural flower — simple, elegant, and heartfelt.' },
  { id: 'nf2', name: '6 Flowers',     price: 60,  image: '/6NF.jpeg', description: 'A lovely half-dozen natural flower bouquet, fresh and fragrant.' },
  { id: 'nf3', name: '12 Flowers',    price: 120, image: '/12NF.jpeg', description: 'A full dozen natural flowers — classic, stunning, and unforgettable.' },
  { id: 'nf4', name: 'Mix Bouquet',   price: 75,  image: '/MIX.jpeg', description: 'A beautiful mix of natural flowers, colorful and full of life.' },
]

const EXTRAS = [
  {
    id: 'message',
    label: '💌 Message Card',
    desc: 'Add a personal message card',
    question: 'What would you like written on the message card?',
    placeholder: 'e.g. "Happy Birthday! Love you so much 💕"',
    hasImage: false,
  },
  {
    id: 'balloon',
    label: '🎈 Foil Balloon',
    desc: 'Add a festive foil balloon',
    question: 'What should go on the foil balloon?',
    placeholder: 'e.g. "Happy Birthday", "I Love You", "Congratulations"',
    hasImage: true,
  },
  {
    id: 'chocolates',
    label: '🍫 Chocolates',
    desc: 'Add a box of chocolates',
    question: 'What type of chocolates would you like?',
    placeholder: 'e.g. Milk chocolate, Dark chocolate, Ferrero Rocher, Mixed assortment',
    hasImage: false,
  },
  {
    id: 'teddy',
    label: '🧸 Small Teddy Bear',
    desc: 'Add a cute small teddy bear',
    question: 'Any preference for the teddy bear?',
    placeholder: 'e.g. Color preference, size, or any specific style',
    hasImage: true,
  },
  {
    id: 'ribbon',
    label: '🎀 Premium Ribbon',
    desc: 'Upgrade to a premium satin ribbon',
    question: 'What color or style ribbon would you like?',
    placeholder: 'e.g. Red satin, White lace, Gold metallic',
    hasImage: false,
  },
  {
    id: 'box',
    label: '📦 Gift Box',
    desc: 'Present in a luxury gift box',
    question: 'Any preference for the gift box?',
    placeholder: 'e.g. Color, style, or any special requests for the box',
    hasImage: false,
  },
]

function ProductCatalog() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [showCustom, setShowCustom] = useState(false)
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [extras, setExtras] = useState([])
  const [extraDetails, setExtraDetails] = useState({})
  const [extraImages, setExtraImages] = useState({})
  const [inspoFile, setInspoFile] = useState(null)
  const [deliveryType, setDeliveryType] = useState('delivery')
  const [flowerTypes, setFlowerTypes] = useState([])
  const [customFlower, setCustomFlower] = useState('')

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  const toggleExtra = (id) => {
    setExtras(prev => {
      if (prev.includes(id)) {
        const newDetails = { ...extraDetails }
        const newImages = { ...extraImages }
        delete newDetails[id]
        delete newImages[id]
        setExtraDetails(newDetails)
        setExtraImages(newImages)
        return prev.filter(e => e !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const updateExtraDetail = (id, value) => {
    setExtraDetails(prev => ({ ...prev, [id]: value }))
  }

  const updateExtraImage = (id, file) => {
    setExtraImages(prev => ({ ...prev, [id]: file }))
  }

  const toggleFlowerType = (type) => {
    setFlowerTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  const openCard = (b) => {
    setSelected(b)
    setShowCustom(false)
    setAddress('')
    setNotes('')
    setExtras([])
    setExtraDetails({})
    setExtraImages({})
    setInspoFile(null)
    setDeliveryType('delivery')
    setFlowerTypes([])
    setCustomFlower('')
  }

  const handleOrder = () => {
    if (!session.email) {
      localStorage.setItem('mp_redirect', '/catalog')
      navigate('/login')
      return
    }
    if (deliveryType === 'delivery' && !address) {
      return alert('Please enter a delivery address.')
    }

    const orders = JSON.parse(localStorage.getItem('mp_orders') || '[]')
    const productName = selected.roses
      ? selected.roses + ' Roses (Eternal)'
      : selected.name + ' (Natural)'

    const newOrder = {
      id: 'MP-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      ref: '#' + Math.floor(10000 + Math.random() * 90000),
      type: 'bouquet',
      product: productName,
      price: selected.price,
      customer: session.name,
      customerEmail: session.email,
      deliveryType,
      address,
      notes,
      extras,
      extraDetails,
      flowerTypes,
      customFlower,
      hasInspo: !!inspoFile,
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem('mp_orders', JSON.stringify([...orders, newOrder]))
    localStorage.setItem('mp_lastOrder', JSON.stringify(newOrder))
    setSelected(null)
    setShowCustom(false)
    setExtras([])
    setExtraDetails({})
    setExtraImages({})
    setInspoFile(null)
    navigate('/order-confirm')
  }

  return (
    <div className="min-h-screen bg-pink-50">

      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white px-6 py-10 text-center">
        <h2 className="text-3xl font-bold mb-2">🌸 Eternal Rose Bouquets</h2>
        <p className="text-pink-100">Preserved forever — never fade, never wilt. Real roses, real love.</p>
      </div>

      {/* Banner */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="bg-pink-100 border border-pink-300 rounded-lg p-3 text-pink-800 text-sm">
          🌿 We also create <strong>Natural Flower Bouquets</strong> — scroll down to order fresh natural flowers!
        </div>
      </div>

      {/* Eternal Roses Grid */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bouquets.map(b => (
          <div
            key={b.id}
            onClick={() => openCard(b)}
            className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden hover:shadow-lg transition cursor-pointer hover:-translate-y-1"
          >
            <div className="bg-pink-50 h-52 overflow-hidden">
              <img src={b.image} alt={`${b.roses} Roses`} className="w-full h-full object-cover object-center" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-pink-800">{b.roses} Roses</h3>
              <p className="text-xs text-gray-400 mb-2">Tap to see details</p>
              <p className="text-lg font-bold text-pink-600">BZD ${b.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Natural Flowers Section */}
      <div className="max-w-6xl mx-auto px-6 mt-2 mb-10">
        <div className="bg-gradient-to-r from-pink-800 to-pink-400 text-white px-6 py-8 text-center rounded-2xl mb-6">
          <h2 className="text-3xl font-bold mb-2">🌺 Natural Flower Bouquets</h2>
          <p className="text-pink-100">Fresh, fragrant, and straight from nature — made with love.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {naturalFlowers.map(b => (
            <div
              key={b.id}
              onClick={() => openCard(b)}
              className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden hover:shadow-lg transition cursor-pointer hover:-translate-y-1"
            >
              <div className="bg-pink-50 h-52 overflow-hidden">
                <img src={b.image} alt={b.name} className="w-full h-full object-cover object-center" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-pink-800">{b.name}</h3>
                <p className="text-xs text-gray-400 mb-2">Tap to see details</p>
                <p className="text-lg font-bold text-pink-600">BZD ${b.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: 'rgba(255, 182, 193, 0.45)', backdropFilter: 'blur(6px)' }}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className={`text-white p-6 rounded-t-2xl ${selected.roses ? 'bg-gradient-to-r from-pink-700 to-pink-500' : 'bg-gradient-to-r from-pink-800 to-pink-400'}`}>
              <div className="flex justify-between items-start">
                <div className="w-full pr-4">
                  <div className="overflow-hidden rounded-2xl mb-4">
                    <img src={selected.image} alt={selected.roses ? `${selected.roses} Eternal Roses` : selected.name} className="w-full h-56 object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    {selected.roses ? `${selected.roses} Eternal Roses` : selected.name}
                  </h3>
                  <p className="text-pink-200 text-sm mt-1">{selected.description}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white text-2xl hover:opacity-70">✕</button>
              </div>
              <div className="text-3xl font-bold mt-3">BZD ${selected.price}</div>
            </div>

            <div className="p-6">

              {/* Delivery or Pickup */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  How would you like to receive your order?
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div
                    onClick={() => setDeliveryType('delivery')}
                    className={`border-2 rounded-xl p-3 cursor-pointer text-center transition ${
                      deliveryType === 'delivery' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚗</div>
                    <div className="font-semibold text-sm text-gray-700">Delivery</div>
                    <div className="text-xs text-gray-400">We come to you</div>
                  </div>
                  <div
                    onClick={() => setDeliveryType('pickup')}
                    className={`border-2 rounded-xl p-3 cursor-pointer text-center transition ${
                      deliveryType === 'pickup' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🏪</div>
                    <div className="font-semibold text-sm text-gray-700">Pick Up</div>
                    <div className="text-xs text-gray-400">Collect at our shop</div>
                  </div>
                </div>

                {deliveryType === 'delivery' && (
                  <input
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Street, Village, District"
                    className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                  />
                )}
                {deliveryType === 'pickup' && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-sm text-pink-700">
                    📍 You can pick up your order at our shop. We will contact you when it is ready!
                  </div>
                )}
              </div>

              {/* Flower Type Selection — only for Natural */}
              {!selected.roses && (
                <div className="mb-4 bg-pink-50 border border-pink-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-pink-700 mb-2">🌺 Which flowers would you like?</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {['Roses', 'Tulips', 'Sunflowers', 'Daisies', 'Lilies', 'Dahlias'].map(type => (
                      <div
                        key={type}
                        onClick={() => toggleFlowerType(type)}
                        className={`border-2 rounded-lg p-2 cursor-pointer text-xs text-center transition ${
                          flowerTypes.includes(type)
                            ? 'border-pink-500 bg-pink-100 text-pink-700 font-semibold'
                            : 'border-white text-gray-600 hover:border-pink-300 bg-white'
                        }`}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Want something else? Type it below:</p>
                  <input
                    value={customFlower}
                    onChange={e => setCustomFlower(e.target.value)}
                    placeholder="e.g. Orchids, Carnations, Hydrangeas..."
                    className="w-full border border-pink-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-pink-400 bg-white"
                  />
                </div>
              )}

              {/* Customize Toggle */}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className="w-full border-2 border-pink-400 text-pink-600 font-semibold py-2 rounded-full mb-4 hover:bg-pink-50 transition"
              >
                {showCustom ? '✕ Hide Customization' : 'Customize My Order'}
              </button>

              {/* Customization Section */}
              {showCustom && (
                <div className="bg-pink-50 rounded-xl p-4 mb-4 border border-pink-200">
                  <h4 className="font-bold text-pink-700 mb-3">✨ Make It Special</h4>

                  <p className="text-sm font-medium text-gray-600 mb-2">Add extras:</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {EXTRAS.map(ex => (
                      <div key={ex.id}>
                        <div
                          onClick={() => toggleExtra(ex.id)}
                          className={`border-2 rounded-lg p-2 cursor-pointer text-xs transition ${
                            extras.includes(ex.id)
                              ? 'border-pink-500 bg-pink-100 text-pink-700'
                              : 'border-gray-200 text-gray-600 hover:border-pink-300 bg-white'
                          }`}
                        >
                          <div className="font-semibold">{ex.label}</div>
                          <div className="text-gray-400">{ex.desc}</div>
                        </div>

                        {extras.includes(ex.id) && (
                          <div className="mt-2 bg-white border border-pink-200 rounded-lg p-3">
                            <p className="text-xs font-medium text-pink-700 mb-1">{ex.question}</p>
                            <textarea
                              value={extraDetails[ex.id] || ''}
                              onChange={e => updateExtraDetail(ex.id, e.target.value)}
                              placeholder={ex.placeholder}
                              className="w-full border border-pink-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-pink-400 h-14 resize-none"
                            />
                            {ex.hasImage && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">📸 Add a reference photo (optional)</p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => updateExtraImage(ex.id, e.target.files[0])}
                                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-pink-100 file:text-pink-700"
                                />
                                {extraImages[ex.id] && (
                                  <p className="text-xs text-green-600 mt-1">✅ {extraImages[ex.id].name}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      📸 General Inspiration Photo (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setInspoFile(e.target.files[0])}
                      className="w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-pink-100 file:text-pink-700 file:text-xs"
                    />
                    {inspoFile && (
                      <p className="text-xs text-green-600 mt-1">✅ Photo attached: {inspoFile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      📝 Any other special requests?
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Color preferences, packaging style, anything you want!"
                      className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 h-16"
                    />
                  </div>
                </div>
              )}

              {/* Order Button */}
              <button
                onClick={handleOrder}
                className={`w-full text-white font-bold py-3 rounded-full transition text-lg ${
                  selected.roses ? 'bg-pink-600 hover:bg-pink-700' : 'bg-pink-700 hover:bg-pink-800'
                }`}
              >
                Confirm Order — BZD ${selected.price}
              </button>

              <p className="text-center text-xs text-gray-400 mt-2">
                Our team will contact you to confirm all details
              </p>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductCatalog