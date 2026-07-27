import axios from 'axios'

// Base API instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401, token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh/', {
            refresh: refreshToken,
          })
          const { access } = res.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      } else {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email, password) =>
    api.post('/auth/login/', { email, password }),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
  changePassword: (data) => api.post('/auth/change-password/', data),
}

// Product API
export const productApi = {
  list: (params) => api.get('/products/', { params }),
  get: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  patch: (id, data) => api.patch(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
}

// Order API
export const orderApi = {
  list: (params) => api.get('/orders/', { params }),
  get: (id) => api.get(`/orders/${id}/`),
  create: (data) => api.post('/orders/', data),
  update: (id, data) => api.patch(`/orders/${id}/`, data),
  cancel: (id) => api.post(`/orders/${id}/cancel/`),
}

// License API
export const licenseApi = {
  list: (params) => api.get('/licenses/', { params }),
  get: (id) => api.get(`/licenses/${id}/`),
  create: (data) => api.post('/licenses/', data),
  activate: (id) => api.post(`/licenses/${id}/activate/`),
  deactivate: (id) => api.post(`/licenses/${id}/deactivate/`),
  revoke: (id) => api.post(`/licenses/${id}/revoke/`),
  check: (key) => api.post('/licenses/check/', { key }),
}

// Dashboard API
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats/'),
  revenueChart: (days) => api.get('/dashboard/revenue/', { params: { days } }),
  topProducts: (limit) => api.get('/dashboard/top-products/', { params: { limit } }),
  recentOrders: (limit) => api.get('/dashboard/recent-orders/', { params: { limit } }),
  licenseStats: () => api.get('/dashboard/license-stats/'),
}

// Settings API
export const settingsApi = {
  get: () => api.get('/settings/'),
  update: (data) => api.put('/settings/', data),
  patch: (data) => api.patch('/settings/', data),
}

export default api
