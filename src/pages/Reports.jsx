import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'

function Reports() {
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [report, setReport] = useState(null)

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  useEffect(() => {
    if (session.role !== 'admin') {
      navigate('/login')
      return
    }
    // Default to last 30 days on page load
    const today = new Date()
    const thirtyAgo = new Date()
    thirtyAgo.setDate(today.getDate() - 30)
    setStartDate(thirtyAgo.toISOString().slice(0, 10))
    setEndDate(today.toISOString().slice(0, 10))
  }, [])

  // Quick range buttons
  const setQuickRange = (range) => {
    const today = new Date()
    const start = new Date()

    if (range === 'last7') {
      start.setDate(today.getDate() - 7)
    } else if (range === 'last30') {
      start.setDate(today.getDate() - 30)
    } else if (range === 'month') {
      start.setDate(1)
    } else if (range === 'year') {
      start.setMonth(0, 1)
    } else if (range === 'all') {
      start.setFullYear(2000, 0, 1)
    }

    setStartDate(start.toISOString().slice(0, 10))
    setEndDate(today.toISOString().slice(0, 10))
  }

  const generateReport = () => {
    const allOrders = JSON.parse(localStorage.getItem('mp_orders') || '[]')

    // Filter by date range AND exclude cancelled
    const filtered = allOrders.filter(o => {
      if (o.status === 'cancelled') return false
      if (!o.date) return false
      return (!startDate || o.date >= startDate) && (!endDate || o.date <= endDate)
    })

    // Count by type
    const bearOrders = filtered.filter(o => o.type === 'bear')
    const bouquetOrders = filtered.filter(o => o.type === 'bouquet')
    const basketOrders = filtered.filter(o => o.type === 'basket')

    // Count by status
    const byStatus = {
      pending: filtered.filter(o => o.status === 'pending').length,
      active: filtered.filter(o => o.status === 'active').length,
      completed: filtered.filter(o => o.status === 'completed').length,
    }

    // Revenue (only numeric prices)
    const revenue = filtered
      .filter(o => typeof o.price === 'number')
      .reduce((sum, o) => sum + o.price, 0)

    // Most popular bouquet
    const bouquetCounts = {}
    bouquetOrders.forEach(o => {
      bouquetCounts[o.product] = (bouquetCounts[o.product] || 0) + 1
    })
    const popularBouquet = Object.entries(bouquetCounts).sort((a, b) => b[1] - a[1])[0]

    // Most popular bear package
    const bearCounts = {}
    bearOrders.forEach(o => {
      bearCounts[o.product] = (bearCounts[o.product] || 0) + 1
    })
    const popularBear = Object.entries(bearCounts).sort((a, b) => b[1] - a[1])[0]

    // Top customers
    const customerCounts = {}
    filtered.forEach(o => {
      if (!o.customer) return
      customerCounts[o.customer] = (customerCounts[o.customer] || 0) + 1
    })
    const topCustomers = Object.entries(customerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    setReport({
      total: filtered.length,
      bouquet: bouquetOrders.length,
      bear: bearOrders.length,
      basket: basketOrders.length,
      byStatus,
      revenue,
      popularBouquet: popularBouquet ? popularBouquet[0] : 'N/A',
      popularBouquetCount: popularBouquet ? popularBouquet[1] : 0,
      popularBear: popularBear ? popularBear[0] : 'N/A',
      popularBearCount: popularBear ? popularBear[1] : 0,
      topCustomers,
      generated: new Date().toLocaleString(),
      from: startDate,
      to: endDate,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-pink-50 print:bg-white">

      <div className="print:hidden">
        <AdminNavbar />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Header */}
        <div className="mb-6 print:hidden">
          <h2 className="text-3xl font-bold text-gray-800"> Sales Reports</h2>
          <p className="text-gray-500">Filter by date range to generate a report</p>
        </div>

        {/* Filter Card */}
        <div className="bg-white rounded-xl border border-pink-100 p-5 shadow-sm mb-6 print:hidden">

          {/* Quick Range Buttons */}
          <label className="block text-sm font-medium text-gray-600 mb-2">Quick Ranges</label>
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setQuickRange('last7')}  className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold px-4 py-2 rounded-full transition">Last 7 Days</button>
            <button onClick={() => setQuickRange('last30')} className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold px-4 py-2 rounded-full transition">Last 30 Days</button>
            <button onClick={() => setQuickRange('month')}  className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold px-4 py-2 rounded-full transition">This Month</button>
            <button onClick={() => setQuickRange('year')}   className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold px-4 py-2 rounded-full transition">This Year</button>
            <button onClick={() => setQuickRange('all')}    className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold px-4 py-2 rounded-full transition">All Time</button>
          </div>

          {/* Date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          <button
            onClick={generateReport}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-full transition"
          >
             Generate Report
          </button>
        </div>

        {/* Report */}
        {report && (
          <div className="bg-white rounded-xl border border-pink-100 shadow-sm p-6 print:shadow-none print:border-0">

            {/* Printable header */}
            <div className="flex justify-between items-start flex-wrap gap-3 mb-6 border-b border-pink-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-pink-800">Magic Pettals — Sales Report</h3>
                <p className="text-sm text-gray-500">Period: {report.from} → {report.to}</p>
                <p className="text-xs text-gray-400">Generated: {report.generated}</p>
              </div>
              <button
                onClick={handlePrint}
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-5 py-2 rounded-full transition text-sm print:hidden"
              >
                 Print Report
              </button>
            </div>

            {report.total === 0 ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-3"></p>
                <p className="text-gray-500">No orders in this date range.</p>
              </div>
            ) : (
              <>
                {/* Main Stats */}
                <h4 className="text-lg font-bold text-gray-700 mb-3">Overview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 font-semibold">TOTAL ORDERS</p>
                    <p className="text-3xl font-bold text-pink-600 mt-1">{report.total}</p>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 font-semibold"> BOUQUETS</p>
                    <p className="text-3xl font-bold text-pink-600 mt-1">{report.bouquet}</p>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 font-semibold"> BEAR DELIVERIES</p>
                    <p className="text-3xl font-bold text-pink-600 mt-1">{report.bear}</p>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-500 font-semibold"> GIFT BASKETS</p>
                    <p className="text-3xl font-bold text-pink-600 mt-1">{report.basket}</p>
                  </div>
                </div>

                {/* Revenue */}
                <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white rounded-xl p-6 mb-8">
                  <p className="text-sm font-semibold opacity-80"> REVENUE ESTIMATE</p>
                  <p className="text-4xl font-bold mt-1">BZD ${report.revenue.toLocaleString()}</p>
                  <p className="text-xs opacity-75 mt-2">Based on {report.total} orders — excludes cancelled orders and custom-priced items.</p>
                </div>

                {/* By Status */}
                <h4 className="text-lg font-bold text-gray-700 mb-3">Orders by Status</h4>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-yellow-700 font-semibold">PENDING</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{report.byStatus.pending}</p>
                  </div>
                  <div className="border border-green-200 bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-green-700 font-semibold">ACTIVE</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{report.byStatus.active}</p>
                  </div>
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-blue-700 font-semibold">COMPLETED</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{report.byStatus.completed}</p>
                  </div>
                </div>

                {/* Popular Items */}
                <h4 className="text-lg font-bold text-gray-700 mb-3">Popular Products</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="border border-pink-200 rounded-xl p-4 bg-white">
                    <p className="text-xs text-gray-500 font-semibold mb-1"> MOST POPULAR BOUQUET</p>
                    <p className="font-bold text-pink-700 text-lg">{report.popularBouquet}</p>
                    {report.popularBouquetCount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Ordered {report.popularBouquetCount} time{report.popularBouquetCount > 1 ? 's' : ''}</p>
                    )}
                  </div>
                  <div className="border border-pink-200 rounded-xl p-4 bg-white">
                    <p className="text-xs text-gray-500 font-semibold mb-1"> MOST POPULAR BEAR PACKAGE</p>
                    <p className="font-bold text-pink-700 text-lg">{report.popularBear}</p>
                    {report.popularBearCount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">Booked {report.popularBearCount} time{report.popularBearCount > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>

                {/* Top Customers */}
                {report.topCustomers.length > 0 && (
                  <>
                    <h4 className="text-lg font-bold text-gray-700 mb-3"> Top Customers</h4>
                    <div className="bg-pink-50 rounded-xl p-4">
                      {report.topCustomers.map(([name, count], i) => (
                        <div key={name} className="flex justify-between items-center py-2 border-b border-pink-100 last:border-b-0">
                          <span className="font-semibold text-gray-700">
                            {['', '', ''][i]} {name}
                          </span>
                          <span className="text-pink-600 font-bold text-sm">
                            {count} order{count > 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports