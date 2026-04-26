import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
import { api } from '../api'

const UPLOADS_URL = 'http://localhost:3001/uploads/'

function OrderManage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  useEffect(() => {
    if (session.role !== 'admin') {
      navigate('/login')
      return
    }
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const { orders } = await api.getAllOrders()
      setOrders(orders)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await api.updateOrderStatus(id, newStatus)
      loadOrders()
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order permanently? This cannot be undone.')) return
    try {
      await api.deleteOrder(id)
      loadOrders()
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  const sendWhatsApp = (order) => {
    if (!order.customerPhone) {
      alert('No phone number on file for this customer.')
      return
    }

    let message = ''
    if (order.status === 'pending') {
      message = 'Hi ' + order.customer + '! This is Magic Pettals. We received your order ' + order.ref + ' for ' + order.product + '. We will contact you shortly to confirm all the details. Thank you!'
    } else if (order.status === 'active') {
      message = 'Hi ' + order.customer + '! Your order ' + order.ref + ' is being prepared and will be ' + (order.deliveryType === 'pickup' ? 'ready for pickup' : 'delivered') + ' soon!'
    } else if (order.status === 'completed') {
      message = 'Hi ' + order.customer + '! Your order ' + order.ref + ' is ready! Thank you for choosing Magic Pettals!'
    } else {
      message = 'Hi ' + order.customer + '! This is Magic Pettals regarding your order ' + order.ref + '.'
    }

    let phone = order.customerPhone.replace(/\D/g, '')
    if (!phone.startsWith('501') && phone.length <= 8) {
      phone = '501' + phone
    }

    const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message)
    window.open(url, '_blank')
  }

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    if (!search) return true
    const s = search.toLowerCase()
    return (
      o.customer?.toLowerCase().includes(s) ||
      String(o.date || '').includes(s) ||
      String(o.ref || '').toLowerCase().includes(s) ||
      String(o.product || '').toLowerCase().includes(s)
    )
  })

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return (
      <span className={'text-xs font-semibold px-3 py-1 rounded-full ' + colors[status]}>
        {status?.toUpperCase()}
      </span>
    )
  }

  const typeIcon = (t) => t === 'bear' ? '' : t === 'basket' ? '' : ' '

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <AdminNavbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-pink-600 text-lg animate-pulse">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-6 py-6">

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Order Management</h2>
          <p className="text-gray-500">Click on any order to see full customization details</p>
        </div>

        <div className="bg-white rounded-xl border border-pink-100 p-4 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Search</label>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Customer, date, order ref, product..."
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Status</label>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400 bg-white"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-pink-100 p-8 text-center">
            <p className="text-5xl mb-3"></p>
            <p className="text-gray-500">
              {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const isOpen = expanded === order.id
              return (
                <div key={order.id} className="bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden hover:shadow-md transition">

                  <div onClick={() => setExpanded(isOpen ? null : order.id)} className="p-4 cursor-pointer hover:bg-pink-50 transition">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-3xl">{typeIcon(order.type)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-800 truncate">{order.product}</p>
                          <p className="text-xs text-gray-500">
                            <strong>{order.customer}</strong> · {order.ref}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.date ? new Date(order.date).toLocaleDateString() : '—'}
                            {order.time && ' · ' + order.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-pink-600 text-lg">${Number(order.price).toFixed(2)}</span>
                        <StatusBadge status={order.status} />
                        <span className="text-pink-600 text-2xl font-bold">{isOpen ? '−' : '+'}</span>
                      </div>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t border-pink-100 p-5 bg-pink-50">

                      <div className="bg-white rounded-lg p-4 mb-4 border border-pink-100">
                        <p className="text-xs text-gray-400 font-semibold mb-2">CUSTOMER INFO</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="font-semibold">{order.customer}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-gray-700">{order.customerEmail || '—'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-gray-700">{order.customerPhone || '—'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4 border border-pink-100">
                        <p className="text-xs text-gray-400 font-semibold mb-2">DELIVERY INFO</p>
                        <div className="text-sm space-y-2">
                          <p><strong>{order.deliveryType === 'pickup' ? 'Pickup at Shop' : 'Delivery'}</strong></p>
                          {order.deliveryType !== 'pickup' && order.address && (
                            <p>{order.address}</p>
                          )}
                          {order.recipient && (
                            <p>Recipient: <strong>{order.recipient}</strong></p>
                          )}
                          <p>
                            {order.date ? new Date(order.date).toLocaleDateString() : '—'}
                            {order.time && ' · ' + order.time}
                          </p>
                        </div>
                      </div>

                      {order.customizations && order.customizations.length > 0 && (
                        <div className="bg-white rounded-lg p-4 mb-4 border border-pink-100">
                          <p className="text-xs text-gray-400 font-semibold mb-3">CUSTOMIZATIONS</p>
                          <div className="space-y-3">
                            {order.customizations.map((c, idx) => (
                              <div key={idx} className="border-l-4 border-pink-300 pl-3">
                                <p className="text-sm text-gray-700">{c.custom_text || '—'}</p>
                                {c.image_path && (
                                  <div className="mt-2">
                                    <img
                                      src={UPLOADS_URL + c.image_path}
                                      alt="Customer reference"
                                      onClick={() => window.open(UPLOADS_URL + c.image_path, '_blank')}
                                      className="w-32 h-32 object-cover rounded-lg border border-pink-200 hover:opacity-80 transition cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Click to enlarge</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.song && (
                        <div className="bg-white rounded-lg p-4 mb-4 border border-pink-100">
                          <p className="text-xs text-gray-400 font-semibold mb-1">SONG REQUEST</p>
                          <p className="text-sm italic">"{order.song}"</p>
                        </div>
                      )}

                      {order.notes && (
                        <div className="bg-white rounded-lg p-4 mb-4 border border-pink-100">
                          <p className="text-xs text-gray-400 font-semibold mb-1">SPECIAL REQUESTS</p>
                          <p className="text-sm">{order.notes}</p>
                        </div>
                      )}

                      {order.customFlower && (
                        <div className="bg-white rounded-lg p-4 mb-4 border border-pink-100">
                          <p className="text-xs text-gray-400 font-semibold mb-1">CUSTOM FLOWER REQUEST</p>
                          <p className="text-sm">{order.customFlower}</p>
                        </div>
                      )}

                      {order.basketDescription && (
                        <div className="bg-white rounded-lg p-4 mb-4 border border-pink-100">
                          <p className="text-xs text-gray-400 font-semibold mb-1">BASKET DETAILS</p>
                          <p className="text-sm">{order.basketDescription}</p>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap pt-2 border-t border-pink-200">
                        {order.status === 'pending' && (
                          <button onClick={() => updateStatus(order.id, 'active')} className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition font-semibold">
                            Confirm Order
                          </button>
                        )}
                        {order.status === 'active' && (
                          <button onClick={() => updateStatus(order.id, 'completed')} className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition font-semibold">
                            Mark Complete
                          </button>
                        )}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button onClick={() => updateStatus(order.id, 'cancelled')} className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition font-semibold">
                            Cancel
                          </button>
                        )}
                        {order.status === 'cancelled' && (
                          <button onClick={() => updateStatus(order.id, 'pending')} className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full transition font-semibold">
                            Reopen
                          </button>
                        )}
                        <button onClick={() => sendWhatsApp(order)} className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition font-semibold">
                          WhatsApp Customer
                        </button>
                        <button onClick={() => deleteOrder(order.id)} className="text-sm bg-gray-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition font-semibold">
                          Delete
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="text-xs text-gray-400 mt-4">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>
    </div>
  )
}

export default OrderManage