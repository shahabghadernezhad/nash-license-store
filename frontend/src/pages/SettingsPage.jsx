import { useState, useEffect } from 'react'
import {
  Save,
  Loader2,
  Store,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Wrench,
} from 'lucide-react'
import { settingsApi } from '../services/api'
import toast from 'react-hot-toast'

const defaultSettings = {
  store_name: 'Nash Security',
  store_description: 'فروشگاه تخصصی لایسنس سیستم‌های نظارتی',
  contact_email: 'support@nash-security.com',
  contact_phone: '۰۲۱-۱۲۳۴۵۶۷۸',
  address: 'تهران، خیابان ولیعصر',
  currency: 'IRR',
  timezone: 'Asia/Tehran',
  notification_email: true,
  notification_sms: false,
  license_auto_renew: false,
  max_licenses_per_user: 5,
  trial_duration_days: 7,
  payment_gateway: 'zarinpal',
  maintenance_mode: false,
}

const sections = [
  { id: 'general', label: 'اطلاعات فروشگاه', icon: Store },
  { id: 'notifications', label: 'اعلانات', icon: Bell },
  { id: 'licenses', label: 'تنظیمات لایسنس', icon: Shield },
  { id: 'payment', label: 'پرداخت', icon: CreditCard },
  { id: 'system', label: 'سیستم', icon: Wrench },
]

function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:bg-blue-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:-translate-x-full" />
      </label>
    </div>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('general')

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await settingsApi.get()
        setSettings((prev) => ({ ...prev, ...res.data }))
      } catch {
        // Use defaults
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsApi.patch(settings)
      toast.success('تنظیمات با موفقیت ذخیره شد')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'خطا در ذخیره تنظیمات')
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">تنظیمات</h1>
          <p className="text-slate-400 text-sm mt-1">پیکربندی فروشگاه و سیستم</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>ذخیره تغییرات</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Nav */}
        <div className="lg:col-span-1">
          <div className="card p-2 sticky top-24">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="card space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-blue-400" />
                اطلاعات فروشگاه
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">نام فروشگاه</label>
                  <input
                    type="text"
                    value={settings.store_name}
                    onChange={(e) => updateSetting('store_name', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ایمیل تماس</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => updateSetting('contact_email', e.target.value)}
                      className="input-field pr-11"
                      dir="ltr"
                      style={{ textAlign: 'left' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">تلفن تماس</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={settings.contact_phone}
                      onChange={(e) => updateSetting('contact_phone', e.target.value)}
                      className="input-field pr-11"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">واحد پول</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => updateSetting('currency', e.target.value)}
                    className="input-field"
                  >
                    <option value="IRR">تومان (IRR)</option>
                    <option value="USD">دلار (USD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">توضیحات فروشگاه</label>
                <textarea
                  value={settings.store_description}
                  onChange={(e) => updateSetting('store_description', e.target.value)}
                  className="input-field min-h-[100px] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">آدرس</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-4 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => updateSetting('address', e.target.value)}
                    className="input-field pr-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">منطقه زمانی</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  className="input-field"
                >
                  <option value="Asia/Tehran">تهران (UTC+3:30)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className="card space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                تنظیمات اعلانات
              </h3>

              <div className="space-y-4">
                <SettingToggle
                  label="اعلان ایمیلی"
                  description="ارسال اعلان سفارشات و لایسنس‌ها به ایمیل"
                  checked={settings.notification_email}
                  onChange={(val) => updateSetting('notification_email', val)}
                />
                <SettingToggle
                  label="اعلان پیامکی"
                  description="ارسال پیامک برای رویدادهای مهم"
                  checked={settings.notification_sms}
                  onChange={(val) => updateSetting('notification_sms', val)}
                />
              </div>
            </div>
          )}

          {/* License Settings */}
          {activeSection === 'licenses' && (
            <div className="card space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                تنظیمات لایسنس
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">حداکثر لایسنس هر کاربر</label>
                  <input
                    type="number"
                    value={settings.max_licenses_per_user}
                    onChange={(e) => updateSetting('max_licenses_per_user', Number(e.target.value))}
                    className="input-field"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">مدت لایسنس آزمایشی (روز)</label>
                  <input
                    type="number"
                    value={settings.trial_duration_days}
                    onChange={(e) => updateSetting('trial_duration_days', Number(e.target.value))}
                    className="input-field"
                    min="1"
                    max="30"
                  />
                </div>
              </div>

              <SettingToggle
                label="تمدید خودکار لایسنس"
                description="تمدید خودکار لایسنس قبل از انقضا"
                checked={settings.license_auto_renew}
                onChange={(val) => updateSetting('license_auto_renew', val)}
              />
            </div>
          )}

          {/* Payment Settings */}
          {activeSection === 'payment' && (
            <div className="card space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                تنظیمات پرداخت
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">درگاه پرداخت</label>
                <select
                  value={settings.payment_gateway}
                  onChange={(e) => updateSetting('payment_gateway', e.target.value)}
                  className="input-field"
                >
                  <option value="zarinpal">زرین‌پال</option>
                  <option value="idpay">آیدی‌پی</option>
                  <option value="nextpay">نکست‌پی</option>
                  <option value="mellat">به‌پرداخت ملت</option>
                </select>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeSection === 'system' && (
            <div className="card space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                تنظیمات سیستم
              </h3>

              <SettingToggle
                label="حالت تعمیر و نگهداری"
                description="غیرفعال کردن موقت فروشگاه برای به‌روزرسانی"
                checked={settings.maintenance_mode}
                onChange={(val) => updateSetting('maintenance_mode', val)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
