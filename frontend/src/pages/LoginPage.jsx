import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@nash-security.com')
  const [password, setPassword] = useState('admin12345')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        navigate('/', { replace: true })
      } else {
        setError('ایمیل یا رمز عبور اشتباه است')
      }
    } catch {
      setError('خطا در اتصال به سرور')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="text-slate-400 hover:text-white text-sm mb-6 inline-flex items-center gap-1">
          ← بازگشت به خانه
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Nash Security</h1>
          <p className="text-slate-400 text-sm">پنل مدیریت فروشگاه لایسنس</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">ورود به حساب</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <p className="text-red-400 text-sm text-center">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="admin@nash-security.com"
                required
                autoComplete="email"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors pl-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
              <p className="text-blue-400 text-xs text-center">🔑 اطلاعات ورود:</p>
              <p className="text-blue-300 text-xs text-center mt-1">ایمیل: <strong>admin@nash-security.com</strong></p>
              <p className="text-blue-300 text-xs text-center">رمز: <strong>admin12345</strong></p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>در حال ورود...</span>
                </>
              ) : (
                <span>ورود</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">© 2025 Nash Security</p>
      </div>
    </div>
  )
}
