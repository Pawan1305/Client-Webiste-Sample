import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchItems } from '../utils/api'
import FoodCard from '../components/FoodCard'
import { GiImperialCrown } from 'react-icons/gi'
import {
  FiArrowRight, FiClock, FiTruck, FiAward, FiShield
} from 'react-icons/fi'

const CATEGORY_ICONS = {
  Breakfast: '🌅',
  Lunch: '☀️',
  Dinner: '🌙',
  Snacks: '🍿',
  Beverages: '☕',
  Desserts: '🍮',
  Specials: '👑',
}

const FEATURES = [
  { icon: FiClock, label: 'Fast Delivery', desc: 'Ready in 20–30 mins' },
  { icon: FiAward, label: 'Premium Quality', desc: 'Hand-picked ingredients' },
  { icon: FiTruck, label: 'Freshly Made', desc: 'Cooked to order' },
  { icon: FiShield, label: 'Hygienic', desc: 'FSSAI certified kitchen' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
})

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchItems({ featured: true }).then(r => setFeatured(r.data.items.slice(0, 6))).catch(() => {})
    fetchItems({}).then(r => {
      const cats = [...new Set(r.data.items.map(i => i.category))]
      setCategories(cats)
    }).catch(() => {})
  }, [])

  return (
    <div className="page-wrapper">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=80')`,
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/70 to-dark-900/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/60" />

        {/* Gold particle dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold-500/30"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-5">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <span className="royal-badge px-4 py-1.5 rounded-full text-xs font-sans tracking-[0.25em] uppercase"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', color: '#C9A84C' }}>
              ♛ &nbsp; Since 1992 &nbsp; ♛
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-royal text-5xl sm:text-6xl lg:text-8xl font-light mb-4 leading-none"
          >
            <span className="shimmer-text">Royal Dining</span>
            <br />
            <span className="text-cream-100 font-light">Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-cream-300 text-base sm:text-lg font-sans font-light max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Authentic flavours crafted with finesse. From heritage recipes to modern delicacies — every bite is a royal affair.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-gold px-8 py-3.5 rounded-full text-sm tracking-[0.12em] uppercase flex items-center gap-2 shadow-gold-lg"
              >
                Explore Menu <FiArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-outline-gold px-8 py-3.5 rounded-full text-sm tracking-[0.12em] uppercase"
              >
                View Cart
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-cream-500 font-sans">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-10 bg-gradient-to-b from-gold-500/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* ══════════════ MARQUEE STRIP ══════════════ */}
      <div className="border-y border-gold-500/15 py-3 overflow-hidden bg-dark-800">
        <div className="marquee-track">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-8 pr-8">
              {['Biriyani', 'Thali', 'Dosas', 'Curries', 'Sweets', 'Chai', 'Samosas', 'Paneer Dishes', 'Fresh Juices', 'Royal Desserts'].map((item, i) => (
                <React.Fragment key={i}>
                  <span className="text-xs tracking-[0.2em] uppercase text-cream-400 font-sans whitespace-nowrap">{item}</span>
                  <GiImperialCrown className="text-gold-600 text-xs shrink-0" />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-16 px-5 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className="premium-card rounded-2xl p-5 text-center"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))', border: '1px solid rgba(201,168,76,0.3)' }}>
                <Icon className="text-gold-500" size={22} />
              </div>
              <h4 className="font-elegant text-cream-100 font-medium mb-1">{label}</h4>
              <p className="text-xs text-cream-500 font-sans">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      {categories.length > 0 && (
        <section className="py-12 px-5 max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-500 font-sans mb-3">Explore</p>
            <h2 className="font-royal text-4xl lg:text-5xl text-cream-100">Our Categories</h2>
            <div className="gold-divider mt-4" />
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat} {...fadeUp(i * 0.07)}>
                <Link to={`/menu?category=${cat}`}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="premium-card rounded-2xl p-5 text-center cursor-pointer"
                  >
                    <div className="text-4xl mb-3">{CATEGORY_ICONS[cat] || '🍽️'}</div>
                    <p className="font-elegant text-cream-200 font-medium">{cat}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════ FEATURED ITEMS ══════════════ */}
      {featured.length > 0 && (
        <section className="py-14 px-5 max-w-6xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-gold-500 font-sans mb-3">Chef's Selection</p>
            <h2 className="font-royal text-4xl lg:text-5xl text-cream-100">Featured Dishes</h2>
            <div className="gold-divider mt-4" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(item => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
          <motion.div {...fadeUp(0.2)} className="text-center mt-10">
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn-gold px-10 py-3.5 rounded-full text-sm tracking-[0.12em] uppercase flex items-center gap-2 mx-auto shadow-gold"
              >
                View Full Menu <FiArrowRight size={16} />
              </motion.button>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ══════════════ ABOUT STRIP ══════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80')` }}
        />
        <div className="absolute inset-0 bg-dark-900/85" />
        <div className="relative z-10 max-w-2xl mx-auto text-center px-5">
          <motion.div {...fadeUp()}>
            <GiImperialCrown className="text-gold-500 text-5xl mx-auto mb-5" />
            <h2 className="font-royal text-4xl lg:text-5xl text-cream-100 mb-5">
              A Legacy of <span className="shimmer-text">Royal Taste</span>
            </h2>
            <p className="text-cream-400 font-sans leading-relaxed text-sm">
              Vijay Canteen has been serving authentic Indian cuisine for over three decades.
              Our kitchen breathes tradition — each recipe passed down through generations,
              prepared fresh daily with handpicked ingredients and soul.
            </p>
            <div className="flex justify-center gap-10 mt-8">
              {[['30+', 'Years'], ['500+', 'Dishes'], ['1000+', 'Daily Orders']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <p className="font-royal text-3xl shimmer-text">{num}</p>
                  <p className="text-xs text-cream-500 tracking-widest uppercase font-sans mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-16 px-5 max-w-3xl mx-auto text-center">
        <motion.div {...fadeUp()}>
          <h2 className="font-royal text-4xl text-cream-100 mb-3">Ready to Order?</h2>
          <p className="text-cream-400 font-sans text-sm mb-8">Fresh food, royal taste, delivered to your doorstep.</p>
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-gold px-12 py-4 rounded-full text-sm tracking-[0.15em] uppercase shadow-gold-lg"
            >
              Order Now ♛
            </motion.button>
          </Link>
        </motion.div>
      </section>

    </div>
  )
}

export default Home
