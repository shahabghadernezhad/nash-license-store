import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, ArrowRight, Star, Clock, Package, Truck, Lock, Eye, ChevronRight, Play, MapPin, Phone, Mail } from 'lucide-react'

const heroFeatures = [
  { icon: Shield, title: 'امنیت ۱۰۰٪', desc: 'رمزگذاری AES-256' },
  { icon: Clock, title: '۲۴ ساعته', desc: 'ضبط مداوم' },
  { icon: Package, title: 'سخت‌افزار حرفه‌ای', desc: 'کیفیت بالا' },
  { icon: Truck, title: 'ارسال رایگان', desc: 'به سراسر ایران' },
]

const plans = [
  { name: 'پکیج ۱ دوربین', price: '۸۵۰,۰۰۰', desc: 'مناسب منازل کوچک', features: ['۱ دوربین HD', 'شب شناسایی حرکت', 'ذخیره‌سازی محلی'], color: 'blue' },
  { name: 'پکیج ۴ دوربین', price: '۲,۵۰۰,۰۰۰', desc: 'مناسب مغازه و دفتر', features: ['۴ دوربین', 'تشخیص چهره', 'ذخیره‌سازی ابری'], popular: true, color: 'purple' },
  { name: 'پکیج ۸ دوربین', price: '۴,۲۰۰,۰۰۰', desc: 'مناسب شرکت و کارخانه', features: ['۸ دوربین', 'خوانش پلاک', 'تحلیل هوشمند'], color: 'green' },
  { name: 'Enterprise', price: '۱۸,۰۰۰,۰۰۰', desc: 'رایگان نصب و پشتیبانی', features: ['نامحدود دوربین', 'پشتیبانی ۲۴/۷', 'مدیریت چند سایت'], color: 'yellow' },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">Nash Security</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">وبلاگ</Link>
          <Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">درباره ما</Link>
          {isAuthenticated ? (
            <Link to="/admin" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors">پنل ادمین</Link>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors">ورود</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-600/20 via-transparent to-transparent" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-xs">نرم‌افزار امنیتی هوشمند</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              سیستم امنیتی
              <span className="bg-gradient-to-l from-blue-400 to-cyan-400 bg-clip-text text-transparent"> هوشمند</span>
              <br />با هوش مصنوعی
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              دوربین‌های هوشمند مادرن با تشخیص چهره، تحلیل رفتار و اعلان فوری.
              <br />امنیت واقعی برای خانه و کسب‌وکار شما.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/#plans" className="bg-blue-600 hover:bg-blue-700 px-8 py-3.5 rounded-xl font-medium transition-colors flex items-center gap-2">
                شروع با پکیج
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/989120000000" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 px-8 py-3.5 rounded-xl font-medium transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                تماس با ما
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {heroFeatures.map((f, i) => (
            <div key={i} className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 text-center hover:border-blue-500/30 transition-all">
              <f.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-slate-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      <section id="plans" className="bg-slate-900/50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">پلن‌های لایسنس</h2>
            <p className="text-slate-400">پکیج مناسب شما را انتخاب کنید</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`bg-slate-800/50 border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] ${
                plan.popular ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-slate-700/50 hover:border-slate-600'
              }`}>
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full inline-block mb-3">پرفروش‌ترین</div>
                )}
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.desc}</p>
                <div className="mb-5">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-slate-400 text-sm"> تومان</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}>
                  خرید لایسنس
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">چطور کار می‌کنه؟</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '۱', title: 'انتخاب پکیج', desc: 'پلن مناسب نیاز خود را انتخاب کنید.', icon: Package },
            { step: '۲', title: 'پرداخت آنلاین', desc: 'با زرین‌پال یا کارت به کارت پرداخت کنید.', icon: Lock },
            { step: '۳', title: 'دریافت لایسنس', desc: 'لایسنس خود را دریافت کنید و نصب کنید.', icon: Star },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-blue-500/30 mb-2">{item.step}</div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">آماده شروع هستید؟</h2>
          <p className="text-slate-400 mb-8">همین الان سیستم امنیتی هوشمند خود را فعال کنید</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-medium transition-colors">
              ورود به پنل
            </Link>
            <a href="tel:+989120000000" className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-medium transition-colors">
              تماس تلفنی
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-bold">Nash Security</span>
              </div>
              <p className="text-slate-500 text-sm">سیستم امنیتی هوشمند با هوش مصنوعی</p>
            </div>
            <div>
              <h4 className="font-bold mb-3">لینک‌ها</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/" className="hover:text-white">خانه</Link></li>
                <li><Link to="/blog" className="hover:text-white">وبلاگ</Link></li>
                <li><Link to="/about" className="hover:text-white">درباره ما</Link></li>
                <li><a href="mailto:info@nash-security.com" className="hover:text-white">ایمیل</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">تماس</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2"><Phone size={14} /> +98 912 000 0000</li>
                <li className="flex items-center gap-2"><Mail size={14} /> info@nash-security.com</li>
                <li className="flex items-center gap-2"><MapPin size={14} /> تهران، ایران</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">رمز پیش‌فرض</h4>
              <p className="text-sm text-slate-400">ایمیل: <strong className="text-slate-300">admin@nash-security.com</strong></p>
              <p className="text-sm text-slate-400">رمز: <strong className="text-slate-300">admin12345</strong></p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center">
            <p className="text-slate-600 text-xs">© 2025 Nash Security — تمامی حقوق محفوظ است</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
