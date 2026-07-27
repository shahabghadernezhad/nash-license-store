import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

// Demo credentials for GitHub Pages
const DEMO_USER = { username: 'admin', email: 'admin@nash-security.com', is_superuser: true, roles: ['admin'] }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing token on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nash_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem('nash_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    // Demo mode: accept admin/admin12345
    if (username === 'admin' && password === 'admin12345') {
      const userData = { ...DEMO_USER, username }
      localStorage.setItem('nash_token', 'demo-token-12345')
      localStorage.setItem('nash_user', JSON.stringify(userData))
      setUser(userData)
      setIsAuthenticated(true)
      return true
    }

    // Try real API (when backend is available)
    try {
      const res = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('nash_token', data.access)
        localStorage.setItem('nash_user', JSON.stringify(data.user || { username }))
        setUser(data.user || { username })
        setIsAuthenticated(true)
        return true
      }
    } catch {
      // No backend available
    }

    return false
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('nash_token')
    localStorage.removeItem('nash_user')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
