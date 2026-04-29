const express = require('express')
const router = express.Router()
const db = require('../db')

// GET all options with their values (admin)
router.get('/all', (req, res) => {
  db.query(
    `SELECT o.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT('id', v.id, 'value', v.value, 'extra_price', v.extra_price, 'enabled', v.enabled)
      ) as values_json
     FROM customization_options o
     LEFT JOIN customization_values v ON v.option_id = o.id
     GROUP BY o.id
     ORDER BY o.type, o.name`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      const result = rows.map(r => ({
        ...r,
        values: JSON.parse(r.values_json || '[]').filter(v => v.id !== null)
      }))
      res.json({ customizations: result })
    }
  )
})

// GET enabled only (customer-facing)
router.get('/', (req, res) => {
  db.query(
    `SELECT o.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT('id', v.id, 'value', v.value, 'extra_price', v.extra_price)
      ) as values_json
     FROM customization_options o
     LEFT JOIN customization_values v ON v.option_id = o.id AND v.enabled = 1
     WHERE o.enabled = 1
     GROUP BY o.id
     ORDER BY o.type, o.name`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      const result = rows.map(r => ({
        ...r,
        values: JSON.parse(r.values_json || '[]').filter(v => v.id !== null)
      }))
      res.json({ customizations: result })
    }
  )
})

// POST add new option
router.post('/options', (req, res) => {
  const { name, type, desc, question, placeholder, enabled } = req.body
  if (!name || !type) return res.status(400).json({ error: 'name and type are required' })
  db.query(
    'INSERT INTO customization_options (name, type, `desc`, question, placeholder, enabled) VALUES (?, ?, ?, ?, ?, ?)',
    [name, type, desc || '', question || '', placeholder || '', enabled !== false ? 1 : 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ id: result.insertId })
    }
  )
})

// PUT update option
router.put('/options/:id', (req, res) => {
  const { name, type, desc, question, placeholder, enabled } = req.body
  db.query(
    'UPDATE customization_options SET name=?, type=?, `desc`=?, question=?, placeholder=?, enabled=? WHERE id=?',
    [name, type, desc || '', question || '', placeholder || '', enabled ? 1 : 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ updated: true })
    }
  )
})

// DELETE option (cascades to values)
router.delete('/options/:id', (req, res) => {
  db.query('DELETE FROM customization_options WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ deleted: true })
  })
})

// POST add value to an option
router.post('/values', (req, res) => {
  const { option_id, value, extra_price, enabled } = req.body
  if (!option_id || !value) return res.status(400).json({ error: 'option_id and value are required' })
  db.query(
    'INSERT INTO customization_values (option_id, value, extra_price, enabled) VALUES (?, ?, ?, ?)',
    [option_id, value, extra_price || 0, enabled !== false ? 1 : 0],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ id: result.insertId })
    }
  )
})

// PUT update value
router.put('/values/:id', (req, res) => {
  const { value, extra_price, enabled } = req.body
  db.query(
    'UPDATE customization_values SET value=?, extra_price=?, enabled=? WHERE id=?',
    [value, extra_price || 0, enabled ? 1 : 0, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ updated: true })
    }
  )
})

// DELETE value
router.delete('/values/:id', (req, res) => {
  db.query('DELETE FROM customization_values WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ deleted: true })
  })
})

module.exports = router