// ════════════════════════════════════════════════
// MESSAGE ROUTES — /api/messages
// ════════════════════════════════════════════════
const express = require('express')
const pool = require('../db')

const router = express.Router()

// GET /api/messages — admin views all
router.get('/', async (req, res) => {
  try {
    const [messages] = await pool.query('SELECT * FROM messages ORDER BY created_at DESC')
    res.json({ messages })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load messages.' })
  }
})

// POST /api/messages — customer submits
router.post('/', async (req, res) => {
  const { name, email, question, phone } = req.body
  if (!question) {
    return res.status(400).json({ error: 'Question is required.' })
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO messages (name, email, question) VALUES (?, ?, ?)',
      [name || 'Anonymous', email || '', question]
    )
    res.json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send message.' })
  }
})

// PATCH /api/messages/:id — mark answered
router.patch('/:id', async (req, res) => {
  const { answered } = req.body
  try {
    await pool.query('UPDATE messages SET answered = ? WHERE id = ?', [answered ? 1 : 0, req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update message.' })
  }
})

// DELETE /api/messages/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM messages WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete message.' })
  }
})

module.exports = router