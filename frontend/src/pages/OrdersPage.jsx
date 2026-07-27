import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Filter,
  Eye,
  Loader2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { orderApi } from '../services/api'
import toast from 'react-hot-toast'

function formatToman(num) {
  if (!num) return '۰'
  return num.toLocaleString('fa-IR')
}

const statusConfig = {
  pending: { label: 'در انتظار', class: 'badge-warning' },
  paid: { label: 'پرداخت شده', class: 'badge-success' },
  completed: { label: 'تکمیل شده', class: 'badge-success' },
  processing: { label: 'در حال پردازش', class: 'badge-info' },
  cancelled: { label: 'لغو شده', class: 'badge-danger' },
  failed: { label: 'ناموفق', class: 'badge-danger' },
  refunded: { label: 'بازپرداخت', class: 'badge-neutral' },
}

const statusFilters = [
  { value: '', label: 'همه' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'paid', label: 'پرداخت شده' },
  { value: 'completed', label: 'تکمیل شده' },
  { value: 'processing', label: 'در حال پردازش' },
  { value: 'cancelled', label: 'لغو شده' },
  { value: 'failed', label: 'ناموفق' },
]

function OrderDetailModal({ order, onClose }) {
  if (!order) return null
  const status = statusConfig[order.status] || { label: order.status, class: 'badge-neutral' }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">جزئیات سفارش #{order.id}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">مشتری</p>
              <p className="text-sm font-medium text-white">{order.customer_name || order.customer}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">محصول</p>
              <p className="text-sm font-medium text-white">{order.product_name || order.product}</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">مبلغ</p>
              <p className="text-sm font-medium text-emerald-400">{formatToman(order.amount)} تومان</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">وضعیت</p>
              <span className={status.class}>{status.label}</span>
            </div>
          </div>

          {order.customer_email && (
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">ایمیل</p>
              <p className="text-sm font-medium text-white" dir="ltr">{order.customer_email}</p>
            </div>
          )}

          {order.notes && (
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">یادداشت</p>
              <p className="text-sm text-slate-300">{order.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">تاریخ ایجاد</p>
              <p className="text-sm text-slate-300">{order.created_at || order.date}</p>
            </div>
            {order.paid_at && (
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">تاریخ پرداخت</p>
                <p className="text-sm text-slate-300">{order.paid_at}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <button onClick={onClose} className="btn-secondary w-full justify-center">
            بستن
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        search: search || undefined,
        status: statusFilter || undefined,
      }
      const res = await orderApi.list(params)
      setOrders(res.data.results || res.data)
      if (res.data.count) {
        setTotalPages(Math.ceil(res.data.count / 20))
      }
    } catch {
      // Demo data
      setOrders([
        { id: 1001, customer_name: 'علی محمدی', customer_email: 'ali@example.com', product_name: 'پکیج ۴ دوربین', amount: 2500000, status: 'paid', created_at: '۱۴۰۳/۰۴/۱۵', notes: '' },
        { id: 1002, customer_name: 'رضا کریمی', customer_email: 'reza@example.com', product_name: 'پکیج ۱ دوربین', amount: 850000, status: 'completed', created_at: '۱۴۰۳/۰۴/۱۴', notes: '' },
        { id: 1003, customer_name: 'سارا احمدی', customer_email: 'sara@example.com', product_name: 'پکیج ۸ دوربین', amount: 4200000, status: 'pending', created_at: '۱۴۰۳/۰۴/۱۴', notes: 'پرداخت از طریق درگاه' },
        { id: 1004, customer_name: 'حسن رضایی', customer_email: 'hasan@example.com', product_name: 'پکیج ۲ دوربین', amount: 1500000, status: 'processing', created_at: '۱۴۰۳/۰۴/۱۳', notes: '' },
        { id: 1005, customer_name: 'مریم نوری', customer_email: 'maryam@example.com', product_name: 'پکیج ۴ دوربین', amount: 2500000, status: 'paid', created_at: '۱۴۰۳/۰۴/۱۳', notes: '' },
        { id: 1006, customer_name: 'امیر حسینی', customer_email: 'amir@example.com', product_name: 'پکیج ۱۶ دوربین', amount: 7500000, status: 'completed', created_at: '۱۴۰۳/۰۴/۱۲', notes: '' },
        { id: 1007, customer_name: 'زهرا عباسی', customer_email: 'zahra@example.com', product_name: 'پکیج ۱ دوربین', amount: 850000, status: 'cancelled', created_at: '۱۴۰۳/۰۴/۱۲', notes: 'لغو توسط مشتری' },
        { id: 1008, customer_name: 'محمد کاظمی', customer_email: 'mohammad@example.com', product_name: 'پکیج ۴ دوربین', amount: 2500000, status: 'paid', created_at: '۱۴۰۳/۰۴/۱۱', notes: '' },
      ])
      setTotalPages(3)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    const debounce = setTimeout(fetchOrders, 300)
    return () => clearTimeout(debounce)
  }, [fetchOrders])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">سفارشات</h1>
        <p className="text-slate-400 text-sm mt-1">مدیریت سفارشات فروشگاه</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pr-11"
            placeholder="جستجوی سفارش..."
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" />
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">سفارشی یافت نشد</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="px-6 py-4 text-right text-xs font-medium">شماره</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">مشتری</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">محصول</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">مبلغ</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">وضعیت</th>
                    <th className="px-6 py-4 text-right text-xs font-medium">تاریخ</th>
                    <th className="px-6 py-4 text-center text-xs font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = statusConfig[order.status] || { label: order.status, class: 'badge-neutral' }
                    return (
                      <tr key={order.id} className="table-row">
                        <td className="px-6 py-4 text-sm text-slate-300 font-mono">#{order.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-200">{order.customer_name || order.customer}</p>
                            {order.customer_email && (
                              <p className="text-xs text-slate-500" dir="ltr">{order.customer_email}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{order.product_name || order.product}</td>
                        <td className="px-6 py-4 text-sm font-medium text-emerald-400">
                          {formatToman(order.amount)} تومان
                        </td>
                        <td className="px-6 py-4">
                          <span className={status.class}>{status.label}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{order.created_at || order.date}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors inline-flex"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
