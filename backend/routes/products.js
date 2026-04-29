// ════════════════════════════════════════════════
// PRODUCTS ROUTES — /api/products
// ════════════════════════════════════════════════
const express = require('express')
const pool = require('../db')

const router = express.Router()

// ─── GET ALL CATEGORIES (must be BEFORE /:id route!) ──
// GET /api/products/admin/categories
router.get('/admin/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY id')
    res.json({ categories: rows })
  } catch (err) {
    console.error('Get categories error:', err)
    res.status(500).json({ error: 'Failed to load categories.' })
  }
})

// ─── GET ALL PRODUCTS ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    const showAll = req.query.all === 'true'

    const sql = showAll
      ? `SELECT p.*, c.name AS category 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         ORDER BY p.id`
      : `SELECT p.*, c.name AS category 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.enabled = TRUE
         ORDER BY p.id`

    const [products] = await pool.query(sql)
    res.json({ products })
  } catch (err) {
    console.error('Get products error:', err)
    res.status(500).json({ error: 'Failed to load products.' })
  }
})

// ─── GET ONE PRODUCT ────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found.' })
    res.json({ product: rows[0] })
  } catch (err) {
    console.error('Get product error:', err)
    res.status(500).json({ error: 'Failed to load product.' })
  }
})

// ─── ADD NEW PRODUCT ──────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, category_id, roses_count, includes, enabled } = req.body

    if (!name || !price || !category_id) {
      return res.status(400).json({ error: 'Name, price, and category are required.' })
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, image, category_id, roses_count, includes, enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        price,
        image || null,
        category_id,
        roses_count || null,
        includes || null,
        enabled === false ? 0 : 1,
      ]
    )

    res.json({ id: result.insertId, message: 'Product added!' })
  } catch (err) {
    console.error('Add product error:', err)
    res.status(500).json({ error: 'Failed to add product.' })
  }
})

// ─── UPDATE PRODUCT ──────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, image, category_id, roses_count, includes, enabled } = req.body

    await pool.query(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, image = ?, category_id = ?, roses_count = ?, includes = ?, enabled = ?
       WHERE id = ?`,
      [
        name,
        description || null,
        price,
        image || null,
        category_id,
        roses_count || null,
        includes || null,
        enabled ? 1 : 0,
        req.params.id,
      ]
    )

    res.json({ message: 'Product updated!' })
  } catch (err) {
    console.error('Update product error:', err)
    res.status(500).json({ error: 'Failed to update product.' })
  }
})

// ─── DELETE PRODUCT ──────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
    res.json({ message: 'Product deleted!' })
  } catch (err) {
    console.error('Delete product error:', err)
    res.status(500).json({ error: 'Failed to delete product. It may be referenced in existing orders.' })
  }
})

module.exports = router