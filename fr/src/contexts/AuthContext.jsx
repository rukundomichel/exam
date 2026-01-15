import React, { createContext, useState, useEffect } from 'react'
import api from '../api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    api.get('/auth/me')
      .then(res => {
        // If successful, set user with role from response
        setUser({ id: res.data.userId, username: res.data.username, role: res.data.role, authenticated: true })
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('logout error', err)
    }
    setUser(null)
  }

  const login = (userData) => {
    setUser({ ...userData, authenticated: true, role: userData.role || 'mechanic' })
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  )
}
