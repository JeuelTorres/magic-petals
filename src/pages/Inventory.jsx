import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'

const DEFAULT_INVENTORY = [
  { id: 1,  name: 'Red Eternal Roses',   stock: 25, threshold: 5 },
  { id: 2,  name: 'Pink Eternal Roses',  stock: 18, threshold: 5 },
  { id: 3,  name: 'White Eternal Roses', stock: 12, threshold: 5 },
  { id: 4,  name: 'Foil Balloons',       stock: 20, threshold: 5 },
  { id: 5,  name: 'Bobo Balloons',       stock: 10, threshold: 3 },
  { id: 6,  name: 'Magic Bears',         stock: 8,  threshold: 2 },
  { id: 7,  name: 'Ribbons',             stock: 50, threshold: 10 },
  { id: 8,  name: 'Gift Boxes',          stock: 15, threshold: 5 },
  { id: 9,  name: 'Chocolates',          stock: 30, threshold: 8 },
  { id: 10, name: 'Teddy Bears',         stock: 12, threshold: 3 },
  { id: 11, name: 'Coloring Kits',       stock: 8,  threshold: 3 },
  { id: 12, name: 'Natural Flowers',     stock: 40, threshold: 10 },
]

function Inventory() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', stock: '', threshold: '' })
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [toast, setToast] = useState('')
  const notifiedRef = useRef(new Set())

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
    const saved = JSON.parse(localStorage.getItem('mp_inventory') || 'null')
    setItems(saved || DEFAULT_INVENTORY)
    if (!saved) localStorage.setItem('mp_inventory', JSON.stringify(DEFAULT_INVENTORY))
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotifEnabled(true)
    }
  }, [])

  useEffect(() => {
    if (!notifEnabled) return
    items.forEach(item => {
      if (item.stock < item.threshold && !notifiedRef.current.has(item.id)) {
        new Notification('Magic Pettals — Low Stock', {
          body: `${item.name} is running low (${item.stock} left, threshold ${item.threshold}).`,
          icon: '/favicon.svg',
        })
        notifiedRef.current.add(item.id)
      }
      if (item.stock >= item.threshold) notifiedRef.current.delete(item.id)
    })
  }, [items, notifEnabled])

  const saveItems = (updated) => {
    setItems(updated)
    localStorage.setItem('mp_inventory', JSON.stringify(updated))
  }

  const updateStock = (id, value) => {
    saveItems(items.map(i => i.id === id ? { ...i, stock: Math.max(0, parseInt(value) || 0) } : i))
  }

  const updateThreshold = (id, value) => {
    saveItems(items.map(i => i.id === id ? { ...i, threshold: Math.max(0, parseInt(value) || 0) } : i))
  }

  const deleteItem = (id) => {
    if (!window.confirm('Remove this item from inventory?')) return
    saveItems(items.filter(i => i.id !== id))
    showToast('Item removed.')
  }

  const addItem = () => {
    if (!newItem.name.trim()) {
      showToast('Please enter an item name.')
      return
    }
    const item = {
      id: Date.now(),
      name: newItem.name.trim(),
      stock: parseInt(newItem.stock) || 0,
      threshold: parseInt(newItem.threshold) || 5,
    }
    saveItems([...items, item])
    setNewItem({ name: '', stock: '', threshold: '' })
    setShowAdd(false)
    showToast('Item added!')
  }

  const requestNotifications = () => {
    if (!('Notification' in window)) {
      showToast('Your browser does not support notifications.')
      return
    }
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setNotifEnabled(true)
        new Notification('Magic Pettals', {
          body: 'Inventory alerts are on!',
          icon: '/favicon.svg',
        })
      }
    })
  }

  const lowStockItems = items.filter(i => i.stock < i.threshold)
  const totalUnits = items.reduce((a, i) => a + i.stock, 0)

  return (
    <div className="min-h-screen bg-pink-50">
      <AdminNavbar />

      {toast && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg z-50 font-semibold animate-bounce">
          {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Inventory</h2>
            <p className="text-gray-500">Track stock levels and get low-stock alerts</p>
          </div>
          <div className="flex gap-2 items-center">
            {!notifEnabled ? (
              <button
                onClick={requestNotifications}
                className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 font-semibold px-4 py-2 rounded-full transition text-sm"
              >
                Enable Alerts
              </button>
            ) : (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-2 rounded-full font-semibold">
                Alerts On
              </span>
            )}
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition text-sm"
            >
              ➕ Add Item
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Items</p>
            <p className="text-3xl font-bold text-pink-600">{items.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Units</p>
            <p className="text-3xl font-bold text-pink-600">{totalUnits}</p>
          </div>
          <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase">Low Stock</p>
            <p className={`text-3xl font-bold ${lowStockItems.length > 0 ? 'text-red-500' : 'text-pink-600'}`}>
              {lowStockItems.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase">Healthy Items</p>
            <p className="text-3xl font-bold text-green-600">{items.length - lowStockItems.length}</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <p className="text-sm text-red-700 font-semibold">
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} need{lowStockItems.length === 1 ? 's' : ''} restocking.
            </p>
          </div>
        )}

        {/* Add Item Form */}
        {showAdd && (
          <div className="bg-white rounded-2xl border border-pink-200 shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-pink-700 mb-4">➕ Add New Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Item Name *</label>
                <input
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Yellow Eternal Roses"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Stock</label>
                <input
                  type="number"
                  value={newItem.stock}
                  onChange={e => setNewItem({ ...newItem, stock: e.target.value })}
                  placeholder="0"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  value={newItem.threshold}
                  onChange={e => setNewItem({ ...newItem, threshold: e.target.value })}
                  placeholder="5"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-pink-100">
              <button
                onClick={addItem}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition text-sm"
              >
                ✓ Add Item
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewItem({ name: '', stock: '', threshold: '' }) }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-full transition text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-pink-100 p-8 text-center">
            <p className="text-gray-500">No items yet. Click "Add Item" to start tracking inventory.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-pink-50 border-b border-pink-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Item</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Stock</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Threshold</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-pink-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const isLow = item.stock < item.threshold
                    return (
                      <tr key={item.id} className={`border-b border-pink-50 transition ${isLow ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-pink-50'}`}>
                        <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.stock}
                            onChange={e => updateStock(item.id, e.target.value)}
                            min="0"
                            className={`w-20 border rounded-lg px-2 py-1 text-sm text-center focus:outline-none ${isLow ? 'border-red-300 text-red-600 font-bold bg-red-50 focus:border-red-400' : 'border-pink-200 focus:border-pink-400'}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.threshold}
                            onChange={e => updateThreshold(item.id, e.target.value)}
                            min="0"
                            className="w-20 border border-pink-200 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:border-pink-400"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {isLow ? (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">Low Stock</span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">In Stock</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-xs bg-gray-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-pink-50 px-4 py-2 text-xs text-gray-500 border-t border-pink-100">
              {items.length} items · {lowStockItems.length} low stock · {totalUnits} total units
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Inventory