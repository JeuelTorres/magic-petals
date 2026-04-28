import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
import { api } from '../api'
import { sendAdminReminder } from '../email'
import { format12Hour } from '../timeUtils'

function Reminders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const notifiedRef = useRef(new Set())

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  useEffect(() => {
    if (session.role !== 'admin') {
      navigate('/login')
      return
    }
    loadOrders()

    if ('Notification' in window && Notification.permission === 'granted') {
      setNotifEnabled(true)
    }

    const interval = setInterval(loadOrders, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadOrders = async () => {
    try {
      const { orders: all } = await api.getAllOrders()
      const withDate = all.filter(o => o.date && o.status !== 'cancelled')
      setOrders(withDate)

      withDate.forEach(o => {
        if (isUrgent(o) && !notifiedRef.current.has(o.id)) {
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🌸 Magic Pettals — Urgent Delivery', {
              body: o.product + ' for ' + (o.recipient || o.customer) + ' at ' + (o.time || 'TBD'),
              icon: '/favicon.svg',
            })
          }
          // Email reminder to admin
          sendAdminReminder(o)
          notifiedRef.current.add(o.id)
        }
      })
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
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
          body: 'Notifications are on! You will be alerted about urgent deliveries.',
          icon: '/favicon.svg',
        })
      }
    })
  }

  const now = new Date()

  const getDeliveryDate = (o) => {
    const dateStr = o.date ? String(o.date).slice(0, 10) : ''
    return new Date(dateStr + 'T' + (o.time || '00:00'))
  }

  const isUrgent = (o) => {
    const delivery = getDeliveryDate(o)
    const diff = delivery - now
    return diff > 0 && diff < 24 * 60 * 60 * 1000
  }

  const isPast = (o) => getDeliveryDate(o) < now

  const urgent = orders.filter(isUrgent).sort((a, b) => getDeliveryDate(a) - getDeliveryDate(b))
  const upcoming = orders.filter(o => !isUrgent(o) && !isPast(o)).sort((a, b) => getDeliveryDate(a) - getDeliveryDate(b))

  const typeIcon = (o) => o.type === 'bear' ? '🐻' : o.type === 'basket' ? '🎁' : '🌹'

  const timeUntil = (o) => {
    const diff = getDeliveryDate(o) - now
    if (diff < 0) return 'Past'
    const hours = Math.floor(diff / (60 * 60 * 1000))
    const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    if (hours < 1) return 'in ' + mins + ' min'
    if (hours < 24) return 'in ' + hours + 'h ' + mins + 'm'
    const days = Math.floor(hours / 24)
    return 'in ' + days + ' day' + (days > 1 ? 's' : '')
  }

  const formatDate = (o) => {
    const d = getDeliveryDate(o)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50">
        <AdminNavbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-pink-600 text-lg animate-pulse">🔔 Loading reminders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pink-50">

      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">🔔 Delivery Reminders</h2>
            <p className="text-gray-500">All upcoming deliveries — sorted by date</p>
          </div>

          {!notifEnabled ? (
            <button
              onClick={requestNotifications}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition"
            >
              🔔 Enable Notifications
            </button>
          ) : (
            <span className="bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full text-sm">
              ✅ Notifications On
            </span>
          )}
        </div>

        {/* Notification info banner */}
        {!notifEnabled && (
          <div className="bg-pink-100 border border-pink-300 rounded-xl p-4 text-pink-800 text-sm mb-6">
            💡 <strong>Turn on notifications</strong> to get a ping whenever a delivery is within 24 hours — even when this tab is in the background!
          </div>
        )}

        {/* URGENT — BIG CARDS */}
        {urgent.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
              🚨 URGENT — Within 24 Hours
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{urgent.length}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urgent.map(order => (
                <div
                  key={order.id}
                  className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border-2 border-red-300 ring-2 ring-red-200 shadow-lg p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-4xl">{typeIcon(order)}</div>
                    <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                      ⚡ {timeUntil(order)}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-800 text-lg mb-1">{order.product}</h4>
                  <p className="text-sm text-gray-500 mb-3">{order.ref}</p>

                  <div className="space-y-1 text-sm text-gray-700 bg-white rounded-lg p-3 border border-red-100">
                    <p>📅 <strong>{formatDate(order)}</strong> at {format12Hour(order.time) || 'TBD'}</p>
                    <p>👤 {order.customer}{order.recipient ? ' → ' + order.recipient : ''}</p>
                    {order.deliveryType === 'pickup' ? (
                      <p>🏪 Pickup at shop</p>
                    ) : order.address ? (
                      <p>📍 {order.address}</p>
                    ) : null}
                    {order.customerPhone && <p>📞 {order.customerPhone}</p>}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-pink-600">${Number(order.price).toFixed(2)}</span>
                    <span className={'text-xs font-semibold px-2 py-1 rounded-full ' + (order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700')}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPCOMING — COMPACT LIST */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
            📅 Upcoming Deliveries
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">{upcoming.length}</span>
          </h3>

          {upcoming.length === 0 ? (
            <div className="bg-white rounded-xl border border-pink-100 p-6 text-center">
              <p className="text-gray-400 text-sm italic">No upcoming deliveries scheduled.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-pink-100 shadow-sm overflow-hidden">
              {upcoming.map((order, idx) => (
                <div
                  key={order.id}
                  className={'p-4 hover:bg-pink-50 transition flex items-center justify-between gap-3 flex-wrap ' + (idx !== upcoming.length - 1 ? 'border-b border-pink-100' : '')}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-2xl">{typeIcon(order)}</div>

                    <div className="text-sm text-center min-w-[70px] bg-pink-50 rounded-lg p-2">
                      <p className="font-bold text-pink-700 text-xs">{formatDate(order).split(',')[0]}</p>
                      <p className="text-gray-600 text-xs">{format12Hour(order.time) || 'TBD'}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{order.product}</p>
                      <p className="text-xs text-gray-500 truncate">
                        👤 {order.customer}{order.recipient ? ' → ' + order.recipient : ''}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {order.deliveryType === 'pickup' ? '🏪 Pickup' : (order.address ? '📍 ' + order.address : '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {timeUntil(order)}
                    </span>
                    <span className="font-bold text-pink-600">${Number(order.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Reminders