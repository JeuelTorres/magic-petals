// Cart helper functions — used by all pages

const CART_KEY = 'mp_cart'

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  // Notify navbar so the count updates instantly
  window.dispatchEvent(new Event('cart-updated'))
}

export function addToCart(item) {
  const cart = getCart()
  // Give each cart item a unique id so we can edit/remove it
  const cartItem = { ...item, cartId: 'CART-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6) }
  cart.push(cartItem)
  saveCart(cart)
}

export function removeFromCart(cartId) {
  const cart = getCart().filter(i => i.cartId !== cartId)
  saveCart(cart)
}

export function updateQuantity(cartId, quantity) {
  const cart = getCart().map(i =>
    i.cartId === cartId ? { ...i, quantity: Math.max(1, quantity) } : i
  )
  saveCart(cart)
}

export function clearCart() {
  saveCart([])
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + (i.quantity || 1), 0)
}

export function getCartTotal() {
  return getCart().reduce((sum, i) => {
    const price = typeof i.price === 'number' ? i.price : 0
    return sum + price * (i.quantity || 1)
  }, 0)
}