import axios from 'axios'

// Detect if we're on GitHub Pages (no backend available)
const isGitHubPages = window.location.hostname.includes('github.io')
const API_BASE = isGitHubPages ? null : '/api'

// Base API instance
const api = axios.create({
  baseURL: API_BASE || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

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
          const res = await axios.post('/api/auth/refresh/', { refresh: refreshToken })
          const { access } = res.data
          localStorage.setItem('access_token', access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      } else {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ============================================
// Demo Data (for GitHub Pages / offline mode)
// ============================================
const DEMO = {
  products: [
    { id: 1, name: 'پکیج ۱ دوربین', slug: '1-cam', description: 'مناسب منازل کوچک — پشتیبانی از ۱ دوربین', price_toman: 850000, duration_days: 365, max_cameras: 1, features: ['تشخیص حرکت', 'ضبط ۲۴ ساعته', 'اعلان فوری'], is_active: true },
    { id: 2, name: 'پکیج ۴ دوربین', slug: '4-cam', description: 'مناسب مغازه و دفتر کار — پشتیبانی از ۴ دوربین', price_toman: 2500000, duration_days: 365, max_cameras: 4, features: ['تشخیص چهره', 'ضبط ۲۴ ساعته', 'تحلیل هوشمند', 'اعلان فوری'], is_active: true },
    { id: 3, name: 'پکیج ۸ دوربین', slug: '8-cam', description: 'مناسب شرکت‌ها و ساختمان‌های بزرگ', price_toman: 4200000, duration_days: 365, max_cameras: 8, features: ['تشخیص چهره', 'خوانش پلاک', 'تحلیل رفتار', 'ضبط ابری'], is_active: true },
    { id: 4, name: 'پکیج ۱۶ دوربین', slug: '16-cam', description: 'مناسب مجتمع‌ها و مراکز تجاری', price_toman: 7500000, duration_days: 365, max_cameras: 16, features: ['همه امکانات پکیج ۸', 'مدیریت چند سایت', 'گزارش پیشرفته'], is_active: true },
    { id: 5, name: 'Enterprise', slug: 'enterprise', description: 'بدون محدودیت — برای سازمان‌ها', price_toman: 18000000, duration_days: 365, max_cameras: 999, features: ['بدون محدودیت دوربین', 'پشتیبانی ۲۴/۷', 'نصب و راه‌اندازی', 'آپدیت رایگان'], is_active: true },
  ],
  orders: [
    { id: 1001, user_name: 'علی محمدی', user_email: 'ali@example.com', product__name: 'پکیج ۴ دوربین', amount_toman: 2500000, status: 'paid', created_at: '2025-07-26T10:30:00Z' },
    { id: 1002, user_name: 'رضا کریمی', user_email: 'reza@example.com', product__name: 'پکیج ۱ دوربین', amount_toman: 850000, status: 'completed', created_at: '2025-07-25T14:20:00Z' },
    { id: 1003, user_name: 'سارا احمدی', user_email: 'sara@example.com', product__name: 'پکیج ۸ دوربین', amount_toman: 4200000, status: 'pending', created_at: '2025-07-24T09:15:00Z' },
    { id: 1004, user_name: 'حسن رضایی', user_email: 'hassan@example.com', product__name: 'پکیج ۴ دوربین', amount_toman: 2500000, status: 'paid', created_at: '2025-07-23T16:45:00Z' },
    { id: 1005, user_name: 'مریم نوری', user_email: 'maryam@example.com', product__name: 'پکیج ۱۶ دوربین', amount_toman: 7500000, status: 'completed', created_at: '2025-07-22T11:00:00Z' },
  ],
  licenses: [
    { id: 1, license_key: 'NASH-A7F3-B9C2-D1E4', product_name: 'پکیج ۴ دوربین', user_email: 'ali@example.com', is_active: true, activated_at: '2025-07-26T11:00:00Z', expires_at: '2026-07-26T11:00:00Z' },
    { id: 2, license_key: 'NASH-X8K2-M4P7-Q9W1', product_name: 'پکیج ۱ دوربین', user_email: 'reza@example.com', is_active: true, activated_at: '2025-07-25T15:00:00Z', expires_at: '2026-07-25T15:00:00Z' },
    { id: 3, license_key: 'NASH-Z5J8-N3V6-R1T4', product_name: 'پکیج ۸ دوربین', user_email: 'sara@example.com', is_active: false, activated_at: null, expires_at: '2025-07-24T10:00:00Z' },
  ],
  blogPosts: [
    { id: 1, title: '۱۰ نکته امنیتی مهم برای دوربین مداربسته', slug: '10-security-tips-cctv', excerpt: 'با رعایت این ۱۰ نکته ساده، امنیت دوربین مداربسته خود را به طور چشمگیری افزایش دهید.', category_name: 'نکات امنیتی', source: 'ai_agent', ai_read_time: 5, published_at: '2025-07-26T09:00:00Z', tags: [{ name: 'امنیت' }, { name: 'CCTV' }] },
    { id: 2, title: 'مقایسه دوربین‌های IP و آنالوگ', slug: 'ip-vs-analog-cameras', excerpt: 'راهنمای جامع مقایسه دوربین‌های آنالوگ و IP برای انتخاب بهترین گزینه.', category_name: 'دوربین مداربسته', source: 'ai_agent', ai_read_time: 7, published_at: '2025-07-25T09:00:00Z', tags: [{ name: 'IP Camera' }, { name: 'مقایسه' }] },
    { id: 3, title: 'نقش هوش مصنوعی در سیستم‌های امنیتی نسل جدید', slug: 'ai-in-security-systems', excerpt: 'بررسی نقش AI و یادگیری ماشین در تحلیل تصاویر دوربین.', category_name: 'تکنولوژی', source: 'ai_agent', ai_read_time: 6, published_at: '2025-07-24T09:00:00Z', tags: [{ name: 'AI' }, { name: 'امنیت' }] },
    { id: 4, title: 'تشخیص چهره در دوربین‌های مداربسته', slug: 'face-recognition-cctv', excerpt: 'آشنایی با فناوری تشخیص چهره و کاربرد آن در سیستم‌های نظارتی.', category_name: 'تشخیص چهره', source: 'admin', ai_read_time: 8, published_at: '2025-07-23T09:00:00Z', tags: [{ name: 'تشخیص چهره' }] },
  ],
  dashboard: {
    total_sales: 156,
    total_revenue: 385000000,
    active_licenses: 128,
    today_sales: 7,
    recent_orders: [
      { id: 1001, user_name: 'علی محمدی', product__name: 'پکیج ۴ دوربین', amount_toman: 2500000, status: 'paid', created_at: '2025-07-26T10:30:00Z' },
      { id: 1002, user_name: 'رضا کریمی', product__name: 'پکیج ۱ دوربین', amount_toman: 850000, status: 'completed', created_at: '2025-07-25T14:20:00Z' },
      { id: 1003, user_name: 'سارا احمدی', product__name: 'پکیج ۸ دوربین', amount_toman: 4200000, status: 'pending', created_at: '2025-07-24T09:15:00Z' },
    ],
    daily_revenue: Array.from({ length: 30 }, (_, i) => ({
      date: `2025-07-${String(30 - i).padStart(2, '0')}`,
      revenue: Math.floor(Math.random() * 15000000) + 2000000,
    })),
    top_products: [
      { name: 'پکیج ۴ دوربین', sales_count: 67 },
      { name: 'پکیج ۱ دوربین', sales_count: 45 },
      { name: 'پکیج ۸ دوربین', sales_count: 28 },
      { name: 'Enterprise', sales_count: 10 },
      { name: 'پکیج ۱۶ دوربین', sales_count: 6 },
    ],
    license_stats: { active: 128, expired: 18, pending: 10 },
  },
}

// ============================================
// Smart API — uses demo data when no backend
// ============================================
function wrapDemo(demoData) {
  return Promise.resolve({ data: demoData })
}

export const authApi = {
  login: async (email, password) => {
    if (isGitHubPages) {
      if (email === 'admin' && password === 'admin12345') {
        const fakeData = { access: 'demo-token', refresh: 'demo-refresh', user: { username: 'admin', email: 'admin@site.com', is_superuser: true, roles: ['admin'] } }
        return { data: fakeData }
      }
      throw { response: { data: { error: 'نام کاربری یا رمز عبور اشتباه است' } } }
    }
    return api.post('/auth/login/', { username: email, password })
  },
  logout: () => isGitHubPages ? wrapDemo({}) : api.post('/auth/logout/'),
  getProfile: () => isGitHubPages ? wrapDemo(DEMO.dashboard) : api.get('/auth/profile/'),
}

export const productApi = {
  list: (params) => isGitHubPages ? wrapDemo({ results: DEMO.products }) : api.get('/products/', { params }),
  get: (id) => isGitHubPages ? wrapDemo(DEMO.products.find(p => p.id === id)) : api.get(`/products/${id}/`),
  create: (data) => isGitHubPages ? wrapDemo({ ...data, id: 99 }) : api.post('/products/', data),
  update: (id, data) => isGitHubPages ? wrapDemo({ ...data, id }) : api.patch(`/products/${id}/`, data),
  delete: (id) => isGitHubPages ? wrapDemo({}) : api.delete(`/products/${id}/`),
}

export const orderApi = {
  list: (params) => isGitHubPages ? wrapDemo({ results: DEMO.orders }) : api.get('/orders/', { params }),
  get: (id) => isGitHubPages ? wrapDemo(DEMO.orders.find(o => o.id === id)) : api.get(`/orders/${id}/`),
  create: (data) => isGitHubPages ? wrapDemo({ ...data, id: 1006, status: 'pending' }) : api.post('/orders/', data),
}

export const licenseApi = {
  list: (params) => isGitHubPages ? wrapDemo({ results: DEMO.licenses }) : api.get('/licenses/', { params }),
  get: (id) => isGitHubPages ? wrapDemo(DEMO.licenses.find(l => l.id === id)) : api.get(`/licenses/${id}/`),
}

export const dashboardApi = {
  stats: () => isGitHubPages ? wrapDemo(DEMO.dashboard) : api.get('/dashboard/stats/'),
  revenueChart: (days) => isGitHubPages ? wrapDemo(DEMO.dashboard.daily_revenue) : api.get('/dashboard/revenue/', { params: { days } }),
  topProducts: (limit) => isGitHubPages ? wrapDemo(DEMO.dashboard.top_products) : api.get('/dashboard/top-products/', { params: { limit } }),
  recentOrders: (limit) => isGitHubPages ? wrapDemo(DEMO.dashboard.recent_orders) : api.get('/dashboard/recent-orders/', { params: { limit } }),
  licenseStats: () => isGitHubPages ? wrapDemo(DEMO.dashboard.license_stats) : api.get('/dashboard/license-stats/'),
}

export const blogApi = {
  list: (params) => isGitHubPages ? wrapDemo({ results: DEMO.blogPosts }) : api.get('/blog/', { params }),
  get: (slug) => isGitHubPages ? wrapDemo(DEMO.blogPosts.find(p => p.slug === slug)) : api.get(`/blog/${slug}/`),
}

export const settingsApi = {
  get: () => isGitHubPages ? wrapDemo({}) : api.get('/settings/'),
}

export default api
