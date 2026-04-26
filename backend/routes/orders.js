// ════════════════════════════════════════════════
// ORDER ROUTES — /api/orders
// ════════════════════════════════════════════════
const express = require('express')
const pool = require('../db')

const router = express.Router()

// ─── CREATE ORDER (from cart checkout) ────────────
// POST /api/orders
// Expects: { user_id, items: [...] }
router.post('/', async (req, res) => {
  const { user_id, items } = req.body

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing user or items.' })
  }

  // Use a transaction so if ANYTHING fails, nothing gets saved (all-or-nothing)
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const placedOrders = []

    // Each cart item becomes its own order (matches your current flow)
    for (const item of items) {
      const qty = item.quantity || 1

      for (let q = 0; q < qty; q++) {
        // Generate reference number
        const ref = '#' + Math.floor(10000 + Math.random() * 90000)

        // 1. Create the order
        const [orderResult] = await conn.query(
          'INSERT INTO orders (user_id, ref, status, total_price) VALUES (?, ?, ?, ?)',
          [user_id, ref, 'pending', item.price || 0]
        )
        const orderId = orderResult.insertId

        // 2. Create the order_item
        const [itemResult] = await conn.query(
          'INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_time) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.productId || null, item.product, 1, item.price || 0]
        )
        const orderItemId = itemResult.insertId

        // 3. Create delivery_details
        await conn.query(
          `INSERT INTO delivery_details 
           (order_item_id, delivery_type, delivery_date, delivery_time, address, recipient_name, song_request, notes, custom_flower, basket_description, has_inspo_photo)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderItemId,
            item.deliveryType || 'delivery',
            item.date || null,
            item.time || null,
            item.address || null,
            item.recipient || null,
            item.song || null,
            item.notes || null,
            item.customFlower || null,
            item.basketDescription || null,
            item.hasInspo ? 1 : 0,
          ]
        )

        // 4. Save customizations (rose color, flower types, extras, basket items)

        // Rose color (for eternal)
        if (item.roseColor) {
          await conn.query(
            'INSERT INTO order_item_customizations (order_item_id, custom_text) VALUES (?, ?)',
            [orderItemId, `Rose Color: ${item.roseColor}`]
          )
        }

        // Flower types (for natural)
        if (item.flowerTypes && item.flowerTypes.length > 0) {
          for (const ft of item.flowerTypes) {
            await conn.query(
              'INSERT INTO order_item_customizations (order_item_id, custom_text) VALUES (?, ?)',
              [orderItemId, `Flower Type: ${ft}`]
            )
          }
        }

// Extras (message card, balloon, etc.) — including images
        if (item.extras && item.extras.length > 0) {
          for (const extraId of item.extras) {
            const detail = item.extraDetails?.[extraId] || ''
            const imagePath = item.extraImageFilenames?.[extraId] || null
            await conn.query(
              'INSERT INTO order_item_customizations (order_item_id, custom_text, image_path) VALUES (?, ?, ?)',
              [orderItemId, extraId + ': ' + detail, imagePath]
            )
          }
        }

        // Inspiration photo (general one)
        if (item.inspoFilename) {
          await conn.query(
            'INSERT INTO order_item_customizations (order_item_id, custom_text, image_path) VALUES (?, ?, ?)',
            [orderItemId, 'Inspiration Photo', item.inspoFilename]
          )
        }

        // Basket items
        if (item.basketItems && item.basketItems.length > 0) {
          for (const bi of item.basketItems) {
            await conn.query(
              'INSERT INTO order_item_customizations (order_item_id, custom_text) VALUES (?, ?)',
              [orderItemId, `Basket Item: ${bi}`]
            )
          }
        }

        placedOrders.push({ id: orderId, ref, product: item.product, price: item.price })
      }
    }

    await conn.commit()
    res.json({ orders: placedOrders })
  } catch (err) {
    await conn.rollback()
    console.error('Create order error:', err)
    res.status(500).json({ error: 'Failed to place order.' })
  } finally {
    conn.release()
  }
})

// ─── GET ALL ORDERS (admin only) ──────────────────
// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.id, o.ref, o.status, o.total_price, o.created_at,
        u.name AS customer, u.email AS customerEmail, u.phone AS customerPhone,
        oi.id AS order_item_id, oi.product_name AS product, oi.quantity,
        dd.delivery_type AS deliveryType, dd.delivery_date AS date, dd.delivery_time AS time,
        dd.address, dd.recipient_name AS recipient, dd.song_request AS song,
        dd.notes, dd.custom_flower AS customFlower, dd.basket_description AS basketDescription, 
        dd.has_inspo_photo AS hasInspo,
        p.image,
        c.name AS type
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN delivery_details dd ON dd.order_item_id = oi.id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY o.created_at DESC
    `)

    // For each order, also fetch its customizations
    for (const order of orders) {
      const [customizations] = await pool.query(
        'SELECT custom_text, image_path FROM order_item_customizations WHERE order_item_id = ?',
        [order.order_item_id]
      )
      order.customizations = customizations
    }

    // Map category name to 'bear', 'bouquet', or 'basket'
    const mapped = orders.map(o => ({
      ...o,
      type: o.type === 'bear' ? 'bear' : (o.type === 'eternal' || o.type === 'natural' ? 'bouquet' : 'basket'),
      price: Number(o.total_price),
    }))

    res.json({ orders: mapped })
  } catch (err) {
    console.error('Get orders error:', err)
    res.status(500).json({ error: 'Failed to load orders.' })
  }
})

// ─── GET ORDERS FOR A USER ────────────────────────
// GET /api/orders/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.id, o.ref, o.status, o.total_price, o.created_at,
        oi.product_name AS product,
        dd.delivery_type AS deliveryType, dd.delivery_date AS date, dd.delivery_time AS time,
        dd.address, dd.recipient_name AS recipient,
        c.name AS type
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN delivery_details dd ON dd.order_item_id = oi.id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.params.userId])
    res.json({ orders })
  } catch (err) {
    console.error('Get user orders error:', err)
    res.status(500).json({ error: 'Failed to load orders.' })
  }
})

// ─── UPDATE ORDER STATUS ──────────────────────────
// PATCH /api/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body
  if (!['pending', 'active', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' })
  }
  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Update status error:', err)
    res.status(500).json({ error: 'Failed to update status.' })
  }
})

// ─── DELETE ORDER ─────────────────────────────────
// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Delete order error:', err)
    res.status(500).json({ error: 'Failed to delete order.' })
  }
})

module.exports = router