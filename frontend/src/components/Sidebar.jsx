import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  KeyRound,
  Settings,
  Shield,
  ChevronLeft,
  LogOut,
  BookOpen,
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/products', label: 'محصولات', icon: Package },
  { path: '/orders', label: 'سفارشات', icon: ShoppingCart },
  { path: '/licenses', label: 'لایسنس‌ها', icon: KeyRound },
  { path: '/blog-admin', label: 'وبلاگ', icon: BookOpen },
  { path: '/settings', label: 'تنظیمات', icon: Settings },
]

export default function Sidebar({ isOpen, onToggle }) {
  const { logout, user } = useAuth()
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen z-50 transition-all duration-300 flex flex-col
          ${isOpen ? 'w-64 translate-x-0' : 'w-0 translate-x-full lg:w-20 lg:translate-x-0'}
          bg-slate-900 border-l border-slate-700/50`}
      >
        <div className="flex flex-col h-full min-w-[240px] lg:min-w-0 lg:w-20 xl:w-64">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg hidden lg:block xl:block nav-text">
                Nash Security
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-300 hidden lg:block"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span className="font-medium text-sm hidden lg:block xl:block nav-text">
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="mr-auto hidden lg:block xl:block">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-3 border-t border-slate-700/50">
            {/* User info - compact in collapsed sidebar */}
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name?.[0] || 'N'}
              </div>
              <div className="hidden lg:block xl:block nav-text">
                <p className="text-sm font-medium text-slate-200 truncate">{user?.name || 'مدیر'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium hidden lg:block xl:block nav-text">خروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
