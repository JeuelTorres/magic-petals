// ════════════════════════════════════════════════
// FAQ ROUTES — /api/faqs
// ════════════════════════════════════════════════
const express = require('express')
const pool = require('../db')

const router = express.Router()

// GET /api/faqs — public (only enabled)
router.get('/', async (req, res) => {
  try {
    const [faqs] = await pool.query(
      'SELECT * FROM faqs WHERE enabled = TRUE ORDER BY display_order, id'
    )
    res.json({ faqs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load FAQs.' })
  }
})

// GET /api/faqs/all — admin (all FAQs)
router.get('/all', async (req, res) => {
  try {
    const [faqs] = await pool.query('SELECT * FROM faqs ORDER BY display_order, id')
    res.json({ faqs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load FAQs.' })
  }
})

// POST /api/faqs — add new
router.post('/', async (req, res) => {
  const { question, answer, display_order } = req.body
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required.' })
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO faqs (question, answer, display_order) VALUES (?, ?, ?)',
      [question, answer, display_order || 0]
    )
    res.json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add FAQ.' })
  }
})

// PUT /api/faqs/:id — update
router.put('/:id', async (req, res) => {
  const { question, answer, enabled, display_order } = req.body
  try {
    await pool.query(
      'UPDATE faqs SET question = ?, answer = ?, enabled = ?, display_order = ? WHERE id = ?',
      [question, answer, enabled ? 1 : 0, display_order || 0, req.params.id]
    )
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update FAQ.' })
  }
})

// DELETE /api/faqs/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM faqs WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete FAQ.' })
  }
})

module.exports = router