import { Link } from 'react-router-dom'
import { Shield, Camera, Lock, Eye, CheckCircle, ArrowLeft, Star, Zap, Globe } from 'lucide-react'

const features = [
  { icon: Camera, title: 'تشخیص چهره', desc: 'شناسایی خودکار افراد با دقت ۹۹٪', color: 'blue' },
  { icon: Eye, title: 'تحلیل ویدیو', desc: 'تشخیص حرکت و رفتار مشکوک', color: 'purple' },
  { icon: Lock, title: 'امنیت بالا', desc: 'رمزگذاری AES-256 و ذخیره‌سازی امن', color: 'green' },
  { icon: Zap, title: 'اعلان فوری', desc: 'اطلاع‌رسانی لحظه‌ای در موبایل', color: 'yellow' },
  { icon: Globe, title: 'دسترسی از هر جا', desc: 'مشاهده تصاویر از هر دستگاه', color: 'cyan' },
  { icon: Star, title: 'پشتیبانی ۲۴/۷', desc: 'پشتیبانی تخصصی در تمام ساعات', color: 'pink' },
]

const plans = [
  { name: 'تک دوربین', price: '۸۵۰,۰۰۰', features: ['۱ دوربین', 'تشخیص حرکت', 'ضبط ۲۴ ساعته'], color: 'blue' },
  { name: '۴ دوربین', price: '۲,۵۰۰,۰۰۰', features: ['۴ دوربین', 'تشخیص چهره', 'تحلیل هوشمند'], popular: true, color: 'purple' },
  { name: '۸ دوربین', price: '۴,۲۰۰,۰۰۰', features: ['۸ دوربین', 'خوانش پلاک', 'تحلیل رفتار'], color: 'green' },
  { name: 'Enterprise', price: '۱۸,۰۰۰,۰۰۰', features: ['نامحدود', 'پشتیبانی ۲۴/۷', 'نصب رایگان'], color: 'yellow' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-20">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Nash Security</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">
                وبلاگ
              </Link>
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">
                درباره ما
              </Link>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                ورود
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-xs">نسخه جدید ۲۰۲۵ منتشر شد</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              سیستم امنیتی
              <span className="bg-gradient-to-l from-blue-400 to-cyan-400 bg-clip-text text-transparent"> هوشمند</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              با پیشرفته‌ترین فناوری هوش مصنوعی، محیط خود را زیر نظر بگیرید.
              <br />
              تشخیص چهره، تحلیل رفتار و اعلان فوری — همه در یک پلتفرم.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
                شروع رایگان
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link to="/about" className="border border-slate-700 hover:border-slate-500 px-8 py-3 rounded-xl font-medium transition-colors">
                بیشتر بدانید
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">چرا Nash Security؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300">
              <f.icon className={`w-10 h-10 text-${f.color}-400 mb-4`} />
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">پلن‌های قیمت‌گذاری</h2>
        <p className="text-slate-400 text-center mb-12">بهترین پلن را بر اساس نیاز خود انتخاب کنید</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`bg-slate-800/50 border rounded-2xl p-6 transition-all duration-300 ${
              plan.popular ? 'border-blue-500 shadow-xl shadow-blue-500/10 scale-105' : 'border-slate-700/50 hover:border-slate-600'
            }`}>
              {plan.popular && (
                <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full inline-block mb-3">
                  محبوب‌ترین
                </div>
              )}
              <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-slate-400 text-sm"> تومان/سال</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/login" className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}>
                خرید
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="font-bold">Nash Security</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link to="/about" className="hover:text-white transition-colors">درباره ما</Link>
            <Link to="/blog" className="hover:text-white transition-colors">وبلاگ</Link>
            <Link to="/login" className="hover:text-white transition-colors">ورود</Link>
          </div>
          <p className="text-slate-500 text-xs">© 2025 Nash Security</p>
        </div>
      </footer>
    </div>
  )
}
