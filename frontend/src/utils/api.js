// Small wrapper around fetch so we don't repeat headers/error handling everywhere.
// Talks to our own Express backend instead of any third-party API.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('shopez_token')
}

async function request(path, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  let data
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    const message = data?.message || 'Something went wrong, please try again'
    throw new Error(message)
  }

  return data
}

// ---- Auth ----
export function registerUser(payload) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

export function loginUser(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
}

export function fetchCurrentUser() {
  return request('/auth/me')
}

export function updateCurrentUser(payload) {
  return request('/auth/me', { method: 'PUT', body: JSON.stringify(payload) })
}

// ---- Products ----
export function fetchProducts(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const qs = query.toString()
  return request(`/products${qs ? `?${qs}` : ''}`)
}

export function fetchProductById(id) {
  return request(`/products/${id}`)
}

export function fetchCategories() {
  return request('/products/categories')
}

export function createProduct(payload) {
  return request('/products', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateProduct(id, payload) {
  return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' })
}

// ---- Orders ----
export function placeOrder(payload) {
  return request('/orders', { method: 'POST', body: JSON.stringify(payload) })
}

export function fetchMyOrders() {
  return request('/orders/my-orders')
}

export function fetchOrderById(id) {
  return request(`/orders/${id}`)
}

export function fetchAllOrders() {
  return request('/orders')
}

export function updateOrderStatus(id, status) {
  return request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })
}
