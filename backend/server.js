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
app.use(cors())                              // allow React to talk to backend
app.use(express.json({ limit: '10mb' }))     // understand JSON in requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))  // serve uploaded images

// Quick test route
app.get('/api/test', (req, res) => {
  res.json({ message: '🌸 Magic Pettals backend is alive!' })
})

// Start listening
app.listen(PORT, () => {
  console.log(`🌸 Backend running on http://localhost:${PORT}`)
})