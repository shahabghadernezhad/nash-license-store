import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, ArrowRight, Star, Clock, Package, Truck, Lock, Eye, ChevronRight, Play, MapPin, Phone, Mail, Zap, Brain, Camera, Bell, ShieldCheck, Cpu, Wifi, Database, Users, TrendingUp, Sparkles, ChevronDown } from 'lucide-react'

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'animate-on-scroll visible' : 'animate-on-scroll'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

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

const aiFeatures = [
  { icon: Brain, title: 'تشخیص چهره', desc: 'شناسایی خودکار افراد با دقت ۹۹٪', color: 'blue' },
  { icon: Eye, title: 'تحلیل رفتار', desc: 'تشخیص حرکات مشکوک و غیرعادی', color: 'purple' },
  { icon: Bell, title: 'اعلان فوری', desc: 'اخطار لحظه‌ای در فروشگاه و موبایل', color: 'green' },
  { icon: Cpu, title: 'پردازش Edge', desc: 'تحلیل تصویر بدون اینترنت', color: 'cyan' },
  { icon: Database, title: 'ذخیره ابری', desc: 'ذخیره امن تصاویر در فضای ابری', color: 'yellow' },
  { icon: Wifi, title: 'اتصال ۵G', desc: 'انتقال تصویر با کمترین تأخیر', color: 'pink' },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* ====== NAVBAR ====== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-slate-800/50' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nash Security</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">خانه</Link>
            <Link to="/features" className="nav-link">ویژگی‌ها</Link>
            <Link to="/pricing" className="nav-link">قیمت‌ها</Link>
            <Link to="/blog" className="nav-link">وبلاگ</Link>
            <Link to="/about" className="nav-link">درباره ما</Link>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/admin" className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all">پنل ادمین</Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all">ورود</Link>
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all sm:hidden">ورود</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <section className="hero relative pt-32 pb-20">
        <div className="hero-grid" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-blue-400 text-sm font-vazir">نسخه جدید ۲۰۲۵ منتشر شد</span>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                  سیستم امنیتی
                  <br />
                  <span className="bg-gradient-to-l from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">هوشمند با AI</span>
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg">
                  دوربین‌های هوشمند مادرن با تشخیص چهره، تحلیل رفتار و اعلان فوری.
                  <br />امنیت واقعی برای خانه و کسب‌وکار شما.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="flex items-center gap-4 flex-wrap">
                  <Link to="/#plans" className="btn-primary group">
                    شروع با پکیج
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="https://wa.me/989120000000" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <Phone className="w-4 h-4" />
                    تماس تلفنی
                  </a>
                </div>
              </AnimatedSection>

              {/* Trust badges */}
              <AnimatedSection delay={500} className="flex items-center gap-8 mt-12 pt-8 border-t border-slate-800/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">+500</div>
                  <div className="text-xs text-slate-500">مشتری راضی</div>
                </div>
                <div className="w-px h-10 bg-slate-800" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">99%</div>
                  <div className="text-xs text-slate-500">دقت تشخیص</div>
                </div>
                <div className="w-px h-10 bg-slate-800" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">3</div>
                  <div className="text-xs text-slate-500">سال تجربه</div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right - Visual */}
            <AnimatedSection delay={200}>
              <div className="relative hidden lg:block">
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Outer ring */}
                  <div className="absolute inset-0 border border-slate-800/50 rounded-3xl rotate-45" />
                  {/* Inner glow */}
                  <div className="absolute inset-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl" />
                  {/* Center card */}
                  <div className="absolute inset-16 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl flex flex-col items-center justify-center gap-4 p-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/25">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-sm text-slate-400 text-center">Nash Security AI</p>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                    </div>
                  </div>
                  {/* Floating cards */}
                  <div className="absolute -top-4 -right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 animate-float">
                    <Camera className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 animate-float" style={{ animationDelay: '-2s' }}>
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="absolute top-1/2 -right-8 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 animate-float" style={{ animationDelay: '-4s' }}>
                    <Bell className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ====== VIDEO SECTION ====== */}
      <section className="video-section py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">دوربین هوشمند Nash-Cam Pro</h2>
              <p className="text-slate-400 text-lg">یک نگاه کافیه تا بفهمید چقدر قدرتمند است</p>
            </div>
          </AnimatedSection>

          <div className="video-wrapper max-w-5xl mx-auto">
            <div className="video-placeholder">
              <div className="relative z-10">
                <div className="play-btn">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
                <p className="text-slate-400 text-sm mt-6 text-center z-10 relative">فیلم معرفی دوربین Nash-Cam Pro</p>
              </div>
              <div className="video-stats z-10 relative">
                <div className="video-stat">
                  <div className="video-stat-number">4K</div>
                  <div className="video-stat-label">کیفیت تصویر</div>
                </div>
                <div className="video-stat">
                  <div className="video-stat-number">AI</div>
                  <div className="video-stat-label">تشخیص هوشمند</div>
                </div>
                <div className="video-stat">
                  <div className="video-stat-number">NIGHT</div>
                  <div className="video-stat-label">بین النوری</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== AI FEATURES ====== */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">قابلیت‌های هوش مصنوعی</h2>
              <p className="text-slate-400 text-lg">فناوری‌های پیشرفته برای حفاظت عمیق‌تر</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiFeatures.map((f, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="feature-card group" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`feature-icon ${f.color} mb-5`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section id="plans" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold mb-3">پلن‌های لایسنس</h2>
              <p className="text-slate-400 text-lg">پکیج مناسب نیاز خود را انتخاب کنید</p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && <div className="popular-badge">پرفروش‌ترین</div>}
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-5">{plan.desc}</p>
                  <div className="mb-5">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-slate-400 text-sm"> تومان/سال</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/login" className={`block text-center py-3 rounded-xl text-sm font-medium transition-all ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
                    خرید لایسنس
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">نحوه کار</h2>
              <p className="text-slate-400 text-lg">سه مرحله ساده... تمام!</p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-24 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

            {[
              { step: '۱', title: 'انتخاب پکیج', desc: 'پلن مناسب نیاز خود را انتخاب کنید.', icon: Package },
              { step: '۲', title: 'پرداخت آنلاین', desc: 'با زرین‌پال یا کارت به کارت پرداخت کنید.', icon: Lock },
              { step: '۳', title: 'دریافت لایسنس', desc: 'لایسنس خود را دریافت کنید و فعال کنید.', icon: Star },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="step-card">
                  <div className="step-number">{item.step}</div>
                  <item.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="cta-section py-24">
        <div className="max-w-4xl mx-auto px-6 relative">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/10 border border-blue-500/20 rounded-3xl p-12 md:p-16 text-center backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-4">آماده شروع هستید؟</h2>
              <p className="text-slate-400 text-lg mb-10">همین الان سیستم امنیتی هوشمند خود را فعال کنید</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/login" className="btn-primary text-lg px-10 py-4">
                  شروع همین الان
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="https://wa.me/989120000000" target="_blank" rel="noopener noreferrer" className="btn-secondary text-lg px-10 py-4">
                  <Phone className="w-5 h-5" />
                  مشاوره رایگان
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-slate-800/50 py-16 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-lg">Nash Security</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">سیستم امنیتی نوین با هوش مصنوعی برای آینده‌ای امن‌تر.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">لینک‌ها</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/" className="hover:text-white transition-colors">خانه</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">وبلاگ</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">درباره ما</Link></li>
                <li><a href="mailto:info@nash-security.com" className="hover:text-white transition-colors">ایمیل</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">تماس</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Phone className="w-3 h-3 inline mr-2" /> +98 912 000 0000</li>
                <li><Mail className="w-3 h-3 inline mr-2" /> info@nash-security.com</li>
                <li><MapPin className="w-3 h-3 inline mr-2" /> تهران، ایران</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">پشتیبانی</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="text-slate-500">ایمیل: <strong className="text-slate-300">admin@nash-security.com</strong></li>
                <li className="text-slate-500">رمز: <strong className="text-slate-300">admin12345</strong></li>
                <li className="text-slate-500 mt-3">ساعات پشتیبانی: ۲۴/۷</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© 2025 Nash Security — تمامی حقوق محفوظ است</p>
            <div className="flex items-center gap-4 text-slate-600 text-xs">
              <a href="#" className="hover:text-white transition-colors">حریم خصوصی</a>
              <a href="#" className="hover:text-white transition-colors">قوانین</a>
              <a href="#" className="hover:text-white transition-colors">تماس با ما</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <a href="#top" className="fixed bottom-8 left-8 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all opacity-0 pointer-events-none z-40" id="scrollTopBtn">
        <ChevronDown className="w-5 h-5 rotate-180" />
      </a>
    </div>
  )
}
