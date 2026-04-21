import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">

        <Navbar />

      {/* HERO */}
      <div className="relative bg-pink-100 min-h-[90vh] flex items-center justify-center overflow-hidden">
       <img src="/Tulips.png" className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 object-cover pointer-events-none select-none -translate-x-36" />
       <img src="/Tulips.png" className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 object-cover pointer-events-none select-none scale-x-[-1] translate-x-36" />

        <div className="relative text-center px-6 max-w-3xl">
          <p className="text-pink-600 text-sm font-semibold tracking-widest uppercase mb-4">
            Belize's Premier Floral Studio
          </p>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-gray-800">
            The Gift of{' '}
            <span className="text-pink-600 italic">Flowers</span>
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Eternal roses that never fade, magical bear deliveries, and custom
            arrangements made with love — right here in Belize.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/catalog')}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-full transition text-lg shadow-md"
            >
              Shop Collection
            </button>
            <button
              onClick={() => navigate('/book-bear')}
              className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-semibold px-8 py-3 rounded-full transition text-lg"
            >
              Bear Delivery
            </button>
          </div>
        </div>
      </div>

      {/* WHY US */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-pink-600 text-sm font-semibold tracking-widest uppercase mb-2">Why Magic Petals</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-12">More than just flowers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Eternal Roses', desc: 'Our roses are preserved to last years — not days. Real flowers, real love, forever.' },
              { title: 'Magic Bear Delivery', desc: 'A surprise bear delivery experience unlike anything else in Belize. Unforgettable moments.' },
              { title: 'Fully Customizable', desc: 'Add message cards, balloons, chocolates, and more. Every order is made just for you.' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-pink-50 border border-pink-100 hover:border-pink-300 transition">
                <h3 className="text-xl font-bold text-pink-700 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED BOUQUETS */}
      <div className="py-20 px-6 bg-pink-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-pink-600 text-sm font-semibold tracking-widest uppercase mb-2">Our Collection</p>
            <h2 className="text-3xl font-bold text-gray-800">Featured Bouquets</h2>
            <p className="text-gray-400 text-sm mt-2">Handpicked favorites — tap to explore the full collection</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { roses: 12,  price: 75,  image: "/12.jpeg", label: 'Most Popular' },
              { roses: 25,  price: 141, image: "/25.jpeg", label: 'Best for Anniversaries' },
              { roses: 50,  price: 309, image: "/50.jpeg", label: 'Grand Gesture' },
              { roses: 100, price: 563, image: "/100.jpeg", label: 'Ultimate Romance' },
            ].map((b, i) => (
              <div
                key={i}
                onClick={() => navigate('/catalog')}
                className="bg-white rounded-xl border border-pink-100 overflow-hidden hover:shadow-lg transition cursor-pointer hover:-translate-y-1"
              >
                <div className="bg-pink-100 h-28 overflow-hidden">
                  <img src={b.image} alt={`${b.roses} Roses`} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <span className="text-xs text-pink-600 font-semibold">{b.label}</span>
                  <h3 className="font-bold text-gray-800 text-sm mt-1">{b.roses} Roses</h3>
                  <p className="text-pink-600 font-bold">BZD ${b.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/catalog')}
              className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-semibold px-8 py-3 rounded-full transition"
            >
              View All Bouquets →
            </button>
          </div>
        </div>
      </div>

      {/* BEAR DELIVERY SECTION */}
      <div className="py-20 px-6 bg-white">
  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
    <div className="bg-pink-100 rounded-3xl w-64 h-64 flex items-center justify-center flex-shrink-0 overflow-hidden">
      <img 
        src="/bear.jpeg" 
        alt="Magic Bear" 
        className="w-full h-full object-cover rounded-3xl" 
      />
    </div>
          <div className="flex-1">
            <p className="text-pink-600 text-sm font-semibold tracking-widest uppercase mb-2">Something Special</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">The Magic Bear Experience</h2>
            <p className="text-gray-500 mb-4 leading-relaxed">
              Imagine the look on their face when a Magic Bear shows up at their door
              with balloons, a bouquet, and a personalized message. We even offer a
              solo singer for the ultimate romantic surprise.
            </p>
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-3 bg-pink-50 rounded-xl px-4 py-3 text-sm text-gray-700">
                <span>🎈</span> <span><strong>Package #1</strong> — BZD $113 · Bear + balloon + small bouquet</span>
              </div>
              <div className="flex items-center gap-3 bg-pink-50 rounded-xl px-4 py-3 text-sm text-gray-700">
                <span>🎉</span> <span><strong>Package #2</strong> — BZD $169 · Bear + bobo balloon + large bouquet</span>
              </div>
              <div className="flex items-center gap-3 bg-pink-50 rounded-xl px-4 py-3 text-sm text-gray-700">
                <span>🎤</span> <span><strong>Package #3</strong> — BZD $225 · Bear + balloon + big bouquet + solo singer</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/book-bear')}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-full transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="py-20 px-6 bg-pink-50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-pink-600 text-sm font-semibold tracking-widest uppercase mb-2">Our Story</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Magic Pettals</h2>
          <div className="text-6xl mb-6">🌸</div>
          <p className="text-gray-500 leading-relaxed mb-4">
            Magic Petals was born from a simple belief — that flowers should last
            as long as the feelings they represent. Based right here in Belize, we
            specialize in eternal roses that never fade, and unforgettable delivery
            experiences that create memories for a lifetime.
          </p>
          <p className="text-gray-500 leading-relaxed">
            Every bouquet is handcrafted with care. Every delivery is designed to
            make someone feel truly special. Whether it's a birthday, anniversary,
            proposal, or just a Tuesday — we believe every moment deserves a little magic.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-gray-900 text-gray-400 py-10 px-6 text-center">
        <h3 className="text-white text-xl font-bold italic mb-2">🌸 Magic Petals</h3>
        <p className="text-sm mb-6">Eternal roses & bear delivery — Belize</p>
        <div className="flex justify-center gap-8 text-sm mb-6">
          <button onClick={() => navigate('/')} className="hover:text-white transition">Home</button>
          <button onClick={() => navigate('/catalog')} className="hover:text-white transition">Shop</button>
          <button onClick={() => navigate('/book-bear')} className="hover:text-white transition">Bear Delivery</button>
          <button onClick={() => navigate('/faq')} className="hover:text-white transition">FAQ</button>
          <button onClick={() => navigate('/login')} className="hover:text-white transition">Login</button>
        </div>
        <p className="text-xs text-gray-600">© 2025 Magic Petals. All rights reserved.</p>
      </div>

    </div>
  )
}

export default Home