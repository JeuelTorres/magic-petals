// ════════════════════════════════════════════════
// API helper — talks to the backend
// ════════════════════════════════════════════════

const BASE_URL = 'http://localhost:3001/api'

async function request(path, options = {}) {
  const res = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong')
  }

  return data
}

export const api = {
  // Auth
  register: (user) => request('/auth/register', { method: 'POST', body: JSON.stringify(user) }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Products
  getProducts: () => request('/products'),
  getProduct: (id) => request(`/products/${id}`),

  // Orders
  createOrder: (user_id, items) => request('/orders', { method: 'POST', body: JSON.stringify({ user_id, items }) }),
  getAllOrders: () => request('/orders'),
  getUserOrders: (userId) => request(`/orders/user/${userId}`),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
}