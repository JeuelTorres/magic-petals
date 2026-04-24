import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirm) {
      setError('All fields are required.')
      return
    }
    if (!/^\d{7,}$/.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (digits only, at least 7 digits).')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    try {
      const { user } = await api.register({ name, email, phone, password })
      localStorage.setItem('mp_session', JSON.stringify(user))
      navigate('/catalog')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-pink-100">

        <h1 className="text-3xl font-bold text-center text-pink-700 mb-1">
          🌸 Magic Pettals
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          Eternal roses & bear delivery — Belize
        </p>

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Account</h2>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number (WhatsApp)</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 6011234 or 5016011234"
            className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
          />
          <p className="text-xs text-gray-400 mt-1">We'll use this to WhatsApp you when your order is ready.</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Choose a password"
            className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-full transition"
        >
          🌸 Create Account
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-pink-600 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>

      </div>
    </div>
  )
}

export default Register