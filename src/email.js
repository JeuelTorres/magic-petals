// ════════════════════════════════════════════════
// EMAIL SENDER — sends order receipts via EmailJS
// ════════════════════════════════════════════════
import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_cqq17fv'
const TEMPLATE_ID = 'template_4s84n2q'
const PUBLIC_KEY = '0KpmOTXFCIMzXZnRE'

// Sends a single order receipt email
export async function sendOrderEmail(order, customer) {
  try {
    const templateParams = {
      email: customer.email,
      customer_name: customer.name,
      ref: order.ref,
      product: order.product,
      price: order.price,
      delivery_date: order.date || 'To be confirmed',
      delivery_time: order.time || 'To be confirmed',
      delivery_type: order.deliveryType === 'pickup' ? 'Pickup at shop' : 'Home Delivery',
      address: order.deliveryType === 'pickup' ? 'Pickup at our shop' : (order.address || 'To be confirmed'),
    }

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
    console.log('Email sent for order', order.ref)
  } catch (err) {
    console.error('Failed to send email:', err)
    // Don't throw — we don't want email failure to break the checkout
  }
}

// Sends emails for all placed orders
export async function sendOrderEmails(placedOrders, customer, cartItems) {
  // Merge placed orders with full cart details (address, date, etc.)
  // placedOrders has id, ref, product, price from the backend
  // cartItems has all the extra info (date, time, address)
  
  for (let i = 0; i < placedOrders.length; i++) {
    const order = placedOrders[i]
    // Find the matching cart item for extra details
    const cartItem = cartItems.find(c => c.product === order.product) || {}
    
    await sendOrderEmail({
      ...cartItem,
      ...order,
    }, customer)
  }
}

// ════════════════════════════════════════════════
// Send admin reminder email about an urgent delivery
// ════════════════════════════════════════════════
const REMINDER_TEMPLATE_ID = 'template_eln5rtp'
const ADMIN_EMAIL = 'zel.06torres@gmail.com'

export async function sendAdminReminder(order) {
  try {
    const templateParams = {
      admin_email: ADMIN_EMAIL,
      ref: order.ref,
      product: order.product,
      customer: order.customer || 'Unknown',
      phone: order.customerPhone || 'No phone on file',
      delivery_date: order.date ? new Date(order.date).toLocaleDateString() : 'TBD',
      delivery_time: order.time || 'TBD',
      address: order.deliveryType === 'pickup' ? 'Pickup at shop' : (order.address || 'TBD'),
    }

    await emailjs.send(SERVICE_ID, REMINDER_TEMPLATE_ID, templateParams, PUBLIC_KEY)
    console.log('Reminder email sent for order', order.ref)
  } catch (err) {
    console.error('Failed to send reminder email:', err)
  }
}