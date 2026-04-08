import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { adminLogin } from '../../utils/api'
import toast from 'react-hot-toast'
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { GiImperialCrown } from 'react-icons/gi'

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.username || !form.password) return toast.error('Enter credentials')
    setLoading(true)
    try {
      const res = await adminLogin(form)
      login(res.data.admin, res.data.token)
      toast.success(`Welcome, ${res.data.admin.username}!`, {
        style: { background: '#111', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.35)' },
      })
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center overflow-hidden relative px-5">

      {/* Gold particle bg */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold-500/15"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-radial from-gold-900/10 via-transparent to-transparent"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 60%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="premium-card rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">

          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <GiImperialCrown className="text-gold-500 text-5xl mx-auto mb-3" />
            </motion.div>
            <h1 className="font-royal text-3xl text-cream-100">Admin Portal</h1>
            <p className="text-xs text-cream-500 font-sans tracking-[0.2em] uppercase mt-1">Vijay Canteen</p>
            <div className="gold-divider mt-4" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-cream-500 font-sans mb-1.5 tracking-wide">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/60" size={15} />
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="admin"
                  autoComplete="username"
                  className="premium-input w-full pl-10 pr-4 py-3.5 rounded-xl text-sm font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-cream-500 font-sans mb-1.5 tracking-wide">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/60" size={15} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="premium-input w-full pl-10 pr-12 py-3.5 rounded-xl text-sm font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-500 hover:text-gold-400 transition-colors"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className={`w-full py-4 rounded-xl text-sm tracking-[0.15em] uppercase font-bold flex items-center justify-center gap-2 mt-2 ${
                loading ? 'opacity-60 cursor-not-allowed bg-gold-700 text-dark-900' : 'btn-gold shadow-gold'
              }`}
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" /> Signing in…</>
              ) : (
                'Sign In ♛'
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-cream-600 font-sans mt-6">
            Default: <span className="text-gold-600 font-mono">admin</span> / <span className="text-gold-600 font-mono">VijayCanteen@2024</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
