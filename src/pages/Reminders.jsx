import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'

function Reminders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [notifEnabled, setNotifEnabled] = useState(false)
  const notifiedRef = useRef(new Set()) // remember which orders we already notified about

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  useEffect(() => {
    if (session.role !== 'admin') {
      navigate('/login')
      return
    }
    loadOrders()

    // Check current notification permission
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotifEnabled(true)
    }

    // Refresh the list every 60 seconds so urgent status stays accurate
    const interval = setInterval(loadOrders, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadOrders = () => {
    const all = JSON.parse(localStorage.getItem('mp_orders') || '[]')
    const withDate = all.filter(o => o.date && o.status !== 'cancelled')
    setOrders(withDate)

    // Fire notifications for urgent orders we haven't notified about yet
    if ('Notification' in window && Notification.permission === 'granted') {
      withDate.forEach(o => {
        if (isUrgent(o) && !notifiedRef.current.has(o.id)) {
          new Notification(' Magic Pettals — Urgent Delivery', {
            body: `${o.product} for ${o.recipient || o.customer} at ${o.time || 'TBD'} today!`,
            icon: '/favicon.svg',
          })
          notifiedRef.current.add(o.id)
        }
      })
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
        new Notification(' Magic Pettals', {
          body: 'Notifications are on! You will be alerted about urgent deliveries.',
          icon: '/favicon.svg',
        })
      }
    })
  }

  const now = new Date()

  const getDeliveryDate = (o) => {
    return new Date(`${o.date}T${o.time || '00:00'}`)
  }

  const isUrgent = (o) => {
    const delivery = getDeliveryDate(o)
    const diff = delivery - now
    return diff > 0 && diff < 24 * 60 * 60 * 1000
  }

  const isPast = (o) => {
    return getDeliveryDate(o) < now
  }

  const isUpcoming = (o) => {
    return !isUrgent(o) && !isPast(o)
  }

  const urgent = orders.filter(isUrgent).sort((a, b) => getDeliveryDate(a) - getDeliveryDate(b))
  const upcoming = orders.filter(isUpcoming).sort((a, b) => getDeliveryDate(a) - getDeliveryDate(b))
  const past = orders.filter(isPast).sort((a, b) => getDeliveryDate(b) - getDeliveryDate(a)) // newest first

  const typeIcon = (o) => {
    if (o.type === 'bear') return ''
    if (o.type === 'basket') return ''
    return '🌹'
  }

  const timeUntil = (o) => {
    const diff = getDeliveryDate(o) - now
    if (diff < 0) return 'Past'
    const hours = Math.floor(diff / (60 * 60 * 1000))
    const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    if (hours < 1) return `in ${mins} min`
    if (hours < 24) return `in ${hours}h ${mins}m`
    const days = Math.floor(hours / 24)
    return `in ${days} day${days > 1 ? 's' : ''}`
  }

  const ReminderCard = ({ order, variant }) => {
    const styles = {
      urgent: 'border-red-300 bg-red-50 ring-2 ring-red-200',
      upcoming: 'border-pink-200 bg-white',
      past: 'border-gray-200 bg-gray-50 opacity-75',
    }
    return (
      <div className={`rounded-xl border shadow-sm p-4 ${styles[variant]}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeIcon(order)}</span>
            <div>
              <p className="font-bold text-gray-800">{order.product}</p>
              <p className="text-xs text-gray-500">#{order.id}</p>
            </div>
          </div>
          {variant === 'urgent' && (
            <span className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
              ⚡ URGENT
            </span>
          )}
          {variant === 'upcoming' && (
            <span className="text-xs font-semibold bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
              {timeUntil(order)}
            </span>
          )}
          {variant === 'past' && (
            <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
              ✓ Done
            </span>
          )}
        </div>

        <div className="text-sm text-gray-600 space-y-1 ml-10">
          <p> <strong>{order.customer}</strong> {order.recipient && `→ ${order.recipient}`}</p>
          <p> {order.date} {order.time && `·  ${order.time}`}</p>
          {order.address && <p> {order.address}</p>}
          {typeof order.price === 'number' && (
            <p className="text-pink-600 font-semibold">BZD ${order.price}</p>
          )}
        </div>
      </div>
    )
  }

  const Section = ({ title, list, variant, emptyMsg }) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-3">
        {title} <span className="text-sm text-gray-400">({list.length})</span>
      </h3>
      {list.length === 0 ? (
        <p className="text-gray-400 text-sm italic bg-white rounded-lg border border-pink-100 p-4 text-center">
          {emptyMsg}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(o => <ReminderCard key={o.id} order={o} variant={variant} />)}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-pink-50">

      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Delivery Reminders</h2>
            <p className="text-gray-500">All upcoming and past deliveries</p>
          </div>

          {!notifEnabled ? (
            <button
              onClick={requestNotifications}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition flex items-center gap-2"
            >
               Enable Notifications
            </button>
          ) : (
            <span className="bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full text-sm flex items-center gap-2">
               Notifications On
            </span>
          )}
        </div>

        {/* Info about notifications */}
        {!notifEnabled && (
          <div className="bg-pink-100 border border-pink-300 rounded-xl p-4 text-pink-800 text-sm mb-6">
            <strong>Turn on notifications</strong> to get a ping whenever a delivery is within 24 hours — even when this tab is in the background!
          </div>
        )}

        {/* Urgent Banner */}
        {urgent.length > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 text-red-800">
            <strong>{urgent.length} delivery{urgent.length > 1 ? ' ies' : ''} within the next 24 hours!</strong> Get ready!
          </div>
        )}

        {/* Sections */}
        <Section
          title="Urgent — Within 24 Hours"
          list={urgent}
          variant="urgent"
          emptyMsg="No urgent deliveries right now."
        />

        <Section
          title="Upcoming Deliveries"
          list={upcoming}
          variant="upcoming"
          emptyMsg="No upcoming deliveries scheduled."
        />

        <Section
          title="Past Deliveries"
          list={past}
          variant="past"
          emptyMsg="No past deliveries yet."
        />

      </div>
    </div>
  )
}

export default Reminders