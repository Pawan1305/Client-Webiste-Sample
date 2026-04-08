import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext()

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('vc_admin_token')
      const storedAdmin = localStorage.getItem('vc_admin')
      if (storedToken && storedAdmin) {
        setToken(storedToken)
        setAdmin(JSON.parse(storedAdmin))
      }
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  const login = (adminData, authToken) => {
    setAdmin(adminData)
    setToken(authToken)
    localStorage.setItem('vc_admin', JSON.stringify(adminData))
    localStorage.setItem('vc_admin_token', authToken)
  }

  const logout = () => {
    setAdmin(null)
    setToken(null)
    localStorage.removeItem('vc_admin')
    localStorage.removeItem('vc_admin_token')
  }

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout, loading, isAuthenticated: !!admin && !!token }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
