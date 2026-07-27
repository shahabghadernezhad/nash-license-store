import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Package,
  Camera,
  Clock,
  DollarSign,
} from 'lucide-react'
import { productApi } from '../services/api'
import toast from 'react-hot-toast'

// Format toman
function formatToman(num) {
  if (!num) return '۰'
  return num.toLocaleString('fa-IR')
}

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  duration_days: '',
  max_cameras: '',
  is_active: true,
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || emptyProduct)
  const [saving, setSaving] = useState(false)
  const isEdit = !!product?.id

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...form,
        price: Number(form.price),
        duration_days: Number(form.duration_days),
        max_cameras: Number(form.max_cameras),
      }

      if (isEdit) {
        await productApi.update(product.id, data)
        toast.success('محصول با موفقیت بروزرسانی شد')
      } else {
        await productApi.create(data)
        toast.success('محصول با موفقیت ایجاد شد')
      }
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'خطا در ذخیره محصول')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? 'ویرایش محصول' : 'محصول جدید'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">نام محصول</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="مثال: پکیج ۴ دوربین"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">توضیحات</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field min-h-[80px] resize-none"
              placeholder="توضیحات محصول..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">قیمت (تومان)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-field"
                placeholder="0"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">مدت (روز)</label>
              <input
                type="number"
                value={form.duration_days}
                onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
                className="input-field"
                placeholder="30"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">دوربین‌ها</label>
              <input
                type="number"
                value={form.max_cameras}
                onChange={(e) => setForm({ ...form, max_cameras: e.target.value })}
                className="input-field"
                placeholder="4"
                required
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:-translate-x-full" />
            </label>
            <span className="text-sm text-slate-300">فعال</span>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit ? 'بروزرسانی' : 'ایجاد محصول'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await productApi.list({ search: search || undefined })
      setProducts(res.data.results || res.data)
    } catch {
      // Demo data
      setProducts([
        { id: 1, name: 'پکیج ۱ دوربین', description: 'لایسنس ۳۰ روزه برای ۱ دوربین', price: 850000, duration_days: 30, max_cameras: 1, is_active: true },
        { id: 2, name: 'پکیج ۴ دوربین', description: 'لایسنس ۳۰ روزه برای ۴ دوربین', price: 2500000, duration_days: 30, max_cameras: 4, is_active: true },
        { id: 3, name: 'پکیج ۸ دوربین', description: 'لایسنس ۳۰ روزه برای ۸ دوربین', price: 4200000, duration_days: 30, max_cameras: 8, is_active: true },
        { id: 4, name: 'پکیج ۱۶ دوربین', description: 'لایسنس ۶۰ روزه برای ۱۶ دوربین', price: 7500000, duration_days: 60, max_cameras: 16, is_active: true },
        { id: 5, name: 'پکیج ۳۲ دوربین', description: 'لایسنس ۹۰ روزه برای ۳۲ دوربین', price: 12000000, duration_days: 90, max_cameras: 32, is_active: false },
      ])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounce)
  }, [fetchProducts])

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) return
    try {
      await productApi.delete(id)
      toast.success('محصول حذف شد')
      fetchProducts()
    } catch {
      toast.error('خطا در حذف محصول')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleNew = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">محصولات</h1>
          <p className="text-slate-400 text-sm mt-1">مدیریت محصولات فروشگاه</p>
        </div>
        <button onClick={handleNew} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span>محصول جدید</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pr-11"
          placeholder="جستجوی محصول..."
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">محصولی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="card group hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{product.name}</h3>
                    <span className={product.is_active ? 'badge-success' : 'badge-danger'}>
                      {product.is_active ? 'فعال' : 'غیرفعال'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {product.description && (
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{product.description}</p>
              )}

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700/30">
                <div className="text-center">
                  <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">{formatToman(product.price)}</p>
                  <p className="text-xs text-slate-500">تومان</p>
                </div>
                <div className="text-center">
                  <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">{product.duration_days}</p>
                  <p className="text-xs text-slate-500">روز</p>
                </div>
                <div className="text-center">
                  <Camera className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <p className="text-sm font-medium text-white">{product.max_cameras}</p>
                  <p className="text-xs text-slate-500">دوربین</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null); }}
          onSave={() => { setShowModal(false); setEditingProduct(null); fetchProducts(); }}
        />
      )}
    </div>
  )
}
