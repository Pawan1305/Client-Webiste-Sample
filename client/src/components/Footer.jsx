import React from 'react'
import { Link } from 'react-router-dom'
import { GiImperialCrown } from 'react-icons/gi'
import { FiInstagram, FiTwitter, FiFacebook, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-gold-500/15 bg-dark-800">
      {/* Top gold line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <GiImperialCrown className="text-gold-500 text-3xl" />
              <div className="leading-none">
                <span className="font-royal text-2xl tracking-[0.2em] font-semibold"
                  style={{ background: 'linear-gradient(135deg,#C9A84C,#FFD700,#C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  VIJAY
                </span>
                <span className="font-royal text-2xl tracking-[0.2em] text-cream-100 font-light ml-2">
                  CANTEEN
                </span>
              </div>
            </div>
            <p className="text-sm text-cream-400 leading-relaxed max-w-xs">
              Experience the royal flavors of India. Crafted with passion, served with elegance. Every dish is a celebration of culinary heritage.
            </p>
            <div className="flex gap-3 mt-5">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -2, scale: 1.1 }}
                  className="w-9 h-9 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-500 hover:bg-gold-500/10 transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-elegant text-gold-500 text-lg mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Our Menu' },
                { to: '/cart', label: 'Cart' },
                { to: '/checkout', label: 'Checkout' },
                { to: '/admin/login', label: 'Admin Panel' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-cream-400 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gold-500/50 rounded-full group-hover:bg-gold-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-elegant text-gold-500 text-lg mb-4 tracking-wide">Contact Us</h3>
            <ul className="space-y-3">
              {[
                { Icon: FiPhone, text: '+91 98765 43210' },
                { Icon: FiMail, text: 'vijaycanteen@gmail.com' },
                { Icon: FiMapPin, text: 'Shop No. 5, Main Market, City Center' },
              ].map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-cream-400">
                  <Icon className="text-gold-500 mt-0.5 flex-shrink-0" size={15} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gold-500/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream-500 tracking-wide">
            &copy; {year} Vijay Canteen. All rights reserved.
          </p>
          <p className="text-xs text-cream-500 tracking-wide ornament">
            <span className="text-gold-600">Made with ♛ for royal dining</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
