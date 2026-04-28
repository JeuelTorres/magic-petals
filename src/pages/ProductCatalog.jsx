import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { addToCart } from '../cart'
import { api } from '../api'

const EXTRAS = [
  { id: 'message',    label: '💌 Message Card',    desc: 'Add a personal message card',   question: 'What would you like written on the message card?', placeholder: 'e.g. "Happy Birthday! Love you so much 💕"', hasImage: false },
  { id: 'balloon',    label: '🎈 Foil Balloon',    desc: 'Add a festive foil balloon',    question: 'What should go on the foil balloon?',            placeholder: 'e.g. "Happy Birthday", "I Love You"',         hasImage: true  },
  { id: 'chocolates', label: '🍫 Chocolates',      desc: 'Add a box of chocolates',       question: 'What type of chocolates would you like?',        placeholder: 'e.g. Milk, Dark, Ferrero Rocher, Mixed',       hasImage: false },
  { id: 'teddy',      label: '🧸 Small Teddy Bear', desc: 'Add a cute small teddy bear',   question: 'Any preference for the teddy bear?',             placeholder: 'e.g. Color, size, style',                      hasImage: true  },
  { id: 'ribbon',     label: '🎀 Premium Ribbon',  desc: 'Upgrade to a premium ribbon',   question: 'What color or style ribbon would you like?',     placeholder: 'e.g. Red satin, White lace, Gold metallic',    hasImage: false },
  { id: 'box',        label: '📦 Gift Box',        desc: 'Present in a luxury gift box',  question: 'Any preference for the gift box?',               placeholder: 'e.g. Color, style, special requests',          hasImage: false },
]

const ROSE_COLORS = ['Red', 'Pink', 'White', 'Yellow', 'Purple', 'Mixed']

function ProductCatalog() {
  const navigate = useNavigate()
  const [bouquets, setBouquets] = useState([])
  const [naturalFlowers, setNaturalFlowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [showCustom, setShowCustom] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [streetVillage, setStreetVillage] = useState('')
  const [district, setDistrict] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [period, setPeriod] = useState('AM')
  const [notes, setNotes] = useState('')
  const [extras, setExtras] = useState([])
  const [extraDetails, setExtraDetails] = useState({})
  const [extraImages, setExtraImages] = useState({})
  const [inspoFile, setInspoFile] = useState(null)
  const [deliveryType, setDeliveryType] = useState('delivery')
  const [flowerTypes, setFlowerTypes] = useState([])
  const [customFlower, setCustomFlower] = useState('')
  const [roseColors, setRoseColors] = useState([])
  const [customMix, setCustomMix] = useState('')
  const [error, setError] = useState('')
  const [addedMsg, setAddedMsg] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  // Load products from backend when the page opens
  useEffect(() => {
    const load = async () => {
      try {
        const { products } = await api.getProducts()
        setBouquets(products.filter(p => p.category === 'eternal'))
        setNaturalFlowers(products.filter(p => p.category === 'natural'))
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
      }
      return [...prev, id]
    })
  }

  const updateExtraDetail = (id, value) => setExtraDetails(prev => ({ ...prev, [id]: value }))
  const updateExtraImage  = (id, file)  => setExtraImages(prev => ({ ...prev, [id]: file }))
  const toggleFlowerType = (type) => setFlowerTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  const toggleRoseColor = (color) => setRoseColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])

  const openCard = (b) => {
    setSelected(b)
    setShowCustom(false)
    setQuantity(1)
    setStreetVillage('')
    setDistrict('')
    setDate('')
    setTime('')
    setPeriod('AM')
    setNotes('')
    setExtras([])
    setExtraDetails({})
    setExtraImages({})
    setInspoFile(null)
    setDeliveryType('delivery')
    setFlowerTypes([])
    setCustomFlower('')
    setRoseColors([])
    setCustomMix('')
    setError('')
  }

const handleAddToCart = async () => {
    if (!date || !time) {
      setError('Please pick a date and time.')
      return
    }
    if (deliveryType === 'delivery' && (!streetVillage || !district)) {
      setError('Please enter both street/village and district.')
      return
    }
    setError('')

    try {
      // Upload extra images and get back filenames
      const extraImageFilenames = {}
      for (const extraId of Object.keys(extraImages)) {
        const file = extraImages[extraId]
        if (file) {
          const { filename } = await api.uploadImage(file)
          extraImageFilenames[extraId] = filename
        }
      }

      // Upload the inspo photo if there is one
      let inspoFilename = null
      if (inspoFile) {
        const { filename } = await api.uploadImage(inspoFile)
        inspoFilename = filename
      }

      const productName = selected.category === 'eternal'
        ? selected.roses_count + ' Roses (Eternal)'
        : selected.name + ' (Natural)'

      addToCart({
        type: 'bouquet',
        productId: selected.id,
        product: productName,
        price: Number(selected.price),
        image: selected.image,
        quantity,
        deliveryType,
        address: deliveryType === 'delivery' ? streetVillage + ', ' + district : '',        date,
        time: time + ' ' + period,
        notes,
        extras,
        extraDetails,
        extraImageFilenames,
        flowerTypes,
        customFlower,
        roseColors,
        customMix,
        hasInspo: !!inspoFile,
        inspoFilename,
      })

      setAddedMsg(' ' + quantity + ' × ' + productName + ' added to cart!')
      setSelected(null)
      setTimeout(() => setAddedMsg(''), 3000)
    } catch (err) {
      setError('Failed to upload image: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-pink-600 text-lg animate-pulse"> Loading flowers...</p>
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
        <h2 className="text-3xl font-bold mb-2">  Eternal Rose Bouquets</h2>
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
              <img src={b.image} alt={`${b.roses_count} Roses`} className="w-full h-full object-cover object-center" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-pink-800">{b.roses_count} Roses</h3>
              <p className="text-xs text-gray-400 mb-2">Tap to see details</p>
              <p className="text-lg font-bold text-pink-600">BZD ${b.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Natural Flowers Section */}
      <div className="max-w-6xl mx-auto px-6 mt-2 mb-10">
        <div className="bg-gradient-to-r from-pink-800 to-pink-400 text-white px-6 py-8 text-center rounded-2xl mb-6">
          <h2 className="text-3xl font-bold mb-2"> Natural Flower Bouquets</h2>
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
            <div className={`text-white p-6 rounded-t-2xl ${selected.category === 'eternal' ? 'bg-gradient-to-r from-pink-700 to-pink-500' : 'bg-gradient-to-r from-pink-800 to-pink-400'}`}>
              <div className="flex justify-between items-start">
                <div className="w-full pr-4">
                  <div className="overflow-hidden rounded-2xl mb-4">
                    <img src={selected.image} alt={selected.category === 'eternal' ? `${selected.roses_count} Eternal Roses` : selected.name} className="w-full h-56 object-cover object-center" />
                  </div>
                  <h3 className="text-2xl font-bold">{selected.category === 'eternal' ? `${selected.roses_count} Eternal Roses` : selected.name}</h3>
                  <p className="text-pink-200 text-sm mt-1">{selected.description}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white text-2xl hover:opacity-70">✕</button>
              </div>
              <div className="text-3xl font-bold mt-3">BZD ${selected.price}</div>
            </div>

            <div className="p-6">

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
                  {error}
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

              {/* Delivery or Pickup */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">How would you like to receive your order?</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div
                    onClick={() => setDeliveryType('delivery')}
                    className={`border-2 rounded-xl p-3 cursor-pointer text-center transition ${
                      deliveryType === 'delivery' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚗</div>
                    <div className="font-semibold text-sm text-gray-700">Delivery</div>
                  </div>
                  <div
                    onClick={() => setDeliveryType('pickup')}
                    className={`border-2 rounded-xl p-3 cursor-pointer text-center transition ${
                      deliveryType === 'pickup' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">🏪</div>
                    <div className="font-semibold text-sm text-gray-700">Pick Up</div>
                  </div>
                </div>

                    {deliveryType === 'delivery' && (
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
                )}
                {deliveryType === 'pickup' && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-sm text-pink-700">
                    📍 You can pick up your order at our shop. We will contact you when it is ready!
                  </div>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {deliveryType === 'pickup' ? 'Pickup Date' : 'Delivery Date'}
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
                    {deliveryType === 'pickup' ? 'Pickup Time' : 'Delivery Time'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="flex-1 border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                    />
                    <select
                      value={period}
                      onChange={e => setPeriod(e.target.value)}
                      className="border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 bg-white font-semibold"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

            {/* Rose Color — only for Eternal */}
              {selected.category === 'eternal' && (
                <div className="mb-4 bg-pink-50 border border-pink-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-pink-700 mb-2"> Choose Rose Color(s) — pick one or more</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {ROSE_COLORS.map(color => (
                      <div
                        key={color}
                        onClick={() => toggleRoseColor(color)}
                        className={`border-2 rounded-lg p-2 cursor-pointer text-xs text-center transition ${
                          roseColors.includes(color) ? 'border-pink-500 bg-pink-100 text-pink-700 font-semibold' : 'border-white text-gray-600 hover:border-pink-300 bg-white'
                        }`}
                      >
                        {color}
                      </div>
                    ))}
                  </div>

                  {/* Custom mix input — shows when Mixed is selected */}
                  {roseColors.includes('Mixed') && (
                    <div>
                      <p className="text-xs text-pink-700 font-semibold mb-1">Specify your mix (optional):</p>
                      <input
                        value={customMix}
                        onChange={e => setCustomMix(e.target.value)}
                        placeholder="e.g. 6 red and 6 pink, or rainbow style"
                        className="w-full border border-pink-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-pink-400 bg-white"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Flower Type — only for Natural */}
              {selected.category === 'natural' && (
                <div className="mb-4 bg-pink-50 border border-pink-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-pink-700 mb-2">Which flowers would you like?</p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {['Roses', 'Tulips', 'Sunflowers', 'Daisies', 'Lilies', 'Mixed'].map(type => (
                      <div
                        key={type}
                        onClick={() => toggleFlowerType(type)}
                        className={`border-2 rounded-lg p-2 cursor-pointer text-xs text-center transition ${
                          flowerTypes.includes(type) ? 'border-pink-500 bg-pink-100 text-pink-700 font-semibold' : 'border-white text-gray-600 hover:border-pink-300 bg-white'
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
                  <h4 className="font-bold text-pink-700 mb-3">Make It Special</h4>

                  <p className="text-sm font-medium text-gray-600 mb-2">Add extras:</p>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {EXTRAS.map(ex => (
                      <div key={ex.id}>
                        <div
                          onClick={() => toggleExtra(ex.id)}
                          className={`border-2 rounded-lg p-2 cursor-pointer text-xs transition ${
                            extras.includes(ex.id) ? 'border-pink-500 bg-pink-100 text-pink-700' : 'border-gray-200 text-gray-600 hover:border-pink-300 bg-white'
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
                                  <p className="text-xs text-green-600 mt-1">{extraImages[ex.id].name}</p>
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
                    {inspoFile && <p className="text-xs text-green-600 mt-1">Photo attached: {inspoFile.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Any other special requests?</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Color preferences, packaging style, anything you want!"
                      className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 h-16"
                    />
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-full transition text-lg"
              >
                Add to Cart — BZD ${selected.price * quantity}
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

export default ProductCatalog