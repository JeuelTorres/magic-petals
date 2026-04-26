// ════════════════════════════════════════════════
// MAGIC PETTALS BACKEND — main server file
// ════════════════════════════════════════════════
const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware — runs on every request
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))                            // allow React to talk to backend
app.use(express.json({ limit: '10mb' }))     // understand JSON in requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))  // serve uploaded images

// Quick test route
app.get('/api/test', (req, res) => {
  res.json({ message: '🌸 Magic Pettals backend is alive!' })
})

// Route groups
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/faqs', require('./routes/faqs'))
app.use('/api/messages', require('./routes/messages'))

// Start listening
app.listen(PORT, () => {
  console.log(`🌸 Backend running on http://localhost:${PORT}`)
})