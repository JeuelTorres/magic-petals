// ════════════════════════════════════════════════
// AUTH ROUTES — /api/auth/register, /api/auth/login
// ════════════════════════════════════════════════
const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../db')

const router = express.Router()

// ─── REGISTER ─────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body

  // Basic validation
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  try {
    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' })
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, 'customer']
    )

    // Return user data (WITHOUT the password!)
    res.json({
      user: {
        id: result.insertId,
        name,
        email,
        phone,
        role: 'customer',
      }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Something went wrong.' })
  }
})

// ─── LOGIN ────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter email and password.' })
  }

  try {
    // Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const user = users[0]

    // Compare password
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // Return user data (WITHOUT password!)
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Something went wrong.' })
  }
})

module.exports = router