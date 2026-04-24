// ════════════════════════════════════════════════
// PRODUCT ROUTES — /api/products
// ════════════════════════════════════════════════
const express = require('express')
const pool = require('../db')

const router = express.Router()

// ─── GET ALL PRODUCTS ─────────────────────────────
// GET /api/products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.enabled,
        p.roses_count,
        p.includes,
        c.name AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.enabled = TRUE
      ORDER BY c.id, p.price
    `)
    res.json({ products })
  } catch (err) {
    console.error('Get products error:', err)
    res.status(500).json({ error: 'Failed to load products.' })
  }
})

// ─── GET PRODUCT BY ID ────────────────────────────
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name AS category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' })
    }
    res.json({ product: rows[0] })
  } catch (err) {
    console.error('Get product error:', err)
    res.status(500).json({ error: 'Failed to load product.' })
  }
})

module.exports = router