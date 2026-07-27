import { Link } from 'react-router-dom'
import { Shield, Users, Award, Heart, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">Nash Security</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">خانه</Link>
          <Link to="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">وبلاگ</Link>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">ورود</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          درباره <span className="bg-gradient-to-l from-blue-400 to-cyan-400 bg-clip-text text-transparent">Nash Security</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          ما تیمی از متخصصان امنیت و هوش مصنوعی هستیم که با هدف محافظت از خانه‌ها و کسب‌وکارها،
          پیشرفته‌ترین سیستم‌های نظارتی را توسعه می‌دهیم.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, number: '+۵۰۰', label: 'مشتری راضی' },
            { icon: Award, number: '۳ سال', label: 'تجربه' },
            { icon: Shield, number: '۹۹٪', label: 'دقت تشخیص' },
            { icon: Heart, number: '۲۴/۷', label: 'پشتیبانی' },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 text-center">
              <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">{stat.number}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">ماموریت ما</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/30 rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-4 text-blue-400">🎯 چشم‌انداز</h3>
            <p className="text-slate-300 leading-relaxed">
              تبدیل شدن به پیشروترین ارائه‌دهنده سیستم‌های امنیتی هوشمند در خاورمیانه
              با تکیه بر فناوری‌های نوین هوش مصنوعی.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-4 text-green-400">💪 ارزش‌ها</h3>
            <p className="text-slate-300 leading-relaxed">
              کیفیت بالا، پشتیبانی بی‌وقفه، حریم خصوصی مشتریان و نوآوری مداوم
              ستون‌های اصلی کار ما هستند.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-8 text-center">تماس با ما</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 rounded-2xl p-6 text-center">
            <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">ایمیل</h3>
            <p className="text-slate-400 text-sm">info@nash-security.com</p>
          </div>
          <div className="bg-slate-800/30 rounded-2xl p-6 text-center">
            <Phone className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">تلفن</h3>
            <p className="text-slate-400 text-sm" dir="ltr">+98 912 000 0000</p>
          </div>
          <div className="bg-slate-800/30 rounded-2xl p-6 text-center">
            <MapPin className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h3 className="font-bold mb-2">آدرس</h3>
            <p className="text-slate-400 text-sm">تهران، ایران</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">آماده شروع هستید؟</h2>
          <p className="text-slate-400 mb-8">همین الان سیستم امنیتی هوشمند خود را فعال کنید</p>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-2">
            شروع کنید
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">© 2025 Nash Security — تمامی حقوق محفوظ است</p>
        </div>
      </footer>
    </div>
  )
}
