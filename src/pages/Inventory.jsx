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
  const notifiedRef = useRef(new Set())

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  useEffect(() => {
    if (session.role !== 'admin') {
      navigate('/login')
      return
    }
    const saved = JSON.parse(localStorage.getItem('mp_inventory') || 'null')
    if (saved) {
      setItems(saved)
    } else {
      setItems(DEFAULT_INVENTORY)
      localStorage.setItem('mp_inventory', JSON.stringify(DEFAULT_INVENTORY))
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      setNotifEnabled(true)
    }
  }, [])

  // Notify when items go low
  useEffect(() => {
    if (!notifEnabled) return
    items.forEach(item => {
      if (item.stock < item.threshold && !notifiedRef.current.has(item.id)) {
        new Notification('⚠️ Magic Pettals — Low Stock', {
          body: `${item.name} is running low (${item.stock} left, threshold ${item.threshold}).`,
          icon: '/favicon.svg',
        })
        notifiedRef.current.add(item.id)
      }
      // If item gets restocked above threshold, clear the flag so it can notify again next time
      if (item.stock >= item.threshold) {
        notifiedRef.current.delete(item.id)
      }
    })
  }, [items, notifEnabled])

  const saveItems = (updated) => {
    setItems(updated)
    localStorage.setItem('mp_inventory', JSON.stringify(updated))
  }

  const updateStock = (id, value) => {
    const stock = parseInt(value) || 0
    saveItems(items.map(i => i.id === id ? { ...i, stock } : i))
  }

  const updateThreshold = (id, value) => {
    const threshold = parseInt(value) || 0
    saveItems(items.map(i => i.id === id ? { ...i, threshold } : i))
  }

  const deleteItem = (id) => {
    if (!window.confirm('Delete this item from inventory?')) return
    saveItems(items.filter(i => i.id !== id))
  }

  const addItem = () => {
    if (!newItem.name) return alert('Please enter an item name.')
    const item = {
      id: Date.now(),
      name: newItem.name,
      stock: parseInt(newItem.stock) || 0,
      threshold: parseInt(newItem.threshold) || 5,
    }
    saveItems([...items, item])
    setNewItem({ name: '', stock: '', threshold: '' })
    setShowAdd(false)
  }

  const requestNotifications = () => {
    if (!('Notification' in window)) {
      alert('Your browser does not support notifications.')
      return
    }
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setNotifEnabled(true)
        new Notification('🌸 Magic Pettals', {
          body: 'Inventory notifications are on! You will be alerted when items run low.',
          icon: '/favicon.svg',
        })
      }
    })
  }

  const lowStockCount = items.filter(i => i.stock < i.threshold).length

  return (
    <div className="min-h-screen bg-pink-50">

      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800"> Inventory Management</h2>
            <p className="text-gray-500">Track stock levels and get low-stock alerts</p>
          </div>

          <div className="flex gap-2">
            {!notifEnabled ? (
              <button
                onClick={requestNotifications}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition text-sm"
              >
                 Enable Alerts
              </button>
            ) : (
              <span className="bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full text-sm">
                 Alerts On
              </span>
            )}
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-5 py-2 rounded-full transition text-sm"
            >
              ➕ Add Item
            </button>
          </div>
        </div>

        {/* Low stock warning */}
        {lowStockCount > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 text-red-800">
             <strong>{lowStockCount} item{lowStockCount > 1 ? 's' : ''} {lowStockCount > 1 ? 'need' : 'needs'} restocking!</strong> Check the table below for items marked LOW STOCK.
          </div>
        )}

        {/* Add New Item Form */}
        {showAdd && (
          <div className="bg-white rounded-xl border border-pink-200 p-5 mb-6 shadow-sm">
            <h3 className="font-bold text-pink-800 mb-3">Add New Inventory Item</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                <input
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Yellow Eternal Roses"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                <input
                  type="number"
                  value={newItem.stock}
                  onChange={e => setNewItem({ ...newItem, stock: e.target.value })}
                  placeholder="0"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Low-Stock Threshold</label>
                <input
                  type="number"
                  value={newItem.threshold}
                  onChange={e => setNewItem({ ...newItem, threshold: e.target.value })}
                  placeholder="5"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
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

        {/* Inventory Table */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-pink-100 p-8 text-center">
            <p className="text-5xl mb-3"></p>
            <p className="text-gray-500">No inventory items yet. Click "Add Item" to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-pink-50 border-b border-pink-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Item Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Current Stock</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Low-Stock Threshold</th>
                    <th className="text-left px-4 py-3 font-semibold text-pink-700">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-pink-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => {
                    const isLow = item.stock < item.threshold
                    return (
                      <tr key={item.id} className={`border-b border-pink-50 transition ${isLow ? 'bg-red-50' : 'hover:bg-pink-50'}`}>
                        <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.stock}
                            onChange={e => updateStock(item.id, e.target.value)}
                            className={`w-24 border rounded-lg px-3 py-1 text-sm focus:outline-none ${
                              isLow
                                ? 'border-red-300 bg-white text-red-700 font-bold focus:border-red-400'
                                : 'border-pink-200 focus:border-pink-400'
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.threshold}
                            onChange={e => updateThreshold(item.id, e.target.value)}
                            className="w-20 border border-pink-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-pink-400"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {isLow ? (
                            <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                               LOW STOCK
                            </span>
                          ) : (
                            <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                              ✓ OK
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-xs bg-gray-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                          >
                             Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-pink-50 px-4 py-2 text-xs text-gray-500 border-t border-pink-100">
              {items.length} total items · {lowStockCount} low stock
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory