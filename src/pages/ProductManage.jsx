import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
import { api } from '../api'

const UPLOADS_URL = 'http://localhost:3001/uploads/'

function ProductManage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [toast, setToast] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category_id: '',
    roses_count: '',
    includes: '',
    enabled: true,
  })

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    if (session.role !== 'admin') {
      navigate('/login')
      return
    }
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getAllProducts(),
        api.getCategories(),
      ])
      setProducts(prodRes.products)
      setCategories(catRes.categories)
    } catch (err) {
      console.error('Failed to load:', err)
    } finally {
      setLoading(false)
    }
  }

  const startAdd = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      image: '',
      category_id: categories[0]?.id || '',
      roses_count: '',
      includes: '',
      enabled: true,
    })
    setEditId(null)
    setShowForm(true)
  }

  const startEdit = (product) => {
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      image: product.image || '',
      category_id: product.category_id || '',
      roses_count: product.roses_count || '',
      includes: product.includes || '',
      enabled: !!product.enabled,
    })
    setEditId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { filename } = await api.uploadImage(file)
      setForm({ ...form, image: UPLOADS_URL + filename })
    } catch (err) {
      showToast('Failed to upload image: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.category_id) {
      showToast('Please fill in name, price, and category.')
      return
    }
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        category_id: parseInt(form.category_id),
        roses_count: form.roses_count ? parseInt(form.roses_count) : null,
      }
      if (editId) {
        await api.updateProduct(editId, data)
      } else {
        await api.addProduct(data)
      }
      showToast('Product saved!')
      setShowForm(false)
      setEditId(null)
      loadAll()
    } catch (err) {
      showToast('Failed to save: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    try {
      await api.deleteProduct(id)
      showToast('Product deleted.')
      loadAll()
    } catch (err) {
      showToast('Failed to delete: ' + err.message)
    }
  }

  const toggleEnabled = async (product) => {
    try {
      await api.updateProduct(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category_id: product.category_id,
        roses_count: product.roses_count,
        includes: product.includes,
        enabled: !product.enabled,
      })
      showToast(product.enabled ? 'Product hidden.' : 'Product is now visible.')
      loadAll()
    } catch (err) {
      showToast('Failed to update: ' + err.message)
    }
  }

  const filtered = products.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false
    if (!search) return true
    const s = search.toLowerCase()
    return p.name?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <AdminNavbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-pink-600 text-lg animate-pulse">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <AdminNavbar />

      {toast && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg z-50 font-semibold animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
            <p className="text-gray-500">Add, edit, or remove products from your shop</p>
          </div>
          <button
            onClick={startAdd}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition"
          >
            ➕ Add New Product
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-pink-200 shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-pink-700 mb-4">
              {editId ? '✏️ Edit Product' : '➕ Add New Product'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. 5 Roses"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category *</label>
                <select
                  value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 bg-white"
                >
                  <option value="">— Select Category —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Price (BZD) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="28.00"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Roses Count (eternal only)</label>
                <input
                  type="number"
                  value={form.roses_count}
                  onChange={e => setForm({ ...form, roses_count: e.target.value })}
                  placeholder="e.g. 5"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description shown to customers"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 h-20"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Includes (for bear packages)</label>
                <textarea
                  value={form.includes}
                  onChange={e => setForm({ ...form, includes: e.target.value })}
                  placeholder="e.g. Magic Bear + balloon + bouquet"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 h-16"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Product Image</label>
                <div className="flex items-center gap-3">
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-pink-200"
                    />
                  )}
                  <div className="flex-1">
                    <label className="cursor-pointer text-blue-600 underline text-sm">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    {uploading && <p className="text-xs text-pink-600 mt-1">⏳ Uploading...</p>}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={e => setForm({ ...form, enabled: e.target.checked })}
                  />
                  Visible to customers (uncheck to hide without deleting)
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-5 pt-4 border-t border-pink-100">
              <button
                onClick={handleSave}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition text-sm"
              >
                ✓ Save Product
              </button>
              <button
                onClick={() => { setShowForm(false); setEditId(null) }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-full transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">🔍 Search</label>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400 bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-pink-100 p-8 text-center">
            <p className="text-5xl mb-3">🌸</p>
            <p className="text-gray-500">
              {products.length === 0 ? 'No products yet. Click "Add New Product" to create one!' : 'No products match your search.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-pink-50 border-b border-pink-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Image</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Price</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-pink-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => (
                    <tr key={product.id} className="border-b border-pink-50 hover:bg-pink-50 transition">
                      <td className="px-4 py-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg border border-pink-100"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-pink-100 rounded-lg flex items-center justify-center text-2xl">
                            🌸
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-gray-400 max-w-md truncate">{product.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-semibold capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-pink-600">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {product.enabled ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Active</span>
                        ) : (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-semibold">Hidden</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end flex-wrap">
                          <button
                            onClick={() => toggleEnabled(product)}
                            className={'text-xs px-3 py-1 rounded-full transition ' + (product.enabled ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white')}
                          >
                            {product.enabled ? ' Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => startEdit(product)}
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-xs bg-gray-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-pink-50 px-4 py-2 text-xs text-gray-500 border-t border-pink-100">
              Showing {filtered.length} of {products.length} products
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProductManage