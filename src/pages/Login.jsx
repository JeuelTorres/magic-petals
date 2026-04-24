import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const { user } = await api.login(email, password)
      localStorage.setItem('mp_session', JSON.stringify(user))

      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        const redirect = localStorage.getItem('mp_redirect') || '/catalog'
        localStorage.removeItem('mp_redirect')
        navigate(redirect)
      }
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

        <h2 className="text-xl font-semibold text-gray-700 mb-4">Welcome Back</h2>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

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

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full border border-pink-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-400"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-full transition"
        >
          🌸 Log In
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-pink-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login