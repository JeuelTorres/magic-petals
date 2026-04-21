import { useState } from 'react'
import Navbar from '../components/Navbar'

const FAQ_QA = {
  'What are your delivery hours?':
    'We deliver Monday through Saturday, from 9:00 AM to 6:00 PM. For bear delivery bookings, please schedule at least 24 hours in advance. Sunday deliveries may be available for an additional fee — please contact us for details.',
  'How much does the bear delivery cost?':
    'Our Magic Bear Delivery packages start at BZD $113 for Package #1, BZD $169 for Package #2, and BZD $225 for Package #3. Each package includes the Magic Bear, umbrella or bubbles, a balloon, and a bouquet. Package #3 also includes a solo singer!',
  'Can I customize my bouquet?':
    'Absolutely! We offer both Eternal Roses and natural flower bouquets. Natural flower bouquets can be customized with different flower types, colors, and arrangements. For children, we also offer personalized gift baskets. Just tap any product and hit the "Customize My Order" button!',
  'How far in advance should I book?':
    'We recommend booking bear delivery at least 24–48 hours in advance to ensure availability. For large bouquets (50+ roses) or special packages, 3–5 days advance notice is ideal. During peak seasons (Valentine\'s Day, Mother\'s Day), please book 1–2 weeks ahead.',
  'Do you deliver on Sundays?':
    'Sunday deliveries are available on request and may include an additional fee. Please reach out to us in advance to arrange a Sunday delivery.',
  'Can I cancel or change my order?':
    'Yes — orders can be cancelled or changed up to 24 hours before the scheduled delivery date. For changes closer to the delivery time, please contact us directly and we will do our best to accommodate.',
  'What payment methods do you accept?':
    'We accept cash, bank transfer, and mobile payment options. Payment details will be confirmed when our team contacts you after placing your order.',
}

function FAQ() {
  const [form, setForm] = useState({ name: '', email: '', question: '' })
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Keyword matcher — finds the best FAQ answer based on keywords in the question
  const findAnswer = (question) => {
    const q = question.toLowerCase()

    const topics = [
      {
        keywords: ['hour', 'time', 'open', 'close', 'when', 'schedule'],
        answer: FAQ_QA['What are your delivery hours?'],
      },
      {
        keywords: ['bear', 'package', 'singer', 'magic bear'],
        answer: FAQ_QA['How much does the bear delivery cost?'],
      },
      {
        keywords: ['custom', 'personalize', 'personalise', 'different flower', 'natural', 'basket'],
        answer: FAQ_QA['Can I customize my bouquet?'],
      },
      {
        keywords: ['advance', 'how early', 'how long before', 'how far', 'book ahead'],
        answer: FAQ_QA['How far in advance should I book?'],
      },
      {
        keywords: ['sunday', 'weekend'],
        answer: FAQ_QA['Do you deliver on Sundays?'],
      },
      {
        keywords: ['cancel', 'change', 'refund', 'modify', 'edit'],
        answer: FAQ_QA['Can I cancel or change my order?'],
      },
      {
        keywords: ['pay', 'payment', 'cash', 'transfer', 'card', 'credit'],
        answer: FAQ_QA['What payment methods do you accept?'],
      },
      {
        keywords: ['price', 'cost', 'how much', 'expensive', 'cheap'],
        answer: 'Our prices vary by product! Eternal rose bouquets start at BZD $28 for 5 roses and go up to BZD $563 for 100 roses. Bear delivery packages range from BZD $113 to BZD $225. Natural flowers and custom gift baskets are priced based on what you choose.',
      },
      {
        keywords: ['deliver', 'ship', 'location', 'where'],
        answer: 'We deliver all across Belize! Delivery fees may apply depending on the location. You can also pick up your order directly at our shop.',
      },
      {
        keywords: ['eternal', 'last', 'fade', 'preserve', 'long'],
        answer: 'Our eternal roses are specially preserved real roses that can last for years without wilting or fading. They are the perfect long-lasting gift!',
      },
      {
        keywords: ['contact', 'phone', 'number', 'whatsapp', 'message'],
        answer: 'The easiest way to reach us is right here — just ask a question on this page! After placing an order, our team will reach out to you directly to confirm all the details.',
      },
    ]

    for (const topic of topics) {
      if (topic.keywords.some(kw => q.includes(kw))) {
        return topic.answer
      }
    }

    return null
  }

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.question) return

    const isCommon = Object.keys(FAQ_QA).includes(form.question)

    if (isCommon) {
      setAnswer(FAQ_QA[form.question])
    } else {
      const smartAnswer = findAnswer(form.question)

      if (smartAnswer) {
        setAnswer(smartAnswer)
      } else {
        const messages = JSON.parse(localStorage.getItem('mp_messages') || '[]')
        messages.push({
          id: 'MSG-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
          name: form.name,
          email: form.email,
          question: form.question,
          date: new Date().toISOString(),
          answered: false,
        })
        localStorage.setItem('mp_messages', JSON.stringify(messages))
        setAnswer("Thanks for reaching out! We don't have a quick answer for that one, so our team will email you a personal reply soon at " + form.email + '.')
      }
    }

    setSubmitted(true)
  }

  const resetForm = () => {
    setSubmitted(false)
    setForm({ name: '', email: '', question: '' })
    setAnswer('')
  }

  return (
    <div className="min-h-screen bg-pink-50">

      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-700 to-pink-500 text-white px-6 py-10 text-center">
        <h2 className="text-3xl font-bold mb-2">FAQ & Help</h2>
        <p className="text-pink-100 max-w-xl mx-auto">
          Get instant answers to common questions about Magic Pettals
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Ask Question Card */}
        <div className="bg-white rounded-2xl shadow border border-pink-100 p-6 mb-8">
          {!submitted ? (
            <>
              <h3 className="text-xl font-bold text-pink-800 mb-1">Ask a Question</h3>
              <p className="text-gray-500 text-sm mb-4">Pick a common question or type your own</p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Your Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Your Question
                </label>
                <select
                  value={Object.keys(FAQ_QA).includes(form.question) ? form.question : ''}
                  onChange={e => setForm({ ...form, question: e.target.value })}
                  className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400 bg-white mb-2"
                >
                  <option value="">-- Pick a common question --</option>
                  {Object.keys(FAQ_QA).map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>

                <p className="text-xs text-gray-400 text-center my-2">— or —</p>

                <textarea
                  value={Object.keys(FAQ_QA).includes(form.question) ? '' : form.question}
                  onChange={e => setForm({ ...form, question: e.target.value })}
                  placeholder="Type your own question here..."
                  className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400 h-20"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!form.name || !form.email || !form.question}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 Get Answer
              </button>
            </>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700">
                 Hi <strong>{form.name}</strong>! Here's the answer to your question:
              </div>
              <p className="font-semibold text-gray-800 mb-2">Q: {form.question}</p>
              <div className="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-4 text-sm text-pink-900 leading-relaxed">
                💬 {answer}
              </div>
              <button
                onClick={resetForm}
                className="mt-4 border-2 border-pink-400 text-pink-600 hover:bg-pink-50 font-semibold px-5 py-2 rounded-full transition"
              >
                Ask Another Question
              </button>
            </>
          )}
        </div>

        {/* All FAQs Quick View */}
        <div className="bg-white rounded-2xl shadow border border-pink-100 p-6">
          <h3 className="text-xl font-bold text-pink-800 mb-4">All Frequently Asked Questions</h3>
          {Object.entries(FAQ_QA).map(([q, a]) => (
            <details key={q} className="mb-3 border-b border-pink-100 pb-3 last:border-b-0">
              <summary className="cursor-pointer font-semibold text-pink-700 text-sm hover:text-pink-800">
                {q}
              </summary>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>

      </div>
    </div>
  )
}

export default FAQ