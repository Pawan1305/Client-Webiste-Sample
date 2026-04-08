import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import { GiImperialCrown } from 'react-icons/gi'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { cartCount } = useCart()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-dark border-b border-gold-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.span
              whileHover={{ rotate: 20, scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 260 }}
              className="text-gold-500 text-3xl"
            >
              <GiImperialCrown />
            </motion.span>
            <div className="leading-none">
              <span
                className="font-royal text-xl tracking-[0.2em] font-semibold"
                style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700,#C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                VIJAY
              </span>
              <span className="font-royal text-xl tracking-[0.2em] text-cream-100 font-light ml-2">
                CANTEEN
              </span>
            </div>
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group text-sm font-sans tracking-[0.15em] uppercase text-cream-200 hover:text-gold-400 transition-colors duration-200"
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold-500 transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* ── Cart + Mobile toggle ── */}
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="btn-outline-gold rounded-full px-4 py-2 flex items-center gap-2 text-sm font-sans tracking-wide"
              >
                <FiShoppingCart size={18} />
                <span className="hidden sm:inline">Cart</span>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="absolute -top-2 -right-2 bg-gold-500 text-dark-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-gold"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden text-gold-500 p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass-dark border-t border-gold-500/10"
          >
            <div className="px-5 py-5 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-[0.15em] uppercase py-2 font-sans border-b border-gold-500/10 ${
                    location.pathname === link.path ? 'text-gold-500' : 'text-cream-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
