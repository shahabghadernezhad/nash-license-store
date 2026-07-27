import { useState, useEffect, useRef, useCallback } from 'react'
import {
  DollarSign,
  ShoppingCart,
  KeyRound,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { dashboardApi } from '../services/api'

// Animated counter hook
function useAnimatedCounter(target, duration = 1500) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (target === null || target === undefined) return
    const startTime = performance.now()
    const startValue = 0

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(startValue + (target - startValue) * eased))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return count
}

// Format number in Persian with تومان
function formatToman(num) {
  if (num === null || num === undefined) return '۰'
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const formatted = num.toLocaleString('en')
  return formatted.replace(/[0-9]/g, (d) => persianDigits[d])
}

// Status badge
function StatusBadge({ status }) {
  const styles = {
    pending: 'badge-warning',
    paid: 'badge-success',
    completed: 'badge-success',
    processing: 'badge-info',
    cancelled: 'badge-danger',
    failed: 'badge-danger',
    shipped: 'badge-info',
  }
  const labels = {
    pending: 'در انتظار',
    paid: 'پرداخت شده',
    completed: 'تکمیل شده',
    processing: 'در حال پردازش',
    cancelled: 'لغو شده',
    failed: 'ناموفق',
    shipped: 'ارسال شده',
  }
  return (
    <span className={styles[status] || 'badge-neutral'}>
      {labels[status] || status}
    </span>
  )
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: {formatToman(entry.value)}
        </p>
      ))}
    </div>
  )
}

// Pie tooltip
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-sm font-medium text-slate-200">{payload[0].name}</p>
      <p className="text-xs text-slate-400">تعداد: {payload[0].value}</p>
    </div>
  )
}

// Demo/fallback data
const demoRevenueData = Array.from({ length: 30 }, (_, i) => ({
  date: `${30 - i}`,
  revenue: Math.floor(Math.random() * 50000000) + 10000000,
}))

const demoTopProducts = [
  { name: 'پکیج ۱ دوربین', sales: 245 },
  { name: 'پکیج ۴ دوربین', sales: 189 },
  { name: 'پکیج ۸ دوربین', sales: 134 },
  { name: 'پکیج ۱۶ دوربین', sales: 98 },
  { name: 'پکیج ۳۲ دوربین', sales: 67 },
]

const demoRecentOrders = [
  { id: 1001, customer: 'علی محمدی', product: 'پکیج ۴ دوربین', amount: 2500000, status: 'paid', date: '۱۴۰۳/۰۴/۱۵' },
  { id: 1002, customer: 'رضا کریمی', product: 'پکیج ۱ دوربین', amount: 850000, status: 'completed', date: '۱۴۰۳/۰۴/۱۴' },
  { id: 1003, customer: 'سارا احمدی', product: 'پکیج ۸ دوربین', amount: 4200000, status: 'pending', date: '۱۴۰۳/۰۴/۱۴' },
  { id: 1004, customer: 'حسن رضایی', product: 'پکیج ۲ دوربین', amount: 1500000, status: 'processing', date: '۱۴۰۳/۰۴/۱۳' },
  { id: 1005, customer: 'مریم نوری', product: 'پکیج ۴ دوربین', amount: 2500000, status: 'paid', date: '۱۴۰۳/۰۴/۱۳' },
]

const demoLicenseStats = [
  { name: 'فعال', value: 342, color: '#22c55e' },
  { name: 'منقضی', value: 128, color: '#ef4444' },
  { name: 'در انتظار', value: 56, color: '#f59e0b' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [revenueData, setRevenueData] = useState(demoRevenueData)
  const [topProducts, setTopProducts] = useState(demoTopProducts)
  const [recentOrders, setRecentOrders] = useState(demoRecentOrders)
  const [licenseStats, setLicenseStats] = useState(demoLicenseStats)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [statsRes, revenueRes, productsRes, ordersRes, licensesRes] = await Promise.allSettled([
        dashboardApi.stats(),
        dashboardApi.revenueChart(30),
        dashboardApi.topProducts(5),
        dashboardApi.recentOrders(10),
        dashboardApi.licenseStats(),
      ])

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data)
      if (revenueRes.status === 'fulfilled') setRevenueData(revenueRes.value.data)
      if (productsRes.status === 'fulfilled') setTopProducts(productsRes.value.data)
      if (ordersRes.status === 'fulfilled') setRecentOrders(ordersRes.value.data)
      if (licensesRes.status === 'fulfilled') setLicenseStats(licensesRes.value.data)
    } catch {
      // Use demo data
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalRevenue = stats?.total_revenue ?? 125400000
  const totalOrders = stats?.total_orders ?? 1247
  const activeLicenses = stats?.active_licenses ?? 342
  const todaySales = stats?.today_sales ?? 5800000

  const revenue = useAnimatedCounter(totalRevenue)
  const orders = useAnimatedCounter(totalOrders)
  const licenses = useAnimatedCounter(activeLicenses)
  const sales = useAnimatedCounter(todaySales)

  const statCards = [
    {
      title: 'کل درآمد',
      value: `${formatToman(revenue)}`,
      suffix: 'تومان',
      icon: DollarSign,
      change: '+۱۲.۵٪',
      changeType: 'up',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'کل سفارشات',
      value: formatToman(orders),
      suffix: 'سفارش',
      icon: ShoppingCart,
      change: '+۸.۲٪',
      changeType: 'up',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'لایسنس‌های فعال',
      value: formatToman(licenses),
      suffix: 'لایسنس',
      icon: KeyRound,
      change: '+۵.۱٪',
      changeType: 'up',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'فروش امروز',
      value: `${formatToman(sales)}`,
      suffix: 'تومان',
      icon: TrendingUp,
      change: '+۲۳.۷٪',
      changeType: 'up',
      gradient: 'from-amber-500 to-orange-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400">در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">داشبورد</h1>
          <p className="text-slate-400 text-sm mt-1">نمای کلی فروشگاه Nash Security</p>
        </div>
        <div className="text-slate-500 text-sm">
          {new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">{card.title}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white animate-count">{card.value}</span>
                    <span className="text-xs text-slate-500">{card.suffix}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {card.changeType === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        card.changeType === 'up' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {card.change}
                    </span>
                    <span className="text-xs text-slate-500">نسبت به ماه قبل</span>
                  </div>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - spans 2 cols */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">درآمد ۳۰ روز اخیر</h3>
              <p className="text-slate-400 text-xs mt-1">نمودار درآمد روزانه به تومان</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-400">درآمد</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="درآمد"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#3b82f6', stroke: '#1e40af', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* License Status Pie Chart */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">وضعیت لایسنس‌ها</h3>
            <p className="text-slate-400 text-xs mt-1">توزیع لایسنس‌ها بر اساس وضعیت</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={licenseStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {licenseStats.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {licenseStats.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-400">{item.name}</span>
                <span className="text-xs font-medium text-slate-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Bar Chart */}
        <div className="card">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">۵ محصول برتر</h3>
            <p className="text-slate-400 text-xs mt-1">پرفروش‌ترین محصولات بر اساس تعداد فروش</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ right: 10 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value) => [`${value} فروش`, 'تعداد']}
                />
                <Bar
                  dataKey="sales"
                  fill="url(#barGradient)"
                  radius={[0, 8, 8, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">آخرین سفارشات</h3>
              <p className="text-slate-400 text-xs mt-1">۱۰ سفارش اخیر</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3 text-right text-xs">شماره</th>
                  <th className="px-4 py-3 text-right text-xs">مشتری</th>
                  <th className="px-4 py-3 text-right text-xs">محصول</th>
                  <th className="px-4 py-3 text-right text-xs">مبلغ</th>
                  <th className="px-4 py-3 text-right text-xs">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="px-4 py-3 text-sm text-slate-300 font-mono">#{order.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-200">{order.customer}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{order.product}</td>
                    <td className="px-4 py-3 text-sm text-slate-200 font-medium">
                      {formatToman(order.amount)} تومان
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
