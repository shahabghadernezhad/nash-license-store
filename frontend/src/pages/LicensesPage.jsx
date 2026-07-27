import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Filter,
  Loader2,
  KeyRound,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { licenseApi } from '../services/api'
import toast from 'react-hot-toast'

function formatToman(num) {
  if (!num) return '۰'
  return num.toLocaleString('fa-IR')
}

const statusConfig = {
  active: { label: 'فعال', class: 'badge-success', icon: CheckCircle },
  expired: { label: 'منقضی', class: 'badge-danger', icon: XCircle },
  pending: { label: 'در انتظار', class: 'badge-warning', icon: Clock },
  revoked: { label: 'لغو شده', class: 'badge-neutral', icon: XCircle },
  trial: { label: 'آزمایشی', class: 'badge-info', icon: Clock },
}

const statusFilters = [
  { value: '', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'expired', label: 'منقضی' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'revoked', label: 'لغو شده' },
  { value: 'trial', label: 'آزمایشی' },
]

function CopyButton({ text }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('کلید کپی شد')
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-slate-700 text-slate-500 hover:text-blue-400 transition-colors"
      title="کپی"
    >
      <Copy className="w-3.5 h-3.5" />
    </button>
  )
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLicenses = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        search: search || undefined,
        status: statusFilter || undefined,
      }
      const res = await licenseApi.list(params)
      setLicenses(res.data.results || res.data)
      if (res.data.count) {
        setTotalPages(Math.ceil(res.data.count / 20))
      }
    } catch {
      // Demo data
      setLicenses([
        { id: 1, key: 'NS-4X8K-2M9P-A3WB', customer_name: 'علی محمدی', product_name: 'پکیج ۴ دوربین', status: 'active', activated_at: '۱۴۰۳/۰۴/۱۵', expires_at: '۱۴۰۳/۰۵/۱۵', days_remaining: 30, max_cameras: 4, active_cameras: 3 },
        { id: 2, key: 'NS-7J2L-5N1R-C8TF', customer_name: 'رضا کریمی', product_name: 'پکیج ۱ دوربین', status: 'active', activated_at: '۱۴۰۳/۰۴/۱۰', expires_at: '۱۴۰۳/۰۵/۱۰', days_remaining: 25, max_cameras: 1, active_cameras: 1 },
        { id: 3, key: 'NS-3H9M-1K5W-D6VP', customer_name: 'سارا احمدی', product_name: 'پکیج ۸ دوربین', status: 'expired', activated_at: '۱۴۰۳/۰۳/۰۱', expires_at: '۱۴۰۳/۰۴/۰۱', days_remaining: 0, max_cameras: 8, active_cameras: 0 },
        { id: 4, key: 'NS-5F3X-8T2N-E4QR', customer_name: 'حسن رضایی', product_name: 'پکیج ۲ دوربین', status: 'pending', activated_at: null, expires_at: null, days_remaining: null, max_cameras: 2, active_cameras: 0 },
        { id: 5, key: 'NS-9A1Z-4W7K-F2MJ', customer_name: 'مریم نوری', product_name: 'پکیج ۴ دوربین', status: 'active', activated_at: '۱۴۰۳/۰۴/۱۲', expires_at: '۱۴۰۳/۰۵/۱۲', days_remaining: 27, max_cameras: 4, active_cameras: 4 },
        { id: 6, key: 'NS-6B8C-3V1H-G5LP', customer_name: 'امیر حسینی', product_name: 'پکیج ۱۶ دوربین', status: 'active', activated_at: '۱۴۰۳/۰۴/۰۵', expires_at: '۱۴۰۳/۰۶/۰۵', days_remaining: 50, max_cameras: 16, active_cameras: 12 },
        { id: 7, key: 'NS-2D4E-7R9S-H1KN', customer_name: 'زهرا عباسی', product_name: 'پکیج ۱ دوربین', status: 'trial', activated_at: '۱۴۰۳/۰۴/۱۴', expires_at: '۱۴۰۳/۰۴/۲۱', days_remaining: 6, max_cameras: 1, active_cameras: 1 },
        { id: 8, key: 'NS-8G6I-2P4T-J3MB', customer_name: 'محمد کاظمی', product_name: 'پکیج ۴ دوربین', status: 'revoked', activated_at: '۱۴۰۳/۰۲/۱۰', expires_at: null, days_remaining: 0, max_cameras: 4, active_cameras: 0 },
      ])
      setTotalPages(3)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    const debounce = setTimeout(fetchLicenses, 300)
    return () => clearTimeout(debounce)
  }, [fetchLicenses])

  const handleDeactivate = async (id) => {
    if (!confirm('آیا از غیرفعال کردن این لایسنس اطمینان دارید؟')) return
    try {
      await licenseApi.deactivate(id)
      toast.success('لایسنس غیرفعال شد')
      fetchLicenses()
    } catch {
      toast.error('خطا در غیرفعال کردن لایسنس')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">لایسنس‌ها</h1>
        <p className="text-slate-400 text-sm mt-1">مدیریت لایسنس‌های فعال و غیرفعال</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statusFilters.filter((f) => f.value).map((f) => {
          const count = licenses.filter((l) => l.status === f.value).length
          const config = statusConfig[f.value]
          const Icon = config?.icon || Clock
          return (
            <div
              key={f.value}
              onClick={() => setStatusFilter(statusFilter === f.value ? '' : f.value)}
              className={`card cursor-pointer transition-all hover:border-blue-500/30 ${
                statusFilter === f.value ? 'border-blue-500/50 glow-blue' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  f.value === 'active' ? 'bg-emerald-500/20' :
                  f.value === 'expired' ? 'bg-red-500/20' :
                  f.value === 'pending' ? 'bg-amber-500/20' :
                  'bg-slate-500/20'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    f.value === 'active' ? 'text-emerald-400' :
                    f.value === 'expired' ? 'text-red-400' :
                    f.value === 'pending' ? 'text-amber-400' :
                    'text-slate-400'
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-xs text-slate-400">{f.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pr-11"
            placeholder="جستجو بر اساس کلید، نام مشتری..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-16">
            <KeyRound className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">لایسنسی یافت نشد</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-4 text-right text-xs font-medium">کلید</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">مشتری</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">محصول</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">وضعیت</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">دوربین‌ها</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">تاریخ فعال‌سازی</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">تاریخ انقضا</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">روزهای باقی‌مانده</th>
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((license) => {
                    const status = statusConfig[license.status] || { label: license.status, class: 'badge-neutral' }
                    return (
                      <tr key={license.id} className="table-row">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <code className="text-sm text-blue-400 font-mono" dir="ltr">{license.key}</code>
                            <CopyButton text={license.key} />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-200">{license.customer_name || license.customer}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{license.product_name || license.product}</td>
                        <td className="px-6 py-4">
                          <span className={status.class}>{status.label}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          <span className={license.active_cameras >= license.max_cameras ? 'text-amber-400' : 'text-slate-300'}>
                            {license.active_cameras}
                          </span>
                          <span className="text-slate-500"> / {license.max_cameras}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{license.activated_at || '—'}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{license.expires_at || '—'}</td>
                        <td className="px-6 py-4">
                          {license.days_remaining !== null ? (
                            <span className={`text-sm font-medium ${
                              license.days_remaining <= 7 ? 'text-red-400' :
                              license.days_remaining <= 14 ? 'text-amber-400' :
                              'text-emerald-400'
                            }`}>
                              {license.days_remaining} روز
                            </span>
                          ) : (
                            <span className="text-sm text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/30">
              <p className="text-sm text-slate-400">صفحه {page} از {totalPages}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
