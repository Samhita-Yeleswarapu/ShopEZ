import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser, fetchCurrentUser, updateCurrentUser } from '../utils/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'shopez_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  // on first load, if we have a token saved, try to fetch the logged in user
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    fetchCurrentUser()
      .then(data => setUser(data.user))
      .catch(() => {
        // token expired or invalid, clear it out
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email, password) {
    setAuthError('')
    const data = await loginUser({ email, password })
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
    return data.user
  }

  async function register(name, email, password, phone) {
    setAuthError('')
    const data = await registerUser({ name, email, password, phone })
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  async function updateProfile(updates) {
    const data = await updateCurrentUser(updates)
    setUser(data.user)
    return data.user
  }

  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    authError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
