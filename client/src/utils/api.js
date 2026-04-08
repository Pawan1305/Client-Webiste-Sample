import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Inject admin token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vc_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Items ──
export const fetchItems = (params) => api.get('/items', { params })
export const fetchItem = (id) => api.get(`/items/${id}`)
export const createItem = (data) => api.post('/items', data)
export const updateItem = (id, data) => api.put(`/items/${id}`, data)
export const deleteItem = (id) => api.delete(`/items/${id}`)
export const updateStock = (id, stock) => api.patch(`/items/${id}/stock`, { stock })

// ── Orders ──
export const createOrder = (data) => api.post('/orders', data)
export const fetchOrders = (params) => api.get('/orders', { params })
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data)
export const fetchDashboardStats = () => api.get('/orders/stats')

// ── Admin ──
export const adminLogin = (credentials) => api.post('/admin/login', credentials)
export const setupAdmin = () => api.post('/admin/setup')
export const fetchAdminProfile = () => api.get('/admin/profile')

export default api
