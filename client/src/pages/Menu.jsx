import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchItems } from '../utils/api'
import FoodCard from '../components/FoodCard'
import { FiSearch, FiX } from 'react-icons/fi'
import { GiImperialCrown } from 'react-icons/gi'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts', 'Specials']

const CATEGORY_ICONS = {
  All: '🍽️', Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙',
  Snacks: '🍿', Beverages: '☕', Desserts: '🍮', Specials: '👑',
}

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const activeCategory = searchParams.get('category') || 'All'

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350)
    return () => clearTimeout(t)
  }, [search])

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (activeCategory !== 'All') params.category = activeCategory
      if (debouncedSearch) params.search = debouncedSearch
      const res = await fetchItems(params)
      setItems(res.data.items)
    } catch {
      setError('Failed to load items. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [activeCategory, debouncedSearch])

  useEffect(() => { loadItems() }, [loadItems])

  const setCategory = (cat) => {
    const p = new URLSearchParams(searchParams)
    if (cat === 'All') p.delete('category')
    else p.set('category', cat)
    setSearchParams(p)
  }

  return (
    <div className="page-wrapper min-h-screen pt-20">

      {/* ── Header ── */}
      <div className="relative py-16 px-5 text-center border-b border-gold-500/10">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-800 to-dark-900" />
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs tracking-[0.3em] uppercase text-gold-500 font-sans mb-3"
          >
            ♛ &nbsp; Crafted with Love &nbsp; ♛
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-royal text-5xl lg:text-6xl text-cream-100 mb-2"
          >
            Our Royal <span className="shimmer-text">Menu</span>
          </motion.h1>
          <div className="gold-divider mt-5 mb-5" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-cream-400 text-sm font-sans max-w-md mx-auto"
          >
            {items.length} dishes available — {activeCategory !== 'All' ? activeCategory : 'All Categories'}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">

        {/* ── Search + Filter row ── */}
        <div className="flex flex-col lg:flex-row gap-5 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500" size={17} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes…"
              className="premium-input w-full pl-11 pr-10 py-3 rounded-xl text-sm font-sans"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-500 hover:text-cream-100">
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.94 }}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-sans tracking-wide transition-all ${
                  activeCategory === cat
                    ? 'btn-gold shadow-gold'
                    : 'btn-outline-gold'
                }`}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* ── Items grid ── */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-gold-500/20 border-t-gold-500 animate-spin" />
              <GiImperialCrown className="text-gold-500 text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 font-sans text-sm mb-4">{error}</p>
            <button onClick={loadItems} className="btn-gold px-6 py-2.5 rounded-xl text-sm">Try Again</button>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="font-elegant text-cream-200 text-2xl mb-2">No dishes found</h3>
            <p className="text-cream-500 text-sm font-sans">Try a different category or search term</p>
          </motion.div>
        ) : (
          <motion.div
            key={`${activeCategory}-${debouncedSearch}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <FoodCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Menu
