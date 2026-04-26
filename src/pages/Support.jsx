import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar'
import { api } from '../api'

function Support() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('messages')
  const [messages, setMessages] = useState([])
  const [faqs, setFaqs] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ question: '', answer: '', display_order: 0, enabled: true })

  const session = JSON.parse(localStorage.getItem('mp_session') || '{}')

  useEffect(() => {
    if (session.role !== 'admin') {
      navigate('/login')
      return
    }
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [msgRes, faqRes] = await Promise.all([api.getMessages(), api.getAllFAQs()])
      setMessages(msgRes.messages)
      setFaqs(faqRes.faqs)
    } catch (err) {
      console.error('Failed to load:', err)
    }
  }

  const toggleAnswered = async (msg) => {
    await api.markMessageAnswered(msg.id, !msg.answered)
    loadAll()
  }

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return
    await api.deleteMessage(id)
    loadAll()
  }

  const sendEmail = (email) => {
    window.location.href = 'mailto:' + email
  }

  const startAdd = () => {
    setForm({ question: '', answer: '', display_order: faqs.length + 1, enabled: true })
    setEditId(null)
    setShowAdd(true)
  }

  const startEdit = (faq) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      display_order: faq.display_order,
      enabled: !!faq.enabled,
    })
    setEditId(faq.id)
    setShowAdd(true)
  }

  const saveFAQ = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      alert('Please fill in both question and answer.')
      return
    }
    try {
      if (editId) {
        await api.updateFAQ(editId, form)
      } else {
        await api.addFAQ(form)
      }
      setShowAdd(false)
      setEditId(null)
      loadAll()
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
  }

  const deleteFAQ = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return
    await api.deleteFAQ(id)
    loadAll()
  }

  const toggleEnabled = async (faq) => {
    await api.updateFAQ(faq.id, { ...faq, enabled: !faq.enabled })
    loadAll()
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <AdminNavbar />

      <div className="max-w-6xl mx-auto px-6 py-6">

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">💬 Support Center</h2>
          <p className="text-gray-500">Manage customer messages and FAQ content</p>
        </div>

        <div className="flex gap-2 border-b border-pink-200 mb-6">
          <button
            onClick={() => setTab('messages')}
            className={tab === 'messages' ? 'px-5 py-2 font-semibold text-sm border-b-2 border-pink-600 text-pink-600' : 'px-5 py-2 font-semibold text-sm text-gray-500 hover:text-pink-600'}
          >
            📨 Messages ({messages.filter(m => !m.answered).length})
          </button>
          <button
            onClick={() => setTab('faqs')}
            className={tab === 'faqs' ? 'px-5 py-2 font-semibold text-sm border-b-2 border-pink-600 text-pink-600' : 'px-5 py-2 font-semibold text-sm text-gray-500 hover:text-pink-600'}
          >
            ❓ FAQs ({faqs.length})
          </button>
        </div>

        {tab === 'messages' && messages.length === 0 && (
          <div className="bg-white rounded-xl border border-pink-100 p-8 text-center">
            <p className="text-5xl mb-3">📨</p>
            <p className="text-gray-500">No messages yet.</p>
          </div>
        )}

        {tab === 'messages' && messages.length > 0 && (
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={msg.answered ? 'bg-green-50 rounded-xl border border-green-200 shadow-sm p-5' : 'bg-white rounded-xl border border-pink-100 shadow-sm p-5'}>
                <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-gray-800">
                      👤 {msg.name && msg.name !== 'Anonymous' ? msg.name : 'Anonymous'}
                      {msg.answered && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">✓ Answered</span>
                      )}
                    </p>
                    {msg.email && <p className="text-xs text-gray-500">📧 {msg.email}</p>}
                    <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {msg.email && (
                      <button
                        onClick={() => sendEmail(msg.email)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition"
                      >
                        📧 Email Reply
                      </button>
                    )}
                    <button
                      onClick={() => toggleAnswered(msg)}
                      className={msg.answered ? 'text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full transition' : 'text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition'}
                    >
                      {msg.answered ? '↻ Mark Unanswered' : '✓ Mark Answered'}
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-xs bg-gray-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="bg-pink-50 rounded-lg p-3 mt-3">
                  <p className="text-sm text-gray-700">{msg.question}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'faqs' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={startAdd}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition text-sm"
              >
                ➕ Add New FAQ
              </button>
            </div>

            {showAdd && (
              <div className="bg-white rounded-xl border border-pink-200 p-5 mb-4 shadow-sm">
                <h3 className="font-bold text-pink-700 mb-3">{editId ? 'Edit FAQ' : 'New FAQ'}</h3>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                  <input
                    value={form.question}
                    onChange={e => setForm({ ...form, question: e.target.value })}
                    placeholder="Enter the question"
                    className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                  <textarea
                    value={form.answer}
                    onChange={e => setForm({ ...form, answer: e.target.value })}
                    placeholder="Type the answer here"
                    className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400 h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={form.display_order}
                      onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.enabled}
                        onChange={e => setForm({ ...form, enabled: e.target.checked })}
                      />
                      Visible to customers
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={saveFAQ}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-5 py-2 rounded-full transition text-sm"
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={() => { setShowAdd(false); setEditId(null) }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-5 py-2 rounded-full transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {faqs.length === 0 && (
              <div className="bg-white rounded-xl border border-pink-100 p-8 text-center">
                <p className="text-5xl mb-3">❓</p>
                <p className="text-gray-500">No FAQs yet. Click "Add New FAQ" to create one.</p>
              </div>
            )}

            {faqs.length > 0 && (
              <div className="space-y-3">
                {faqs.map(faq => (
                  <div
                    key={faq.id}
                    className={faq.enabled ? 'bg-white rounded-xl border border-pink-100 shadow-sm p-4' : 'bg-white rounded-xl border border-gray-200 opacity-60 shadow-sm p-4'}
                  >
                    <div className="flex justify-between items-start gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">#{faq.display_order}</span>
                          {!faq.enabled && (
                            <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full font-semibold">HIDDEN</span>
                          )}
                        </div>
                        <p className="font-bold text-gray-800">{faq.question}</p>
                        <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                      </div>

                      <div className="flex gap-1 flex-wrap">
                        <button
                          onClick={() => toggleEnabled(faq)}
                          className={faq.enabled ? 'text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full transition' : 'text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full transition'}
                        >
                          {faq.enabled ? '👁️ Hide' : '👁️ Show'}
                        </button>
                        <button
                          onClick={() => startEdit(faq)}
                          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteFAQ(faq.id)}
                          className="text-xs bg-gray-500 hover:bg-red-600 text-white px-3 py-1 rounded-full transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Support