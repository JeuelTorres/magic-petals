import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { api } from '../api'

function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [question, setQuestion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const { faqs } = await api.getFAQs()
        setFaqs(faqs)
      } catch (err) {
        console.error('Failed to load FAQs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadFaqs()
  }, [])

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('Please type your question.')
      return
    }

    try {
      await api.sendMessage({ name, email, question })
      setSubmitted(true)
      setName('')
      setEmail('')
      setQuestion('')
      setError('')
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white px-6 py-10 text-center">
        <h2 className="text-3xl font-bold mb-2">💬 Frequently Asked Questions</h2>
        <p className="text-pink-100">Got a question? We probably have an answer!</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* FAQ List */}
        {loading ? (
          <p className="text-center text-pink-600 animate-pulse">Loading FAQs...</p>
        ) : (
          <div className="space-y-3 mb-10">
            {faqs.map(faq => (
              <div key={faq.id} className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full px-5 py-4 text-left font-semibold text-gray-800 hover:bg-pink-50 transition flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  <span className="text-pink-600 text-2xl">{openId === faq.id ? '−' : '+'}</span>
                </button>
                {openId === faq.id && (
                  <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-pink-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Custom question form */}
        <div className="bg-white rounded-2xl shadow border border-pink-100 p-6">
          <h3 className="text-xl font-bold text-pink-700 mb-2">Still have a question?</h3>
          <p className="text-sm text-gray-500 mb-4">Send us your question and we'll get back to you!</p>

          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
              ✅ Your question has been sent! We'll reply soon. 🌸
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Your Name (optional)</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Your Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Your Question</label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400 h-24 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-full transition"
          >
            💌 Send Question
          </button>
        </div>
      </div>
    </div>
  )
}

export default FAQ