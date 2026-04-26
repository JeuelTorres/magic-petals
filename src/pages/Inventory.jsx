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
    const stock = Math.max(0, parseInt(value) || 0)
    saveItems(items.map(i => i.id === id ? { ...i, stock } : i))
  }

  const updateThreshold = (id, value) => {
    const threshold = Math.max(0, parseInt(value) || 0)
    saveItems(items.map(i => i.id === id ? { ...i, threshold } : i))
  }

  const deleteItem = (id) => {
    if (!window.confirm('Remove this item from inventory?')) return
    saveItems(items.filter(i => i.id !== id))
  }

  const addItem = () => {
    if (!newItem.name.trim()) return alert('Please enter an item name.')
    const item = {
      id: Date.now(),
      name: newItem.name.trim(),
      stock: parseInt(newItem.stock) || 0,
      threshold: parseInt(newItem.threshold) || 5,
    }
    saveItems([...items, item])
    setNewItem({ name: '', stock: '', threshold: '' })
    setShowAdd(false)
  }

  const requestNotifications = () => {
    if (!('Notification' in window)) return alert('Your browser does not support notifications.')
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setNotifEnabled(true)
        new Notification('Magic Pettals', {
          body: 'Inventory alerts are on. You will be notified when items run low.',
          icon: '/favicon.svg',
        })
      }
    })
  }

  const lowStockItems = items.filter(i => i.stock < i.threshold)
  const totalUnits = items.reduce((a, i) => a + i.stock, 0)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        .inv-wrap * { box-sizing: border-box; }
        .inv-wrap { font-family: 'DM Sans', sans-serif; }

        .inv-stat { background:#fdf4f6; border-radius:14px; padding:1.1rem 1.3rem; transition:transform 0.15s; }
        .inv-stat:hover { transform:translateY(-2px); }
        .inv-stat-label { font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:#a17085; margin-bottom:6px; }
        .inv-stat-num { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:600; line-height:1; color:#2c1420; }
        .inv-stat-num.warn { color:#b91c1c; }

        .inv-alert { background:#fff1f2; border:0.5px solid #fecdd3; border-radius:12px; padding:12px 18px; display:flex; align-items:center; gap:10px; margin-bottom:1.5rem; }
        .inv-alert-dot { width:8px; height:8px; border-radius:50%; background:#e11d48; flex-shrink:0; animation:inv-pulse 1.5s infinite; }
        @keyframes inv-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .inv-alert span { font-size:13px; color:#9f1239; font-weight:500; }

        .inv-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; border-radius:100px; font-size:12px; font-weight:500; letter-spacing:0.05em; cursor:pointer; border:none; transition:all 0.15s; font-family:'DM Sans',sans-serif; text-transform:uppercase; }
        .inv-btn-primary { background:#8B3A52; color:#fff; }
        .inv-btn-primary:hover { background:#6d2e41; }
        .inv-btn-ghost { background:transparent; color:#6b5560; border:0.5px solid #d9b8c2; }
        .inv-btn-ghost:hover { background:#fdf4f6; }
        .inv-btn-notif-on { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; background:#f0fdf4; border:0.5px solid #bbf7d0; border-radius:100px; font-size:12px; font-weight:500; color:#15803d; letter-spacing:0.04em; text-transform:uppercase; }

        .inv-add-form { background:#fdf4f6; border:0.5px solid #e8c8d0; border-radius:14px; padding:1.4rem 1.5rem; margin-bottom:1.5rem; animation:inv-slidedown 0.2s ease; }
        @keyframes inv-slidedown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .inv-add-form h3 { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; color:#2c1420; margin-bottom:1rem; }
        .inv-field label { display:block; font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:#a17085; margin-bottom:5px; }
        .inv-field input { width:100%; padding:9px 13px; border:0.5px solid #d9b8c2; border-radius:8px; font-size:13px; background:#fff; color:#2c1420; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.15s; }
        .inv-field input:focus { border-color:#8B3A52; }

        .inv-table-wrap { background:#fff; border:0.5px solid #e8c8d0; border-radius:14px; overflow:hidden; }
        .inv-table { width:100%; border-collapse:collapse; font-size:13px; }
        .inv-table thead tr { border-bottom:0.5px solid #f0dce2; background:#fdf4f6; }
        .inv-table thead th { padding:13px 16px; text-align:left; font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:#a17085; }
        .inv-table thead th:last-child { text-align:right; }
        .inv-table tbody tr { border-bottom:0.5px solid #f7edf0; transition:background 0.1s; }
        .inv-table tbody tr:last-child { border-bottom:none; }
        .inv-table tbody tr:hover { background:#fdf4f6; }
        .inv-table tbody tr.low-row { background:#fff8f8; }
        .inv-table tbody tr.low-row:hover { background:#fff1f2; }
        .inv-table td { padding:12px 16px; color:#2c1420; }
        .inv-table td:last-child { text-align:right; }
        .inv-item-name { font-weight:500; }

        .inv-num-input { width:72px; padding:6px 10px; border:0.5px solid #d9b8c2; border-radius:7px; font-size:13px; text-align:center; background:#fff; color:#2c1420; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.15s; }
        .inv-num-input:focus { border-color:#8B3A52; }
        .inv-num-input.low { border-color:#fca5a5; color:#b91c1c; font-weight:600; background:#fff8f8; }

        .inv-badge { display:inline-flex; align-items:center; padding:4px 11px; border-radius:100px; font-size:11px; font-weight:500; letter-spacing:0.03em; }
        .inv-badge-ok { background:#f0fdf4; color:#15803d; }
        .inv-badge-low { background:#fff1f2; color:#be123c; }

        .inv-del-btn { padding:5px 14px; font-size:11px; border-radius:100px; background:transparent; border:0.5px solid #d9b8c2; color:#a17085; cursor:pointer; font-family:'DM Sans',sans-serif; letter-spacing:0.04em; transition:all 0.15s; }
        .inv-del-btn:hover { background:#fff1f2; border-color:#fca5a5; color:#be123c; }

        .inv-table-footer { padding:10px 16px; font-size:11px; color:#a17085; border-top:0.5px solid #f0dce2; background:#fdf4f6; letter-spacing:0.05em; text-transform:uppercase; }

        .inv-empty { background:#fff; border:0.5px solid #e8c8d0; border-radius:14px; padding:4rem 2rem; text-align:center; }
        .inv-empty-label { font-family:'Cormorant Garamond',serif; font-size:2.5rem; font-style:italic; color:#d9b8c2; margin-bottom:0.75rem; }
        .inv-empty p { font-size:14px; color:#a17085; }
      `}</style>

      <div className="min-h-screen bg-pink-50 inv-wrap">
        <AdminNavbar />

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
            <div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2.4rem', fontWeight:600, color:'#2c1420', letterSpacing:'-0.02em', lineHeight:1 }}>
                Inventory
              </h2>
              <p style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em', color:'#a17085', fontWeight:400, marginTop:6 }}>
                Stock levels &amp; low-stock alerts
              </p>
            </div>
            <div className="flex gap-2 items-center">
              {!notifEnabled ? (
                <button className="inv-btn inv-btn-ghost" onClick={requestNotifications}>Enable alerts</button>
              ) : (
                <span className="inv-btn-notif-on">
                  <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#15803d"/></svg>
                  Alerts on
                </span>
              )}
              <button className="inv-btn inv-btn-primary" onClick={() => setShowAdd(!showAdd)}>
                + Add item
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:'2rem' }}>
            <div className="inv-stat">
              <div className="inv-stat-label">Total items</div>
              <div className="inv-stat-num">{items.length}</div>
            </div>
            <div className="inv-stat">
              <div className="inv-stat-label">Total units</div>
              <div className="inv-stat-num">{totalUnits}</div>
            </div>
            <div className="inv-stat">
              <div className="inv-stat-label">Low stock</div>
              <div className={`inv-stat-num${lowStockItems.length > 0 ? ' warn' : ''}`}>{lowStockItems.length}</div>
            </div>
            <div className="inv-stat">
              <div className="inv-stat-label">Healthy items</div>
              <div className="inv-stat-num">{items.length - lowStockItems.length}</div>
            </div>
          </div>

          {/* Alert Bar */}
          {lowStockItems.length > 0 && (
            <div className="inv-alert">
              <div className="inv-alert-dot" />
              <span>
                {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} need{lowStockItems.length === 1 ? 's' : ''} restocking — see highlighted rows below.
              </span>
            </div>
          )}

          {/* Add Item Form */}
          {showAdd && (
            <div className="inv-add-form">
              <h3>New inventory item</h3>
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:10, marginBottom:'1rem' }}>
                <div className="inv-field">
                  <label>Item name</label>
                  <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Yellow Eternal Roses" />
                </div>
                <div className="inv-field">
                  <label>Stock</label>
                  <input type="number" value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} placeholder="0" />
                </div>
                <div className="inv-field">
                  <label>Threshold</label>
                  <input type="number" value={newItem.threshold} onChange={e => setNewItem({ ...newItem, threshold: e.target.value })} placeholder="5" />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="inv-btn inv-btn-primary" onClick={addItem}>Add item</button>
                <button className="inv-btn inv-btn-ghost" onClick={() => { setShowAdd(false); setNewItem({ name:'', stock:'', threshold:'' }) }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Table */}
          {items.length === 0 ? (
            <div className="inv-empty">
              <div className="inv-empty-label">Empty</div>
              <p>Click "Add item" to start tracking your inventory.</p>
            </div>
          ) : (
            <div className="inv-table-wrap">
              <div style={{ overflowX:'auto' }}>
                <table className="inv-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Stock</th>
                      <th>Threshold</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const isLow = item.stock < item.threshold
                      return (
                        <tr key={item.id} className={isLow ? 'low-row' : ''}>
                          <td className="inv-item-name">{item.name}</td>
                          <td>
                            <input type="number" className={`inv-num-input${isLow ? ' low' : ''}`} value={item.stock} onChange={e => updateStock(item.id, e.target.value)} min="0" />
                          </td>
                          <td>
                            <input type="number" className="inv-num-input" value={item.threshold} onChange={e => updateThreshold(item.id, e.target.value)} min="0" />
                          </td>
                          <td>
                            {isLow
                              ? <span className="inv-badge inv-badge-low">Low stock</span>
                              : <span className="inv-badge inv-badge-ok">In stock</span>
                            }
                          </td>
                          <td>
                            <button className="inv-del-btn" onClick={() => deleteItem(item.id)}>Remove</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="inv-table-footer">
                {items.length} items · {lowStockItems.length} low stock · {totalUnits} total units
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default Inventory